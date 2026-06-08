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
  link.download = "pariksha-progress.json";
  link.click();
  URL.revokeObjectURL(url);
}

function Dashboard({ go, progress, summary, onResetProgress }) {
  const ds = window.UPSC;
  const history = progress.history || [];
  const subjectRows = buildSubjectRows(history);
  const weakRows = subjectRows.filter((row) => row.attempted > 0).slice(0, 4);
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
                  <button className="mini-btn" onClick={() => go("test", { setId: "ai_generated_batch_1" })}>Practise</button>
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
                  <span>{h.correct}/{h.attempted} correct · {h.accuracy}% accuracy</span>
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
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, TrendChart });
