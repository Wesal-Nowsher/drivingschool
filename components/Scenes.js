"use client";
// Interactive lesson pictures. Each hotspot n opens bullet n of the lesson text.
import { useEffect, useState } from "react";

const INK = "#263238", ROAD = "#4a5056", RED = "#ce1126", BLUE = "#1565c0", GRASS = "#9ccc65";

const Car = ({ x, y, r = 0, color = "#d8b98a" }) => ( // top view, pointing up
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x="-11" y="-20" width="22" height="40" rx="7" fill={color} stroke={INK} strokeWidth="1.5" />
    <rect x="-8" y="-11" width="16" height="9" rx="2" fill="#bfe3ff" />
    <rect x="-8" y="8" width="16" height="6" rx="2" fill="#bfe3ff" />
  </g>
);
const Walker = ({ x, y, s = 1, c = "#ef6c00" }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cy="-22" r="6" fill="#c98d63" /><rect x="-6" y="-15" width="12" height="16" rx="4" fill={c} />
    <path d="M-3 1 l-4 12 M3 1 l5 12" stroke={INK} strokeWidth="3" strokeLinecap="round" />
  </g>
);
const Sign = ({ x, y, kind, s = 1 }) => {
  const g = {
    noentry: <><circle r="18" fill={RED} /><rect x="-12" y="-4" width="24" height="8" fill="#fff" /></>,
    speed: <><circle r="18" fill="#fff" stroke={RED} strokeWidth="5" /><text y="6" fontSize="15" textAnchor="middle" fontWeight="800" fill={INK}>60</text></>,
    mandatory: <><circle r="18" fill={BLUE} /><path d="M-8 -6 l8 10 8 -10" transform="rotate(-90)" stroke="#fff" strokeWidth="4" fill="none" /></>,
    warning: <><path d="M0 -20 L19 14 H-19z" fill="#fff" stroke={RED} strokeWidth="4" strokeLinejoin="round" /><circle cy="4" r="5" fill={INK} /></>,
    info: <><rect x="-22" y="-14" width="44" height="28" rx="3" fill={BLUE} stroke="#fff" strokeWidth="2" /><path d="M-12 0 h20 m-6 -6 l6 6 -6 6" stroke="#fff" strokeWidth="3" fill="none" /></>,
    stop: <><path d="M-7.5 -18 h15 l10.5 10.5 v15 l-10.5 10.5 h-15 l-10.5 -10.5 v-15z" fill={RED} stroke="#fff" strokeWidth="2" /><text y="4.5" fontSize="9" textAnchor="middle" fontWeight="800" fill="#fff">STOP</text></>,
    giveway: <path d="M0 16 L-18 -14 H18z" fill="#fff" stroke={RED} strokeWidth="4" strokeLinejoin="round" />,
    school: <><path d="M0 -20 L19 14 H-19z" fill="#fff" stroke={RED} strokeWidth="4" strokeLinejoin="round" /><Walker x={-4} y={10} s={0.55} c={INK} /><Walker x={5} y={10} s={0.45} c={INK} /></>,
  }[kind];
  return <g transform={`translate(${x} ${y}) scale(${s})`}>{g}</g>;
};
const Phone = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-9" y="-15" width="18" height="30" rx="3" fill={INK} /><rect x="-7" y="-11" width="14" height="20" fill="#90caf9" />
    <circle r="17" fill="none" stroke={RED} strokeWidth="4" /><path d="M-12 -12 L12 12" stroke={RED} strokeWidth="4" />
  </g>
);

function TrafficLight({ x, y, on }) {
  const c = ["#e53935", "#ffb300", "#43a047"];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-3" y="40" width="6" height="60" fill={INK} />
      <rect x="-16" y="-36" width="32" height="80" rx="8" fill={INK} />
      {c.map((col, i) => <circle key={i} cy={-22 + i * 24} r="9" fill={on === i ? col : "#455a64"} />)}
    </g>
  );
}

