"use client";
import { useEffect, useState } from "react";
import { I18N } from "@/lib/i18n";
import { REG } from "@/lib/reg-i18n";
import { UI } from "@/lib/ui-i18n";
import { HUB } from "@/lib/hub-i18n";
import { CONFIG } from "@/lib/config";
import Art from "@/components/Art";
import Register from "@/components/Register";
import { LessonScene, Roundabout } from "@/components/Scenes";

const F = CONFIG.fees;
const MEDIA = {
  2: ["img:/assets/roundabout-route.jpg", "vid:/assets/roundabout.mp4"],
  6: ["vid:/assets/practice1.mp4", "vid:/assets/practice2.mp4", "vid:/assets/clip.mp4"],
  7: ["img:/assets/school-map.jpg"],
};
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// The guided journey, in order.
const FLOW = [
  "welcome", ...[0, 1, 2, 3, 4, 5, 6].map((i) => `step${i}`), "govfees", "insfees", "docs", "register",
  "learn", ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `lesson${i}`), "quiz", "finish",
];
// Single-topic paths opened from the hub; at the end they return to the hub.
const CATS = {
  process: [0, 1, 2, 3, 4, 5, 6].map((i) => `step${i}`),
  gov: ["govfees"], ins: ["insfees"], docs: ["docs"],
  lessons: ["learn", ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `lesson${i}`)],
  quiz: ["quiz"], register: ["register"], map: ["schoolmap"],
};

export default function Home() {
  const [lang, setLangState] = useState(null);
  const [screen, setScreen] = useState("lang"); // "lang" | "hub" | "map" | FLOW item
  const [mode, setMode] = useState("full"); // "full" or a CATS key
  const [maxPos, setMaxPos] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = store.get("lang", null);
    setMaxPos(store.get("maxPos", 0));
    if (saved && I18N[saved]) { setLangState(saved); setScreen("hub"); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!lang) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = I18N[lang].dir;
  }, [lang]);

  const show = (s, m = mode) => {
    setScreen(s); setMode(m); window.scrollTo(0, 0);
    const p = FLOW.indexOf(s);
    if (m === "full" && p > maxPos) { setMaxPos(p); store.set("maxPos", p); }
  };
  const seq = mode === "full" ? FLOW : CATS[mode];
  const next = () => { const p = seq.indexOf(screen); p >= 0 && p < seq.length - 1 ? show(seq[p + 1]) : show("hub"); };
  const prev = () => { const p = seq.indexOf(screen); p > 0 ? show(seq[p - 1]) : show("hub"); };
  const openCat = (k) => show(CATS[k][0], k);
  const setLang = (code) => { setLangState(code); store.set("lang", code); show("hub", "full"); };

  if (!ready) return null;
  if (!lang || screen === "lang") return (<><Header /><main><LangScreen onPick={setLang} /></main></>);

  const T = I18N[lang], R = REG[lang], U = UI[lang], H = HUB[lang];
  const pos = FLOW.indexOf(screen);
  const ctx = { T, R, U, H, lang, next, prev, show, mode, seq };
  const Nav = ({ label, onNext = next, back = true }) => (
    <div className="nav">
      {back && <button className="btn" onClick={prev} aria-label={T.ui.back}>{T.dir === "rtl" ? "→" : "←"}</button>}
      <button className="btn primary big" onClick={onNext}>{label || T.ui.next} {T.dir === "rtl" ? "←" : "→"}</button>
    </div>
  );
  ctx.Nav = Nav;

  let body;
  if (screen === "hub") body = <Hub {...ctx} maxPos={maxPos} openCat={openCat} />;
  else if (screen === "map") body = <JourneyMap {...ctx} maxPos={maxPos} />;
  else if (screen === "schoolmap") body = (<>
    <h2>🗺️ {H.map}</h2>
    <img className="media" src="/assets/school-map.jpg" alt={H.map} />
    <Nav label={H.topics} />
  </>);
  else if (screen === "welcome") body = (<>
    <Art name="welcome" />
    <div className="card"><h2>{T.welcome.title}</h2><p>{T.welcome.text}</p></div>
    <Nav label={U.startJourney} back={false} />
  </>);
  else if (screen.startsWith("step")) {
    const i = +screen.slice(4), s = T.steps[i];
    body = (<>
      <p className="kicker">{mode === "full" ? U.part1 : H.process} · {U.stepOf} {i + 1} {U.of} {T.steps.length}</p>
      <Art name={`step${i}`} label={s.t} />
      <div className="card"><h3><span className="num">{i + 1}</span>{s.t}</h3><p className="lead">{s.d}</p></div>
      <Nav />
    </>);
  } else if (screen === "govfees") body = <GovFees {...ctx} />;
  else if (screen === "insfees") body = <InsFees {...ctx} />;
  else if (screen === "docs") body = <Docs {...ctx} />;
  else if (screen === "register") body = <RegisterStep {...ctx} />;
  else if (screen === "learn") body = (<>
    <p className="kicker">{U.part2}</p>
    <div className="card"><h2>📘 {T.menu.guide}</h2><p className="lead">{U.learnIntro}</p></div>
    <div className="lesson-list">{T.lessons.map((l, i) => (
      <button key={i} className="btn" onClick={() => show(`lesson${i}`)}><span className="num">{i + 1}</span>{l.t}{maxPos > FLOW.indexOf(`lesson${i}`) && <span className="tick">✓</span>}</button>))}</div>
    <Nav label={U.startJourney} />
  </>);
  else if (screen.startsWith("lesson")) body = <Lesson key={screen} {...ctx} i={+screen.slice(6)} />;
  else if (screen === "quiz") body = <Quiz {...ctx} />;
  else if (screen === "finish") body = (<>
    <Art name="step6" />
    <div className="card center"><h2>🎉 {U.finish}</h2></div>
    {CONFIG.whatsapp && <a className="btn wa big" href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">💬 {T.ui.whatsapp}</a>}
    <button className="btn" onClick={() => show("hub", "full")}>🏠 {H.topics}</button>
  </>);

  const sp = seq.indexOf(screen);
  const pct = sp < 0 || seq.length < 2 ? null : Math.round((sp / Math.max(1, seq.length - 1)) * 100);
  return (<>
    <Header onLang={() => setScreen("lang")} onMap={screen !== "hub" ? () => show("hub", "full") : null} pct={pct} />
    <main>{body}</main>
  </>);
}

