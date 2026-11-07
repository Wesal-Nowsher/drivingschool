"use client";
import { useEffect, useState } from "react";
import { I18N } from "@/lib/i18n";
import { REG } from "@/lib/reg-i18n";
import { CONFIG } from "@/lib/config";

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

export default function Home() {
  const [lang, setLangState] = useState(null);
  const [view, setView] = useState({ name: "lang" });
  const [done, setDone] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = store.get("lang", null);
    setDone(store.get("done", []));
    if (saved && I18N[saved]) { setLangState(saved); setView({ name: "home" }); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!lang) return;
    document.documentElement.lang = lang;
    document.documentElement.dir = I18N[lang].dir;
  }, [lang]);

  const go = (name, extra = {}) => { setView({ name, ...extra }); window.scrollTo(0, 0); };
  const setLang = (code) => { setLangState(code); store.set("lang", code); go("home"); };

  if (!ready) return null;
  const T = lang ? I18N[lang] : null;
  const R = lang ? REG[lang] : null;

  return (
    <>
      <header>
        <h1>🚗 Bahrain Driving Licence</h1>
        {lang && view.name !== "lang" && <button onClick={() => go("lang")} aria-label="Language">🌐</button>}
      </header>
      <main>
        {view.name === "lang" || !T ? <LangScreen onPick={setLang} /> :
         view.name === "home" ? <HomeScreen T={T} R={R} done={done} go={go} /> :
         view.name === "steps" ? <Steps T={T} i={view.i ?? 0} go={go} /> :
         view.name === "costs" ? <Costs T={T} go={go} /> :
         view.name === "docs" ? <Docs T={T} go={go} /> :
         view.name === "guide" ? <Guide T={T} done={done} go={go} /> :
         view.name === "lesson" ? <Lesson T={T} i={view.i} go={go} onDone={(i) => {
            const d = done.includes(i) ? done : [...done, i]; setDone(d); store.set("done", d);
            i < T.lessons.length - 1 ? go("lesson", { i: i + 1 }) : go("guide");
          }} /> :
         view.name === "quiz" ? <Quiz T={T} go={go} /> :
         view.name === "map" ? <MapView T={T} go={go} /> :
         view.name === "register" ? <Register T={T} R={R} lang={lang} go={go} /> : null}
      </main>
    </>
  );
}

const HomeBtn = ({ T, go }) => <button className="btn" onClick={() => go("home")}>🏠 {T.ui.home}</button>;
const WaBtn = ({ T }) => CONFIG.whatsapp
  ? <a className="btn wa" href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">💬 {T.ui.whatsapp}</a> : null;

function LangScreen({ onPick }) {
  return (<>
    <div className="card" style={{ textAlign: "center" }}>
      <div style={{ fontSize: 44 }}>🚗🇧🇭</div>
      <h2>Choose your language</h2>
      <p className="muted">اختر لغتك · اپنی زبان منتخب کریں · अपनी भाषा चुनें · ഭാഷ തിരഞ്ഞെടുക്കുക · زبان خود را انتخاب کنید</p>
    </div>
    {Object.keys(I18N).map((k) => <button key={k} className="btn lang" onClick={() => onPick(k)}>{I18N[k].name}</button>)}
  </>);
}

function HomeScreen({ T, R, done, go }) {
  const m = T.menu, pct = Math.round((done.length / T.lessons.length) * 100);
  return (<>
    <div className="card"><h2>{T.welcome.title}</h2><p>{T.welcome.text}</p></div>
    <button className="btn primary" onClick={() => go("register")}>📝 {R.menu}</button>
    <button className="btn" onClick={() => go("steps", { i: 0 })}>📋 {m.steps}</button>
    <button className="btn" onClick={() => go("costs")}>💰 {m.costs}</button>
    <button className="btn" onClick={() => go("docs")}>🪪 {m.docs}</button>
    <button className="btn" onClick={() => go("guide")}>📘 {m.guide}
      <div className="bar"><i style={{ width: `${pct}%` }} /></div>
      <span className="muted">{T.ui.progress}: {done.length}/{T.lessons.length}</span></button>
    <button className="btn" onClick={() => go("quiz")}>❓ {m.quiz}</button>
    <button className="btn" onClick={() => go("map")}>🗺️ {m.map}</button>
    <WaBtn T={T} />
    <p className="muted" style={{ marginTop: 8 }}>{T.ui.disclaimer}</p>
  </>);
}

