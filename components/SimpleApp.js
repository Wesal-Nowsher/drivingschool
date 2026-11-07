"use client";
// Minimal version: choose language → payment details. No colours, no illustrations.
import { useEffect, useState } from "react";
import { I18N } from "@/lib/i18n";
import { HUB } from "@/lib/hub-i18n";
import { CONFIG } from "@/lib/config";

const F = CONFIG.fees;
const get = (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export default function SimpleApp() {
  const [lang, setLang] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { const l = get("lang"); if (l && I18N[l]) setLang(l); setReady(true); }, []);
  useEffect(() => {
    const d = document.documentElement;
    d.lang = lang || "en"; d.dir = lang ? I18N[lang].dir : "ltr";
    window.scrollTo(0, 0);
  }, [lang]);
  if (!ready) return null;

  if (!lang) return (
    <div className="s-wrap">
      <h1 className="s-h1">Choose your language</h1>
      <div className="s-list">
        {Object.keys(I18N).map((k) => (
          <button key={k} className="s-row" onClick={() => { set("lang", k); setLang(k); }}>{I18N[k].name}</button>))}
      </div>
    </div>
  );

  const T = I18N[lang], H = HUB[lang], u = T.ui, c = T.costs;
  const cls = F.hours * F.perHour;
  const gov = [[c.eye, F.eyeTest], [c.book, F.learningBook], [c.exam, F.examAppointment], [c.card, F.licenseCard]];
  const govTotal = gov.reduce((s, x) => s + x[1], 0);
  const bd = (n) => <span className="s-amt" dir="ltr">{n} {u.bd}</span>;

  return (
    <div className="s-wrap">
      <h1 className="s-h1">{H.pay}</h1>

      <h2 className="s-h2">{H.ins}</h2>
      <table className="s-table"><tbody>
        <tr><td>{c.classes}<div className="s-muted" dir="auto">{F.hours} {u.hours} × {F.perHour} {u.bd}</div></td><td>{bd(cls)}</td></tr>
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
      <button className="s-link" onClick={() => { set("lang", null); setLang(null); }}>{H.changeLang}</button>
    </div>
  );
}
