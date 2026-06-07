import { STORAGE_PREFIX, percentage } from "./utils.js";

export const ATTEMPT_HISTORY_KEY = `${STORAGE_PREFIX}:attempt-history`;
const MAX_HISTORY_ITEMS = 200;

export function loadAttemptHistory() {
  if (typeof localStorage === "undefined") return [];

  const raw = localStorage.getItem(ATTEMPT_HISTORY_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Attempt history must be an array.");
    return parsed
      .map(normalizeHistoryEntry)
      .filter(Boolean)
      .sort((a, b) => a.submittedAt - b.submittedAt);
  } catch {
    localStorage.removeItem(ATTEMPT_HISTORY_KEY);
    return [];
  }
}

export function saveAttemptHistory(history) {
  if (typeof localStorage === "undefined") return;
  const cleanHistory = history
    .map(normalizeHistoryEntry)
    .filter(Boolean)
    .sort((a, b) => a.submittedAt - b.submittedAt)
    .slice(-MAX_HISTORY_ITEMS);

  localStorage.setItem(ATTEMPT_HISTORY_KEY, JSON.stringify(cleanHistory));
}

export function clearAttemptHistory() {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(ATTEMPT_HISTORY_KEY);
  }
}

export function recordAttemptHistory({ questionSetId, questionSetLabel, year = null, state, result, pattern }) {
  if (!state?.submitted || state.historySavedAt) return null;

  const submittedAt = Number(state.submittedAt) || Date.now();
  const normalizedQuestionSetId = normalizeQuestionSetId(questionSetId ?? state.questionSetId ?? year);
  const normalizedQuestionSetLabel = String(
    questionSetLabel || state.questionSetLabel || year || normalizedQuestionSetId,
  );
  const numericYear = nullableYear(year ?? state.year);
  const attemptId = state.attemptId || createAttemptId(normalizedQuestionSetId, submittedAt);
  state.attemptId = attemptId;
  state.questionSetId = normalizedQuestionSetId;
  state.questionSetLabel = normalizedQuestionSetLabel;
  state.year = numericYear;

  const entry = normalizeHistoryEntry({
    id: attemptId,
    questionSetId: normalizedQuestionSetId,
    questionSetLabel: normalizedQuestionSetLabel,
    year: numericYear,
    exam: pattern?.exam || "UPSC CSE",
    paper: pattern?.paper || "GS Paper I",
    submittedAt,
    score: result.noAnswerKeys ? null : roundNumber(result.score),
    maxScorableMarks: roundNumber(result.maxScorableMarks),
    scorePercent: result.noAnswerKeys ? null : roundNumber(percentage(result.score, result.maxScorableMarks)),
    attempted: result.attempted,
    unattempted: result.unattempted,
    markedForReview: result.markedForReview,
    correct: result.correct,
    wrong: result.wrong,
    accuracy: roundNumber(percentage(result.correct, result.correct + result.wrong)),
    scorableCount: result.scorableCount,
    excludedCount: result.excludedCount,
    provisional: Boolean(result.provisional),
    timeTakenSeconds: getElapsedSeconds(state),
    trackQuestionTime: Boolean(result.trackQuestionTime),
    totalTimeSpentSeconds: result.trackQuestionTime ? Math.round(result.totalTimeSpentSeconds) : null,
    averageTimePerQuestion: result.trackQuestionTime ? roundNumber(result.averageTimePerQuestion) : null,
    averageTimePerAttempted: result.trackQuestionTime ? roundNumber(result.averageTimePerAttempted) : null,
    subjectStats: compactStats(result.subjectStats),
    difficultyStats: compactStats(result.difficultyStats),
    weakTopics: compactStats(result.weakTopics),
  });

  if (!entry) return null;

  const history = loadAttemptHistory().filter((item) => item.id !== entry.id);
  history.push(entry);
  saveAttemptHistory(history);
  state.historySavedAt = Date.now();
  return entry;
}

