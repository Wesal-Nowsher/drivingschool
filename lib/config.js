// ===== Teacher settings — edit these values =====
export const CONFIG = {
  // true = minimal app: language → payment details only. false = full guided app.
  simpleMode: true,
  teacherName: "Yousef Ismail M. Basal",
  instructorCode: "1057",
  instructorPhoto: "/instructor.jpg",
  // WhatsApp number with country code, digits only, e.g. "97333123456". Leave "" to hide the button.
  whatsapp: process.env.NEXT_PUBLIC_TEACHER_WHATSAPP || "",
  // Keys of AI-generated illustrations saved in public/illustrations/<key>.png (see docs/image-prompts.md)
  generatedImages: [],
  fees: { eyeTest: 5, learningBook: 22, examAppointment: 16, hours: 22, perHour: 7, licenseCard: 20 }
};
