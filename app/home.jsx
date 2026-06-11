// Home / landing + exam picker + daily quiz discovery
const { useState: useStateHome, useEffect: useEffectHome } = React;

function ExamSwitcher() {
  const exams = [
    { id: "upsc", name: "UPSC CSE", note: "Prelims · GS + CSAT", live: true },
    { id: "ssc", name: "SSC CGL", note: "Coming soon", live: false },
    { id: "rbi", name: "RBI Grade B", note: "Coming soon", live: false },
    { id: "bank", name: "Banking", note: "Coming soon", live: false },
  ];
  const [active, setActive] = useStateHome("upsc");
  return (
    <div className="exam-switch" role="tablist" aria-label="Exam">
      {exams.map((e) => (
        <button key={e.id} role="tab" aria-selected={active === e.id}
          className={`exam-tab${active === e.id ? " active" : ""}${!e.live ? " locked" : ""}`}
          onClick={() => e.live && setActive(e.id)}>
          <span className="exam-name">{e.name}</span>
          <span className="exam-note">{e.live ? e.note : <><span className="soon-dot" /> {e.note}</>}</span>
        </button>
      ))}
    </div>
  );
}

function formatIsoDate(isoDate, options = { day: "2-digit", month: "short", year: "numeric" }) {
  const [year, month, day] = String(isoDate).split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

function HeroCalendar({ go, progress }) {
  const ds = window.UPSC;
  const today = ds.todayIso;
  const dailySets = ds.getQuestionSetsBySource("daily");
  const dailyByDate = new Map(dailySets.map((set) => [set.isoDate, set]));
  const done = progress.dailyCompletions || {};
  const [year, month] = today.split("-").map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const blanks = Array.from({ length: first.getUTCDay() });
  const todaySet = dailyByDate.get(today);
  const latestDaily = [...dailySets].filter((set) => set.isoDate).sort((a, b) => b.isoDate.localeCompare(a.isoDate))[0];
  const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
  const status = todaySet
    ? done[today] ? "Today’s daily quiz is complete." : "Today’s daily quiz is pending."
    : latestDaily ? `Latest loaded: ${formatIsoDate(latestDaily.isoDate)}.` : "No daily quiz loaded yet.";

  return (
    <aside className="hero-calendar">
      <div className="hero-calendar-head">
        <span className="eyebrow small"><span className="eyebrow-line" /> Daily tracker</span>
        <h2>{monthLabel}</h2>
      </div>
      <div className="calendar-card">
        <div className="calendar-weekdays">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
        </div>
        <div className="calendar-grid">
          {blanks.map((_, index) => <span key={`blank-${index}`} className="cal-day blank" />)}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const set = dailyByDate.get(iso);
            const complete = Boolean(done[iso]);
            return (
              <button
                key={iso}
                className={`cal-day${iso === today ? " today" : ""}${set ? " available" : ""}${complete ? " done" : ""}`}
                disabled={!set}
                onClick={() => set && go("test", { setId: set.id })}
                title={set ? set.label : "No daily quiz"}>
                <span>{day}</span>
                {complete && <Icon name="check" size={12} />}
              </button>
            );
          })}
        </div>
      </div>
      <p className="hero-calendar-foot">{status}</p>
    </aside>
  );
}

function DailyQuizCard({ go, progress }) {
  const ds = window.UPSC;
  const dailyQuiz = ds.dailyQuiz;
  const dailySet = ds.getQuestionSetById(ds.defaultQuestionSetId);
  const complete = Boolean(progress.dailyCompletions?.[dailyQuiz.isoDate]);
  const subjectLabel = dailySet?.subjects?.slice(0, 3).join(" · ") || "Environment · IR · Economy";
  return (
    <article className="daily-card">
      <div className="daily-glow" aria-hidden="true" />
      <div className="daily-top">
        <span className="ai-badge"><Icon name="spark" size={14} /> AI · Current Affairs</span>
        <span className="daily-date">{dailyQuiz.dateLabel}</span>
      </div>
      <h2 className="daily-title">{dailyQuiz.title}</h2>
      <p className="daily-desc">{dailyQuiz.description}</p>
      <div className="daily-meta">
        <span><strong>{dailySet?.questionCount || 0}</strong> questions</span>
        <span className="dot-sep" />
        <span><strong>~{dailyQuiz.durationMinutes}</strong> min</span>
        <span className="dot-sep" />
        <span className="daily-subjects">{complete ? "Completed" : "Pending"} · {subjectLabel}</span>
      </div>
      <div className="daily-actions">
        <button className="btn btn-saffron" onClick={() => go("test", { setId: ds.defaultQuestionSetId })}>
          {complete ? "Retake daily quiz" : "Start daily quiz"} <Icon name="arrowR" size={18} />
        </button>
      </div>
    </article>
  );
}

