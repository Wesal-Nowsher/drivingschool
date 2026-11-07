import { NextResponse } from "next/server";
import { addRegistration } from "@/lib/db";
import { I18N } from "@/lib/i18n";

const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const pick = (v, allowed) => (allowed.includes(v) ? v : "");

export async function POST(req) {
  let b;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }
  if (b.website) return NextResponse.json({ ok: true }); // honeypot: bots fill hidden field
  const name = str(b.name, 100);
  const phone = str(b.phone, 30).replace(/[^\d+]/g, "");
  if (!name || phone.replace(/\D/g, "").length < 7) return NextResponse.json({ error: "required" }, { status: 400 });
  await addRegistration({
    name, phone,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str(b.email, 120)) ? str(b.email, 120) : "",
    nationality: str(b.nationality, 60),
    area: str(b.area, 80),
    gear: pick(b.gear, ["auto", "manual"]),
    time: pick(b.time, ["morning", "afternoon", "evening"]),
    licence: pick(b.licence, ["yes", "no"]),
    notes: str(b.notes, 500),
    lang: pick(b.lang, Object.keys(I18N)) || "en",
    source: pick(b.source, ["app", "landing"]) || "app",
  });
  return NextResponse.json({ ok: true });
}
