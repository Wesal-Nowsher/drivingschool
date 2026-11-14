// Student guide: language → payment → process → driving lessons (game). Plain JS, no framework.
import { CONFIG, telNumber } from "./config.js";
import { I18N } from "./data/i18n.js";
import { HUB } from "./data/hub-i18n.js";
import { UI } from "./data/ui-i18n.js";
import { GAME, LESSON_QUESTIONS } from "./data/game-i18n.js";
import { SCENES } from "./data/scenes.js";
import { initTracking, trackContactLinks } from "./track.js";

const F = CONFIG.fees;
const app = document.getElementById("app");
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ---------- routing (URL hash) ----------
const LESSONS = 8, PROCESS_PAGES = 2;
function parseHash(h) {
  const [a, b] = (h || "").replace(/^#\/?/, "").split("/");
  const n = parseInt(b, 10);
  if (a === "process") {
    if (b === "done") return { name: "done" };
    return { name: "step", i: n >= 1 && n <= PROCESS_PAGES ? n - 1 : 0 };
  }
  if (a === "lessons") {
    if (b === "done") return { name: "finish" };
    return { name: "lesson", i: n >= 1 && n <= LESSONS ? n - 1 : 0 };
  }
  return { name: "pay" };
}
function toHash(v) {
  if (v.name === "step") return `#process/${v.i + 1}`;
  if (v.name === "done") return "#process/done";
  if (v.name === "lesson") return `#lessons/${v.i + 1}`;
  if (v.name === "finish") return "#lessons/done";
  return "#payment";
}

// ---------- state ----------
let lang = store.get("lang");
if (!I18N[lang]) lang = null;
let view = parseHash(location.hash);
let game = null; // per-lesson game state

function newGame(i) {
  return { i, phase: "discover", active: null, seen: [], qi: 0, picked: null, right: 0, nonce: 0 };
}
function go(name, i) {
  const v = { name, i }, h = toHash(v);
  if (location.hash !== h) history.pushState(null, "", h);
  view = v;
  render(true);
}
window.addEventListener("popstate", () => { view = parseHash(location.hash); render(true); });

// ---------- scores ----------
const PTS = 10;
const getScores = () => store.get("scores") || {};
const saveScore = (i, v) => { const s = getScores(); s[i] = Math.max(s[i] || 0, v); store.set("scores", s); };
const totalScore = () => Object.values(getScores()).reduce((a, b) => a + b, 0);

// ---------- pieces ----------
const icon = {
  wa: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-1-1.1-1.3-1.7-.1-.2 0-.4.1-.5l.4-.5.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.6.6-.9 1.4-.9 2.2 0 .9.4 1.8 1 2.6 1.1 1.6 2.5 2.9 4.2 3.7.5.2 1 .4 1.4.5.5.2 1.1.2 1.6.1.6-.1 1.4-.6 1.6-1.2.1-.4.1-.8 0-1.1l-.3-.2z"/></svg>',
  call: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>',
  apple: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9zM14 5.6c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg>',
  play: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3.6 2.3c-.2.2-.3.6-.3 1v17.4c0 .4.1.8.3 1l9.7-9.7-9.7-9.7zm10.5 10.5 2.9 2.9-11.6 6.6 8.7-9.5zm0-1.6L5.4 1.7 17 8.3l-2.9 2.9zm4.1-2.2 3.2 1.8c.9.5.9 1.9 0 2.4l-3.2 1.8-3.1-3 3.1-3z"/></svg>',
};

function header(langName) {
  return `<header class="s-header"><div class="s-hin">
    <img class="s-photo" src="${CONFIG.instructorPhoto}" alt="">
    <div class="s-ins" dir="ltr"><div class="s-name">${esc(CONFIG.teacherName)}</div><div class="s-code">Instructor Code ${esc(CONFIG.instructorCode)}</div></div>
    ${langName ? `<button class="s-lang" data-act="lang">${esc(langName)}</button>` : ""}
  </div></header>`;
}

function stepText(text) {
  let out = "", inList = false;
  for (const ln of text.split("\n")) {
    if (ln.startsWith("- ")) { if (!inList) { out += '<ul class="s-bullets">'; inList = true; } out += `<li>${esc(ln.slice(2))}</li>`; }
    else { if (inList) { out += "</ul>"; inList = false; } out += `<p class="s-text">${esc(ln)}</p>`; }
  }
  return out + (inList ? "</ul>" : "");
}

// ---------- screens ----------
function renderLang() {
  return header() + `<div class="s-wrap"><h1 class="s-h1">Choose your language</h1><div class="s-list">
    ${Object.keys(I18N).map((k) => `<button class="s-row" data-act="pick-lang" data-lang="${k}">${esc(I18N[k].name)}</button>`).join("")}
  </div></div>`;
}

function renderBody(T, H, U) {
  const u = T.ui, rtl = T.dir === "rtl";
  const fwd = rtl ? "←" : "→", bwd = rtl ? "→" : "←";
  const nav = (back, next, label) => `<div class="s-nav"><button class="s-btn" data-act="${back}">${bwd} ${esc(u.back)}</button><button class="s-btn s-primary" data-act="${next}">${esc(label || u.next)} ${fwd}</button></div>`;

  if (view.name === "pay") {
    const c = T.costs, cls = F.hours * F.perHour;
    const gov = [[c.eye, F.eyeTest], [c.book, F.learningBook], [c.exam, F.examAppointment], [c.card, F.licenseCard]];
    const govTotal = gov.reduce((s, x) => s + x[1], 0);
    const bd = (n) => `<span class="s-amt" dir="ltr">${n} ${esc(u.bd)}</span>`;
    return `<h1 class="s-h1">${esc(H.pay)}</h1>
      <h2 class="s-h2">${esc(H.ins)}</h2>
      <table class="s-table"><tbody><tr><td>${esc(c.classes)}<div class="s-muted s-num">${F.hours} ${esc(u.hours)} × ${F.perHour} ${esc(u.bd)}</div></td><td>${bd(cls)}</td></tr></tbody></table>
      <h2 class="s-h2">${esc(H.gov)}</h2>
      <table class="s-table"><tbody>${gov.map(([l, v]) => `<tr><td>${esc(l)}</td><td>${bd(v)}</td></tr>`).join("")}
        <tr class="s-sub"><td>${esc(H.subtotal)}</td><td>${bd(govTotal)}</td></tr></tbody></table>
      <table class="s-table s-total"><tbody><tr><td>${esc(u.total)}</td><td>${bd(cls + govTotal)}</td></tr></tbody></table>
      <p class="s-muted">${esc(u.payNote)}</p>
      <button class="s-cta" data-act="go" data-to="step" data-i="0"><span class="s-cta-text"><b>${esc(H.how)}</b><small>${esc(H.howSub)}</small></span><span class="s-cta-arrow">${fwd}</span></button>`;
  }

  if (view.name === "step") {
    const PAGES = [[0, 1, 2, 3], [4, 5, 6]], pg = view.i, idx = PAGES[pg], n = T.steps.length;
    const stores = `<div class="s-stores">
      <a class="s-store" href="${CONFIG.appLinks.ios}" target="_blank" rel="noopener">${icon.apple}<span><small>Download on the</small>App Store</span></a>
      <a class="s-store" href="${CONFIG.appLinks.android}" target="_blank" rel="noopener">${icon.play}<span><small>Get it on</small>Google Play</span></a></div>`;
    return `<p class="s-kicker s-num">${esc(U.stepOf)} ${idx[0] + 1}-${idx[idx.length - 1] + 1} ${esc(U.of)} ${n}</p>
      <div class="s-progress"><i style="width:${((idx[idx.length - 1] + 1) / n) * 100}%"></i></div>
      <ol class="s-steps" start="${idx[0] + 1}">${idx.map((k) => `<li><h2 class="s-step-t">${esc(T.steps[k].t)}</h2>${stepText(T.steps[k].d)}${k === 0 ? stores : ""}</li>`).join("")}</ol>
      ${nav(pg > 0 ? "step-prev" : "go-pay", pg < PAGES.length - 1 ? "step-next" : "go-done")}`;
  }

  if (view.name === "done") {
    return `<h1 class="s-h1">✓ ${esc(H.procDone)}</h1><p class="s-text">${esc(H.offer)}</p>
      <button class="s-link" data-act="go" data-to="step" data-i="1">${bwd} ${esc(u.back)}</button>`;
  }

  if (view.name === "lesson") {
    const i = view.i, l = T.lessons[i], n = T.lessons.length;
    if (!game || game.i !== i) { game = newGame(i); rb.route = null; cancelAnimationFrame(rb.raf); }
    return `<p class="s-kicker">${esc(H.lesson)} ${i + 1} ${esc(U.of)} ${n}</p>
      <div class="s-progress"><i style="width:${((i + 1) / n) * 100}%"></i></div>
      <h1 class="s-h1">${esc(l.t)}</h1>
      <div id="game">${renderGame(T, U, i, nav(i > 0 ? "lesson-prev" : "go-done", i < n - 1 ? "lesson-next" : "go-finish", i < n - 1 ? u.next : u.done))}</div>`;
  }

  // finish
  return `<h1 class="s-h1">✓ ${esc(U.finish)}</h1>
    ${CONFIG.whatsapp ? `<a class="s-cta" href="https://wa.me/${CONFIG.whatsapp}" target="_blank" rel="noopener"><span class="s-cta-text"><b>${esc(u.whatsapp)}</b></span><span class="s-cta-arrow">${fwd}</span></a>` : ""}
    <button class="s-link" data-act="go-pay">${esc(H.pay)}</button>`;
}

// ---------- lesson game ----------
const COLOR_LESSONS = [3, 4];
function questionsFor(T, G, i) {
  return LESSON_QUESTIONS[i].map((k) => (typeof k === "number" ? T.quiz[k] : G.extra[+k.slice(1)]));
}

function sceneSvg(i) {
  const sc = SCENES[i], g = game;
  const body = sc.svg[g.active === null ? 0 : g.active + 1];
  const hs = sc.hs.map(([x, y], k) => {
    const seen = g.seen.includes(k), on = g.active === k;
    return `<g class="hs ${on ? "on" : ""} ${seen ? "seen" : ""}" data-act="tap" data-k="${k}" role="button" tabindex="0">
      <circle cx="${x}" cy="${y}" r="17" class="hs-ring"/><circle cx="${x}" cy="${y}" r="11" class="hs-dot"/>
      <text x="${x}" y="${y + 4.5}" text-anchor="middle" class="hs-num">${seen && !on ? "✓" : k + 1}</text></g>`;
  }).join("");
  // nonce in the id forces a fresh <svg> so its animation restarts on every tap
  return `<svg id="scene-${g.nonce}" viewBox="0 0 320 220" class="art scene" role="img">${body}${hs}</svg>`;
}

function popup(T, i) {
  const g = game;
  if (g.active === null) return "";
  const text = T.lessons[i].p[g.active];
  const at = i === 2 ? null : SCENES[i].hs[g.active];
  let style = "", cls = "g-pop", arrow = "";
  if (at) {
    const [x, y] = at, below = y <= 120, px = (x / 320) * 100, py = (y / 220) * 100;
    style = below ? `top:calc(${py}% + 22px)` : `bottom:calc(${100 - py}% + 22px)`;
    cls += below ? " below" : " above";
    arrow = `<span class="g-pop-arrow" style="left:clamp(16px, ${px}%, calc(100% - 16px))"></span>`;
  } else cls += " fixed";
  return `<div class="${cls}" style="${style}" role="dialog" aria-live="polite">${arrow}<span class="g-pop-n s-num">${g.active + 1}</span><p>${esc(text)}</p><button class="g-pop-x" data-act="close-pop" aria-label="Close">×</button></div>`;
}

function renderGame(T, U, i, navHtml) {
  const G = GAME[lang], g = game, l = T.lessons[i], qs = questionsFor(T, G, i);
  if (g.phase === "complete") {
    const stars = g.right === qs.length ? 3 : g.right > 0 ? 2 : 1;
    return `<div class="g-complete"><div class="g-stars">${[0, 1, 2].map((k) => `<span class="${k < stars ? "on" : ""}">★</span>`).join("")}</div>
      <h2 class="s-h1">${esc(G.complete)}</h2><p class="g-score"><b>+${g.right * PTS}</b> ${esc(G.points)}</p>
      <p class="s-muted">${esc(G.total)}: <b class="s-num">${totalScore()}</b> ${esc(G.points)}</p>${navHtml}
      <button class="s-link" data-act="replay">↻ ${esc(G.replay)}</button></div>`;
  }
  if (g.phase === "challenge") {
    const q = qs[g.qi];
    return `<div class="g-challenge"><p class="s-kicker">${esc(G.challenge)} <span class="s-num">${g.qi + 1}/${qs.length}</span></p>
      <h2 class="g-q">${esc(q.q)}</h2><div class="g-opts">${q.o.map((o, j) => {
        const st = g.picked === null ? "" : j === q.a ? "ok" : j === g.picked ? "bad" : "dim";
        return `<button class="g-opt ${st}" data-act="answer" data-j="${j}" ${g.picked !== null ? "disabled" : ""}><span class="g-mark">${st === "ok" ? "✓" : st === "bad" ? "✗" : String.fromCharCode(65 + j)}</span>${esc(o)}</button>`;
      }).join("")}</div>
      ${g.picked !== null ? `<p class="g-feedback">${g.picked === q.a ? `${esc(T.ui.correct)} +${PTS}` : `${esc(T.ui.wrong)} ${esc(q.o[q.a])}`}</p><button class="s-btn s-primary g-continue" data-act="q-next">${esc(T.ui.next)}</button>` : ""}</div>`;
  }
  const allFound = g.seen.length >= l.p.length;
  const stage = i === 2 ? roundaboutHtml(U) : sceneSvg(i);
  return `<div class="s-game ${COLOR_LESSONS.includes(i) ? "color" : ""}">
    <p class="g-hint">${esc(i === 2 ? G.discoverRb : G.discover)}</p>
    <div class="g-stage">${stage}${popup(T, i)}</div>
    <div class="g-found"><span>${esc(G.found)}</span><span class="g-dots">${l.p.map((_, k) => `<button class="${g.seen.includes(k) ? "on" : ""} ${g.active === k ? "cur" : ""}" ${g.seen.includes(k) ? "" : "disabled"} data-act="tap" data-k="${k}" aria-label="${k + 1}"></button>`).join("")}</span><b class="s-num">${g.seen.length}/${l.p.length}</b></div>
    ${allFound ? `<button class="s-cta g-unlock" data-act="challenge"><span class="s-cta-text"><b>${esc(G.challenge)}</b><small>${qs.length} × +${PTS} ${esc(G.points)}</small></span><span class="s-cta-arrow">→</span></button>` : `<p class="s-muted g-locked">🔒 ${esc(G.locked)}</p>`}
    ${navHtml}</div>`;
}

// ---------- roundabout (Bahrain: drive on the right, anticlockwise) ----------
const CX = 160, CY = 150, GRASS = "#9ccc65", ROAD = "#4a5056";
const ROUTES = [
  { key: "right", bullet: 1, exit: 0, r: 70, sig: () => "R" },
  { key: "straight", bullet: 2, exit: 1, r: 70, sig: (p) => (p > 0.45 ? "R" : "") },
  { key: "left", bullet: 3, exit: 2, r: 50, sig: (p) => (p < 0.62 ? "L" : "R") },
  { key: "uturn", bullet: 4, exit: 3, r: 50, sig: (p) => (p < 0.72 ? "L" : "R") },
];
function routePoints(exitIdx, r) {
  const pts = [];
  for (let y = 300; y >= CY + r + 4; y -= 4) pts.push([CX + 14, y]);
  const a0 = Math.atan2(r, 14);
  const aEnd = [0, -Math.PI / 2, -Math.PI, -1.5 * Math.PI][exitIdx] - 0.15;
  for (let a = a0; a >= aEnd; a -= 0.04) pts.push([CX + r * Math.cos(a), CY + r * Math.sin(a)]);
  const dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]], off = [[0, 14], [14, 0], [0, -14], [-14, 0]];
  const [dx, dy] = dirs[exitIdx], [ox, oy] = off[exitIdx];
  const sx = CX + dx * (r + 6) + ox, sy = CY + dy * (r + 6) + oy;
  for (let t = 0; t <= 160; t += 4) pts.push([sx + dx * t, sy + dy * t]);
  return pts;
}
const carSvg = (color, extra = "") => `<g ${extra}><rect x="-11" y="-20" width="22" height="40" rx="7" fill="${color}" stroke="#263238" stroke-width="1.5"/><rect x="-8" y="-11" width="16" height="9" rx="2" fill="#bfe3ff"/><rect x="-8" y="8" width="16" height="6" rx="2" fill="#bfe3ff"/></g>`;
let rb = { route: null, raf: 0 };

