// Root app — routing, top nav, tweaks
const { useState: useRootState, useEffect: useRootEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "vibe": "academic",
  "primary": "#1E4D3A",
  "accent": "#CB7A2E",
  "qFont": "serif",
  "density": "regular"
}/*EDITMODE-END*/;

// Primary tabs. "Progress" opens a hub with Plan + Stats sub-tabs (screens
// "workflow" and "dashboard"), so both live under one nav entry.
const NAV = [
  { id: "home", label: "Home", icon: "home" },
  { id: "practice", label: "Practice", icon: "play" },
  { id: "library", label: "Library", icon: "book" },
  { id: "catchup", label: "Catch-up", icon: "clock" },
  { id: "workflow", label: "Progress", icon: "chart", match: ["workflow", "dashboard"] },
];

// Secondary tools, tucked into a "More" dropdown to keep the bar uncluttered.
const NAV_MORE = [
  { id: "labs", label: "Study Labs", icon: "spark" },
  { id: "atlas", label: "News Atlas", icon: "map" },
];

// The Progress hub sub-tabs.
const PROGRESS_TABS = [
  { id: "workflow", label: "Plan" },
  { id: "dashboard", label: "Stats" },
];

// Progress model, review scheduling and storage live in app/progress.js so the
// same code can be unit-tested outside the browser.
const {
  createFreshProgress,
  normalizeProgress,
  compactProgress,
  recordAttemptQuestions,
  getDueQuestions,
  getReviewSummary,
  getMissedSessions,
  setSessionDismissed,
  setItemDone,
  loadProgress,
  saveProgress,
  getIsoDate,
  formatShortDate,
  calculateAttemptSummary,
  getProgressSummary,
  recordLabProgress,
} = window.UPSC_PROGRESS;