// Each scene: draw(state) + hotspots [x,y] in order of the lesson bullets.
const SCENES = [
  { // 0 Before you drive: car interior top view
    hs: [[160, 42], [118, 136], [262, 150], [205, 178], [160, 166]],
    draw: () => (<>
      <rect width="320" height="220" fill="#eceff1" />
      <path d="M90 20 h140 q30 0 30 30 v150 h-200 v-150 q0 -30 30 -30z" fill="#cfd8dc" stroke={INK} strokeWidth="2" />
      <rect x="130" y="34" width="60" height="14" rx="4" fill="#90a4ae" stroke={INK} />
      <rect x="66" y="70" width="20" height="14" rx="4" fill="#90a4ae" /><rect x="234" y="70" width="20" height="14" rx="4" fill="#90a4ae" />
      <circle cx="125" cy="92" r="20" fill="none" stroke={INK} strokeWidth="5" />
      <rect x="185" y="110" width="40" height="50" rx="8" fill="#78909c" /><rect x="105" y="110" width="40" height="50" rx="8" fill="#78909c" />
      <path d="M106 112 L144 158" stroke={RED} strokeWidth="5" />
      <circle cx="205" cy="128" r="11" fill="#c98d63" /><text x="205" y="200" fontSize="11" textAnchor="middle" fontWeight="700">INSTRUCTOR</text>
      <Phone x={262} y={150} />
      <rect x="150" y="150" width="20" height="30" rx="4" fill={INK} /><text x="160" y="171" fontSize="10" textAnchor="middle" fill="#fff" fontWeight="700">P</text>
    </>),
  },
  { // 1 Keep right, lanes & speed
    hs: [[214, 170], [128, 96], [56, 50], [240, 112], [176, 140]],
    draw: () => (<>
      <rect width="320" height="220" fill={GRASS} />
      <rect x="90" y="0" width="160" height="220" fill={ROAD} />
      {[0, 50, 100, 150, 200].map((yy) => <rect key={yy} x="168" y={yy} width="4" height="26" fill="#fff" />)}
      <rect x="90" y="0" width="3" height="220" fill="#ffeb3b" /><rect x="247" y="0" width="3" height="220" fill="#fff" />
      <Car x={214} y={170} />
      <Car x={214} y={60} color="#90caf9" />
      <path d="M200 150 q-20 -30 -60 -40 q0 -20 10 -40" stroke="#ffeb3b" strokeWidth="4" fill="none" strokeDasharray="6 5" />
      <Car x={128} y={96} r={-10} color="#d8b98a" />
      <rect x="40" y="70" width="6" height="40" fill={INK} /><Sign x={43} y={50} kind="speed" />
      <path d="M232 82 v66" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" /><text x="238" y="120" fontSize="12" fill="#fff" fontWeight="700">2s</text>
    </>),
  },
  null, // 2 roundabout, handled by <Roundabout/>
  { // 3 Traffic lights & junctions
    hs: [[62, 56], [175, 110], [62, 140], [272, 52], [272, 150]],
    draw: (st) => (<>
      <rect width="320" height="220" fill={GRASS} />
      <rect x="0" y="80" width="320" height="60" fill={ROAD} /><rect x="130" y="0" width="60" height="220" fill={ROAD} />
      <path d="M130 80 L190 140 M190 80 L130 140" stroke="#ffeb3b" strokeWidth="3" />
      <rect x="130" y="80" width="60" height="60" fill="none" stroke="#ffeb3b" strokeWidth="3" />
      <rect x="120" y="140" width="4" height="60" fill="#fff" />
      <rect x="196" y="144" width="4" height="0" fill="#fff" />
      <rect x="140" y="146" width="44" height="4" fill="#fff" />
      <Car x={160} y={178} color="#d8b98a" />
      <TrafficLight x={62} y={60} on={st.light} />
      <rect x="270" y="70" width="4" height="40" fill={INK} /><Sign x={272} y={52} kind="stop" s={1.1} />
      <rect x="270" y="168" width="4" height="40" fill={INK} /><Sign x={272} y={150} kind="giveway" />
    </>),
    tap: (i, st, set) => { if (i === 0) set({ ...st, light: ((st.light ?? -1) + 1) % 3 }); },
  },
  { // 4 Road signs
    hs: [[45, 80], [100, 80], [160, 80], [220, 80], [278, 80]],
    draw: () => (<>
      <rect width="320" height="220" fill="#e8f5e9" />
      {[[45, "noentry"], [100, "mandatory"], [160, "warning"], [220, "info"], [278, "stop"]].map(([x, k]) => (
        <g key={k}><rect x={x - 2} y="100" width="4" height="70" fill={INK} /><Sign x={x} y={80} kind={k} s={1.25} /></g>))}
      <Sign x={45} y={140} kind="speed" s={0.8} />
      <Sign x={278} y={140} kind="giveway" s={0.8} />
      <rect y="170" width="320" height="50" fill={ROAD} />
    </>),
  },
  { // 5 Pedestrians
    hs: [[160, 110], [60, 40], [252, 72], [110, 150]],
    draw: () => (<>
      <rect width="320" height="220" fill={GRASS} />
      <rect x="0" y="80" width="320" height="70" fill={ROAD} />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={140} y={84 + i * 11} width="40" height="6" fill="#fff" />)}
      <Walker x={160} y={115} />
      <rect x="20" y="20" width="80" height="50" fill="#ffcc80" stroke={INK} /><path d="M20 20 l40 -14 40 14" fill="#e57373" />
      <Sign x={128} y={40} kind="school" />
      <Walker x={252} y={72} s={0.7} c="#ab47bc" /><circle cx="262" cy="64" r="5" fill="#ffeb3b" />
      <Car x={110} y={130} r={90} color="#90caf9" />
      <Car x={60} y={130} r={90} />
      <path d="M85 152 q20 14 45 0" stroke={RED} strokeWidth="3" fill="none" /><path d="M120 146 l12 6 -12 6" fill={RED} />
      <path d="M95 158 l30 -16 M95 142 l30 16" stroke={RED} strokeWidth="4" />
    </>),
  },
  { // 6 Reversing & parking
    hs: [[160, 176], [160, 92], [248, 32], [30, 140], [252, 172]],
    draw: () => (<>
      <rect width="320" height="220" fill="#cfd8dc" />
      <rect x="0" y="0" width="320" height="60" fill={ROAD} />
      <rect x="110" y="60" width="100" height="160" fill="#b0bec5" />
      <path d="M120 70 v140 M200 70 v140" stroke="#fff" strokeWidth="3" />
      {[90, 140, 190].map((y) => <path key={y} d={`M20 ${y} l10 -18 10 18z`} fill="#ff7043" />)}
      <path d="M118 200 L160 120 L202 200z" fill="rgba(206,17,38,.15)" />
      <Car x={160} y={92} r={0} />
      <path d="M160 116 v40" stroke="#fff" strokeWidth="3" /><path d="M152 148 l8 10 8 -10" stroke="#fff" strokeWidth="3" fill="none" />
      <Walker x={160} y={190} s={0.7} c="#ffb300" />
      <path d="M248 20 v24 M248 44 l-6 -6 M248 44 l6 -6" stroke={RED} strokeWidth="3" /><path d="M230 30 l36 0" stroke={RED} strokeWidth="4" transform="rotate(45 248 32)" />
      <rect x="236" y="160" width="40" height="24" fill="#ffeb3b" opacity=".8" /><path d="M236 160 l40 24 M276 160 l-40 24" stroke={RED} strokeWidth="3" />
    </>),
  },
  { // 7 Exam tips
    hs: [[52, 60], [130, 60], [210, 60], [272, 120], [130, 160]],
    draw: () => (<>
      <rect width="320" height="220" fill="#fff8e1" />
      <g transform="translate(52 60)"><rect x="-26" y="-18" width="52" height="34" rx="6" fill="#fff" stroke={INK} strokeWidth="2" /><text y="5" fontSize="12" textAnchor="middle" fontWeight="800" fill={RED}>CPR</text></g>
      <g transform="translate(130 60)"><rect x="-12" y="-24" width="24" height="44" rx="6" fill="#78909c" /><path d="M-10 -22 L10 18" stroke={RED} strokeWidth="5" /></g>
      <g transform="translate(210 60)"><rect x="-24" y="-14" width="48" height="28" rx="6" fill="#90a4ae" /><text y="6" fontSize="18" textAnchor="middle">⬅️</text></g>
      <Sign x={272} y={120} kind="stop" s={1.4} />
      <g transform="translate(130 160)"><circle r="28" fill="#ffd54f" /><circle cx="-9" cy="-6" r="4" fill={INK} /><circle cx="9" cy="-6" r="4" fill={INK} /><path d="M-12 8 q12 12 24 0" stroke={INK} strokeWidth="3" fill="none" /></g>
    </>),
  },
];

