// Root app — routing, top nav, tweaks
const { useState: useRootState, useEffect: useRootEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "vibe": "academic",
  "primary": "#1E4D3A",
  "accent": "#CB7A2E",
  "qFont": "serif",
  "density": "regular"
}/*EDITMODE-END*/;

const NAV = [
  { id: "home", label: "Home", icon: "home" },
  { id: "test", label: "Practice", icon: "play" },
  { id: "dashboard", label: "Progress", icon: "chart" },
];

const PROGRESS_STORAGE_KEY = "parikshaProgressV2";

function createFreshProgress(resetAt = Date.now()) {
  return {
    version: 2,
    resetAt,
    history: [],
    dailyCompletions: {},
  };
}

function loadProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) || "");
    if (parsed?.version === 2 && Array.isArray(parsed.history) && parsed.dailyCompletions) return parsed;
  } catch (error) {
    // Ignore malformed local progress and start with a clean local model.
  }
  return createFreshProgress();
}

function saveProgress(progress) {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

function getIsoDate(value = Date.now()) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatShortDate(value = Date.now()) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(new Date(value));
}

function calculateAttemptSummary(questions, answers) {
  let correct = 0, wrong = 0, skipped = 0;
  const subjectBreakdown = {};
  questions.forEach((q) => {
    const selected = answers[q.n];
    const accepted = Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length ? q.acceptedAnswers : [q.answer].filter(Boolean);
    const subject = q.subject || "General Studies";
    subjectBreakdown[subject] = subjectBreakdown[subject] || { correct: 0, attempted: 0, total: 0 };
    subjectBreakdown[subject].total++;
    if (!selected) {
      skipped++;
      return;
    }
    subjectBreakdown[subject].attempted++;
    if (accepted.includes(selected)) {
      correct++;
      subjectBreakdown[subject].correct++;
    } else {
      wrong++;
    }
  });
  const attempted = correct + wrong;
  const score = Math.round((correct * 2 - wrong * 0.66) * 100) / 100;
  const max = questions.length * 2;
  const accuracy = Math.round((correct / (attempted || 1)) * 100);
  return { correct, wrong, skipped, attempted, score, max, accuracy, subjectBreakdown };
}

function getProgressSummary(progress) {
  const history = progress?.history || [];
  const totals = history.reduce((acc, item) => {
    acc.correct += Number(item.correct) || 0;
    acc.attempted += Number(item.attempted) || 0;
    acc.questions += Number(item.attempted) || 0;
    acc.score = Math.max(acc.score, Number(item.score) || 0);
    return acc;
  }, { correct: 0, attempted: 0, questions: 0, score: 0 });
  return {
    attempts: history.length,
    questionsSolved: totals.questions,
    averageAccuracy: Math.round((totals.correct / (totals.attempted || 1)) * 100),
    bestScore: Math.round(totals.score * 100) / 100,
    streak: calculateDailyStreak(progress?.dailyCompletions || {}),
    resetAt: progress?.resetAt || null,
  };
}

