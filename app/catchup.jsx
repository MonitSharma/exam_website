// Catch-up — the backlog of dated study work the learner hasn't done yet.
// "Missed" is computed in app/progress.js (getMissedSessions): every dated quiz
// (except the daily CA quiz and PIB, which live in the home loop) plus offline
// answer-writing tasks, minus anything completed, marked done or dismissed.
const { useState: useCatchUpState } = React;

// Metadata for each backlog category. `kind` decides the primary action:
// "quiz" sets are attempted in-app, "writing" tasks are opened and self-marked.
const CATCHUP_META = {
  rc: { label: "Daily RC", tone: "blue", icon: "book", kind: "quiz", unit: "questions" },
  "weekly-news": { label: "Weekly news", tone: "teal", icon: "map", kind: "quiz", unit: "questions" },
  "weekly-quiz": { label: "Weekly quiz", tone: "indigo", icon: "layers", kind: "quiz", unit: "questions" },
  sectional: { label: "Sectional test", tone: "saffron", icon: "target", kind: "quiz", unit: "questions" },
  csat: { label: "CSAT practice", tone: "blue", icon: "target", kind: "quiz", unit: "questions" },
  ai: { label: "Mock test", tone: "saffron", icon: "spark", kind: "quiz", unit: "questions" },
  mains: { label: "Mains answers", tone: "green", icon: "fileText", kind: "writing", unit: "min" },
  ethics: { label: "Ethics case", tone: "rose", icon: "target", kind: "writing", unit: "min" },
  editorials: { label: "Editorials", tone: "indigo", icon: "book", kind: "writing", unit: "min" },
};

function catchUpMeta(category) {
  return CATCHUP_META[category] || { label: "Session", tone: "neutral", icon: "calendar", kind: "quiz", unit: "questions" };
}

function catchUpDateLabel(isoDate) {
  const [y, m, d] = String(isoDate).split("-").map(Number);
  if (!y || !m || !d) return isoDate || "";
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
}

function catchUpMonthLabel(monthKey) {
  const [y, m] = String(monthKey).split("-").map(Number);
  if (!y || !m) return monthKey;
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 1)));
}

// Open a note (writing task) inside the Home notes library.
function openCatchUpNote(go, id) {
  go("home");
  setTimeout(() => window.dispatchEvent(new CustomEvent("pariksha:open-note", { detail: { id } })), 80);
}