function BuildTest({ go }) {
  const ds = window.UPSC;
  const [paper, setPaper] = useStateHome("gs");
  const [year, setYear] = useStateHome(2025);
  const csatSets = ds.getQuestionSetsBySource("csat");
  const [csatSetId, setCsatSetId] = useStateHome(csatSets[0]?.id || "");
  const [timed, setTimed] = useStateHome(true);
  const selectedSet = paper === "csat"
    ? csatSets.find((set) => set.id === csatSetId) || csatSets[0] || null
    : ds.getQuestionSetById(String(year));
  return (
    <section className="panel build-test">
      <header className="panel-head">
        <h3>Build a test</h3>
        <p>Full papers, year-wise, or mix your own set.</p>
      </header>
      <div className="panel-body build-body">
        <div className="seg-field">
          <label>Paper</label>
          <div className="segmented">
            {[["gs", "GS Paper I"], ["csat", "CSAT Paper II"]].map(([k, v]) => (
              <button key={k} className={paper === k ? "on" : ""} onClick={() => setPaper(k)}>{v}</button>
            ))}
          </div>
        </div>
        <div className="seg-field">
          <label>{paper === "csat" ? "CSAT set" : "Year"}</label>
          <div className="year-chips">
            {paper === "gs" ? (
              <>
                {ds.years.map((y) => (
                  <button key={y} className={`year-chip${year === y ? " on" : ""}`} onClick={() => setYear(y)}>{y}</button>
                ))}
                <button className="year-chip mix"><Icon name="layers" size={13} /> Mix</button>
              </>
            ) : (
              csatSets.length ? csatSets.map((set) => (
                <button key={set.id} className={`year-chip${selectedSet?.id === set.id ? " on" : ""}`} onClick={() => setCsatSetId(set.id)}>{set.shortLabel}</button>
              )) : <span className="year-empty">No CSAT practice sets loaded yet.</span>
            )}
          </div>
        </div>
        <div className="build-foot">
          <label className="switch">
            <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} />
            <span className="track"><span className="thumb" /></span>
            <span className="switch-label"><Icon name="clock" size={15} /> {timed ? `${selectedSet?.durationMinutes || 120} min timed` : "Untimed"}</span>
          </label>
          <button className="btn btn-green" onClick={() => selectedSet && go("test", { setId: selectedSet.id, timed })} disabled={!selectedSet}>
            <Icon name="play" size={16} /> Begin test
          </button>
        </div>
      </div>
    </section>
  );
}

function Snapshot({ go, summary }) {
  return (
    <section className="panel snapshot">
      <header className="panel-head row">
        <div><h3>Your snapshot</h3><p>{summary.attempts ? "Local progress" : "Fresh start"}</p></div>
        <button className="link-btn" onClick={() => go("dashboard")}>Full progress <Icon name="arrowR" size={14} /></button>
      </header>
      <div className="panel-body snap-body">
        <div className="snap-ring">
          <Ring value={summary.averageAccuracy / 100} size={104} stroke={9} color="var(--green)">
            <div className="ring-num">{summary.averageAccuracy}<span>%</span></div>
            <div className="ring-cap">accuracy</div>
          </Ring>
        </div>
        <div className="snap-stats">
          <Stat value={summary.questionsSolved.toLocaleString("en-IN")} label="Questions solved" />
          <Stat value={summary.streak} label="Day streak" tone="saffron" />
          <Stat value={summary.bestScore || 0} label="Best score" sub="net" />
        </div>
      </div>
      <div className="continue-row" onClick={() => go("test", { setId: "2025" })}>
        <span className="cont-icon"><Icon name="play" size={15} /></span>
        <div className="cont-text">
          <strong>{summary.attempts ? "Practise — UPSC GS 2025" : "Start — UPSC GS 2025"}</strong>
          <span>100 questions · 2 hrs · Previous year paper</span>
        </div>
        <Icon name="chevR" size={18} />
      </div>
    </section>
  );
}

