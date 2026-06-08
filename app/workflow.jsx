// Study workflow dashboard - native version of the standalone UPSC tracker
const { useState: useWorkflowState } = React;

const WORKFLOW_PRELIMS = new Date("2027-05-24T00:00:00");
const WORKFLOW_PLAN_START = new Date("2026-06-02T00:00:00");
const WORKFLOW_FORTNIGHTS = [
  ["F1", "2026-06-02", "2026-06-15", "Setup & diagnostics", "Foundation"],
  ["F2", "2026-06-16", "2026-06-29", "Polity + Economy foundation", "Foundation"],
  ["F3", "2026-06-30", "2026-07-13", "Polity deep + Economy NCERT 12", "Foundation"],
  ["F4", "2026-07-14", "2026-07-27", "Economy Mrunal Pillar 1 (Banking)", "Foundation"],
  ["F5", "2026-07-28", "2026-08-10", "Economy Pillar 2 + History deep", "Foundation"],
  ["F6", "2026-08-11", "2026-08-24", "Pillar 3 + Env biodiversity", "Foundation"],
  ["F7", "2026-08-25", "2026-09-07", "Economy Pillar 4 + Sci-Tech build", "Foundation"],
  ["F8", "2026-09-08", "2026-09-21", "Economy Pillar 5 (RBI P1 prep)", "Foundation"],
  ["F9", "2026-09-22", "2026-10-05", "Econ Survey + IR expand", "Foundation"],
  ["F10", "2026-10-06", "2026-10-19", "Polity consolidation + Art/Culture", "Foundation"],
  ["F11", "2026-10-20", "2026-11-02", "RBI P1 exam + History complete", "Foundation"],
  ["F12", "2026-11-03", "2026-11-16", "Integration kickoff (Phase 2)", "Integration"],
  ["F13", "2026-11-17", "2026-11-30", "Phase 2 depth (Pass-2)", "Integration"],
  ["F14", "2026-12-01", "2026-12-14", "Sci-Tech + Geography deep", "Integration"],
  ["F15", "2026-12-15", "2026-12-28", "Art & Culture + IR deepening", "Integration"],
  ["F16", "2026-12-29", "2027-01-11", "Ethics deep + revision", "Integration"],
  ["F17", "2027-01-12", "2027-01-25", "Budget + Econ Survey heavy", "Integration"],
  ["F18", "2027-01-26", "2027-02-08", "Prelims Mode begins (Phase 3)", "Prelims Mode"],
  ["F19", "2027-02-09", "2027-02-22", "Prelims Mode intensity", "Prelims Mode"],
  ["F20", "2027-02-23", "2027-03-08", "Weak-area drilling", "Prelims Mode"],
  ["F21", "2027-03-09", "2027-03-22", "Revision Cycle 1", "Prelims Mode"],
  ["F22", "2027-03-23", "2027-04-05", "Revision Cycle 2 + PYQ marathon", "Prelims Mode"],
  ["F23", "2027-04-06", "2027-04-19", "Final consolidation", "Prelims Mode"],
  ["F24", "2027-04-20", "2027-05-24", "Prelims countdown", "Prelims Mode"],
];

const WORKFLOW_KPI = {
  "Foundation": [["Study hours/week", "28+"], ["Newspaper", "7/7"], ["New topic pages", "10-12"], ["Mains answers", "5-10"], ["MCQs", "50"], ["Mocks", "1-2 sectional"]],
  "Integration": [["Study hours/week", "35+"], ["Newspaper", "7/7"], ["New pages", "5-8 cross-link"], ["Mains answers", "14+"], ["MCQs", "300+"], ["Mocks", "1 full + 1 sectional"]],
  "Prelims Mode": [["Study hours/week", "40+"], ["Newspaper", "7/7"], ["New pages", "0 revision"], ["Mains answers", "0"], ["MCQs", "700+"], ["Mocks", "2 full"]],
  "Mains Factory": [["Physics Optional", "daily"], ["GS Mains answers", "4/day"], ["Essay", "weekly"], ["Ethics cases", "alt days"], ["Newspaper", "7/7"], ["Revision", "rotation"]],
};
const WORKFLOW_HOURS_TARGET = { "Foundation": 28, "Integration": 35, "Prelims Mode": 40, "Mains Factory": 40 };

