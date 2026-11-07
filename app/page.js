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
              <Link href="/v1" className="l-btn l-btn-light">Free learning guide</Link>
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

      {/* pricing */}
      <section className="l-sec" id="pricing">
        <div className="l-in">
          <p className="l-eyebrow">Pricing</p>
          <h2>Clear fees, no surprises</h2>
          <div className="l-prices">
            <div className="l-price">
              <h3>Government fees</h3>
              <p className="l-amount">{gov} <small>BD</small></p>
              <p className="l-muted">Paid to the General Directorate of Traffic</p>
              <ul>
                <li><span>Eye test</span><b>{F.eyeTest} BD</b></li>
                <li><span>Learning book</span><b>{F.learningBook} BD</b></li>
                <li><span>Exam appointment</span><b>{F.examAppointment} BD</b></li>
                <li><span>Licence card (after passing)</span><b>{F.licenseCard} BD</b></li>
              </ul>
            </div>
            <div className="l-price l-featured">
              <span className="l-tag">Complete package</span>
              <h3>Everything included</h3>
              <p className="l-amount">{total} <small>BD</small></p>
              <p className="l-muted">From eye test to licence card</p>
              <ul>
                <li><span>Government fees</span><b>{gov} BD</b></li>
                <li><span>{F.hours} hours of classes</span><b>{classes} BD</b></li>
                <li><span>Free interactive learning guide</span><b>✓</b></li>
                <li><span>Pay at once or per class</span><b>✓</b></li>
              </ul>
              <a href="#book" className="l-btn l-btn-white l-full">Book consultation</a>
            </div>
            <div className="l-price">
              <h3>Driving classes</h3>
              <p className="l-amount">{classes} <small>BD</small></p>
              <p className="l-muted">Paid to your instructor</p>
              <ul>
                <li><span>Hours of practical training</span><b>{F.hours}</b></li>
                <li><span>Price per hour</span><b>{F.perHour} BD</b></li>
                <li><span>Automatic or manual</span><b>✓</b></li>
                <li><span>Pay per class</span><b>✓</b></li>
              </ul>
            </div>
          </div>
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
            )) : [0, 1, 2].map((k) => (
              <figure key={k} className="l-review l-review-empty">
                <div className="l-review-imgs"><div className="l-ph">Student photo</div><div className="l-ph">Licence card</div></div>
                <blockquote>Success stories from our students will appear here.</blockquote>
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
            <Link href="/v1" className="l-btn l-btn-white">Open guide</Link>
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
