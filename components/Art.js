// Flat illustrations drawn in SVG. If you generate your own images (see docs/image-prompts.md),
// save them as public/illustrations/<key>.png and add the key to CONFIG.generatedImages.
import { CONFIG } from "@/lib/config";

const SKY = "#dff1ff", SAND = "#f3e3c3", RED = "#ce1126", INK = "#263238", ROAD = "#4a5056";

function Frame({ children, label }) {
  return (
    <svg viewBox="0 0 320 200" className="art" role="img" aria-label={label}>
      <rect width="320" height="200" rx="16" fill={SKY} />
      <rect y="150" width="320" height="50" fill={SAND} />
      {children}
    </svg>
  );
}

const Person = ({ x, y, shirt = "#3f7fd8", s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx="0" cy="-52" r="12" fill="#c98d63" />
    <path d="M-12 -62 q12 -12 24 0 v-2 q-12 -14 -24 0z" fill={INK} />
    <rect x="-15" y="-38" width="30" height="38" rx="10" fill={shirt} />
    <rect x="-12" y="-2" width="10" height="26" rx="4" fill={INK} />
    <rect x="2" y="-2" width="10" height="26" rx="4" fill={INK} />
  </g>
);

const Car = ({ x, y, color = "#d8b98a", s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-60 0 q0 -22 22 -24 l14 -18 q6 -6 16 -6 h36 q10 0 16 6 l16 18 q24 2 24 24 v8 h-144z" fill={color} />
    <path d="M-20 -40 h26 v16 h-38z M12 -40 h20 l12 16 h-32z" fill="#bfe3ff" />
    <circle cx="-34" cy="8" r="13" fill={INK} /><circle cx="-34" cy="8" r="5" fill="#ccc" />
    <circle cx="44" cy="8" r="13" fill={INK} /><circle cx="44" cy="8" r="5" fill="#ccc" />
  </g>
);

const ART = {
  welcome: (
    <>
      <circle cx="270" cy="40" r="20" fill="#ffd54f" />
      <rect x="0" y="140" width="320" height="30" fill={ROAD} />
      {[20, 80, 140, 200, 260].map((x) => <rect key={x} x={x} y="153" width="30" height="4" fill="#fff" />)}
      <Car x={150} y={140} />
      <rect x="20" y="40" width="64" height="40" rx="4" fill="#fff" stroke={INK} strokeWidth="2" />
      <path d="M84 40 H40 l8 4 -8 4 8 4 -8 4 8 4 -8 4 8 4 -8 4 8 4 -8 4 H84z" fill={RED} />
      <rect x="50" y="80" width="4" height="60" fill={INK} />
    </>
  ),
  step0: ( // download app
    <>
      <rect x="120" y="22" width="80" height="150" rx="14" fill={INK} />
      <rect x="127" y="34" width="66" height="122" rx="6" fill="#fff" />
      <rect x="140" y="52" width="40" height="40" rx="10" fill={RED} />
      <path d="M160 60 v20 m-9 -9 l9 9 9 -9" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
      <rect x="138" y="102" width="44" height="8" rx="4" fill="#cfd8dc" />
      <rect x="138" y="118" width="44" height="14" rx="7" fill="#25a55f" />
      <Person x={60} y={175} shirt="#7e57c2" />
    </>
  ),
  step1: ( // book appointment calendar
    <>
      <rect x="90" y="30" width="140" height="120" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect x="90" y="30" width="140" height="30" rx="10" fill={RED} />
      {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => (
        <rect key={`${r}${c}`} x={102 + c * 24} y={70 + r * 19} width="18" height="13" rx="3" fill={r === 2 && c === 3 ? "#25a55f" : "#e3e8ec"} />)))}
      <path d="M176 109 l4 4 8 -8" stroke="#fff" strokeWidth="3" fill="none" />
      <rect x="110" y="20" width="8" height="20" rx="4" fill={INK} /><rect x="202" y="20" width="8" height="20" rx="4" fill={INK} />
    </>
  ),
  step2: ( // branch + eye test
    <>
      <rect x="30" y="50" width="130" height="100" fill="#eceff1" stroke={INK} strokeWidth="2" />
      <rect x="30" y="38" width="130" height="16" fill={RED} />
      <rect x="80" y="100" width="30" height="50" fill="#90a4ae" />
      <rect x="45" y="70" width="25" height="20" fill="#bfe3ff" /><rect x="120" y="70" width="25" height="20" fill="#bfe3ff" />
      <rect x="200" y="30" width="80" height="110" rx="6" fill="#fff" stroke={INK} strokeWidth="2" />
      <text x="240" y="62" fontSize="26" textAnchor="middle" fontWeight="700" fill={INK}>E</text>
      <text x="240" y="88" fontSize="16" textAnchor="middle" fontWeight="700" fill={INK}>F P</text>
      <text x="240" y="108" fontSize="11" textAnchor="middle" fontWeight="700" fill={INK}>T O Z</text>
      <text x="240" y="124" fontSize="8" textAnchor="middle" fontWeight="700" fill={INK}>L P E D</text>
      <rect x="180" y="150" width="70" height="40" rx="6" fill="#1565c0" />
      <rect x="180" y="160" width="70" height="8" fill={INK} />
      <text x="230" y="185" fontSize="12" fill="#fff" fontWeight="700">27 BD</text>
    </>
  ),
  step3: ( // learner licence card
    <>
      <rect x="70" y="40" width="180" height="110" rx="12" fill="#fff" stroke={INK} strokeWidth="3" />
      <rect x="70" y="40" width="180" height="26" rx="12" fill={RED} />
      <rect x="86" y="80" width="46" height="56" rx="6" fill="#cfd8dc" />
      <circle cx="109" cy="100" r="10" fill="#90a4ae" /><rect x="94" y="114" width="30" height="16" rx="8" fill="#90a4ae" />
      <rect x="144" y="84" width="90" height="8" rx="4" fill="#cfd8dc" /><rect x="144" y="100" width="70" height="8" rx="4" fill="#cfd8dc" />
      <rect x="196" y="108" width="40" height="34" rx="6" fill={RED} />
      <text x="216" y="134" fontSize="26" textAnchor="middle" fontWeight="800" fill="#fff">L</text>
    </>
  ),
  step4: ( // class with instructor
    <>
      <rect x="0" y="140" width="320" height="30" fill={ROAD} />
      <Car x={160} y={140} s={1.3} />
      <circle cx="148" cy="88" r="10" fill="#c98d63" /><circle cx="186" cy="88" r="10" fill="#c98d63" />
      <rect x="230" y="40" width="54" height="34" rx="6" fill={RED} />
      <text x="257" y="66" fontSize="24" textAnchor="middle" fontWeight="800" fill="#fff">L</text>
      <text x="60" y="60" fontSize="30">⏱️</text><text x="40" y="96" fontSize="16" fontWeight="700" fill={INK}>22 h</text>
    </>
  ),
  step5: ( // exam clipboard
    <>
      <rect x="110" y="26" width="110" height="140" rx="10" fill="#8d6e63" />
      <rect x="120" y="40" width="90" height="118" rx="4" fill="#fff" />
      <rect x="145" y="20" width="40" height="16" rx="6" fill={INK} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="130" y={54 + i * 24} width="14" height="14" rx="3" fill="#e3e8ec" />
          <path d={`M132 ${61 + i * 24} l4 4 7 -8`} stroke="#25a55f" strokeWidth="3" fill="none" />
          <rect x="152" y={58 + i * 24} width="48" height="6" rx="3" fill="#cfd8dc" />
        </g>))}
      <Person x={260} y={175} shirt="#455a64" />
    </>
  ),
  step6: ( // licence + celebration
    <>
      {["#ffd54f", RED, "#25a55f", "#3f7fd8"].map((c, i) => <circle key={i} cx={40 + i * 80} cy={30 + (i % 2) * 20} r="6" fill={c} />)}
      <rect x="80" y="50" width="160" height="100" rx="12" fill="#1565c0" />
      <rect x="96" y="70" width="42" height="52" rx="6" fill="#bbdefb" />
      <rect x="150" y="74" width="74" height="8" rx="4" fill="#bbdefb" /><rect x="150" y="90" width="56" height="8" rx="4" fill="#bbdefb" />
      <circle cx="210" cy="125" r="16" fill="#25a55f" /><path d="M202 125 l6 6 10 -12" stroke="#fff" strokeWidth="4" fill="none" />
    </>
  ),
  costs: (
    <>
      <rect x="90" y="40" width="140" height="100" rx="12" fill="#25a55f" />
      <circle cx="160" cy="90" r="30" fill="#2e7d32" />
      <text x="160" y="100" fontSize="26" textAnchor="middle" fontWeight="800" fill="#fff">BD</text>
      <circle cx="80" cy="150" r="18" fill="#ffd54f" stroke="#f9a825" strokeWidth="3" />
      <circle cx="245" cy="150" r="18" fill="#ffd54f" stroke="#f9a825" strokeWidth="3" />
    </>
  ),
  docs: (
    <>
      <rect x="60" y="40" width="120" height="76" rx="10" fill="#fff" stroke={INK} strokeWidth="3" />
      <text x="120" y="66" fontSize="14" textAnchor="middle" fontWeight="800" fill={RED}>CPR</text>
      <rect x="74" y="76" width="30" height="32" rx="4" fill="#cfd8dc" />
      <rect x="112" y="80" width="56" height="6" rx="3" fill="#cfd8dc" /><rect x="112" y="94" width="44" height="6" rx="3" fill="#cfd8dc" />
      <rect x="150" y="70" width="110" height="70" rx="10" fill="#1565c0" /><rect x="150" y="84" width="110" height="10" fill={INK} />
      <path d="M220 160 q10 -14 30 -12" stroke={INK} strokeWidth="3" fill="none" />
      <circle cx="210" cy="164" r="12" fill="none" stroke={INK} strokeWidth="3" /><circle cx="262" cy="160" r="12" fill="none" stroke={INK} strokeWidth="3" />
    </>
  ),
};

export default function Art({ name, label = "" }) {
  if (CONFIG.generatedImages?.includes(name)) {
    return <img className="art" src={`/illustrations/${name}.png`} alt={label} />;
  }
  return <Frame label={label}>{ART[name]}</Frame>;
}
