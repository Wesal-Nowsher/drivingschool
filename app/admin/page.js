import { isAdmin } from "@/lib/auth";
import { listRegistrations } from "@/lib/db";
import AdminClient from "./AdminClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Instructor Admin", robots: { index: false } };

export default async function AdminPage({ searchParams }) {
  const sp = await searchParams;
  if (!process.env.ADMIN_PASSWORD) {
    return <main><div className="card"><h2>Admin not configured</h2><p>Set the <code>ADMIN_PASSWORD</code> environment variable and restart the app.</p></div></main>;
  }
  if (!(await isAdmin())) {
    return (<>
      <header><h1>🔒 Instructor login</h1></header>
      <main>
        <form className="card" method="post" action="/api/admin/login">
          <label htmlFor="pw">Password</label>
          <input id="pw" name="password" type="password" autoComplete="current-password" required autoFocus />
          {sp?.error && <p style={{ color: "var(--bad)", marginTop: 8 }}>Wrong password.</p>}
          <button className="btn primary" style={{ marginTop: 12 }}>Log in</button>
        </form>
      </main>
    </>);
  }
  return <AdminClient initial={await listRegistrations()} />;
}
