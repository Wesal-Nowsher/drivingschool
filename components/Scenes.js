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
// Animated lesson scenes. Each scene is still until a rule is tapped;
// draw(a) receives the active rule index and only that rule's animation plays.
// Hotspots sit BESIDE objects so both stay visible.
const LOOP = "indefinite";
// Moves children along `values` when on; otherwise shows them at `rest` (an "x y" translate).
const Move = ({ on, values, keyTimes, dur, rest = "0 0", children }) => (
  <g transform={on ? undefined : `translate(${rest})`}>
    {on && <animateTransform attributeName="transform" type="translate" values={values} keyTimes={keyTimes} dur={dur} repeatCount={LOOP} />}
    {children}
  </g>
);
const Blink = ({ on, dur = "0.7s", children }) => (
  <g>{on && <animate attributeName="opacity" values="1;0.15;1" dur={dur} repeatCount={LOOP} />}{children}</g>
);
// Scale pulse that stays centred on (cx, cy).
const Focus = ({ on, cx, cy, children }) => (
  <g transform={`translate(${cx} ${cy})`}>
    <g>{on && <animateTransform attributeName="transform" type="scale" values="1;1.15;1" dur="0.9s" repeatCount={LOOP} />}
      <g transform={`translate(${-cx} ${-cy})`}>{children}</g></g>
  </g>
);
// Highlight ring that appears around the active object.
const Ring = ({ on, cx, cy, r }) => on ? (
  <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ffb300" strokeWidth="3" strokeDasharray="6 5">
    <animate attributeName="stroke-dashoffset" from="0" to="-22" dur="1s" repeatCount={LOOP} />
  </circle>) : null;
const Dashes = ({ on, x, y1 = -40, y2 = 260, speed = "0.8s", w = 3 }) => (
  <line x1={x} y1={y1} x2={x} y2={y2} stroke="#fff" strokeWidth={w} strokeDasharray="16 14">
    {on && <animate attributeName="stroke-dashoffset" from="0" to="-30" dur={speed} repeatCount={LOOP} />}
  </line>
);

