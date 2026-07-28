// Study workflow dashboard - native version of the standalone UPSC tracker
const WORKFLOW_PRELIMS = new Date("2027-05-24T00:00:00");
const WORKFLOW_PLAN_START = new Date("2026-06-02T00:00:00");
const WORKFLOW_FORTNIGHTS = [
  ["F1", "2026-06-02", "2026-06-15", "Setup & diagnostics", "Foundation"],
  ["F2", "2026-06-16", "2026-06-29", "Polity + Economy foundation", "Foundation"],
  ["F3", "2026-06-30", "2026-07-13", "Polity deep + Economy NCERT 12", "Foundation"],
  ["F4", "2026-07-14", "2026-07-27", "Economy: Vivek Singh Ch1-3 (Money & Banking)", "Foundation"],
  ["F5", "2026-07-28", "2026-08-10", "Economy: Vivek Singh Ch4 (Budget/Tax) + History deep", "Foundation"],
  ["F6", "2026-08-11", "2026-08-24", "Economy: Vivek Singh Ch6-7 (Growth/Industry) + Env biodiversity", "Foundation"],
  ["F7", "2026-08-25", "2026-09-07", "Economy: Vivek Singh Ch10-14 (Agri/Sectors) + Sci-Tech build", "Foundation"],
  ["F8", "2026-09-08", "2026-09-21", "Economy: Vivek Singh Ch5,8,9 (Inclusive/Subsidies) + RBI P1 prep", "Foundation"],
  ["F9", "2026-09-22", "2026-10-05", "Econ Survey + IR expand", "Foundation"],
  ["F10", "2026-10-06", "2026-10-19", "Polity consolidation + Art/Culture", "Foundation"],
  ["F11", "2026-10-20", "2026-11-02", "RBI P1 exam + History complete", "Foundation"],
  ["F12", "2026-11-03", "2026-11-16", "Integration kickoff (Phase 2)", "Integration"],
  ["F13", "2026-11-17", "2026-11-30", "Phase 2 depth (Pass-2)", "Integration"],
  ["F14", "2026-12-01", "2026-12-14", "Sci-Tech + Geography deep", "Integration"],
  ["F15", "2026-12-15", "2026-12-28", "Art & Culture + IR deepening", "Integration"],
  ["F16", "2026-12-29", "2027-01-11", "Ethics deep + revision", "Integration"],
  ["F17", "2027-01-12", "2027-01-25", "Budget + Econ Survey heavy", "Integration"],
  ["F18", "2027-01-26", "2027-02-08", "Prelims Mode begins (Phase 3)", "Prelims Mode"],
  ["F19", "2027-02-09", "2027-02-22", "Prelims Mode intensity", "Prelims Mode"],
  ["F20", "2027-02-23", "2027-03-08", "Weak-area drilling", "Prelims Mode"],
  ["F21", "2027-03-09", "2027-03-22", "Revision Cycle 1", "Prelims Mode"],
  ["F22", "2027-03-23", "2027-04-05", "Revision Cycle 2 + PYQ marathon", "Prelims Mode"],
  ["F23", "2027-04-06", "2027-04-19", "Final consolidation", "Prelims Mode"],
  ["F24", "2027-04-20", "2027-05-24", "Prelims countdown", "Prelims Mode"],
];