function roundaboutHtml(U) {
  return `<svg viewBox="0 0 320 300" class="art scene" role="img">
      <rect width="320" height="300" fill="${GRASS}"/>
      <rect x="${CX - 30}" y="0" width="60" height="300" fill="${ROAD}"/><rect x="0" y="${CY - 30}" width="320" height="60" fill="${ROAD}"/>
      <circle cx="${CX}" cy="${CY}" r="90" fill="${ROAD}"/>
      <circle cx="${CX}" cy="${CY}" r="60" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="8 8"/>
      <circle cx="${CX}" cy="${CY}" r="34" fill="${GRASS}" stroke="#fff" stroke-width="3"/>
      <rect x="${CX - 1.5}" y="${CY + 92}" width="3" height="60" fill="#ffeb3b"/>
      <path d="M${CX + 2} ${CY + 92} h28" stroke="#fff" stroke-width="3" stroke-dasharray="5 4"/>
      ${carSvg("#90caf9", `transform="translate(${CX - 120} ${CY - 14}) rotate(90)"`)}
      <g class="hs ${game.active === 0 ? "on" : ""} ${game.seen.includes(0) ? "seen" : ""}" data-act="tap" data-k="0" role="button">
        <circle cx="${CX - 80}" cy="${CY - 52}" r="17" class="hs-ring"/><circle cx="${CX - 80}" cy="${CY - 52}" r="11" class="hs-dot"/>
        <text x="${CX - 80}" y="${CY - 47.5}" text-anchor="middle" class="hs-num">!</text></g>
      ${carSvg("#ffca28", `id="rb-car" transform="translate(${CX + 14} 270)"`)}
      <circle id="rb-ring" cx="0" cy="0" r="16" fill="none" stroke="#ff9800" stroke-width="4" style="display:none"/>
    </svg>
    <div class="indicator">${esc(U.indicator)}: <span class="ind" id="rb-l">⬅</span><span class="ind" id="rb-r">➡</span></div>
    <p class="muted center">${esc(U.play)}</p>
    <div class="routes">${ROUTES.map((r) => `<button class="chip ${rb.route?.key === r.key ? "on" : ""}" data-act="route" data-route="${r.key}">${esc(U[r.key])}</button>`).join("")}</div>`;
}

