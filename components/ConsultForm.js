"use client";
import { useState } from "react";

const TIMES = [["morning", "Morning"], ["afternoon", "Afternoon"], ["evening", "Evening"]];
const GEARS = [["auto", "Automatic"], ["manual", "Manual"]];

function Chips({ value, onChange, options }) {
  return (
    <div className="l-chips">
      {options.map(([k, label]) => (
        <button type="button" key={k} className={`l-chip ${value === k ? "on" : ""}`} onClick={() => onChange(k)}>{label}</button>
      ))}
    </div>
  );
}

export default function ConsultForm() {
  const [f, setF] = useState({ name: "", phone: "+973 ", gear: "", time: "", licence: "", notes: "", website: "" });
  const [state, setState] = useState("idle"); // idle | sending | done
  const [err, setErr] = useState("");
  const set = (k) => (v) => setF({ ...f, [k]: typeof v === "string" ? v : v.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim() || f.phone.replace(/\D/g, "").length < 7) { setErr("Please enter your name and WhatsApp number."); return; }
    setErr(""); setState("sending");
    try {
      const res = await fetch("/api/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, lang: "en", source: "landing" }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch { setState("idle"); setErr("Something went wrong. Please try again."); }
  }

  if (state === "done") return (
    <div className="l-form l-done">
      <div className="l-done-ic">✓</div>
      <h3>Request received</h3>
      <p>Thank you. Your instructor will contact you on WhatsApp to arrange your consultation.</p>
    </div>
  );

  return (
    <form className="l-form" onSubmit={submit} id="book">
      <h3>Book a free consultation</h3>
      <p className="l-muted">Tell us a little about you and we will get back to you on WhatsApp.</p>
      <label htmlFor="c-name">Full name *</label>
      <input id="c-name" value={f.name} onChange={set("name")} maxLength={100} autoComplete="name" required />
      <label htmlFor="c-phone">WhatsApp number *</label>
      <input id="c-phone" value={f.phone} onChange={set("phone")} inputMode="tel" dir="ltr" autoComplete="tel" maxLength={30} required />
      <label>Car type</label>
      <Chips value={f.gear} onChange={set("gear")} options={GEARS} />
      <label>Preferred time</label>
      <Chips value={f.time} onChange={set("time")} options={TIMES} />
      <label>Do you have a learning licence?</label>
      <Chips value={f.licence} onChange={set("licence")} options={[["yes", "Yes"], ["no", "Not yet"]]} />
      <label htmlFor="c-notes">Message (optional)</label>
      <textarea id="c-notes" rows={2} value={f.notes} onChange={set("notes")} maxLength={500} />
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.website} onChange={set("website")} />
      {err && <p className="l-err">{err}</p>}
      <button className="l-btn l-btn-dark l-full" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Book consultation"}</button>
    </form>
  );
}
