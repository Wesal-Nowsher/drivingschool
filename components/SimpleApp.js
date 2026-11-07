"use client";
// Minimal version: language → payment details → process guide → learning lessons.
// Plain black-and-white design, no illustrations.
import { useEffect, useState } from "react";
import { I18N } from "@/lib/i18n";
import { HUB } from "@/lib/hub-i18n";
import { UI } from "@/lib/ui-i18n";
import { CONFIG } from "@/lib/config";
import LessonGame from "@/components/LessonGame";


const F = CONFIG.fees;
const get = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

function Header({ langName, onLang }) {
  return (
    <header className="s-header">
      <div className="s-hin">
        <img className="s-photo" src={CONFIG.instructorPhoto} alt="" />
        <div className="s-ins" dir="ltr">
          <div className="s-name">{CONFIG.teacherName}</div>
          <div className="s-code">Instructor Code {CONFIG.instructorCode}</div>
        </div>
        {langName && <button className="s-lang" onClick={onLang}>{langName}</button>}
      </div>
    </header>
  );
}

// URL hash <-> screen, so a reload or the back button keeps the user in place.
const LESSONS = 8, PROCESS_PAGES = 2;
function parseHash(h) {
  const [a, b] = (h || "").replace(/^#\/?/, "").split("/");
  const n = parseInt(b, 10);
  if (a === "process") {
    if (b === "done") return { name: "done" };
    if (n >= 1 && n <= PROCESS_PAGES) return { name: "step", i: n - 1 };
    return { name: "step", i: 0 };
  }
  if (a === "lessons") {
    if (b === "done") return { name: "finish" };
    if (n >= 1 && n <= LESSONS) return { name: "lesson", i: n - 1 };
    return { name: "lesson", i: 0 };
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

export default function SimpleApp() {
  const [lang, setLang] = useState(null);
  const [view, setView] = useState({ name: "pay" }); // pay | step | done | lesson | finish
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const l = get("lang"); if (l && I18N[l]) setLang(l);
    setView(parseHash(window.location.hash));
    const onPop = () => setView(parseHash(window.location.hash));
    window.addEventListener("popstate", onPop);
    setReady(true);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    const d = document.documentElement;
    d.lang = lang || "en"; d.dir = lang ? I18N[lang].dir : "ltr";
  }, [lang]);
  useEffect(() => { window.scrollTo(0, 0); }, [lang, view]);
  if (!ready) return null;

  const changeLang = () => { set("lang", null); setLang(null); };

  if (!lang) return (<>
    <Header />
    <div className="s-wrap">
      <h1 className="s-h1">Choose your language</h1>
      <div className="s-list">
        {Object.keys(I18N).map((k) => (
          <button key={k} className="s-row" onClick={() => { set("lang", k); setLang(k); }}>{I18N[k].name}</button>))}
      </div>
    </div>
  </>);

  const T = I18N[lang], H = HUB[lang], U = UI[lang], u = T.ui;
  const rtl = T.dir === "rtl";
  const fwd = rtl ? "←" : "→", bwd = rtl ? "→" : "←";
  const go = (name, i) => {
    const v = { name, i }, h = toHash(v);
    if (window.location.hash !== h) window.history.pushState(null, "", h);
    setView(v);
  };

  const Nav = ({ onBack, onNext, nextLabel }) => (
    <div className="s-nav">
      <button className="s-btn" onClick={onBack}>{bwd} {u.back}</button>
      <button className="s-btn s-primary" onClick={onNext}>{nextLabel || u.next} {fwd}</button>
    </div>
  );

  let body;
  if (view.name === "pay") {
    const c = T.costs, cls = F.hours * F.perHour;
    const gov = [[c.eye, F.eyeTest], [c.book, F.learningBook], [c.exam, F.examAppointment], [c.card, F.licenseCard]];
    const govTotal = gov.reduce((s, x) => s + x[1], 0);
    const bd = (n) => <span className="s-amt" dir="ltr">{n} {u.bd}</span>;
    body = (<>
      <h1 className="s-h1">{H.pay}</h1>
      <h2 className="s-h2">{H.ins}</h2>
      <table className="s-table"><tbody>
        <tr><td>{c.classes}<div className="s-muted s-num">{F.hours} {u.hours} × {F.perHour} {u.bd}</div></td><td>{bd(cls)}</td></tr>
      </tbody></table>
      <h2 className="s-h2">{H.gov}</h2>
      <table className="s-table"><tbody>
        {gov.map(([l, v]) => <tr key={l}><td>{l}</td><td>{bd(v)}</td></tr>)}
        <tr className="s-sub"><td>{H.subtotal}</td><td>{bd(govTotal)}</td></tr>
      </tbody></table>
      <table className="s-table s-total"><tbody>
        <tr><td>{u.total}</td><td>{bd(cls + govTotal)}</td></tr>
      </tbody></table>
      <p className="s-muted">{u.payNote}</p>
      <button className="s-cta" onClick={() => go("step", 0)}>
        <span className="s-cta-text"><b>{H.how}</b><small>{H.howSub}</small></span>
        <span className="s-cta-arrow">{fwd}</span>
      </button>
    </>);
  } else if (view.name === "step") {
    // Page 0 = steps 1-4, page 1 = steps 5-7
    const PAGES = [[0, 1, 2, 3], [4, 5, 6]];
    const pg = view.i, idx = PAGES[pg], n = T.steps.length;
    body = (<>
      <p className="s-kicker s-num">{U.stepOf} {idx[0] + 1}-{idx[idx.length - 1] + 1} {U.of} {n}</p>
      <div className="s-progress"><i style={{ width: `${((idx[idx.length - 1] + 1) / n) * 100}%` }} /></div>
      <ol className="s-steps" start={idx[0] + 1}>
        {idx.map((k) => (
          <li key={k}>
            <h2 className="s-step-t">{T.steps[k].t}</h2>
            <StepText text={T.steps[k].d} />
            {k === 0 && (
              <div className="s-stores">
                <a className="s-store" href={CONFIG.appLinks.ios} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.5-1-2.5-3.9zM14 5.6c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.6 2.8-1.4z"/></svg>
                  <span><small>Download on the</small>App Store</span>
                </a>
                <a className="s-store" href={CONFIG.appLinks.android} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M3.6 2.3c-.2.2-.3.6-.3 1v17.4c0 .4.1.8.3 1l9.7-9.7-9.7-9.7zm10.5 10.5 2.9 2.9-11.6 6.6 8.7-9.5zm0-1.6L5.4 1.7 17 8.3l-2.9 2.9zm4.1-2.2 3.2 1.8c.9.5.9 1.9 0 2.4l-3.2 1.8-3.1-3 3.1-3z"/></svg>
                  <span><small>Get it on</small>Google Play</span>
                </a>
              </div>
            )}
          </li>))}
      </ol>
      <Nav onBack={() => (pg > 0 ? go("step", pg - 1) : go("pay"))} onNext={() => (pg < PAGES.length - 1 ? go("step", pg + 1) : go("done"))} />
    </>);
  } else if (view.name === "done") {
    body = (<>
      <h1 className="s-h1">✓ {H.procDone}</h1>
      <p className="s-text">{H.offer}</p>
      <button className="s-link" onClick={() => go("step", 1)}>{bwd} {u.back}</button>
    </>);
  } else if (view.name === "lesson") {
    const i = view.i, l = T.lessons[i], n = T.lessons.length;
    const prev = () => (i > 0 ? go("lesson", i - 1) : go("done"));
    const nextL = () => (i < n - 1 ? go("lesson", i + 1) : go("finish"));
    const LNav = ({ onNext, nextLabel }) => <Nav onBack={prev} onNext={onNext} nextLabel={nextLabel} />;
    body = (<>
      <p className="s-kicker">{H.lesson} {i + 1} {U.of} {n}</p>
      <div className="s-progress"><i style={{ width: `${((i + 1) / n) * 100}%` }} /></div>
      <h1 className="s-h1">{l.t}</h1>
      <LessonGame key={`${lang}-${i}`} lang={lang} T={T} U={U} i={i} Nav={LNav} onNext={nextL} nextLabel={i < n - 1 ? u.next : u.done} />
    </>);
  } else {
    body = (<>
      <h1 className="s-h1">✓ {U.finish}</h1>
      {CONFIG.whatsapp && <a className="s-cta" href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">
        <span className="s-cta-text"><b>{u.whatsapp}</b></span><span className="s-cta-arrow">{fwd}</span></a>}
      <button className="s-link" onClick={() => go("pay")}>{H.pay}</button>
    </>);
  }

  return (<>
    <Header langName={T.name} onLang={changeLang} />
    <nav className="s-tabs" aria-label="Sections">
      <div className="s-tabs-in">
        {[["pay", H.pay, () => go("pay")],
          ["process", H.process, () => go("step", 0)],
          ["learn", H.lessons, () => go("lesson", 0)]].map(([k, label, fn]) => {
          const active = k === "pay" ? view.name === "pay" : k === "process" ? view.name === "step" || view.name === "done" : view.name === "lesson" || view.name === "finish";
          return <button key={k} className={`s-tab ${active ? "on" : ""}`} aria-current={active ? "page" : undefined} onClick={fn}>{label}</button>;
        })}
      </div>
    </nav>
    <div className="s-wrap s-has-bar">{body}</div>
    <BottomBar showLearn={view.name !== "lesson" && view.name !== "finish"} label={H.startLearn} sub={T.menu.guide} fwd={fwd} onLearn={() => go("lesson", 0)} waLabel={u.whatsapp} />
  </>);
}

// Fixed bar: "Start learning" on the start side, WhatsApp + call on the end side.
function BottomBar({ showLearn, label, sub, fwd, onLearn, waLabel }) {
  const wa = CONFIG.whatsapp, tel = CONFIG.phone || CONFIG.whatsapp;
  return (
    <div className="s-bar">
      <div className="s-bar-in">
        {showLearn ? <button className="s-bar-learn" onClick={onLearn}>
          <span className="s-bar-text"><b>{label}</b><small>{sub}</small></span>
          <span aria-hidden="true">{fwd}</span>
        </button> : <span className="s-bar-spacer" />}
        <a className={`s-bar-ic ${wa ? "" : "off"}`} href={wa ? `https://wa.me/${wa}` : undefined} target="_blank" rel="noopener noreferrer" aria-label={waLabel} title="WhatsApp">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.5-.5-1-1.1-1.3-1.7-.1-.2 0-.4.1-.5l.4-.5.2-.4v-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.6.6-.9 1.4-.9 2.2 0 .9.4 1.8 1 2.6 1.1 1.6 2.5 2.9 4.2 3.7.5.2 1 .4 1.4.5.5.2 1.1.2 1.6.1.6-.1 1.4-.6 1.6-1.2.1-.4.1-.8 0-1.1l-.3-.2z"/></svg>
        </a>
        <a className={`s-bar-ic ${tel ? "" : "off"}`} href={tel ? `tel:+${tel}` : undefined} aria-label="Call" title="Call">
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>
        </a>
      </div>
    </div>
  );
}

// Renders step text; lines starting with "- " become a bullet list.
function StepText({ text }) {
  const lines = text.split("\n");
  const out = [];
  let list = null;
  lines.forEach((ln, i) => {
    if (ln.startsWith("- ")) {
      if (!list) { list = []; out.push(<ul key={`u${i}`} className="s-bullets">{list}</ul>); }
      list.push(<li key={i}>{ln.slice(2)}</li>);
    } else { list = null; out.push(<p key={i} className="s-text">{ln}</p>); }
  });
  return <>{out}</>;
}
