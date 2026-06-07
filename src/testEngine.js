import { storageKey } from "./utils.js";

export function createInitialState(questionSetId, questions, durationSeconds, options = {}) {
  const firstQuestionId = questions[0]?.id;
  const now = Date.now();
  const normalizedQuestionSetId = normalizeQuestionSetId(questionSetId);
  return {
    attemptId: createAttemptId(normalizedQuestionSetId, now),
    questionSetId: normalizedQuestionSetId,
    questionSetLabel: options.questionSetLabel || normalizedQuestionSetId,
    year: Number.isFinite(Number(options.year))
      ? Number(options.year)
      : (isYearLike(normalizedQuestionSetId) ? Number(normalizedQuestionSetId) : null),
    currentQuestionIndex: 0,
    selectedAnswers: {},
    markedForReview: {},
    visitedQuestions: firstQuestionId ? { [firstQuestionId]: true } : {},
    startTime: now,
    durationSeconds,
    remainingTime: durationSeconds,
    trackQuestionTime: Boolean(options.trackQuestionTime),
    questionTimeSpent: {},
    currentQuestionStartedAt: now,
    submitted: false,
    submittedAt: null,
    historySavedAt: null,
  };
}

export function restoreState(questionSetId) {
  const normalizedQuestionSetId = normalizeQuestionSetId(questionSetId);
  const raw = localStorage.getItem(storageKey(normalizedQuestionSetId));
  if (!raw) return null;

  try {
    const state = JSON.parse(raw);
    return ensureTimingState(state, normalizedQuestionSetId);
  } catch {
    localStorage.removeItem(storageKey(normalizedQuestionSetId));
    return null;
  }
}

export function ensureTimingState(state, fallbackQuestionSetId = null) {
  const normalizedQuestionSetId = normalizeQuestionSetId(
    state.questionSetId ?? state.year ?? fallbackQuestionSetId,
  );
  state.questionSetId = normalizedQuestionSetId;
  state.questionSetLabel = state.questionSetLabel || (state.year ? String(state.year) : normalizedQuestionSetId);
  if (!state.attemptId) {
    state.attemptId = createAttemptId(normalizedQuestionSetId, Number(state.startTime) || Date.now());
  }
  state.trackQuestionTime = Boolean(state.trackQuestionTime);
  if (!state.questionTimeSpent || typeof state.questionTimeSpent !== "object") {
    state.questionTimeSpent = {};
  }
  if (!state.currentQuestionStartedAt && !state.submitted) {
    state.currentQuestionStartedAt = Date.now();
  }
  return state;
}

function createAttemptId(year, timestamp) {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${year}-${timestamp}-${Math.random().toString(36).slice(2, 8)}`;
}

export function saveState(state) {
  localStorage.setItem(storageKey(state.questionSetId ?? state.year), JSON.stringify(state));
}

export function clearState(questionSetId) {
  localStorage.removeItem(storageKey(normalizeQuestionSetId(questionSetId)));
}

export function markVisited(state, question) {
  if (!question) return state;
  state.visitedQuestions[question.id] = true;
  return state;
}

function normalizeQuestionSetId(questionSetId) {
  return String(questionSetId ?? "").trim();
}

function isYearLike(questionSetId) {
  return /^\d{4}$/.test(String(questionSetId));
}

export function setCurrentQuestion(state, questions, index) {
  recordCurrentQuestionTime(state, questions);
  const boundedIndex = Math.max(0, Math.min(index, questions.length - 1));
  state.currentQuestionIndex = boundedIndex;
  state.currentQuestionStartedAt = Date.now();
  markVisited(state, questions[boundedIndex]);
  saveState(state);
  return state;
}

export function recordCurrentQuestionTime(state, questions) {
  ensureTimingState(state);
  if (state.submitted || !state.trackQuestionTime) return state;

  const question = questions[state.currentQuestionIndex];
  if (!question) return state;

  const now = Date.now();
  const startedAt = Number(state.currentQuestionStartedAt || now);
  const elapsedSeconds = Math.max(0, Math.floor((now - startedAt) / 1000));

  if (elapsedSeconds > 0) {
    const previousSeconds = Number(state.questionTimeSpent[question.id]) || 0;
    state.questionTimeSpent[question.id] = previousSeconds + elapsedSeconds;
  }

  state.currentQuestionStartedAt = now;
  return state;
}

export function selectAnswer(state, question, optionKey) {
  state.selectedAnswers[question.id] = optionKey;
  markVisited(state, question);
  saveState(state);
  return state;
}

export function clearResponse(state, question) {
  delete state.selectedAnswers[question.id];
  markVisited(state, question);
  saveState(state);
  return state;
}

export function toggleMarkForReview(state, question) {
  if (state.markedForReview[question.id]) {
    delete state.markedForReview[question.id];
  } else {
    state.markedForReview[question.id] = true;
  }
  markVisited(state, question);
  saveState(state);
  return state;
}

export function updateRemainingTime(state) {
  const elapsed = Math.floor((Date.now() - Number(state.startTime)) / 1000);
  state.remainingTime = Math.max(0, Number(state.durationSeconds) - elapsed);
  saveState(state);
  return state.remainingTime;
}

export function submitState(state, questions = []) {
  if (questions.length && state.trackQuestionTime) recordCurrentQuestionTime(state, questions);
  state.submitted = true;
  state.submittedAt = Date.now();
  updateRemainingTime(state);
  saveState(state);
  return state;
}

export function getQuestionStatus(question, state) {
  const answered = Boolean(state.selectedAnswers[question.id]);
  const marked = Boolean(state.markedForReview[question.id]);
  const visited = Boolean(state.visitedQuestions[question.id]);

  if (answered && marked) return "answered-review";
  if (marked) return "review";
  if (answered) return "answered";
  if (visited) return "visited";
  return "not-visited";
}

export function summarizeState(questions, state) {
  const attempted = questions.filter((question) => state.selectedAnswers[question.id]).length;
  const marked = questions.filter((question) => state.markedForReview[question.id]).length;
  const visited = questions.filter((question) => state.visitedQuestions[question.id]).length;

  return {
    attempted,
    unattempted: questions.length - attempted,
    marked,
    visited,
    notVisited: questions.length - visited,
  };
}
