/* app/progress.js — attempt history, compaction and spaced repetition. */

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadBrowserModule, createLocalStorage } = require("./helpers");

function loadProgressModule() {
  const storage = createLocalStorage();
  const { window } = loadBrowserModule("app/progress.js", {
    localStorage: storage,
    // calculateDailyStreak / getProgressSummary reach into the data layer.
    window: { UPSC: { getQuestionSetsBySource: () => [], todayIso: "2026-08-10" } },
  });
  return { P: window.UPSC_PROGRESS, storage };
}

function attempt(index, { correct = 6, attempted = 10, score = 10, isoDate = "2026-01-01" } = {}) {
  return {
    id: `a${index}`, date: "01 Jan", isoDate, label: `Set ${index}`,
    questionSetId: `q${index}`, sourceType: "daily",
    score, max: 20, accuracy: 60, attempted, correct, wrong: attempted - correct, skipped: 0,
    subjectBreakdown: { Polity: { correct, attempted, total: attempted } },
  };
}

test("a fresh progress object is at the current version", () => {
  const { P } = loadProgressModule();
  const fresh = P.createFreshProgress(0);
  assert.equal(fresh.version, P.PROGRESS_VERSION);
  assert.deepEqual(fresh.history, []);
  assert.deepEqual(fresh.archive, []);
  assert.deepEqual(fresh.questionStats, {});
  assert.deepEqual(fresh.labStats, {});
});

test("history under the cap is left alone", () => {
  const { P } = loadProgressModule();
  const progress = { ...P.createFreshProgress(0), history: [attempt(1), attempt(2)] };
  const compacted = P.compactProgress(progress);
  assert.equal(compacted.history.length, 2);
  assert.equal(compacted.archive.length, 0);
});

test("history over the cap folds into month buckets without losing totals", () => {
  const { P } = loadProgressModule();
  const total = P.MAX_DETAILED_ATTEMPTS + 100;
  const history = [];
  for (let i = 0; i < total; i++) {
    const month = i < 60 ? "2026-01" : "2026-02";
    history.push(attempt(i, { isoDate: `${month}-15` }));
  }
  const compacted = P.compactProgress({ ...P.createFreshProgress(0), history });

  assert.equal(compacted.history.length, P.MAX_DETAILED_ATTEMPTS);
  const archived = compacted.archive.reduce((sum, row) => sum + row.attempts, 0);
  assert.equal(archived, 100, "every overflowing attempt is accounted for");

  const summary = P.getProgressSummary(compacted);
  assert.equal(summary.attempts, total, "lifetime attempt count survives compaction");
  assert.equal(summary.questionsSolved, total * 10);
  assert.equal(summary.averageAccuracy, 60);
  assert.equal(summary.bestScore, 10);
});

test("compaction is idempotent", () => {
  const { P } = loadProgressModule();
  const history = Array.from({ length: P.MAX_DETAILED_ATTEMPTS + 30 }, (_, i) => attempt(i));
  const once = P.compactProgress({ ...P.createFreshProgress(0), history });
  const twice = P.compactProgress(once);
  assert.deepEqual(twice.archive, once.archive);
  assert.equal(twice.history.length, once.history.length);
});

test("v2 and v3 progress migrate forward, anything else is rejected", () => {
  const { P } = loadProgressModule();
  const v2 = { version: 2, resetAt: 0, history: [attempt(1)], dailyCompletions: {} };
  const migrated = P.normalizeProgress(v2);
  assert.equal(migrated.version, P.PROGRESS_VERSION);
  assert.deepEqual(migrated.archive, []);
  assert.deepEqual(migrated.questionStats, {});

  const v3 = { version: 3, resetAt: 0, history: [], archive: [], dailyCompletions: {} };
  assert.equal(P.normalizeProgress(v3).version, P.PROGRESS_VERSION);

  assert.equal(P.normalizeProgress(null), null);
  assert.equal(P.normalizeProgress({ version: 99, history: [], dailyCompletions: {} }), null);
  assert.equal(P.normalizeProgress({ version: 2, history: "nope", dailyCompletions: {} }), null);
});

