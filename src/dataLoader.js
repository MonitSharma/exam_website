import { fetchJson, uniqueSorted } from "./utils.js";

const PATTERN_PATH = "config/exam_patterns.json";
const LEGACY_QUESTION_PATHS = {
  2019: "data/processed/upsc_2019_processed.json",
  2020: "data/processed/upsc_2020_processed.json",
  2021: "data/processed/upsc_2021_processed.json",
  2022: "data/processed/upsc_2022_processed.json",
  2023: "data/processed/upsc_2023_processed.json",
  2024: "data/processed/upsc_2024_processed.json",
  2025: "data/processed/upsc_2025_processed.json",
  2026: "data/processed/upsc_2026_processed.json",
};

let patternCache = null;
const questionCache = new Map();

export async function loadExamPattern() {
  if (!patternCache) {
    const patterns = await fetchJson(PATTERN_PATH);
    patternCache = patterns.upsc_cse_gs_paper_1;
  }
  return patternCache;
}

export async function loadQuestions(year) {
  const questionSetId = normalizeQuestionSetId(year);
  const questionSet = getQuestionSetById(questionSetId, await loadExamPattern());
  if (!questionSet?.path) {
    throw new Error(`Unsupported question set: ${year}`);
  }
  if (!questionCache.has(questionSet.id)) {
    questionCache.set(questionSet.id, await fetchJson(questionSet.path));
  }
  return questionCache.get(questionSet.id);
}

export function getAvailableYears(pattern) {
  return getAvailableQuestionSets(pattern)
    .filter((questionSet) => Number.isFinite(questionSet.year))
    .map((questionSet) => questionSet.year);
}

export function getAvailableQuestionSets(pattern) {
  if (Array.isArray(pattern?.question_sets) && pattern.question_sets.length) {
    return pattern.question_sets.map(normalizeQuestionSet);
  }

  return Object.entries(LEGACY_QUESTION_PATHS).map(([year, path]) => normalizeQuestionSet({
    id: year,
    label: `${year} PYQ`,
    short_label: year,
    category: "Previous Year Questions",
    year: Number(year),
    path,
  }));
}

export function getQuestionSetById(questionSetId, pattern) {
  const normalizedId = normalizeQuestionSetId(questionSetId);
  return getAvailableQuestionSets(pattern).find((questionSet) => questionSet.id === normalizedId) || null;
}

export function normalizeQuestionSetId(questionSetId) {
  return String(questionSetId ?? "").trim();
}

function normalizeQuestionSet(questionSet) {
  const id = normalizeQuestionSetId(questionSet.id ?? questionSet.year);
  return {
    id,
    label: String(questionSet.label || questionSet.name || id),
    shortLabel: String(questionSet.short_label || questionSet.shortLabel || questionSet.label || id),
    category: String(questionSet.category || "Question Sets"),
    year: Number.isFinite(Number(questionSet.year)) ? Number(questionSet.year) : null,
    path: String(questionSet.path || LEGACY_QUESTION_PATHS[id] || ""),
    durationMinutes: Number.isFinite(Number(questionSet.duration_minutes ?? questionSet.durationMinutes))
      ? Number(questionSet.duration_minutes ?? questionSet.durationMinutes)
      : null,
  };
}

export function getMetadataOptions(questions) {
  return {
    subjects: uniqueSorted(questions.map((question) => question.subject)),
    difficulties: uniqueSorted(questions.map((question) => question.difficulty)),
    natures: uniqueSorted(questions.map((question) => question.nature)),
  };
}

export function countAvailableAnswers(questions) {
  return questions.filter((question) => question.answer_option).length;
}

export function countAnswerStatus(questions) {
  const available = questions.filter((question) => question.answer_option).length;
  const dropped = questions.filter((question) => question.verification_status === "dropped").length;
  return {
    available,
    dropped,
    missing: questions.length - available - dropped,
  };
}
