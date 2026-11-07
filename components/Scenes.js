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
const CarTop = ({ color }) => <Car x={0} y={0} color={color} />;
// Animated lesson scenes. Hotspots sit BESIDE objects so both stay visible.
const LOOP = "indefinite";
const Move = ({ values, keyTimes, dur, children, begin = "0s" }) => (
  <g>
    <animateTransform attributeName="transform" type="translate" values={values} keyTimes={keyTimes} dur={dur} repeatCount={LOOP} begin={begin} calcMode={keyTimes ? "linear" : undefined} />
    {children}
  </g>
);
const Blink = ({ dur = "0.8s", children }) => (
  <g><animate attributeName="opacity" values="1;0.15;1" dur={dur} repeatCount={LOOP} />{children}</g>
);
const RoadDashes = ({ x, y1 = -40, y2 = 260, color = "#fff", speed = "1s", w = 3 }) => (
  <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={w} strokeDasharray="16 14">
    <animate attributeName="stroke-dashoffset" from="0" to="-30" dur={speed} repeatCount={LOOP} />
  </line>
);

const SCENES = [
  { // 0 Before you drive: view from the back seat
    hs: [[200, 22], [142, 204], [26, 128], [266, 124], [186, 168]],
    draw: () => (<>
      <rect width="320" height="220" fill="#e9eef2" />
      {/* windshield with moving road */}
      <path d="M42 8 H278 L300 92 H20 Z" fill="#cfe8ff" />
      <path d="M140 92 L156 30 H164 L180 92 Z" fill="#8a9299" />
      <RoadDashes x={160} y1={30} y2={92} speed="0.6s" w={2} />
      <path d="M20 92 H300 V110 H20 Z" fill="#37474f" />
      {/* rear-view mirror + side mirrors */}
      <rect x="135" y="14" width="50" height="14" rx="5" fill="#455a64" /><rect x="139" y="17" width="42" height="8" rx="3" fill="#b3e5fc" />
      <path d="M6 64 h18 v18 h-18 z" fill="#455a64" /><rect x="8" y="66" width="14" height="14" rx="2" fill="#b3e5fc" />
      <path d="M296 64 h18 v18 h-18 z" fill="#455a64" /><rect x="298" y="66" width="14" height="14" rx="2" fill="#b3e5fc" />
      {/* steering wheel (left: Bahrain cars are left-hand drive) */}
      <circle cx="95" cy="104" r="24" fill="none" stroke="#263238" strokeWidth="7" />
      <path d="M71 104 H119 M95 104 V128" stroke="#263238" strokeWidth="6" />
      {/* driver */}
      <rect x="58" y="140" width="74" height="80" rx="16" fill="#78909c" />
      <circle cx="95" cy="138" r="17" fill="#5d4037" />
      <path d="M120 150 L70 214" stroke="#ce1126" strokeWidth="7" strokeLinecap="round" strokeDasharray="80" strokeDashoffset="80">
        <animate attributeName="stroke-dashoffset" values="80;0;0;80" keyTimes="0;0.35;0.85;1" dur="3s" repeatCount={LOOP} />
      </path>
      {/* instructor */}
      <rect x="188" y="140" width="74" height="80" rx="16" fill="#90a4ae" />
      <circle cx="225" cy="138" r="17" fill="#3e2723" />
      <rect x="208" y="112" width="34" height="12" rx="3" fill="#ce1126" /><text x="225" y="122" fontSize="10" textAnchor="middle" fill="#fff" fontWeight="800">L</text>
      {/* gear lever in P */}
      <rect x="152" y="150" width="16" height="44" rx="6" fill="#263238" />
      <Blink dur="1.4s"><circle cx="160" cy="148" r="11" fill="#263238" /><text x="160" y="152" fontSize="12" textAnchor="middle" fill="#fff" fontWeight="800">P</text></Blink>
      {/* phone: not allowed */}
      <g transform="translate(34 172)">
        <animateTransform attributeName="transform" type="rotate" values="-8;8;-8" dur="0.6s" repeatCount={LOOP} additive="sum" />
        <rect x="-9" y="-15" width="18" height="30" rx="3" fill="#263238" /><rect x="-7" y="-11" width="14" height="20" fill="#90caf9" />
        <circle r="17" fill="none" stroke="#ce1126" strokeWidth="4" /><path d="M-12 -12 L12 12" stroke="#ce1126" strokeWidth="4" />
      </g>
    </>),
  },
  { // 1 Keep right, lanes & speed (Bahrain: drive on the right)
    hs: [[272, 186], [186, 206], [300, 92], [272, 112], [138, 34]],
    draw: () => (<>
      <rect width="320" height="220" fill="#a5d6a7" />
      <rect x="70" y="0" width="180" height="220" fill="#546e7a" />
      <line x1="157" y1="0" x2="157" y2="220" stroke="#ffd54f" strokeWidth="3" /><line x1="163" y1="0" x2="163" y2="220" stroke="#ffd54f" strokeWidth="3" />
      <RoadDashes x={114} speed="0.5s" /><RoadDashes x={206} speed="0.8s" />
      <line x1="72" y1="0" x2="72" y2="220" stroke="#fff" strokeWidth="2" /><line x1="248" y1="0" x2="248" y2="220" stroke="#fff" strokeWidth="2" />
      {/* oncoming traffic on the left side */}
      <Move values="0 -60;0 300" dur="2.6s"><g transform="translate(92 0) rotate(180)"><CarTop color="#90caf9" /></g></Move>
      {/* our car + car in front, keeping a gap */}
      <g transform="translate(228 170)"><CarTop color="#ffca28" /></g>
      <g transform="translate(228 70)"><CarTop color="#b0bec5" /></g>
      <path d="M252 92 v54 M247 92 h10 M247 146 h10" stroke="#fff" strokeWidth="2" />
      <text x="262" y="124" fontSize="12" fill="#fff" fontWeight="800">2s</text>
      {/* overtaking on the LEFT lane, indicator blinking */}
      <Move values="0 260;0 -60" dur="3.2s">
        <g transform="translate(184 0)"><CarTop color="#ef9a9a" />
          <Blink dur="0.5s"><circle cx="-10" cy="-19" r="4" fill="#ff9800" /></Blink></g>
      </Move>
      {/* speed sign */}
      <rect x="283" y="60" width="4" height="70" fill="#37474f" />
      <circle cx="285" cy="50" r="18" fill="#fff" stroke="#ce1126" strokeWidth="5" /><text x="285" y="56" fontSize="15" textAnchor="middle" fontWeight="800" fill="#263238">60</text>
      {/* direction arrow on our side */}
      <path d="M206 214 v-22 m-7 8 l7 -9 7 9" stroke="#fff" strokeWidth="3" fill="none" />
    </>),
  },
  null, // 2 roundabout: handled by <Roundabout/>
  { // 3 Traffic lights & junctions: light cycles, car stops on red, goes on green
    hs: [[254, 140], [212, 64], [112, 162], [300, 66], [92, 198]],
    draw: () => (<>
      <rect width="320" height="220" fill="#a5d6a7" />
      <rect x="0" y="80" width="320" height="56" fill="#546e7a" /><rect x="132" y="0" width="56" height="220" fill="#546e7a" />
      <g stroke="#ffd54f" strokeWidth="2.5"><rect x="132" y="80" width="56" height="56" fill="none" /><path d="M132 80 L188 136 M188 80 L132 136 M160 80 L188 108 M132 108 L160 136 M160 136 L188 108 M132 108 L160 80" /></g>
      <rect x="160" y="146" width="28" height="4" fill="#fff" />
      <line x1="160" y1="146" x2="160" y2="220" stroke="#fff" strokeWidth="2" strokeDasharray="8 8" />
      {/* car: approaches, waits at red, goes on green */}
      <Move values="0 90;0 0;0 0;0 -240;0 -240" keyTimes="0;0.25;0.42;0.75;1" dur="6s">
        <g transform="translate(174 172)"><CarTop color="#ffca28" /></g>
      </Move>
      {/* traffic light */}
      <rect x="226" y="150" width="5" height="50" fill="#263238" />
      <rect x="214" y="92" width="30" height="64" rx="7" fill="#263238" />
      <circle cx="229" cy="106" r="8" fill="#e53935"><animate attributeName="opacity" values="1;1;0.15;0.15;0.15" keyTimes="0;0.42;0.43;0.99;1" dur="6s" repeatCount={LOOP} /></circle>
      <circle cx="229" cy="124" r="8" fill="#ffb300"><animate attributeName="opacity" values="0.15;0.15;1;1" keyTimes="0;0.8;0.81;1" dur="6s" repeatCount={LOOP} /></circle>
      <circle cx="229" cy="142" r="8" fill="#43a047"><animate attributeName="opacity" values="0.15;0.15;1;1;0.15;0.15" keyTimes="0;0.42;0.43;0.8;0.81;1" dur="6s" repeatCount={LOOP} /></circle>
      {/* STOP sign */}
      <rect x="268" y="48" width="4" height="30" fill="#263238" />
      <path d="M262 18 h12 l9 9 v12 l-9 9 h-12 l-9 -9 v-12z" fill="#ce1126" stroke="#fff" strokeWidth="2" /><text x="268" y="37" fontSize="8" textAnchor="middle" fontWeight="800" fill="#fff">STOP</text>
      {/* give way sign */}
      <rect x="58" y="176" width="4" height="40" fill="#263238" />
      <path d="M60 196 L42 164 H78 Z" fill="#fff" stroke="#ce1126" strokeWidth="4" strokeLinejoin="round" />
    </>),
  },
  { // 4 Road signs: tap the number under each sign
    hs: [[45, 120], [105, 120], [165, 120], [225, 120], [285, 120]],
    draw: () => (<>
      <rect width="320" height="220" fill="#e8f5e9" />
      <rect y="196" width="320" height="24" fill="#546e7a" />
      {[45, 105, 165, 225, 285].map((x) => <rect key={x} x={x - 2} y="80" width="4" height="116" fill="#37474f" />)}
      <g><animateTransform attributeName="transform" type="rotate" values="-2 45 196;2 45 196;-2 45 196" dur="3s" repeatCount={LOOP} />
        <circle cx="45" cy="60" r="24" fill="#ce1126" /><rect x="29" y="55" width="32" height="10" fill="#fff" /></g>
      <circle cx="45" cy="165" r="16" fill="#fff" stroke="#ce1126" strokeWidth="5" /><text x="45" y="170" fontSize="13" textAnchor="middle" fontWeight="800" fill="#263238">60</text>
      <g><animateTransform attributeName="transform" type="rotate" values="2 105 196;-2 105 196;2 105 196" dur="3s" repeatCount={LOOP} />
        <circle cx="105" cy="60" r="24" fill="#1565c0" /><path d="M95 60 h18 m-7 -8 l8 8 -8 8" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /></g>
      <g><animateTransform attributeName="transform" type="rotate" values="-2 165 196;2 165 196;-2 165 196" dur="3s" repeatCount={LOOP} />
        <path d="M165 33 L191 82 H139 Z" fill="#fff" stroke="#ce1126" strokeWidth="5" strokeLinejoin="round" />
        <circle cx="158" cy="68" r="5" fill="#263238" /><circle cx="172" cy="68" r="5" fill="#263238" /><circle cx="165" cy="56" r="5" fill="#263238" /></g>
      <g><animateTransform attributeName="transform" type="rotate" values="2 225 196;-2 225 196;2 225 196" dur="3s" repeatCount={LOOP} />
        <rect x="197" y="42" width="56" height="36" rx="4" fill="#1565c0" stroke="#fff" strokeWidth="2" /><path d="M208 60 h28 m-8 -8 l8 8 -8 8" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /></g>
      <g><animateTransform attributeName="transform" type="rotate" values="-2 285 196;2 285 196;-2 285 196" dur="3s" repeatCount={LOOP} />
        <path d="M275 36 h20 l14 14 v20 l-14 14 h-20 l-14 -14 v-20z" fill="#ce1126" stroke="#fff" strokeWidth="2.5" /><text x="285" y="64" fontSize="11" textAnchor="middle" fontWeight="800" fill="#fff">STOP</text></g>
      <path d="M285 182 L268 152 H302 Z" fill="#fff" stroke="#ce1126" strokeWidth="4" strokeLinejoin="round" />
    </>),
  },
  { // 5 Pedestrians: person crosses, car waits
    hs: [[206, 64], [108, 20], [292, 96], [30, 188]],
    draw: () => (<>
      <rect width="320" height="220" fill="#a5d6a7" />
      <rect x="0" y="86" width="320" height="76" fill="#546e7a" />
      <line x1="0" y1="124" x2="320" y2="124" stroke="#fff" strokeWidth="2" strokeDasharray="14 12" />
      {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x="140" y={89 + k * 12} width="44" height="7" fill="#fff" />)}
      {/* school */}
      <rect x="12" y="20" width="80" height="50" fill="#ffe0b2" stroke="#5d4037" strokeWidth="2" /><path d="M8 22 L52 2 L96 22 Z" fill="#e57373" />
      <rect x="44" y="44" width="16" height="26" fill="#8d6e63" />
      {/* walking pedestrian */}
      <Move values="0 0;0 -118;0 -118" keyTimes="0;0.8;1" dur="5s">
        <g transform="translate(162 196)">
          <circle cy="-22" r="7" fill="#8d6e63" /><rect x="-7" y="-15" width="14" height="18" rx="4" fill="#ef6c00" />
          <path d="M-3 3 l-5 12 M3 3 l5 12" stroke="#263238" strokeWidth="3" strokeLinecap="round">
            <animate attributeName="d" values="M-3 3 l-5 12 M3 3 l5 12;M-3 3 l2 12 M3 3 l-2 12;M-3 3 l-5 12 M3 3 l5 12" dur="0.5s" repeatCount={LOOP} /></path>
        </g>
      </Move>
      {/* car waiting before the crossing */}
      <g transform="translate(112 142) rotate(90)"><CarTop color="#ffca28" /></g>
      {/* car behind must not overtake */}
      <g transform="translate(60 142) rotate(90)"><CarTop color="#b0bec5" /></g>
      <path d="M58 168 q40 22 80 0" stroke="#ce1126" strokeWidth="3" fill="none" strokeDasharray="6 5" />
      <path d="M84 168 l20 14 M104 168 l-20 14" stroke="#ce1126" strokeWidth="4" />
      {/* child with bouncing ball */}
      <g transform="translate(270 70)"><circle cy="-18" r="6" fill="#8d6e63" /><rect x="-6" y="-12" width="12" height="14" rx="4" fill="#ab47bc" /><path d="M-3 2 l-3 9 M3 2 l3 9" stroke="#263238" strokeWidth="3" /></g>
      <circle cx="288" cy="76" r="5" fill="#ffeb3b" stroke="#f57f17"><animate attributeName="cy" values="60;80;60" dur="0.7s" repeatCount={LOOP} /></circle>
    </>),
  },
  { // 6 Reversing & parking: car backs up slowly, child behind = danger
    hs: [[200, 196], [214, 70], [292, 44], [52, 168], [292, 168]],
    draw: () => (<>
      <rect width="320" height="220" fill="#cfd8dc" />
      <rect x="0" y="0" width="320" height="52" fill="#546e7a" /><RoadDashes x={-1} />
      <line x1="0" y1="26" x2="320" y2="26" stroke="#fff" strokeWidth="2" strokeDasharray="14 12" />
      <path d="M118 52 v168 M202 52 v168" stroke="#fff" strokeWidth="3" />
      {/* reversing car */}
      <Move values="0 0;0 46;0 46;0 0" keyTimes="0;0.5;0.8;1" dur="5s">
        <g transform="translate(160 92)"><CarTop color="#ffca28" />
          <Blink dur="0.6s"><rect x="-9" y="18" width="6" height="4" fill="#fff" /><rect x="3" y="18" width="6" height="4" fill="#fff" /></Blink></g>
      </Move>
      {/* child behind + flashing warning */}
      <g transform="translate(160 202)"><circle cy="-16" r="6" fill="#8d6e63" /><rect x="-6" y="-10" width="12" height="13" rx="4" fill="#ffb300" /></g>
      <Blink dur="0.7s"><path d="M136 176 L146 160 L156 176 Z" fill="#ffeb3b" stroke="#ce1126" strokeWidth="2" /><text x="146" y="174" fontSize="10" textAnchor="middle" fontWeight="800">!</text></Blink>
      {/* never reverse into main road */}
      <circle cx="268" cy="26" r="15" fill="#fff" stroke="#ce1126" strokeWidth="3" />
      <path d="M268 16 v18 m-6 -6 l6 7 6 -7" stroke="#263238" strokeWidth="3" fill="none" /><path d="M258 16 L278 36" stroke="#ce1126" strokeWidth="3" />
      {/* exam cones */}
      {[90, 128, 166].map((y) => <path key={y} d={`M22 ${y} l10 -20 10 20z`} fill="#ff7043" stroke="#bf360c" />)}
      {/* yellow line: no parking */}
      <rect x="232" y="196" width="80" height="6" fill="#ffd600" />
      <g transform="translate(270 168)"><g transform="rotate(90)"><CarTop color="#b0bec5" /></g></g>
      <path d="M252 152 L288 184 M288 152 L252 184" stroke="#ce1126" strokeWidth="4" />
    </>),
  },
  { // 7 Exam tips: checklist ticks itself off
    hs: [[34, 150], [96, 150], [160, 150], [224, 150], [288, 150]],
    draw: () => (<>
      <rect width="320" height="220" fill="#fff8e1" />
      {[34, 96, 160, 224, 288].map((x, k) => (
        <g key={x}>
          <rect x={x - 26} y="40" width="52" height="80" rx="10" fill="#fff" stroke="#cfd8dc" strokeWidth="2" />
          <circle cx={x + 20} cy="46" r="0" fill="#2e7d32">
            <animate attributeName="r" values="0;0;9;9;0" keyTimes={`0;${(k * 0.15).toFixed(2)};${(k * 0.15 + 0.06).toFixed(2)};0.92;1`} dur="6s" repeatCount={LOOP} /></circle>
          <path d={`M${x + 15} 46 l4 4 7 -8`} stroke="#fff" strokeWidth="2.5" fill="none" opacity="0">
            <animate attributeName="opacity" values="0;0;1;1;0" keyTimes={`0;${(k * 0.15 + 0.03).toFixed(2)};${(k * 0.15 + 0.06).toFixed(2)};0.92;1`} dur="6s" repeatCount={LOOP} /></path>
        </g>))}
      {/* CPR card */}
      <rect x="14" y="62" width="40" height="28" rx="4" fill="#fff" stroke="#263238" strokeWidth="2" /><text x="34" y="80" fontSize="9" textAnchor="middle" fontWeight="800" fill="#ce1126">CPR</text>
      {/* seat belt */}
      <rect x="80" y="56" width="32" height="44" rx="8" fill="#90a4ae" />
      <path d="M108 60 L84 96" stroke="#ce1126" strokeWidth="5" strokeLinecap="round" strokeDasharray="44" strokeDashoffset="44">
        <animate attributeName="stroke-dashoffset" values="44;0;0;44" keyTimes="0;0.3;0.9;1" dur="3s" repeatCount={LOOP} /></path>
      {/* indicator */}
      <Blink dur="0.7s"><path d="M176 80 h-22 m8 -9 l-9 9 9 9" stroke="#ff9800" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></Blink>
      {/* STOP */}
      <path d="M216 58 h16 l11 11 v16 l-11 11 h-16 l-11 -11 v-16z" fill="#ce1126" stroke="#fff" strokeWidth="2" /><text x="224" y="81" fontSize="9" textAnchor="middle" fontWeight="800" fill="#fff">STOP</text>
      {/* calm face */}
      <circle cx="288" cy="78" r="18" fill="#ffd54f" /><circle cx="282" cy="73" r="2.5" fill="#263238" /><circle cx="294" cy="73" r="2.5" fill="#263238" />
      <path d="M280 84 q8 7 16 0" stroke="#263238" strokeWidth="2.5" fill="none" />
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
          <circle cx={x} cy={y} r="17" className="hs-ring" />
          <circle cx={x} cy={y} r="11" className="hs-dot" />
          <text x={x} y={y + 4.5} textAnchor="middle" className="hs-num">{seen.includes(i) && active !== i ? "✓" : i + 1}</text>
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