export function buildHistorySummary(history) {
  const attempts = history
    .map(normalizeHistoryEntry)
    .filter(Boolean)
    .sort((a, b) => a.submittedAt - b.submittedAt);
  const scoredAttempts = attempts.filter((entry) => Number.isFinite(entry.scorePercent));
  const latest = attempts.at(-1) || null;
  const latestScored = scoredAttempts.at(-1) || null;
  const previousScored = scoredAttempts.at(-2) || null;

  return {
    attempts,
    attemptCount: attempts.length,
    latest,
    latestScored,
    previousScored,
    best: getBestAttempt(scoredAttempts),
    averageScore: average(scoredAttempts.map((entry) => entry.score)),
    averageScorePercent: average(scoredAttempts.map((entry) => entry.scorePercent)),
    averageAccuracy: average(attempts
      .filter((entry) => entry.correct + entry.wrong > 0)
      .map((entry) => entry.accuracy)),
    scoreChangePercent: latestScored && previousScored
      ? roundNumber(latestScored.scorePercent - previousScored.scorePercent)
      : null,
    accuracyChange: latestScored && previousScored
      && latestScored.correct + latestScored.wrong > 0
      && previousScored.correct + previousScored.wrong > 0
      ? roundNumber(latestScored.accuracy - previousScored.accuracy)
      : null,
    byQuestionSet: aggregateQuestionSets(attempts),
    subjects: aggregateNamedStats(attempts, "subjectStats"),
    difficulties: aggregateNamedStats(attempts, "difficultyStats"),
    weakTopics: aggregateWeakTopics(attempts),
    recentAttempts: [...attempts].reverse().slice(0, 8),
    trendEntries: scoredAttempts.slice(-12),
  };
}

function createAttemptId(questionSetId, submittedAt) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${questionSetId}-${submittedAt}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeHistoryEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  const submittedAt = Number(entry.submittedAt);
  if (!entry.id || !Number.isFinite(submittedAt)) return null;
  const year = nullableYear(entry.year);
  const questionSetId = normalizeQuestionSetId(entry.questionSetId ?? year);
  const questionSetLabel = String(entry.questionSetLabel || (year ? String(year) : questionSetId));

  return {
    id: String(entry.id),
    questionSetId,
    questionSetLabel,
    year,
    exam: entry.exam || "UPSC CSE",
    paper: entry.paper || "GS Paper I",
    submittedAt,
    score: nullableNumber(entry.score),
    maxScorableMarks: nullableNumber(entry.maxScorableMarks),
    scorePercent: nullableNumber(entry.scorePercent),
    attempted: safeInteger(entry.attempted),
    unattempted: safeInteger(entry.unattempted),
    markedForReview: safeInteger(entry.markedForReview),
    correct: safeInteger(entry.correct),
    wrong: safeInteger(entry.wrong),
    accuracy: nullableNumber(entry.accuracy) ?? 0,
    scorableCount: safeInteger(entry.scorableCount),
    excludedCount: safeInteger(entry.excludedCount),
    provisional: Boolean(entry.provisional),
    timeTakenSeconds: safeInteger(entry.timeTakenSeconds),
    trackQuestionTime: Boolean(entry.trackQuestionTime),
    totalTimeSpentSeconds: nullableNumber(entry.totalTimeSpentSeconds),
    averageTimePerQuestion: nullableNumber(entry.averageTimePerQuestion),
    averageTimePerAttempted: nullableNumber(entry.averageTimePerAttempted),
    subjectStats: compactStats(entry.subjectStats || []),
    difficultyStats: compactStats(entry.difficultyStats || []),
    weakTopics: compactStats(entry.weakTopics || []),
  };
}

function compactStats(rows) {
  if (!Array.isArray(rows)) return [];
  return rows.map((row) => ({
    name: row.name || "Unspecified",
    total: safeInteger(row.total),
    attempted: safeInteger(row.attempted),
    correct: safeInteger(row.correct),
    wrong: safeInteger(row.wrong),
    unattempted: safeInteger(row.unattempted),
    missingAnswer: safeInteger(row.missingAnswer),
    dropped: safeInteger(row.dropped),
    accuracy: roundNumber(row.accuracy || percentage(row.correct, Number(row.correct) + Number(row.wrong))),
  }));
}

