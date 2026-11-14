// ===== Site settings: edit these values =====
export const CONFIG = {
  teacherName: "Yousef Ismail M. Basal",
  instructorCode: "1057",
  instructorPhoto: "/instructor.jpg",

  // WhatsApp and phone numbers with country code, digits only, e.g. "97333123456".
  // Leave "" until known: buttons that need them are hidden or greyed out.
  whatsapp: "97333382965",
  phone: "", // defaults to the WhatsApp number when empty

  // Where form submissions are sent. Any service that accepts a JSON POST works,
  // e.g. Formspree ("https://formspree.io/f/xxxxxx") or a Google Apps Script web app.
  // When empty, forms open WhatsApp with the details pre-filled instead.
  formEndpoint: "",

  // Google Ads conversion tracking, e.g. googleAdsId: "AW-123456789".
  // Conversion labels come from Google Ads > Goals > Conversions.
  googleAdsId: "",
  conversions: { lead: "", whatsapp: "", call: "" },

  appLinks: {
    ios: "https://apps.apple.com/bh/app/mawaeid/id1555921204",
    android: "https://play.google.com/store/apps/details?id=com.moibh.qms",
  },

  fees: { eyeTest: 5, learningBook: 22, examAppointment: 16, hours: 22, perHour: 7, licenseCard: 20 },
};

export const telNumber = () => CONFIG.phone || CONFIG.whatsapp;