function calculateDailyStreak(completions) {
  let streak = 0;
  const dailySets = window.UPSC.getQuestionSetsBySource("daily");
  const availableDates = dailySets.map((set) => set.isoDate).filter(Boolean).sort();
  const anchorDate = availableDates.includes(window.UPSC.todayIso)
    ? window.UPSC.todayIso
    : availableDates[availableDates.length - 1] || window.UPSC.todayIso;
  const cursor = new Date(`${anchorDate}T00:00:00`);
  while (completions[getIsoDate(cursor)]) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function TopNav({ screen, go, summary }) {
  const ds = window.UPSC;
  return (
    <header className="topnav">
      <div className="topnav-inner">
        <button className="nav-brand" onClick={() => go("home")}><Wordmark compact /></button>
        <nav className="nav-links">
          {NAV.map((n) => (
            <button key={n.id} className={`nav-link${screen === n.id ? " active" : ""}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} size={16} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="nav-right">
          <span className="streak-chip"><Icon name="flame" size={15} /> {summary.streak}</span>
          <button className="btn btn-green sm" onClick={() => go("test", { setId: ds.defaultQuestionSetId })}><Icon name="bolt" size={15} /> Daily quiz</button>
        </div>
      </div>
    </header>
  );
}

function App() {
  const ds = window.UPSC;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useRootState("home");
  const [testSession, setTestSession] = useRootState({
    setId: ds.defaultPracticeSetId,
    returnTo: "home",
    timed: true,
  });
  const [lastResult, setLastResult] = useRootState({
    setId: ds.defaultQuestionSetId,
    questionSet: ds.getQuestionSetById(ds.defaultQuestionSetId),
    questions: ds.questions,
    answers: ds.demoAttempt,
    submittedAt: null,
  });
  const [progress, setProgress] = useRootState(loadProgress);
  const summary = getProgressSummary(progress);

  useRootEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--green", t.primary);
    r.style.setProperty("--saffron", t.accent);
    document.body.dataset.vibe = t.vibe;
    document.body.dataset.qfont = t.qFont;
    document.body.dataset.density = t.density;
  }, [t]);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function go(s, options = {}) {
    if (s === "test") {
      setTestSession({
        setId: String(options.setId || ds.defaultPracticeSetId),
        returnTo: options.returnTo || (screen === "test" ? testSession.returnTo : screen) || "home",
        timed: options.timed !== false,
      });
    }
    setScreen(s);
    scrollTop();
  }

  function finishTest(result) {
    const submittedAt = Date.now();
    const attemptSummary = calculateAttemptSummary(result.questions, result.answers);
    const entry = {
      id: `${result.questionSet.id}-${submittedAt}`,
      date: formatShortDate(submittedAt),
      isoDate: getIsoDate(submittedAt),
      label: result.questionSet.label,
      questionSetId: result.questionSet.id,
      sourceType: result.questionSet.sourceType,
      score: attemptSummary.score,
      max: attemptSummary.max,
      accuracy: attemptSummary.accuracy,
      attempted: attemptSummary.attempted,
      correct: attemptSummary.correct,
      wrong: attemptSummary.wrong,
      skipped: attemptSummary.skipped,
      subjectBreakdown: attemptSummary.subjectBreakdown,
    };
    setProgress((current) => {
      const next = {
        ...current,
        history: [...(current.history || []), entry],
        dailyCompletions: { ...(current.dailyCompletions || {}) },
      };
      if (result.questionSet.sourceType === "daily" && result.questionSet.isoDate) {
        next.dailyCompletions[result.questionSet.isoDate] = {
          submittedAt,
          questionSetId: result.questionSet.id,
          score: attemptSummary.score,
          max: attemptSummary.max,
        };
      }
      saveProgress(next);
      return next;
    });
    setLastResult({
      ...result,
      attemptSummary,
      submittedAt,
    });
    setScreen("result");
    scrollTop();
  }

  function resetProgress() {
    const confirmed = window.confirm("Reset all local stats and daily quiz completion marks? This starts your progress afresh from today.");
    if (!confirmed) return;
    const fresh = createFreshProgress();
    saveProgress(fresh);
    setProgress(fresh);
  }

  const isTest = screen === "test";

  return (
    <div className="root">
      {!isTest && <TopNav screen={screen} go={go} summary={summary} />}
      <div key={screen} className="screen-fade">
        {screen === "home" && <Home go={go} progress={progress} summary={summary} />}
        {screen === "test" && <TestScreen go={go} session={testSession} onSubmit={finishTest} />}
        {screen === "result" && <Results go={go} result={lastResult} />}
        {screen === "review" && <Review go={go} result={lastResult} />}
        {screen === "dashboard" && <Dashboard go={go} progress={progress} summary={summary} onResetProgress={resetProgress} />}
      </div>

      {!isTest && (
        <footer className="site-foot">
          <Wordmark compact />
          <span>Free &amp; open practice bank · Built for UPSC aspirants · Scores stay on your device</span>
        </footer>
      )}

      <TweaksPanel>
        <TweakSection label="Vibe" />
        <TweakRadio label="Direction" value={t.vibe}
          options={["academic", "edtech", "minimal"]}
          onChange={(v) => setTweak("vibe", v)} />
        <TweakSection label="Colour" />
        <TweakColor label="Primary" value={t.primary}
          options={["#1E4D3A", "#1B4965", "#3A4A2F", "#2A2A33"]}
          onChange={(v) => setTweak("primary", v)} />
        <TweakColor label="Accent" value={t.accent}
          options={["#CB7A2E", "#C25B3E", "#B59020", "#7A5BA6"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Reading" />
        <TweakRadio label="Question type" value={t.qFont}
          options={["serif", "sans"]}
          onChange={(v) => setTweak("qFont", v)} />
        <TweakRadio label="Density" value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)} />
        <TweakSection label="Jump to screen" />
        <div className="tweak-jump">
          {[["home", "Home"], ["test", "Test"], ["result", "Results"], ["review", "Review"], ["dashboard", "Progress"]].map(([k, l]) => (
            <button key={k} className={`jbtn${screen === k ? " on" : ""}`} onClick={() => go(k, k === "test" ? { setId: ds.defaultPracticeSetId } : {})}>{l}</button>
          ))}
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
