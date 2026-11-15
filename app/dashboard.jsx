// Performance dashboard / local progress
function TrendChart({ data }) {
  const W = 640, H = 220, pad = 30;
  if (!data.length) {
    return (
      <svg className="trend" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {[0, 0.5, 1].map((g) => (
          <line key={g} x1={pad} x2={W - pad} y1={pad + g * (H - pad * 2)} y2={pad + g * (H - pad * 2)} className="grid" />
        ))}
        <text x={W / 2} y={H / 2} className="trend-empty">No attempts yet</text>
      </svg>
    );
  }
  const vals = data.map((d) => d.accuracy);
  const min = Math.min(...vals) - 6, max = Math.max(...vals) + 6;
  const x = (i) => data.length === 1 ? W / 2 : pad + (i * (W - pad * 2)) / (data.length - 1);
  const y = (v) => H - pad - ((v - min) / (max - min || 1)) * (H - pad * 2);
  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.accuracy)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${H - pad} L${x(0)},${H - pad} Z`;
  return (
    <svg className="trend" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--green)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((g) => (
        <line key={g} x1={pad} x2={W - pad} y1={pad + g * (H - pad * 2)} y2={pad + g * (H - pad * 2)} className="grid" />
      ))}
      <path d={area} fill="url(#tg)" />
      <path d={line} className="trend-line" />
      {data.map((d, i) => (
        <g key={d.id || i}>
          <circle cx={x(i)} cy={y(d.accuracy)} r="4.5" className="trend-pt" />
          <text x={x(i)} y={H - 8} className="trend-x">{d.date}</text>
        </g>
      ))}
    </svg>
  );
}

function buildSubjectRows(history) {
  const subjects = {};
  history.forEach((entry) => {
    Object.entries(entry.subjectBreakdown || {}).forEach(([subject, value]) => {
      subjects[subject] = subjects[subject] || { subject, correct: 0, attempted: 0, total: 0 };
      subjects[subject].correct += Number(value.correct) || 0;
      subjects[subject].attempted += Number(value.attempted) || 0;
      subjects[subject].total += Number(value.total) || 0;
    });
  });
  return Object.values(subjects)
    .map((row) => ({
      ...row,
      acc: Math.round((row.correct / (row.attempted || 1)) * 100),
    }))
    .sort((a, b) => a.acc - b.acc);
}

function exportProgress(progress) {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `pariksha-progress-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function ReviewQueueCard({ review, onStartReview }) {
  const tracked = review?.tracked || 0;
  const due = review?.due || 0;
  const batch = Math.min(due, 20);
  return (
    <section className="panel dash-review">
      <header className="panel-head row">
        <div>
          <h3>Revision queue</h3>
          <p>{tracked ? "Spaced repetition on the questions you get wrong" : "Builds itself as you practise"}</p>
        </div>
        {due > 0 && <span className="trend-delta up"><Icon name="clock" size={13} /> {due} due</span>}
      </header>
      <div className="panel-body review-body">
        {tracked ? (
          <>
            <div className="review-stats">
              <div><strong>{due}</strong><span>Due today</span></div>
              <div><strong>{review.scheduled}</strong><span>Scheduled later</span></div>
              <div><strong>{tracked}</strong><span>Tracked</span></div>
            </div>
            {review.weakest.length > 0 && (
              <div className="review-subjects">
                {review.weakest.map((row) => (
                  <span key={row.subject} className="review-subject">
                    <i className={`subdot tone-${SUBJECT_TONE[row.subject] || "neutral"}`} />
                    {row.subject}<b>{row.count}</b>
                  </span>
                ))}
              </div>
            )}
            {due > 0 ? (
              <button className="btn btn-green" onClick={onStartReview}>
                <Icon name="bolt" size={15} /> Revise {batch} question{batch === 1 ? "" : "s"}
              </button>
            ) : (
              <p className="review-note">Nothing due today. Each question returns after 1, 3, 7, 16, 35 then 90 days — answer it right every time and it retires from the queue.</p>
            )}
          </>
        ) : (
          <div className="empty-panel">
            <strong>Nothing to revise yet.</strong>
            <span>Questions you answer incorrectly are scheduled here automatically.</span>
          </div>
        )}
      </div>
    </section>
  );
}