const WORKFLOW_KPI = {
  "Foundation": [["Study hours/week", "28+"], ["Newspaper", "7/7"], ["New topic pages", "10-12"], ["Mains answers", "5-10"], ["MCQs", "50"], ["Mocks", "1-2 sectional"]],
  "Integration": [["Study hours/week", "35+"], ["Newspaper", "7/7"], ["New pages", "5-8 cross-link"], ["Mains answers", "14+"], ["MCQs", "300+"], ["Mocks", "1 full + 1 sectional"]],
  "Prelims Mode": [["Study hours/week", "40+"], ["Newspaper", "7/7"], ["New pages", "0 revision"], ["Mains answers", "0"], ["MCQs", "700+"], ["Mocks", "2 full"]],
  "Mains Factory": [["Physics Optional", "daily"], ["GS Mains answers", "4/day"], ["Essay", "weekly"], ["Ethics cases", "alt days"], ["Newspaper", "7/7"], ["Revision", "rotation"]],
};
const WORKFLOW_FOCUS = {
  "Foundation": [
    ["Sunday Sweep (90m)", "Sectional mock or Mains 4-Q", "Plan next week"],
    ["Newspaper: IR", "Polity - Laxmikanth", "Physics P-I: Mechanics", "GS2 Mains answer"],
    ["Newspaper: Economy", "Economy - NCERT + Vivek Singh", "RBI ESI", "GS3 Eco Mains answer"],
    ["Newspaper: History", "Modern History - Spectrum", "Physics: EM", "GS1 Mains answer"],
    ["Newspaper: Sci/Env", "Sci-Tech + Environment", "RBI FM Finance", "GS3 Mains answer"],
    ["Newspaper: IR", "IR - NCERT 12 + MEA", "Physics: Waves/Thermo", "GS2 IR Mains answer"],
    ["Newspaper + magazine", "Geography / Art&Culture", "CSAT mock or map drill", "Ethics case"],
  ],
  "Integration": [
    ["Sunday Sweep", "Full Prelims mock or Mains sectional", "Plan next week"],
    ["Newspaper", "Polity Pass-2 + cross-linking", "Physics II: QM", "2 timed Mains answers"],
    ["Newspaper", "Economy Pass-2 + Eco Survey", "Physics II: Atomic/Nuclear", "2 timed Mains answers"],
    ["Newspaper", "History Pass-2", "Physics II: Solid State", "2 timed Mains answers"],
    ["Newspaper", "Sci-Tech + Env Pass-2", "Physics II: Electronics", "2 timed Mains answers"],
    ["Newspaper", "IR + Internal Security", "Physics II: SR + revision", "2 timed Mains answers"],
    ["Newspaper", "Geography + Art & Culture", "Per-subject sectional mock", "Ethics case + answer"],
  ],
  "Prelims Mode": [
    ["Sunday Sweep", "Full-length Prelims mock", "Plan next week"],
    ["News (30m)", "Polity revision", "100 MCQ batch + debrief", "CA revision + Physics formulas"],
    ["News (30m)", "Economy revision", "100 MCQ batch + debrief", "CA revision + Physics formulas"],
    ["News (30m)", "History revision", "100 MCQ batch + debrief", "CA revision + Physics formulas"],
    ["News (30m)", "Sci-Tech / Environment revision", "100 MCQ batch + debrief", "CA revision + Physics formulas"],
    ["News (30m)", "IR / Geography revision", "100 MCQ batch + debrief", "CA revision + Physics formulas"],
    ["News (30m)", "Society / Art&Culture / Misc revision", "Mock + debrief", "CA revision + Physics formulas"],
  ],
  "Mains Factory": [
    ["Lighter day", "Essay practice / Ethics case", "Revision rotation"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Debrief + revision"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Debrief + revision"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Debrief + revision"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Debrief + revision"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Essay practice"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Ethics case + revision"],
  ],
};

function workflowFmt(value) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function workflowIsoToday() {
  return new Date().toISOString().slice(0, 10);
}

