import crypto from "crypto";
import { cookies } from "next/headers";

export const COOKIE = "ds_admin";
const secret = () => process.env.ADMIN_PASSWORD || "";

export function tokenFor(password) {
  return crypto.createHmac("sha256", password).update("drivingschool-admin").digest("hex");
}
export function checkPassword(p) {
  const s = secret();
  if (!s || typeof p !== "string") return false;
  const a = Buffer.from(tokenFor(p)), b = Buffer.from(tokenFor(s));
  return crypto.timingSafeEqual(a, b);
}
export async function isAdmin() {
  const s = secret();
  if (!s) return false;
  const v = (await cookies()).get(COOKIE)?.value || "";
  const a = Buffer.from(v), b = Buffer.from(tokenFor(s));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
