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

// Trackable weekly targets per phase. Only the metrics the app can actually
// measure from saved attempts and completions live here, so the meters below
// reflect real progress instead of static advice.
const WORKFLOW_TARGETS = {
  "Foundation": { mcqs: 50, mains: 5, mocks: 1 },
  "Integration": { mcqs: 300, mains: 14, mocks: 2 },
  "Prelims Mode": { mcqs: 700, mains: 0, mocks: 2 },
  "Mains Factory": { mcqs: 0, mains: 28, mocks: 0 },
};

// Question-set types that count as a "mock" for the weekly mock target.
const WORKFLOW_MOCK_TYPES = new Set(["sectional", "csat", "ai", "csr", "pyq"]);
// Note cadences that count as an "answer written" for the mains target.
const WORKFLOW_ANSWER_CADENCES = new Set(["mains", "ethics"]);

// Fallback subject-of-the-day rotation, used only until there is enough
// attempt data to know the learner's real weakest subject. Sunday = revision.
const WORKFLOW_DOW_SUBJECT = {
  0: "Revision",
  1: "Polity & Governance",
  2: "Economy",
  3: "History",
  4: "Science & Technology",
  5: "International Relations",
  6: "Geography",
};

// The phase boundaries, derived from the fortnight plan, used for milestones.
const WORKFLOW_MILESTONES = [
  { label: "Integration phase", date: "2026-11-03", note: "Pass-2 depth + cross-linking" },
  { label: "Prelims Mode", date: "2027-01-26", note: "MCQ intensity + full mocks" },
  { label: "Prelims exam", date: "2027-05-24", note: "UPSC CSE Prelims" },
];

function workflowFmt(value) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function workflowDaysUntil(isoDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(`${isoDate}T00:00:00`) - today) / 86400000);
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
  const fnEnd = current ? current[2] : "";
  return { today, days, phase, fortnight, fnDates, focus, next, planPercent, fnEnd };
}

function WorkflowMeter({ label, actual, target, hint }) {
  const has = target > 0;
  const pct = has ? Math.min(100, Math.round((actual / target) * 100)) : 0;
  const done = has && actual >= target;
  return (
    <div className={`workflow-meter${done ? " done" : ""}`}>
      <div className="workflow-meter-head">
        <span>{label}</span>
        <strong>{has ? `${actual} / ${target}` : "—"}</strong>
      </div>
      <div className="workflow-meter-track"><div className="workflow-meter-fill" style={{ width: `${has ? Math.max(pct, actual > 0 ? 4 : 0) : 0}%` }} /></div>
      <small>{has ? (done ? "Target met — nice." : `${target - actual} to go · ${hint}`) : `Not a ${label.toLowerCase()} phase`}</small>
    </div>
  );
}