test("loadProgress writes back after a migration so storage does not stay stale", () => {
  const { P, storage } = loadProgressModule();
  storage.setItem(P.PROGRESS_STORAGE_KEY, JSON.stringify({
    version: 2, resetAt: 0, history: [attempt(1)], dailyCompletions: {},
  }));
  const loaded = P.loadProgress();
  assert.equal(loaded.version, P.PROGRESS_VERSION);
  const stored = JSON.parse(storage.getItem(P.PROGRESS_STORAGE_KEY));
  assert.equal(stored.version, P.PROGRESS_VERSION, "the migrated shape is persisted");
});

test("loadProgress recovers from corrupt storage instead of throwing", () => {
  const { P, storage } = loadProgressModule();
  storage.setItem(P.PROGRESS_STORAGE_KEY, "{not json");
  const loaded = P.loadProgress();
  assert.equal(loaded.version, P.PROGRESS_VERSION);
  assert.deepEqual(loaded.history, []);
});

test("saveProgress swallows a quota error rather than breaking the session", () => {
  const { P } = loadProgressModule();
  const exploding = createLocalStorage();
  exploding.setItem = () => { throw new Error("QuotaExceededError"); };
  const { window } = loadBrowserModule("app/progress.js", {
    localStorage: exploding,
    window: { UPSC: { getQuestionSetsBySource: () => [], todayIso: "2026-08-10" } },
  });
  assert.doesNotThrow(() => window.UPSC_PROGRESS.saveProgress(P.createFreshProgress(0)));
});

/* ---------- spaced repetition ---------- */

test("a question answered correctly the first time is never tracked", () => {
  const { P } = loadProgressModule();
  const stats = P.recordQuestionResult({}, { setId: "2025", n: 1, outcome: "correct" }, "2026-08-10");
  assert.deepEqual(stats, {});
});

test("a wrong answer schedules the question for tomorrow", () => {
  const { P } = loadProgressModule();
  const stats = P.recordQuestionResult({}, { setId: "2025", n: 1, subject: "Polity", outcome: "wrong" }, "2026-08-10");
  const entry = stats[P.questionKey("2025", 1)];
  assert.equal(entry.box, 0);
  assert.equal(entry.wrong, 1);
  assert.equal(entry.due, "2026-08-11");
  assert.equal(entry.subject, "Polity");
});

test("consecutive correct answers walk up the boxes and then retire the question", () => {
  const { P } = loadProgressModule();
  let stats = P.recordQuestionResult({}, { setId: "2025", n: 1, outcome: "wrong" }, "2026-01-01");
  const key = P.questionKey("2025", 1);
  const expectedDue = ["2026-01-05", "2026-01-12", "2026-01-28", "2026-03-04", "2026-06-02"];
  let day = "2026-01-02";
  for (let box = 1; box <= P.MASTERED_BOX; box++) {
    stats = P.recordQuestionResult(stats, { setId: "2025", n: 1, outcome: "correct" }, day);
    if (box < P.MASTERED_BOX) {
      assert.equal(stats[key].box, box, `box after ${box} correct answers`);
      assert.equal(stats[key].due, expectedDue[box - 1], `interval for box ${box}`);
      day = stats[key].due;
    }
  }
  assert.equal(stats[key], undefined, "mastered questions leave the queue");
});

test("a wrong answer resets a nearly-mastered question to box 0", () => {
  const { P } = loadProgressModule();
  const key = P.questionKey("2025", 1);
  const stats = P.recordQuestionResult(
    { [key]: { setId: "2025", n: 1, subject: "", micro: "", seen: 4, wrong: 1, box: 4 } },
    { setId: "2025", n: 1, outcome: "wrong" },
    "2026-08-10",
  );
  assert.equal(stats[key].box, 0);
  assert.equal(stats[key].due, "2026-08-11");
  assert.equal(stats[key].wrong, 2);
});