function Header({ onLang, onMap, pct }) {
  return (
    <header>
      <h1><img className="logo" src="/logo.svg" alt="" />Bahrain Driving Licence</h1>
      {onMap && <button onClick={onMap} aria-label="Topics">🏠</button>}
      {onLang && <button onClick={onLang} aria-label="Language">🌐</button>}
      {pct != null && <div className="hbar"><i style={{ width: `${pct}%` }} /></div>}
    </header>
  );
}

function LangScreen({ onPick }) {
  const flags = { en: "🇬🇧", ar: "🇧🇭", ur: "🇵🇰", hi: "🇮🇳", ml: "🌴", zh: "🇨🇳" };
  return (<>
    <div className="instructor">
      <img src={CONFIG.instructorPhoto} alt={CONFIG.teacherName} />
      <div>
        <p className="ins-label">Driving Instructor</p>
        <h2>{CONFIG.teacherName}</h2>
        <p className="ins-code">Instructor Code <b>{CONFIG.instructorCode}</b></p>
      </div>
    </div>
    <div className="lang-grid">
      {Object.keys(I18N).map((k) => <button key={k} className="btn lang" onClick={() => onPick(k)}><span>{flags[k]}</span>{I18N[k].name}</button>)}
    </div>
  </>);
}

function JourneyMap({ T, U, show, maxPos }) {
  const resume = FLOW[Math.min(maxPos, FLOW.length - 1)];
  const Item = ({ s, icon, label }) => {
    const p = FLOW.indexOf(s), done = maxPos > p, current = maxPos === p;
    return <button className={`stop ${done ? "done" : ""} ${current ? "current" : ""}`} onClick={() => show(s)}>
      <span className="dot">{done ? "✓" : icon}</span><span>{label}</span></button>;
  };
  return (<>
    <h2>🗺️ {U.journey}</h2>
    <button className="btn primary big" onClick={() => show(resume)}>▶ {U.continue}</button>
    <div className="card">
      <p className="kicker">{U.part1}</p>
      <div className="path">
        <Item s="welcome" icon="👋" label={T.welcome.title} />
        {T.steps.map((s, i) => <Item key={i} s={`step${i}`} icon={i + 1} label={s.t} />)}
        <Item s="govfees" icon="🏛️" label={HUB[Object.keys(I18N).find((k) => I18N[k] === T)].gov} />
        <Item s="insfees" icon="🚗" label={HUB[Object.keys(I18N).find((k) => I18N[k] === T)].ins} />
        <Item s="docs" icon="🪪" label={T.menu.docs} />
        <Item s="register" icon="📝" label={REG_title(T)} />
      </div>
    </div>
    <div className="card">
      <p className="kicker">{U.part2}</p>
      <div className="path">{T.lessons.map((l, i) => <Item key={i} s={`lesson${i}`} icon={i + 1} label={l.t} />)}</div>
    </div>
    <div className="card">
      <p className="kicker">{U.part3}</p>
      <div className="path"><Item s="quiz" icon="❓" label={T.menu.quiz} /></div>
    </div>
    {CONFIG.whatsapp && <a className="btn wa" href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">💬 {T.ui.whatsapp}</a>}
    <p className="muted">{T.ui.disclaimer}</p>
  </>);
}
const REG_title = (T) => REG[Object.keys(I18N).find((k) => I18N[k] === T)].menu;

function Hub({ T, U, H, show, openCat, maxPos }) {
  const cats = [
    ["process", "📋", H.process, H.processSub],
    ["gov", "🏛️", H.gov, H.govSub, F.eyeTest + F.learningBook + F.examAppointment + F.licenseCard],
    ["ins", "🚗", H.ins, H.insSub, F.hours * F.perHour],
    ["docs", "🪪", H.docs, H.docsSub],
    ["lessons", "📘", H.lessons, H.lessonsSub],
    ["quiz", "❓", H.quiz, H.quizSub],
    ["register", "📝", H.register, H.registerSub],
    ["map", "🗺️", H.map, H.mapSub],
  ];
  return (<>
    <h2>{H.title}</h2>
    <p className="muted" style={{ marginBottom: 12 }}>{H.sub}</p>
    <button className="complete" onClick={() => show(maxPos > 0 ? FLOW[maxPos] : "welcome", "full")}>
      <span className="c-ic">🧭</span>
      <span><b>{maxPos > 0 ? H.resume : H.complete}</b><small>{H.completeSub}</small></span>
      <span className="c-go">{T.dir === "rtl" ? "←" : "→"}</span>
    </button>
    <button className="allin" onClick={() => openCat("gov")}>
      <span>💰 {H.allIn}</span><b>{allIn()} <small>{T.ui.bd}</small></b>
    </button>
    {maxPos > 0 && <button className="btn small-link" onClick={() => show("map", "full")}>🗺️ {U.journey}</button>}
    <div className="cats">
      {cats.map(([k, ic, t, sub, price], i) => (
        <button key={k} className="cat" onClick={() => openCat(k)}>
          <span className="cat-n">{i + 1}</span>
          <span className="cat-ic">{ic}</span>
          <b>{t}</b>{price != null && <span className="cat-price">{price} <small>{T.ui.bd}</small></span>}<small>{sub}</small>
        </button>))}
    </div>
    {CONFIG.whatsapp && <a className="btn wa" href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">💬 {T.ui.whatsapp}</a>}
    <p className="muted">{T.ui.disclaimer}</p>
  </>);
}

function FeeList({ T, items }) {
  const u = T.ui, total = items.reduce((s, x) => s + x[2], 0);
  return (<div className="fees">
    {items.map(([ic, label, v, sub]) => (
      <div className="fee" key={label}>
        <span className="fee-ic">{ic}</span>
        <div className="fee-body">
          <div className="fee-top"><span>{label}</span><b>{v} {u.bd}</b></div>
          {sub && <div className="muted">{sub}</div>}
          {items.length > 1 && <div className="fee-bar"><i style={{ width: `${(v / total) * 100}%` }} /></div>}
        </div>
      </div>))}
  </div>);
}
const allIn = () => F.eyeTest + F.learningBook + F.examAppointment + F.hours * F.perHour + F.licenseCard;

function GovFees({ T, U, H, mode, Nav }) {
  const c = T.costs, u = T.ui;
  const items = [["👁️", c.eye, F.eyeTest], ["📕", c.book, F.learningBook], ["📝", c.exam, F.examAppointment], ["🪪", c.card, F.licenseCard]];
  const total = items.reduce((s, x) => s + x[2], 0);
  return (<>
    <p className="kicker">{mode === "full" ? U.part1 : H.topics}</p>
    <div className="total-hero gov"><span>🏛️ {H.gov}</span><b>{total} <small>{u.bd}</small></b></div>
    <FeeList T={T} items={items} />
    <div className="card note">ℹ️ {H.govNote}</div>
    <div className="allin static"><span>💰 {H.allIn}</span><b>{allIn()} <small>{u.bd}</small></b></div>
    <Nav label={mode === "full" ? undefined : H.topics} />
  </>);
}

function InsFees({ T, U, H, mode, Nav }) {
  const c = T.costs, u = T.ui, cls = F.hours * F.perHour;
  return (<>
    <p className="kicker">{mode === "full" ? U.part1 : H.topics}</p>
    <div className="total-hero"><span>🚗 {H.ins}</span><b>{cls} <small>{u.bd}</small></b></div>
    <div className="hours">
      <div><b>{F.hours}</b><small>{u.hours}</small></div><span>×</span>
      <div><b>{F.perHour}</b><small>{u.bd} {u.perHour}</small></div><span>=</span>
      <div className="eq"><b>{cls}</b><small>{u.bd}</small></div>
    </div>
    <div className="card">🚘 {c.classes} — {H.insNote}</div>
    <div className="card note">💳 {u.payNote}</div>
    <div className="allin static"><span>💰 {H.allIn}</span><b>{allIn()} <small>{u.bd}</small></b></div>
    <Nav label={mode === "full" ? undefined : H.topics} />
  </>);
}

function Docs({ T, U, Nav }) {
  const [have, setHave] = useState(() => store.get("docs", []));
  const toggle = (i) => { const h = have.includes(i) ? have.filter((x) => x !== i) : [...have, i]; setHave(h); store.set("docs", h); };
  return (<>
    <p className="kicker">{U.part1}</p>
    <Art name="docs" />
    <h2>🪪 {T.menu.docs}</h2>
    <p className="muted">{U.checkAll}</p>
    {T.docs.map((d, i) => (
      <button key={i} className={`btn check ${have.includes(i) ? "on" : ""}`} onClick={() => toggle(i)}>
        <span className="box">{have.includes(i) ? "✓" : ""}</span>{d}</button>))}
    <Nav />
  </>);
}

function RegisterStep({ R, U, lang, next, prev }) {
  const [done, setDone] = useState(() => store.get("registered", false));
  if (done) return (<>
    <div className="card center"><div style={{ fontSize: 48 }}>✅</div><p className="lead">{R.success}</p></div>
    <button className="btn primary big" onClick={next}>{U.continue} →</button>
  </>);
  return (<>
    <p className="kicker">{U.regAsk}</p>
    <Register R={R} lang={lang} onDone={() => { store.set("registered", true); setDone(true); window.scrollTo(0, 0); }}
      footer={<div className="nav"><button type="button" className="btn" onClick={prev}>←</button><button type="button" className="btn" onClick={next}>{U.skip} →</button></div>} />
  </>);
}

function Lesson({ T, U, i, next, Nav }) {
  const l = T.lessons[i];
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState([]);
  const tap = (b) => { setActive(b); setSeen((s) => (s.includes(b) ? s : [...s, b])); };
  const all = seen.length >= l.p.length;
  const onNext = () => {
    if (all) return next();
    const n = l.p.findIndex((_, k) => !seen.includes(k));
    tap(n);
  };
  return (<>
    <p className="kicker">{U.part2} · {i + 1}/{T.lessons.length}</p>
    <h2><span className="num">{i + 1}</span>{l.t}</h2>
    {i === 2 ? <Roundabout U={U} onTap={tap} /> : <LessonScene index={i} active={active} seen={seen} onTap={tap} />}
    {active === null
      ? <div className="card hint">{U.tapHint}</div>
      : <div className="card rule" key={active}><span className="num">{active + 1}</span><p className="lead">{l.p[active]}</p></div>}
    <div className="dots">{l.p.map((_, k) => <i key={k} className={seen.includes(k) ? "on" : ""} onClick={() => tap(k)} />)}</div>
    {all && <div className="card ok">🎉 {U.seenAll}</div>}
    {all && (MEDIA[i] || []).map((m) => m.startsWith("img:")
      ? <img key={m} className="media" src={m.slice(4)} alt="" loading="lazy" />
      : <video key={m} className="media" src={m.slice(4)} controls playsInline preload="metadata" />)}
    <Nav onNext={onNext} label={all ? T.ui.next : `${T.ui.next} (${seen.length}/${l.p.length})`} />
  </>);
}

function Quiz({ T, U, next }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  if (i >= T.quiz.length) return (<>
    <div className="card center">
      <h2>{T.ui.score}</h2>
      <div className="score">{score} / {T.quiz.length}</div>
      <p>{"⭐".repeat(Math.round((score / T.quiz.length) * 5))}</p>
    </div>
    <button className="btn primary big" onClick={next}>{U.continue} →</button>
    <button className="btn" onClick={() => { setI(0); setScore(0); setPicked(null); }}>🔄 {T.ui.retry}</button>
  </>);
  const q = T.quiz[i];
  return (<>
    <p className="kicker">{U.part3} · {i + 1}/{T.quiz.length}</p>
    <div className="card"><h3>❓ {q.q}</h3></div>
    {q.o.map((o, j) => {
      const cls = picked === null ? "" : j === q.a ? "ok" : j === picked ? "bad" : "";
      return <button key={j} className={`btn opt ${cls}`} disabled={picked !== null}
        onClick={() => { setPicked(j); if (j === q.a) setScore(score + 1); }}>{o}</button>;
    })}
    {picked !== null && (<>
      <div className="card"><p>{picked === q.a ? `✅ ${T.ui.correct}` : `❌ ${T.ui.wrong} ${q.o[q.a]}`}</p></div>
      <button className="btn primary big" onClick={() => { setI(i + 1); setPicked(null); }}>{T.ui.next} →</button>
    </>)}
  </>);
}
