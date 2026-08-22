// Catch-up — the backlog of dated study work the learner hasn't done yet.
// "Missed" is computed in app/progress.js (getMissedSessions): every dated quiz
// (except the daily CA quiz and PIB, which live in the home loop) plus offline
// answer-writing tasks, minus anything completed, marked done or dismissed.
const { useState: useCatchUpState, useEffect: useCatchUpEffect } = React;

const CATCHUP_WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CATCHUP_GS_ORDER = ["GS1", "GS2", "GS3", "GS4"];
const CATCHUP_GS_LABEL = {
  GS1: "GS1 · History, Geography & Society",
  GS2: "GS2 · Polity, Governance & IR",
  GS3: "GS3 · Economy, Environment & Sci-Tech",
  GS4: "GS4 · Ethics, Integrity & Aptitude",
};

// Pull the daily Mains prompt out of the last column of a Sunday-Sweep day row.
// Returns { gs, text, words } or null when the cell has no answer-writing task.
function extractMainsQuestion(cell) {
  const raw = String(cell || "").trim();
  if (!raw) return null;
  const gsMatch = raw.match(/GS\s?-?\s?([1-4])/i);
  const gs = gsMatch ? `GS${gsMatch[1]}` : (/\bethics\b/i.test(raw) ? "GS4" : null);
  if (!gs) return null;
  const wordMatch = raw.match(/(\d{2,3})\s*-?\s*word/i);
  const words = wordMatch ? Number(wordMatch[1]) : (gs === "GS4" ? 250 : 150);
  // Prefer the quoted prompt (the last quote handles "Fallback: …" cases).
  const quotes = [...raw.matchAll(/[“”"]([^“”"]{8,})[“”"]/g)].map((m) => m[1].trim());
  let text = quotes.length ? quotes[quotes.length - 1] : raw;
  text = text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();
  if (!quotes.length && text.length > 160) text = `${text.slice(0, 157)}…`;
  return { gs, text, words };
}

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
  const [showWritten, setShowWritten] = useCatchUpState(false);
  const [mainsQuestions, setMainsQuestions] = useCatchUpState([]);

  // Daily Mains prompts live inside the weekly Sunday-Sweep notes (last column
  // of each day). Load and parse them once so they can be tracked by GS paper.
  useCatchUpEffect(() => {
    let cancelled = false;
    const sweeps = ds.noteDocuments.filter((doc) => doc.cadence === "sunday");
    if (!sweeps.length || typeof window.parseWeekPlan !== "function") return undefined;
    Promise.all(sweeps.map((s) => ds.loadNoteDocument(s.id).then(({ content }) => ({ s, content })).catch(() => null)))
      .then((results) => {
        if (cancelled) return;
        const out = [];
        for (const r of results) {
          if (!r) continue;
          const plan = window.parseWeekPlan(r.content);
          if (!plan || !plan.days) continue;
          plan.days.forEach((day, dayIdx) => {
            const cell = day.cells[day.cells.length - 1];
            const q = extractMainsQuestion(cell);
            if (!q) return;
            const offset = CATCHUP_WEEKDAYS.indexOf(day.weekday);
            const date = offset >= 0 ? window.UPSC_PROGRESS.addDays(r.s.date, offset) : r.s.date;
            if (date > ds.todayIso) return;
            // Index within the week keeps the id stable and unique even when a
            // day row has no parseable day number.
            out.push({ id: `mainsq::${r.s.id}::${dayIdx}`, gs: q.gs, text: q.text, words: q.words, date });
          });
        }
        out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
        setMainsQuestions(out);
      });
    return () => { cancelled = true; };
  }, [ds.noteDocuments.length]);

  const mainsDoneMap = progress?.manualCompletions || {};
  const mainsGroups = CATCHUP_GS_ORDER
    .map((gs) => ({ gs, items: mainsQuestions.filter((q) => q.gs === gs) }))
    .filter((group) => group.items.length);
  const mainsDoneCount = mainsQuestions.filter((q) => mainsDoneMap[q.id]).length;

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

      {mainsGroups.length > 0 && (
        <section className="catchup-mains">
          <div className="catchup-mains-head">
            <div>
              <h2>Daily mains questions</h2>
              <p>One answer-writing prompt a day from your Sunday Sweep, grouped by paper. Mark each done when you've written it.</p>
            </div>
            <div className="catchup-mains-summary">
              <strong>{mainsDoneCount}<span> / {mainsQuestions.length}</span></strong>
              <em>written</em>
              <button className="link-btn" onClick={() => setShowWritten((v) => !v)}>{showWritten ? "Hide written" : "Show written"}</button>
            </div>
          </div>
          <div className="catchup-mains-grid">
            {mainsGroups.map((group) => {
              const done = group.items.filter((q) => mainsDoneMap[q.id]).length;
              const pct = Math.round((done / group.items.length) * 100);
              const visibleItems = showWritten ? group.items : group.items.filter((q) => !mainsDoneMap[q.id]);
              return (
                <section key={group.gs} className="catchup-gs">
                  <header className="catchup-gs-head">
                    <div><strong>{CATCHUP_GS_LABEL[group.gs] || group.gs}</strong><span>{done} / {group.items.length} written</span></div>
                    <div className="catchup-gs-bar"><div className="catchup-gs-bar-fill" style={{ width: `${pct}%` }} /></div>
                  </header>
                  {visibleItems.length === 0 ? (
                    <p className="catchup-gs-empty">All {group.items.length} written — nice.</p>
                  ) : (
                    <div className="catchup-mains-list">
                      {visibleItems.map((q) => {
                        const isDone = Boolean(mainsDoneMap[q.id]);
                        return (
                          <div key={q.id} className={`catchup-mainsq${isDone ? " is-done" : ""}`}>
                            <button className={`catchup-mainsq-check${isDone ? " on" : ""}`} onClick={() => (isDone ? onUndoDone(q.id) : onMarkDone(q.id))} aria-label={isDone ? "Mark not done" : "Mark done"}>
                              {isDone && <Icon name="check" size={13} />}
                            </button>
                            <div className="catchup-mainsq-body">
                              <span className="catchup-mainsq-meta">{catchUpDateLabel(q.date)} · {q.words}-word</span>
                              <p>{q.text}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </section>
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
