export function buildReviewRows(questions, state) {
  return questions.map((question) => {
    const selected = state.selectedAnswers[question.id] || null;
    const acceptedAnswers = Array.isArray(question.accepted_answer_options)
      ? question.accepted_answer_options
      : [];
    const correct = acceptedAnswers.length ? acceptedAnswers : (question.answer_option ? [question.answer_option] : []);
    const isCorrect = selected && correct.length ? correct.includes(selected) : null;

    return {
      question,
      selected,
      correct,
      isCorrect,
      markedForReview: Boolean(state.markedForReview[question.id]),
      attempted: Boolean(selected),
      hasAnswer: correct.length > 0,
      trackQuestionTime: Boolean(state.trackQuestionTime),
      timeSpentSeconds: Number(state.questionTimeSpent?.[question.id]) || 0,
    };
  });
}

export function filterReviewRows(rows, filter) {
  switch (filter) {
    case "attempted":
      return rows.filter((row) => row.attempted);
    case "unattempted":
      return rows.filter((row) => !row.attempted);
    case "marked":
      return rows.filter((row) => row.markedForReview);
    case "wrong":
      return rows.filter((row) => row.isCorrect === false);
    default:
      return rows;
  }
}