const WORKFLOW_FOCUS = {
  "Foundation": [
    ["Sunday Sweep (90m)", "Sectional mock or Mains 4-Q", "Plan next week"],
    ["Newspaper: IR", "Polity - Laxmikanth", "Physics P-I: Mechanics", "GS2 Mains answer"],
    ["Newspaper: Economy", "Economy - Mrunal/NCERT", "RBI ESI", "GS3 Eco Mains answer"],
    ["Newspaper: History", "Modern History - Spectrum", "Physics: EM", "GS1 Mains answer"],
    ["Newspaper: Sci/Env", "Sci-Tech + Environment", "RBI FM Finance", "GS3 Mains answer"],
    ["Newspaper: IR", "IR - NCERT 12 + MEA", "Physics: Waves/Thermo", "GS2 IR Mains answer"],
    ["Newspaper + magazine", "Geography / Art&Culture", "CSAT mock or map drill", "Ethics case"],
  ],
  "Integration": [
    ["Sunday Sweep", "Full Prelims mock or Mains sectional", "Plan next week"],
    ["Newspaper", "Polity Pass-2 + cross-linking", "Physics II: QM", "2 timed Mains answers"],
    ["Newspaper", "Economy Pass-2 + Eco Survey", "Physics II: Atomic/Nuclear", "2 timed Mains answers"],
    ["Newspaper", "History Pass-2", "Physics II: Solid State", "2 timed Mains answers"],
    ["Newspaper", "Sci-Tech + Env Pass-2", "Physics II: Electronics", "2 timed Mains answers"],
    ["Newspaper", "IR + Internal Security", "Physics II: SR + revision", "2 timed Mains answers"],
    ["Newspaper", "Geography + Art & Culture", "Per-subject sectional mock", "Ethics case + answer"],
  ],
  "Prelims Mode": [
    ["Sunday Sweep", "Full-length Prelims mock", "Plan next week"],
    ["News (30m)", "Polity revision", "100 MCQ batch + debrief", "CA revision + Physics formulas"],
    ["News (30m)", "Economy revision", "100 MCQ batch + debrief", "CA revision + Physics formulas"],
    ["News (30m)", "History revision", "100 MCQ batch + debrief", "CA revision + Physics formulas"],
    ["News (30m)", "Sci-Tech / Environment revision", "100 MCQ batch + debrief", "CA revision + Physics formulas"],
    ["News (30m)", "IR / Geography revision", "100 MCQ batch + debrief", "CA revision + Physics formulas"],
    ["News (30m)", "Society / Art&Culture / Misc revision", "Mock + debrief", "CA revision + Physics formulas"],
  ],
  "Mains Factory": [
    ["Lighter day", "Essay practice / Ethics case", "Revision rotation"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Debrief + revision"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Debrief + revision"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Debrief + revision"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Debrief + revision"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Essay practice"],
    ["Newspaper (op-eds)", "Physics Optional", "4 GS Mains answers", "Ethics case + revision"],
  ],
};

const WORKFLOW_SYLLABUS = {
  "Polity": ["NCERT 11", "Laxmikanth Pass-1", "Laxmikanth Pass-2 (PYQ)", "PYQ practice", "Cross-linking"],
  "Economy": ["NCERT 11 + 12", "Mrunal Pillars 1-2", "Mrunal Pillars 3-5", "Sanjeev Verma", "Eco Survey + Budget"],
  "Modern History": ["NCERT 8 + 10", "Spectrum Pass-1", "Spectrum Pass-2", "INM timeline", "PYQ"],
  "Ancient/Medieval": ["TN Board Ancient", "TN Board Medieval", "Dynasties + map", "PYQ"],
  "Art & Culture": ["Nitin Singhania P1", "P2 Painting/Music", "P3 Dance/Lit", "CCRT browse"],
  "Geography": ["NCERT 11 Physical", "G.C. Leong", "Khullar Indian", "NCERT 12 Human", "PMFIAS + maps"],
  "Environment": ["NCERT 12 Bio", "Shankar Ch 1-7", "Shankar Ch 8-end", "IPCC / NDC", "PMFIAS consolidation"],
  "Sci-Tech": ["NCERT 9-10 skim", "Vision CA compilations", "Per-tech pages", "PIB/ISRO/DRDO updates"],
  "IR": ["NCERT 12", "MEA Annual Report", "Bilateral pages", "Multilateral pages", "ORF/IDSA briefs"],
  "Internal Security": ["Ashok Kumar", "2nd ARC 5", "2nd ARC 8", "CA updates"],
  "Society": ["NCERT 11 + 12", "Reports bank", "CA"],
  "Ethics": ["Lexicon basics", "Subba Rao framework", "2nd ARC 4", "Thinkers bank", "Anudeep cases"],
  "CSAT": ["Diagnostic PYQs", "Daily RC drill", "Weak-topic drills", "Fortnightly mocks", "80+ safety target"],
  "Physics Paper I": ["Mechanics", "EM (Griffiths)", "Waves & Optics", "Thermo & Stat Mech"],
  "Physics Paper II": ["QM", "Atomic & Molecular", "Nuclear", "Solid State", "Electronics", "Special Relativity"],
};
const WORKFLOW_REV_SUBJECTS = Object.keys(WORKFLOW_SYLLABUS).filter((subject) => subject !== "CSAT").concat("CSAT");
const WORKFLOW_LS = { M: "upsc_mock_scores_v1", W: "upsc_weak_areas_v1", H: "upsc_hours_v1", REV: "upsc_rev_v1", COV: "upsc_cov_v1" };

function workflowLoad(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch (error) {
    return fallback;
  }
}

function workflowSave(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function workflowFmt(value) {
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function workflowIsoToday() {
  return new Date().toISOString().slice(0, 10);
}

function workflowWeekStart() {
  const date = new Date();
  const day = (date.getDay() + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date;
}

function getWorkflowContext() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = Math.max(0, Math.round((WORKFLOW_PRELIMS - today) / 86400000));
  const current = WORKFLOW_FORTNIGHTS.find((item) => today >= new Date(item[1]) && today <= new Date(`${item[2]}T23:59:59`));
  let phase, fortnight, fnDates, focus, next;
  if (today < WORKFLOW_PLAN_START) {
    phase = "Foundation";
    fortnight = "Before F1";
    fnDates = `Plan starts ${workflowFmt(WORKFLOW_PLAN_START)}`;
    focus = "Setup phase ahead";
    next = `${WORKFLOW_FORTNIGHTS[0][0]} - ${WORKFLOW_FORTNIGHTS[0][3]}`;
  } else if (today > WORKFLOW_PRELIMS) {
    phase = "Mains Factory";
    fortnight = "Post-Prelims";
    fnDates = "Mains phase -> 30 Sep 2027";
    focus = "Optional + answer writing at full intensity";
    next = "Mains 2027";
  } else if (current) {
    phase = current[4];
    fortnight = current[0];
    fnDates = `${workflowFmt(current[1])} - ${workflowFmt(current[2])}`;
    focus = current[3];
    const index = WORKFLOW_FORTNIGHTS.indexOf(current);
    next = index < WORKFLOW_FORTNIGHTS.length - 1 ? `${WORKFLOW_FORTNIGHTS[index + 1][0]} - ${WORKFLOW_FORTNIGHTS[index + 1][3]}` : "Prelims day";
  } else {
    phase = "Foundation";
    fortnight = "-";
    fnDates = "";
    focus = "";
    next = WORKFLOW_FORTNIGHTS[0][0];
  }
  const totalDays = (WORKFLOW_PRELIMS - WORKFLOW_PLAN_START) / 86400000;
  const planPercent = Math.max(0, Math.min(100, Math.round(((today - WORKFLOW_PLAN_START) / 86400000 / totalDays) * 100)));
  return { today, days, phase, fortnight, fnDates, focus, next, planPercent };
}

function WorkflowTrend({ mocks }) {
  const W = 520, H = 150, pad = 24;
  if (!mocks.length) {
    return <div className="workflow-empty">No mock scores logged yet.</div>;
  }
  const values = mocks.map((item) => Math.round((item.score / item.max) * 100));
  const x = (index) => mocks.length === 1 ? W / 2 : pad + (index * (W - pad * 2)) / (mocks.length - 1);
  const y = (value) => H - pad - (value / 100) * (H - pad * 2);
  const line = values.map((value, index) => `${index ? "L" : "M"}${x(index)},${y(value)}`).join(" ");
  return (
    <svg className="workflow-trend" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      {[0, 50, 100].map((tick) => <line key={tick} x1={pad} x2={W - pad} y1={y(tick)} y2={y(tick)} className="workflow-grid-line" />)}
      <path d={line} className="workflow-trend-line" />
      {values.map((value, index) => <circle key={`${mocks[index].id}-${index}`} cx={x(index)} cy={y(value)} r="4" className="workflow-trend-dot" />)}
    </svg>
  );
}

function StudyWorkflowDashboard() {
  const context = getWorkflowContext();
  const [hours, setHours] = useWorkflowState(() => workflowLoad(WORKFLOW_LS.H, []));
  const [hourForm, setHourForm] = useWorkflowState({ date: workflowIsoToday(), hours: "" });
  const [weakAreas, setWeakAreas] = useWorkflowState(() => workflowLoad(WORKFLOW_LS.W, []));
  const [weakInput, setWeakInput] = useWorkflowState("");
  const [revision, setRevision] = useWorkflowState(() => {
    const week = workflowWeekStart().toISOString().slice(0, 10);
    const stored = workflowLoad(WORKFLOW_LS.REV, { ws: week, checked: {} });
    return stored.ws === week ? stored : { ws: week, checked: {} };
  });
  const [coverage, setCoverage] = useWorkflowState(() => workflowLoad(WORKFLOW_LS.COV, {}));
  const [mocks, setMocks] = useWorkflowState(() => workflowLoad(WORKFLOW_LS.M, []));
  const [mockForm, setMockForm] = useWorkflowState({ date: workflowIsoToday(), type: "Prelims (full)", score: "", max: "200" });
  const weekStart = workflowWeekStart();
  const phaseTarget = WORKFLOW_HOURS_TARGET[context.phase] || 28;
  const weeklyHours = hours.filter((entry) => new Date(entry.date) >= weekStart).reduce((sum, entry) => sum + (Number(entry.hours) || 0), 0);
  const focusBlocks = (WORKFLOW_FOCUS[context.phase] || WORKFLOW_FOCUS.Foundation)[new Date().getDay()];
  const revisionDone = WORKFLOW_REV_SUBJECTS.filter((subject) => revision.checked?.[subject]).length;
  const coverageRows = Object.entries(WORKFLOW_SYLLABUS);
  const coverageTotals = coverageRows.reduce((acc, [subject, items]) => {
    items.forEach((item) => {
      acc.total++;
      if (coverage[`${subject}||${item}`]) acc.done++;
    });
    return acc;
  }, { done: 0, total: 0 });
  const coveragePercent = Math.round((coverageTotals.done / (coverageTotals.total || 1)) * 100);
  const sortedMocks = [...mocks].sort((a, b) => a.date.localeCompare(b.date));

  function saveHours(next) {
    workflowSave(WORKFLOW_LS.H, next);
    setHours(next);
  }

  function saveWeakAreas(next) {
    workflowSave(WORKFLOW_LS.W, next);
    setWeakAreas(next);
  }

  function saveRevision(next) {
    workflowSave(WORKFLOW_LS.REV, next);
    setRevision(next);
  }

  function saveCoverage(next) {
    workflowSave(WORKFLOW_LS.COV, next);
    setCoverage(next);
  }

  function saveMocks(next) {
    workflowSave(WORKFLOW_LS.M, next);
    setMocks(next);
  }

  function addHours() {
    const value = Number(hourForm.hours);
    if (!hourForm.date || Number.isNaN(value) || value <= 0) return;
    saveHours([...hours, { date: hourForm.date, hours: value }]);
    setHourForm({ ...hourForm, hours: "" });
  }

  function addWeakArea() {
    const value = weakInput.trim();
    if (!value) return;
    saveWeakAreas([...weakAreas, value]);
    setWeakInput("");
  }

  function addMock() {
    const score = Number(mockForm.score);
    const max = Number(mockForm.max);
    if (!mockForm.date || Number.isNaN(score) || Number.isNaN(max) || max <= 0) return;
    saveMocks([...mocks, { id: Date.now(), date: mockForm.date, type: mockForm.type, score, max }]);
    setMockForm({ ...mockForm, score: "" });
  }

  function toggleRevision(subject) {
    saveRevision({ ...revision, checked: { ...(revision.checked || {}), [subject]: !revision.checked?.[subject] } });
  }

  function toggleCoverage(subject, item) {
    const key = `${subject}||${item}`;
    saveCoverage({ ...coverage, [key]: !coverage[key] });
  }

  return (
    <section className="workflow">
      <div className="workflow-title">
        <div>
          <span className="eyebrow small"><span className="eyebrow-line" /> Study workflow</span>
          <h2>UPSC CSE 2027 plan dashboard</h2>
          <p>Calendar phase, weekly execution, CSAT insurance, syllabus coverage and mocks in one progress page.</p>
        </div>
        <a className="link-btn" href="upsc_dashboard.html" target="_blank" rel="noreferrer">Open standalone dashboard <Icon name="arrowR" size={14} /></a>
      </div>

      <div className="workflow-cards">
        <div className="workflow-card hero"><span>Days to Prelims</span><strong>{context.days}</strong><em>{workflowFmt(WORKFLOW_PRELIMS)}</em></div>
        <div className="workflow-card"><span>Current phase</span><strong>{context.phase}</strong><em>{context.focus}</em></div>
        <div className="workflow-card"><span>Fortnight</span><strong>{context.fortnight}</strong><em>{context.fnDates}</em></div>
      </div>

      <div className="workflow-card wide">
        <div className="workflow-row clean"><strong>{context.focus}</strong><span>{context.planPercent}% elapsed</span></div>
        <div className="workflow-bar"><i style={{ width: `${context.planPercent}%` }} /></div>
        <p className="muted">Next: {context.next}</p>
      </div>

      <div className="workflow-grid">
        <div className="workflow-card">
          <span>Today's focus</span>
          <div className="workflow-focus">{focusBlocks.map((item) => <b key={item}>{item}</b>)}</div>
        </div>
        <div className="workflow-card">
          <span>This phase's weekly KPIs</span>
          {(WORKFLOW_KPI[context.phase] || WORKFLOW_KPI.Foundation).map(([label, value]) => (
            <div className="workflow-row" key={label}><em>{label}</em><strong>{value}</strong></div>
          ))}
        </div>
      </div>

      <div className="workflow-grid">
        <div className="workflow-card">
          <span>Study hours this week</span>
          <div className="workflow-row clean"><strong>{Math.round(weeklyHours * 10) / 10} h logged</strong><em>target {phaseTarget}+</em></div>
          <div className="workflow-bar green"><i style={{ width: `${Math.min(100, Math.round((weeklyHours / phaseTarget) * 100))}%` }} /></div>
          <div className="workflow-form">
            <input type="date" value={hourForm.date} onChange={(event) => setHourForm({ ...hourForm, date: event.target.value })} />
            <input type="number" min="0" step="0.5" placeholder="hrs" value={hourForm.hours} onChange={(event) => setHourForm({ ...hourForm, hours: event.target.value })} />
            <button className="mini-btn solid" onClick={addHours}>Log hours</button>
          </div>
        </div>
        <div className="workflow-card">
          <span>CSAT insurance</span>
          <div className="workflow-focus">
            <b>Daily RC drill</b><b>Weekly CSAT set</b><b>Fortnightly full mock</b><b>80+ safety target</b>
          </div>
          <p className="muted">Daily RC drills are under Home -> Notes -> Daily; full CSAT mocks are under Practice -> CSAT full mock.</p>
        </div>
      </div>

      <div className="workflow-grid">
        <div className="workflow-card">
          <span>Revision this week - {revisionDone}/{WORKFLOW_REV_SUBJECTS.length}</span>
          <div className="workflow-checks">
            {WORKFLOW_REV_SUBJECTS.map((subject) => (
              <label key={subject}><input type="checkbox" checked={Boolean(revision.checked?.[subject])} onChange={() => toggleRevision(subject)} />{subject}</label>
            ))}
          </div>
        </div>
        <div className="workflow-card">
          <span>Weak areas to drill</span>
          <div className="workflow-form">
            <input type="text" placeholder="e.g. CSAT - inference RC" value={weakInput} onChange={(event) => setWeakInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addWeakArea()} />
            <button className="mini-btn solid" onClick={addWeakArea}>Add</button>
          </div>
          <div className="workflow-list">
            {weakAreas.length ? weakAreas.map((area, index) => (
              <div className="workflow-row" key={`${area}-${index}`}><em>{area}</em><button className="mini-btn" onClick={() => saveWeakAreas(weakAreas.filter((_, itemIndex) => itemIndex !== index))}>remove</button></div>
            )) : <p className="workflow-empty">Nothing yet. Add weak topics as mocks reveal them.</p>}
          </div>
        </div>
      </div>

      <div className="workflow-card">
        <span>Syllabus coverage - {coveragePercent}% overall</span>
        <div className="workflow-syllabus">
          {coverageRows.map(([subject, items]) => {
            const done = items.filter((item) => coverage[`${subject}||${item}`]).length;
            return (
              <details className="workflow-subject" key={subject}>
                <summary><strong>{subject}</strong><em>{done}/{items.length}</em></summary>
                <div className="workflow-checks compact">
                  {items.map((item) => <label key={item}><input type="checkbox" checked={Boolean(coverage[`${subject}||${item}`])} onChange={() => toggleCoverage(subject, item)} />{item}</label>)}
                </div>
              </details>
            );
          })}
        </div>
      </div>

      <div className="workflow-card">
        <span>Mock score tracker</span>
        <div className="workflow-form">
          <input type="date" value={mockForm.date} onChange={(event) => setMockForm({ ...mockForm, date: event.target.value })} />
          <select value={mockForm.type} onChange={(event) => setMockForm({ ...mockForm, type: event.target.value })}>
            {["Prelims (full)", "Prelims (sectional)", "CSAT", "Monthly mini-mock", "Physics", "RBI", "SSC"].map((type) => <option key={type}>{type}</option>)}
          </select>
          <input type="number" min="0" placeholder="score" value={mockForm.score} onChange={(event) => setMockForm({ ...mockForm, score: event.target.value })} />
          <input type="number" min="1" placeholder="max" value={mockForm.max} onChange={(event) => setMockForm({ ...mockForm, max: event.target.value })} />
          <button className="mini-btn solid" onClick={addMock}>Log</button>
        </div>
        <WorkflowTrend mocks={sortedMocks} />
        <div className="workflow-table">
          {sortedMocks.length ? sortedMocks.map((mock) => (
            <div className="workflow-row" key={mock.id}>
              <em>{workflowFmt(mock.date)} · {mock.type}</em>
              <strong>{mock.score}/{mock.max} · {Math.round((mock.score / mock.max) * 100)}%</strong>
              <button className="mini-btn" onClick={() => saveMocks(mocks.filter((item) => item.id !== mock.id))}>x</button>
            </div>
          )) : <p className="workflow-empty">No scores logged yet.</p>}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { StudyWorkflowDashboard });
