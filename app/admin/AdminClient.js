"use client";
import { useMemo, useState } from "react";
import { I18N } from "@/lib/i18n";

const STATUSES = ["new", "contacted", "enrolled", "completed", "cancelled"];
const LABEL = { auto: "Automatic", manual: "Manual", morning: "Morning", afternoon: "Afternoon", evening: "Evening", yes: "Has learner licence", no: "No learner licence yet" };

const waNumber = (p) => {
  let d = p.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.length === 8) d = "973" + d; // local Bahrain number
  return d;
};

export default function AdminClient({ initial }) {
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");

  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length])), [rows]);
  const shown = rows.filter((r) => (filter === "all" || r.status === filter) &&
    (!q || [r.name, r.phone, r.nationality, r.area, r.notes].join(" ").toLowerCase().includes(q.toLowerCase())));

  async function patch(id, data) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...data } : r)));
    const res = await fetch(`/api/admin/registrations/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.status === 401) location.reload();
  }
  async function remove(id) {
    if (!confirm("Delete this registration permanently?")) return;
    setRows((rs) => rs.filter((r) => r.id !== id));
    await fetch(`/api/admin/registrations/${id}`, { method: "DELETE" });
  }
  function exportCsv() {
    const cols = ["createdAt", "name", "phone", "nationality", "area", "gear", "time", "licence", "lang", "status", "notes", "note"];
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => `"${String(r[c] ?? "").replace(/"/g, '""')}"`).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
    a.download = "registrations.csv"; a.click();
  }

  return (<>
    <header>
      <h1><img className="logo" src="/logo.svg" alt="" />Instructor dashboard</h1>
      <form method="post" action="/api/admin/logout"><button>Log out</button></form>
    </header>
    <main className="wide">
      <div className="stats">
        <div className="card"><b>{rows.length}</b><span className="muted">Total</span></div>
        {STATUSES.map((s) => <div className="card" key={s}><b>{counts[s]}</b><span className="muted" style={{ textTransform: "capitalize" }}>{s}</span></div>)}
      </div>
      <div className="toolbar">
        <input placeholder="Search name, phone, area…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn small" onClick={exportCsv}>⬇ Export CSV</button>
        <button className="btn small" onClick={() => location.reload()}>↻ Refresh</button>
      </div>
      {shown.length === 0 && <div className="card muted">No registrations yet. Share your app link with students so they can register.</div>}
      {shown.map((r) => {
        const greeting = `Hello ${r.name}, this is your driving instructor. Thank you for registering! When would be a good time for your first class?`;
        return (
          <div className="card reg" key={r.id}>
            <div className="top">
              <h3 style={{ margin: 0 }}>{r.name}</h3>
              <span className={`badge ${r.status}`}>{r.status}</span>
              <span className="muted" style={{ marginInlineStart: "auto" }}>{new Date(r.createdAt).toLocaleString()}</span>
            </div>
            <div dir="ltr" style={{ fontWeight: 600 }}>{r.phone}</div>
            <div className="muted">
              {[r.nationality, r.area, LABEL[r.gear], LABEL[r.time], LABEL[r.licence], I18N[r.lang]?.name].filter(Boolean).join(" · ")}
            </div>
            {r.notes && <p>💬 {r.notes}</p>}
            <div className="toolbar" style={{ marginTop: 8, marginBottom: 0 }}>
              <a className="btn small wa" href={`https://wa.me/${waNumber(r.phone)}?text=${encodeURIComponent(greeting)}`} target="_blank" rel="noopener noreferrer"
                 onClick={() => r.status === "new" && patch(r.id, { status: "contacted" })}>💬 WhatsApp</a>
              <a className="btn small" href={`tel:+${waNumber(r.phone)}`}>📞 Call</a>
              <select value={r.status} onChange={(e) => patch(r.id, { status: e.target.value })} style={{ width: "auto", flex: "none" }}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn small" onClick={() => remove(r.id)}>🗑 Delete</button>
            </div>
            <input placeholder="Private note (e.g. paid 50 BD, class Sunday 4pm)" defaultValue={r.note || ""}
              onBlur={(e) => e.target.value !== (r.note || "") && patch(r.id, { note: e.target.value })} style={{ marginTop: 8 }} />
          </div>
        );
      })}
    </main>
  </>);
}
