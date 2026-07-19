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
  { id: "atlas", label: "News Atlas", icon: "map" },
  { id: "practice", label: "Practice", icon: "play" },
  { id: "workflow", label: "Plan", icon: "target" },
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

function calculateAttemptSummary(questions, answers, questionSet) {
  let correct = 0, wrong = 0, skipped = 0;
  let score = 0, max = 0;
  const subjectBreakdown = {};
  questions.forEach((q) => {
    const selected = answers[q.n];
    const accepted = Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length ? q.acceptedAnswers : [q.answer].filter(Boolean);
    const marking = window.UPSC.getQuestionMarking(questionSet, q);
    const subject = q.subject || "General Studies";
    subjectBreakdown[subject] = subjectBreakdown[subject] || { correct: 0, attempted: 0, total: 0 };
    subjectBreakdown[subject].total++;
    max += marking.correct;
    if (!selected) {
      skipped++;
      return;
    }
    subjectBreakdown[subject].attempted++;
    if (accepted.includes(selected)) {
      correct++;
      subjectBreakdown[subject].correct++;
      score += marking.correct;
    } else {
      wrong++;
      score += marking.wrong;
    }
  });
  const attempted = correct + wrong;
  const accuracy = Math.round((correct / (attempted || 1)) * 100);
  return { correct, wrong, skipped, attempted, score: Math.round(score * 100) / 100, max: Math.round(max * 100) / 100, accuracy, subjectBreakdown };
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

function TopNav({ screen, go, summary, onSearch }) {
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
          <button className="nav-search" onClick={onSearch} aria-label="Search">
            <Icon name="search" size={15} /> <span>Search</span> <kbd>⌘K</kbd>
          </button>
          <span className="streak-chip"><Icon name="flame" size={15} /> {summary.streak}</span>
          <button className="btn btn-green sm" onClick={() => go("test", { setId: ds.defaultQuestionSetId })}><Icon name="bolt" size={15} /> Daily quiz</button>
        </div>
      </div>
    </header>
  );
}