function BankBrowse({ go }) {
  const ds = window.UPSC;
  const [activeBank, setActiveBank] = useStateHome(null);
  const sourceSets = (sourceType) => ds.getQuestionSetsBySource(sourceType);
  const sourceQuestionCount = (sourceType) => sourceSets(sourceType).reduce((sum, set) => sum + Number(set.questionCount || 0), 0);
  const setCountLabel = (sourceType, singular, plural) => {
    const count = sourceSets(sourceType).length;
    return `${count} ${count === 1 ? singular : plural}`;
  };
  const banks = [
    { id: "pyq", icon: "calendar", title: "Previous-Year Papers", desc: "2019-2026 · GS Paper I", count: setCountLabel("pyq", "paper", "papers"), tone: "green", sourceType: "pyq" },
    { id: "ai", icon: "spark", title: "AI Question Bank", desc: "Topic-wise generated sets", count: `${sourceQuestionCount("ai").toLocaleString("en-IN")} Qs`, tone: "saffron", sourceType: "ai" },
    { id: "csr", icon: "book", title: "CSR Mock Series", desc: "Curated standard mocks", count: `${sourceQuestionCount("csr").toLocaleString("en-IN")} Qs`, tone: "indigo", sourceType: "csr" },
    { id: "csat", icon: "target", title: "CSAT Practice", desc: "Paper II mocks and drills", count: setCountLabel("csat", "set", "sets"), tone: "blue", sourceType: "csat" },
    { id: "daily", icon: "flame", title: "Daily Quizzes", desc: "Current-affairs, every day", count: ds.dailyQuiz?.isToday ? "New today" : setCountLabel("daily", "set", "sets"), tone: "rose", sourceType: "daily" },
    { id: "pib", icon: "fileText", title: "PIB Questions", desc: "PIB-based daily practice", count: setCountLabel("pib", "set", "sets"), tone: "green", sourceType: "pib" },
  ];
  const active = banks.find((bank) => bank.id === activeBank) || null;
  return (
    <section className="bank">
      <div className="bank-head">
        <h3>Explore the question bank</h3>
        <button className="link-btn" onClick={() => setActiveBank(activeBank ? null : "pyq")}>
          {activeBank ? "Close" : "Browse all"} <Icon name={activeBank ? "x" : "arrowR"} size={14} />
        </button>
      </div>
      <div className="bank-grid">
        {banks.map((s) => (
          <button key={s.title} className={`bank-card tone-${s.tone}${activeBank === s.id ? " selected" : ""}`} onClick={() => setActiveBank(s.id)}>
            <span className="bank-icon"><Icon name={s.icon} size={20} /></span>
            <span className="bank-count">{s.count}</span>
            <strong>{s.title}</strong>
            <span className="bank-desc">{s.desc}</span>
          </button>
        ))}
      </div>
      {active && (
        <QuestionSetPicker
          bank={active}
          sets={ds.getQuestionSetsBySource(active.sourceType)}
          go={go}
          onClose={() => setActiveBank(null)}
        />
      )}
    </section>
  );
}