const SCENES = [
  { // 0 Before you drive: view from the back seat
    // rules: 0 seat & mirrors, 1 seat belt, 2 no phone, 3 instructor beside you, 4 checks & start
    hs: [[200, 22], [142, 204], [26, 128], [266, 124], [186, 168]],
    draw: (a) => (<>
      <rect width="320" height="220" fill="#e9eef2" />
      <path d="M42 8 H278 L300 92 H20 Z" fill="#cfe8ff" />
      <path d="M140 92 L156 30 H164 L180 92 Z" fill="#8a9299" />
      <Dashes on={a === 4} x={160} y1={30} y2={92} speed="0.6s" w={2} />
      <path d="M20 92 H300 V110 H20 Z" fill="#37474f" />
      <Focus on={a === 0} cx={160} cy={21}><rect x="135" y="14" width="50" height="14" rx="5" fill="#455a64" /><rect x="139" y="17" width="42" height="8" rx="3" fill="#b3e5fc" /></Focus>
      <Focus on={a === 0} cx={15} cy={73}><path d="M6 64 h18 v18 h-18 z" fill="#455a64" /><rect x="8" y="66" width="14" height="14" rx="2" fill="#b3e5fc" /></Focus>
      <Focus on={a === 0} cx={305} cy={73}><path d="M296 64 h18 v18 h-18 z" fill="#455a64" /><rect x="298" y="66" width="14" height="14" rx="2" fill="#b3e5fc" /></Focus>
      <circle cx="95" cy="104" r="24" fill="none" stroke="#263238" strokeWidth="7" />
      <path d="M71 104 H119 M95 104 V128" stroke="#263238" strokeWidth="6" />
      {/* driver seat: slides forward when adjusting */}
      <Move on={a === 0} values="0 8;0 0;0 0;0 8" keyTimes="0;0.3;0.8;1" dur="2.5s" rest="0 0">
        <rect x="58" y="140" width="74" height="80" rx="16" fill="#78909c" />
        <circle cx="95" cy="138" r="17" fill="#5d4037" />
        <path d="M120 150 L70 214" stroke="#ce1126" strokeWidth="7" strokeLinecap="round" strokeDasharray="80" strokeDashoffset={a === 1 ? 80 : 0}>
          {a === 1 && <animate attributeName="stroke-dashoffset" values="80;0;0" keyTimes="0;0.4;1" dur="2.2s" repeatCount={LOOP} />}
        </path>
      </Move>
      <Ring on={a === 1} cx={95} cy={182} r={44} />
      <rect x="188" y="140" width="74" height="80" rx="16" fill="#90a4ae" />
      <circle cx="225" cy="138" r="17" fill="#3e2723" />
      <Blink on={a === 3} dur="0.8s"><rect x="208" y="112" width="34" height="12" rx="3" fill="#ce1126" /><text x="225" y="122" fontSize="10" textAnchor="middle" fill="#fff" fontWeight="800">L</text></Blink>
      <Ring on={a === 3} cx={225} cy={160} r={44} />
      <rect x="152" y="150" width="16" height="44" rx="6" fill="#263238" />
      <Blink on={a === 4} dur="0.8s"><circle cx="160" cy="148" r="11" fill="#263238" /><text x="160" y="152" fontSize="12" textAnchor="middle" fill="#fff" fontWeight="800">P</text></Blink>
      <g transform="translate(34 172)">
        {a === 2 && <animateTransform attributeName="transform" type="rotate" values="-10;10;-10" dur="0.5s" repeatCount={LOOP} additive="sum" />}
        <rect x="-9" y="-15" width="18" height="30" rx="3" fill="#263238" /><rect x="-7" y="-11" width="14" height="20" fill="#90caf9" />
        <circle r="17" fill="none" stroke="#ce1126" strokeWidth="4" /><path d="M-12 -12 L12 12" stroke="#ce1126" strokeWidth="4" />
      </g>
    </>),
  },
  { // 1 Keep right, lanes & speed
    // rules: 0 drive on the right, 1 overtake on the left, 2 speed limits, 3 2-second gap, 4 indicator
    hs: [[272, 186], [186, 206], [300, 92], [272, 112], [138, 34]],
    draw: (a) => (<>
      <rect width="320" height="220" fill="#a5d6a7" />
      <rect x="70" y="0" width="180" height="220" fill="#546e7a" />
      <line x1="157" y1="0" x2="157" y2="220" stroke="#ffd54f" strokeWidth="3" /><line x1="163" y1="0" x2="163" y2="220" stroke="#ffd54f" strokeWidth="3" />
      <Dashes on={a === 0 || a === 3} x={114} speed="0.5s" /><Dashes on={a === 0 || a === 3} x={206} speed="0.8s" />
      <line x1="72" y1="0" x2="72" y2="220" stroke="#fff" strokeWidth="2" /><line x1="248" y1="0" x2="248" y2="220" stroke="#fff" strokeWidth="2" />
      <Move on={a === 0} values="0 -60;0 300" dur="2.6s" rest="0 40"><g transform="translate(92 0) rotate(180)"><CarTop color="#90caf9" /></g></Move>
      <g transform="translate(228 170)"><CarTop color="#ffca28" /></g>
      <Blink on={a === 0} dur="0.6s"><path d="M206 214 v-22 m-7 8 l7 -9 7 9" stroke="#fff" strokeWidth="3" fill="none" /></Blink>
      <g transform="translate(228 70)"><CarTop color="#b0bec5" /></g>
      <Blink on={a === 3}><path d="M252 92 v54 M247 92 h10 M247 146 h10" stroke={a === 3 ? "#ffd54f" : "#fff"} strokeWidth="2.5" />
        <text x="262" y="124" fontSize="12" fill={a === 3 ? "#ffd54f" : "#fff"} fontWeight="800">2s</text></Blink>
      <Move on={a === 1 || a === 4} values="0 260;0 -60" dur="3.2s" rest="0 140">
        <g transform="translate(184 0)"><CarTop color="#ef9a9a" />
          <Blink on={a === 1 || a === 4} dur="0.45s"><circle cx="-10" cy="-19" r="4" fill={a === 1 || a === 4 ? "#ff9800" : "transparent"} /></Blink></g>
      </Move>
      <rect x="283" y="60" width="4" height="70" fill="#37474f" />
      <Focus on={a === 2} cx={285} cy={50}><circle cx="285" cy="50" r="18" fill="#fff" stroke="#ce1126" strokeWidth="5" /><text x="285" y="56" fontSize="15" textAnchor="middle" fontWeight="800" fill="#263238">60</text></Focus>
    </>),
  },
  null, // 2 roundabout: handled by <Roundabout/>
  { // 3 Traffic lights & junctions
    // rules: 0 red/amber/green, 1 yellow box, 2 red light offence, 3 STOP, 4 give way
    hs: [[254, 140], [212, 64], [112, 162], [300, 66], [92, 198]],
    draw: (a) => {
      const cycle = a === 0;
      return (<>
        <rect width="320" height="220" fill="#a5d6a7" />
        <rect x="0" y="80" width="320" height="56" fill="#546e7a" /><rect x="132" y="0" width="56" height="220" fill="#546e7a" />
        <Blink on={a === 1} dur="0.7s"><g stroke="#ffd54f" strokeWidth="2.5"><rect x="132" y="80" width="56" height="56" fill={a === 1 ? "rgba(255,213,79,.25)" : "none"} /><path d="M132 80 L188 136 M188 80 L132 136 M160 80 L188 108 M132 108 L160 136 M160 136 L188 108 M132 108 L160 80" /></g></Blink>
        <Blink on={a === 2} dur="0.5s"><rect x="160" y="146" width="28" height="4" fill={a === 2 ? "#e53935" : "#fff"} /></Blink>
        <line x1="160" y1="150" x2="160" y2="220" stroke="#fff" strokeWidth="2" strokeDasharray="8 8" />
        <Move on={cycle} values="0 90;0 0;0 0;0 -240;0 -240" keyTimes="0;0.25;0.42;0.75;1" dur="6s" rest="0 0">
          <g transform="translate(174 172)"><CarTop color="#ffca28" /></g>
        </Move>
        {a === 2 && <g><path d="M150 186 l48 -20" stroke="#e53935" strokeWidth="0" /><text x="110" y="196" fontSize="22" fill="#e53935" fontWeight="900">✕</text></g>}
        <rect x="226" y="150" width="5" height="50" fill="#263238" />
        <rect x="214" y="92" width="30" height="64" rx="7" fill="#263238" />
        <circle cx="229" cy="106" r="8" fill="#e53935" opacity={cycle ? 1 : 1}>{cycle && <animate attributeName="opacity" values="1;1;0.15;0.15" keyTimes="0;0.42;0.43;1" dur="6s" repeatCount={LOOP} />}</circle>
        <circle cx="229" cy="124" r="8" fill="#ffb300" opacity="0.15">{cycle && <animate attributeName="opacity" values="0.15;0.15;1;1" keyTimes="0;0.8;0.81;1" dur="6s" repeatCount={LOOP} />}</circle>
        <circle cx="229" cy="142" r="8" fill="#43a047" opacity="0.15">{cycle && <animate attributeName="opacity" values="0.15;0.15;1;1;0.15;0.15" keyTimes="0;0.42;0.43;0.8;0.81;1" dur="6s" repeatCount={LOOP} />}</circle>
        <rect x="268" y="48" width="4" height="30" fill="#263238" />
        <Focus on={a === 3} cx={268} cy={33}><path d="M262 18 h12 l9 9 v12 l-9 9 h-12 l-9 -9 v-12z" fill="#ce1126" stroke="#fff" strokeWidth="2" /><text x="268" y="37" fontSize="8" textAnchor="middle" fontWeight="800" fill="#fff">STOP</text></Focus>
        <rect x="58" y="176" width="4" height="40" fill="#263238" />
        <Focus on={a === 4} cx={60} cy={176}><path d="M60 196 L42 164 H78 Z" fill="#fff" stroke="#ce1126" strokeWidth="4" strokeLinejoin="round" /></Focus>
      </>);
    },
  },
  { // 4 Road signs: tapping a number makes that sign pop
    hs: [[45, 120], [105, 120], [165, 120], [225, 120], [285, 120]],
    draw: (a) => (<>
      <rect width="320" height="220" fill="#e8f5e9" />
      <rect y="196" width="320" height="24" fill="#546e7a" />
      {[45, 105, 165, 225, 285].map((x) => <rect key={x} x={x - 2} y="80" width="4" height="116" fill="#37474f" />)}
      <Focus on={a === 0} cx={45} cy={60}><circle cx="45" cy="60" r="24" fill="#ce1126" /><rect x="29" y="55" width="32" height="10" fill="#fff" /></Focus>
      <Focus on={a === 0} cx={45} cy={165}><circle cx="45" cy="165" r="16" fill="#fff" stroke="#ce1126" strokeWidth="5" /><text x="45" y="170" fontSize="13" textAnchor="middle" fontWeight="800" fill="#263238">60</text></Focus>
      <Focus on={a === 1} cx={105} cy={60}><circle cx="105" cy="60" r="24" fill="#1565c0" /><path d="M95 60 h18 m-7 -8 l8 8 -8 8" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /></Focus>
      <Focus on={a === 2} cx={165} cy={60}><path d="M165 33 L191 82 H139 Z" fill="#fff" stroke="#ce1126" strokeWidth="5" strokeLinejoin="round" />
        <circle cx="158" cy="68" r="5" fill="#263238" /><circle cx="172" cy="68" r="5" fill="#263238" /><circle cx="165" cy="56" r="5" fill="#263238" /></Focus>
      <Focus on={a === 3} cx={225} cy={60}><rect x="197" y="42" width="56" height="36" rx="4" fill="#1565c0" stroke="#fff" strokeWidth="2" /><path d="M208 60 h28 m-8 -8 l8 8 -8 8" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" /></Focus>
      <Focus on={a === 4} cx={285} cy={60}><path d="M275 36 h20 l14 14 v20 l-14 14 h-20 l-14 -14 v-20z" fill="#ce1126" stroke="#fff" strokeWidth="2.5" /><text x="285" y="64" fontSize="11" textAnchor="middle" fontWeight="800" fill="#fff">STOP</text></Focus>
      <Focus on={a === 4} cx={285} cy={165}><path d="M285 182 L268 152 H302 Z" fill="#fff" stroke="#ce1126" strokeWidth="4" strokeLinejoin="round" /></Focus>
    </>),
  },
  { // 5 Pedestrians
    // rules: 0 zebra crossing, 1 slow near schools, 2 watch children, 3 don't overtake at crossing
    hs: [[206, 64], [108, 20], [292, 96], [30, 188]],
    draw: (a) => (<>
      <rect width="320" height="220" fill="#a5d6a7" />
      <rect x="0" y="86" width="320" height="76" fill="#546e7a" />
      <line x1="0" y1="124" x2="320" y2="124" stroke="#fff" strokeWidth="2" strokeDasharray="14 12" />
      {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x="140" y={89 + k * 12} width="44" height="7" fill="#fff" />)}
      <Focus on={a === 1} cx={52} cy={40}><rect x="12" y="20" width="80" height="50" fill="#ffe0b2" stroke="#5d4037" strokeWidth="2" /><path d="M8 22 L52 2 L96 22 Z" fill="#e57373" />
        <rect x="44" y="44" width="16" height="26" fill="#8d6e63" /></Focus>
      <Move on={a === 0} values="0 0;0 -118;0 -118" keyTimes="0;0.8;1" dur="5s" rest="0 0">
        <g transform="translate(162 196)">
          <circle cy="-22" r="7" fill="#8d6e63" /><rect x="-7" y="-15" width="14" height="18" rx="4" fill="#ef6c00" />
          <path d="M-3 3 l-5 12 M3 3 l5 12" stroke="#263238" strokeWidth="3" strokeLinecap="round">
            {a === 0 && <animate attributeName="d" values="M-3 3 l-5 12 M3 3 l5 12;M-3 3 l2 12 M3 3 l-2 12;M-3 3 l-5 12 M3 3 l5 12" dur="0.5s" repeatCount={LOOP} />}</path>
        </g>
      </Move>
      {/* waiting car: slows to a stop when rule 1 (school) is active */}
      <Move on={a === 1} values="-60 0;0 0;0 0" keyTimes="0;0.6;1" dur="3s" rest="0 0">
        <g transform="translate(112 142) rotate(90)"><CarTop color="#ffca28" /></g>
      </Move>
      <g transform="translate(60 142) rotate(90)"><CarTop color="#b0bec5" /></g>
      <Blink on={a === 3} dur="0.6s">
        <path d="M58 168 q40 22 80 0" stroke="#ce1126" strokeWidth="3" fill="none" strokeDasharray="6 5" />
        <path d="M84 168 l20 14 M104 168 l-20 14" stroke="#ce1126" strokeWidth="4" />
      </Blink>
      <Move on={a === 2} values="0 0;-60 60;-60 60" keyTimes="0;0.6;1" dur="2.5s" rest="0 0">
        <g transform="translate(270 70)"><circle cy="-18" r="6" fill="#8d6e63" /><rect x="-6" y="-12" width="12" height="14" rx="4" fill="#ab47bc" /><path d="M-3 2 l-3 9 M3 2 l3 9" stroke="#263238" strokeWidth="3" /></g>
        <circle cx="288" cy="76" r="5" fill="#ffeb3b" stroke="#f57f17">{a === 2 && <animate attributeName="cy" values="60;80;60" dur="0.6s" repeatCount={LOOP} />}</circle>
      </Move>
    </>),
  },
  { // 6 Reversing & parking
    // rules: 0 check around (child), 1 reverse slowly, 2 never into main road, 3 exam cones, 4 park only where allowed
    hs: [[200, 196], [214, 70], [292, 44], [52, 168], [292, 168]],
    draw: (a) => (<>
      <rect width="320" height="220" fill="#cfd8dc" />
      <rect x="0" y="0" width="320" height="52" fill="#546e7a" />
      <line x1="0" y1="26" x2="320" y2="26" stroke="#fff" strokeWidth="2" strokeDasharray="14 12" />
      <path d="M118 52 v168 M202 52 v168" stroke="#fff" strokeWidth="3" />
      <Move on={a === 1} values="0 0;0 46;0 46;0 0" keyTimes="0;0.5;0.8;1" dur="5s" rest="0 0">
        <g transform="translate(160 92)"><CarTop color="#ffca28" />
          <Blink on={a === 1} dur="0.6s"><rect x="-9" y="18" width="6" height="4" fill={a === 1 ? "#fff" : "#90a4ae"} /><rect x="3" y="18" width="6" height="4" fill={a === 1 ? "#fff" : "#90a4ae"} /></Blink></g>
      </Move>
      <g transform="translate(160 202)"><circle cy="-16" r="6" fill="#8d6e63" /><rect x="-6" y="-10" width="12" height="13" rx="4" fill="#ffb300" /></g>
      {a === 0 && <Blink on dur="0.6s"><path d="M136 176 L146 160 L156 176 Z" fill="#ffeb3b" stroke="#ce1126" strokeWidth="2" /><text x="146" y="174" fontSize="10" textAnchor="middle" fontWeight="800">!</text></Blink>}
      <Ring on={a === 0} cx={160} cy={190} r={24} />
      <Focus on={a === 2} cx={268} cy={26}><circle cx="268" cy="26" r="15" fill="#fff" stroke="#ce1126" strokeWidth="3" />
        <path d="M268 16 v18 m-6 -6 l6 7 6 -7" stroke="#263238" strokeWidth="3" fill="none" /><path d="M258 16 L278 36" stroke="#ce1126" strokeWidth="3" /></Focus>
      {[90, 128, 166].map((y) => <Focus key={y} on={a === 3} cx={32} cy={y - 10}><path d={`M22 ${y} l10 -20 10 20z`} fill="#ff7043" stroke="#bf360c" /></Focus>)}
      <rect x="232" y="196" width="80" height="6" fill="#ffd600" />
      <g transform="translate(270 168)"><g transform="rotate(90)"><CarTop color="#b0bec5" /></g></g>
      <Blink on={a === 4} dur="0.6s"><path d="M252 152 L288 184 M288 152 L252 184" stroke="#ce1126" strokeWidth="4" /></Blink>
    </>),
  },
  { // 7 Exam tips: tapping a number ticks that item
    hs: [[34, 150], [96, 150], [160, 150], [224, 150], [288, 150]],
    draw: (a) => (<>
      <rect width="320" height="220" fill="#fff8e1" />
      {[34, 96, 160, 224, 288].map((x, k) => (
        <g key={x}>
          <rect x={x - 26} y="40" width="52" height="80" rx="10" fill="#fff" stroke={a === k ? "#2e7d32" : "#cfd8dc"} strokeWidth={a === k ? 3 : 2} />
          {a === k && <g>
            <circle cx={x + 20} cy="46" r="0" fill="#2e7d32"><animate attributeName="r" values="0;10;9" dur="0.4s" fill="freeze" /></circle>
            <path d={`M${x + 15} 46 l4 4 7 -8`} stroke="#fff" strokeWidth="2.5" fill="none" opacity="0"><animate attributeName="opacity" values="0;1" begin="0.2s" dur="0.2s" fill="freeze" /></path>
          </g>}
        </g>))}
      <Focus on={a === 0} cx={34} cy={76}><rect x="14" y="62" width="40" height="28" rx="4" fill="#fff" stroke="#263238" strokeWidth="2" /><text x="34" y="80" fontSize="9" textAnchor="middle" fontWeight="800" fill="#ce1126">CPR</text></Focus>
      <rect x="80" y="56" width="32" height="44" rx="8" fill="#90a4ae" />
      <path d="M108 60 L84 96" stroke="#ce1126" strokeWidth="5" strokeLinecap="round" strokeDasharray="44" strokeDashoffset={a === 1 ? 44 : 0}>
        {a === 1 && <animate attributeName="stroke-dashoffset" values="44;0;0" keyTimes="0;0.4;1" dur="2s" repeatCount={LOOP} />}</path>
      <Blink on={a === 2} dur="0.5s"><path d="M176 80 h-22 m8 -9 l-9 9 9 9" stroke="#ff9800" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></Blink>
      <Focus on={a === 3} cx={224} cy={77}><path d="M216 58 h16 l11 11 v16 l-11 11 h-16 l-11 -11 v-16z" fill="#ce1126" stroke="#fff" strokeWidth="2" /><text x="224" y="81" fontSize="9" textAnchor="middle" fontWeight="800" fill="#fff">STOP</text></Focus>
      <Focus on={a === 4} cx={288} cy={78}><circle cx="288" cy="78" r="18" fill="#ffd54f" /><circle cx="282" cy="73" r="2.5" fill="#263238" /><circle cx="294" cy="73" r="2.5" fill="#263238" />
        <path d="M280 84 q8 7 16 0" stroke="#263238" strokeWidth="2.5" fill="none" /></Focus>
    </>),
  },
];

// Static, uncoloured version of a lesson picture (no hotspots) for the simple app.
export function PlainScene({ index }) {
  const sc = SCENES[index];
  if (!sc) return null;
  return <svg viewBox="0 0 320 220" className={`s-illus ${index === 3 || index === 4 ? "s-color" : ""}`} role="img" aria-hidden="true">{sc.draw(null)}</svg>;
}

export function LessonScene({ index, active, seen, onTap, nonce = 0 }) {
  const sc = SCENES[index];
  if (!sc) return null;
  // key: remounting the <svg> restarts its animation timeline on every tap
  return (
    <svg key={`${active}-${nonce}`} viewBox="0 0 320 220" className="art scene" role="img">
      {sc.draw(active)}
      {sc.hs.map(([x, y], i) => (
        <g key={i} className={`hs ${active === i ? "on" : ""} ${seen.includes(i) ? "seen" : ""}`}
           onClick={() => onTap(i)} role="button" tabIndex={0}
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