function searchDateLabel(iso) {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

function searchSourceLabel(sourceType) {
  const map = {
    pyq: "Previous-year paper", ai: "AI set", csr: "Mock series", csat: "CSAT",
    daily: "Daily quiz", rc: "Daily RC", "weekly-news": "Places quiz",
    "weekly-quiz": "Weekly quiz", pib: "PIB quiz", sectional: "Sectional",
  };
  return map[sourceType] || "Question set";
}

function searchCadenceLabel(cadence) {
  const map = {
    daily: "Daily CA", pib: "Daily PIB", rc: "Daily RC", "daily-mains": "Daily Mains",
    editorials: "Editorials", schemes: "Schemes", sunday: "Sunday Sweep", physics: "Physics",
    "weekly-news": "Weekly News", sectional: "Sectional", ethics: "Ethics", monthly: "Monthly",
    anki: "Anki", fodder: "Fodder", strategy: "Strategy",
  };
  return map[cadence] || "Note";
}

function buildSearchResults(ds, query) {
  const notes = ds.noteDocuments
    .filter((doc) => {
      const hay = `${doc.title} ${doc.shortTitle || ""} ${searchCadenceLabel(doc.cadence)} ${doc.date || ""}`.toLowerCase();
      return hay.includes(query);
    })
    .slice(0, 8)
    .map((doc) => ({
      kind: "note", id: doc.id, cadence: doc.cadence,
      title: doc.title,
      sub: doc.date ? searchDateLabel(doc.date) : (doc.shortTitle || ""),
      badge: searchCadenceLabel(doc.cadence),
    }));
  const sets = ds.questionSets
    .filter((set) => {
      const hay = `${set.label || ""} ${searchSourceLabel(set.sourceType)} ${set.year || ""} ${set.isoDate || ""} ${set.shortLabel || ""}`.toLowerCase();
      return hay.includes(query);
    })
    .slice(0, 8)
    .map((set) => ({
      kind: "test", id: set.id,
      title: set.label || set.shortLabel || "Question set",
      sub: `${set.questionCount || 0} questions${set.isoDate ? ` · ${searchDateLabel(set.isoDate)}` : set.year ? ` · ${set.year}` : ""}`,
      badge: searchSourceLabel(set.sourceType),
    }));
  return [...notes, ...sets];
}

function GlobalSearch({ open, onClose, go }) {
  const ds = window.UPSC;
  const [query, setQuery] = useRootState("");
  const inputRef = React.useRef(null);

  useRootEffect(() => {
    if (open) {
      setQuery("");
      const id = window.setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open]);

  useRootEffect(() => {
    function onKey(event) { if (event.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const trimmed = query.trim().toLowerCase();
  const results = trimmed.length >= 1 ? buildSearchResults(ds, trimmed) : [];

  function openResult(result) {
    onClose();
    if (result.kind === "note") {
      go("home");
      window.setTimeout(() => window.dispatchEvent(new CustomEvent("pariksha:open-note", { detail: { id: result.id, cadence: result.cadence } })), 70);
    } else {
      go("test", { setId: result.id });
    }
  }

  return (
    <div className="search-layer" onMouseDown={onClose}>
      <div className="search-box" role="dialog" aria-label="Search" onMouseDown={(event) => event.stopPropagation()}>
        <div className="search-input-row">
          <Icon name="search" size={18} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search briefs, drills, papers & quizzes…"
            aria-label="Search query" />
          <button className="search-esc" onClick={onClose}>Esc</button>
        </div>
        <div className="search-results">
          {trimmed.length < 1 ? (
            <p className="search-hint">Type to search across notes and the question bank.</p>
          ) : results.length ? (
            results.map((result) => (
              <button key={`${result.kind}-${result.id}`} className="search-result" onClick={() => openResult(result)}>
                <span className="search-result-icon"><Icon name={result.kind === "note" ? "book" : "play"} size={16} /></span>
                <span className="search-result-copy">
                  <strong>{result.title}</strong>
                  <small>{result.sub}</small>
                </span>
                <span className="search-result-badge">{result.badge}</span>
              </button>
            ))
          ) : (
            <p className="search-empty">No matches for “{query.trim()}”.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [contentVersion, setContentVersion] = useRootState(0);
  const ds = window.UPSC;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useRootState("home");
  const [testSession, setTestSession] = useRootState({
    setId: ds.defaultPracticeSetId,
    returnTo: "home",
    timed: true,
  });
  const [lastResult, setLastResult] = useRootState(null);
  const [progress, setProgress] = useRootState(loadProgress);
  const [searchOpen, setSearchOpen] = useRootState(false);
  const summary = getProgressSummary(progress);
  void contentVersion;

  useRootEffect(() => {
    function onKey(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useRootEffect(() => {
    const unsubscribe = window.UPSC.subscribeContent?.(() => setContentVersion((version) => version + 1));
    // The initial module-load manifest refresh can resolve before this effect
    // subscribes, so its notify reaches no listeners and the UI keeps stale
    // fallback data. Re-refresh now that we're subscribed to guarantee the
    // freshest content triggers a re-render.
    window.UPSC.refreshContentManifest?.();
    return unsubscribe;
  }, []);

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
    const attemptSummary = calculateAttemptSummary(result.questions, result.answers, result.questionSet);
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
      {!isTest && <TopNav screen={screen} go={go} summary={summary} onSearch={() => setSearchOpen(true)} />}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} go={go} />
      <div key={screen} className="screen-fade">
        {screen === "home" && <Home go={go} progress={progress} summary={summary} />}
        {screen === "atlas" && <NewsAtlas />}
        {screen === "practice" && <PracticeScreen go={go} />}
        {screen === "test" && <TestScreen go={go} session={testSession} onSubmit={finishTest} />}
        {screen === "result" && <Results go={go} result={lastResult} />}
        {screen === "review" && <Review go={go} result={lastResult} />}
        {screen === "workflow" && <StudyWorkflowDashboard go={go} progress={progress} />}
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
          {[["home", "Home"], ["atlas", "News Atlas"], ["practice", "Practice"], ["workflow", "Plan"], ["test", "Test"], ["result", "Results"], ["review", "Review"], ["dashboard", "Progress"]].map(([k, l]) => (
            <button key={k} className={`jbtn${screen === k ? " on" : ""}`} onClick={() => go(k, k === "test" ? { setId: ds.defaultPracticeSetId } : {})}>{l}</button>
          ))}
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
