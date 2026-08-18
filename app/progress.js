// Local attempt history, per-question review tracking and the revision queue.
//
// Everything here is pure apart from loadProgress/saveProgress, so the same
// code runs in the browser and under node:test (see test/progress.test.js).
(function () {
  const PROGRESS_STORAGE_KEY = "parikshaProgressV2";
  const PROGRESS_VERSION = 5;

  // One attempt per entry, each carrying a full subject breakdown. Left uncapped
  // this reaches four figures within a year of daily practice, and every
  // dashboard render re-reduces the whole array. Older attempts are folded into
  // per-month totals, which keep the lifetime numbers exact at a fixed size.
  const MAX_DETAILED_ATTEMPTS = 400;

  // Leitner boxes. A question answered correctly moves up a box and comes back
  // later; a wrong answer sends it to box 0 and it returns tomorrow.
  const REVIEW_INTERVALS_DAYS = [1, 3, 7, 16, 35, 90];
  const MASTERED_BOX = REVIEW_INTERVALS_DAYS.length;
  const LAB_REVIEW_INTERVALS_DAYS = [1, 3, 7, 21];
  // Only questions still being got wrong are tracked, so this cap is a safety
  // net rather than the normal case: mastered questions drop out on their own.
  const MAX_TRACKED_QUESTIONS = 1500;

  function questionKey(setId, n) {
    return `${setId}::${n}`;
  }

  function createFreshProgress(resetAt = Date.now()) {
    return {
      version: PROGRESS_VERSION,
      resetAt,
      history: [],
      archive: [],
      dailyCompletions: {},
      dismissedSessions: {},
      questionStats: {},
      labStats: {},
    };
  }

  function normalizeProgress(parsed) {
    if (!parsed || !Array.isArray(parsed.history) || !parsed.dailyCompletions) return null;
    // Older versions migrate by filling defaults for fields introduced later.
    if (![2, 3, 4, PROGRESS_VERSION].includes(parsed.version)) return null;
    return compactProgress({
      ...parsed,
      version: PROGRESS_VERSION,
      archive: Array.isArray(parsed.archive) ? parsed.archive : [],
      dismissedSessions: parsed.dismissedSessions && typeof parsed.dismissedSessions === "object" ? parsed.dismissedSessions : {},
      questionStats: parsed.questionStats && typeof parsed.questionStats === "object" ? parsed.questionStats : {},
      labStats: parsed.labStats && typeof parsed.labStats === "object" ? parsed.labStats : {},
    });
  }

  function archiveMonthOf(entry) {
    return String(entry.isoDate || "").slice(0, 7) || "undated";
  }

  // Fold everything past MAX_DETAILED_ATTEMPTS into month buckets, and keep the
  // per-question map from growing without bound.
  function compactProgress(progress) {
    let next = progress;
    const history = next.history || [];
    if (history.length > MAX_DETAILED_ATTEMPTS) {
      const overflow = history.slice(0, history.length - MAX_DETAILED_ATTEMPTS);
      const buckets = new Map((next.archive || []).map((row) => [row.month, { ...row }]));
      for (const entry of overflow) {
        const month = archiveMonthOf(entry);
        const row = buckets.get(month) || { month, attempts: 0, correct: 0, attempted: 0, bestScore: 0 };
        row.attempts += 1;
        row.correct += Number(entry.correct) || 0;
        row.attempted += Number(entry.attempted) || 0;
        row.bestScore = Math.max(row.bestScore, Number(entry.score) || 0);
        buckets.set(month, row);
      }
      next = {
        ...next,
        history: history.slice(history.length - MAX_DETAILED_ATTEMPTS),
        archive: [...buckets.values()].sort((a, b) => a.month.localeCompare(b.month)),
      };
    }

    const stats = next.questionStats || {};
    const keys = Object.keys(stats);
    if (keys.length > MAX_TRACKED_QUESTIONS) {
      // Drop the questions closest to mastery, oldest first — they are the ones
      // least likely to be needed again.
      const ordered = keys.sort((a, b) => {
        const boxDiff = (stats[b].box || 0) - (stats[a].box || 0);
        if (boxDiff) return boxDiff;
        return String(stats[a].lastSeen || "").localeCompare(String(stats[b].lastSeen || ""));
      });
      const trimmed = {};
      for (const key of ordered.slice(keys.length - MAX_TRACKED_QUESTIONS)) trimmed[key] = stats[key];
      next = { ...next, questionStats: trimmed };
    }
    return next;
  }

  function addDays(isoDate, days) {
    const [year, month, day] = String(isoDate).split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  // Fold one graded question into the review map. Questions answered correctly
  // that were never wrong are not tracked at all: the map stays a working set of
  // "things I still get wrong" instead of a copy of the whole question bank.
  function recordQuestionResult(stats, result, todayIso) {
    const { setId, n, subject, micro, outcome } = result;
    const key = questionKey(setId, n);
    const existing = stats[key];
    if (!existing && outcome === "correct") return stats;

    const entry = existing
      ? { ...existing }
      : { setId, n, subject: subject || "", micro: micro || "", seen: 0, wrong: 0, box: 0 };
    entry.seen += 1;
    if (outcome === "correct") {
      entry.box = Math.min((entry.box || 0) + 1, MASTERED_BOX);
    } else {
      if (outcome === "wrong") entry.wrong += 1;
      entry.box = 0;
    }
    entry.lastOutcome = outcome;
    entry.lastSeen = todayIso;

    const nextStats = { ...stats };
    if (entry.box >= MASTERED_BOX) {
      // Mastered: stop tracking so the map shrinks as preparation improves.
      delete nextStats[key];
      return nextStats;
    }
    entry.due = addDays(todayIso, REVIEW_INTERVALS_DAYS[entry.box] || 1);
    nextStats[key] = entry;
    return nextStats;
  }

  function recordAttemptQuestions(progress, results, todayIso) {
    let stats = progress.questionStats || {};
    for (const result of results) stats = recordQuestionResult(stats, result, todayIso);
    return { ...progress, questionStats: stats };
  }

  function recordLabProgress(progress, result, todayIso) {
    const labId = String(result?.labId || "");
    if (!labId) return progress;
    const confidence = ["review", "unsure", "mastered"].includes(result.confidence) ? result.confidence : "unsure";
    const existing = progress.labStats?.[labId] || { labId, seen: 0, level: 0, mastered: false };
    const level = confidence === "mastered"
      ? Math.min((existing.level || 0) + 1, LAB_REVIEW_INTERVALS_DAYS.length - 1)
      : confidence === "unsure" ? Math.min(existing.level || 0, 1) : 0;
    const next = {
      ...existing,
      labId,
      seen: (existing.seen || 0) + 1,
      level,
      mastered: confidence === "mastered",
      lastConfidence: confidence,
      lastSeen: todayIso,
      due: addDays(todayIso, LAB_REVIEW_INTERVALS_DAYS[level] || 1),
    };
    return { ...progress, labStats: { ...(progress.labStats || {}), [labId]: next } };
  }

  function getDueLabs(progress, todayIso, limit = 0) {
    const due = Object.values(progress?.labStats || {})
      .filter((entry) => entry.due && entry.due <= todayIso)
      .sort((a, b) => String(a.due).localeCompare(String(b.due)));
    return limit > 0 ? due.slice(0, limit) : due;
  }

  // Questions whose review date has arrived, weakest first.
  function getDueQuestions(progress, todayIso, limit = 0) {
    const stats = progress?.questionStats || {};
    const due = Object.values(stats)
      .filter((entry) => entry.due && entry.due <= todayIso)
      .sort((a, b) => {
        const boxDiff = (a.box || 0) - (b.box || 0);
        if (boxDiff) return boxDiff;
        const wrongDiff = (b.wrong || 0) - (a.wrong || 0);
        if (wrongDiff) return wrongDiff;
        return String(a.due).localeCompare(String(b.due));
      });
    return limit > 0 ? due.slice(0, limit) : due;
  }

  function getReviewSummary(progress, todayIso) {
    const stats = progress?.questionStats || {};
    const all = Object.values(stats);
    const due = getDueQuestions(progress, todayIso);
    const dueLabs = getDueLabs(progress, todayIso);
    const subjects = {};
    for (const entry of all) {
      const subject = entry.subject || "General Studies";
      subjects[subject] = (subjects[subject] || 0) + 1;
    }
    const weakest = Object.entries(subjects)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([subject, count]) => ({ subject, count }));
    return {
      tracked: all.length,
      due: due.length,
      labTracked: Object.keys(progress?.labStats || {}).length,
      labDue: dueLabs.length,
      labMastered: Object.values(progress?.labStats || {}).filter((entry) => entry.mastered).length,
      // Anything not due yet is scheduled for a future day.
      scheduled: all.length - due.length,
      weakest,
    };
  }

  // Recurring, date-scheduled content the learner is meant to attempt on its
  // day. PIB is deliberately excluded, and on-demand libraries (sectional,
  // csat, pyq, ai, csr) are not "missed" — they are always available to pick.
  const MISSED_SOURCE_TYPES = ["daily", "rc", "weekly-news", "weekly-quiz"];

  // The set ids the learner has already completed. Reads both the attempt
  // history and the daily-completion map so a set counts as done by either path.
  function completedSetIds(progress) {
    const ids = new Set();
    for (const entry of progress?.history || []) {
      if (entry.questionSetId) ids.add(entry.questionSetId);
    }
    for (const completion of Object.values(progress?.dailyCompletions || {})) {
      if (completion && completion.questionSetId) ids.add(completion.questionSetId);
    }
    return ids;
  }

  // Dated cadence sets whose day has passed, never attempted and not dismissed —
  // the catch-up backlog, newest first. `questionSets` is injected so the same
  // logic runs under node:test; the browser passes window.UPSC.questionSets.
  function getMissedSessions(progress, todayIso, questionSets) {
    const sets = questionSets || (typeof window !== "undefined" && window.UPSC ? window.UPSC.questionSets : []) || [];
    const done = completedSetIds(progress);
    const dismissed = progress?.dismissedSessions || {};
    return sets
      .filter((set) => set && set.isoDate && !set.isSupplementary)
      .filter((set) => MISSED_SOURCE_TYPES.includes(set.sourceType))
      .filter((set) => set.isoDate < todayIso)
      .filter((set) => !done.has(set.id) && !dismissed[set.id])
      .sort((a, b) => String(b.isoDate).localeCompare(String(a.isoDate)) || String(a.sourceType).localeCompare(String(b.sourceType)))
      .map((set) => ({
        id: set.id,
        label: set.label,
        shortLabel: set.shortLabel,
        sourceType: set.sourceType,
        isoDate: set.isoDate,
        questionCount: set.questionCount || 0,
        durationMinutes: set.durationMinutes || 10,
      }));
  }

  // Toggle a set in/out of the dismissed map (returns a new progress object).
  function setSessionDismissed(progress, setId, dismissed) {
    const next = { ...progress, dismissedSessions: { ...(progress?.dismissedSessions || {}) } };
    if (dismissed) next.dismissedSessions[setId] = { at: Date.now() };
    else delete next.dismissedSessions[setId];
    return next;
  }

  function loadProgress() {
    try {
      const raw = localStorage.getItem(PROGRESS_STORAGE_KEY) || "";
      const normalized = normalizeProgress(JSON.parse(raw));
      if (!normalized) return createFreshProgress();
      // A migration or a compaction pass has to be written back, otherwise the
      // oversized copy stays in storage until the next test is submitted.
      if (JSON.stringify(normalized) !== raw) saveProgress(normalized);
      return normalized;
    } catch (error) {
      // Ignore malformed local progress and start with a clean local model.
      return createFreshProgress();
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      // Quota exceeded or storage disabled — the in-memory progress still works
      // for this session, and the next successful write will catch up.
    }
  }

  function getIsoDate(value = Date.now()) {
    const date = new Date(value);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function formatShortDate(value = Date.now()) {
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(new Date(value));
  }

  function calculateAttemptSummary(questions, answers, questionSet) {
    let correct = 0, wrong = 0, skipped = 0;
    let score = 0, max = 0;
    const subjectBreakdown = {};
    const questionResults = [];
    questions.forEach((q) => {
      const selected = answers[q.n];
      const accepted = Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length ? q.acceptedAnswers : [q.answer].filter(Boolean);
      const marking = window.UPSC.getQuestionMarking(questionSet, q);
      const subject = q.subject || "General Studies";
      subjectBreakdown[subject] = subjectBreakdown[subject] || { correct: 0, attempted: 0, total: 0 };
      subjectBreakdown[subject].total++;
      max += marking.correct;
      // Review scheduling follows the question back to the set it came from, so
      // a revision session updates the original questions rather than itself.
      const result = {
        setId: q.sourceSetId || questionSet.id,
        n: q.sourceQuestionNumber || q.n,
        subject,
        micro: q.micro || "",
        outcome: "skipped",
      };
      if (!selected) {
        skipped++;
        questionResults.push(result);
        return;
      }
      subjectBreakdown[subject].attempted++;
      if (accepted.includes(selected)) {
        correct++;
        subjectBreakdown[subject].correct++;
        score += marking.correct;
        result.outcome = "correct";
      } else {
        wrong++;
        score += marking.wrong;
        result.outcome = "wrong";
      }
      questionResults.push(result);
    });
    const attempted = correct + wrong;
    const accuracy = Math.round((correct / (attempted || 1)) * 100);
    return {
      correct, wrong, skipped, attempted,
      score: Math.round(score * 100) / 100,
      max: Math.round(max * 100) / 100,
      accuracy, subjectBreakdown, questionResults,
    };
  }

  function calculateDailyStreak(completions) {
    let streak = 0;
    const dailySets = window.UPSC.getQuestionSetsBySource("daily");
    const availableDates = dailySets.map((set) => set.isoDate).filter(Boolean).sort();
    const anchorDate = availableDates.includes(window.UPSC.todayIso)
      ? window.UPSC.todayIso
      : availableDates[availableDates.length - 1] || window.UPSC.todayIso;
    const cursor = new Date(`${anchorDate}T00:00:00`);
    while (completions[getIsoDate(cursor)]) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
  }

  function getProgressSummary(progress) {
    const history = progress?.history || [];
    const archive = progress?.archive || [];
    // Attempts rolled up into month buckets still count towards lifetime totals.
    const seed = archive.reduce((acc, row) => {
      acc.attempts += Number(row.attempts) || 0;
      acc.correct += Number(row.correct) || 0;
      acc.attempted += Number(row.attempted) || 0;
      acc.questions += Number(row.attempted) || 0;
      acc.score = Math.max(acc.score, Number(row.bestScore) || 0);
      return acc;
    }, { attempts: 0, correct: 0, attempted: 0, questions: 0, score: 0 });
    const totals = history.reduce((acc, item) => {
      acc.correct += Number(item.correct) || 0;
      acc.attempted += Number(item.attempted) || 0;
      acc.questions += Number(item.attempted) || 0;
      acc.score = Math.max(acc.score, Number(item.score) || 0);
      return acc;
    }, seed);
    return {
      attempts: seed.attempts + history.length,
      questionsSolved: totals.questions,
      averageAccuracy: Math.round((totals.correct / (totals.attempted || 1)) * 100),
      bestScore: Math.round(totals.score * 100) / 100,
      streak: calculateDailyStreak(progress?.dailyCompletions || {}),
      resetAt: progress?.resetAt || null,
    };
  }

  Object.assign(window, {
    UPSC_PROGRESS: {
      PROGRESS_STORAGE_KEY,
      PROGRESS_VERSION,
      MAX_DETAILED_ATTEMPTS,
      MAX_TRACKED_QUESTIONS,
      REVIEW_INTERVALS_DAYS,
      MASTERED_BOX,
      LAB_REVIEW_INTERVALS_DAYS,
      questionKey,
      createFreshProgress,
      normalizeProgress,
      compactProgress,
      addDays,
      recordQuestionResult,
      recordAttemptQuestions,
      recordLabProgress,
      getDueQuestions,
      getDueLabs,
      getReviewSummary,
      MISSED_SOURCE_TYPES,
      getMissedSessions,
      setSessionDismissed,
      loadProgress,
      saveProgress,
      getIsoDate,
      formatShortDate,
      calculateAttemptSummary,
      calculateDailyStreak,
      getProgressSummary,
    },
  });
})();