test("skipping a tracked question resets it but does not count as wrong", () => {
  const { P } = loadProgressModule();
  const key = P.questionKey("2025", 1);
  const stats = P.recordQuestionResult(
    { [key]: { setId: "2025", n: 1, subject: "", micro: "", seen: 2, wrong: 1, box: 2 } },
    { setId: "2025", n: 1, outcome: "skipped" },
    "2026-08-10",
  );
  assert.equal(stats[key].box, 0);
  assert.equal(stats[key].wrong, 1, "skipping is not the same as answering wrongly");
});

test("getDueQuestions returns only questions due today, weakest first", () => {
  const { P } = loadProgressModule();
  const progress = {
    ...P.createFreshProgress(0),
    questionStats: {
      "a::1": { setId: "a", n: 1, box: 2, wrong: 1, due: "2026-08-09" },
      "a::2": { setId: "a", n: 2, box: 0, wrong: 3, due: "2026-08-10" },
      "a::3": { setId: "a", n: 3, box: 0, wrong: 1, due: "2026-08-01" },
      "a::4": { setId: "a", n: 4, box: 1, wrong: 9, due: "2026-09-01" },
    },
  };
  const due = P.getDueQuestions(progress, "2026-08-10");
  assert.deepEqual(due.map((entry) => entry.n), [2, 3, 1], "box ascending, then most wrong");
  assert.equal(P.getDueQuestions(progress, "2026-08-10", 2).length, 2, "limit is honoured");
});

test("getReviewSummary separates due from scheduled and ranks subjects", () => {
  const { P } = loadProgressModule();
  const progress = {
    ...P.createFreshProgress(0),
    questionStats: {
      "a::1": { setId: "a", n: 1, box: 0, wrong: 1, subject: "Polity", due: "2026-08-01" },
      "a::2": { setId: "a", n: 2, box: 0, wrong: 1, subject: "Polity", due: "2026-08-10" },
      "a::3": { setId: "a", n: 3, box: 3, wrong: 1, subject: "Economy", due: "2026-12-01" },
    },
  };
  const summary = P.getReviewSummary(progress, "2026-08-10");
  assert.equal(summary.tracked, 3);
  assert.equal(summary.due, 2);
  assert.equal(summary.scheduled, 1);
  assert.deepEqual(summary.weakest[0], { subject: "Polity", count: 2 });
});

test("lab confidence creates a scheduled review and escalates mastery", () => {
  const { P } = loadProgressModule();
  let progress = P.createFreshProgress(0);
  progress = P.recordLabProgress(progress, { labId: "modern-timeline", confidence: "unsure" }, "2026-08-10");
  assert.equal(progress.labStats["modern-timeline"].lastConfidence, "unsure");
  assert.equal(progress.labStats["modern-timeline"].due, "2026-08-11");
  assert.equal(P.getDueLabs(progress, "2026-08-11").length, 1);

  progress = P.recordLabProgress(progress, { labId: "modern-timeline", confidence: "mastered" }, "2026-08-11");
  assert.equal(progress.labStats["modern-timeline"].mastered, true);
  assert.equal(progress.labStats["modern-timeline"].due, "2026-08-14");
  assert.equal(P.getReviewSummary(progress, "2026-08-11").labMastered, 1);
});

