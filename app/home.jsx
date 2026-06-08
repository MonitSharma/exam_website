// Home / landing + exam picker + daily quiz discovery
const { useState: useStateHome } = React;

function ExamSwitcher() {
  const exams = [
    { id: "upsc", name: "UPSC CSE", note: "Prelims · GS + CSAT", live: true },
    { id: "ssc", name: "SSC CGL", note: "Coming soon", live: false },
    { id: "rbi", name: "RBI Grade B", note: "Coming soon", live: false },
    { id: "bank", name: "Banking", note: "Coming soon", live: false },
  ];
  const [active, setActive] = useStateHome("upsc");
  return (
    <div className="exam-switch" role="tablist" aria-label="Exam">
      {exams.map((e) => (
        <button key={e.id} role="tab" aria-selected={active === e.id}
          className={`exam-tab${active === e.id ? " active" : ""}${!e.live ? " locked" : ""}`}
          onClick={() => e.live && setActive(e.id)}>
          <span className="exam-name">{e.name}</span>
          <span className="exam-note">{e.live ? e.note : <><span className="soon-dot" /> {e.note}</>}</span>
        </button>
      ))}
    </div>
  );
}

function DailyQuizCard({ go }) {
  const ds = window.UPSC;
  const dailyQuiz = ds.dailyQuiz;
  const dailySet = ds.getQuestionSetById(ds.defaultQuestionSetId);
  return (
    <article className="daily-card">
      <div className="daily-glow" aria-hidden="true" />
      <div className="daily-top">
        <span className="ai-badge"><Icon name="spark" size={14} /> AI · Current Affairs</span>
        <span className="daily-date">{dailyQuiz.dateLabel}</span>
      </div>
      <h2 className="daily-title">{dailyQuiz.title}</h2>
      <p className="daily-desc">{dailyQuiz.description}</p>
      <div className="daily-meta">
        <span><strong>{dailySet.questionCount || ds.questions.length}</strong> questions</span>
        <span className="dot-sep" />
        <span><strong>~{dailyQuiz.durationMinutes}</strong> min</span>
        <span className="dot-sep" />
        <span className="daily-subjects">Environment · IR · Economy</span>
      </div>
      <div className="daily-actions">
        <button className="btn btn-saffron" onClick={() => go("test", { setId: ds.defaultQuestionSetId })}>
          Start daily quiz <Icon name="arrowR" size={18} />
        </button>
        <span className="streak-inline"><Icon name="flame" size={16} /> 14-day streak</span>
      </div>
    </article>
  );
}

function BuildTest({ go }) {
  const ds = window.UPSC;
  const [paper, setPaper] = useStateHome("gs");
  const [year, setYear] = useStateHome(2025);
  const [timed, setTimed] = useStateHome(true);
  return (
    <section className="panel build-test">
      <header className="panel-head">
        <h3>Build a test</h3>
        <p>Full papers, year-wise, or mix your own set.</p>
      </header>
      <div className="panel-body build-body">
        <div className="seg-field">
          <label>Paper</label>
          <div className="segmented">
            {[["gs", "GS Paper I"], ["csat", "CSAT Paper II"]].map(([k, v]) => (
              <button key={k} className={paper === k ? "on" : ""} onClick={() => setPaper(k)}>{v}</button>
            ))}
          </div>
        </div>
        <div className="seg-field">
          <label>Year</label>
          <div className="year-chips">
            {ds.years.map((y) => (
              <button key={y} className={`year-chip${year === y ? " on" : ""}`} onClick={() => setYear(y)}>{y}</button>
            ))}
            <button className="year-chip mix"><Icon name="layers" size={13} /> Mix</button>
          </div>
        </div>
        <div className="build-foot">
          <label className="switch">
            <input type="checkbox" checked={timed} onChange={(e) => setTimed(e.target.checked)} />
            <span className="track"><span className="thumb" /></span>
            <span className="switch-label"><Icon name="clock" size={15} /> Timed · 2 hrs</span>
          </label>
          <button className="btn btn-green" onClick={() => go("test", { setId: String(year), timed })}>
            <Icon name="play" size={16} /> Begin test
          </button>
        </div>
      </div>
    </section>
  );
}

function Snapshot({ go }) {
  return (
    <section className="panel snapshot">
      <header className="panel-head row">
        <div><h3>Your snapshot</h3><p>Last 30 days</p></div>
        <button className="link-btn" onClick={() => go("dashboard")}>Full progress <Icon name="arrowR" size={14} /></button>
      </header>
      <div className="panel-body snap-body">
        <div className="snap-ring">
          <Ring value={0.68} size={104} stroke={9} color="var(--green)">
            <div className="ring-num">68<span>%</span></div>
            <div className="ring-cap">accuracy</div>
          </Ring>
        </div>
        <div className="snap-stats">
          <Stat value="1,284" label="Questions solved" />
          <Stat value="14" label="Day streak" tone="saffron" />
          <Stat value="108" label="Best GS score" sub="of 200" />
        </div>
      </div>
      <div className="continue-row" onClick={() => go("test", { setId: "2025" })}>
        <span className="cont-icon"><Icon name="play" size={15} /></span>
        <div className="cont-text">
          <strong>Resume — UPSC GS 2025</strong>
          <span>Question 34 of 100 · 48 min left</span>
        </div>
        <Icon name="chevR" size={18} />
      </div>
    </section>
  );
}

function BankBrowse({ go }) {
  const sets = [
    { icon: "calendar", title: "Previous-Year Papers", desc: "2019-2026 · GS Paper I", count: "8 papers", tone: "green", setId: "2025" },
    { icon: "spark", title: "AI Question Bank", desc: "Topic-wise generated sets", count: "93 Qs", tone: "saffron", setId: "ai_generated_batch_1" },
    { icon: "book", title: "CSR Mock Series", desc: "Curated standard mocks", count: "58 Qs", tone: "indigo", setId: "csr_batch_1" },
    { icon: "flame", title: "Daily Quizzes", desc: "Current-affairs, every day", count: "New today", tone: "rose", setId: window.UPSC.defaultQuestionSetId },
  ];
  return (
    <section className="bank">
      <div className="bank-head">
        <h3>Explore the question bank</h3>
        <button className="link-btn" onClick={() => go("test", { setId: "2025" })}>Browse all <Icon name="arrowR" size={14} /></button>
      </div>
      <div className="bank-grid">
        {sets.map((s) => (
          <button key={s.title} className={`bank-card tone-${s.tone}`} onClick={() => go("test", { setId: s.setId })}>
            <span className="bank-icon"><Icon name={s.icon} size={20} /></span>
            <span className="bank-count">{s.count}</span>
            <strong>{s.title}</strong>
            <span className="bank-desc">{s.desc}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Home({ go }) {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-inner">
          <span className="eyebrow"><span className="eyebrow-line" /> Free · No login · Open practice bank</span>
          <h1 className="hero-title">
            Every UPSC question,<br /><em>one calm place to practise.</em>
          </h1>
          <p className="hero-sub">
            A decade of previous-year papers, AI-generated sets and a fresh daily quiz —
            with score tracking that quietly shows you what to revise next.
          </p>
          <ExamSwitcher />
        </div>
      </section>

      <div className="home-main">
        <div className="home-col-l">
          <DailyQuizCard go={go} />
          <BuildTest go={go} />
        </div>
        <div className="home-col-r">
          <Snapshot go={go} />
        </div>
      </div>

      <BankBrowse go={go} />
    </div>
  );
}

Object.assign(window, { Home });
