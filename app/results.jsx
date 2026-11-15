// Results + Review screens
const { useState: useResState } = React;

function formatMarks(value) {
  const rounded = Math.round(Number(value || 0) * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.?0+$/, "");
}

function scoreFrom(attempt, qs, questionSet) {
  const ds = window.UPSC;
  let correct = 0, wrong = 0, un = 0, raw = 0, max = 0, correctMarks = 0, wrongPenalty = 0;
  qs.forEach((q) => {
    const a = attempt[q.n];
    const acceptedAnswers = Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length ? q.acceptedAnswers : [q.answer].filter(Boolean);
    const marking = ds.getQuestionMarking(questionSet, q);
    max += marking.correct;
    if (!a) un++;
    else if (acceptedAnswers.includes(a)) {
      correct++;
      raw += marking.correct;
      correctMarks += marking.correct;
    } else {
      wrong++;
      raw += marking.wrong;
      wrongPenalty += Math.abs(marking.wrong);
    }
  });
  return { correct, wrong, un, raw: Math.round(raw * 100) / 100, max: Math.round(max * 100) / 100, correctMarks, wrongPenalty };
}

function getResultData(result) {
  return {
    questionSet: result?.questionSet || null,
    qs: Array.isArray(result?.questions) ? result.questions : [],
    attempt: result?.answers || {},
    elapsedSeconds: Number(result?.elapsedSeconds) || 0,
  };
}

