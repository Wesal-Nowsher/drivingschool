import Link from "next/link";
import { CONFIG } from "@/lib/config";
import { SITE } from "@/lib/site";
import ConsultForm from "@/components/ConsultForm";

export const metadata = {
  title: `${CONFIG.teacherName} | Driving Instructor in Bahrain`,
  description: SITE.sub,
};

const F = CONFIG.fees;
const gov = F.eyeTest + F.learningBook + F.examAppointment + F.licenseCard;
const classes = F.hours * F.perHour;
const total = gov + classes;

const PAYMENTS = [
  { title: "1st payment", when: "At the traffic office, on your eye test day", items: [["Eye test", F.eyeTest], ["Learning book", F.learningBook]] },
  { title: "2nd payment", when: "To your instructor, during your driving classes", items: [[`Training classes (${F.hours} hours)`, F.hours * F.perHour]], note: `${F.perHour} BD per class. Pay class by class, or all at once.` },
  { title: "3rd payment", when: "When your training is finished", items: [["Exam test appointment", F.examAppointment]] },
  { title: "4th payment", when: "Only after you pass the test", items: [["Driving licence card", F.licenseCard]] },
];

const STEPS = [
  ["Book a consultation", "Send the form or message on WhatsApp. We explain the process and plan your classes."],
  ["Eye test & learning licence", "Book on the Mawaeid app, pass the eye test and collect your learning book and licence."],
  ["22 hours of classes", "Practical training with your instructor, at times that suit you."],
  ["Driving test & licence", "Take the test at the Driving School Directorate in Isa Town and collect your licence card."],
];
const LEARN = [
  ["Before you drive", "Seat, mirrors, seat belt and safety checks."],
  ["Lanes & speed", "Keeping right, overtaking and safe distance."],
  ["Roundabouts", "Lanes and indicators for every exit."],
  ["Lights & junctions", "Stop lines, yellow box, STOP and give way."],
  ["Road signs", "What each shape and colour means."],
  ["Reversing & parking", "Exam reverse area and parking rules."],
];
const WHY = [
  ["Approved instructor", `Registered instructor code ${CONFIG.instructorCode}.`],
  ["Clear, fixed fees", `${total} BD in total, with no hidden costs.`],
  ["Pay your way", "Pay everything at once or per class."],
  ["Flexible times", "Morning, afternoon or evening classes."],
  ["Automatic or manual", "Train on the car type you need."],
  ["Free learning guide", "Interactive lessons in 6 languages before your first class."],
];

const wa = CONFIG.whatsapp, tel = CONFIG.phone || CONFIG.whatsapp;

