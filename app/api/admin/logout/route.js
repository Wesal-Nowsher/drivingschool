import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/auth";

export async function POST(req) {
  const res = NextResponse.redirect(new URL("/admin", req.url), 303);
  res.cookies.delete(COOKIE);
  return res;
}
