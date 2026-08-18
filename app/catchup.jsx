// Catch-up — the backlog of dated cadence quizzes the learner never attempted.
// "Missed" is computed in app/progress.js (getMissedSessions): recurring, dated
// content whose day has passed, minus anything completed or dismissed. PIB and
// on-demand libraries are excluded there.
const { useState: useCatchUpState } = React;

const CATCHUP_SOURCE_META = {
  daily: { label: "Daily quiz", tone: "rose", icon: "flame" },
  rc: { label: "Daily RC", tone: "blue", icon: "book" },
  "weekly-news": { label: "Weekly news", tone: "teal", icon: "map" },
  "weekly-quiz": { label: "Weekly quiz", tone: "indigo", icon: "layers" },
};

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

function CatchUpScreen({ go, progress, onDismiss, onRestore }) {
  const ds = window.UPSC;
  const [filter, setFilter] = useCatchUpState("all");
  const [showDismissed, setShowDismissed] = useCatchUpState(false);

  const missed = window.UPSC_PROGRESS.getMissedSessions(progress, ds.todayIso, ds.questionSets);
  const typeCounts = missed.reduce((acc, item) => { acc[item.sourceType] = (acc[item.sourceType] || 0) + 1; return acc; }, {});
  const visible = filter === "all" ? missed : missed.filter((item) => item.sourceType === filter);
  const totalMinutes = visible.reduce((sum, item) => sum + Number(item.durationMinutes || 0), 0);

  // Group by month, then list each date newest-first inside.
  const months = [];
  const monthIndex = new Map();
  for (const item of visible) {
    const key = String(item.isoDate).slice(0, 7);
    if (!monthIndex.has(key)) { monthIndex.set(key, { key, items: [] }); months.push(monthIndex.get(key)); }
    monthIndex.get(key).items.push(item);
  }

  // Dismissed sets, resolved back to their metadata so they can be restored.
  const dismissedIds = Object.keys(progress?.dismissedSessions || {});
  const dismissedSets = dismissedIds
    .map((id) => ds.questionSets.find((set) => set.id === id))
    .filter((set) => set && CATCHUP_SOURCE_META[set.sourceType])
    .sort((a, b) => String(b.isoDate).localeCompare(String(a.isoDate)));

  const filterChips = [{ id: "all", label: "All", count: missed.length }, ...Object.keys(CATCHUP_SOURCE_META).map((id) => ({ id, label: CATCHUP_SOURCE_META[id].label, count: typeCounts[id] || 0 }))];

  return (
    <div className="page-wrap catchup-page">
      <div className="catchup-top">
        <div>
          <span className="eyebrow small"><span className="eyebrow-line" /> Catch-up</span>
          <h1 className="catchup-h1">Sessions you haven't done yet.</h1>
          <p className="catchup-sub">Every dated daily and weekly quiz whose day has passed, still waiting for a first attempt. PIB briefs are left out. Do one, or dismiss it to clear the backlog.</p>
        </div>
        <div className="catchup-summary">
          <strong>{missed.length}</strong>
          <span>missed {missed.length === 1 ? "session" : "sessions"}</span>
          {missed.length > 0 && <em>{filter === "all" ? "" : `${visible.length} shown · `}~{totalMinutes} min to clear{filter === "all" ? " all" : ""}</em>}
        </div>
      </div>

      {missed.length === 0 ? (
        <section className="panel catchup-empty">
          <div className="catchup-empty-mark"><Icon name="check" size={26} /></div>
          <strong>You're all caught up.</strong>
          <span>No missed daily or weekly quizzes. New ones will appear here the day after they go live if you skip them.</span>
          <div className="catchup-empty-actions">
            <button className="btn btn-green" onClick={() => go("test", { setId: ds.defaultQuestionSetId })}><Icon name="bolt" size={16} /> Today's daily quiz</button>
            <button className="btn ghost" onClick={() => go("practice")}>Browse practice</button>
          </div>
        </section>
      ) : (
        <>
          <div className="catchup-filters" role="tablist" aria-label="Filter by type">
            {filterChips.map((chip) => (
              <button key={chip.id} role="tab" aria-selected={filter === chip.id} className={`catchup-chip${filter === chip.id ? " on" : ""}`} onClick={() => setFilter(chip.id)} disabled={chip.id !== "all" && chip.count === 0}>
                {chip.label} <span className="catchup-chip-count">{chip.count}</span>
              </button>
            ))}
          </div>

          <div className="catchup-groups">
            {months.map((month) => (
              <section key={month.key} className="catchup-month">
                <header className="catchup-month-head"><h2>{catchUpMonthLabel(month.key)}</h2><span>{month.items.length} {month.items.length === 1 ? "session" : "sessions"}</span></header>
                <div className="catchup-list">
                  {month.items.map((item) => {
                    const meta = CATCHUP_SOURCE_META[item.sourceType] || { label: "Quiz", tone: "neutral", icon: "calendar" };
                    return (
                      <div key={item.id} className={`catchup-card tone-${meta.tone}`}>
                        <span className="catchup-card-icon"><Icon name={meta.icon} size={18} /></span>
                        <div className="catchup-card-body">
                          <div className="catchup-card-tags"><Tag tone={meta.tone} soft>{meta.label}</Tag><span className="catchup-card-date"><Icon name="calendar" size={13} /> {catchUpDateLabel(item.isoDate)}</span></div>
                          <strong>{item.label}</strong>
                          <span className="catchup-card-meta">{item.questionCount} questions · {item.durationMinutes} min</span>
                        </div>
                        <div className="catchup-card-actions">
                          <button className="btn btn-green sm" onClick={() => go("test", { setId: item.id, returnTo: "catchup" })}><Icon name="play" size={15} /> Start</button>
                          <button className="link-btn catchup-dismiss" onClick={() => onDismiss(item.id)} aria-label={`Dismiss ${item.label}`}><Icon name="x" size={13} /> Dismiss</button>
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

      {dismissedSets.length > 0 && (
        <section className="catchup-dismissed">
          <button className="catchup-dismissed-toggle" onClick={() => setShowDismissed((v) => !v)} aria-expanded={showDismissed}>
            <Icon name={showDismissed ? "x" : "arrowR"} size={14} /> {showDismissed ? "Hide" : "Show"} dismissed ({dismissedSets.length})
          </button>
          {showDismissed && (
            <div className="catchup-dismissed-list">
              {dismissedSets.map((set) => (
                <div key={set.id} className="catchup-dismissed-row">
                  <span>{CATCHUP_SOURCE_META[set.sourceType].label} · {catchUpDateLabel(set.isoDate)} — {set.label}</span>
                  <button className="link-btn" onClick={() => onRestore(set.id)}>Restore</button>
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
