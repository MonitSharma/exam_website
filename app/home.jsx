// Home / landing + exam picker + daily quiz discovery
const { useState: useStateHome, useEffect: useEffectHome } = React;

function loadPref(key, fallback) {
  try {
    const value = window.localStorage.getItem(`pariksha:${key}`);
    return value == null ? fallback : value;
  } catch (error) {
    return fallback;
  }
}

function savePref(key, value) {
  try {
    window.localStorage.setItem(`pariksha:${key}`, value);
  } catch (error) {
    /* ignore storage failures (private mode, etc.) */
  }
}

function ExamSwitcher() {
  const exams = [
    { id: "upsc", name: "UPSC CSE", note: "Prelims · GS + CSAT", live: true },
    { id: "ssc", name: "SSC CGL", note: "Coming soon", live: false },
    { id: "rbi", name: "RBI Grade B", note: "Coming soon", live: false },
    { id: "bank", name: "Banking", note: "Coming soon", live: false },
  ];
  const [active, setActive] = useStateHome(() => loadPref("exam", "upsc"));
  return (
    <div className="exam-switch" role="tablist" aria-label="Exam">
      {exams.map((e) => (
        <button key={e.id} role="tab" aria-selected={active === e.id}
          className={`exam-tab${active === e.id ? " active" : ""}${!e.live ? " locked" : ""}`}
          onClick={() => e.live && (setActive(e.id), savePref("exam", e.id))}>
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

function noteCalendarLabel(doc) { return window.UPSC_CONTENT.notes[doc.cadence]?.label || "Note"; }

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

  useEffectHome(() => {
    function onSelectDate(event) {
      const isoDate = event.detail?.isoDate;
      if (!isoDate) return;
      setViewMonth(calendarMonthKey(isoDate));
      setSelectedDate(isoDate);
    }
    window.addEventListener("pariksha:select-date", onSelectDate);
    return () => window.removeEventListener("pariksha:select-date", onSelectDate);
  }, []);

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
                aria-label={`${formatIsoDate(iso)}, ${materialCount} materials`} aria-pressed={iso === selectedDate} title={materialCount ? `${materialCount} materials` : "No materials"}>
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
                <span className="calendar-material-status">{progress.manualCompletions?.[item.id] || progress.history?.some((entry) => entry.questionSetId === item.id) ? <><Icon name="check" size={15} /> Done</> : <Icon name={item.type === "test" ? "play" : "book"} size={15} />}</span>
              </button>
            )) : <p>No notes or practice sets for this date.</p>}
          </div>
        </div>
      </div>
      <p className="hero-calendar-foot">{selectedDaily ? done[selectedDate] ? "Daily quiz complete for this date." : "Daily quiz pending for this date." : "Use the arrows to review earlier months."}</p>
    </aside>
  );
}

// Completion status of the most recent daily quizzes (for streak + progress viz).
function recentDailyStatus(progress) {
  const ds = window.UPSC;
  const done = progress?.dailyCompletions || {};
  const recent = ds.getQuestionSetsBySource("daily")
    .map((set) => set.isoDate)
    .filter((iso) => iso && iso <= ds.todayIso)
    .sort()
    .slice(-7);
  return { recent, doneCount: recent.filter((iso) => done[iso]).length };
}

function HeroStreak({ go, progress, summary }) {
  const ds = window.UPSC;
  const done = progress?.dailyCompletions || {};
  const { recent, doneCount } = recentDailyStatus(progress);
  if (!recent.length) return null;
  return (
    <div className="hero-streak">
      <div className="hero-streak-main">
        <span className="hero-streak-flame"><Icon name="flame" size={17} /></span>
        <div className="hero-streak-copy">
          <strong>{summary.streak > 0 ? `${summary.streak}-day streak` : "Start your streak"}</strong>
          <small>{doneCount} of last {recent.length} daily quizzes done</small>
        </div>
      </div>
      <div className="hero-streak-dots" aria-hidden="true">
        {recent.map((iso) => <span key={iso} className={done[iso] ? "on" : ""} title={formatIsoDate(iso)} />)}
      </div>
      <button className="hero-streak-cta" onClick={() => go("test", { setId: ds.defaultQuestionSetId })}>
        {summary.streak > 0 ? "Continue" : "Begin"} <Icon name="arrowR" size={14} />
      </button>
    </div>
  );
}

