"use client";
// Minimal version: language → payment details → process guide → learning lessons.
// Plain black-and-white design, no illustrations.
import { useEffect, useState } from "react";
import { I18N } from "@/lib/i18n";
import { HUB } from "@/lib/hub-i18n";
import { UI } from "@/lib/ui-i18n";
import { CONFIG } from "@/lib/config";
import { PlainScene } from "@/components/Scenes";

// Real images from the instructor for lessons without a drawing.
const LESSON_IMG = { 2: "/assets/roundabout-route.jpg", 7: "/assets/school-map.jpg" };

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

export default function SimpleApp() {
  const [lang, setLang] = useState(null);
  const [view, setView] = useState({ name: "pay" }); // pay | step | done | lesson | finish
  const [ready, setReady] = useState(false);

  useEffect(() => { const l = get("lang"); if (l && I18N[l]) setLang(l); setReady(true); }, []);
  useEffect(() => {
    const d = document.documentElement;
    d.lang = lang || "en"; d.dir = lang ? I18N[lang].dir : "ltr";
  }, [lang]);
  useEffect(() => { window.scrollTo(0, 0); }, [lang, view]);
  if (!ready) return null;

  const changeLang = () => { set("lang", null); setLang(null); setView({ name: "pay" }); };

  if (!lang) return (<>
    <Header />
    <div className="s-wrap">
      <h1 className="s-h1">Choose your language</h1>
      <div className="s-list">
        {Object.keys(I18N).map((k) => (
          <button key={k} className="s-row" onClick={() => { set("lang", k); setLang(k); setView({ name: "pay" }); }}>{I18N[k].name}</button>))}
      </div>
    </div>
  </>);

  const T = I18N[lang], H = HUB[lang], U = UI[lang], u = T.ui;
  const rtl = T.dir === "rtl";
  const fwd = rtl ? "←" : "→", bwd = rtl ? "→" : "←";
  const go = (name, i) => setView({ name, i });

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
    const i = view.i, s = T.steps[i], n = T.steps.length;
    body = (<>
      <p className="s-kicker">{U.stepOf} {i + 1} {U.of} {n}</p>
      <div className="s-progress"><i style={{ width: `${((i + 1) / n) * 100}%` }} /></div>
      <h1 className="s-h1">{s.t}</h1>
      <p className="s-text">{s.d}</p>
      <Nav onBack={() => (i > 0 ? go("step", i - 1) : go("pay"))} onNext={() => (i < n - 1 ? go("step", i + 1) : go("done"))} />
    </>);
  } else if (view.name === "done") {
    body = (<>
      <h1 className="s-h1">✓ {H.procDone}</h1>
      <p className="s-text">{H.offer}</p>
      <button className="s-cta" onClick={() => go("lesson", 0)}>
        <span className="s-cta-text"><b>{H.startLearn}</b><small>{T.menu.guide}</small></span>
        <span className="s-cta-arrow">{fwd}</span>
      </button>
      <button className="s-link" onClick={() => go("step", T.steps.length - 1)}>{bwd} {u.back}</button>
    </>);
  } else if (view.name === "lesson") {
    const i = view.i, l = T.lessons[i], n = T.lessons.length;
    body = (<>
      <p className="s-kicker">{H.lesson} {i + 1} {U.of} {n}</p>
      <div className="s-progress"><i style={{ width: `${((i + 1) / n) * 100}%` }} /></div>
      <h1 className="s-h1">{l.t}</h1>
      {LESSON_IMG[i] ? <img className="s-illus s-photo-illus" src={LESSON_IMG[i]} alt="" /> : <PlainScene index={i} />}
      <ol className="s-rules">{l.p.map((p, k) => <li key={k}>{p}</li>)}</ol>
      <Nav onBack={() => (i > 0 ? go("lesson", i - 1) : go("done"))}
           onNext={() => (i < n - 1 ? go("lesson", i + 1) : go("finish"))}
           nextLabel={i < n - 1 ? u.next : u.done} />
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
    <div className="s-wrap">{body}</div>
  </>);
}