function StudyWorkflowDashboard({ go, progress, review, onStartReview }) {
  const context = getWorkflowContext();
  const ds = window.UPSC;
  const todayIso = workflowIsoToday();
  const history = progress?.history || [];
  const manual = progress?.manualCompletions || {};
  const weekStartIso = workflowWeekStart().toISOString().slice(0, 10);

  // ---- This week, measured from real activity ----
  const weekAttempts = history.filter((item) => String(item.isoDate || "") >= weekStartIso);
  const weekQuestions = weekAttempts.reduce((sum, item) => sum + (Number(item.attempted) || 0), 0);
  const weekCorrect = weekAttempts.reduce((sum, item) => sum + (Number(item.correct) || 0), 0);
  const weekAccuracy = Math.round((weekCorrect / (weekQuestions || 1)) * 100);
  const weekMocks = weekAttempts.filter((item) => {
    const set = ds.getQuestionSetById(item.questionSetId);
    return set && WORKFLOW_MOCK_TYPES.has(set.sourceType);
  }).length;
  const weekAnswers = Object.entries(manual).filter(([id, rec]) => {
    if (String(rec?.isoDate || "") < weekStartIso) return false;
    if (id.startsWith("mainsq::")) return true; // a daily mains prompt written
    const note = ds.noteDocuments.find((n) => n.id === id);
    return note && WORKFLOW_ANSWER_CADENCES.has(note.cadence);
  }).length;
  const activeDays = new Set([
    ...weekAttempts.map((item) => item.isoDate).filter(Boolean),
    ...Object.values(manual).map((rec) => rec?.isoDate).filter((iso) => iso && iso >= weekStartIso),
  ]).size;
  const targets = WORKFLOW_TARGETS[context.phase] || WORKFLOW_TARGETS.Foundation;

  // ---- Backlog + queue ----
  const missed = window.UPSC_PROGRESS.getMissedSessions(progress, todayIso, ds.questionSets, ds.noteDocuments);
  const attemptedIds = new Set(history.map((item) => item.questionSetId).filter(Boolean));
  const latestDailySet = ds.dailyQuiz?.questionSetId ? ds.getQuestionSetById(ds.dailyQuiz.questionSetId) : null;
  const latestRcSet = workflowLatestByDate(ds.getQuestionSetsBySource("rc"), "isoDate", todayIso);
  const latestMains = workflowLatestByDate(ds.noteDocuments.filter((doc) => doc.cadence === "mains"), "date", todayIso);
  const latestEditorial = workflowLatestByDate(ds.noteDocuments.filter((doc) => doc.cadence === "editorials"), "date", todayIso);
  const latestSunday = workflowLatestByDate(ds.noteDocuments.filter((doc) => doc.cadence === "sunday"), "date", todayIso);
  const dailyDone = Boolean(progress?.dailyCompletions?.[latestDailySet?.isoDate]);

  // ---- Plan position + milestones ----
  const nextMilestone = WORKFLOW_MILESTONES.map((m) => ({ ...m, days: workflowDaysUntil(m.date) })).filter((m) => m.days >= 0);
  const fnEndIso = context.fnEnd || "";
  const daysLeftInFn = fnEndIso ? Math.max(0, workflowDaysUntil(fnEndIso)) : null;
  const weeksToPrelims = Math.max(0, Math.round(context.days / 7));

  function openNote(note) {
    if (!note) return;
    go("home");
    setTimeout(() => window.dispatchEvent(new CustomEvent("pariksha:open-note", { detail: { id: note.id } })), 80);
  }

  // ---- Today's plan, generated from live content + progress ----
  // The focus subject is the learner's real weakest area once there's data,
  // otherwise a weekday rotation. Everything below auto-detects and updates.
  const dueCount = review?.due || 0;
  const rcDone = latestRcSet ? attemptedIds.has(latestRcSet.id) : false;
  const mainsDone = latestMains ? Boolean(manual[latestMains.id]) : false;
  const latestBrief = workflowLatestByDate(ds.noteDocuments.filter((doc) => doc.cadence === "daily"), "date", todayIso);
  const focusSubject = review?.weakest?.[0]?.subject || WORKFLOW_DOW_SUBJECT[new Date().getDay()] || "Revision";

  const todayPlan = [
    latestDailySet && {
      key: "daily", icon: "bolt", kicker: "Current affairs", title: latestDailySet.label,
      meta: `${latestDailySet.questionCount || 0} questions · ${latestDailySet.durationMinutes || 10} min`,
      done: dailyDone, cta: "Start", action: () => go("test", { setId: latestDailySet.id }),
    },
    dueCount > 0 && {
      key: "revise", icon: "rotate", kicker: "Spaced revision", title: `Revise ${dueCount} due question${dueCount === 1 ? "" : "s"}`,
      meta: "Weakest questions resurface first", done: false, cta: "Revise", action: () => (onStartReview ? onStartReview() : go("catchup")),
    },
    missed.length > 0 && {
      key: "catchup", icon: "clock", kicker: "Backlog", title: `Clear ${missed.length} missed item${missed.length === 1 ? "" : "s"}`,
      meta: "Quizzes, mocks & answer-writing you skipped", done: false, cta: "Open", action: () => go("catchup"),
    },
    latestRcSet && {
      key: "rc", icon: "target", kicker: "CSAT insurance", title: latestRcSet.label,
      meta: `${latestRcSet.questionCount || 0} questions · ${latestRcSet.durationMinutes || 8} min`,
      done: rcDone, cta: "Start", action: () => go("test", { setId: latestRcSet.id }),
    },
    latestBrief && {
      key: "brief", icon: "book", kicker: "Read", title: "Today's current-affairs briefing",
      meta: latestBrief.shortTitle || workflowFmt(latestBrief.date), done: null, cta: "Open", action: () => openNote(latestBrief),
    },
    targets.mains > 0 && latestMains && {
      key: "mains", icon: "fileText", kicker: "Answer writing", title: "GS Mains answer practice",
      meta: `${latestMains.shortTitle || workflowFmt(latestMains.date)}${mainsDone ? "" : " · mark done in Catch-up"}`,
      done: mainsDone, cta: "Open", action: () => openNote(latestMains),
    },
    {
      key: "focus", icon: "spark", kicker: "Focus area", title: `Reinforce ${focusSubject}`,
      meta: review?.weakest?.[0] ? "Your weakest subject right now" : "Today's rotation — build the habit",
      done: null, cta: "Revise", action: () => go("labs", { focusSubject }),
    },
  ].filter(Boolean);

  const pendingCount = todayPlan.filter((t) => t.done === false).length;

  const readingStack = [
    latestSunday && { key: "sunday", label: "Week plan", title: latestSunday.shortTitle || workflowFmt(latestSunday.date), action: () => openNote(latestSunday) },
    latestEditorial && { key: "editorial", label: "Editorials", title: latestEditorial.shortTitle || workflowFmt(latestEditorial.date), action: () => openNote(latestEditorial) },
    latestMains && { key: "mains-read", label: "Mains", title: latestMains.shortTitle || workflowFmt(latestMains.date), action: () => openNote(latestMains) },
  ].filter(Boolean);

  return (
    <section className="workflow workflow-v2">
      <div className="workflow-title">
        <div>
          <span className="eyebrow small"><span className="eyebrow-line" /> Smart plan</span>
          <h2>Your run to Prelims.</h2>
          <p>Where you are in the plan, what this week’s targets are, and how far along you already are — measured from your saved attempts and completions.</p>
        </div>
        <a className="link-btn" href="upsc_dashboard.html" target="_blank" rel="noreferrer">Standalone view <Icon name="arrowR" size={14} /></a>
      </div>

      {/* Hero: countdown + plan position bar */}
      <article className="workflow-hero-card workflow-hero-wide">
        <div className="workflow-hero-main">
          <span className="workflow-summary-label">{context.phase} · {context.fortnight}{daysLeftInFn != null ? ` · ${daysLeftInFn}d left in block` : ""}</span>
          <h3>{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</h3>
          <p>{context.focus ? `Roadmap this block: ${context.focus}` : `Next: ${context.next}`}</p>
          <div className="workflow-plan-bar" role="img" aria-label={`Plan ${context.planPercent}% complete`}>
            <div className="workflow-plan-bar-fill" style={{ width: `${context.planPercent}%` }} />
            <span className="workflow-plan-bar-label">{context.planPercent}% of plan · ~{weeksToPrelims} weeks left</span>
          </div>
        </div>
        <div className="workflow-countdown">
          <strong>{context.days}</strong>
          <span>days to Prelims</span>
        </div>
      </article>

      {/* Today's detailed study blocks, parsed live from the Sunday Sweep. */}
      {window.WeeklyPlanCard ? <window.WeeklyPlanCard /> : null}

      {/* This week vs plan targets — the live part */}
      <article className="workflow-card workflow-week-card">
        <div className="workflow-card-head">
          <span>This week vs your {context.phase} targets</span>
          <strong>{activeDays}/7 active days</strong>
        </div>
        <div className="workflow-meters">
          <WorkflowMeter label="MCQs" actual={weekQuestions} target={targets.mcqs} hint="attempt a quiz or mock" />
          <WorkflowMeter label="Mains answers" actual={weekAnswers} target={targets.mains} hint="mark a mains/ethics answer done" />
          <WorkflowMeter label="Mocks" actual={weekMocks} target={targets.mocks} hint="do a sectional or full mock" />
        </div>
        <div className="workflow-week-foot">
          <div><span>Attempts</span><strong>{weekAttempts.length}</strong></div>
          <div><span>Questions</span><strong>{weekQuestions}</strong></div>
          <div><span>Accuracy</span><strong>{weekAttempts.length ? `${weekAccuracy}%` : "--"}</strong></div>
          <div className={dailyDone ? "done" : ""}><span>Today's daily</span><strong>{dailyDone ? "Done" : "Pending"}</strong></div>
        </div>
      </article>

      <div className="workflow-plan-grid">
        <article className="workflow-card workflow-queue-card">
          <div className="workflow-card-head">
            <span>Quick actions in the app</span>
            <strong>{pendingCount ? `${pendingCount} to do` : "all clear"}</strong>
          </div>
          <div className="workflow-queue">
            {todayPlan.map((item) => (
              <button key={item.key} className={`workflow-queue-item ${item.done === true ? "done" : item.done === null ? "read" : "next"}`} onClick={item.action}>
                <span className="workflow-queue-icon"><Icon name={item.done === true ? "check" : item.icon} size={16} /></span>
                <span className="workflow-queue-copy">
                  <em>{item.kicker}</em>
                  <strong>{item.title}</strong>
                  <small>{item.meta}</small>
                </span>
                <span className="workflow-status">{item.done === true ? "Done" : item.cta}</span>
              </button>
            ))}
          </div>
          <p className="workflow-card-note">One-tap launches into the app, from today's materials, your due revisions and your weakest topics.</p>
        </article>

        <article className="workflow-card workflow-milestone-card">
          <div className="workflow-card-head"><span>Milestones ahead</span></div>
          <div className="workflow-milestones">
            {nextMilestone.map((m) => (
              <div key={m.label} className="workflow-milestone">
                <div className="workflow-milestone-days"><strong>{m.days}</strong><span>days</span></div>
                <div className="workflow-milestone-copy">
                  <strong>{m.label}</strong>
                  <small>{workflowFmt(m.date)} · {m.note}</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>

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

      <article className="workflow-card workflow-routing">
        <span>How this page works</span>
        <p>"What to study today" is read straight from your latest Sunday Sweep and highlights the current day. The countdown and phase come from your roadmap; the weekly meters and quick actions fill from your real attempts, due revisions and the answers you mark done.</p>
      </article>
    </section>
  );
}

Object.assign(window, { StudyWorkflowDashboard });