test("the tracked-question map is capped, dropping the closest to mastery first", () => {
  const { P } = loadProgressModule();
  const questionStats = {};
  const overflow = P.MAX_TRACKED_QUESTIONS + 50;
  for (let i = 0; i < overflow; i++) {
    // The first 50 are nearly mastered and should be the ones evicted.
    questionStats[`s::${i}`] = {
      setId: "s", n: i, box: i < 50 ? 4 : 0, wrong: 1,
      subject: "", lastSeen: "2026-01-01", due: "2026-08-01",
    };
  }
  const compacted = P.compactProgress({ ...P.createFreshProgress(0), questionStats });
  const keys = Object.keys(compacted.questionStats);
  assert.equal(keys.length, P.MAX_TRACKED_QUESTIONS);
  assert.ok(!keys.includes("s::0"), "a box-4 entry was evicted");
  assert.ok(keys.includes("s::1000"), "a box-0 entry was kept");
});

test("addDays crosses month and year boundaries correctly", () => {
  const { P } = loadProgressModule();
  assert.equal(P.addDays("2026-01-31", 1), "2026-02-01");
  assert.equal(P.addDays("2026-12-31", 1), "2027-01-01");
  assert.equal(P.addDays("2028-02-28", 1), "2028-02-29", "2028 is a leap year");
  assert.equal(P.addDays("2026-08-10", 90), "2026-11-08");
});

const CATCHUP_SETS = [
  { id: "d-01", label: "Daily 01", sourceType: "daily", isoDate: "2026-08-01", questionCount: 7, durationMinutes: 10 },
  { id: "d-02", label: "Daily 02", sourceType: "daily", isoDate: "2026-08-02", questionCount: 7, durationMinutes: 10 },
  { id: "rc-01", label: "RC 01", sourceType: "rc", isoDate: "2026-08-03", questionCount: 8, durationMinutes: 16 },
  { id: "pib-01", label: "PIB 01", sourceType: "pib", isoDate: "2026-08-01", questionCount: 3, durationMinutes: 10 },
  { id: "sec-01", label: "Sectional 01", sourceType: "sectional", isoDate: "2026-08-01", questionCount: 40, durationMinutes: 40 },
  { id: "d-today", label: "Daily today", sourceType: "daily", isoDate: "2026-08-10", questionCount: 7, durationMinutes: 10 },
  { id: "d-future", label: "Daily future", sourceType: "daily", isoDate: "2026-08-20", questionCount: 7, durationMinutes: 10 },
  { id: "d-supp", label: "Daily add-on", sourceType: "daily", isoDate: "2026-08-02", isSupplementary: true, questionCount: 5, durationMinutes: 10 },
];

test("getMissedSessions lists past-due cadence sets, excluding PIB, libraries, today and future", () => {
  const { P } = loadProgressModule();
  const progress = P.createFreshProgress(0);
  const missed = P.getMissedSessions(progress, "2026-08-10", CATCHUP_SETS);
  const ids = missed.map((m) => m.id);
  assert.deepEqual(ids, ["rc-01", "d-02", "d-01"], "newest first, PIB/sectional/today/future/add-on excluded");
});

test("getMissedSessions treats a completed set (history or dailyCompletions) as done", () => {
  const { P } = loadProgressModule();
  const progress = {
    ...P.createFreshProgress(0),
    history: [{ questionSetId: "d-01", sourceType: "daily", isoDate: "2026-08-05" }],
    dailyCompletions: { "2026-08-02": { questionSetId: "d-02" } },
  };
  const ids = P.getMissedSessions(progress, "2026-08-10", CATCHUP_SETS).map((m) => m.id);
  assert.deepEqual(ids, ["rc-01"], "both completed dailies drop out");
});

test("setSessionDismissed hides a set and can restore it", () => {
  const { P } = loadProgressModule();
  const dismissed = P.setSessionDismissed(P.createFreshProgress(0), "rc-01", true);
  assert.ok(dismissed.dismissedSessions["rc-01"]);
  const missed = P.getMissedSessions(dismissed, "2026-08-10", CATCHUP_SETS).map((m) => m.id);
  assert.deepEqual(missed, ["d-02", "d-01"], "dismissed set is excluded");
  const restored = P.setSessionDismissed(dismissed, "rc-01", false);
  assert.equal(restored.dismissedSessions["rc-01"], undefined);
});
