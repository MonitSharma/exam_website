// Root app — routing, top nav, tweaks
const { useState: useRootState, useEffect: useRootEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "vibe": "academic",
  "primary": "#1E4D3A",
  "accent": "#CB7A2E",
  "qFont": "serif",
  "density": "regular"
}/*EDITMODE-END*/;

const NAV = [
  { id: "home", label: "Home", icon: "home" },
  { id: "test", label: "Practice", icon: "play" },
  { id: "dashboard", label: "Progress", icon: "chart" },
];

function TopNav({ screen, go }) {
  const ds = window.UPSC;
  return (
    <header className="topnav">
      <div className="topnav-inner">
        <button className="nav-brand" onClick={() => go("home")}><Wordmark compact /></button>
        <nav className="nav-links">
          {NAV.map((n) => (
            <button key={n.id} className={`nav-link${screen === n.id ? " active" : ""}`} onClick={() => go(n.id)}>
              <Icon name={n.icon} size={16} /> {n.label}
            </button>
          ))}
        </nav>
        <div className="nav-right">
          <span className="streak-chip"><Icon name="flame" size={15} /> 14</span>
          <button className="btn btn-green sm" onClick={() => go("test", { setId: ds.defaultQuestionSetId })}><Icon name="bolt" size={15} /> Daily quiz</button>
        </div>
      </div>
    </header>
  );
}

function App() {
  const ds = window.UPSC;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useRootState("home");
  const [testSession, setTestSession] = useRootState({
    setId: ds.defaultPracticeSetId,
    returnTo: "home",
    timed: true,
  });
  const [lastResult, setLastResult] = useRootState({
    setId: ds.defaultQuestionSetId,
    questionSet: ds.getQuestionSetById(ds.defaultQuestionSetId),
    questions: ds.questions,
    answers: ds.demoAttempt,
    submittedAt: null,
  });

  useRootEffect(() => {
    const r = document.documentElement;
    r.style.setProperty("--green", t.primary);
    r.style.setProperty("--saffron", t.accent);
    document.body.dataset.vibe = t.vibe;
    document.body.dataset.qfont = t.qFont;
    document.body.dataset.density = t.density;
  }, [t]);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function go(s, options = {}) {
    if (s === "test") {
      setTestSession({
        setId: String(options.setId || ds.defaultPracticeSetId),
        returnTo: options.returnTo || (screen === "test" ? testSession.returnTo : screen) || "home",
        timed: options.timed !== false,
      });
    }
    setScreen(s);
    scrollTop();
  }

  function finishTest(result) {
    setLastResult({
      ...result,
      submittedAt: Date.now(),
    });
    setScreen("result");
    scrollTop();
  }

  const isTest = screen === "test";

  return (
    <div className="root">
      {!isTest && <TopNav screen={screen} go={go} />}
      <div key={screen} className="screen-fade">
        {screen === "home" && <Home go={go} />}
        {screen === "test" && <TestScreen go={go} session={testSession} onSubmit={finishTest} />}
        {screen === "result" && <Results go={go} result={lastResult} />}
        {screen === "review" && <Review go={go} result={lastResult} />}
        {screen === "dashboard" && <Dashboard go={go} />}
      </div>

      {!isTest && (
        <footer className="site-foot">
          <Wordmark compact />
          <span>Free &amp; open practice bank · Built for UPSC aspirants · Scores stay on your device</span>
        </footer>
      )}

      <TweaksPanel>
        <TweakSection label="Vibe" />
        <TweakRadio label="Direction" value={t.vibe}
          options={["academic", "edtech", "minimal"]}
          onChange={(v) => setTweak("vibe", v)} />
        <TweakSection label="Colour" />
        <TweakColor label="Primary" value={t.primary}
          options={["#1E4D3A", "#1B4965", "#3A4A2F", "#2A2A33"]}
          onChange={(v) => setTweak("primary", v)} />
        <TweakColor label="Accent" value={t.accent}
          options={["#CB7A2E", "#C25B3E", "#B59020", "#7A5BA6"]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Reading" />
        <TweakRadio label="Question type" value={t.qFont}
          options={["serif", "sans"]}
          onChange={(v) => setTweak("qFont", v)} />
        <TweakRadio label="Density" value={t.density}
          options={["compact", "regular", "comfy"]}
          onChange={(v) => setTweak("density", v)} />
        <TweakSection label="Jump to screen" />
        <div className="tweak-jump">
          {[["home", "Home"], ["test", "Test"], ["result", "Results"], ["review", "Review"], ["dashboard", "Progress"]].map(([k, l]) => (
            <button key={k} className={`jbtn${screen === k ? " on" : ""}`} onClick={() => go(k, k === "test" ? { setId: ds.defaultPracticeSetId } : {})}>{l}</button>
          ))}
        </div>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