function workflowWeekStart() {
  const date = new Date();
  const day = (date.getDay() + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date;
}

function workflowLatestByDate(items, dateKey, todayIso = workflowIsoToday()) {
  return [...items]
    .filter((item) => item && item[dateKey] && item[dateKey] <= todayIso)
    .sort((a, b) => String(b[dateKey]).localeCompare(String(a[dateKey])))[0] || null;
}

function getWorkflowContext() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.max(0, Math.round((WORKFLOW_PRELIMS - today) / 86400000));
  const current = WORKFLOW_FORTNIGHTS.find((item) => today >= new Date(item[1]) && today <= new Date(`${item[2]}T23:59:59`));
  let phase, fortnight, fnDates, focus, next;
  if (today < WORKFLOW_PLAN_START) {
    phase = "Foundation";
    fortnight = "Before F1";
    fnDates = `Plan starts ${workflowFmt(WORKFLOW_PLAN_START)}`;
    focus = "Setup phase ahead";
    next = `${WORKFLOW_FORTNIGHTS[0][0]} - ${WORKFLOW_FORTNIGHTS[0][3]}`;
  } else if (today > WORKFLOW_PRELIMS) {
    phase = "Mains Factory";
    fortnight = "Post-Prelims";
    fnDates = "Mains phase -> 30 Sep 2027";
    focus = "Optional + answer writing at full intensity";
    next = "Mains 2027";
  } else if (current) {
    phase = current[4];
    fortnight = current[0];
    fnDates = `${workflowFmt(current[1])} - ${workflowFmt(current[2])}`;
    focus = current[3];
    const index = WORKFLOW_FORTNIGHTS.indexOf(current);
    next = index < WORKFLOW_FORTNIGHTS.length - 1 ? `${WORKFLOW_FORTNIGHTS[index + 1][0]} - ${WORKFLOW_FORTNIGHTS[index + 1][3]}` : "Prelims day";
  } else {
    phase = "Foundation";
    fortnight = "-";
    fnDates = "";
    focus = "";
    next = WORKFLOW_FORTNIGHTS[0][0];
  }
  const totalDays = (WORKFLOW_PRELIMS - WORKFLOW_PLAN_START) / 86400000;
  const planPercent = Math.max(0, Math.min(100, Math.round(((today - WORKFLOW_PLAN_START) / 86400000 / totalDays) * 100)));
  return { today, days, phase, fortnight, fnDates, focus, next, planPercent };
}

