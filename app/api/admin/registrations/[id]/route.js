import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateRegistration, deleteRegistration } from "@/lib/db";

const STATUSES = ["new", "contacted", "enrolled", "completed", "cancelled"];

export async function PATCH(req, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const b = await req.json().catch(() => ({}));
  const patch = {};
  if (STATUSES.includes(b.status)) patch.status = b.status;
  if (typeof b.note === "string") patch.note = b.note.slice(0, 1000);
  await updateRegistration(id, patch);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteRegistration(id);
  return NextResponse.json({ ok: true });
}