function QuestionSetPicker({ bank, sets, go, onClose }) {
  return (
    <div className="set-picker">
      <div className="set-picker-head">
        <div>
          <h4>{bank.title}</h4>
          <p>{sets.length ? `${sets.length} option${sets.length === 1 ? "" : "s"} available` : "No sets are loaded yet."}</p>
        </div>
        <button className="icon-btn ghost" onClick={onClose} aria-label="Close"><Icon name="x" size={17} /></button>
      </div>
      <div className="set-grid">
        {sets.map((set) => (
          <button key={set.id} className="set-option" onClick={() => go("test", { setId: set.id })}>
            <span className="set-option-kicker">{set.year || (set.isoDate ? formatIsoDate(set.isoDate, { day: "2-digit", month: "short" }) : set.shortLabel)}</span>
            <strong>{set.label}</strong>
            <span>{set.questionCount} questions · {set.durationMinutes} min</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function NotesLibrary() {
  const ds = window.UPSC;
  const baseTabs = [
    ["daily", "Daily CA"],
    ["pib", "Daily PIB"],
    ["rc", "Daily RC"],
    ["sunday", "Sunday Sweep"],
    ["weekly-csat", "CSAT"],
    ["physics", "Physics"],
    ["editorials", "Editorials"],
    ["weekly", "Weekly"],
    ["monthly", "Monthly"],
    ["strategy", "Strategy"],
  ];
  const availableCadences = new Set(ds.noteDocuments.map((doc) => doc.cadence));
  const tabs = baseTabs.filter(([key]) => availableCadences.has(key));
  const [cadence, setCadence] = useStateHome("daily");
  const activeCadence = tabs.some(([key]) => key === cadence) ? cadence : tabs[0]?.[0] || cadence;
  const docs = ds.noteDocuments.filter((doc) => doc.cadence === activeCadence);
  const docIds = docs.map((doc) => doc.id).join("|");
  const [selectedId, setSelectedId] = useStateHome(docs[0]?.id || null);
  const [noteState, setNoteState] = useStateHome({ loading: false, error: "", note: null, content: "" });

  useEffectHome(() => {
    setSelectedId(docs[0]?.id || null);
  }, [activeCadence, docIds]);

  useEffectHome(() => {
    if (!selectedId) {
      setNoteState({ loading: false, error: "", note: null, content: "" });
      return undefined;
    }
    let cancelled = false;
    setNoteState((current) => ({ ...current, loading: true, error: "" }));
    ds.loadNoteDocument(selectedId)
      .then((result) => {
        if (!cancelled) setNoteState({ loading: false, error: "", ...result });
      })
      .catch((error) => {
        if (!cancelled) setNoteState({ loading: false, error: error?.message || "Could not load note.", note: null, content: "" });
      });
    return () => { cancelled = true; };
  }, [selectedId]);

  return (
    <section className="notes-library">
      <div className="notes-head">
        <div>
          <span className="eyebrow small"><span className="eyebrow-line" /> Notes</span>
          <h3>Briefs, drills and strategy</h3>
        </div>
        <div className="notes-tabs">
          {tabs.map(([key, label]) => (
            <button key={key} className={activeCadence === key ? "on" : ""} onClick={() => setCadence(key)}>{label}</button>
          ))}
        </div>
      </div>
      <div className="notes-layout">
        <aside className="notes-list">
          {docs.length ? docs.map((doc) => (
            <button key={doc.id} className={selectedId === doc.id ? "on" : ""} onClick={() => setSelectedId(doc.id)}>
              <strong>{doc.title}</strong>
              <span>{doc.shortTitle}</span>
            </button>
          )) : <p>No {activeCadence} notes yet.</p>}
        </aside>
        <article className="note-reader">
          {noteState.loading && <p className="muted">Loading note...</p>}
          {noteState.error && <p className="muted">{noteState.error}</p>}
          {!noteState.loading && !noteState.error && noteState.content && <MarkdownView text={noteState.content} />}
          {!noteState.loading && !noteState.error && !noteState.content && <p className="muted">Select a note.</p>}
        </article>
      </div>
    </section>
  );
}

function MarkdownView({ text }) {
  const lines = String(text || "").split(/\r?\n/);
  const blocks = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    if (/^\s*\$\$/.test(line)) {
      const formula = [];
      const first = line.trim();
      if (first.length > 4 && first.endsWith("$$")) {
        formula.push(first.slice(2, -2).trim());
        i++;
      } else {
        const opening = first.slice(2).trim();
        if (opening) formula.push(opening);
        i++;
        while (i < lines.length) {
          const current = lines[i];
          const trimmed = current.trim();
          if (trimmed.endsWith("$$")) {
            const closing = trimmed.slice(0, -2).trim();
            if (closing) formula.push(closing);
            i++;
            break;
          }
          formula.push(current);
          i++;
        }
      }
      blocks.push({ type: "math", text: formula.join("\n") });
      continue;
    }
    if (/^\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        if (!/^\|\s*:?-{3,}/.test(lines[i])) rows.push(lines[i].split("|").slice(1, -1).map((cell) => cell.trim()));
        i++;
      }
      blocks.push({ type: "table", rows });
      continue;
    }
    if (/^#{1,4}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      blocks.push({ type: "heading", level, text: line.replace(/^#{1,4}\s*/, "") });
      i++;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const quote = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push({ type: "quote", text: quote.join(" ") });
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: "rule" });
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }
    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !/^\s*\$\$/.test(lines[i]) && !/^#{1,4}\s/.test(lines[i]) && !/^[-*]\s+/.test(lines[i]) && !/^\d+\.\s+/.test(lines[i]) && !/^>\s?/.test(lines[i]) && !/^---+$/.test(lines[i].trim()) && !/^\|/.test(lines[i])) {
      paragraph.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return (
    <div className="markdown-view">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const TagName = block.level <= 1 ? "h2" : block.level === 2 ? "h3" : "h4";
          return <TagName key={index}>{renderInline(block.text)}</TagName>;
        }
        if (block.type === "quote") return <blockquote key={index}>{renderInline(block.text)}</blockquote>;
        if (block.type === "list") return <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ul>;
        if (block.type === "ordered-list") return <ol key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ol>;
        if (block.type === "math") return <MathText key={index} value={block.text} display />;
        if (block.type === "rule") return <hr key={index} />;
        if (block.type === "table") {
          const [head, ...body] = block.rows;
          return (
            <div className="md-table-wrap" key={index}>
              <table>
                {head && <thead><tr>{head.map((cell, cellIndex) => <th key={cellIndex}>{renderInline(cell)}</th>)}</tr></thead>}
                <tbody>{body.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{renderInline(cell)}</td>)}</tr>)}</tbody>
              </table>
            </div>
          );
        }
        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </div>
  );
}