function CatchUpScreen({ go, progress, onDismiss, onRestore, onMarkDone, onUndoDone }) {
  const ds = window.UPSC;
  const [filter, setFilter] = useCatchUpState("all");
  const [showCleared, setShowCleared] = useCatchUpState(false);

  const missed = window.UPSC_PROGRESS.getMissedSessions(progress, ds.todayIso, ds.questionSets, ds.noteDocuments);
  const typeCounts = missed.reduce((acc, item) => { acc[item.category] = (acc[item.category] || 0) + 1; return acc; }, {});
  const visible = filter === "all" ? missed : missed.filter((item) => item.category === filter);
  const totalMinutes = visible.reduce((sum, item) => sum + Number(item.durationMinutes || 0), 0);

  // Group by month, newest first within.
  const months = [];
  const monthIndex = new Map();
  for (const item of visible) {
    const key = String(item.isoDate).slice(0, 7);
    if (!monthIndex.has(key)) { monthIndex.set(key, { key, items: [] }); months.push(monthIndex.get(key)); }
    monthIndex.get(key).items.push(item);
  }

  // Resolve dismissed + manually-done ids back to a friendly label so they can
  // be restored. Both question sets and notes may appear.
  const clearedIds = [...new Set([...Object.keys(progress?.dismissedSessions || {}), ...Object.keys(progress?.manualCompletions || {})])];
  const clearedRows = clearedIds
    .map((id) => {
      const set = ds.questionSets.find((s) => s.id === id);
      if (set) return { id, category: set.sourceType, isoDate: set.isoDate, label: set.label };
      const note = ds.noteDocuments.find((n) => n.id === id);
      if (note) return { id, category: note.cadence, isoDate: note.date, label: note.title };
      return null;
    })
    .filter((row) => row && CATCHUP_META[row.category])
    .map((row) => ({ ...row, dismissed: Boolean(progress?.dismissedSessions?.[row.id]) }))
    .sort((a, b) => String(b.isoDate).localeCompare(String(a.isoDate)));

  // Only show filter chips for categories that actually have a backlog.
  const presentCategories = Object.keys(CATCHUP_META).filter((id) => typeCounts[id]);
  const filterChips = [{ id: "all", label: "All", count: missed.length }, ...presentCategories.map((id) => ({ id, label: CATCHUP_META[id].label, count: typeCounts[id] }))];

  return (
    <div className="page-wrap catchup-page">
      <div className="catchup-top">
        <div>
          <span className="eyebrow small"><span className="eyebrow-line" /> Catch-up</span>
          <h1 className="catchup-h1">Work you haven't done yet.</h1>
          <p className="catchup-sub">Dated quizzes, mocks and answer-writing whose day has passed and still need a first pass. The daily current-affairs quiz and PIB briefs are left out — they live on your home loop. Do one, mark it done, or dismiss it to clear the backlog.</p>
        </div>
        <div className="catchup-summary">
          <strong>{missed.length}</strong>
          <span>to catch up</span>
          {missed.length > 0 && <em>{filter === "all" ? "" : `${visible.length} shown · `}~{totalMinutes} min{filter === "all" ? " total" : ""}</em>}
        </div>
      </div>

      {missed.length === 0 ? (
        <section className="panel catchup-empty">
          <div className="catchup-empty-mark"><Icon name="check" size={26} /></div>
          <strong>You're all caught up.</strong>
          <span>Nothing pending. Missed quizzes, mocks and answer-writing tasks will appear here the day after they go live.</span>
          <div className="catchup-empty-actions">
            <button className="btn btn-green" onClick={() => go("test", { setId: ds.defaultQuestionSetId })}><Icon name="bolt" size={16} /> Today's daily quiz</button>
            <button className="btn ghost" onClick={() => go("practice")}>Browse practice</button>
          </div>
        </section>
      ) : (
        <>
          <div className="catchup-filters" role="tablist" aria-label="Filter by type">
            {filterChips.map((chip) => (
              <button key={chip.id} role="tab" aria-selected={filter === chip.id} className={`catchup-chip${filter === chip.id ? " on" : ""}`} onClick={() => setFilter(chip.id)}>
                {chip.label} <span className="catchup-chip-count">{chip.count}</span>
              </button>
            ))}
          </div>

          <div className="catchup-groups">
            {months.map((month) => (
              <section key={month.key} className="catchup-month">
                <header className="catchup-month-head"><h2>{catchUpMonthLabel(month.key)}</h2><span>{month.items.length} {month.items.length === 1 ? "item" : "items"}</span></header>
                <div className="catchup-list">
                  {month.items.map((item) => {
                    const meta = catchUpMeta(item.category);
                    const metaLine = item.kind === "writing"
                      ? `Answer writing · ~${item.durationMinutes} min`
                      : `${item.questionCount} questions · ${item.durationMinutes} min`;
                    return (
                      <div key={item.id} className={`catchup-card tone-${meta.tone}`}>
                        <span className="catchup-card-icon"><Icon name={meta.icon} size={18} /></span>
                        <div className="catchup-card-body">
                          <div className="catchup-card-tags"><Tag tone={meta.tone} soft>{meta.label}</Tag><span className="catchup-card-date"><Icon name="calendar" size={13} /> {catchUpDateLabel(item.isoDate)}</span></div>
                          <strong>{item.label}</strong>
                          <span className="catchup-card-meta">{metaLine}</span>
                        </div>
                        <div className="catchup-card-actions">
                          {item.kind === "writing" ? (
                            <button className="btn ghost sm" onClick={() => openCatchUpNote(go, item.id)}><Icon name="book" size={15} /> Open</button>
                          ) : (
                            <button className="btn btn-green sm" onClick={() => go("test", { setId: item.id, returnTo: "catchup" })}><Icon name="play" size={15} /> Start</button>
                          )}
                          <div className="catchup-card-secondary">
                            <button className="link-btn catchup-done" onClick={() => onMarkDone(item.id)} aria-label={`Mark ${item.label} done`}><Icon name="check" size={13} /> Done</button>
                            <button className="link-btn catchup-dismiss" onClick={() => onDismiss(item.id)} aria-label={`Dismiss ${item.label}`}><Icon name="x" size={13} /> Dismiss</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {clearedRows.length > 0 && (
        <section className="catchup-dismissed">
          <button className="catchup-dismissed-toggle" onClick={() => setShowCleared((v) => !v)} aria-expanded={showCleared}>
            <Icon name={showCleared ? "x" : "arrowR"} size={14} /> {showCleared ? "Hide" : "Show"} cleared ({clearedRows.length})
          </button>
          {showCleared && (
            <div className="catchup-dismissed-list">
              {clearedRows.map((row) => (
                <div key={row.id} className="catchup-dismissed-row">
                  <span>{CATCHUP_META[row.category].label} · {catchUpDateLabel(row.isoDate)} — {row.label} <em className="catchup-cleared-tag">{row.dismissed ? "dismissed" : "done"}</em></span>
                  <button className="link-btn" onClick={() => (row.dismissed ? onRestore(row.id) : onUndoDone(row.id))}>Restore</button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

Object.assign(window, { CatchUpScreen });
