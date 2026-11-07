// Storage: PostgreSQL when DATABASE_URL is set (production, e.g. Neon/Supabase/Vercel Postgres),
// otherwise a local JSON file in ./data (development or a single VPS).
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

let pool;
async function pg() {
  if (!pool) {
    const { Pool } = (await import("pg")).default;
    pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false } });
    await pool.query(`CREATE TABLE IF NOT EXISTS registrations (
      id TEXT PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), data JSONB NOT NULL)`);
  }
  return pool;
}

const FILE = path.join(process.cwd(), "data", "registrations.json");
async function readFile() {
  try { return JSON.parse(await fs.readFile(FILE, "utf8")); } catch { return []; }
}
async function writeFile(rows) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2));
}
const useDb = () => !!process.env.DATABASE_URL;

export async function listRegistrations() {
  if (useDb()) {
    const { rows } = await (await pg()).query("SELECT id, created_at, data FROM registrations ORDER BY created_at DESC");
    return rows.map(r => ({ ...r.data, id: r.id, createdAt: new Date(r.created_at).toISOString() }));
  }
  return (await readFile()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addRegistration(data) {
  const row = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString(), status: "new", note: "" };
  if (useDb()) {
    const { id, createdAt, ...rest } = row;
    await (await pg()).query("INSERT INTO registrations (id, created_at, data) VALUES ($1, $2, $3)", [id, createdAt, rest]);
  } else {
    const rows = await readFile(); rows.push(row); await writeFile(rows);
  }
  return row;
}

export async function updateRegistration(id, patch) {
  if (useDb()) {
    await (await pg()).query("UPDATE registrations SET data = data || $2::jsonb WHERE id = $1", [id, JSON.stringify(patch)]);
  } else {
    const rows = await readFile(); const r = rows.find(x => x.id === id);
    if (r) { Object.assign(r, patch); await writeFile(rows); }
  }
}

export async function deleteRegistration(id) {
  if (useDb()) await (await pg()).query("DELETE FROM registrations WHERE id = $1", [id]);
  else await writeFile((await readFile()).filter(x => x.id !== id));
}