function renderInline(text) {
  const source = String(text || "");
  const parts = [];
  let i = 0;

  function pushText(value) {
    if (value) parts.push({ type: "text", value });
  }

  while (i < source.length) {
    if (source.startsWith("`", i)) {
      const end = source.indexOf("`", i + 1);
      if (end > i) {
        parts.push({ type: "code", value: source.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    if (source.startsWith("**", i)) {
      const end = source.indexOf("**", i + 2);
      if (end > i) {
        parts.push({ type: "strong", value: source.slice(i + 2, end) });
        i = end + 2;
        continue;
      }
    }
    if (source[i] === "$") {
      const end = findClosingDollar(source, i + 1);
      if (end > i) {
        parts.push({ type: "math", value: source.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }
    if (source[i] === "*") {
      const end = source.indexOf("*", i + 1);
      if (end > i) {
        parts.push({ type: "em", value: source.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    }

    const next = nextInlineMarker(source, i + 1);
    pushText(source.slice(i, next));
    i = next;
  }

  return parts.map((part, index) => {
    if (part.type === "strong") return <strong key={index}>{renderInline(part.value)}</strong>;
    if (part.type === "code") return <code key={index}>{part.value}</code>;
    if (part.type === "math") return <MathText key={index} value={part.value} />;
    if (part.type === "em") return <em key={index}>{renderInline(part.value)}</em>;
    return <React.Fragment key={index}>{part.value}</React.Fragment>;
  });
}

function nextInlineMarker(source, fromIndex) {
  const markers = ["`", "$", "**", "*"]
    .map((marker) => source.indexOf(marker, fromIndex))
    .filter((index) => index >= 0);
  return markers.length ? Math.min(...markers) : source.length;
}

function findClosingDollar(source, fromIndex) {
  for (let i = fromIndex; i < source.length; i++) {
    if (source[i] === "$" && source[i - 1] !== "\\") return i;
  }
  return -1;
}

function MathText({ value, display = false }) {
  const formula = String(value || "").trim();
  const html = renderMathHtml(formula, display);
  const TagName = display ? "div" : "span";
  if (!html) {
    return <TagName className={display ? "math-block math-fallback" : "math-inline math-fallback"}>{display ? `$$${formula}$$` : `$${formula}$`}</TagName>;
  }
  return <TagName className={display ? "math-block" : "math-inline"} dangerouslySetInnerHTML={{ __html: html }} />;
}

function renderMathHtml(formula, display) {
  if (!formula || !window.katex?.renderToString) return "";
  try {
    return window.katex.renderToString(formula, {
      displayMode: display,
      throwOnError: false,
      strict: false,
      trust: false,
    });
  } catch (error) {
    return "";
  }
}

function Home({ go, progress, summary }) {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-inner">
            <span className="eyebrow"><span className="eyebrow-line" /> Free · No login · Open practice bank</span>
            <h1 className="hero-title">
              Every UPSC question,<br /><em>one calm place to practise.</em>
            </h1>
            <p className="hero-sub">
              A decade of previous-year papers, AI-generated sets and a fresh daily quiz —
              with score tracking that quietly shows you what to revise next.
            </p>
            <ExamSwitcher />
          </div>
          <HeroCalendar go={go} progress={progress} />
        </div>
      </section>

      <div className="home-main">
        <div className="home-col-l">
          <DailyQuizCard go={go} progress={progress} />
          <BuildTest go={go} />
        </div>
        <div className="home-col-r">
          <Snapshot go={go} summary={summary} />
        </div>
      </div>

      <BankBrowse go={go} />
      <NotesLibrary />
    </div>
  );
}

Object.assign(window, { Home });