function TopNav({ screen, go, summary, catchUpCount, onSearch }) {
  const ds = window.UPSC;
  const [moreOpen, setMoreOpen] = React.useState(false);
  const navMatches = (n) => (n.match || [n.id]).includes(screen);
  const moreActive = NAV_MORE.some((n) => n.id === screen);
  const openMore = (id) => { setMoreOpen(false); go(id); };
  return (
    <header className="topnav">
      <div className="topnav-inner">
        <button className="nav-brand" onClick={() => go("home")}><Wordmark compact /></button>
        <nav className="nav-links">
          {NAV.map((n) => (
            <button key={n.id} className={`nav-link${navMatches(n) ? " active" : ""}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} size={16} /> {n.label}
              {n.id === "catchup" && catchUpCount > 0 && <span className="nav-badge">{catchUpCount > 99 ? "99+" : catchUpCount}</span>}
            </button>
          ))}
          <div className="nav-more">
            <button className={`nav-link${moreActive ? " active" : ""}`} onClick={() => setMoreOpen((v) => !v)} aria-haspopup="true" aria-expanded={moreOpen}>
              <Icon name="menu" size={16} /> More
            </button>
            {moreOpen && (
              <>
                <div className="nav-more-overlay" onClick={() => setMoreOpen(false)} />
                <div className="nav-more-menu" role="menu">
                  {NAV_MORE.map((n) => (
                    <button key={n.id} role="menuitem" className={`nav-more-item${screen === n.id ? " active" : ""}`} onClick={() => openMore(n.id)}>
                      <Icon name={n.icon} size={16} /> {n.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {/* On mobile the bar scrolls, so the "More" items sit inline instead
              of in a dropdown (which the scroll container would clip). */}
          {NAV_MORE.map((n) => (
            <button key={n.id} className={`nav-link nav-inline-more${screen === n.id ? " active" : ""}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} size={16} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="nav-right">
          <button className="nav-search" onClick={onSearch} aria-label="Search">
            <Icon name="search" size={15} /> <span>Search</span> <kbd>⌘K</kbd>
          </button>
          <span className="streak-chip"><Icon name="flame" size={15} /> {summary.streak}</span>

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

function searchCadenceLabel(cadence) { return window.UPSC_CONTENT.notes[cadence]?.label || "Note"; }

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
  const [fullText, setFullText] = useRootState({ results: [], hasMore: false, loading: false, all: false });
  const [snippets, setSnippets] = useRootState({});
  const inputRef = React.useRef(null);

  useRootEffect(() => {
    if (open) {
      setQuery("");
      setFullText({ results: [], hasMore: false, loading: false, all: false });
      setSnippets({});
      const id = window.setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
      return () => window.clearTimeout(id);
    }
    return undefined;
  }, [open]);

  // Full-text lookup is debounced and runs against the lazily fetched index, so
  // the title/metadata matches above stay instant while this catches up.
  const trimmedQuery = query.trim();
  const searchAll = fullText.all;
  useRootEffect(() => {
    if (!open || trimmedQuery.length < 3 || !window.UPSC_SEARCH) {
      setFullText((current) => ({ ...current, results: [], hasMore: false, loading: false }));
      return undefined;
    }
    let cancelled = false;
    setFullText((current) => ({ ...current, loading: true }));
    const timer = window.setTimeout(() => {
      window.UPSC_SEARCH.search(trimmedQuery, { all: searchAll })
        .then((outcome) => {
          if (cancelled) return;
          setFullText({ results: outcome.results, hasMore: outcome.hasMore, loading: false, all: searchAll });
          for (const result of outcome.results.slice(0, 5)) {
            window.UPSC_SEARCH.snippetFor(result).then((text) => {
              if (!cancelled && text) setSnippets((current) => ({ ...current, [result.id]: text }));
            });
          }
        })
        .catch(() => { if (!cancelled) setFullText((current) => ({ ...current, loading: false })); });
    }, 160);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [open, trimmedQuery, searchAll]);

  useRootEffect(() => {
    function onKey(event) { if (event.key === "Escape") onClose(); }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  const trimmed = query.trim().toLowerCase();
  const results = trimmed.length >= 1 ? buildSearchResults(ds, trimmed) : [];
  // Notes already listed by the title search do not need a second row.
  const titleMatchIds = new Set(results.filter((item) => item.kind === "note").map((item) => item.id));
  const fullTextOnly = fullText.results.filter((item) => !titleMatchIds.has(item.id)).slice(0, 8);

  function openResult(result) {
    onClose();
    if (result.kind === "note") {
      go("library", { noteId: result.id });
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
            <p className="search-hint">Type to search titles, the question bank, and the full text of every note.</p>
          ) : (
            <>
              {results.length > 0 && (
                <>
                  <p className="search-group-label">Titles &amp; question sets</p>
                  {results.map((result) => (
                    <button key={`${result.kind}-${result.id}`} className="search-result" onClick={() => openResult(result)}>
                      <span className="search-result-icon"><Icon name={result.kind === "note" ? "book" : "play"} size={16} /></span>
                      <span className="search-result-copy">
                        <strong>{result.title}</strong>
                        <small>{result.sub}</small>
                      </span>
                      <span className="search-result-badge">{result.badge}</span>
                    </button>
                  ))}
                </>
              )}

              {fullTextOnly.length > 0 && (
                <>
                  <p className="search-group-label">Inside notes</p>
                  {fullTextOnly.map((result) => (
                    <button key={`ft-${result.id}`} className="search-result search-result-full" onClick={() => openResult({ kind: "note", id: result.id, cadence: result.cadence })}>
                      <span className="search-result-icon"><Icon name="search" size={16} /></span>
                      <span className="search-result-copy">
                        <strong>{result.title}</strong>
                        <small>{snippets[result.id] || (result.date ? searchDateLabel(result.date) : "")}</small>
                      </span>
                      <span className="search-result-badge">{searchCadenceLabel(result.cadence)}</span>
                    </button>
                  ))}
                </>
              )}

              {fullText.loading && <p className="search-hint">Searching note text…</p>}

              {fullText.hasMore && !fullText.loading && (
                <button className="search-more" onClick={() => setFullText((current) => ({ ...current, all: true }))}>
                  Search older notes too
                </button>
              )}

              {!results.length && !fullTextOnly.length && !fullText.loading && (
                <p className="search-empty">No matches for “{query.trim()}”.</p>
              )}
            </>
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
  const [screen, setScreen] = useRootState(() => window.location.hash.startsWith("#library") ? "library" : "home");
  const [testSession, setTestSession] = useRootState({
    setId: ds.defaultPracticeSetId,
    returnTo: "home",
    timed: true,
  });
  const [libraryNoteId, setLibraryNoteId] = useRootState(() => new URLSearchParams(window.location.hash.split("?")[1] || "").get("note"));
  const [atlasWeekId, setAtlasWeekId] = useRootState(null);
  const [labFocus, setLabFocus] = useRootState(null);
  const [lastResult, setLastResult] = useRootState(null);
  const [progress, setProgress] = useRootState(loadProgress);
  const [searchOpen, setSearchOpen] = useRootState(false);
  const summary = getProgressSummary(progress);
  const review = getReviewSummary(progress, ds.todayIso);
  const catchUpCount = getMissedSessions(progress, ds.todayIso, ds.questionSets, ds.noteDocuments).length;
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
    // The manifest fetch starts at module load and can resolve before this
    // effect subscribes, so its notify would reach no listeners and the UI
    // would keep the stale fallback data. Joining the same (de-duplicated)
    // promise re-renders once it has landed, without a second request.
    window.UPSC.refreshContentManifest?.().then(() => setContentVersion((version) => version + 1));
    window.sweepStaleSessions?.();
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
    if (s === "library") {
      if (options.noteId) setLibraryNoteId(options.noteId);
      const id = options.noteId || libraryNoteId;
      window.history.replaceState(null, "", `#library${id ? "?note=" + encodeURIComponent(id) : ""}`);
    } else window.history.replaceState(null, "", window.location.pathname + window.location.search);
    if (s === "atlas") setAtlasWeekId(options.weekId || null);
    if (s === "test") {
      setTestSession({
        setId: String(options.setId || ds.defaultPracticeSetId),
        returnTo: options.returnTo || (screen === "test" ? testSession.returnTo : screen) || "home",
        timed: options.timed !== false,
        reviewQueue: options.reviewQueue || null,
        subjects: options.subjects || null,
        // Changing this forces the test screen to rebuild the queue even when
        // the synthetic set id is unchanged between two revision runs.
        reviewToken: options.reviewQueue ? Date.now() : null,
      });
    }
    if (s === "labs") {
      // The Focus card routes here with the learner's weakest subject so the
      // labs screen can open a relevant tool instead of a generic default.
      setLabFocus(options.focusSubject || null);
    }
    setScreen(s);
    scrollTop();
  }

  useRootEffect(() => {
    const openNote = (event) => {
      const target = ds.noteDocuments.find((doc) => doc.id === event.detail?.id) || ds.noteDocuments.find((doc) => doc.cadence === event.detail?.cadence);
      if (target) go("library", { noteId: target.id });
    };
    window.addEventListener("pariksha:open-note", openNote);
    return () => window.removeEventListener("pariksha:open-note", openNote);
  }, [screen, libraryNoteId, contentVersion]);

  function setCatchUpStart(isoDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate) || isoDate > ds.todayIso) return;
    setProgress((current) => { const next = { ...current, catchUpStartDate: isoDate }; saveProgress(next); return next; });
  }

  // Spaced repetition: pull the questions whose review date has arrived.
  const REVIEW_SESSION_MAX = 20;
  function startReviewSession() {
    const due = getDueQuestions(progress, ds.todayIso, REVIEW_SESSION_MAX);
    if (!due.length) return;
    go("test", {
      reviewQueue: due.map((entry) => ({ setId: entry.setId, n: entry.n })),
      returnTo: screen,
    });
  }

  function saveLabProgress(labId, confidence) {
    setProgress((current) => {
      const next = recordLabProgress(current, { labId, confidence }, ds.todayIso);
      saveProgress(next);
      return next;
    });
  }

  function setSessionDismissedState(setId, dismissed) {
    setProgress((current) => {
      const next = setSessionDismissed(current, setId, dismissed);
      saveProgress(next);
      return next;
    });
  }

  function setItemDoneState(itemId, done) {
    setProgress((current) => {
      const next = setItemDone(current, itemId, done, ds.todayIso);
      saveProgress(next);
      return next;
    });
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
      // Per-question outcomes drive the spaced-repetition queue.
      const withReview = recordAttemptQuestions(current, attemptSummary.questionResults, entry.isoDate);
      const next = compactProgress({
        ...withReview,
        history: [...(withReview.history || []), entry],
        dailyCompletions: { ...(withReview.dailyCompletions || {}) },
      });
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

  // Progress lives only in this browser, so an exported file is the only backup
  // there is. Restoring one has to be possible from the UI.
  function importProgress(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      let restored = null;
      try {
        restored = normalizeProgress(JSON.parse(String(reader.result)));
      } catch (error) {
        restored = null;
      }
      if (!restored) {
        window.alert("That file is not a Pariksha progress export.");
        return;
      }
      const incoming = getProgressSummary(restored).attempts;
      const existing = summary.attempts;
      const confirmed = window.confirm(
        `Replace the ${existing} attempt(s) stored in this browser with the ${incoming} attempt(s) in this file? This cannot be undone.`,
      );
      if (!confirmed) return;
      saveProgress(restored);
      setProgress(restored);
    };
    reader.readAsText(file);
  }

  const isTest = screen === "test";

  return (
    <div className="root">
      {!isTest && <TopNav screen={screen} go={go} summary={summary} catchUpCount={catchUpCount} onSearch={() => setSearchOpen(true)} />}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} go={go} />
      <div key={screen} className="screen-fade">
        {screen === "home" && <Home go={go} progress={progress} summary={summary} review={review} onStartReview={startReviewSession} />}
        {screen === "labs" && <StudyLabs go={go} progress={progress} review={review} focusSubject={labFocus} onLabProgress={saveLabProgress} />}
        {screen === "library" && <div className="page-wrap library-page"><NotesLibrary key={libraryNoteId || "library"} go={go} noteId={libraryNoteId} progress={progress} onMarkDone={setItemDoneState} /></div>}
        {screen === "atlas" && <NewsAtlas weekId={atlasWeekId} go={go} />}
        {screen === "practice" && <PracticeScreen go={go} />}
        {screen === "catchup" && <CatchUpScreen go={go} progress={progress} onStartDate={setCatchUpStart} onDismiss={(id) => setSessionDismissedState(id, true)} onRestore={(id) => setSessionDismissedState(id, false)} onMarkDone={(id) => setItemDoneState(id, true)} onUndoDone={(id) => setItemDoneState(id, false)} />}
        {screen === "test" && <TestScreen go={go} session={testSession} onSubmit={finishTest} />}
        {screen === "result" && <Results go={go} result={lastResult} />}
        {screen === "review" && <Review go={go} result={lastResult} />}
        {(screen === "workflow" || screen === "dashboard") && (
          <div className="progress-hub">
            <div className="progress-hub-tabs" role="tablist" aria-label="Progress views">
              {PROGRESS_TABS.map((tab) => (
                <button key={tab.id} role="tab" aria-selected={screen === tab.id} className={`progress-hub-tab${screen === tab.id ? " on" : ""}`} onClick={() => go(tab.id)}>{tab.label}</button>
              ))}
            </div>
            {screen === "workflow"
              ? <StudyWorkflowDashboard go={go} progress={progress} review={review} onStartReview={startReviewSession} />
              : <Dashboard go={go} progress={progress} summary={summary} review={review} onStartReview={startReviewSession} onResetProgress={resetProgress} onImportProgress={importProgress} />}
          </div>
        )}
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
          {[["home", "Home"], ["labs", "Study Labs"], ["atlas", "News Atlas"], ["practice", "Practice"], ["catchup", "Catch-up"], ["workflow", "Plan"], ["test", "Test"], ["result", "Results"], ["review", "Review"], ["dashboard", "Progress"]].map(([k, l]) => (
            <button key={k} className={`jbtn${screen === k ? " on" : ""}`} onClick={() => go(k, k === "test" ? { setId: ds.defaultPracticeSetId } : {})}>{l}</button>
          ))}
        </div>
      </TweaksPanel>
    </div>
  );
}

// The manifest is preloaded in the document head and cached across visits, so
// waiting for it costs nothing on a warm load and avoids painting the built-in
// fallback content — which is a stale snapshot — before swapping it out. The
// timeout keeps a slow or failed fetch from holding the page hostage; the app
// then boots on the fallbacks exactly as it would offline.
const MANIFEST_BOOT_TIMEOUT_MS = 2000;

function mount() {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}

Promise.race([
  window.UPSC.refreshContentManifest?.() ?? Promise.resolve(false),
  new Promise((resolve) => window.setTimeout(resolve, MANIFEST_BOOT_TIMEOUT_MS)),
]).then(mount, mount);