function formatDurationMS(totalSeconds) {
  const safe = Math.max(0, Math.round(Number(totalSeconds) || 0));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function NoResultEmpty({ go }) {
  return (
    <div className="page-wrap result">
      <div className="result-hero panel">
        <div className="result-hero-l">
          <span className="result-eyebrow">No result yet</span>
          <h1 className="result-h1">Finish a test to see your score here.</h1>
          <p className="result-lead">When you submit an attempt, your results, breakdown and review will appear on this page.</p>
          <div className="result-cta">
            <button className="btn btn-green" onClick={() => go("home")}><Icon name="home" size={16} /> Back home</button>
            <button className="btn ghost" onClick={() => go("practice")}><Icon name="play" size={16} /> Start a practice test</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Results({ go, result }) {
  const { questionSet, qs, attempt, elapsedSeconds } = getResultData(result);
  if (!questionSet || !qs.length) return <NoResultEmpty go={go} />;
  const s = scoreFrom(attempt, qs, questionSet);
  const pct = s.max ? s.raw / s.max : 0;
  const accuracy = Math.round((s.correct / (s.correct + s.wrong || 1)) * 100);
  const avgPerQ = elapsedSeconds && qs.length ? elapsedSeconds / qs.length : 0;

  // subject split
  const bySub = {};
  qs.forEach((q) => {
    const a = attempt[q.n];
    const acceptedAnswers = Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length ? q.acceptedAnswers : [q.answer].filter(Boolean);
    bySub[q.subject] = bySub[q.subject] || { c: 0, t: 0 };
    bySub[q.subject].t++;
    if (acceptedAnswers.includes(a)) bySub[q.subject].c++;
  });

  return (
    <div className="page-wrap result">
      <div className="result-hero panel">
        <div className="result-hero-l">
          <span className="result-eyebrow">{questionSet?.label || "Practice set"} · Submitted</span>
          <h1 className="result-h1">Nicely done.</h1>
          <p className="result-lead">Your score is ready. Review the explanations and use the subject split to decide what to revise next.</p>
          <div className="result-cta">
            <button className="btn btn-green" onClick={() => go("review")}><Icon name="book" size={16} /> Review answers</button>
            <button className="btn ghost" onClick={() => go("dashboard")}><Icon name="chart" size={16} /> See progress</button>
            <button className="btn ghost subtle" onClick={() => go("home")}>Back home</button>
          </div>
        </div>
        <div className="result-hero-r">
          <Ring value={pct} size={172} stroke={13} color="var(--green)">
            <div className="big-score">{s.raw}</div>
            <div className="big-score-max">/ {s.max}</div>
            <div className="big-score-cap">net score</div>
          </Ring>
        </div>
      </div>

      <div className="result-grid">
        <div className="result-breakdown panel">
          <header className="panel-head"><h3>Score breakdown</h3><p>{window.UPSC.getMarkingLabel(questionSet)}</p></header>
          <div className="panel-body">
            <div className="break-bar">
              <span className="bar-seg correct" style={{ flex: s.correct || 0.001 }} />
              <span className="bar-seg wrong" style={{ flex: s.wrong || 0.001 }} />
              <span className="bar-seg un" style={{ flex: s.un || 0.001 }} />
            </div>
            <div className="break-legend">
              <div className="bl"><span className="dot correct" /> <strong>{s.correct}</strong> Correct <em>+{formatMarks(s.correctMarks)}</em></div>
              <div className="bl"><span className="dot wrong" /> <strong>{s.wrong}</strong> Wrong <em>-{formatMarks(s.wrongPenalty)}</em></div>
              <div className="bl"><span className="dot un" /> <strong>{s.un}</strong> Skipped <em>0</em></div>
            </div>
            <div className="break-stats">
              <Stat value={`${accuracy}%`} label="Accuracy" tone="green" />
              <Stat value={`${s.correct + s.wrong}/${qs.length}`} label="Attempted" />
              {avgPerQ > 0
                ? <Stat value={formatDurationMS(avgPerQ)} label="Avg / question" sub="min:sec" />
                : <Stat value={formatDurationMS(elapsedSeconds)} label="Time taken" sub="min:sec" />}
            </div>
          </div>
        </div>

        <div className="result-subjects panel">
          <header className="panel-head"><h3>By subject</h3></header>
          <div className="panel-body bars">
            {Object.entries(bySub).map(([sub, v]) => {
              const a = Math.round((v.c / v.t) * 100);
              return (
                <div className="bar-row" key={sub}>
                  <div className="bar-row-head">
                    <span className="bar-sub"><i className={`subdot tone-${SUBJECT_TONE[sub] || "neutral"}`} />{sub}</span>
                    <span className="bar-frac">{v.c}/{v.t}</span>
                  </div>
                  <div className="track"><div className={`fill tone-${SUBJECT_TONE[sub] || "neutral"}`} style={{ width: `${a}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {result?.attemptSummary?.confidenceBreakdown && (
        <div className="panel result-conf-panel">
          <header className="panel-head"><h3>Confidence &amp; elimination split</h3><p>Accuracy and net marks by how sure you felt</p></header>
          <div className="panel-body conf-grid">
            {[["sure", "Sure"], ["fifty", "50:50"], ["guess", "Guess"]].map(([tier, label]) => {
              const row = result.attemptSummary.confidenceBreakdown[tier];
              if (!row || !row.attempted) return null;
              const acc = Math.round((row.correct / row.attempted) * 100);
              return (
                <div key={tier} className={`conf-stat tone-${tier}`}>
                  <strong>{label}</strong>
                  <span>{row.correct}/{row.attempted} correct ({acc}%)</span>
                  <em>{row.score >= 0 ? `+${formatMarks(row.score)}` : formatMarks(row.score)} marks</em>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Review({ go, result, bookmarks = {}, onToggleBookmark, onSaveNote }) {
  const { questionSet, qs, attempt } = getResultData(result);
  const [filter, setFilter] = useResState("all");
  const [editingNoteKey, setEditingNoteKey] = useResState("");
  const [noteDraft, setNoteDraft] = useResState("");
  if (!questionSet || !qs.length) return <NoResultEmpty go={go} />;

  const enriched = qs.map((q) => {
    const a = attempt[q.n];
    const acceptedAnswers = Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length ? q.acceptedAnswers : [q.answer].filter(Boolean);
    const state = !a ? "skipped" : acceptedAnswers.includes(a) ? "correct" : "incorrect";
    return { q, a, state };
  });
  const counts = {
    all: enriched.length,
    correct: enriched.filter((e) => e.state === "correct").length,
    incorrect: enriched.filter((e) => e.state === "incorrect").length,
    skipped: enriched.filter((e) => e.state === "skipped").length,
  };
  const shown = enriched.filter((e) => filter === "all" || e.state === filter);

  const filters = [
    ["all", "All"], ["incorrect", "Incorrect"], ["correct", "Correct"], ["skipped", "Skipped"],
  ];

  return (
    <div className="page-wrap review">
      <div className="review-top">
        <div>
          <button className="link-btn back" onClick={() => go("result")}><Icon name="arrowL" size={14} /> Back to results</button>
          <h1 className="review-h1">{questionSet?.shortLabel || "Test"} review</h1>
        </div>
        <div className="review-filters">
          {filters.map(([k, label]) => (
            <button key={k} className={`fchip${filter === k ? " on" : ""}`} onClick={() => setFilter(k)}>
              {label} <span className="fcount">{counts[k]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="review-list">
        {shown.map(({ q, a, state }) => {
          const ref = {
            setId: q.sourceSetId || questionSet.id,
            n: q.sourceQuestionNumber || q.n,
            subject: q.subject || "",
            micro: q.micro || "",
          };
          const bmKey = window.UPSC_PROGRESS.questionKey(ref.setId, ref.n);
          const bm = bookmarks[bmKey];
          const isEditing = editingNoteKey === bmKey;
          return (
          <article key={q.n} className={`rev-item state-${state}`}>
            <div className="rev-head">
              <span className="rev-n">Q{q.n}</span>
              <Tag tone={SUBJECT_TONE[q.subject] || "neutral"} soft>{q.subject}</Tag>
              <span className="rev-micro">{q.micro}</span>
              {result?.questionTimes?.[q.n] > 0 && <span className="rev-time">{result.questionTimes[q.n]}s</span>}
              {result?.confidence?.[q.n] && <span className={`rev-conf tone-${result.confidence[q.n]}`}>{result.confidence[q.n] === "fifty" ? "50:50" : result.confidence[q.n] === "sure" ? "Sure" : "Guess"}</span>}
              <span className={`rev-badge ${state}`}>
                <Icon name={state === "correct" ? "check" : state === "incorrect" ? "x" : "info"} size={13} />
                {state === "correct" ? "Correct" : state === "incorrect" ? "Incorrect" : "Skipped"}
              </span>
              <button
                type="button"
                className={`bm-btn${bm ? " on" : ""}`}
                onClick={() => onToggleBookmark?.(ref)}
                title="Bookmark question"
              >
                <Icon name="book" size={12} /> {bm ? "Saved" : "Save"}
              </button>
              <a
                className="report-issue-link"
                href={buildQuestionIssueUrl(questionSet, q)}
                target="_blank"
                rel="noopener noreferrer"
                title="Report a question or answer-key issue on GitHub"
              >
                <Icon name="flag" size={12} /> Report
              </a>
            </div>
            <div className="rev-body">
              <QuestionStem q={q} />
              <div className="rev-opts">
                {q.options.map((o) => {
                  const acceptedAnswers = Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length ? q.acceptedAnswers : [q.answer].filter(Boolean);
                  const isAns = acceptedAnswers.includes(o.key);
                  const isYours = o.key === a;
                  let cls = "rev-opt";
                  if (isAns) cls += " correct";
                  if (isYours && !isAns) cls += " yours-wrong";
                  return (
                    <div key={o.key} className={cls}>
                      <span className="opt-key">{o.key}</span>
                      <span className="opt-text">{o.text}</span>
                      {isAns && <span className="opt-flag correct">Correct answer</span>}
                      {isYours && !isAns && <span className="opt-flag yours">Your answer</span>}
                    </div>
                  );
                })}
              </div>
              <div className="rev-explain">
                <span className="rev-explain-label"><Icon name="info" size={14} /> Explanation</span>
                <p>{q.explanation}</p>
              </div>
              <div className="rev-note-box">
                {isEditing ? (
                  <div className="rev-note-editor">
                    <textarea
                      rows={2}
                      value={noteDraft}
                      onChange={(e) => setNoteDraft(e.target.value)}
                      placeholder="Add a personal mnemonic or takeaway…"
                    />
                    <div className="rev-note-actions">
                      <button
                        type="button"
                        className="btn btn-green sm"
                        onClick={() => { onSaveNote?.(ref, noteDraft); setEditingNoteKey(""); }}
                      >
                        Save note
                      </button>
                      <button type="button" className="btn ghost sm" onClick={() => setEditingNoteKey("")}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="rev-note-view">
                    {bm?.note && <p className="rev-note-text"><strong>My note:</strong> {bm.note}</p>}
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => { setEditingNoteKey(bmKey); setNoteDraft(bm?.note || ""); }}
                    >
                      {bm?.note ? "Edit note" : "+ Add personal note"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, { Results, Review });