function Steps({ T, i, go }) {
  const s = T.steps[i], n = T.steps.length;
  return (<>
    <div className="dots">{T.steps.map((_, j) => <i key={j} className={j <= i ? "on" : ""} />)}</div>
    <div className="card"><h3><span className="num">{i + 1}</span>{s.t}</h3><p>{s.d}</p></div>
    <div className="row">
      {i > 0 && <button className="btn" onClick={() => go("steps", { i: i - 1 })}>{T.ui.back}</button>}
      {i < n - 1
        ? <button className="btn primary" onClick={() => go("steps", { i: i + 1 })}>{T.ui.next}</button>
        : <button className="btn primary" onClick={() => go("home")}>{T.ui.done} ✓</button>}
    </div>
  </>);
}

function Costs({ T, go }) {
  const c = T.costs, u = T.ui, cls = F.hours * F.perHour;
  const total = F.eyeTest + F.learningBook + F.examAppointment + cls + F.licenseCard;
  const Row = ({ label, sub, v }) => <tr><td>{label}{sub && <div className="muted">{sub}</div>}</td><td className="amt">{v} {u.bd}</td></tr>;
  return (<>
    <h2>💰 {T.menu.costs}</h2>
    <div className="card"><table><tbody>
      <Row label={c.eye} v={F.eyeTest} />
      <Row label={c.book} v={F.learningBook} />
      <Row label={c.exam} v={F.examAppointment} />
      <Row label={c.classes} sub={`${F.hours} ${u.hours} × ${F.perHour} ${u.bd} ${u.perHour}`} v={cls} />
      <Row label={c.card} v={F.licenseCard} />
      <tr className="total"><td>{u.total}</td><td className="amt">{total} {u.bd}</td></tr>
    </tbody></table></div>
    <div className="card"><p>💳 {u.payNote}</p></div>
    <button className="btn primary" onClick={() => go("register")}>📝 {REG_menu(T)}</button>
    <HomeBtn T={T} go={go} />
  </>);
}
const REG_menu = (T) => REG[Object.keys(I18N).find((k) => I18N[k] === T)].menu;

function Docs({ T, go }) {
  return (<>
    <h2>🪪 {T.menu.docs}</h2>
    <div className="card"><ul>{T.docs.map((d) => <li key={d}>{d}</li>)}</ul></div>
    <HomeBtn T={T} go={go} />
  </>);
}

function Guide({ T, done, go }) {
  return (<>
    <h2>📘 {T.menu.guide}</h2>
    {T.lessons.map((l, i) => (
      <button key={i} className="btn" style={{ display: "flex", alignItems: "center" }} onClick={() => go("lesson", { i })}>
        <span className="num">{i + 1}</span>{l.t}{done.includes(i) && <span className="tick">✓</span>}
      </button>))}
    <HomeBtn T={T} go={go} />
  </>);
}

function Lesson({ T, i, go, onDone }) {
  const l = T.lessons[i], n = T.lessons.length;
  return (<>
    <div className="card">
      <h3><span className="num">{i + 1}</span>{l.t}</h3>
      <ul>{l.p.map((p) => <li key={p}>{p}</li>)}</ul>
      {(MEDIA[i] || []).map((m) => m.startsWith("img:")
        ? <img key={m} src={m.slice(4)} alt="" loading="lazy" />
        : <video key={m} src={m.slice(4)} controls playsInline preload="metadata" />)}
    </div>
    <div className="row">
      <button className="btn" onClick={() => go("guide")}>{T.ui.back}</button>
      <button className="btn primary" onClick={() => onDone(i)}>{i < n - 1 ? T.ui.next : T.ui.done} ✓</button>
    </div>
  </>);
}

