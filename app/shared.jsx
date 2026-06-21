// Shared UI — icons, logo, tags, small components. Exports to window.
const { useState, useEffect, useRef } = React;

/* ---------- Icons (simple line icons) ---------- */
function Icon({ name, size = 20, stroke = 1.6, style }) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round",
    strokeLinejoin: "round", style,
  };
  const paths = {
    home: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /></>,
    play: <path d="M7 5l12 7-12 7z" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    chart: <><path d="M4 20V4" /><path d="M4 20h16" /><path d="M8 16l3-4 3 3 4-6" /></>,
    spark: <path d="M12 3l2.2 6.2L20 11l-5.8 1.8L12 19l-2.2-6.2L4 11l5.8-1.8z" />,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" /><path d="M4 5.5V21" /></>,
    fileText: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5" /><path d="M9 12h6M9 16h6M9 8h2" /></>,
    arrowR: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    arrowL: <><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>,
    check: <path d="M5 12.5l4.5 4.5L19 6.5" />,
    x: <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>,
    flag: <><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>,
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    calendar: <><rect x="3" y="4.5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v3M16 3v3" /></>,
    map: <><path d="M9 18 4 20V6l5-2 6 2 5-2v14l-5 2z" /><path d="M9 4v14M15 6v14" /></>,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></>,
    trophy: <><path d="M7 4h10v4a5 5 0 0 1-10 0z" /><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3" /><path d="M9 16h6M10 20h4M12 13v3" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5z" /><path d="m3 13 9 5 9-5" /></>,
    download: <><path d="M12 4v11" /><path d="m7 11 5 5 5-5" /><path d="M5 20h14" /></>,
    bolt: <path d="M13 3 5 14h6l-1 7 8-11h-6z" />,
    chevR: <path d="m9 6 6 6-6 6" />,
    flame: <path d="M12 3c1 3-2 4-2 7a4 4 0 0 0 8 0c0-2-1-3-1-3 2 1 3 3 3 5a6 6 0 1 1-12 0c0-4 4-5 4-9z" />,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
    pause: <><path d="M8 5v14M16 5v14" /></>,
    filter: <path d="M3 5h18l-7 8v6l-4-2v-4z" />,
    shuffle: <><path d="M16 3h5v5" /><path d="M21 3 14 10" /><path d="M3 21l7-7" /><path d="M16 21h5v-5" /><path d="M3 3l7 7M21 16l-3.5-3.5" /></>,
    rotate: <><path d="M4 12a8 8 0 1 1 2.3 5.6" /><path d="M4 20v-4h4" /></>,
  };
  return <svg {...p}>{paths[name] || null}</svg>;
}

/* ---------- Brand mark: Ashoka-inspired abstract emblem (simple geometry only) ---------- */
function Logo({ size = 34 }) {
  return (
    <span className="brandmark" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.35" />
        <circle cx="20" cy="20" r="11.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return (
            <line key={i}
              x1={20 + Math.cos(a) * 2.5} y1={20 + Math.sin(a) * 2.5}
              x2={20 + Math.cos(a) * 11} y2={20 + Math.sin(a) * 11}
              stroke="currentColor" strokeWidth="1.1" />
          );
        })}
        <circle cx="20" cy="20" r="2.6" fill="currentColor" />
      </svg>
    </span>
  );
}

function Wordmark({ compact }) {
  return (
    <div className="wordmark">
      <span className="wm-logo"><Logo size={compact ? 28 : 34} /></span>
      <span className="wm-text">
        <span className="wm-title">Pariksha<span className="wm-dot">.</span></span>
        {!compact && <span className="wm-sub">PYQ &amp; Practice Bank</span>}
      </span>
    </div>
  );
}

/* ---------- Tag / chip ---------- */
function Tag({ children, tone = "neutral", soft }) {
  return <span className={`tag tag-${tone}${soft ? " tag-soft" : ""}`}>{children}</span>;
}

const SUBJECT_TONE = {
  "Polity": "indigo", "Economy": "saffron", "History": "rose", "Geography": "teal",
  "Environment": "green", "Science & Tech": "blue", "International Relations": "indigo",
  "Int'l Relations": "indigo", "CSAT": "blue", "Quantitative Aptitude": "teal",
  "Logical Reasoning": "teal", "Reading Comprehension": "blue", "Decision-Making": "indigo",
};
const DIFF_TONE = { Easy: "green", Moderate: "saffron", Hard: "rose" };

/* ---------- Difficulty pip ---------- */
function DiffMeter({ level }) {
  const n = level === "Easy" ? 1 : level === "Moderate" ? 2 : 3;
  return (
    <span className="diffmeter" title={level}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`pip${i <= n ? " on" : ""} diff-${(level || "").toLowerCase()}`} />
      ))}
    </span>
  );
}

/* ---------- Donut / ring progress ---------- */
function Ring({ value, size = 120, stroke = 10, color = "var(--green)", track = "var(--line)", children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, value)));
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .9s cubic-bezier(.2,.8,.2,1)" }} />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  );
}

/* ---------- Stat block ---------- */
function Stat({ value, label, sub, tone }) {
  return (
    <div className="stat">
      <div className={`stat-value${tone ? " t-" + tone : ""}`}>{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

/* ---------- Question stem renderer (serif, exam-paper style) ---------- */
function QuestionStem({ q, big }) {
  return (
    <div className={`stem${big ? " stem-big" : ""}`}>
      {q.passage && <div className="stem-passage">{q.passage}</div>}
      <p className="stem-lead">{q.stem}</p>
      {q.statements && q.statements.length > 0 && (
        <ol className="stmt-list">
          {q.statements.map((s, i) => (
            <li key={i}><span className="stmt-num">{i + 1}.</span><span>{s}</span></li>
          ))}
        </ol>
      )}
      {q.tail && <p className="stem-tail">{q.tail}</p>}
    </div>
  );
}

Object.assign(window, { Icon, Logo, Wordmark, Tag, DiffMeter, Ring, Stat, QuestionStem, SUBJECT_TONE, DIFF_TONE });