function OfflineButton() {
  const ds = window.UPSC;
  const [state, setState] = React.useState("idle");
  if (!ds.offlineAvailable()) return null;
  const labels = { idle: "Save for offline", saving: "Saving…", done: "Saved for offline" };
  return (
    <button
      className="btn ghost"
      disabled={state === "saving"}
      onClick={() => {
        setState("saving");
        ds.saveRecentForOffline({ days: 14 })
          .then((result) => setState(result.ok ? "done" : "idle"))
          .catch(() => setState("idle"));
      }}
    >
      <Icon name="download" size={15} /> {labels[state]}
    </button>
  );
}

function buildConfidenceRows(history) {
  const totals = {
    sure: { tier: "sure", label: "Sure", correct: 0, wrong: 0, attempted: 0, score: 0 },
    fifty: { tier: "fifty", label: "50:50", correct: 0, wrong: 0, attempted: 0, score: 0 },
    guess: { tier: "guess", label: "Guess", correct: 0, wrong: 0, attempted: 0, score: 0 },
  };
  history.forEach((entry) => {
    const cb = entry.confidenceBreakdown;
    if (!cb) return;
    ["sure", "fifty", "guess"].forEach((tier) => {
      const row = cb[tier];
      if (!row) return;
      totals[tier].correct += Number(row.correct) || 0;
      totals[tier].wrong += Number(row.wrong) || 0;
      totals[tier].attempted += Number(row.attempted) || 0;
      totals[tier].score = Math.round((totals[tier].score + (Number(row.score) || 0)) * 100) / 100;
    });
  });
  return Object.values(totals).filter((r) => r.attempted > 0);
}

const GIST_SYNC_KEY = "pariksha:gist_sync";
const GIST_FILENAME = "pariksha-progress.json";
function readGistConfig() {
  try {
    return JSON.parse(localStorage.getItem(GIST_SYNC_KEY) || "null") || { token: "", gistId: "", lastSyncAt: null };
  } catch (e) {
    return { token: "", gistId: "", lastSyncAt: null };
  }
}
function writeGistConfig(cfg) {
  try { localStorage.setItem(GIST_SYNC_KEY, JSON.stringify(cfg)); } catch (e) {}
}