// Static, uncoloured version of a lesson picture (no hotspots) for the simple app.
export function PlainScene({ index }) {
  const sc = SCENES[index];
  if (!sc) return null;
  return <svg viewBox="0 0 320 220" className={`s-illus ${index === 3 || index === 4 ? "s-color" : ""}`} role="img" aria-hidden="true">{sc.draw({ light: 0 })}</svg>;
}

export function LessonScene({ index, active, seen, onTap }) {
  const sc = SCENES[index];
  const [st, setSt] = useState({ light: 0 });
  if (!sc) return null;
  return (
    <svg viewBox="0 0 320 220" className="art scene" role="img">
      {sc.draw(st)}
      {sc.hs.map(([x, y], i) => (
        <g key={i} className={`hs ${active === i ? "on" : ""} ${seen.includes(i) ? "seen" : ""}`}
           onClick={() => { onTap(i); sc.tap?.(i, st, setSt); }} role="button" tabIndex={0}
           onKeyDown={(e) => e.key === "Enter" && onTap(i)}>
          <circle cx={x} cy={y} r="22" className="hs-ring" />
          <circle cx={x} cy={y} r="13" className="hs-dot" />
          <text x={x} y={y + 5} textAnchor="middle" className="hs-num">{seen.includes(i) && active !== i ? "✓" : i + 1}</text>
        </g>
      ))}
    </svg>
  );
}