function StudyWorkflowDashboard({ go, progress }) {
  const context = getWorkflowContext();
  const ds = window.UPSC;
  const todayIso = workflowIsoToday();
  const history = progress?.history || [];
  const focusBlocks = (WORKFLOW_FOCUS[context.phase] || WORKFLOW_FOCUS.Foundation)[new Date().getDay()];
  const weekStartIso = workflowWeekStart().toISOString().slice(0, 10);
  const weekAttempts = history.filter((item) => String(item.isoDate || "") >= weekStartIso);
  const weekQuestions = weekAttempts.reduce((sum, item) => sum + (Number(item.attempted) || 0), 0);
  const weekCorrect = weekAttempts.reduce((sum, item) => sum + (Number(item.correct) || 0), 0);
  const weekAccuracy = Math.round((weekCorrect / (weekQuestions || 1)) * 100);
  const latestAttempt = history[history.length - 1] || null;
  const attemptedIds = new Set(history.map((item) => item.questionSetId).filter(Boolean));
  const latestDailySet = ds.dailyQuiz?.questionSetId ? ds.getQuestionSetById(ds.dailyQuiz.questionSetId) : null;
  const latestPibSet = workflowLatestByDate(ds.getQuestionSetsBySource("pib"), "isoDate", todayIso);
  const latestRcSet = workflowLatestByDate(ds.getQuestionSetsBySource("rc"), "isoDate", todayIso);
  const latestFullMock = workflowLatestByDate(ds.questionSets.filter((set) => /full mock/i.test(set.category || set.label || "")), "isoDate", todayIso);
  const latestBrief = workflowLatestByDate(ds.noteDocuments.filter((doc) => doc.cadence === "daily"), "date", todayIso);
  const latestMains = workflowLatestByDate(ds.noteDocuments.filter((doc) => doc.cadence === "mains"), "date", todayIso);
  const latestEditorial = workflowLatestByDate(ds.noteDocuments.filter((doc) => doc.cadence === "editorials"), "date", todayIso);
  const latestSunday = workflowLatestByDate(ds.noteDocuments.filter((doc) => doc.cadence === "sunday"), "date", todayIso);
  const dailyDone = Boolean(progress?.dailyCompletions?.[latestDailySet?.isoDate]);

  const recentDates = [...new Set(ds.questionSets.concat(ds.noteDocuments.map((doc) => ({ isoDate: doc.date })))
    .map((item) => item.isoDate)
    .filter((isoDate) => isoDate && isoDate <= todayIso))]
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 6);

  function openNote(note) {
    if (!note) return;
    go("home");
    setTimeout(() => window.dispatchEvent(new CustomEvent("pariksha:open-note", { detail: { id: note.id } })), 80);
  }

  function materialCountForDate(isoDate) {
    return ds.questionSets.filter((set) => set.isoDate === isoDate).length
      + ds.noteDocuments.filter((doc) => doc.date === isoDate).length;
  }

  function openDate(isoDate) {
    go("home");
    setTimeout(() => window.dispatchEvent(new CustomEvent("pariksha:select-date", { detail: { isoDate } })), 80);
  }

  const queue = [
    latestDailySet && {
      key: "daily",
      status: dailyDone ? "done" : "next",
      label: dailyDone ? "Daily complete" : "Do this first",
      title: latestDailySet.label,
      meta: `${latestDailySet.questionCount || 0} questions · ${latestDailySet.durationMinutes || 10} min`,
      icon: "bolt",
      action: () => go("test", { setId: latestDailySet.id }),
    },
    latestBrief && {
      key: "brief",
      status: "read",
      label: "Read",
      title: "Latest CA briefing",
      meta: latestBrief.shortTitle || workflowFmt(latestBrief.date),
      icon: "book",
      action: () => openNote(latestBrief),
    },
    latestPibSet && {
      key: "pib",
      status: attemptedIds.has(latestPibSet.id) ? "done" : "next",
      label: attemptedIds.has(latestPibSet.id) ? "PIB attempted" : "PIB check",
      title: latestPibSet.label,
      meta: `${latestPibSet.questionCount || 0} questions · ${latestPibSet.durationMinutes || 10} min`,
      icon: "play",
      action: () => go("test", { setId: latestPibSet.id }),
    },
    latestRcSet && {
      key: "rc",
      status: attemptedIds.has(latestRcSet.id) ? "done" : "next",
      label: attemptedIds.has(latestRcSet.id) ? "RC attempted" : "CSAT insurance",
      title: latestRcSet.label,
      meta: `${latestRcSet.questionCount || 0} questions · ${latestRcSet.durationMinutes || 8} min`,
      icon: "target",
      action: () => go("test", { setId: latestRcSet.id }),
    },
    latestMains && {
      key: "mains",
      status: "read",
      label: "Answer practice",
      title: "Latest GS Mains prompt",
      meta: latestMains.shortTitle || workflowFmt(latestMains.date),
      icon: "fileText",
      action: () => openNote(latestMains),
    },
    latestFullMock && {
      key: "mock",
      status: attemptedIds.has(latestFullMock.id) ? "done" : "mock",
      label: attemptedIds.has(latestFullMock.id) ? "Mock attempted" : "Long session",
      title: latestFullMock.label,
      meta: `${latestFullMock.questionCount || 0} questions · ${latestFullMock.durationMinutes || 120} min`,
      icon: "clock",
      action: () => go("test", { setId: latestFullMock.id }),
    },
  ].filter(Boolean);

  const readingStack = [
    latestSunday && { key: "sunday", label: "Week plan", title: latestSunday.shortTitle || workflowFmt(latestSunday.date), action: () => openNote(latestSunday) },
    latestEditorial && { key: "editorial", label: "Editorials", title: latestEditorial.shortTitle || workflowFmt(latestEditorial.date), action: () => openNote(latestEditorial) },
    latestMains && { key: "mains-read", label: "Mains", title: latestMains.shortTitle || workflowFmt(latestMains.date), action: () => openNote(latestMains) },
  ].filter(Boolean);
  const topQueue = queue.slice(0, 4);
  const activeQueue = queue.filter((item) => item.status !== "done").length;
  const kpis = WORKFLOW_KPI[context.phase] || WORKFLOW_KPI.Foundation;
  const latestAttemptLabel = latestAttempt?.setLabel || latestAttempt?.questionSetLabel || latestAttempt?.label || "Last attempt";

  return (
    <section className="workflow workflow-v2">
      <div className="workflow-title">
        <div>
          <span className="eyebrow small"><span className="eyebrow-line" /> Smart plan</span>
          <h2>What should I do next?</h2>
          <p>No manual hour logging. This queue is built from today’s materials, your attempts, and the current UPSC phase.</p>
        </div>
        <a className="link-btn" href="upsc_dashboard.html" target="_blank" rel="noreferrer">Standalone view <Icon name="arrowR" size={14} /></a>
      </div>

      <div className="workflow-command">
        <article className="workflow-hero-card">
          <div>
            <span className="workflow-summary-label">{context.phase} · {context.fortnight}</span>
            <h3>{context.focus}</h3>
            <p>{context.fnDates} · Next: {context.next}</p>
          </div>
          <div className="workflow-countdown">
            <strong>{context.days}</strong>
            <span>days to Prelims</span>
          </div>
        </article>

        <article className="workflow-card workflow-signal-card">
          <div className="workflow-card-head">
            <span>Automatic signals</span>
            <strong>{activeQueue} open</strong>
          </div>
          <div className="workflow-signal-grid">
            <div className={dailyDone ? "workflow-signal done" : "workflow-signal"}>
              <span>Daily</span>
              <strong>{dailyDone ? "Done" : "Pending"}</strong>
            </div>
            <div className="workflow-signal">
              <span>This week</span>
              <strong>{weekAttempts.length} attempts</strong>
            </div>
            <div className="workflow-signal">
              <span>Questions</span>
              <strong>{weekQuestions}</strong>
            </div>
            <div className="workflow-signal">
              <span>Accuracy</span>
              <strong>{weekAttempts.length ? `${weekAccuracy}%` : "--"}</strong>
            </div>
          </div>
          <p className="workflow-card-note">
            {latestAttempt ? `${latestAttemptLabel}: ${latestAttempt.correct}/${latestAttempt.attempted} correct.` : "Start one quiz and this panel will begin adapting."}
          </p>
        </article>
      </div>

      <div className="workflow-actions">
        {topQueue.map((item) => (
          <button key={item.key} className="workflow-action" onClick={item.action}>
            <span className="workflow-action-icon"><Icon name={item.icon} size={16} /></span>
            <span>
              <em>{item.label}</em>
              <strong>{item.title}</strong>
              <small>{item.meta}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="workflow-plan-grid">
        <article className="workflow-card workflow-queue-card">
          <div className="workflow-card-head">
            <span>Recommended next</span>
            <strong>{queue.length} items</strong>
          </div>
          <div className="workflow-queue">
            {queue.map((item) => (
              <button key={item.key} className={`workflow-queue-item ${item.status}`} onClick={item.action}>
                <span className="workflow-queue-icon"><Icon name={item.icon} size={16} /></span>
                <span className="workflow-queue-copy">
                  <em>{item.label}</em>
                  <strong>{item.title}</strong>
                  <small>{item.meta}</small>
                </span>
                <span className="workflow-status">{item.status === "done" ? "Done" : item.status === "read" ? "Open" : "Start"}</span>
              </button>
            ))}
          </div>
        </article>

        <article className="workflow-card workflow-focus-card">
          <span>Today’s focus from the plan</span>
          <h3>{new Date().toLocaleDateString("en-GB", { weekday: "long" })}</h3>
          <div className="workflow-focus">
            {focusBlocks.map((block) => <b key={block}>{block}</b>)}
          </div>
          <div className="workflow-phase-strip">
            {kpis.slice(0, 4).map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="workflow-grid">
        <article className="workflow-card">
          <span>Reading stack</span>
          <div className="workflow-read-list">
            {readingStack.length ? readingStack.map((item) => (
              <button key={item.key} className="workflow-read-item" onClick={item.action}>
                <span>
                  <em>{item.label}</em>
                  <strong>{item.title}</strong>
                </span>
                <Icon name="arrowR" size={15} />
              </button>
            )) : <p className="workflow-empty">No notes available yet.</p>}
          </div>
        </article>

        <article className="workflow-card">
          <span>Recent material days</span>
          <div className="workflow-day-list">
            {recentDates.map((isoDate) => (
              <button key={isoDate} className="workflow-day-item" onClick={() => openDate(isoDate)}>
                <span>
                  <strong>{workflowFmt(isoDate)}</strong>
                  <em>{materialCountForDate(isoDate)} materials available</em>
                </span>
                <Icon name="calendar" size={16} />
              </button>
            ))}
          </div>
        </article>
      </div>

      <article className="workflow-card workflow-routing">
        <span>How this page decides</span>
        <p>Daily quiz first, then the newest current-affairs read, PIB check, CSAT drill, Mains prompt, and long mock. Completion comes from attempts already saved in Progress.</p>
      </article>
    </section>
  );
}

Object.assign(window, { StudyWorkflowDashboard });