function driveRoute() {
  cancelAnimationFrame(rb.raf);
  const route = rb.route; if (!route) return;
  const pts = routePoints(route.exit, route.r);
  let t0 = null;
  const step = (t) => {
    t0 ??= t;
    const p = Math.min(1, (t - t0) / 5000);
    const car = document.getElementById("rb-car"), ring = document.getElementById("rb-ring");
    if (!car) return; // left the lesson
    const i = Math.min(pts.length - 2, Math.floor(p * (pts.length - 1)));
    const [x, y] = pts[i], [x2, y2] = pts[i + 1];
    car.setAttribute("transform", `translate(${x} ${y}) rotate(${(Math.atan2(y2 - y, x2 - x) * 180) / Math.PI + 90})`);
    const sig = route.sig(p), blink = Math.floor(p * 20) % 2 === 0;
    ring.style.display = sig && blink ? "" : "none";
    ring.setAttribute("cx", x); ring.setAttribute("cy", y);
    document.getElementById("rb-l").classList.toggle("lit", sig === "L" && blink);
    document.getElementById("rb-r").classList.toggle("lit", sig === "R" && blink);
    if (p < 1) rb.raf = requestAnimationFrame(step);
  };
  rb.raf = requestAnimationFrame(step);
}

// ---------- render ----------
function render(scroll) {
  const d = document.documentElement;
  d.lang = lang || "en"; d.dir = lang ? I18N[lang].dir : "ltr";
  if (!lang) { app.innerHTML = renderLang(); if (scroll) scrollTo(0, 0); return; }
  const T = I18N[lang], H = HUB[lang], U = UI[lang], u = T.ui;
  const fwd = T.dir === "rtl" ? "←" : "→";
  const tabs = [["pay", H.pay, "go-pay", view.name === "pay"], ["process", H.process, "go-process", view.name === "step" || view.name === "done"], ["learn", H.lessons, "go-lessons", view.name === "lesson" || view.name === "finish"]];
  const showLearn = view.name !== "lesson" && view.name !== "finish";
  const wa = CONFIG.whatsapp, tel = telNumber();
  app.innerHTML = header(T.name)
    + `<nav class="s-tabs" aria-label="Sections"><div class="s-tabs-in">${tabs.map(([k, label, act, on]) => `<button class="s-tab ${on ? "on" : ""}" ${on ? 'aria-current="page"' : ""} data-act="${act}">${esc(label)}</button>`).join("")}</div></nav>`
    + `<div class="s-wrap s-has-bar">${renderBody(T, H, U)}</div>`
    + `<div class="s-bar"><div class="s-bar-in">
        ${showLearn ? `<button class="s-bar-learn" data-act="go-lessons"><span class="s-bar-text"><b>${esc(H.startLearn)}</b><small>${esc(T.menu.guide)}</small></span><span aria-hidden="true">${fwd}</span></button>` : '<span class="s-bar-spacer"></span>'}
        <a class="s-bar-ic ${wa ? "" : "off"}" ${wa ? `href="https://wa.me/${wa}" target="_blank" rel="noopener"` : ""} aria-label="${esc(u.whatsapp)}" title="WhatsApp">${icon.wa}</a>
        <a class="s-bar-ic ${tel ? "" : "off"}" ${tel ? `href="tel:+${tel}"` : ""} aria-label="Call" title="Call">${icon.call}</a>
      </div></div>`;
  if (scroll) scrollTo(0, 0);
}

