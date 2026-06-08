// Test-taking screen - selected question set + guarded exit
const { useState: useTestState, useEffect: useTestEffect } = React;

function TestScreen({ go, session, onSubmit }) {
  const ds = window.UPSC;
  const initialQuestionSet = ds.getQuestionSetById(session?.setId);
  const [loadState, setLoadState] = useTestState({
    loading: true,
    error: "",
    questionSet: initialQuestionSet,
    questions: [],
  });
  const [idx, setIdx] = useTestState(0);
  const [answers, setAnswers] = useTestState({});
  const [marked, setMarked] = useTestState({});
  const [visited, setVisited] = useTestState({ 0: true });
  const [paletteOpen, setPaletteOpen] = useTestState(false);
  const [exitOpen, setExitOpen] = useTestState(false);
  const [secs, setSecs] = useTestState((initialQuestionSet?.durationMinutes || 120) * 60);

  useTestEffect(() => {
    let cancelled = false;
    const selectedId = session?.setId || ds.defaultQuestionSetId;
    const selectedSet = ds.getQuestionSetById(selectedId);
    setLoadState({ loading: true, error: "", questionSet: selectedSet, questions: [] });
    setIdx(0);
    setAnswers({});
    setMarked({});
    setVisited({ 0: true });
    setPaletteOpen(false);
    setExitOpen(false);
    setSecs((selectedSet?.durationMinutes || 120) * 60);

    ds.loadQuestionSet(selectedId)
      .then((result) => {
        if (cancelled) return;
        setLoadState({ loading: false, error: "", ...result });
        setSecs((result.questionSet?.durationMinutes || 120) * 60);
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadState({
          loading: false,
          error: error?.message || "Could not load this question set.",
          questionSet: selectedSet,
          questions: [],
        });
      });

    return () => { cancelled = true; };
  }, [session?.setId]);

  useTestEffect(() => {
    if (loadState.loading || loadState.error) return undefined;
    const timer = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [loadState.loading, loadState.error, session?.setId]);

  const qs = loadState.questions;
  const questionSet = loadState.questionSet || initialQuestionSet || ds.getQuestionSetById(ds.defaultQuestionSetId);
  const q = qs[idx];
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const sourceLabel = { daily: "Daily", ai: "AI Generated", pyq: "Previous Year", csr: "CSR Mock" };
  const sourceTone = { daily: "rose", ai: "saffron", pyq: "green", csr: "indigo" };
  const fmt = (s) => `${String(Math.floor(s / 3600)).padStart(2, "0")}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  function exitTarget() {
    return session?.returnTo || "home";
  }

  function goTo(i) {
    setIdx(i);
    setVisited((v) => ({ ...v, [i]: true }));
    setPaletteOpen(false);
  }

  function choose(key) {
    if (!q) return;
    setAnswers((a) => ({ ...a, [q.n]: key }));
  }

  function toggleMark() {
    if (!q) return;
    setMarked((m) => ({ ...m, [q.n]: !m[q.n] }));
  }

  function statusOf(i) {
    const qn = qs[i].n;
    const a = answers[qn], m = marked[qn], v = visited[i];
    if (a && m) return "answered-review";
    if (m) return "review";
    if (a) return "answered";
    if (v) return "visited";
    return "";
  }

  function submitTest() {
    onSubmit({
      setId: questionSet.id,
      questionSet,
      questions: qs,
      answers: { ...answers },
    });
  }

  function Header({ canSubmit = false }) {
    return (
      <header className="test-bar">
        <div className="test-bar-l">
          <button className="btn ghost subtle test-back" onClick={() => setExitOpen(true)}>
            <Icon name="arrowL" size={16} /> Go back
          </button>
          <div className="test-set">
            <span className="test-set-name">UPSC CSE · GS Paper I</span>
            <span className="test-set-sub">{questionSet?.label || "Practice set"}</span>
          </div>
        </div>
        <div className="test-bar-r">
          <div className={`timer-pill${secs < 300 ? " low" : ""}`}>
            <Icon name="clock" size={15} /> <span className="timer-num">{fmt(secs)}</span>
          </div>
          {canSubmit && <button className="icon-btn only-mobile" onClick={() => setPaletteOpen(true)} aria-label="Question palette"><Icon name="grid" size={18} /></button>}
          {canSubmit && <button className="btn btn-green sm" onClick={submitTest}>Submit</button>}
        </div>
      </header>
    );
  }

  function ExitDialog() {
    if (!exitOpen) return null;
    return (
      <div className="confirm-layer" role="dialog" aria-modal="true" aria-labelledby="exit-title">
        <div className="confirm-box">
          <h3 id="exit-title">Are you sure you want to go back?</h3>
          <p>Your current answers in this attempt will be cleared.</p>
          <div className="confirm-actions">
            <button className="btn ghost" onClick={() => setExitOpen(false)}>No</button>
            <button className="btn btn-green" onClick={() => go(exitTarget())}>Yes</button>
          </div>
        </div>
      </div>
    );
  }

  if (loadState.loading) {
    return (
      <div className="test-shell">
        <Header />
        <div className="test-state">
          <div className="test-state-card">
            <h2>Loading {questionSet?.shortLabel || "test"}...</h2>
            <p>Preparing the selected question set.</p>
          </div>
        </div>
        <ExitDialog />
      </div>
    );
  }

  if (loadState.error || !q) {
    return (
      <div className="test-shell">
        <Header />
        <div className="test-state">
          <div className="test-state-card">
            <h2>Could not open this test</h2>
            <p>{loadState.error || "No questions are available for this set."}</p>
            <button className="btn btn-green" onClick={() => go(exitTarget())}>Back</button>
          </div>
        </div>
        <ExitDialog />
      </div>
    );
  }

  return (
    <div className="test-shell">
      <Header canSubmit />

      <div className="test-progress" aria-hidden="true">
        <div className="test-progress-fill" style={{ width: `${((idx + 1) / qs.length) * 100}%` }} />
      </div>

      <div className="test-layout">
        <main className="q-panel">
          <div className="q-scroll">
            <div className="q-meta">
              <div className="q-meta-l">
                <span className="q-index">Question <strong>{idx + 1}</strong> <span className="q-of">/ {qs.length}</span></span>
                <Tag tone={sourceTone[q.source] || "neutral"} soft>{sourceLabel[q.source] || "Practice"}</Tag>
              </div>
              <div className="q-meta-r">
                <Tag tone={SUBJECT_TONE[q.subject] || "neutral"} soft>{q.subject}</Tag>
                <span className="q-diff"><DiffMeter level={q.difficulty} /> {q.difficulty}</span>
              </div>
            </div>

            <QuestionStem q={q} big />

            <div className="options">
              {q.options.map((o) => {
                const sel = answers[q.n] === o.key;
                return (
                  <button key={o.key} className={`opt${sel ? " sel" : ""}`} onClick={() => choose(o.key)}>
                    <span className="opt-key">{o.key}</span>
                    <span className="opt-text">{o.text}</span>
                    <span className="opt-tick"><Icon name="check" size={15} /></span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="q-nav">
            <div className="q-nav-l">
              <button className={`btn ghost${marked[q.n] ? " marked" : ""}`} onClick={toggleMark}>
                <Icon name="flag" size={15} /> {marked[q.n] ? "Marked" : "Mark for review"}
              </button>
              <button className="btn ghost subtle" onClick={() => choose(null)} disabled={!answers[q.n]}>Clear</button>
            </div>
            <div className="q-nav-r">
              <button className="btn ghost" onClick={() => goTo(Math.max(0, idx - 1))} disabled={idx === 0}>
                <Icon name="arrowL" size={16} /> Prev
              </button>
              {idx < qs.length - 1 ? (
                <button className="btn btn-ink" onClick={() => goTo(idx + 1)}>Save &amp; next <Icon name="arrowR" size={16} /></button>
              ) : (
                <button className="btn btn-green" onClick={submitTest}>Finish <Icon name="check" size={16} /></button>
              )}
            </div>
          </div>
        </main>

        <aside className={`navigator${paletteOpen ? " open" : ""}`}>
          <div className="nav-scrim" onClick={() => setPaletteOpen(false)} />
          <div className="nav-inner">
            <div className="nav-head">
              <div>
                <h3>Question palette</h3>
                <span className="nav-count">{answeredCount} of {qs.length} answered</span>
              </div>
              <button className="icon-btn ghost only-mobile" onClick={() => setPaletteOpen(false)}><Icon name="x" size={18} /></button>
            </div>
            <div className="palette">
              {qs.map((qq, i) => (
                <button key={qq.id || qq.n} className={`pal ${statusOf(i)}${i === idx ? " current" : ""}`} onClick={() => goTo(i)}>
                  {i + 1}
                </button>
              ))}
            </div>
            <div className="legend">
              <span><i className="sw answered" /> Answered</span>
              <span><i className="sw review" /> Marked</span>
              <span><i className="sw visited" /> Visited</span>
              <span><i className="sw" /> Not visited</span>
            </div>
            <button className="btn btn-green full" onClick={submitTest}>Submit test</button>
            <p className="nav-note">You can review marked &amp; unanswered questions before final submission.</p>
          </div>
        </aside>
      </div>
      <ExitDialog />
    </div>
  );
}

Object.assign(window, { TestScreen });
