import { NextResponse } from "next/server";
import { checkPassword, tokenFor, COOKIE } from "@/lib/auth";

export async function POST(req) {
  const form = await req.formData();
  const p = form.get("password");
  const url = new URL("/admin", req.url);
  if (!checkPassword(p)) { url.searchParams.set("error", "1"); return NextResponse.redirect(url, 303); }
  const res = NextResponse.redirect(url, 303);
  res.cookies.set(COOKIE, tokenFor(p), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
