// ===== Landing page content. Edit freely. =====
// Only put real, verified facts here: the page shows whatever is set.
export const SITE = {
  headline: "Get your Bahrain driving licence with a certified instructor",
  sub: "Step-by-step guidance from your first eye test to your licence card. Clear fees, flexible class times and patient training.",

  // Leave a value as null to hide that stat.
  stats: [
    { label: "Instructor code", value: "1057" },
    { label: "Years teaching", value: null },      // e.g. "12+"
    { label: "Students trained", value: null },    // e.g. "1,500+"
    { label: "Languages", value: null },           // e.g. "English, Arabic, Urdu"
  ],

  about: [
    "Approved driving instructor in the Kingdom of Bahrain, registered under instructor code 1057.",
    "Training covers everything the driving test checks: safety checks, mirrors and signals, roundabouts, junctions and traffic lights, reversing and parking.",
    "Students get a free interactive guide that explains the licence process and the road rules before the first practical class.",
  ],

  // Success stories. Add photos to public/reviews/ and list them here.
  // Use only real students who agreed to share their photos.
  // { name: "First name", text: "What they said", selfie: "/reviews/ali-selfie.jpg", licence: "/reviews/ali-licence.jpg" }
  reviews: [],

  faq: [
    { q: "What do I need to start?", a: "Your original CPR and a copy, and an ATM or debit card for the government fees at the branch." },
    { q: "How much does it cost in total?", a: "217 BD: 63 BD government fees (eye test, learning book, exam appointment, licence card) and 154 BD for 22 hours of classes." },
    { q: "Can I pay per class?", a: "Yes. You can pay everything at once, or pay for each class separately." },
    { q: "Where is the driving test?", a: "At the Driving School Directorate in Isa Town, once your training hours are complete." },
    { q: "What if I fail the test?", a: "You can book the test again." },
  ],
};
