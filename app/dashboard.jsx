// Performance dashboard / history
function TrendChart({ data }) {
  const W = 640, H = 220, pad = 30;
  const vals = data.map((d) => d.accuracy);
  const min = Math.min(...vals) - 6, max = Math.max(...vals) + 6;
  const x = (i) => pad + (i * (W - pad * 2)) / (data.length - 1);
  const y = (v) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
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
        <g key={i}>
          <circle cx={x(i)} cy={y(d.accuracy)} r="4.5" className="trend-pt" />
          <text x={x(i)} y={H - 8} className="trend-x">{d.date}</text>
        </g>
      ))}
    </svg>
  );
}

function Dashboard({ go }) {
  const ds = window.UPSC;
  const last = ds.history[ds.history.length - 1];
  return (
    <div className="page-wrap dash">
      <div className="dash-top">
        <div>
          <button className="link-btn back" onClick={() => go("home")}><Icon name="arrowL" size={14} /> Home</button>
          <h1 className="dash-h1">Your progress</h1>
          <p className="dash-sub">Stored privately on this device — export anytime.</p>
        </div>
        <button className="btn ghost"><Icon name="download" size={15} /> Export history</button>
      </div>

      <div className="dash-stats">
        <div className="dstat"><span className="dstat-icon tone-green"><Icon name="target" size={18} /></span><div><div className="dstat-v">68%</div><div className="dstat-l">Avg accuracy</div></div></div>
        <div className="dstat"><span className="dstat-icon tone-saffron"><Icon name="flame" size={18} /></span><div><div className="dstat-v">14</div><div className="dstat-l">Day streak</div></div></div>
        <div className="dstat"><span className="dstat-icon tone-indigo"><Icon name="trophy" size={18} /></span><div><div className="dstat-v">108</div><div className="dstat-l">Best GS score</div></div></div>
        <div className="dstat"><span className="dstat-icon tone-rose"><Icon name="layers" size={18} /></span><div><div className="dstat-v">1,284</div><div className="dstat-l">Questions solved</div></div></div>
      </div>

      <div className="dash-grid">
        <section className="panel dash-trend">
          <header className="panel-head row">
            <div><h3>Accuracy trend</h3><p>Last 6 attempts</p></div>
            <span className="trend-delta up"><Icon name="arrowR" size={13} style={{ transform: "rotate(-45deg)" }} /> +10% this week</span>
          </header>
          <div className="panel-body"><TrendChart data={ds.history} /></div>
        </section>

        <section className="panel dash-weak">
          <header className="panel-head"><h3>Topics to revise</h3><p>Lowest accuracy</p></header>
          <div className="panel-body weak-list">
            {ds.weakTopics.map((w) => (
              <div className="weak-item" key={w.topic}>
                <div className="weak-info">
                  <strong>{w.topic}</strong>
                  <span><i className={`subdot tone-${SUBJECT_TONE[w.subject] || "neutral"}`} />{w.subject}</span>
                </div>
                <div className="weak-acc">
                  <span className="weak-pct">{w.acc}%</span>
                  <button className="mini-btn" onClick={() => go("test", { setId: "ai_generated_batch_1" })}>Practise</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel dash-subjects">
          <header className="panel-head"><h3>Accuracy by subject</h3></header>
          <div className="panel-body bars">
            {ds.subjectAccuracy.map((s) => (
              <div className="bar-row" key={s.subject}>
                <div className="bar-row-head">
                  <span className="bar-sub"><i className={`subdot tone-${SUBJECT_TONE[s.subject] || "neutral"}`} />{s.subject}</span>
                  <span className="bar-frac">{s.acc}% <em>· {s.attempts} Qs</em></span>
                </div>
                <div className="track"><div className={`fill tone-${SUBJECT_TONE[s.subject] || "neutral"}`} style={{ width: `${s.acc}%` }} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel dash-recent">
          <header className="panel-head"><h3>Recent attempts</h3></header>
          <div className="panel-body recent-list">
            {[...ds.history].reverse().map((h) => (
              <div className="recent-item" key={h.id} onClick={() => go("result")}>
                <div className="recent-date">{h.date}</div>
                <div className="recent-info">
                  <strong>{h.label}</strong>
                  <span>{h.correct}/{h.attempted} correct · {h.accuracy}% accuracy</span>
                </div>
                <div className="recent-score">{h.score}<span>/{h.max}</span></div>
                <Icon name="chevR" size={16} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard, TrendChart });
