// Google Ads / gtag loader and conversion helpers. Does nothing until CONFIG.googleAdsId is set.
import { CONFIG } from "./config.js";

let ready = false;
export function initTracking() {
  if (!CONFIG.googleAdsId || ready) return;
  ready = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(CONFIG.googleAdsId)}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", CONFIG.googleAdsId);
}

// kind: "lead" | "whatsapp" | "call"
export function track(kind) {
  const label = CONFIG.conversions[kind];
  if (!window.gtag || !CONFIG.googleAdsId) return;
  if (label) window.gtag("event", "conversion", { send_to: `${CONFIG.googleAdsId}/${label}` });
  window.gtag("event", kind);
}

// Track every WhatsApp and phone link on the page.
export function trackContactLinks(root = document) {
  root.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    if (a.href.includes("wa.me/")) track("whatsapp");
    else if (a.href.startsWith("tel:")) track("call");
  });
}

// Sends a form either to CONFIG.formEndpoint or, if not set, to WhatsApp with the details filled in.
export async function submitLead(data, waText) {
  if (CONFIG.formEndpoint) {
    const res = await fetch(CONFIG.formEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ ...data, page: location.pathname, sentAt: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error("send failed");
    track("lead");
    return "sent";
  }
  if (CONFIG.whatsapp) {
    track("lead");
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waText)}`, "_blank", "noopener");
    return "whatsapp";
  }
  throw new Error("no destination");
}
