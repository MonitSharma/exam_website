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
  if (!year || !month || !day) return "";
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

function calendarMonthKey(isoDate) {
  return String(isoDate || "").slice(0, 7);
}

function calendarMonthIndex(year, month) {
  return (Number(year) * 12) + Number(month);
}

function calendarCompareMonth(a, b) {
  const [ay, am] = String(a || "").split("-").map(Number);
  const [by, bm] = String(b || "").split("-").map(Number);
  return calendarMonthIndex(ay || 0, am || 0) - calendarMonthIndex(by || 0, bm || 0);
}

function calendarShiftMonth(monthKey, delta) {
  const [year, month] = String(monthKey || "").split("-").map(Number);
  const date = new Date(Date.UTC(year || 1970, (month || 1) - 1 + delta, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function calendarIsoFromMonthDay(monthKey, day) {
  return `${monthKey}-${String(day).padStart(2, "0")}`;
}

function questionSetCalendarLabel(set) {
  const category = String(set.category || "");
  if (set.sourceType === "daily") return "Daily quiz";
  if (set.sourceType === "pib") return "PIB quiz";
  if (set.sourceType === "rc") return "RC drill";
  if (set.sourceType === "weekly-quiz") return "Weekly quiz";
  if (set.sourceType === "weekly-news") return "Places quiz";
  if (set.sourceType === "sectional") return "Sectional test";
  if (set.sourceType === "csat") return category.includes("Full") ? "CSAT mock" : "CSAT practice";
  if (category.includes("Full Mock")) return "GS full mock";
  if (category.includes("Monthly")) return "Monthly mock";
  return "Practice set";
}

function noteCalendarLabel(doc) {
  const labels = {
    daily: "CA briefing",
    pib: "PIB note",
    mains: "Mains practice",
    editorials: "Editorials",
    monthly: "Monthly note",
    rc: "RC note",
    sunday: "Sunday plan",
    anki: "Flashcards",
    physics: "Physics note",
    "weekly-csat": "CSAT note",
    "weekly-news": "Places note",
    schemes: "Schemes note",
    sectional: "Sectional note",
    fodder: "Fodder bank",
    ethics: "Ethics case",
    strategy: "Strategy note",
  };
  return labels[doc.cadence] || "Note";
}

function latestDatedItem(items, dateKey, todayIso) {
  return [...items]
    .filter((item) => item && item[dateKey] && item[dateKey] <= todayIso)
    .sort((a, b) => String(b[dateKey]).localeCompare(String(a[dateKey])))[0] || null;
}

function HeroStudyDesk({ go, progress }) {
  const ds = window.UPSC;
  const daily = ds.dailyQuiz;
  const dailySet = daily?.questionSetId ? ds.getQuestionSetById(daily.questionSetId) : null;
  const pibSet = latestDatedItem(ds.getQuestionSetsBySource("pib"), "isoDate", ds.todayIso);
  const rcSet = daily?.isoDate ? latestDatedItem(ds.getQuestionSetsBySource("rc"), "isoDate", ds.todayIso) : null;
  const latestBrief = latestDatedItem(ds.noteDocuments.filter((doc) => doc.cadence === "daily"), "date", ds.todayIso);
  const dailyDone = Boolean(progress.dailyCompletions?.[daily?.isoDate]);
  const items = [
    dailySet && {
      key: "daily",
      label: dailyDone ? "Daily done" : "Daily pending",
      title: dailySet.shortLabel || "Daily quiz",
      meta: `${dailySet.questionCount || 0}Q · ${dailySet.durationMinutes || 10}m`,
      icon: "bolt",
      tone: dailyDone ? "done" : "active",
      action: () => go("test", { setId: dailySet.id }),
    },
    latestBrief && {
      key: "brief",
      label: "Latest briefing",
      title: latestBrief.shortTitle || formatIsoDate(latestBrief.date),
      meta: "Current affairs",
      icon: "book",
      tone: "note",
      action: () => window.dispatchEvent(new CustomEvent("pariksha:open-note", { detail: { id: latestBrief.id } })),
    },
    pibSet && {
      key: "pib",
      label: "PIB check",
      title: pibSet.shortLabel || "PIB quiz",
      meta: `${pibSet.questionCount || 0}Q · ${pibSet.durationMinutes || 10}m`,
      icon: "play",
      tone: "active",
      action: () => go("test", { setId: pibSet.id }),
    },
    rcSet && {
      key: "rc",
      label: "CSAT RC",
      title: rcSet.shortLabel || "RC drill",
      meta: `${rcSet.questionCount || 0}Q · ${rcSet.durationMinutes || 8}m`,
      icon: "target",
      tone: "note",
      action: () => go("test", { setId: rcSet.id }),
    },
  ].filter(Boolean);

  if (!items.length) return null;

  return (
    <div className="hero-desk">
      <div className="hero-desk-head">
        <span>Today’s desk</span>
        <strong>{formatIsoDate(ds.todayIso, { day: "2-digit", month: "short" })}</strong>
      </div>
      <div className="hero-desk-grid">
        {items.map((item) => (
          <button key={item.key} className={`hero-desk-item ${item.tone}`} onClick={item.action}>
            <span className="hero-desk-icon"><Icon name={item.icon} size={15} /></span>
            <span className="hero-desk-copy">
              <em>{item.label}</em>
              <strong>{item.title}</strong>
              <small>{item.meta}</small>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function HeroCalendar({ go, progress }) {
  const ds = window.UPSC;
  const today = ds.todayIso;
  const done = progress.dailyCompletions || {};
  const materialsByDate = React.useMemo(() => {
    const map = new Map();
    function add(isoDate, item) {
      if (!isoDate) return;
      if (!map.has(isoDate)) map.set(isoDate, []);
      map.get(isoDate).push(item);
    }
    ds.questionSets.forEach((set) => {
      if (!set.isoDate) return;
      add(set.isoDate, {
        type: "test",
        id: set.id,
        title: set.label,
        label: questionSetCalendarLabel(set),
        meta: `${set.questionCount || 0}Q · ${set.durationMinutes || 0}m`,
        sourceType: set.sourceType,
      });
    });
    ds.noteDocuments.forEach((doc) => {
      if (!doc.date) return;
      add(doc.date, {
        type: "note",
        id: doc.id,
        title: doc.title,
        label: noteCalendarLabel(doc),
        meta: doc.shortTitle && doc.shortTitle !== formatIsoDate(doc.date) ? doc.shortTitle : "Read note",
        cadence: doc.cadence,
      });
    });
    for (const [isoDate, items] of map.entries()) {
      map.set(isoDate, items.sort((a, b) => {
        if (a.type !== b.type) return a.type === "test" ? -1 : 1;
        return String(a.label).localeCompare(String(b.label));
      }));
    }
    return map;
  }, [ds.questionSets, ds.noteDocuments]);
  const materialDates = React.useMemo(() => [...materialsByDate.keys()].sort(), [materialsByDate]);
  const latestLoadedDate = [...materialDates].reverse().find((iso) => iso <= today) || materialDates[materialDates.length - 1] || today;
  const initialMonth = calendarMonthKey(latestLoadedDate);
  const [viewMonth, setViewMonth] = useStateHome(initialMonth);
  const [selectedDate, setSelectedDate] = useStateHome(latestLoadedDate);
  const latestLoadedRef = React.useRef(latestLoadedDate);
  const [year, month] = viewMonth.split("-").map(Number);
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const blanks = Array.from({ length: first.getUTCDay() });
  const monthLabel = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(first);
  const selectedMaterials = materialsByDate.get(selectedDate) || [];
  const selectedDaily = selectedMaterials.find((item) => item.type === "test" && item.sourceType === "daily");
  const selectedStatus = selectedMaterials.length
    ? `${formatIsoDate(selectedDate)} · ${selectedMaterials.length} ${selectedMaterials.length === 1 ? "material" : "materials"}`
    : `${formatIsoDate(selectedDate)} · no materials loaded`;
  const minMonth = calendarMonthKey(materialDates[0] || today);
  const maxMonth = calendarMonthKey(materialDates[materialDates.length - 1] || today);
  const canGoPrev = calendarCompareMonth(viewMonth, minMonth) > 0;
  const canGoNext = calendarCompareMonth(viewMonth, maxMonth) < 0;

  function materialDatesForMonth(monthKey) {
    return materialDates.filter((iso) => calendarMonthKey(iso) === monthKey);
  }

  function moveMonth(delta) {
    const nextMonth = calendarShiftMonth(viewMonth, delta);
    const monthDates = materialDatesForMonth(nextMonth);
    setViewMonth(nextMonth);
    setSelectedDate(monthDates[delta < 0 ? monthDates.length - 1 : 0] || `${nextMonth}-01`);
  }

  function openMaterial(item) {
    if (item.type === "test") {
      go("test", { setId: item.id });
      return;
    }
    window.dispatchEvent(new CustomEvent("pariksha:open-note", { detail: { id: item.id } }));
  }

  function jumpToLatest() {
    setViewMonth(calendarMonthKey(latestLoadedDate));
    setSelectedDate(latestLoadedDate);
  }

  useEffectHome(() => {
    if (latestLoadedRef.current !== latestLoadedDate) {
      if (selectedDate === latestLoadedRef.current) {
        setViewMonth(calendarMonthKey(latestLoadedDate));
        setSelectedDate(latestLoadedDate);
      }
      latestLoadedRef.current = latestLoadedDate;
    }
  }, [latestLoadedDate, selectedDate]);

  return (
    <aside className="hero-calendar">
      <div className="hero-calendar-head">
        <span className="eyebrow small"><span className="eyebrow-line" /> Daily tracker</span>
        <div className="calendar-title-row">
          <button className="calendar-nav" onClick={() => moveMonth(-1)} disabled={!canGoPrev} aria-label="Previous month">
            <Icon name="arrowL" size={15} />
          </button>
          <h2>{monthLabel}</h2>
          <button className="calendar-nav" onClick={() => moveMonth(1)} disabled={!canGoNext} aria-label="Next month">
            <Icon name="arrowR" size={15} />
          </button>
        </div>
      </div>
      <div className="calendar-card">
        <div className="calendar-weekdays">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
        </div>
        <div className="calendar-grid">
          {blanks.map((_, index) => <span key={`blank-${index}`} className="cal-day blank" />)}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const iso = calendarIsoFromMonthDay(viewMonth, day);
            const materialCount = (materialsByDate.get(iso) || []).length;
            const complete = Boolean(done[iso]);
            return (
              <button
                key={iso}
                className={`cal-day${iso === today ? " today" : ""}${iso === selectedDate ? " selected" : ""}${materialCount ? " available" : ""}${complete ? " done" : ""}`}
                onClick={() => setSelectedDate(iso)}
                title={materialCount ? `${materialCount} materials` : "No materials"}>
                <span>{day}</span>
                {materialCount > 0 && <i className="cal-count">{materialCount}</i>}
                {complete && <Icon name="check" size={12} />}
              </button>
            );
          })}
        </div>
        <div className="calendar-selected">
          <div className="calendar-selected-head">
            <strong>{selectedStatus}</strong>
            <button className="calendar-today" onClick={jumpToLatest}>Latest</button>
          </div>
          <div className="calendar-materials">
            {selectedMaterials.length ? selectedMaterials.map((item) => (
              <button key={`${item.type}-${item.id}`} className={`calendar-material ${item.type}`} onClick={() => openMaterial(item)}>
                <span className="calendar-material-copy">
                  <strong>{item.title}</strong>
                  <span className="calendar-material-meta">
                    <em>{item.label}</em>
                    <small>{item.meta}</small>
                  </span>
                </span>
                <Icon name={item.type === "test" ? "play" : "book"} size={15} />
              </button>
            )) : <p>No notes or practice sets for this date.</p>}
          </div>
        </div>
      </div>
      <p className="hero-calendar-foot">{selectedDaily ? done[selectedDate] ? "Daily quiz complete for this date." : "Daily quiz pending for this date." : "Use the arrows to review earlier months."}</p>
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

function DailyRcCard({ go }) {
  const ds = window.UPSC;
  const dailyRc = ds.dailyRc;
  const rcSet = dailyRc?.questionSetId ? ds.getQuestionSetById(dailyRc.questionSetId) : null;
  return (
    <article className="daily-card daily-card-rc">
      <div className="daily-glow" aria-hidden="true" />
      <div className="daily-top">
        <span className="ai-badge"><Icon name="book" size={14} /> CSAT · RC</span>
        <span className="daily-date">{dailyRc?.dateLabel}</span>
      </div>
      <h2 className="daily-title">{dailyRc?.title || "Daily RC coming soon"}</h2>
      <p className="daily-desc">{dailyRc?.description || "Timed reading-comprehension practice will appear here when added."}</p>
      <div className="daily-meta">
        <span><strong>{rcSet?.questionCount || 0}</strong> questions</span>
        <span className="dot-sep" />
        <span><strong>~{dailyRc?.durationMinutes || rcSet?.durationMinutes || 0}</strong> min</span>
        <span className="dot-sep" />
        <span className="daily-subjects">Timed · Reading Comprehension</span>
      </div>
      <div className="daily-actions">
        <button className="btn btn-saffron" onClick={() => rcSet && go("test", { setId: rcSet.id })} disabled={!rcSet}>
          Start Daily RC <Icon name="arrowR" size={18} />
        </button>
      </div>
    </article>
  );
}

function parseWeekPlan(text) {
  const lines = String(text || "").split(/\r?\n/);
  let headerIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i].trim();
    if (/^\|/.test(l) && /\bday\b/i.test(l) && /block/i.test(l)) { headerIdx = i; break; }
  }
  if (headerIdx === -1) return null;
  const tableLines = [];
  for (let i = headerIdx; i < lines.length && /^\s*\|/.test(lines[i]); i++) tableLines.push(lines[i]);
  if (tableLines.length < 3) return null;
  const toCells = (line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
  const headers = toCells(tableLines[0]).map((h) => h.replace(/\*\*/g, "").replace(/\s*\([^)]*\)/g, "").trim());
  const rows = tableLines.slice(1).filter((l) => !/^\s*\|?\s*:?-{2,}/.test(l)).map(toCells);
  const days = rows.map((cells) => {
    const dayRaw = (cells[0] || "").replace(/\*\*/g, "").trim();
    const weekday = (dayRaw.match(/\b(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\b/i) || [])[1] || "";
    const num = (dayRaw.match(/\b(\d{1,2})\b/) || [])[1];
    return { label: dayRaw, weekday, dayNum: num ? Number(num) : null, cells: cells.slice(1) };
  }).filter((d) => d.weekday || d.dayNum);
  return { headers: headers.slice(1), days };
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isoDateToUtc(isoDate) {
  const [year, month, day] = String(isoDate || "").split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(Date.UTC(year, month - 1, day));
}

function getSundayWeekStartIso(isoDate) {
  const date = isoDateToUtc(isoDate);
  if (!date) return "undated";
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return date.toISOString().slice(0, 10);
}

function isIsoWithinWeek(isoDate, weekStartIso) {
  const date = isoDateToUtc(isoDate);
  const start = isoDateToUtc(weekStartIso);
  if (!date || !start) return false;
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);
  return date >= start && date < end;
}

function WeeklyPlanCard() {
  const ds = window.UPSC;
  const sweeps = React.useMemo(() => {
    const list = ds.noteDocuments.filter((doc) => doc.cadence === "sunday");
    list.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    return list;
  }, [ds.noteDocuments]);
  const [sweepId, setSweepId] = useStateHome(sweeps[0]?.id || "");
  const sweep = sweeps.find((doc) => doc.id === sweepId) || sweeps[0] || null;
  const [state, setState] = useStateHome({ loading: Boolean(sweep), error: "", plan: null });
  const [selected, setSelected] = useStateHome(null);

  useEffectHome(() => {
    if (!sweep) { setState({ loading: false, error: "", plan: null }); return undefined; }
    let cancelled = false;
    setState({ loading: true, error: "", plan: null });
    ds.loadNoteDocument(sweep.id)
      .then(({ content }) => {
        if (cancelled) return;
        const plan = parseWeekPlan(content);
        setState({ loading: false, error: plan ? "" : "no-plan", plan });
        if (plan && plan.days.length) {
          const isCurrentWeek = sweep.date && isIsoWithinWeek(ds.todayIso, getSundayWeekStartIso(sweep.date));
          const todayDate = isoDateToUtc(ds.todayIso) || new Date();
          const wd = WEEKDAYS[todayDate.getUTCDay()];
          let idx = isCurrentWeek ? plan.days.findIndex((d) => d.dayNum === todayDate.getUTCDate()) : -1;
          if (idx < 0 && isCurrentWeek) idx = plan.days.findIndex((d) => d.weekday.toLowerCase() === wd.toLowerCase());
          setSelected(idx < 0 ? 0 : idx);
        }
      })
      .catch((error) => { if (!cancelled) setState({ loading: false, error: error?.message || "Could not load plan.", plan: null }); });
    return () => { cancelled = true; };
  }, [sweep && sweep.id]);

  if (!sweep) return null;

  const plan = state.plan;
  const todayDate = isoDateToUtc(ds.todayIso) || new Date();
  const todayNum = todayDate.getUTCDate();
  const isCurrentWeek = sweep.date && isIsoWithinWeek(ds.todayIso, getSundayWeekStartIso(sweep.date));
  const activeIdx = selected == null ? 0 : selected;
  const day = plan && plan.days ? plan.days[activeIdx] : null;
  const isToday = isCurrentWeek && day && day.dayNum === todayNum;
  const weekLabel = sweep.shortTitle || formatIsoDate(sweep.date);

  function openFullPlan() {
    window.dispatchEvent(new CustomEvent("pariksha:open-note", { detail: { cadence: "sunday", id: sweep.id } }));
  }

  return (
    <article className="weekplan-card">
      <div className="weekplan-head">
        <div className="weekplan-head-text">
          <span className="eyebrow small"><span className="eyebrow-line" /> This week's plan</span>
          <h2 className="weekplan-title">What to study today</h2>
          <p className="weekplan-sub">{weekLabel} · from your Sunday Sweep</p>
        </div>
        <div className="weekplan-actions">
          {sweeps.length > 1 && (
            <label className="weekplan-picker">
              <span>Week</span>
              <select value={sweep.id} onChange={(event) => setSweepId(event.target.value)} aria-label="Week plan">
                {sweeps.map((doc) => (
                  <option key={doc.id} value={doc.id}>{doc.shortTitle || formatIsoDate(doc.date)}</option>
                ))}
              </select>
            </label>
          )}
          <button className="weekplan-open" onClick={openFullPlan}>Full plan <Icon name="arrowR" size={14} /></button>
        </div>
      </div>

      {state.loading && <p className="muted weekplan-msg">Loading this week's plan…</p>}
      {!state.loading && (state.error || !plan) && (
        <p className="muted weekplan-msg">Couldn't read this week's plan — <button className="linklike" onClick={openFullPlan}>open the Sunday Sweep</button>.</p>
      )}

      {!state.loading && plan && (
        <>
          <div className="weekplan-days" role="tablist" aria-label="Days this week">
            {plan.days.map((d, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeIdx}
                className={`weekplan-day${i === activeIdx ? " on" : ""}${isCurrentWeek && d.dayNum === todayNum ? " is-today" : ""}`}
                onClick={() => setSelected(i)}>
                <span className="wd">{d.weekday}</span>
                <span className="dn">{d.dayNum}</span>
              </button>
            ))}
          </div>

          {day && (
            <div className="weekplan-detail">
              <div className="weekplan-detail-head">
                <strong>{day.weekday} {day.dayNum}</strong>
                {isToday && <span className="weekplan-today-chip">Today</span>}
              </div>
              <ul className="weekplan-tasks">
                {day.cells.map((cell, ci) => {
                  const clean = String(cell || "").trim();
                  if (!clean || clean === "—" || clean === "-") return null;
                  return (
                    <li key={ci}>
                      <span className="weekplan-task-label">{plan.headers[ci] || `Task ${ci + 1}`}</span>
                      <span className="weekplan-task-text">{renderInline(clean)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}
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
    { id: "rc", icon: "book", title: "Daily RC", desc: "Timed CSAT passages", count: ds.dailyRc?.isToday ? "New today" : setCountLabel("rc", "set", "sets"), tone: "blue", sourceType: "rc" },
    { id: "weekly-news", icon: "map", title: "Weekly News", desc: "Places in news map drills", count: setCountLabel("weekly-news", "set", "sets"), tone: "teal", sourceType: "weekly-news" },
    { id: "weekly-quiz", icon: "layers", title: "Weekly Quiz", desc: "CA + static recall", count: setCountLabel("weekly-quiz", "set", "sets"), tone: "indigo", sourceType: "weekly-quiz" },
    { id: "pib", icon: "fileText", title: "PIB Questions", desc: "PIB-based daily practice", count: setCountLabel("pib", "set", "sets"), tone: "green", sourceType: "pib" },
    { id: "sectional", icon: "target", title: "Sectional Tests", desc: "Subject-wise prelims practice", count: setCountLabel("sectional", "set", "sets"), tone: "saffron", sourceType: "sectional" },
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

const CADENCE_META = {
  "daily": { label: "Daily CA", group: "Daily" },
  "pib": { label: "Daily PIB", group: "Daily" },
  "rc": { label: "Daily RC", group: "Daily" },
  "mains": { label: "Daily Mains", group: "Daily" },
  "editorials": { label: "Editorials", group: "Weekly" },
  "schemes": { label: "Schemes", group: "Weekly" },
  "sunday": { label: "Sunday Sweep", group: "Weekly" },
  "weekly-csat": { label: "CSAT", group: "Weekly" },
  "physics": { label: "Physics", group: "Weekly" },
  "weekly-news": { label: "Weekly News", group: "Weekly" },
  "weekly": { label: "Weekly", group: "Weekly" },
  "sectional": { label: "Sectional", group: "Weekly" },
  "ethics": { label: "Ethics", group: "Weekly" },
  "monthly": { label: "Monthly", group: "Monthly" },
  "anki": { label: "Anki", group: "Reference" },
  "fodder": { label: "Fodder", group: "Reference" },
  "strategy": { label: "Strategy", group: "Reference" },
};
const GROUP_ORDER = ["Daily", "Weekly", "Monthly", "Reference"];

function NotesLibrary() {
  const ds = window.UPSC;
  const order = Object.keys(CADENCE_META);
  const availableCadences = new Set(ds.noteDocuments.map((doc) => doc.cadence));
  const tabs = order.filter((key) => availableCadences.has(key));
  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    items: tabs.filter((key) => CADENCE_META[key].group === g),
  })).filter((cluster) => cluster.items.length);

  const [cadence, setCadence] = useStateHome(tabs[0] || "daily");
  const activeCadence = tabs.includes(cadence) ? cadence : tabs[0] || cadence;
  const meta = CADENCE_META[activeCadence] || { label: "Notes" };
  const docs = ds.noteDocuments.filter((doc) => doc.cadence === activeCadence);
  const docIds = docs.map((doc) => doc.id).join("|");
  const [selectedId, setSelectedId] = useStateHome(docs[0]?.id || null);
  const [monthFilter, setMonthFilter] = useStateHome("latest");
  const [weekFilter, setWeekFilter] = useStateHome("latest");
  const [noteState, setNoteState] = useStateHome({ loading: false, error: "", note: null, content: "" });
  const monthOptions = getNoteMonthOptions(docs);
  const weekOptions = getNoteWeekOptions(docs);
  const useWeekFilter = activeCadence !== "monthly" && weekOptions.length > 0;
  const currentWeekKey = getSundayWeekStartIso(ds.todayIso);
  const activeMonth = monthFilter === "all" || monthOptions.some((item) => item.key === monthFilter)
    ? monthFilter
    : monthOptions[0]?.key || "all";
  const activeWeek = weekFilter === "all" || weekOptions.some((item) => item.key === weekFilter)
    ? weekFilter
    : weekOptions.find((item) => item.key === currentWeekKey)?.key || weekOptions[0]?.key || "all";
  const visibleDocs = useWeekFilter
    ? activeWeek === "all" ? docs : docs.filter((doc) => noteWeekKey(doc) === activeWeek)
    : activeMonth === "all" ? docs : docs.filter((doc) => noteMonthKey(doc) === activeMonth);
  const loadedDoc = noteState.note && noteState.note.id === selectedId ? noteState.note : null;
  const selectedDoc = loadedDoc || docs.find((doc) => doc.id === selectedId) || null;
  const readingMinutes = estimateReadingMinutes(noteState.content);

  useEffectHome(() => {
    const currentDoc = docs.find((doc) => doc.id === selectedId);
    const defaultWeek = weekOptions.find((item) => item.key === currentWeekKey)?.key || weekOptions[0]?.key || "all";
    if (currentDoc) {
      setMonthFilter(noteMonthKey(currentDoc));
      setWeekFilter(noteWeekKey(currentDoc));
    } else {
      setMonthFilter(monthOptions[0]?.key || "all");
      setWeekFilter(defaultWeek);
      const nextDocs = useWeekFilter && defaultWeek !== "all" ? docs.filter((doc) => noteWeekKey(doc) === defaultWeek) : docs;
      setSelectedId(nextDocs[0]?.id || docs[0]?.id || null);
    }
  }, [activeCadence, docIds]);

  useEffectHome(() => {
    function onOpenNote(event) {
      const target = (event.detail && event.detail.cadence) || "";
      const targetId = (event.detail && event.detail.id) || "";
      const targetDoc = targetId ? ds.noteDocuments.find((doc) => doc.id === targetId) : null;
      const targetCadence = targetDoc ? targetDoc.cadence : target;
      if (targetCadence && tabs.includes(targetCadence)) setCadence(targetCadence);
      if (targetDoc) {
        setMonthFilter(noteMonthKey(targetDoc));
        setSelectedId(targetDoc.id);
      }
      const scrollToNotes = () => {
        const section = document.querySelector(".notes-library");
        if (section) window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
      };
      requestAnimationFrame(() => requestAnimationFrame(scrollToNotes));
    }
    window.addEventListener("pariksha:open-note", onOpenNote);
    return () => window.removeEventListener("pariksha:open-note", onOpenNote);
  }, [tabs.join("|")]);

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
    <section className="notes-library notes-v2">
      <div className="notes-head">
        <div className="notes-title">
          <span className="eyebrow small"><span className="eyebrow-line" /> Notes &amp; briefings</span>
          <h3>Briefs, drills &amp; strategy</h3>
          <p className="notes-sub">Daily current-affairs briefs, weekly drills and evergreen strategy - read them in one place, filtered by month.</p>
        </div>
        <div className="notes-cats" role="tablist" aria-label="Notes categories">
          {grouped.map((cluster) => (
            <div className="notes-cat-row" key={cluster.group}>
              <span className="notes-cat-glabel">{cluster.group}</span>
              <div className="notes-cat-pills">
                {cluster.items.map((key) => (
                  <button
                    key={key}
                    role="tab"
                    aria-selected={activeCadence === key}
                    className={activeCadence === key ? "on" : ""}
                    onClick={() => setCadence(key)}>
                    {CADENCE_META[key].label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="notes-layout">
        <aside className="notes-side">
          <div className="notes-list-tools">
            {useWeekFilter ? (
              <label>
                <span>Week</span>
                <select
                  value={activeWeek}
                  onChange={(event) => {
                    const nextWeek = event.target.value;
                    const nextDocs = nextWeek === "all" ? docs : docs.filter((doc) => noteWeekKey(doc) === nextWeek);
                    setWeekFilter(nextWeek);
                    setSelectedId(nextDocs[0]?.id || null);
                  }}
                  aria-label={`${meta.label} week`}>
                  {weekOptions.length ? weekOptions.map((item) => <option key={item.key} value={item.key}>{item.label}</option>) : <option value="all">No dates</option>}
                  {weekOptions.length > 1 && <option value="all">All weeks</option>}
                </select>
              </label>
            ) : (
              <label>
                <span>Month</span>
                <select
                  value={activeMonth}
                  onChange={(event) => {
                    const nextMonth = event.target.value;
                    const nextDocs = nextMonth === "all" ? docs : docs.filter((doc) => noteMonthKey(doc) === nextMonth);
                    setMonthFilter(nextMonth);
                    setSelectedId(nextDocs[0]?.id || null);
                  }}
                  aria-label="Note month">
                  {monthOptions.length ? monthOptions.map((item) => <option key={item.key} value={item.key}>{item.label}</option>) : <option value="all">No dates</option>}
                  {monthOptions.length > 1 && <option value="all">All dates</option>}
                </select>
              </label>
            )}
            <span className="notes-count">{visibleDocs.length} {visibleDocs.length === 1 ? "note" : "notes"}</span>
          </div>
          <div className="notes-list">
          {visibleDocs.length ? visibleDocs.map((doc) => {
            const kicker = doc.date ? formatIsoDate(doc.date, { day: "2-digit", month: "short" }) : "";
            const dateForms = doc.date ? [formatIsoDate(doc.date), formatIsoDate(doc.date, { day: "2-digit", month: "short" })] : [];
            const secondary = doc.shortTitle && !dateForms.includes(doc.shortTitle) ? doc.shortTitle : "";
            return (
              <button key={doc.id} className={selectedId === doc.id ? "on" : ""} onClick={() => setSelectedId(doc.id)}>
                {kicker && <span className="note-kicker">{kicker}</span>}
                <strong>{doc.title}</strong>
                {secondary && <span>{secondary}</span>}
              </button>
            );
          }) : <p>No {meta.label.toLowerCase()} notes yet.</p>}
          </div>
        </aside>

        <article className="note-reader">
          {selectedDoc && (
            <header className="note-reader-head">
              <div className="note-reader-meta-row">
                <span className="note-cat-chip">{meta.label}</span>
                {selectedDoc.date && <span className="note-meta-item"><Icon name="calendar" size={13} /> {formatIsoDate(selectedDoc.date)}</span>}
                {readingMinutes > 0 && <span className="note-meta-item"><Icon name="clock" size={13} /> {readingMinutes} min read</span>}
              </div>
              <h4>{selectedDoc.title}</h4>
              {selectedDoc.shortTitle && selectedDoc.shortTitle !== formatIsoDate(selectedDoc.date) && <p>{selectedDoc.shortTitle}</p>}
            </header>
          )}
          <div className="note-reader-body">
            {noteState.loading && <p className="muted">Loading note...</p>}
            {noteState.error && <p className="muted">{noteState.error}</p>}
            {!noteState.loading && !noteState.error && noteState.content && <MarkdownView text={noteState.content} />}
            {!noteState.loading && !noteState.error && !noteState.content && <p className="muted">Select a note.</p>}
          </div>
        </article>
      </div>
    </section>
  );
}

function noteMonthKey(doc) {
  return doc.date ? String(doc.date).slice(0, 7) : "undated";
}

function noteWeekKey(doc) {
  return doc.date ? getSundayWeekStartIso(doc.date) : "undated";
}

function noteWeekLabel(weekKey) {
  if (weekKey === "undated") return "Undated";
  return `Week of ${formatIsoDate(weekKey, { day: "2-digit", month: "short" })}`;
}

function noteMonthLabel(monthKey) {
  if (monthKey === "undated") return "Undated";
  const [year, month] = monthKey.split("-").map(Number);
  if (!year || !month) return monthKey;
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
}

function getNoteMonthOptions(docs) {
  const seen = new Set();
  return docs.reduce((items, doc) => {
    const key = noteMonthKey(doc);
    if (seen.has(key)) return items;
    seen.add(key);
    items.push({ key, label: noteMonthLabel(key) });
    return items;
  }, []);
}

function getNoteWeekOptions(docs) {
  const seen = new Set();
  return docs.reduce((items, doc) => {
    if (!doc.date) return items;
    const key = noteWeekKey(doc);
    if (seen.has(key)) return items;
    seen.add(key);
    items.push({ key, label: noteWeekLabel(key) });
    return items;
  }, []);
}

function estimateReadingMinutes(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  return words ? Math.max(1, Math.round(words / 220)) : 0;
}

function MarkdownView({ text }) {
  if (isAnkiDeck(text)) return <AnkiDeckView text={text} />;

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

function isAnkiDeck(text) {
  const lines = String(text || "").split(/\r?\n/).filter((line) => line.trim());
  return lines.some((line) => line.trim() === "#separator:tab") && lines.some((line) => !line.startsWith("#") && line.includes("\t"));
}

function parseAnkiDeck(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const [front, ...backParts] = line.split("\t");
      return { front: front || "", back: backParts.join("\t") || "" };
    })
    .filter((card) => card.front && card.back);
}

function AnkiDeckView({ text }) {
  const cards = React.useMemo(() => parseAnkiDeck(text), [text]);
  const [mode, setMode] = useStateHome("study");
  const [order, setOrder] = useStateHome(() => cards.map((_, i) => i));
  const [pos, setPos] = useStateHome(0);
  const [flipped, setFlipped] = useStateHome(false);

  useEffectHome(() => {
    setOrder(cards.map((_, i) => i));
    setPos(0);
    setFlipped(false);
  }, [cards]);

  if (!cards.length) return <p className="muted">No flashcards in this deck.</p>;

  const total = cards.length;
  const current = cards[order[pos]] || cards[0];

  function go(delta) {
    setFlipped(false);
    setPos((p) => (p + delta + total) % total);
  }
  function shuffleDeck() {
    const next = cards.map((_, i) => i);
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setOrder(next);
    setPos(0);
    setFlipped(false);
  }

  return (
    <div className="anki-deck-view">
      <div className="anki-deck-bar">
        <div className="anki-deck-summary">
          <strong>{total} flashcards</strong>
          <span>Active recall deck</span>
        </div>
        <div className="anki-mode-toggle" role="tablist" aria-label="Flashcard view">
          <button role="tab" aria-selected={mode === "study"} className={mode === "study" ? "on" : ""} onClick={() => setMode("study")}>
            <Icon name="layers" size={14} /> Study
          </button>
          <button role="tab" aria-selected={mode === "browse"} className={mode === "browse" ? "on" : ""} onClick={() => setMode("browse")}>
            <Icon name="grid" size={14} /> Browse all
          </button>
        </div>
      </div>

      {mode === "study" ? (
        <div className="anki-study">
          <div className="anki-progress">
            <div className="anki-progress-track"><div className="anki-progress-fill" style={{ width: `${((pos + 1) / total) * 100}%` }} /></div>
            <span className="anki-progress-label">{pos + 1} / {total}</span>
          </div>

          <div
            className={`anki-flip${flipped ? " is-flipped" : ""}`}
            role="button"
            tabIndex={0}
            aria-label={flipped ? "Show question" : "Reveal answer"}
            onClick={() => setFlipped((f) => !f)}
            onKeyDown={(event) => {
              if (event.key === " " || event.key === "Enter") { event.preventDefault(); setFlipped((f) => !f); }
              else if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
              else if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
            }}>
            <div className="anki-flip-inner">
              <div className="anki-face anki-face-front">
                <span className="anki-face-tag">Question</span>
                <div className="anki-face-text">{renderInline(current.front)}</div>
                <span className="anki-flip-hint"><Icon name="rotate" size={13} /> Tap to reveal</span>
              </div>
              <div className="anki-face anki-face-back">
                <span className="anki-face-tag">Answer</span>
                <div className="anki-face-text">{renderInline(current.back)}</div>
                <span className="anki-flip-hint"><Icon name="rotate" size={13} /> Tap to flip back</span>
              </div>
            </div>
          </div>

          <div className="anki-controls">
            <button className="anki-nav" onClick={() => go(-1)} aria-label="Previous card"><Icon name="arrowL" size={15} /> Prev</button>
            <button className="anki-shuffle" onClick={shuffleDeck}><Icon name="shuffle" size={15} /> Shuffle</button>
            <button className="anki-nav" onClick={() => go(1)} aria-label="Next card">Next <Icon name="arrowR" size={15} /></button>
          </div>
        </div>
      ) : (
        <div className="anki-card-list">
          {cards.map((card, index) => (
            <article className="anki-card" key={index}>
              <div className="anki-card-q">
                <span>Q{index + 1}</span>
                <p>{renderInline(card.front)}</p>
              </div>
              <div className="anki-card-a">
                <span>Answer</span>
                <p>{renderInline(card.back)}</p>
              </div>
            </article>
          ))}
        </div>
      )}
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
            <HeroStudyDesk go={go} progress={progress} />
          </div>
          <HeroCalendar go={go} progress={progress} />
        </div>
      </section>

      <WeeklyPlanCard />

      <div className="home-main">
        <div className="home-col-l">
          <DailyQuizCard go={go} progress={progress} />
          <DailyRcCard go={go} />
        </div>
        <div className="home-col-r">
          <Snapshot go={go} summary={summary} />
          <BuildTest go={go} />
        </div>
      </div>

      <BankBrowse go={go} />
      <NotesLibrary />
    </div>
  );
}

Object.assign(window, { Home });
