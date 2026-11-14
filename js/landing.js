// Landing page behaviour: contact buttons, consultation form, reviews, tracking.
import { CONFIG, telNumber } from "./config.js";
import { REVIEWS, SAMPLE_REVIEWS } from "./data/reviews.js";
import { initTracking, trackContactLinks, submitLead } from "./track.js";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// --- WhatsApp / call buttons: shown only when a number is configured ---
const waMsg = "Hello, I would like to book driving lessons.";
document.querySelectorAll("[data-wa]").forEach((a) => {
  if (!CONFIG.whatsapp) return;
  a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waMsg)}`;
  a.target = "_blank"; a.rel = "noopener"; a.hidden = false;
});
document.querySelectorAll("[data-tel]").forEach((a) => {
  const t = telNumber(); if (!t) return;
  a.href = `tel:+${t}`; a.hidden = false;
});

// --- consultation form ---
const form = document.getElementById("book");
const err = document.getElementById("c-err");
const showErr = (m) => { err.textContent = m; err.hidden = false; };
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  if (d.website) return; // bot trap
  err.hidden = true;
  const name = (d.name || "").trim(), phone = (d.phone || "").trim(), email = (d.email || "").trim();
  if (!name || phone.replace(/\D/g, "").length < 7) return showErr("Please enter your name and WhatsApp number.");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showErr("Please enter a valid email address.");
  const btn = form.querySelector("button[type=submit]");
  btn.disabled = true; btn.textContent = "Sending…";
  const lead = { name, phone, email, notes: (d.notes || "").trim(), source: "landing" };
  const waText = `Hello, I would like a free consultation.\nName: ${name}\nPhone: ${phone}${email ? `\nEmail: ${email}` : ""}${lead.notes ? `\nMessage: ${lead.notes}` : ""}`;
  try {
    await submitLead(lead, waText);
    form.hidden = true;
    document.getElementById("book-done").hidden = false;
  } catch {
    btn.disabled = false; btn.textContent = "Get a free call back";
    showErr(CONFIG.formEndpoint || CONFIG.whatsapp ? "Something went wrong. Please try again." : "Online booking is not set up yet. Please call or message your instructor directly.");
  }
});

// --- reviews (real ones, or clearly marked samples) ---
function selfie({ skin, hair, shirt }) {
  return `<svg viewBox="0 0 120 160" class="l-illu" role="img" aria-label="Illustrated student photo">
    <rect width="120" height="160" fill="#e9eef2"/><rect x="0" y="110" width="120" height="50" fill="#d6dde3"/>
    <path d="M18 160 q42 -60 84 0z" fill="${shirt}"/><rect x="52" y="92" width="16" height="16" fill="${skin}"/>
    <ellipse cx="60" cy="72" rx="24" ry="28" fill="${skin}"/>
    <path d="M36 66 q2 -30 24 -30 q22 0 24 30 q-6 -14 -24 -16 q-18 2 -24 16z" fill="${hair}"/>
    <circle cx="51" cy="74" r="2.6" fill="#222"/><circle cx="69" cy="74" r="2.6" fill="#222"/>
    <path d="M50 86 q10 9 20 0" stroke="#222" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <rect x="80" y="104" width="30" height="20" rx="3" fill="#fff" stroke="#111" stroke-width="1.5" transform="rotate(-12 95 114)"/>
    <rect x="84" y="108" width="8" height="10" fill="#cfd8dc" transform="rotate(-12 95 114)"/></svg>`;
}
function licence({ skin, hair }) {
  return `<svg viewBox="0 0 120 160" class="l-illu" role="img" aria-label="Illustrated licence card">
    <rect width="120" height="160" fill="#f2f2f2"/><g transform="translate(10 50)">
    <rect width="100" height="64" rx="7" fill="#fff" stroke="#111" stroke-width="1.5"/>
    <rect width="100" height="14" rx="7" fill="#111"/><rect y="7" width="100" height="7" fill="#111"/>
    <text x="50" y="10" font-size="6.5" text-anchor="middle" fill="#fff" font-weight="700" letter-spacing=".5">DRIVING LICENCE</text>
    <rect x="7" y="20" width="26" height="34" rx="3" fill="#e9eef2"/>
    <ellipse cx="20" cy="34" rx="7" ry="8" fill="${skin}"/><path d="M13 32 q1 -9 7 -9 q6 0 7 9 q-3 -5 -7 -5 q-4 0 -7 5z" fill="${hair}"/>
    <path d="M10 54 q10 -12 20 0z" fill="#90a4ae"/>
    <rect x="40" y="22" width="52" height="5" rx="2.5" fill="#cfd8dc"/><rect x="40" y="32" width="40" height="5" rx="2.5" fill="#cfd8dc"/><rect x="40" y="42" width="46" height="5" rx="2.5" fill="#cfd8dc"/>
    <text x="92" y="60" font-size="6" text-anchor="end" fill="#999">SAMPLE</text></g>
    <circle cx="96" cy="40" r="12" fill="#111"/><path d="M90 40 l4 4 8 -9" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`;
}
const list = document.getElementById("reviews-list");
list.innerHTML = REVIEWS.length
  ? REVIEWS.map((r) => `<figure class="l-review"><div class="l-review-imgs"><img src="${esc(r.selfie)}" alt="${esc(r.name)}" loading="lazy"><img src="${esc(r.licence)}" alt="${esc(r.name)}'s driving licence" loading="lazy"></div>
      <div class="l-stars" aria-label="5 out of 5">★★★★★</div><blockquote>“${esc(r.text)}”</blockquote><figcaption>${esc(r.name)}</figcaption></figure>`).join("")
  : SAMPLE_REVIEWS.map((r) => `<figure class="l-review"><span class="l-sample">Sample</span><div class="l-review-imgs">${selfie(r)}${licence(r)}</div>
      <div class="l-stars" aria-label="5 out of 5">★★★★★</div><blockquote>“${esc(r.text)}”</blockquote><figcaption>${esc(r.name)}</figcaption></figure>`).join("");

// --- sticky bar: hide while the form is on screen ---
const sticky = document.getElementById("l-sticky");
new IntersectionObserver(([e]) => sticky.classList.toggle("away", e.isIntersecting), { threshold: 0.2 }).observe(form.parentElement);

initTracking();
trackContactLinks(document);