function Quiz({ T, go }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  if (i >= T.quiz.length) return (<>
    <div className="card" style={{ textAlign: "center" }}>
      <h2>{T.ui.score}</h2>
      <div style={{ fontSize: 44, fontWeight: 700, color: "var(--red)" }}>{score} / {T.quiz.length}</div>
    </div>
    <button className="btn primary" onClick={() => { setI(0); setScore(0); setPicked(null); }}>{T.ui.retry}</button>
    <HomeBtn T={T} go={go} />
  </>);
  const q = T.quiz[i];
  return (<>
    <p className="muted">{i + 1} / {T.quiz.length}</p>
    <div className="card"><h3>{q.q}</h3></div>
    {q.o.map((o, j) => {
      const cls = picked === null ? "" : j === q.a ? "ok" : j === picked ? "bad" : "";
      return <button key={j} className={`btn opt ${cls}`} disabled={picked !== null}
        onClick={() => { setPicked(j); if (j === q.a) setScore(score + 1); }}>{o}</button>;
    })}
    {picked !== null && (<>
      <div className="card"><p>{picked === q.a ? `✅ ${T.ui.correct}` : `❌ ${T.ui.wrong} ${q.o[q.a]}`}</p></div>
      <button className="btn primary" onClick={() => { setI(i + 1); setPicked(null); }}>{T.ui.next}</button>
    </>)}
  </>);
}

function MapView({ T, go }) {
  return (<>
    <h2>🗺️ {T.menu.map}</h2>
    <div className="card"><img src="/assets/school-map.jpg" alt="" /></div>
    <HomeBtn T={T} go={go} />
  </>);
}

function Chips({ value, onChange, options }) {
  return <div className="chips">{options.map(([k, label]) =>
    <button type="button" key={k} className={`chip ${value === k ? "on" : ""}`} onClick={() => onChange(k)}>{label}</button>)}</div>;
}

function Register({ T, R, lang, go }) {
  const [f, setF] = useState({ name: "", phone: "+973 ", nationality: "", area: "", gear: "", time: "", licence: "", notes: "", website: "" });
  const [state, setState] = useState("idle");
  const [err, setErr] = useState("");
  const set = (k) => (v) => setF({ ...f, [k]: typeof v === "string" ? v : v.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim() || f.phone.replace(/\D/g, "").length < 7) { setErr(R.required); return; }
    setErr(""); setState("sending");
    try {
      const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, lang }) });
      if (!res.ok) throw new Error();
      setState("done"); store.set("registered", true); window.scrollTo(0, 0);
    } catch { setState("idle"); setErr(R.error); }
  }

  if (state === "done") return (<>
    <div className="card" style={{ textAlign: "center" }}><div style={{ fontSize: 44 }}>✅</div><p>{R.success}</p></div>
    <button className="btn primary" onClick={() => go("guide")}>📘 {T.menu.guide}</button>
    <HomeBtn T={T} go={go} />
  </>);

  return (<form onSubmit={submit}>
    <h2>📝 {R.title}</h2>
    <div className="card">
      <p className="muted">{R.intro}</p>
      <label htmlFor="name">{R.name} *</label>
      <input id="name" value={f.name} onChange={set("name")} maxLength={100} autoComplete="name" required />
      <label htmlFor="phone">{R.phone} *</label>
      <input id="phone" value={f.phone} onChange={set("phone")} inputMode="tel" dir="ltr" autoComplete="tel" maxLength={30} required />
      <label htmlFor="nat">{R.nationality}</label>
      <input id="nat" value={f.nationality} onChange={set("nationality")} maxLength={60} />
      <label htmlFor="area">{R.area}</label>
      <input id="area" value={f.area} onChange={set("area")} maxLength={80} />
      <label>{R.gear}</label>
      <Chips value={f.gear} onChange={set("gear")} options={[["auto", R.auto], ["manual", R.manual]]} />
      <label>{R.time}</label>
      <Chips value={f.time} onChange={set("time")} options={[["morning", R.morning], ["afternoon", R.afternoon], ["evening", R.evening]]} />
      <label>{R.licence}</label>
      <Chips value={f.licence} onChange={set("licence")} options={[["yes", R.yes], ["no", R.no]]} />
      <label htmlFor="notes">{R.notes}</label>
      <textarea id="notes" rows={3} value={f.notes} onChange={set("notes")} maxLength={500} />
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set("website")} />
    </div>
    {err && <div className="card" style={{ color: "var(--bad)" }}>{err}</div>}
    <button className="btn primary" type="submit" disabled={state === "sending"}>{state === "sending" ? R.sending : R.submit}</button>
    <HomeBtn T={T} go={go} />
  </form>);
}
