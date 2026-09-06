// Practice setup screen - choose exam, source, and set before starting
const { useState: usePracticeState } = React;

function practiceDateLabel(isoDate) {
  if (!isoDate) return "";
  const [year, month, day] = String(isoDate).split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, day)));
}

function practiceBundleKey(set) {
  return window.UPSC_CONTENT.bundleKey(set);
}

function practiceBundleFor(set, sets) {
  const key = practiceBundleKey(set);
  if (!key) return [];
  return sets.filter((item) => practiceBundleKey(item) === key).sort((a, b) => {
    if (!!a.isSupplementary !== !!b.isSupplementary) return a.isSupplementary ? 1 : -1;
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  });
}

function practiceCollapseBundles(sets) {
  const byKey = new Map();
  for (const set of sets) {
    const key = practiceBundleKey(set);
    if (!byKey.has(key)) byKey.set(key, []);
    byKey.get(key).push(set);
  }
  return [...byKey.values()].map((items) => items.find((set) => !set.isSupplementary) || items[0]).filter(Boolean);
}

function PracticeScreen({ go }) {
  const ds = window.UPSC;
  const exams = [
    { id: "upsc", name: "UPSC CSE", note: "Prelims · GS + CSAT", live: true },
    { id: "ssc", name: "SSC CGL", note: "Coming soon", live: false },
    { id: "rbi", name: "RBI Grade B", note: "Coming soon", live: false },
    { id: "banking", name: "Banking", note: "Coming soon", live: false },
  ];
  const types = [
    { id: "pyq", title: "Previous-year paper", desc: "Choose a UPSC year from 2019-2026.", sourceType: "pyq", tone: "green", icon: "calendar" },
    { id: "daily", title: "Daily quiz", desc: "Pick a loaded daily current-affairs quiz.", sourceType: "daily", tone: "rose", icon: "flame" },
    { id: "rc", title: "Daily RC", desc: "Timed CSAT reading-comprehension drills.", sourceType: "rc", tone: "blue", icon: "book" },
    { id: "weekly-news", title: "Weekly news", desc: "Map-based places in news questions.", sourceType: "weekly-news", tone: "teal", icon: "map" },
    { id: "weekly-quiz", title: "Weekly quiz", desc: "Current affairs plus static recall MCQs.", sourceType: "weekly-quiz", tone: "indigo", icon: "layers" },
    { id: "pib", title: "PIB questions", desc: "Daily questions from PIB briefs and releases.", sourceType: "pib", tone: "green", icon: "fileText" },
    { id: "sectional", title: "Sectional test", desc: "Subject-wise prelims practice sets.", sourceType: "sectional", tone: "saffron", icon: "target" },
    { id: "full", title: "GS full mock", desc: "Complete GS practice papers.", sourceType: "ai", format: "full-paper", tone: "green", icon: "fileText" },
    { id: "monthly", title: "Monthly mock", desc: "Consolidated monthly practice.", sourceType: "ai", format: "monthly-mock", tone: "indigo", icon: "calendar" },
    { id: "ai", title: "Generated question set", desc: "Practice sets by batch.", sourceType: "ai", format: "drill", tone: "saffron", icon: "spark" },
    { id: "csr", title: "CSR mock test", desc: "Curated CSR mock batches.", sourceType: "csr", tone: "indigo", icon: "book" },
    { id: "csat", title: "CSAT practice", desc: "Paper II mocks and drills with CSAT marking.", sourceType: "csat", tone: "blue", icon: "target" },
  ];
  const [exam, setExam] = usePracticeState("upsc");
  const [type, setType] = usePracticeState("pyq");
  const [timed, setTimed] = usePracticeState(true);
  const currentType = types.find((item) => item.id === type) || types[0];
  const sets = ds.getQuestionSetsBySource(currentType.sourceType).filter((set) => !currentType.format || set.format === currentType.format);
  const setBundles = practiceCollapseBundles(sets);
  const [selectedSetId, setSelectedSetId] = usePracticeState(ds.getQuestionSetsBySource("pyq")[0]?.id || ds.defaultPracticeSetId);
  const selectedSet = sets.find((set) => set.id === selectedSetId) || sets[0] || null;
  const selectedExam = exams.find((item) => item.id === exam) || exams[0];

  function chooseType(nextType) {
    const nextSets = ds.getQuestionSetsBySource(nextType.sourceType).filter((set) => !nextType.format || set.format === nextType.format);
    setType(nextType.id);
    setSelectedSetId(nextSets[0]?.id || "");
  }

  function beginSelected() {
    if (!selectedExam.live || !selectedSet) return;
    go("test", { setId: selectedSet.id, timed, returnTo: "practice" });
  }

  return (
    <div className="page-wrap practice-page">
      <div className="practice-top">
        <div>
          <span className="eyebrow small"><span className="eyebrow-line" /> Practice setup</span>
          <h1 className="practice-h1">Choose what you want to test.</h1>
          <p className="practice-sub">Select the exam, question source, and exact paper or set before starting.</p>
        </div>
        <div className="practice-summary">
          <span>{selectedExam.name}</span>
          <strong>{selectedSet?.label || "No set selected"}</strong><button className="btn btn-green sm" onClick={beginSelected} disabled={!selectedSet}>Begin selected test</button>
          <em>{selectedSet ? `${selectedSet.questionCount} questions · ${timed ? selectedSet.durationMinutes + " min timed" : "untimed"}` : "Choose an available set"}</em>
        </div>
      </div>

      <div className="practice-grid">
        <div className="practice-exam-summary"><strong>UPSC CSE</strong><span>Prelims · GS + CSAT</span><details><summary>Other exams · coming soon</summary><p>SSC CGL · RBI Grade B · Banking</p></details></div>

        <section className="panel practice-panel">
          <header className="panel-head">
            <h3>Type</h3>
            <p>Pick what kind of practice you want.</p>
          </header>
          <div className="panel-body practice-types">
            {types.map((item) => (
              <button key={item.id} className={`practice-type tone-${item.tone}${type === item.id ? " on" : ""}`} onClick={() => chooseType(item)}>
                <span className="practice-type-icon"><Icon name={item.icon} size={18} /></span>
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="panel practice-sets">
        <header className="panel-head row">
          <div>
            <h3>{currentType.title}</h3>
            <p>{setBundles.length ? `${setBundles.length} date${setBundles.length === 1 ? "" : "s"} available` : "No sets are loaded yet."}</p>
          </div>
          <label className="switch">
            <input type="checkbox" checked={timed} onChange={(event) => setTimed(event.target.checked)} />
            <span className="track"><span className="thumb" /></span>
            <span className="switch-label"><Icon name="clock" size={15} /> Timed</span>
          </label>
        </header>
        <div className="panel-body">
          <div className="set-grid practice-set-grid">
            {setBundles.map((set) => {
              const bundle = practiceBundleFor(set, sets);
              const active = bundle.some((item) => item.id === selectedSet?.id);
              const addOn = bundle.find((item) => item.isSupplementary);
              const selectedInBundle = bundle.find((item) => item.id === selectedSet?.id) || set;
              return (
              <div key={practiceBundleKey(set)} className={`set-option${active ? " selected" : ""}`}>
                <button className="set-select" aria-pressed={active} onClick={() => setSelectedSetId(selectedInBundle.id)}>
                <span className="set-option-kicker">{set.year || (set.isoDate ? practiceDateLabel(set.isoDate) : set.shortLabel)}</span>
                {addOn && <span className="variant-chip">Practice Add-on</span>}
                <strong>{set.label}</strong>
                <span>{bundle.map((item) => `${window.UPSC_CONTENT.variantLabel(item)} ${item.questionCount}q`).join(" · ")}</span>
                </button>
                {bundle.length > 1 && (
                  <div className="set-variant-tabs" onClick={(event) => event.stopPropagation()}>
                    {bundle.map((item) => (
                      <button
                        key={item.id}
                        className={selectedSet?.id === item.id ? "on" : ""}
                        onClick={() => setSelectedSetId(item.id)}>
                        {window.UPSC_CONTENT.variantLabel(item)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );})}
          </div>
          {!sets.length && <div className="empty-panel"><strong>No sets yet.</strong><span>Choose another practice type or check back for the next set.</span></div>}
          <div className="practice-start">
            <button className="btn ghost" onClick={() => go("home")}><Icon name="arrowL" size={16} /> Home</button>
            <button className="btn btn-green" onClick={beginSelected} disabled={!selectedExam.live || !selectedSet}>
              <Icon name="play" size={16} /> Begin selected test
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { PracticeScreen });