function GistSyncBar({ progress, onRestoreProgress }) {
  const [open, setOpen] = React.useState(false);
  const [cfg, setCfg] = React.useState(() => readGistConfig());
  const [status, setStatus] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  function updateCfg(patch) {
    const next = { ...cfg, ...patch };
    setCfg(next);
    writeGistConfig(next);
  }

  async function pushGist() {
    if (!cfg.token.trim()) { setStatus("Enter a GitHub token with gist scope."); return; }
    setBusy(true);
    setStatus("Syncing up…");
    try {
      const payload = {
        description: "Pariksha UPSC progress backup",
        public: false,
        files: { [GIST_FILENAME]: { content: JSON.stringify(progress, null, 2) } },
      };
      const url = cfg.gistId.trim()
        ? `https://api.github.com/gists/${encodeURIComponent(cfg.gistId.trim())}`
        : "https://api.github.com/gists";
      const res = await fetch(url, {
        method: cfg.gistId.trim() ? "PATCH" : "POST",
        headers: { Authorization: `Bearer ${cfg.token.trim()}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const data = await res.json();
      updateCfg({ gistId: data.id || cfg.gistId, lastSyncAt: Date.now() });
      setStatus(`Synced to Gist (${(data.id || "").slice(0, 8)}…)`);
    } catch (err) {
      setStatus(`Sync failed: ${err.message}`);
    } finally {
      setBusy(false);
    }
  }

  async function pullGist() {
    if (!cfg.gistId.trim()) { setStatus("Enter a Gist ID to pull from."); return; }
    setBusy(true);
    setStatus("Fetching…");
    try {
      const headers = cfg.token.trim() ? { Authorization: `Bearer ${cfg.token.trim()}` } : {};
      const res = await fetch(`https://api.github.com/gists/${encodeURIComponent(cfg.gistId.trim())}`, { headers });
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const data = await res.json();
      const file = data.files?.[GIST_FILENAME] || Object.values(data.files || {})[0];
      if (!file?.content) throw new Error("No progress file in Gist");
      const ok = onRestoreProgress?.(file.content);
      if (ok) {
        updateCfg({ lastSyncAt: Date.now() });
        setStatus("Restored from Gist.");
      } else {
        setStatus("Restore cancelled.");
      }
    } catch (err) {
      setStatus(`Pull failed: ${err.message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="gist-sync-wrap">
      <button className="btn ghost" onClick={() => setOpen((v) => !v)}>
        <Icon name="spark" size={15} /> Cloud sync {cfg.gistId ? "· Linked" : ""}
      </button>
      {open && (
        <div className="panel gist-sync-panel">
          <div className="gist-sync-row">
            <label>
              <span>GitHub PAT (<code>gist</code> scope, stored locally)</span>
              <input type="password" value={cfg.token} onChange={(e) => updateCfg({ token: e.target.value })} placeholder="ghp_..." />
            </label>
            <label>
              <span>Gist ID (leave blank on first push)</span>
              <input type="text" value={cfg.gistId} onChange={(e) => updateCfg({ gistId: e.target.value })} placeholder="auto-created on push" />
            </label>
            <div className="gist-sync-btns">
              <button className="btn btn-green sm" disabled={busy} onClick={pushGist}>Push</button>
              <button className="btn ghost sm" disabled={busy} onClick={pullGist}>Pull</button>
            </div>
          </div>
          {(status || cfg.lastSyncAt) && (
            <p className="gist-sync-note">
              {status || `Last synced: ${new Date(cfg.lastSyncAt).toLocaleString("en-IN")}`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Dashboard({ go, progress, summary, review, onStartReview, onResetProgress, onImportProgress, onRestoreProgress }) {
  const ds = window.UPSC;
  const importRef = React.useRef(null);
  const history = progress.history || [];
  const subjectRows = buildSubjectRows(history);
  const confidenceRows = buildConfidenceRows(history);
  const weakRows = subjectRows.filter((row) => row.attempted > 0).slice(0, 4);
  const aiSets = ds.getQuestionSetsBySource("ai");
  const aiPracticeSetId = aiSets[aiSets.length - 1]?.id || ds.defaultPracticeSetId;
  const resetLabel = progress.resetAt ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(progress.resetAt)) : "today";
  return (
    <div className="page-wrap dash">
      <div className="dash-top">
        <div>
          <button className="link-btn back" onClick={() => go("home")}><Icon name="arrowL" size={14} /> Home</button>
          <h1 className="dash-h1">Your progress</h1>
          <p className="dash-sub">Local stats since {resetLabel}.</p>
        </div>
        <div className="dash-actions">
          <button className="btn ghost" onClick={() => exportProgress(progress)}><Icon name="download" size={15} /> Export history</button>
          <button className="btn ghost" onClick={() => importRef.current && importRef.current.click()}><Icon name="upload" size={15} /> Restore backup</button>
          <input
            ref={importRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={(event) => {
              const file = event.target.files && event.target.files[0];
              event.target.value = "";
              onImportProgress?.(file);
            }}
          />
          <GistSyncBar progress={progress} onRestoreProgress={onRestoreProgress} />
          <OfflineButton />
          <button className="btn btn-danger" onClick={onResetProgress}><Icon name="x" size={15} /> Reset stats</button>
        </div>
      </div>

      <div className="dash-stats">
        <div className="dstat"><span className="dstat-icon tone-green"><Icon name="target" size={18} /></span><div><div className="dstat-v">{summary.averageAccuracy}%</div><div className="dstat-l">Avg accuracy</div></div></div>
        <div className="dstat"><span className="dstat-icon tone-saffron"><Icon name="flame" size={18} /></span><div><div className="dstat-v">{summary.streak}</div><div className="dstat-l">Day streak</div></div></div>
        <div className="dstat"><span className="dstat-icon tone-indigo"><Icon name="trophy" size={18} /></span><div><div className="dstat-v">{summary.bestScore || 0}</div><div className="dstat-l">Best score</div></div></div>
        <div className="dstat"><span className="dstat-icon tone-rose"><Icon name="layers" size={18} /></span><div><div className="dstat-v">{summary.questionsSolved.toLocaleString("en-IN")}</div><div className="dstat-l">Questions solved</div></div></div>
      </div>

      <div className="dash-grid">
        <ReviewQueueCard review={review} onStartReview={onStartReview} />

        <section className="panel dash-trend">
          <header className="panel-head row">
            <div><h3>Accuracy trend</h3><p>{history.length ? `Last ${Math.min(history.length, 6)} attempts` : "No attempts recorded"}</p></div>
            <span className="trend-delta up"><Icon name="arrowR" size={13} style={{ transform: "rotate(-45deg)" }} /> Local</span>
          </header>
          <div className="panel-body"><TrendChart data={history.slice(-6)} /></div>
        </section>

        <section className="panel dash-weak">
          <header className="panel-head"><h3>Topics to revise</h3><p>Lowest subject accuracy</p></header>
          <div className="panel-body weak-list">
            {weakRows.length ? weakRows.map((w) => (
              <div className="weak-item" key={w.subject}>
                <div className="weak-info">
                  <strong>{w.subject}</strong>
                  <span><i className={`subdot tone-${SUBJECT_TONE[w.subject] || "neutral"}`} />{w.attempted}/{w.total} attempted</span>
                </div>
                <div className="weak-acc">
                  <span className="weak-pct">{w.acc}%</span>
                  <button className="mini-btn" onClick={() => go("test", { setId: aiPracticeSetId })}>Practise</button>
                </div>
              </div>
            )) : (
              <div className="empty-panel">
                <strong>No weak-topic data yet.</strong>
                <span>Submit a test to build subject accuracy.</span>
              </div>
            )}
          </div>
        </section>

        <section className="panel dash-subjects">
          <header className="panel-head"><h3>Accuracy by subject</h3></header>
          <div className="panel-body bars">
            {subjectRows.length ? subjectRows.map((s) => (
              <div className="bar-row" key={s.subject}>
                <div className="bar-row-head">
                  <span className="bar-sub"><i className={`subdot tone-${SUBJECT_TONE[s.subject] || "neutral"}`} />{s.subject}</span>
                  <span className="bar-frac">{s.acc}% <em>· {s.attempted}/{s.total} Qs</em></span>
                </div>
                <div className="track"><div className={`fill tone-${SUBJECT_TONE[s.subject] || "neutral"}`} style={{ width: `${s.acc}%` }} /></div>
              </div>
            )) : (
              <div className="empty-panel">
                <strong>No subject split yet.</strong>
                <span>Submit a test to fill this chart.</span>
              </div>
            )}
          </div>
        </section>

        <section className="panel dash-recent">
          <header className="panel-head"><h3>Recent attempts</h3></header>
          <div className="panel-body recent-list">
            {history.length ? [...history].reverse().map((h) => (
              <div className="recent-item" key={h.id} onClick={() => go("result")}>
                <div className="recent-date">{h.date}</div>
                <div className="recent-info">
                  <strong>{h.label}</strong>
                  <span>{h.correct}/{h.attempted} correct · {h.accuracy}% accuracy{h.avgTimeSeconds ? ` · ${h.avgTimeSeconds}s/Q` : ""}</span>
                </div>
                <div className="recent-score">{h.score}<span>/{h.max}</span></div>
                <Icon name="chevR" size={16} />
              </div>
            )) : (
              <div className="empty-panel">
                <strong>No attempts yet.</strong>
                <span>Your next submitted test will appear here.</span>
              </div>
            )}
          </div>
        </section>

        {confidenceRows.length > 0 && (
          <section className="panel dash-confidence">
            <header className="panel-head"><h3>Confidence &amp; elimination</h3><p>Net marks and accuracy across tagged questions</p></header>
            <div className="panel-body conf-grid">
              {confidenceRows.map((row) => {
                const acc = Math.round((row.correct / row.attempted) * 100);
                return (
                  <div key={row.tier} className={`conf-stat tone-${row.tier}`}>
                    <strong>{row.label}</strong>
                    <span>{row.correct}/{row.attempted} correct ({acc}%)</span>
                    <em>{row.score >= 0 ? `+${row.score}` : row.score} marks</em>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, TrendChart });