function aggregateQuestionSets(attempts) {
  const buckets = new Map();

  attempts.forEach((entry) => {
    const key = entry.questionSetId || "Unspecified";
    if (!buckets.has(key)) {
      buckets.set(key, {
        name: entry.questionSetLabel || key,
        questionSetId: key,
        questionSetLabel: entry.questionSetLabel || key,
        year: entry.year,
        attempts: 0,
        scorePercentTotal: 0,
        scoredAttempts: 0,
        bestScorePercent: null,
        correct: 0,
        wrong: 0,
        attempted: 0,
        latestSubmittedAt: 0,
      });
    }

    const bucket = buckets.get(key);
    bucket.attempts += 1;
    bucket.correct += entry.correct;
    bucket.wrong += entry.wrong;
    bucket.attempted += entry.attempted;
    bucket.latestSubmittedAt = Math.max(bucket.latestSubmittedAt, entry.submittedAt);

    if (Number.isFinite(entry.scorePercent)) {
      bucket.scorePercentTotal += entry.scorePercent;
      bucket.scoredAttempts += 1;
      bucket.bestScorePercent = bucket.bestScorePercent === null
        ? entry.scorePercent
        : Math.max(bucket.bestScorePercent, entry.scorePercent);
    }
  });

  return [...buckets.values()]
    .map((bucket) => ({
      ...bucket,
      averageScorePercent: bucket.scoredAttempts ? bucket.scorePercentTotal / bucket.scoredAttempts : null,
      accuracy: percentage(bucket.correct, bucket.correct + bucket.wrong),
    }))
    .sort((a, b) => {
      if (Number.isFinite(a.year) && Number.isFinite(b.year)) return a.year - b.year;
      if (Number.isFinite(a.year)) return -1;
      if (Number.isFinite(b.year)) return 1;
      return a.name.localeCompare(b.name);
    });
}

function aggregateNamedStats(attempts, field) {
  const buckets = new Map();

  attempts.forEach((entry) => {
    (entry[field] || []).forEach((row) => {
      const name = row.name || "Unspecified";
      if (!buckets.has(name)) {
        buckets.set(name, {
          name,
          attempts: 0,
          total: 0,
          attempted: 0,
          correct: 0,
          wrong: 0,
          unattempted: 0,
          missingAnswer: 0,
          dropped: 0,
        });
      }

      const bucket = buckets.get(name);
      bucket.attempts += 1;
      bucket.total += row.total;
      bucket.attempted += row.attempted;
      bucket.correct += row.correct;
      bucket.wrong += row.wrong;
      bucket.unattempted += row.unattempted;
      bucket.missingAnswer += row.missingAnswer;
      bucket.dropped += row.dropped;
    });
  });

  return [...buckets.values()]
    .map((bucket) => ({
      ...bucket,
      accuracy: percentage(bucket.correct, bucket.correct + bucket.wrong),
    }))
    .sort((a, b) => b.attempted - a.attempted || a.name.localeCompare(b.name));
}

function aggregateWeakTopics(attempts) {
  const buckets = new Map();

  attempts.forEach((entry) => {
    (entry.weakTopics || []).forEach((row) => {
      const name = row.name || "Unspecified";
      if (!buckets.has(name)) {
        buckets.set(name, {
          name,
          occurrences: 0,
          attempted: 0,
          correct: 0,
          wrong: 0,
        });
      }

      const bucket = buckets.get(name);
      bucket.occurrences += 1;
      bucket.attempted += row.attempted;
      bucket.correct += row.correct;
      bucket.wrong += row.wrong;
    });
  });

  return [...buckets.values()]
    .map((bucket) => ({
      ...bucket,
      accuracy: percentage(bucket.correct, bucket.correct + bucket.wrong),
    }))
    .sort((a, b) => b.occurrences - a.occurrences || b.wrong - a.wrong || a.name.localeCompare(b.name))
    .slice(0, 10);
}

function getBestAttempt(attempts) {
  return attempts.reduce((best, entry) => {
    if (!best) return entry;
    if (entry.scorePercent > best.scorePercent) return entry;
    if (entry.scorePercent === best.scorePercent && entry.score > best.score) return entry;
    return best;
  }, null);
}

function getElapsedSeconds(state) {
  const startTime = Number(state.startTime);
  const submittedAt = Number(state.submittedAt);
  if (!Number.isFinite(startTime) || !Number.isFinite(submittedAt)) return 0;
  return Math.max(0, Math.floor((submittedAt - startTime) / 1000));
}

function average(values) {
  const cleanValues = values.filter((value) => Number.isFinite(value));
  if (!cleanValues.length) return null;
  return cleanValues.reduce((sum, value) => sum + value, 0) / cleanValues.length;
}

function nullableNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? roundNumber(number) : null;
}

function nullableYear(value) {
  const number = Number(value);
  return Number.isInteger(number) ? number : null;
}

function normalizeQuestionSetId(questionSetId) {
  return String(questionSetId ?? "unknown").trim() || "unknown";
}

function safeInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.round(number)) : 0;
}

function roundNumber(value, digits = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Number(number.toFixed(digits));
}
