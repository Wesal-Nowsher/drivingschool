"use client";
import { useState } from "react";

function Chips({ value, onChange, options }) {
  return <div className="chips">{options.map(([k, label]) =>
    <button type="button" key={k} className={`chip ${value === k ? "on" : ""}`} onClick={() => onChange(k)}>{label}</button>)}</div>;
}

export default function Register({ R, lang, onDone, footer }) {
  const [f, setF] = useState({ name: "", phone: "+973 ", nationality: "", area: "", gear: "", time: "", licence: "", notes: "", website: "" });
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (v) => setF({ ...f, [k]: typeof v === "string" ? v : v.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim() || f.phone.replace(/\D/g, "").length < 7) { setErr(R.required); return; }
    setErr(""); setSending(true);
    try {
      const res = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...f, lang }) });
      if (!res.ok) throw new Error();
      onDone();
    } catch { setErr(R.error); } finally { setSending(false); }
  }

  return (<form onSubmit={submit}>
    <div className="card">
      <h2>📝 {R.title}</h2>
      <p className="muted">{R.intro}</p>
      <label htmlFor="name">{R.name} *</label>
      <input id="name" value={f.name} onChange={set("name")} maxLength={100} autoComplete="name" required />
      <label htmlFor="phone">{R.phone} *</label>
      <input id="phone" value={f.phone} onChange={set("phone")} inputMode="tel" dir="ltr" autoComplete="tel" maxLength={30} required />
      <label>{R.gear}</label>
      <Chips value={f.gear} onChange={set("gear")} options={[["auto", "🅰️ " + R.auto], ["manual", "⚙️ " + R.manual]]} />
      <label>{R.time}</label>
      <Chips value={f.time} onChange={set("time")} options={[["morning", "🌅 " + R.morning], ["afternoon", "☀️ " + R.afternoon], ["evening", "🌙 " + R.evening]]} />
      <label>{R.licence}</label>
      <Chips value={f.licence} onChange={set("licence")} options={[["yes", "✅ " + R.yes], ["no", "⏳ " + R.no]]} />
      <label htmlFor="nat">{R.nationality}</label>
      <input id="nat" value={f.nationality} onChange={set("nationality")} maxLength={60} />
      <label htmlFor="area">{R.area}</label>
      <input id="area" value={f.area} onChange={set("area")} maxLength={80} />
      <label htmlFor="notes">{R.notes}</label>
      <textarea id="notes" rows={2} value={f.notes} onChange={set("notes")} maxLength={500} />
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set("website")} />
    </div>
    {err && <div className="card" style={{ color: "var(--bad)" }}>{err}</div>}
    <button className="btn primary big" type="submit" disabled={sending}>{sending ? R.sending : R.submit}</button>
    {footer}
  </form>);
}