function ReviseNextCard({ go, progress, summary, review, onStartReview }) {
  const ds = window.UPSC;
  const weak = React.useMemo(() => {
    const agg = {};
    (progress?.history || []).forEach((entry) => {
      Object.entries(entry.subjectBreakdown || {}).forEach(([subject, value]) => {
        if (!agg[subject]) agg[subject] = { correct: 0, attempted: 0 };
        agg[subject].correct += Number(value.correct) || 0;
        agg[subject].attempted += Number(value.attempted) || 0;
      });
    });
    return Object.entries(agg)
      .filter(([, value]) => value.attempted >= 3)
      .map(([subject, value]) => ({ subject, accuracy: Math.round((value.correct / value.attempted) * 100), attempted: value.attempted }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);
  }, [progress]);
  const hasHistory = (progress?.history || []).length > 0;
  const dueCount = review?.due || 0;
  const accuracyTone = (value) => (value < 50 ? "low" : value < 75 ? "mid" : "high");

  return (
    <article className="revise-card">
      <div className="revise-head">
        <span className="eyebrow small"><span className="eyebrow-line" /> Revise next</span>
        {hasHistory && <span className="revise-count">{summary.attempts} attempt{summary.attempts === 1 ? "" : "s"}</span>}
      </div>
      {dueCount > 0 && (
        <button className="revise-due" onClick={onStartReview}>
          <span className="revise-due-dot" />
          <span><strong>{dueCount} question{dueCount === 1 ? "" : "s"} due for revision</strong><small>Spaced repetition on what you got wrong</small></span>
          <Icon name="arrowR" size={15} />
        </button>
      )}
      {weak.length ? (
        <>
          <p className="revise-sub">Your lowest-accuracy areas — worth another pass.</p>
          <ul className="revise-list">
            {weak.map((item) => (
              <li key={item.subject}>
                <div className="revise-row-top"><strong>{item.subject}</strong><span>{item.accuracy}%</span></div>
                <div className="revise-bar"><div className={`revise-bar-fill tone-${accuracyTone(item.accuracy)}`} style={{ width: `${Math.max(item.accuracy, 4)}%` }} /></div>
                <small>{item.attempted} attempted</small>
              </li>
            ))}
          </ul>
          <button className="revise-cta" onClick={() => go("test", { setId: ds.defaultPracticeSetId })}>Practise a set <Icon name="arrowR" size={15} /></button>
        </>
      ) : (
        <div className="revise-empty">
          <p className="revise-sub">{hasHistory
            ? "Attempt a few more questions and this will surface the topics you should revise."
            : "Take a quiz and this panel highlights the topics you should revise next."}</p>
          <button className="revise-cta" onClick={() => go("test", { setId: ds.defaultQuestionSetId })}>
            {hasHistory ? "Keep practising" : "Start your first quiz"} <Icon name="arrowR" size={15} />
          </button>
        </div>
      )}
    </article>
  );
}

function DailyQuizCard({ go, progress }) {
  const ds = window.UPSC;
  const dailyQuiz = ds.dailyQuiz;
  const dailySet = ds.getQuestionSetById(ds.defaultQuestionSetId);
  const complete = Boolean(progress.dailyCompletions?.[dailyQuiz.isoDate]);
  const { recent, doneCount } = recentDailyStatus(progress);
  const weekPct = recent.length ? Math.round((doneCount / recent.length) * 100) : 0;
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
      {recent.length > 0 && (
        <div className="daily-progress" title={`${doneCount} of last ${recent.length} daily quizzes completed`}>
          <div className="daily-progress-track"><div className="daily-progress-fill" style={{ width: `${weekPct}%` }} /></div>
          <span>{doneCount}/{recent.length} this week</span>
        </div>
      )}
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

function balancedWeekPlan(todayDate) {
  const start = new Date(todayDate);
  const day = start.getUTCDay();
  start.setUTCDate(start.getUTCDate() - day);
  const labels = [
    ["Weekly quiz + planning", "Rest if the week was heavy"],
    ["Static GS — current fortnight", "One focused reading session"],
    ["Physics Optional", "One focused problem-solving session"],
    ["Static GS + PYQ recall", "One focused reading session"],
    ["Mains answer / Ethics", "One answer only"],
    ["Physics Optional", "One focused problem-solving session"],
    ["Static GS revision", "Weekly consolidation"],
  ];
  const lightStart = "2026-08-24";
  const lightEnd = "2026-08-30";
  return {
    headers: ["Daily baseline", "Core focus"],
    days: labels.map((cells, index) => {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + index);
      const iso = date.toISOString().slice(0, 10);
      const light = iso >= lightStart && iso <= lightEnd;
      return {
        weekday: WEEKDAYS[index],
        dayNum: date.getUTCDate(),
        cells: ["CA + PIB daily", light ? "Recovery week — no scheduled core study" : cells.join(" · ")],
      };
    }),
  };
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

  const todayDate = isoDateToUtc(ds.todayIso) || new Date();
  const todayNum = todayDate.getUTCDate();
  const isCurrentWeek = sweep.date && isIsoWithinWeek(ds.todayIso, getSundayWeekStartIso(sweep.date));
  // Prefer the real parsed Sunday Sweep (its day-by-day chapters) for every week,
  // including the current one. Fall back to the generic template only if the
  // sweep could not be parsed.
  const plan = (state.plan && state.plan.days && state.plan.days.length)
    ? state.plan
    : (isCurrentWeek ? balancedWeekPlan(todayDate) : state.plan);
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
  const banksWithAvail = banks.map((bank) => ({ ...bank, available: sourceSets(bank.sourceType).length }));
  const liveBanks = banksWithAvail.filter((bank) => bank.available > 0);
  const soonBanks = banksWithAvail.filter((bank) => bank.available === 0);
  const orderedBanks = [...liveBanks, ...soonBanks];
  const active = orderedBanks.find((bank) => bank.id === activeBank) || null;
  return (
    <section className="bank">
      <div className="bank-head">
        <div className="bank-head-text">
          <span className="eyebrow small"><span className="eyebrow-line" /> Practice bank</span>
          <h3>Explore the question bank</h3>
        </div>
        <button className="link-btn" onClick={() => setActiveBank(activeBank ? null : liveBanks[0]?.id || "pyq")}>
          {activeBank ? "Close" : "Browse all"} <Icon name={activeBank ? "x" : "arrowR"} size={14} />
        </button>
      </div>
      <div className="bank-grid">
        {orderedBanks.map((s) => {
          const empty = s.available === 0;
          return (
            <button
              key={s.title}
              className={`bank-card tone-${s.tone}${activeBank === s.id ? " selected" : ""}${empty ? " is-empty" : ""}`}
              onClick={() => !empty && setActiveBank(s.id)}
              disabled={empty}
              aria-disabled={empty}>
              <span className="bank-icon"><Icon name={s.icon} size={20} /></span>
              <span className="bank-count">{empty ? "Soon" : s.count}</span>
              <strong>{s.title}</strong>
              <span className="bank-desc">{s.desc}</span>
            </button>
          );
        })}
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
  const bundles = collapseQuestionSetBundles(sets);
  return (
    <div className="set-picker">
      <div className="set-picker-head">
        <div>
          <h4>{bank.title}</h4>
          <p>{bundles.length ? `${bundles.length} date${bundles.length === 1 ? "" : "s"} available` : "No sets are loaded yet."}</p>
        </div>
        <button className="icon-btn ghost" onClick={onClose} aria-label="Close"><Icon name="x" size={17} /></button>
      </div>
      <div className="set-grid">
        {bundles.map((set) => {
          const bundle = questionSetBundleFor(set, sets);
          const addOn = bundle.find((item) => item.isSupplementary);
          return (
          <div key={questionSetBundleKey(set)} className="set-option">
            <span className="set-option-kicker">{set.year || (set.isoDate ? formatIsoDate(set.isoDate, { day: "2-digit", month: "short" }) : set.shortLabel)}</span>
            {addOn && <span className="variant-chip">Practice Add-on</span>}
            <strong>{set.label}</strong>
            <span>{bundle.map((item) => `${window.UPSC_CONTENT.variantLabel(item)} ${item.questionCount}q`).join(" · ")}</span>
            {bundle.length > 1 ? (
              <div className="set-variant-tabs">
                {bundle.map((item) => (
                  <button key={item.id} onClick={() => go("test", { setId: item.id })}>
                    {window.UPSC_CONTENT.variantLabel(item)}
                  </button>
                ))}
              </div>
            ) : (
              <button className="set-card-start" onClick={() => go("test", { setId: set.id })}>Start</button>
            )}
          </div>
        );})}
      </div>
    </div>
  );
}

function questionSetBundleKey(set) {
  return window.UPSC_CONTENT.bundleKey(set);
}

function questionSetBundleFor(set, sets) {
  const key = questionSetBundleKey(set);
  if (!key) return [];
  return sets.filter((item) => questionSetBundleKey(item) === key).sort((a, b) => {
    if (!!a.isSupplementary !== !!b.isSupplementary) return a.isSupplementary ? 1 : -1;
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  });
}

function collapseQuestionSetBundles(sets) {
  const byKey = new Map();
  for (const set of sets) {
    const key = questionSetBundleKey(set);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(set);
  }
  return [...byKey.values()].map((items) => items.find((set) => !set.isSupplementary) || items[0]).filter(Boolean);
}

const CADENCE_META = window.UPSC_CONTENT.notes;
const GROUP_ORDER = ["Daily", "Weekly", "Monthly", "Reference"];

function noteBundleKey(doc) {
  return window.UPSC_CONTENT.bundleKey(doc);
}

function noteBundleFor(doc, docs) {
  const key = noteBundleKey(doc);
  if (!key) return [];
  return docs.filter((item) => noteBundleKey(item) === key).sort((a, b) => {
    if (!!a.isSupplementary !== !!b.isSupplementary) return a.isSupplementary ? 1 : -1;
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  });
}

function preferredNoteFromBundle(items) {
  return items.find((item) => !item.isSupplementary) || items[0] || null;
}

function collapseNoteBundles(docs) {
  const byKey = new Map();
  for (const doc of docs) {
    const key = noteBundleKey(doc);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(doc);
  }
  return [...byKey.values()].map(preferredNoteFromBundle).filter(Boolean);
}

function TodayPreparation({ go, progress, review, onStartReview }) {
  const ds = window.UPSC;
  const dailySet = latestDatedItem(ds.getQuestionSetsBySource("daily"), "isoDate", ds.todayIso);
  const dailyDone = Boolean(dailySet && progress?.dailyCompletions?.[dailySet.isoDate]);
  const dueQuestions = review?.due || 0;
  const dueLabs = review?.labDue || 0;
  const weakSubject = review?.weakest?.[0]?.subject || dailySet?.subjects?.[0] || "Mixed GS";
  const steps = [
    dueQuestions > 0 && { key: "review", label: "Recall", title: `${dueQuestions} question${dueQuestions === 1 ? "" : "s"} due`, meta: "Weakest questions first", action: onStartReview, done: false },
    dailySet && { key: "daily", label: "Daily", title: dailyDone ? "Daily quiz completed" : dailySet.shortLabel || "Daily quiz", meta: `${dailySet.questionCount || 0} questions · ${dailySet.durationMinutes || 10} min`, action: () => go("test", { setId: dailySet.id }), done: dailyDone },
    { key: "focus", label: "Focus", title: weakSubject, meta: dueLabs > 0 ? `${dueLabs} lab review${dueLabs === 1 ? "" : "s"} due` : "Open a visual revision lab", action: () => go("labs", { focusSubject: weakSubject }), done: false },
  ].filter(Boolean);
  const next = steps.find((step) => !step.done) || steps[steps.length - 1];
  const minutes = Math.max(12, (dueQuestions ? Math.min(dueQuestions, 12) : 0) + (dailySet && !dailyDone ? Number(dailySet.durationMinutes || 10) : 0) + 8);
  return (
    <section className="today-prep">
      <div className="today-prep-head"><div><span className="eyebrow small"><span className="eyebrow-line" /> Your next session</span><h2>Your next session</h2><p>A small loop: recall what is due, attempt today’s questions, then reinforce your weakest area.</p></div><div className="today-prep-time"><span className="today-prep-time-label">Estimated session</span><strong>~{minutes} min</strong><span>{dailyDone && !dueQuestions ? "Momentum maintained" : "Ready when you are"}</span></div></div>
      <div className="today-prep-steps">{steps.map((step, index) => <button key={step.key} className={`today-prep-step${step.done ? " done" : ""}`} onClick={step.action} aria-label={`${step.label}: ${step.title}`}><span className="today-prep-number">{step.done ? "✓" : String(index + 1).padStart(2, "0")}</span><span className="today-prep-step-copy"><em>{step.label}</em><strong>{step.title}</strong><small>{step.meta}</small></span><Icon name="arrowR" size={15} /></button>)}</div>
      <button className="today-prep-cta" onClick={next.action}><span><Icon name="bolt" size={15} /> Continue preparation: {next.title}</span><Icon name="arrowR" size={15} /></button>
    </section>
  );
}

function CatchUpTeaser({ go, progress }) {
  const ds = window.UPSC;
  const missed = window.UPSC_PROGRESS.getMissedSessions(progress, ds.todayIso, ds.questionSets, ds.noteDocuments);
  if (!missed.length) return null;
  const quizCount = missed.filter((item) => item.kind === "quiz").length;
  const writingCount = missed.length - quizCount;
  const parts = [];
  if (quizCount) parts.push(`${quizCount} ${quizCount === 1 ? "quiz" : "quizzes"}`);
  if (writingCount) parts.push(`${writingCount} answer-writing`);
  return (
    <button className="catchup-teaser" onClick={() => go("catchup")} aria-label={`Catch up: ${missed.length} pending`}>
      <span className="catchup-teaser-mark"><Icon name="clock" size={17} /></span>
      <span className="catchup-teaser-copy">
        <em>Catch-up backlog</em>
        <strong>{missed.length} {missed.length === 1 ? "item" : "items"} to catch up</strong>
        <small>{parts.length ? `${parts.join(" · ")} — quizzes, mocks & answer-writing you skipped` : "Quizzes, mocks & answer-writing you skipped"}</small>
      </span>
      <span className="catchup-teaser-go">Review <Icon name="arrowR" size={15} /></span>
    </button>
  );
}

function NotesLibrary({ go, noteId, progress, onMarkDone }) {
  const ds = window.UPSC;
  const order = Object.keys(CADENCE_META);
  const availableCadences = new Set(ds.noteDocuments.map((doc) => doc.cadence));
  const tabs = order.filter((key) => availableCadences.has(key));
  const grouped = GROUP_ORDER.map((g) => ({
    group: g,
    items: tabs.filter((key) => CADENCE_META[key].group === g),
  })).filter((cluster) => cluster.items.length);

  const [cadence, setCadence] = useStateHome(() => ds.noteDocuments.find((doc) => doc.id === noteId)?.cadence || loadPref("notesCadence", tabs[0] || "daily"));
  const activeCadence = tabs.includes(cadence) ? cadence : tabs[0] || cadence;
  const meta = CADENCE_META[activeCadence] || { label: "Notes" };
  const docs = ds.noteDocuments.filter((doc) => doc.cadence === activeCadence);
  const docIds = docs.map((doc) => doc.id).join("|");
  const [selectedId, setSelectedId] = useStateHome(noteId || docs[0]?.id || null);
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
  const filteredDocs = useWeekFilter
    ? activeWeek === "all" ? docs : docs.filter((doc) => noteWeekKey(doc) === activeWeek)
    : activeMonth === "all" ? docs : docs.filter((doc) => noteMonthKey(doc) === activeMonth);
  const visibleDocs = collapseNoteBundles(filteredDocs);
  const loadedDoc = noteState.note && noteState.note.id === selectedId ? noteState.note : null;
  const selectedDoc = loadedDoc || docs.find((doc) => doc.id === selectedId) || null;
  const selectedBundle = noteBundleFor(selectedDoc, docs);
  const readingMinutes = estimateReadingMinutes(noteState.content);

  useEffectHome(() => { savePref("notesCadence", activeCadence); }, [activeCadence]);

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
      setSelectedId(collapseNoteBundles(nextDocs)[0]?.id || docs[0]?.id || null);
    }
  }, [activeCadence, docIds]);

  useEffectHome(() => {
    const target = ds.noteDocuments.find((doc) => doc.id === noteId);
    if (!target) return;
    setCadence(target.cadence);
    setMonthFilter(noteMonthKey(target));
    setWeekFilter(noteWeekKey(target));
    setSelectedId(target.id);
  }, [noteId]);

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
    <section className="notes-library notes-v2" aria-label="Study library">
      <div className="notes-head">
        <div className="notes-title">
          <span className="eyebrow small"><span className="eyebrow-line" /> Notes &amp; briefings</span>
          <h1>Study library</h1>
          <p className="notes-sub">Briefings, writing practice and revision notes. Choose a category and week to begin.</p>
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
                    setSelectedId(collapseNoteBundles(nextDocs)[0]?.id || null);
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
                    setSelectedId(collapseNoteBundles(nextDocs)[0]?.id || null);
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
            const bundle = noteBundleFor(doc, docs);
            const active = bundle.some((item) => item.id === selectedId);
            const companionCount = bundle.filter((item) => item.isSupplementary).length;
            return (
              <button key={noteBundleKey(doc)} className={active ? "on" : ""} onClick={() => setSelectedId(doc.id)}>
                {kicker && <span className="note-kicker">{kicker}</span>}
                {companionCount > 0 && <span className="note-variant-chip">Companion Brief</span>}
                <strong>{doc.title}</strong>
                {secondary && <span>{secondary}</span>}
              </button>
            );
          }) : <p>No {meta.label.toLowerCase()} notes yet.</p>}
          </div>
          {!noteState.loading && noteState.content && <NoteOutline content={noteState.content} />}
        </aside>

        <article className="note-reader">
          {selectedDoc && (
            <header className="note-reader-head">
              <div className="note-reader-meta-row">
                <span className="note-cat-chip">{meta.label}</span>
                {selectedDoc.variantLabel && <span className="note-cat-chip note-cat-chip-muted">{selectedDoc.variantLabel}</span>}
                {selectedDoc.date && <span className="note-meta-item"><Icon name="calendar" size={13} /> {formatIsoDate(selectedDoc.date)}</span>}
                {readingMinutes > 0 && <span className="note-meta-item"><Icon name="clock" size={13} /> {readingMinutes} min read</span>}
              </div>
              {selectedBundle.length > 1 && (
                <div className="note-variant-tabs" role="tablist" aria-label="Brief variants">
                  {selectedBundle.map((doc) => (
                    <button
                      key={doc.id}
                      role="tab"
                      aria-selected={selectedId === doc.id}
                      className={selectedId === doc.id ? "on" : ""}
                      onClick={() => setSelectedId(doc.id)}>
                      {window.UPSC_CONTENT.variantLabel(doc)}
                    </button>
                  ))}
                </div>
              )}
              <h2>{selectedDoc.title}</h2>
              {window.UPSC_CONTENT.notes[selectedDoc.cadence]?.writing && <button className="btn ghost sm" aria-pressed={Boolean(progress?.manualCompletions?.[selectedDoc.id])} onClick={() => onMarkDone(selectedDoc.id, !progress?.manualCompletions?.[selectedDoc.id])}>{progress?.manualCompletions?.[selectedDoc.id] ? "Written · undo" : "Mark answer written"}</button>}
              <RelatedStudy doc={selectedDoc} go={go} />
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

function stripInlineMarkup(text) {
  return String(text || "").replace(/[*`_]+/g, "").replace(/\s+#*\s*$/, "").trim();
}

// Extract headings in document order, skipping $$ math blocks so the ordinals
// line up with the ids MarkdownView assigns to the rendered headings.
function parseNoteHeadings(text) {
  const lines = String(text || "").split(/\r?\n/);
  const headings = [];
  let inMath = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (/^\$\$/.test(line)) {
      const oneLine = line.length > 3 && line.endsWith("$$");
      if (!oneLine) inMath = !inMath;
      continue;
    }
    if (inMath) continue;
    const match = raw.match(/^(#{1,4})\s+(.*)$/);
    if (match) headings.push({ level: match[1].length, text: stripInlineMarkup(match[2]) });
  }
  return headings.map((heading, index) => ({ ...heading, id: `note-h-${index}` }));
}

function NoteOutline({ content }) {
  const headings = React.useMemo(() => parseNoteHeadings(content), [content]);
  if (headings.length < 2) return null;
  function jump(id) {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 84, behavior: "smooth" });
  }
  return (
    <nav className="note-outline" aria-label="On this page">
      <span className="note-outline-label">On this page</span>
      <ul>
        {headings.map((heading) => (
          <li key={heading.id} className={`lvl-${Math.min(heading.level, 3)}`}>
            <button onClick={() => jump(heading.id)}>{heading.text}</button>
          </li>
        ))}
      </ul>
    </nav>
  );
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
      const start = Number(line.match(/^\d+/)[0]);
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ordered-list", items, start });
      continue;
    }
    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !/^\s*\$\$/.test(lines[i]) && !/^#{1,4}\s/.test(lines[i]) && !/^[-*]\s+/.test(lines[i]) && !/^\d+\.\s+/.test(lines[i]) && !/^>\s?/.test(lines[i]) && !/^---+$/.test(lines[i].trim()) && !/^\|/.test(lines[i])) {
      paragraph.push(lines[i]);
      i++;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  const headingIds = {};
  let headingOrdinal = 0;
  blocks.forEach((block, index) => {
    if (block.type === "heading") headingIds[index] = `note-h-${headingOrdinal++}`;
  });

  return (
    <div className="markdown-view">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const TagName = block.level <= 1 ? "h2" : block.level === 2 ? "h3" : "h4";
          return <TagName key={index} id={headingIds[index]}>{renderInline(block.text)}</TagName>;
        }
        if (block.type === "quote") return <blockquote key={index}>{renderInline(block.text)}</blockquote>;
        if (block.type === "list") return <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ul>;
        if (block.type === "ordered-list") return <ol key={index} start={block.start}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item)}</li>)}</ol>;
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
    if (source[i] === "[") {
      const labelEnd = source.indexOf("](", i + 1);
      if (labelEnd > i) {
        let end = labelEnd + 2, depth = 1;
        while (end < source.length && depth) { if (source[end] === "(") depth++; if (source[end] === ")") depth--; end++; }
        if (!depth) {
          const href = source.slice(labelEnd + 2, end - 1).trim();
          if (/^https?:\/\//i.test(href) && !/[\s\u0000-\u001f]/.test(href)) {
            parts.push({ type: "link", value: source.slice(i + 1, labelEnd), href });
            i = end; continue;
          }
        }
      }
    }
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
      const formula = end > i ? source.slice(i + 1, end) : "";
      if (end > i && shouldRenderDollarMath(source, i, end, formula)) {
        parts.push({ type: "math", value: formula });
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
    if (part.type === "link") return <a key={index} href={part.href} target="_blank" rel="noopener noreferrer">{renderInline(part.value)}</a>;
    if (part.type === "strong") return <strong key={index}>{renderInline(part.value)}</strong>;
    if (part.type === "code") return <code key={index}>{part.value}</code>;
    if (part.type === "math") return <MathText key={index} value={part.value} />;
    if (part.type === "em") return <em key={index}>{renderInline(part.value)}</em>;
    return <React.Fragment key={index}>{part.value}</React.Fragment>;
  });
}

function nextInlineMarker(source, fromIndex) {
  const markers = ["[", "`", "$", "**", "*"]
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

function shouldRenderDollarMath(source, start, end, formula) {
  const value = String(formula || "").trim();
  if (!value) return false;
  const next = source[start + 1] || "";
  const before = source[start - 1] || "";
  const after = source[end + 1] || "";
  if (/\s|\d/.test(next)) return false;
  if (/[A-Za-z0-9]/.test(before) || /[A-Za-z0-9]/.test(after)) return false;
  if (/^[A-Z]{2,}\b/.test(value)) return false;
  if (/\\|[_^=<>+\-*/()[\]{}]/.test(value)) return true;
  return /^[A-Za-z][A-Za-z0-9]{0,2}$/.test(value);
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
  const latexSafeFormula = String(formula).replace(/(^|[^\\])%/g, "$1\\%");
  try {
    return window.katex.renderToString(latexSafeFormula, {
      displayMode: display,
      throwOnError: false,
      strict: false,
      trust: false,
    });
  } catch (error) {
    return "";
  }
}

function Home({ go, progress, summary, review, onStartReview }) {
  const ds = window.UPSC;
  return (
    <div className="home home-focused">
      <section className="hero"><div className="hero-grid">
        <div className="hero-inner">
          <span className="eyebrow"><span className="eyebrow-line" /> UPSC CSE · Your study desk</span>
          <h1 className="hero-title">One day at a time.<br /><em>One step closer.</em></h1>
          <p className="hero-sub">{ds.years.length} years of previous-year papers, daily briefings and focused practice. Pick up where you left off.</p>
          <TodayPreparation go={go} progress={progress} review={review} onStartReview={onStartReview} />
          <div className="home-shortcuts"><button className="btn ghost" onClick={() => go("library")}><Icon name="book" size={16} /> Read the library</button><button className="btn ghost" onClick={() => go("practice")}><Icon name="play" size={16} /> Browse practice</button></div>
          <div className="home-summary" aria-label="Your progress"><span><strong>{summary.streak}</strong> day streak</span><span><strong>{summary.questionsSolved || summary.questions || 0}</strong> questions solved</span><button className="link-btn" onClick={() => go("dashboard")}>View progress <Icon name="arrowR" size={14} /></button></div>
        </div>
        <HeroCalendar go={go} progress={progress} />
      </div></section>
      <WeeklyPlanCard />
      <CatchUpTeaser go={go} progress={progress} />
    </div>
  );
}

function RelatedStudy({ doc, go }) {
  const ds = window.UPSC;
  const sets = ds.questionSets.filter((set) => doc.relatedSetIds?.includes(set.id));
  const notes = ds.noteDocuments.filter((note) => doc.relatedNoteIds?.includes(note.id));
  const labs = Object.entries(typeof LAB_GUIDES === "undefined" ? {} : LAB_GUIDES).filter(([, guide]) => guide.pyqSubjects.some((subject) => doc.subjectIds?.includes(window.UPSC_CONTENT.subjectId(subject))));
  if (!sets.length && !notes.length && !doc.atlasWeekId && !labs.length) return null;
  return <section className="related-study" aria-label="Related study"><strong>Continue from this note</strong><div>
    {sets.map((set) => <button className="btn ghost sm" key={set.id} onClick={() => go("test", { setId: set.id, returnTo: "library" })}>{set.label} · {set.questionCount}Q</button>)}
    {notes.map((note) => <button className="btn ghost sm" key={note.id} onClick={() => go("library", { noteId: note.id })}>{note.title}</button>)}
    {doc.atlasWeekId && (doc.mapStatus === "ready" ? <button className="btn ghost sm" onClick={() => go("atlas", { weekId: doc.atlasWeekId })}>Locate {doc.atlasFeatureIds.length} places on the map</button> : <span>Map pending for this briefing</span>)}
    {labs.slice(0, 4).map(([id, guide]) => <button className="btn ghost sm" key={id} onClick={() => go("labs", { focusSubject: guide.pyqSubjects[0] })}>{guide.path.split(" · ").slice(-1)[0]} · revision &amp; PYQs</button>)}
  </div></section>;
}

Object.assign(window, { Home, NotesLibrary, WeeklyPlanCard, parseWeekPlan });
