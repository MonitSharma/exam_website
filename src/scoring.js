import { percentage } from "./utils.js";

export const MARKS_PER_CORRECT = 2;
export const NEGATIVE_MARKS = -0.66;

function makeBucket(name) {
  return {
    name,
    total: 0,
    attempted: 0,
    correct: 0,
    wrong: 0,
    unattempted: 0,
    missingAnswer: 0,
    dropped: 0,
    accuracy: 0,
  };
}

function addToBucket(buckets, name, question, selected) {
  const key = name || "Unspecified";
  if (!buckets.has(key)) buckets.set(key, makeBucket(key));
  const bucket = buckets.get(key);

  bucket.total += 1;
  if (selected) bucket.attempted += 1;
  else bucket.unattempted += 1;

  const acceptedAnswers = getAcceptedAnswers(question);
  if (!acceptedAnswers.length) {
    if (question.verification_status === "dropped") bucket.dropped += 1;
    else bucket.missingAnswer += 1;
    return;
  }

  if (acceptedAnswers.includes(selected)) bucket.correct += 1;
  else if (selected) bucket.wrong += 1;
}

function finalizeBuckets(buckets) {
  return [...buckets.values()]
    .map((bucket) => ({
      ...bucket,
      accuracy: percentage(bucket.correct, bucket.correct + bucket.wrong),
    }))
    .sort((a, b) => b.attempted - a.attempted || a.name.localeCompare(b.name));
}

export function calculateScore(questions, state, pattern = {}) {
  const marksPerCorrect = Number(pattern.marks_per_correct ?? MARKS_PER_CORRECT);
  const negativeMarks = Number(pattern.negative_marks ?? NEGATIVE_MARKS);
  const subjectBuckets = new Map();
  const difficultyBuckets = new Map();
  const topicBuckets = new Map();

  let attempted = 0;
  let correct = 0;
  let wrong = 0;
  let missingAnswerCount = 0;
  let droppedCount = 0;
  let scorableCount = 0;
  let excludedAttempted = 0;

  const wrongAnswers = [];
  const unattemptedQuestions = [];
  const trackQuestionTime = Boolean(state.trackQuestionTime);
  const questionTimeRows = [];

  for (const question of questions) {
    const selected = state.selectedAnswers[question.id] || null;
    const acceptedAnswers = getAcceptedAnswers(question);
    const hasAnswer = acceptedAnswers.length > 0;
    const isDropped = question.verification_status === "dropped";

    if (selected) attempted += 1;
    else unattemptedQuestions.push(question);

    if (hasAnswer) scorableCount += 1;
    else if (isDropped) droppedCount += 1;
    else missingAnswerCount += 1;

    if (selected && !hasAnswer) excludedAttempted += 1;
    if (selected && hasAnswer && acceptedAnswers.includes(selected)) correct += 1;
    if (selected && hasAnswer && !acceptedAnswers.includes(selected)) {
      wrong += 1;
      wrongAnswers.push(question);
    }

    if (trackQuestionTime) {
      const timeSpentSeconds = Number(state.questionTimeSpent?.[question.id]) || 0;
      questionTimeRows.push({
        question,
        selected,
        seconds: timeSpentSeconds,
        status: getAnswerStatus(question, selected),
      });
    }

    addToBucket(subjectBuckets, question.subject, question, selected);
    addToBucket(difficultyBuckets, question.difficulty, question, selected);
    addToBucket(topicBuckets, `${question.subject || "Unspecified"} / ${question.micro_topic || "Unspecified"}`, question, selected);
  }

  const score = correct * marksPerCorrect + wrong * negativeMarks;
  const subjectStats = finalizeBuckets(subjectBuckets);
  const difficultyStats = finalizeBuckets(difficultyBuckets);
  const weakTopics = finalizeBuckets(topicBuckets)
    .filter((bucket) => {
      const scorableAttempts = bucket.correct + bucket.wrong;
      return bucket.wrong > 0 || (scorableAttempts > 0 && bucket.accuracy < 50);
    })
    .slice(0, 8);
  const totalTimeSpentSeconds = questionTimeRows.reduce((sum, row) => sum + row.seconds, 0);
  const attemptedTimeRows = questionTimeRows.filter((row) => row.selected);
  const slowestQuestions = [...questionTimeRows]
    .sort((a, b) => b.seconds - a.seconds)
    .slice(0, 10);

  return {
    totalQuestions: questions.length,
    totalMarks: questions.length * marksPerCorrect,
    attempted,
    unattempted: questions.length - attempted,
    markedForReview: questions.filter((question) => state.markedForReview[question.id]).length,
    correct,
    wrong,
    score,
    maxScorableMarks: scorableCount * marksPerCorrect,
    scorableCount,
    missingAnswerCount,
    droppedCount,
    excludedCount: missingAnswerCount + droppedCount,
    excludedAttempted,
    provisional: missingAnswerCount > 0,
    noAnswerKeys: scorableCount === 0,
    subjectStats,
    difficultyStats,
    weakTopics,
    wrongAnswers,
    unattemptedQuestions,
    trackQuestionTime,
    questionTimeRows,
    slowestQuestions,
    totalTimeSpentSeconds,
    averageTimePerQuestion: questions.length ? totalTimeSpentSeconds / questions.length : 0,
    averageTimePerAttempted: attemptedTimeRows.length
      ? attemptedTimeRows.reduce((sum, row) => sum + row.seconds, 0) / attemptedTimeRows.length
      : 0,
  };
}

export function getAcceptedAnswers(question) {
  if (Array.isArray(question.accepted_answer_options) && question.accepted_answer_options.length) {
    return question.accepted_answer_options;
  }
  return question.answer_option ? [question.answer_option] : [];
}

function getAnswerStatus(question, selected) {
  const acceptedAnswers = getAcceptedAnswers(question);
  if (question.verification_status === "dropped") return "Dropped";
  if (!selected) return "Unattempted";
  if (!acceptedAnswers.length) return "Excluded";
  return acceptedAnswers.includes(selected) ? "Correct" : "Wrong";
}