// re-render only the lesson game area (keeps scroll position)
function renderGameOnly() {
  const el = document.getElementById("game");
  if (!el) return render(false);
  const T = I18N[lang], U = UI[lang], u = T.ui, i = view.i, n = T.lessons.length;
  const rtl = T.dir === "rtl", fwd = rtl ? "←" : "→", bwd = rtl ? "→" : "←";
  const navHtml = `<div class="s-nav"><button class="s-btn" data-act="${i > 0 ? "lesson-prev" : "go-done"}">${bwd} ${esc(u.back)}</button><button class="s-btn s-primary" data-act="${i < n - 1 ? "lesson-next" : "go-finish"}">${esc(i < n - 1 ? u.next : u.done)} ${fwd}</button></div>`;
  el.innerHTML = renderGame(T, U, i, navHtml);
  if (i === 2 && game.phase === "discover" && rb.route) driveRoute();
}

// ---------- events ----------
app.addEventListener("click", (e) => {
  const el = e.target.closest("[data-act]");
  if (!el) return;
  const act = el.dataset.act;
  switch (act) {
    case "pick-lang": lang = el.dataset.lang; store.set("lang", lang); render(true); break;
    case "lang": lang = null; store.set("lang", null); render(true); break;
    case "go": go(el.dataset.to, +el.dataset.i); break;
    case "go-pay": go("pay"); break;
    case "go-process": go("step", 0); break;
    case "go-done": go("done"); break;
    case "go-finish": go("finish"); break;
    case "go-lessons": go("lesson", 0); break;
    case "step-prev": go("step", view.i - 1); break;
    case "step-next": go("step", view.i + 1); break;
    case "lesson-prev": go("lesson", view.i - 1); break;
    case "lesson-next": go("lesson", view.i + 1); break;
    case "tap": {
      const k = +el.dataset.k;
      game.active = k; game.nonce++;
      if (!game.seen.includes(k)) game.seen.push(k);
      renderGameOnly(); break;
    }
    case "close-pop": game.active = null; renderGameOnly(); break;
    case "route": {
      rb.route = ROUTES.find((r) => r.key === el.dataset.route);
      game.active = rb.route.bullet; game.nonce++;
      if (!game.seen.includes(rb.route.bullet)) game.seen.push(rb.route.bullet);
      renderGameOnly(); break;
    }
    case "challenge": game.phase = "challenge"; renderGameOnly(); break;
    case "answer": {
      if (game.picked !== null) break;
      const T = I18N[lang], q = questionsFor(T, GAME[lang], view.i)[game.qi], j = +el.dataset.j;
      game.picked = j; if (j === q.a) game.right++;
      renderGameOnly(); break;
    }
    case "q-next": {
      const qs = questionsFor(I18N[lang], GAME[lang], view.i);
      if (game.qi < qs.length - 1) { game.qi++; game.picked = null; }
      else { saveScore(view.i, game.right * PTS); game.phase = "complete"; }
      renderGameOnly(); break;
    }
    case "replay": game = newGame(view.i); rb.route = null; renderGameOnly(); break;
  }
});
app.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.matches?.('.hs[data-act="tap"]')) e.target.dispatchEvent(new MouseEvent("click", { bubbles: true }));
});

initTracking();
trackContactLinks(app);
render(false);
