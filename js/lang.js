// Landing page languages. Each language lives in its own address: /ur, /ar, /ps … (English is /).
export const LANGS = [
  { code: "en", name: "English", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "ur", name: "اردو", dir: "rtl" },
  { code: "ps", name: "پښتو", dir: "rtl" },
  { code: "hi", name: "हिन्दी", dir: "ltr" },
  { code: "ml", name: "മലയാളം", dir: "ltr" },
  { code: "am", name: "አማርኛ", dir: "ltr" },
  { code: "fil", name: "Filipino", dir: "ltr" },
  { code: "zh", name: "中文", dir: "ltr" },
];
const CODES = LANGS.map((l) => l.code);

// Index of extra (non-HTML) strings in each language file.
export const K = { title: 171, desc: 172, errName: 173, errEmail: 174, sending: 175, failed: 176, sample: 177, review: 178, language: 181 };

const save = (c) => { try { localStorage.setItem("site-lang", c); } catch {} };
const saved = () => { try { return localStorage.getItem("site-lang"); } catch { return null; } };

export function currentLang() {
  const seg = location.pathname.split("/")[1];
  if (CODES.includes(seg)) return seg;
  const q = new URLSearchParams(location.search).get("lang");
  if (CODES.includes(q)) return q;
  if (location.pathname === "/" || location.pathname === "/index.html") {
    const s = saved();
    if (CODES.includes(s)) return s;
  }
  return "en";
}

export const langUrl = (code) => (code === "en" ? "/" : `/${code}`);

// Loads the language file and translates every [data-i18n] element. Returns the string list.
export async function applyLang(code) {
  const lang = LANGS.find((l) => l.code === code) || LANGS[0];
  const t = (await import(`./data/landing/${lang.code}.js`)).default;
  const html = document.documentElement;
  html.lang = lang.code; html.dir = lang.dir;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const s = t[+el.dataset.i18n.slice(1)];
    if (s) el.textContent = s;
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const s = t[+el.dataset.i18nAria.slice(1)];
    if (s) el.setAttribute("aria-label", s);
  });
  document.title = `${t[K.title]} | Yousef Ismail M. Basal`;
  document.querySelector('meta[name="description"]')?.setAttribute("content", t[K.desc]);
  let canon = document.querySelector('link[rel="canonical"]');
  if (!canon) { canon = document.createElement("link"); canon.rel = "canonical"; document.head.appendChild(canon); }
  canon.href = location.origin + langUrl(lang.code);
  document.querySelectorAll('a[href^="/guide"]').forEach((a) => { a.href = `/guide?lang=${lang.code}`; });
  save(lang.code);
  buildSwitcher(lang, t);
  return t;
}

function buildSwitcher(lang, t) {
  const host = document.getElementById("lang-switch");
  if (!host) return;
  host.innerHTML = `<button type="button" class="l-lang-btn" aria-haspopup="true" aria-expanded="false" aria-label="${t[K.language]}">
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/></svg>
      <span>${lang.name}</span></button>
    <ul class="l-lang-menu" hidden>${LANGS.map((l) => `<li><a href="${langUrl(l.code)}" lang="${l.code}" dir="${l.dir}" data-code="${l.code}" class="${l.code === lang.code ? "on" : ""}">${l.name}</a></li>`).join("")}</ul>`;
  const btn = host.querySelector("button"), menu = host.querySelector("ul");
  const close = () => { menu.hidden = true; btn.setAttribute("aria-expanded", "false"); };
  btn.addEventListener("click", (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; btn.setAttribute("aria-expanded", String(!menu.hidden)); });
  document.addEventListener("click", close);
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-code]");
    if (!a) return;
    save(a.dataset.code);
    // Locally (no rewrites) fall back to ?lang=; on the live site /ur etc. work directly.
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") { e.preventDefault(); location.href = `/?lang=${a.dataset.code}`; }
  });
}