// ===== Interactive roundabout (Bahrain: drive on the right, circulate anticlockwise) =====
const CX = 160, CY = 150;
function routePoints(exitIdx, r) {
  // Enter from south heading north on the right side; exits anticlockwise: 0=east(1st) 1=north 2=west 3=south(U)
  const pts = [];
  for (let y = 300; y >= CY + r + 4; y -= 4) pts.push([CX + 14, y]);
  const a0 = Math.atan2(CY + r - CY, 14) ; // approx bottom
  const aEnd = [0, -Math.PI / 2, -Math.PI, -1.5 * Math.PI][exitIdx] - 0.15;
  for (let a = a0; a >= aEnd; a -= 0.04) pts.push([CX + r * Math.cos(a), CY + r * Math.sin(a)]);
  const dirs = [[1, 0], [0, -1], [-1, 0], [0, 1]], off = [[0, 14], [14, 0], [0, -14], [-14, 0]];
  const [dx, dy] = dirs[exitIdx], [ox, oy] = off[exitIdx];
  const sx = CX + dx * (r + 6) + ox, sy = CY + dy * (r + 6) + oy;
  for (let t = 0; t <= 160; t += 4) pts.push([sx + dx * t, sy + dy * t]);
  return pts;
}
const ROUTES = [
  { key: "right", bullet: 1, exit: 0, r: 70, sig: (p) => "R" },
  { key: "straight", bullet: 2, exit: 1, r: 70, sig: (p) => (p > 0.45 ? "R" : "") },
  { key: "left", bullet: 3, exit: 2, r: 50, sig: (p) => (p < 0.62 ? "L" : "R") },
  { key: "uturn", bullet: 4, exit: 3, r: 50, sig: (p) => (p < 0.72 ? "L" : "R") },
];