export default function Landing() {
  const stats = SITE.stats.filter((s) => s.value);
  return (
    <div className="l-page">
      {/* nav */}
      <header className="l-nav">
        <div className="l-in l-nav-in">
          <a href="#top" className="l-brand">
            <img src={CONFIG.instructorPhoto} alt="" />
            <span><b>{CONFIG.teacherName}</b><small>Driving Instructor · Code {CONFIG.instructorCode}</small></span>
          </a>
          <nav className="l-links">
            <a href="#about">About</a><a href="#pricing">Pricing</a><a href="#reviews">Reviews</a><a href="#faq">FAQ</a>
          </nav>
          <a href="#book" className="l-btn l-btn-dark l-nav-cta">Book</a>
        </div>
      </header>

      {/* hero */}
      <section className="l-hero" id="top">
        <div className="l-in l-hero-grid">
          <div className="l-hero-left">
            <div className="l-portrait"><img src={CONFIG.instructorPhoto} alt={CONFIG.teacherName} /></div>
            <p className="l-eyebrow">Driving instructor in Bahrain</p>
            <h1>{SITE.headline}</h1>
            <p className="l-lead">{SITE.sub}</p>
            <div className="l-hero-cta">
              <a href="#pricing" className="l-btn l-btn-light">See pricing</a>
              <Link href="/" className="l-btn l-btn-light">Free learning guide</Link>
            </div>
          </div>
          <div className="l-hero-right"><ConsultForm /></div>
        </div>
      </section>

      {/* about */}
      <section className="l-sec" id="about">
        <div className="l-in l-about">
          <div>
            <p className="l-eyebrow">About</p>
            <h2>Experience you can trust on the road</h2>
            {SITE.about.map((p) => <p key={p} className="l-p">{p}</p>)}
          </div>
          {stats.length > 0 && (
            <div className="l-stats">
              {stats.map((s) => <div key={s.label} className="l-stat"><b>{s.value}</b><span>{s.label}</span></div>)}
            </div>
          )}
        </div>
      </section>

      {/* how it works */}
      <section className="l-sec l-alt">
        <div className="l-in">
          <p className="l-eyebrow">How it works</p>
          <h2>From first call to licence card</h2>
          <ol className="l-steps">
            {STEPS.map(([t, d], i) => <li key={t}><span className="l-step-n">{i + 1}</span><h3>{t}</h3><p>{d}</p></li>)}
          </ol>
        </div>
      </section>

      {/* pricing: 4 payments in the order you make them */}
      <section className="l-sec" id="pricing">
        <div className="l-in l-narrow">
          <p className="l-eyebrow">Pricing</p>
          <h2>You pay in 4 simple steps</h2>
          <p className="l-p">No big payment up front. You pay each part only when you reach that step.</p>
          <ol className="l-pay">
            {PAYMENTS.map((p, i) => {
              const sum = p.items.reduce((s, x) => s + x[1], 0);
              const running = PAYMENTS.slice(0, i + 1).reduce((s, q) => s + q.items.reduce((t, x) => t + x[1], 0), 0);
              return (
                <li key={p.title} className="l-pay-step">
                  <div className="l-pay-head">
                    <span className="l-pay-n">{i + 1}</span>
                    <div className="l-pay-title"><h3>{p.title}</h3><p>{p.when}</p></div>
                    <b className="l-pay-sum">{sum} BD</b>
                  </div>
                  <table className="l-pay-table"><tbody>
                    {p.items.map(([label, v]) => <tr key={label}><td>{label}</td><td>{v} BD</td></tr>)}
                  </tbody></table>
                  {p.note && <p className="l-pay-note">{p.note}</p>}
                  <p className="l-pay-run">Paid so far: <b>{running} BD</b></p>
                </li>
              );
            })}
          </ol>
          <div className="l-pay-total">
            <span>Total cost</span><b>{total} BD</b>
          </div>
          <p className="l-muted l-pay-foot">Government fees are paid at the traffic office. The 7 BD per class is paid to your instructor, all at once or class by class.</p>
          <a href="#book" className="l-btn l-btn-dark">Book a free consultation</a>
        </div>
      </section>

      {/* reviews */}
      <section className="l-sec l-alt" id="reviews">
        <div className="l-in">
          <p className="l-eyebrow">Success stories</p>
          <h2>Students who got their licence</h2>
          <div className="l-reviews">
            {SITE.reviews.length > 0 ? SITE.reviews.map((r) => (
              <figure key={r.name} className="l-review">
                <div className="l-review-imgs"><img src={r.selfie} alt={`${r.name}`} /><img src={r.licence} alt={`${r.name}'s driving licence`} /></div>
                <blockquote>“{r.text}”</blockquote>
                <figcaption>{r.name}</figcaption>
              </figure>
            )) : SITE.sampleReviews.map((r) => (
              <figure key={r.name} className="l-review">
                <span className="l-sample">Sample</span>
                <div className="l-review-imgs">
                  <SampleSelfie {...r} />
                  <SampleLicence {...r} />
                </div>
                <div className="l-stars" aria-label="5 out of 5">★★★★★</div>
                <blockquote>“{r.text}”</blockquote>
                <figcaption>{r.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* what you'll learn */}
      <section className="l-sec">
        <div className="l-in">
          <p className="l-eyebrow">What you will learn</p>
          <h2>Ready for the road and the test</h2>
          <div className="l-grid3">
            {LEARN.map(([t, d]) => <div key={t} className="l-card"><h3>{t}</h3><p>{d}</p></div>)}
          </div>
          <div className="l-guide">
            <div><h3>Try the free interactive guide</h3><p>Fees, the full process and game-style lessons in English, Arabic, Urdu, Hindi, Malayalam and Chinese.</p></div>
            <Link href="/" className="l-btn l-btn-white">Open guide</Link>
          </div>
        </div>
      </section>

      {/* why */}
      <section className="l-sec l-alt">
        <div className="l-in">
          <p className="l-eyebrow">Why train with us</p>
          <h2>Simple, honest and flexible</h2>
          <div className="l-grid3">
            {WHY.map(([t, d]) => <div key={t} className="l-card"><h3>✓ {t}</h3><p>{d}</p></div>)}
          </div>
        </div>
      </section>

      {/* faq */}
      <section className="l-sec" id="faq">
        <div className="l-in l-narrow">
          <p className="l-eyebrow">FAQ</p>
          <h2>Common questions</h2>
          {SITE.faq.map((x) => <details key={x.q} className="l-faq"><summary>{x.q}</summary><p>{x.a}</p></details>)}
        </div>
      </section>

      {/* contact */}
      <section className="l-cta">
        <div className="l-in l-cta-in">
          <div><h2>Ready to start driving?</h2><p>Book a free consultation or message us directly.</p></div>
          <div className="l-cta-btns">
            <a href="#book" className="l-btn l-btn-white">Book consultation</a>
            {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="l-btn l-btn-outline">WhatsApp</a>}
            {tel && <a href={`tel:+${tel}`} className="l-btn l-btn-outline">Call</a>}
          </div>
        </div>
      </section>

      <footer className="l-foot">
        <div className="l-in l-foot-in">
          <span>© {CONFIG.teacherName} · Driving Instructor Code {CONFIG.instructorCode}</span>
          <span>Fees are set by the authorities and may change.</span>
        </div>
      </footer>
    </div>
  );
}

// Illustrated placeholders for sample reviews (not real people or documents).
function SampleSelfie({ skin, hair, shirt }) {
  return (
    <svg viewBox="0 0 120 160" className="l-illu" role="img" aria-label="Illustrated student photo">
      <rect width="120" height="160" fill="#e9eef2" />
      <rect x="0" y="110" width="120" height="50" fill="#d6dde3" />
      <path d="M18 160 q42 -60 84 0z" fill={shirt} />
      <rect x="52" y="92" width="16" height="16" fill={skin} />
      <ellipse cx="60" cy="72" rx="24" ry="28" fill={skin} />
      <path d="M36 66 q2 -30 24 -30 q22 0 24 30 q-6 -14 -24 -16 q-18 2 -24 16z" fill={hair} />
      <circle cx="51" cy="74" r="2.6" fill="#222" /><circle cx="69" cy="74" r="2.6" fill="#222" />
      <path d="M50 86 q10 9 20 0" stroke="#222" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <rect x="80" y="104" width="30" height="20" rx="3" fill="#fff" stroke="#111" strokeWidth="1.5" transform="rotate(-12 95 114)" />
      <rect x="84" y="108" width="8" height="10" fill="#cfd8dc" transform="rotate(-12 95 114)" />
    </svg>
  );
}
function SampleLicence({ skin, hair }) {
  return (
    <svg viewBox="0 0 120 160" className="l-illu" role="img" aria-label="Illustrated licence card">
      <rect width="120" height="160" fill="#f2f2f2" />
      <g transform="translate(10 50)">
        <rect width="100" height="64" rx="7" fill="#fff" stroke="#111" strokeWidth="1.5" />
        <rect width="100" height="14" rx="7" fill="#111" /><rect y="7" width="100" height="7" fill="#111" />
        <text x="50" y="10" fontSize="6.5" textAnchor="middle" fill="#fff" fontWeight="700" letterSpacing=".5">DRIVING LICENCE</text>
        <rect x="7" y="20" width="26" height="34" rx="3" fill="#e9eef2" />
        <ellipse cx="20" cy="34" rx="7" ry="8" fill={skin} /><path d="M13 32 q1 -9 7 -9 q6 0 7 9 q-3 -5 -7 -5 q-4 0 -7 5z" fill={hair} />
        <path d="M10 54 q10 -12 20 0z" fill="#90a4ae" />
        <rect x="40" y="22" width="52" height="5" rx="2.5" fill="#cfd8dc" />
        <rect x="40" y="32" width="40" height="5" rx="2.5" fill="#cfd8dc" />
        <rect x="40" y="42" width="46" height="5" rx="2.5" fill="#cfd8dc" />
        <text x="92" y="60" fontSize="6" textAnchor="end" fill="#999">SAMPLE</text>
      </g>
      <circle cx="96" cy="40" r="12" fill="#111" /><path d="M90 40 l4 4 8 -9" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
