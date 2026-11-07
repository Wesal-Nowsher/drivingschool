"use client";
// One lesson as a small game: discover the rules on the picture, then answer a quick challenge.
import { useState } from "react";
import { LessonScene, Roundabout, sceneHotspots } from "@/components/Scenes";
import { GAME, LESSON_QUESTIONS } from "@/lib/game-i18n";

const COLOR_LESSONS = [3, 4]; // traffic lights and signs need their colours
const PTS = 10;

const getScores = () => { try { return JSON.parse(localStorage.getItem("scores")) || {}; } catch { return {}; } };
const saveScore = (i, v) => { try { const s = getScores(); s[i] = Math.max(s[i] || 0, v); localStorage.setItem("scores", JSON.stringify(s)); } catch {} };
export const totalScore = () => Object.values(getScores()).reduce((a, b) => a + b, 0);

export default function LessonGame({ lang, T, U, i, Nav, nextLabel, onNext }) {
  const G = GAME[lang], l = T.lessons[i];
  const questions = LESSON_QUESTIONS[i].map((k) => (typeof k === "number" ? T.quiz[k] : G.extra[+k.slice(1)]));

  const [phase, setPhase] = useState("discover"); // discover | challenge | complete
  const [active, setActive] = useState(null);
  const [seen, setSeen] = useState([]);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState(null);
  const [right, setRight] = useState(0);
  const [nonce, setNonce] = useState(0);

  const tap = (b) => { setActive(b); setNonce((n) => n + 1); setSeen((s) => (s.includes(b) ? s : [...s, b])); };
  const allFound = seen.length >= l.p.length;

  if (phase === "complete") {
    const stars = right === questions.length ? 3 : right > 0 ? 2 : 1;
    return (<div className="g-complete">
      <div className="g-stars" aria-label={`${stars} / 3`}>{[0, 1, 2].map((k) => <span key={k} className={k < stars ? "on" : ""}>★</span>)}</div>
      <h2 className="s-h1">{G.complete}</h2>
      <p className="g-score"><b>+{right * PTS}</b> {G.points}</p>
      <p className="s-muted">{G.total}: <b className="s-num">{totalScore()}</b> {G.points}</p>
      <Nav onNext={onNext} nextLabel={nextLabel} />
      <button className="s-link" onClick={() => { setPhase("discover"); setSeen([]); setActive(null); setQi(0); setPicked(null); setRight(0); }}>↻ {G.replay}</button>
    </div>);
  }

  if (phase === "challenge") {
    const q = questions[qi];
    const answer = (j) => { if (picked !== null) return; setPicked(j); if (j === q.a) setRight((r) => r + 1); };
    const next = () => {
      if (qi < questions.length - 1) { setQi(qi + 1); setPicked(null); }
      else { saveScore(i, (right) * PTS); setPhase("complete"); }
    };
    return (<div className="g-challenge">
      <p className="s-kicker">{G.challenge} <span className="s-num">{qi + 1}/{questions.length}</span></p>
      <h2 className="g-q">{q.q}</h2>
      <div className="g-opts">
        {q.o.map((o, j) => {
          const st = picked === null ? "" : j === q.a ? "ok" : j === picked ? "bad" : "dim";
          return <button key={j} className={`g-opt ${st}`} onClick={() => answer(j)} disabled={picked !== null}>
            <span className="g-mark">{st === "ok" ? "✓" : st === "bad" ? "✗" : String.fromCharCode(65 + j)}</span>{o}</button>;
        })}
      </div>
      {picked !== null && (<>
        <p className={`g-feedback ${picked === q.a ? "ok" : "bad"}`}>{picked === q.a ? `${T.ui.correct} +${PTS}` : `${T.ui.wrong} ${q.o[q.a]}`}</p>
        <button className="s-btn s-primary g-continue" onClick={next}>{T.ui.next}</button>
      </>)}
    </div>);
  }

  // discover
  return (<div className={`s-game ${COLOR_LESSONS.includes(i) ? "color" : ""}`}>
    <p className="g-hint">{i === 2 ? G.discoverRb : G.discover}</p>
    <div className="g-stage">
      {i === 2 ? <Roundabout U={U} onTap={tap} /> : <LessonScene index={i} active={active} seen={seen} onTap={tap} nonce={nonce} />}
      {active !== null && <RulePopup key={`${active}-${nonce}`} n={active + 1} text={l.p[active]} at={i === 2 ? null : sceneHotspots(i)?.[active]} onClose={() => setActive(null)} />}
    </div>
    <div className="g-found">
      <span>{G.found}</span>
      <span className="g-dots">{l.p.map((_, k) => <button key={k} className={`${seen.includes(k) ? "on" : ""} ${active === k ? "cur" : ""}`} disabled={!seen.includes(k)} onClick={() => tap(k)} aria-label={`${k + 1}`} />)}</span>
      <b className="s-num">{seen.length}/{l.p.length}</b>
    </div>
    {allFound
      ? <button className="s-cta g-unlock" onClick={() => setPhase("challenge")}><span className="s-cta-text"><b>{G.challenge}</b><small>{questions.length} × +{PTS} {G.points}</small></span><span className="s-cta-arrow">→</span></button>
      : <p className="s-muted g-locked">🔒 {G.locked}</p>}
    <Nav onNext={onNext} nextLabel={nextLabel} />
  </div>);
}

// Speech-bubble popup over the picture, pointing at the tapped number.
function RulePopup({ n, text, at, onClose }) {
  let style = {}, cls = "g-pop", arrow = null;
  if (at) {
    const [x, y] = at, below = y <= 120;
    const px = (x / 320) * 100, py = (y / 220) * 100;
    style = below ? { top: `calc(${py}% + 22px)` } : { bottom: `calc(${100 - py}% + 22px)` };
    cls += below ? " below" : " above";
    arrow = { left: `clamp(16px, ${px}%, calc(100% - 16px))` };
  } else {
    cls += " fixed";
  }
  return (
    <div className={cls} style={style} role="dialog" aria-live="polite">
      {arrow && <span className="g-pop-arrow" style={arrow} />}
      <span className="g-pop-n s-num">{n}</span>
      <p>{text}</p>
      <button className="g-pop-x" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}