export function Roundabout({ U, onTap }) {
  const [route, setRoute] = useState(null);
  const [p, setP] = useState(0);
  const pts = route ? routePoints(route.exit, route.r) : null;

  useEffect(() => {
    if (!route) return;
    let raf, t0;
    const step = (t) => { t0 ??= t; const k = Math.min(1, (t - t0) / 5000); setP(k); if (k < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [route]);

  let car = null, sig = "";
  if (pts) {
    const i = Math.min(pts.length - 2, Math.floor(p * (pts.length - 1)));
    const [x, y] = pts[i], [x2, y2] = pts[i + 1];
    car = { x, y, r: (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI + 90 };
    sig = route.sig(p);
  }
  const blink = Math.floor(p * 20) % 2 === 0;
  const pick = (r) => { setRoute(r); setP(0); onTap(r.bullet); };

  return (<>
    <svg viewBox="0 0 320 300" className="art scene" role="img">
      <rect width="320" height="300" fill={GRASS} />
      <rect x={CX - 30} y="0" width="60" height="300" fill={ROAD} /><rect x="0" y={CY - 30} width="320" height="60" fill={ROAD} />
      <circle cx={CX} cy={CY} r="90" fill={ROAD} />
      <circle cx={CX} cy={CY} r="60" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="8 8" />
      <circle cx={CX} cy={CY} r="34" fill={GRASS} stroke="#fff" strokeWidth="3" />
      <rect x={CX - 1.5} y={CY + 92} width="3" height="60" fill="#ffeb3b" />
      <path d={`M${CX + 2} ${CY + 92} h28`} stroke="#fff" strokeWidth="3" strokeDasharray="5 4" />
      {[["1", CX + 140, CY + 40], ["2", CX + 40, 14], ["3", 14, CY - 40], ["4", CX - 40, 290]].map(([n, x, y]) => (
        <g key={n}><circle cx={x} cy={y} r="11" fill="#fff" /><text x={x} y={y + 4} fontSize="12" textAnchor="middle" fontWeight="800">{n}</text></g>))}
      <Car x={CX - 120} y={CY - 14} r={90} color="#90caf9" />
      <path d="M20 120 l14 -6 v12z" fill="#fff" />
      <g className={`hs ${!route ? "on" : ""}`} onClick={() => onTap(0)} role="button">
        <circle cx={CX - 80} cy={CY - 52} r="22" className="hs-ring" /><circle cx={CX - 80} cy={CY - 52} r="13" className="hs-dot" />
        <text x={CX - 80} y={CY - 47} textAnchor="middle" className="hs-num">!</text>
      </g>
      {car ? <Car x={car.x} y={car.y} r={car.r} color="#ffca28" /> : <Car x={CX + 14} y={270} color="#ffca28" />}
      {car && sig && blink && <circle cx={car.x} cy={car.y} r="16" fill="none" stroke="#ff9800" strokeWidth="4" />}
    </svg>
    <div className="indicator">{U.indicator}: <span className={`ind ${sig === "L" && blink ? "lit" : ""}`}>⬅</span><span className={`ind ${sig === "R" && blink ? "lit" : ""}`}>➡</span></div>
    <p className="muted center">{U.play}</p>
    <div className="routes">
      {ROUTES.map((r) => <button key={r.key} className={`chip ${route?.key === r.key ? "on" : ""}`} onClick={() => pick(r)}>{U[r.key]}</button>)}
    </div>
  </>);
}
