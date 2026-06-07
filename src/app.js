import {
  countAvailableAnswers,
  countAnswerStatus,
  getAvailableQuestionSets,
  getQuestionSetById,
  getMetadataOptions,
  loadExamPattern,
  loadQuestions,
} from "./dataLoader.js";
import { buildReviewRows, filterReviewRows } from "./review.js";
import { calculateScore } from "./scoring.js";
import {
  buildHistorySummary,
  clearAttemptHistory,
  loadAttemptHistory,
  recordAttemptHistory,
} from "./history.js";
import {
  clearResponse,
  clearState,
  createInitialState,
  getQuestionStatus,
  restoreState,
  saveState,
  selectAnswer,
  setCurrentQuestion,
  submitState,
  summarizeState,
  toggleMarkForReview,
  updateRemainingTime,
} from "./testEngine.js";
import { createElement, formatNumber, formatTime, percentage, setText } from "./utils.js";

const app = document.querySelector("#app");

const context = {
  pattern: null,
  questionSetId: "2019",
  questionSet: null,
  questions: [],
  state: null,
  timerId: null,
  reviewFilter: "all",
};

function stopTimer() {
  if (context.timerId) {
    clearInterval(context.timerId);
    context.timerId = null;
  }
}

function getActiveQuestionSet() {
  return context.questionSet || getQuestionSetById(context.questionSetId, context.pattern);
}

function getQuestionSetLabel(questionSet = getActiveQuestionSet()) {
  return questionSet?.label || String(context.questionSetId);
}

function getQuestionSetShortLabel(questionSet = getActiveQuestionSet()) {
  return questionSet?.shortLabel || getQuestionSetLabel(questionSet);
}

function getQuestionSetTotalMarks(questions) {
  return questions.length * Number(context.pattern.marks_per_correct || 0);
}

function getQuestionSetDurationMinutes(questionSet = getActiveQuestionSet()) {
  return Number(questionSet?.durationMinutes || context.pattern.duration_minutes);
}

function renderQuestionSetOptions(questionSets, selectedQuestionSetId) {
  const groups = questionSets.reduce((itemsByCategory, questionSet) => {
    const category = questionSet.category || "Question Sets";
    if (!itemsByCategory.has(category)) itemsByCategory.set(category, []);
    itemsByCategory.get(category).push(questionSet);
    return itemsByCategory;
  }, new Map());

  return [...groups.entries()]
    .map(([category, items]) => `
      <optgroup label="${category}">
        ${items.map((questionSet) => `
          <option value="${questionSet.id}" ${questionSet.id === selectedQuestionSetId ? "selected" : ""}>${questionSet.label}</option>
        `).join("")}
      </optgroup>
    `)
    .join("");
}

function renderTopStrip({ timer = false } = {}) {
  const timerMarkup = timer ? '<div class="timer-pill" id="timerValue">--:--</div>' : "";
  return `
    <header class="top-strip">
      <div class="brand-block">
        <h1 class="brand-title">UPSC CSE PYQ Mock Test Platform</h1>
        <p class="brand-subtitle">${context.pattern.exam} · ${context.pattern.paper}</p>
      </div>
      ${timerMarkup}
    </header>
  `;
}

function renderError(error) {
  stopTimer();
  app.innerHTML = `
    ${renderTopStrip()}
    <main class="error-state panel">
      <div class="panel-header">
        <h2>Could not load the app</h2>
        <p>${error.message}</p>
      </div>
      <div class="panel-body">
        <p class="muted">Run the normalization script first, then reload the local server.</p>
      </div>
    </main>
  `;
}

async function renderHome() {
  stopTimer();
  const questionSets = getAvailableQuestionSets(context.pattern);
  const selectedQuestionSetId = String(context.questionSetId || questionSets[0]?.id);
  const selectedQuestionSet = getQuestionSetById(selectedQuestionSetId, context.pattern) || questionSets[0];
  context.questionSetId = selectedQuestionSet.id;
  context.questionSet = selectedQuestionSet;
  const questions = await loadQuestions(selectedQuestionSet.id);
  const answerStatus = countAnswerStatus(questions);
  const answerCount = countAvailableAnswers(questions);
  const metadata = getMetadataOptions(questions);
  const savedState = restoreState(selectedQuestionSet.id);
  const hasActiveAttempt = savedState && !savedState.submitted;
  const hasSubmittedAttempt = savedState && savedState.submitted;
  const totalMarks = getQuestionSetTotalMarks(questions);

  app.innerHTML = `
    ${renderTopStrip()}
    <main class="page">
      <section class="home-grid">
        <div class="panel">
          <div class="panel-header">
            <h2>Start Mock Test</h2>
            <p>Practice PYQs, AI-generated questions, or CSR monthly mock questions.</p>
          </div>
          <div class="panel-body">
            <div class="field-stack">
              <div class="field">
                <label for="examSelect">Exam</label>
                <select id="examSelect">
                  <option value="upsc_cse_gs_paper_1">UPSC CSE · GS Paper I</option>
                </select>
              </div>
              <div class="field">
                <label for="questionSetSelect">Question set</label>
                <select id="questionSetSelect">
                  ${renderQuestionSetOptions(questionSets, selectedQuestionSet.id)}
                </select>
              </div>
              <label class="checkbox-field">
                <input type="checkbox" id="trackQuestionTime" ${savedState?.trackQuestionTime ? "checked" : ""} ${hasActiveAttempt ? "disabled" : ""}>
                <span>Track per-question time</span>
              </label>
            </div>
            <div class="action-row">
              <button class="button primary" id="startTest">${hasActiveAttempt ? "Resume Test" : "Start Test"}</button>
              ${hasSubmittedAttempt ? '<button class="button" id="viewSavedResult">View Result</button>' : ""}
              ${savedState ? '<button class="button danger" id="resetAttempt">Reset Attempt</button>' : ""}
            </div>
            ${answerStatus.missing ? '<div class="note">Score is provisional because answer keys are missing for some or all questions.</div>' : ""}
            ${answerStatus.dropped ? `<div class="note">${answerStatus.dropped} dropped question${answerStatus.dropped === 1 ? " is" : "s are"} excluded from score calculation.</div>` : ""}
          </div>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h2>${selectedQuestionSet.label} Snapshot</h2>
            <p>${selectedQuestionSet.category} · ${metadata.subjects.length} subjects · ${metadata.natures.length} question natures · ${metadata.difficulties.length} difficulty bands</p>
          </div>
          <div class="panel-body">
            <div class="metric-grid">
              <div class="metric"><strong>${questions.length}</strong><span>Questions</span></div>
              <div class="metric"><strong>${totalMarks}</strong><span>Marks</span></div>
              <div class="metric"><strong>${getQuestionSetDurationMinutes(selectedQuestionSet)}</strong><span>Minutes</span></div>
              <div class="metric"><strong>${answerCount}</strong><span>Answer keys</span></div>
              <div class="metric"><strong>${answerStatus.missing + answerStatus.dropped}</strong><span>Excluded keys</span></div>
              <div class="metric"><strong>${metadata.subjects.length}</strong><span>Subjects</span></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;

  document.querySelector(".page").append(renderHistoryDashboard(loadAttemptHistory(), {
    title: "Attempt History",
    subtitle: "Saved locally in this browser for score comparison over time.",
  }));
  wireHistoryActions(() => renderHome());

  document.querySelector("#questionSetSelect").addEventListener("change", async (event) => {
    context.questionSetId = event.target.value;
    await renderHome();
  });

  document.querySelector("#startTest").addEventListener("click", async () => {
    await startOrResumeTest(selectedQuestionSet.id, {
      trackQuestionTime: Boolean(document.querySelector("#trackQuestionTime")?.checked),
    });
  });

  document.querySelector("#viewSavedResult")?.addEventListener("click", async () => {
    context.questionSetId = selectedQuestionSet.id;
    context.questionSet = selectedQuestionSet;
    context.questions = questions;
    context.state = savedState;
    renderResult();
  });

  document.querySelector("#resetAttempt")?.addEventListener("click", async () => {
    showConfirmDialog({
      title: "Reset saved attempt?",
      message: `Delete the saved ${selectedQuestionSet.label} attempt and return to a clean start screen.`,
      confirmLabel: "Reset Attempt",
      danger: true,
      onConfirm: async () => {
        clearState(selectedQuestionSet.id);
        await renderHome();
      },
    });
  });
}

async function startOrResumeTest(questionSetId, options = {}) {
  const selectedQuestionSet = getQuestionSetById(questionSetId, context.pattern) || getAvailableQuestionSets(context.pattern)[0];
  context.questionSetId = selectedQuestionSet.id;
  context.questionSet = selectedQuestionSet;
  context.questions = await loadQuestions(context.questionSetId);

  const restored = restoreState(context.questionSetId);
  if (restored && !restored.submitted) {
    context.state = restored;
  } else {
    context.state = createInitialState(
      context.questionSetId,
      context.questions,
      getQuestionSetDurationMinutes(selectedQuestionSet) * 60,
      {
        ...options,
        questionSetLabel: selectedQuestionSet.label,
        year: selectedQuestionSet.year,
      },
    );
    saveState(context.state);
  }

  renderTest();
}

function renderTest() {
  stopTimer();
  const question = context.questions[context.state.currentQuestionIndex];
  const summary = summarizeState(context.questions, context.state);
  const selectedAnswer = context.state.selectedAnswers[question.id];
  const marked = Boolean(context.state.markedForReview[question.id]);
  const questionOrdinal = context.state.currentQuestionIndex + 1;
  const sourceQuestionNumber = Number(question.source_question_number);
  const hasSourceQuestionNumber = question.source_question_number !== null && question.source_question_number !== undefined;
  const sourceLabel = hasSourceQuestionNumber && Number.isFinite(sourceQuestionNumber) && sourceQuestionNumber !== question.question_number
    ? ` · Source Q${sourceQuestionNumber}`
    : "";

  app.innerHTML = `
    ${renderTopStrip({ timer: true })}
    <main class="page test-page">
      <section class="test-layout">
        <article class="panel question-panel">
          <div class="question-meta-bar">
            <div>
              <div class="question-number">Question ${questionOrdinal} of ${context.questions.length}</div>
              <div class="muted">${context.pattern.exam} · ${context.pattern.paper} · ${getQuestionSetLabel()}${sourceLabel}</div>
            </div>
            <div class="tag-row">
              <span class="tag">${question.subject || "Subject"}</span>
              <span class="tag">${question.difficulty || "Difficulty"}</span>
              ${marked ? '<span class="tag">Marked</span>' : ""}
            </div>
          </div>

          <div class="question-body">
            <div class="question-text" id="questionText"></div>
            <div class="options-list" id="optionsList"></div>
          </div>

          <div class="bottom-nav">
            <div class="bottom-nav-group">
              <button class="button" id="prevQuestion">Previous</button>
              <button class="button" id="clearResponse">Clear Response</button>
              <button class="button" id="markReview">${marked ? "Unmark Review" : "Mark for Review"}</button>
            </div>
            <div class="bottom-nav-group">
              <button class="button" id="nextQuestion">Next</button>
              <button class="button primary" id="submitTest">Submit Test</button>
            </div>
          </div>
        </article>

        <aside class="panel navigator">
          <div class="panel-header">
            <h3>Question Palette</h3>
            <p>${summary.attempted} attempted · ${summary.marked} marked</p>
          </div>
          <div class="panel-body">
            <div class="palette-grid" id="paletteGrid"></div>
            <div class="legend" aria-label="Question status legend">
              <div class="legend-item"><span class="legend-swatch"></span>Not visited</div>
              <div class="legend-item"><span class="legend-swatch visited"></span>Visited</div>
              <div class="legend-item"><span class="legend-swatch answered"></span>Answered</div>
              <div class="legend-item"><span class="legend-swatch review"></span>Marked for review</div>
            </div>
          </div>
        </aside>
      </section>
    </main>
  `;

  renderQuestionContent(question.question, document.querySelector("#questionText"));
  renderOptions(question, selectedAnswer);
  renderPalette();
  wireTestActions();
  tickTimer();
  context.timerId = setInterval(tickTimer, 1000);
}

function renderOptions(question, selectedAnswer) {
  const optionsList = document.querySelector("#optionsList");
  optionsList.innerHTML = "";

  for (const option of question.options) {
    const button = createElement("button", `option-button ${selectedAnswer === option.key ? "selected" : ""}`);
    button.type = "button";
    button.dataset.option = option.key;

    const key = createElement("span", "option-key", option.key);
    const text = createElement("span", "option-text", option.text);
    button.append(key, text);
    optionsList.append(button);

    button.addEventListener("click", () => {
      selectAnswer(context.state, question, option.key);
      renderTest();
    });
  }
}

function renderPalette() {
  const paletteGrid = document.querySelector("#paletteGrid");
  paletteGrid.innerHTML = "";

  context.questions.forEach((question, index) => {
    const status = getQuestionStatus(question, context.state);
    const button = createElement("button", `palette-button ${status} ${index === context.state.currentQuestionIndex ? "current" : ""}`, index + 1);
    button.type = "button";
    button.title = `Question ${index + 1}`;
    button.addEventListener("click", () => {
      setCurrentQuestion(context.state, context.questions, index);
      renderTest();
    });
    paletteGrid.append(button);
  });
}

function wireTestActions() {
  const currentIndex = context.state.currentQuestionIndex;
  const question = context.questions[currentIndex];

  document.querySelector("#prevQuestion").disabled = currentIndex === 0;
  document.querySelector("#nextQuestion").disabled = currentIndex === context.questions.length - 1;

  document.querySelector("#prevQuestion").addEventListener("click", () => {
    setCurrentQuestion(context.state, context.questions, currentIndex - 1);
    renderTest();
  });

  document.querySelector("#nextQuestion").addEventListener("click", () => {
    setCurrentQuestion(context.state, context.questions, currentIndex + 1);
    renderTest();
  });

  document.querySelector("#clearResponse").addEventListener("click", () => {
    clearResponse(context.state, question);
    renderTest();
  });

  document.querySelector("#markReview").addEventListener("click", () => {
    toggleMarkForReview(context.state, question);
    renderTest();
  });

  document.querySelector("#submitTest").addEventListener("click", () => {
    const summary = summarizeState(context.questions, context.state);
    showConfirmDialog({
      title: "Submit test?",
      message: `Attempted: ${summary.attempted}. Unattempted: ${summary.unattempted}.`,
      confirmLabel: "Submit Test",
      onConfirm: () => {
        submitState(context.state, context.questions);
        renderResult();
      },
    });
  });
}

function tickTimer() {
  const remaining = updateRemainingTime(context.state);
  setText("#timerValue", formatTime(remaining));
  if (remaining <= 0) {
    stopTimer();
    submitState(context.state, context.questions);
    renderResult();
  }
}

function renderResult() {
  stopTimer();
  const result = calculateScore(context.questions, context.state, context.pattern);
  const historyEntry = recordAttemptHistory({
    questionSetId: context.questionSetId,
    questionSetLabel: getQuestionSetLabel(),
    year: getActiveQuestionSet()?.year,
    state: context.state,
    result,
    pattern: context.pattern,
  });
  if (historyEntry) saveState(context.state);

  app.innerHTML = `
    ${renderTopStrip()}
    <main class="page">
      <section class="result-grid">
        <article class="panel">
          <div class="panel-header">
            <h2>Result · ${getQuestionSetShortLabel()}</h2>
            <p>${context.pattern.exam} · ${context.pattern.paper}</p>
          </div>
          <div class="panel-body">
            <div class="score-line">
              <div class="score-value">${result.noAnswerKeys ? "N/A" : formatNumber(result.score)}</div>
              <div class="score-caption">out of ${formatNumber(result.maxScorableMarks)} scorable marks</div>
            </div>
            ${result.provisional ? '<div class="note">Score is provisional because answer keys are missing for some or all questions.</div>' : ""}
            ${result.droppedCount ? `<div class="note">${result.droppedCount} dropped question${result.droppedCount === 1 ? " is" : "s are"} excluded from score calculation.</div>` : ""}
            ${result.noAnswerKeys ? '<div class="note">Score could not be calculated because no answer keys are available for this paper.</div>' : ""}
            <div class="metric-grid">
              <div class="metric"><strong>${result.attempted}</strong><span>Attempted</span></div>
              <div class="metric"><strong>${result.unattempted}</strong><span>Unattempted</span></div>
              <div class="metric"><strong>${result.markedForReview}</strong><span>Marked</span></div>
              <div class="metric"><strong>${result.correct}</strong><span>Correct</span></div>
              <div class="metric"><strong>${result.wrong}</strong><span>Wrong</span></div>
              <div class="metric"><strong>${result.excludedCount}</strong><span>Excluded keys</span></div>
            </div>
            <div class="action-row">
              <button class="button primary" id="reviewAnswers">Review Answers</button>
              <button class="button" id="homeFromResult">Home</button>
              <button class="button danger" id="restartAttempt">Start Fresh</button>
            </div>
          </div>
        </article>

        <aside class="panel">
          <div class="panel-header">
            <h3>Scoring Basis</h3>
            <p>Correct +${context.pattern.marks_per_correct}, wrong ${context.pattern.negative_marks}, unattempted 0.</p>
          </div>
          <div class="panel-body">
            <div class="list-stack">
              <div class="compact-item"><strong>${result.scorableCount}</strong><span class="muted">Questions included in score</span></div>
              <div class="compact-item"><strong>${result.excludedAttempted}</strong><span class="muted">Attempted but excluded from scoring</span></div>
              <div class="compact-item"><strong>${formatNumber(percentage(result.correct, result.correct + result.wrong))}%</strong><span class="muted">Accuracy on scorable attempts</span></div>
              ${result.trackQuestionTime ? `<div class="compact-item"><strong>${formatTime(result.totalTimeSpentSeconds)}</strong><span class="muted">Tracked test time</span></div>` : ""}
              ${result.trackQuestionTime ? `<div class="compact-item"><strong>${formatTime(Math.round(result.averageTimePerQuestion))}</strong><span class="muted">Average per question</span></div>` : ""}
            </div>
          </div>
        </aside>
      </section>

      <section class="panel section-spacer">
        <div class="panel-header">
          <h2>Analytics</h2>
          <p>Performance by subject and difficulty.</p>
        </div>
        <div class="panel-body" id="analyticsBody"></div>
      </section>
    </main>
  `;

  renderAnalytics(result);
  document.querySelector(".page").append(renderHistoryDashboard(loadAttemptHistory(), {
    title: "Attempt History",
    subtitle: "Compare this attempt with earlier submissions on this browser.",
  }));
  wireHistoryActions(() => renderResult());

  document.querySelector("#reviewAnswers").addEventListener("click", () => renderReview());
  document.querySelector("#homeFromResult").addEventListener("click", () => renderHome());
  document.querySelector("#restartAttempt").addEventListener("click", async () => {
    showConfirmDialog({
      title: "Start fresh?",
      message: `Delete the saved ${getQuestionSetLabel()} attempt and begin again from question 1.`,
      confirmLabel: "Start Fresh",
      danger: true,
      onConfirm: async () => {
        clearState(context.questionSetId);
        await startOrResumeTest(context.questionSetId);
      },
    });
  });
}

function renderAnalytics(result) {
  const analyticsBody = document.querySelector("#analyticsBody");
  analyticsBody.innerHTML = "";

  analyticsBody.append(
    renderStatsTable("Subject-wise Attempts", result.subjectStats),
    renderStatsTable("Difficulty-wise Performance", result.difficultyStats),
    ...(result.trackQuestionTime ? [renderTimeAnalysis(result)] : []),
    renderWeakTopics(result),
    renderQuestionList("Wrong-answer List", result.wrongAnswers, "No wrong answers available from scorable questions."),
    renderQuestionList("Unattempted List", result.unattemptedQuestions, "No unattempted questions."),
  );
}

function renderHistoryDashboard(history, { title, subtitle } = {}) {
  const summary = buildHistorySummary(history);
  const section = createElement("section", "panel section-spacer history-dashboard");
  const header = createElement("div", "panel-header history-header");
  const headerText = createElement("div");
  const heading = createElement("h2", "", title || "Attempt History");
  const description = createElement(
    "p",
    "",
    subtitle || "Scores, accuracy, and weak areas from submitted attempts on this browser.",
  );
  const actions = createElement("div", "history-actions");
  const exportButton = createElement("button", "button", "Export History");
  const clearButton = createElement("button", "button danger", "Clear History");
  const body = createElement("div", "panel-body");

  exportButton.type = "button";
  clearButton.type = "button";
  exportButton.dataset.historyAction = "export";
  clearButton.dataset.historyAction = "clear";
  exportButton.disabled = summary.attemptCount === 0;
  clearButton.disabled = summary.attemptCount === 0;

  headerText.append(heading, description);
  actions.append(exportButton, clearButton);
  header.append(headerText, actions);

  if (!summary.attemptCount) {
    body.append(
      createElement(
        "p",
        "muted",
        "Submit a test to start building history. This uses localStorage, so it costs nothing and stays on this browser unless you clear it.",
      ),
    );
  } else {
    body.append(
      renderHistoryMetrics(summary),
      renderHistoryGraphs(summary),
      renderHistoryDetails(summary),
    );
  }

  section.append(header, body);
  return section;
}

function renderHistoryMetrics(summary) {
  const grid = createElement("div", "metric-grid history-metrics");

  grid.append(
    historyMetric("Attempts", summary.attemptCount, "Submitted tests"),
    historyMetric(
      "Latest score",
      formatAttemptScore(summary.latestScored),
      summary.latestScored ? `${formatAttemptQuestionSet(summary.latestScored)} · ${formatHistoryDate(summary.latestScored.submittedAt)}` : "No scored attempt",
    ),
    historyMetric(
      "Best score",
      formatAttemptScore(summary.best),
      summary.best ? `${formatAttemptQuestionSet(summary.best)} · ${formatPercent(summary.best.scorePercent)} of scorable marks` : "No scored attempt",
    ),
    historyMetric(
      "Latest change",
      formatSignedPercent(summary.scoreChangePercent),
      "Score % vs previous scored attempt",
    ),
    historyMetric(
      "Average score",
      formatPercent(summary.averageScorePercent),
      "Across scored attempts",
    ),
    historyMetric(
      "Average accuracy",
      formatPercent(summary.averageAccuracy),
      "Across all attempts",
    ),
  );

  return grid;
}

function historyMetric(label, value, caption) {
  const metric = createElement("div", "metric");
  metric.append(createElement("strong", "", value), createElement("span", "", label));
  if (caption) metric.append(createElement("small", "", caption));
  return metric;
}

function renderHistoryGraphs(summary) {
  const grid = createElement("div", "history-graph-grid");

  grid.append(
    renderTrendBlock(summary),
    renderBarList(
      "Question Set Average",
      summary.byQuestionSet.map((row) => ({
        name: row.name,
        value: row.averageScorePercent,
        caption: `${row.attempts} attempt${row.attempts === 1 ? "" : "s"} · best ${formatPercent(row.bestScorePercent)}`,
      })),
      "Question-set comparisons appear after scored attempts.",
    ),
    renderBarList(
      "Subject Accuracy",
      summary.subjects
        .filter((row) => row.correct + row.wrong > 0)
        .slice(0, 8)
        .map((row) => ({
          name: row.name,
          value: row.accuracy,
          caption: `${row.attempted} attempted · ${row.correct} correct · ${row.wrong} wrong`,
        })),
      "Subject accuracy appears after attempts with answer keys.",
    ),
    renderBarList(
      "Difficulty Accuracy",
      summary.difficulties
        .filter((row) => row.correct + row.wrong > 0)
        .map((row) => ({
          name: row.name,
          value: row.accuracy,
          caption: `${row.attempted} attempted · ${row.correct} correct · ${row.wrong} wrong`,
        })),
      "Difficulty comparison appears after attempts with answer keys.",
    ),
  );

  return grid;
}

function renderTrendBlock(summary) {
  const block = createElement("section", "history-block trend-block");
  block.append(createElement("h3", "", "Score Trend"));

  if (summary.trendEntries.length < 2) {
    block.append(createElement("p", "muted", "Two scored attempts are needed for a trend line."));
  } else {
    block.append(renderTrendChart(summary.trendEntries));
  }

  return block;
}

function renderTrendChart(entries) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  const width = 620;
  const height = 220;
  const padding = { top: 18, right: 18, bottom: 36, left: 42 };
  const values = entries.map((entry) => entry.scorePercent);
  const minValue = Math.min(0, Math.floor(Math.min(...values) / 10) * 10);
  const maxValue = Math.max(100, Math.ceil(Math.max(...values) / 10) * 10);
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const yRange = maxValue - minValue || 100;
  const points = entries.map((entry, index) => {
    const x = padding.left + (chartWidth * index) / (entries.length - 1);
    const y = padding.top + ((maxValue - entry.scorePercent) / yRange) * chartHeight;
    return { x, y, entry };
  });

  svg.setAttribute("class", "trend-chart");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Score trend over recent attempts");

  [minValue, (minValue + maxValue) / 2, maxValue].forEach((tick) => {
    const y = padding.top + ((maxValue - tick) / yRange) * chartHeight;
    const line = svgElement("line", {
      x1: padding.left,
      x2: width - padding.right,
      y1: y,
      y2: y,
      class: "trend-grid-line",
    });
    const label = svgElement("text", {
      x: padding.left - 8,
      y: y + 4,
      class: "trend-axis-label",
      "text-anchor": "end",
    });
    label.textContent = `${Math.round(tick)}%`;
    svg.append(line, label);
  });

  const path = svgElement("path", {
    d: points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" "),
    class: "trend-line",
  });
  svg.append(path);

  points.forEach((point, index) => {
    const circle = svgElement("circle", {
      cx: point.x,
      cy: point.y,
      r: 4,
      class: "trend-point",
    });
    const title = svgElement("title");
    title.textContent = `${formatAttemptQuestionSet(point.entry)} · ${formatHistoryDate(point.entry.submittedAt)} · ${formatPercent(point.entry.scorePercent)}`;
    circle.append(title);
    svg.append(circle);

    if (index === 0 || index === points.length - 1) {
      const label = svgElement("text", {
        x: point.x,
        y: height - 10,
        class: "trend-axis-label",
        "text-anchor": index === 0 ? "start" : "end",
      });
      label.textContent = formatAttemptQuestionSet(point.entry);
      svg.append(label);
    }
  });

  return svg;
}

function svgElement(tag, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function renderBarList(title, rows, emptyText) {
  const block = createElement("section", "history-block");
  const list = createElement("div", "bar-list");
  const usableRows = rows.filter((row) => Number.isFinite(row.value));

  block.append(createElement("h3", "", title));

  if (!usableRows.length) {
    block.append(createElement("p", "muted", emptyText));
    return block;
  }

  usableRows.forEach((row) => {
    const item = createElement("div", "bar-row");
    const label = createElement("div", "bar-label");
    const track = createElement("div", "bar-track");
    const fill = createElement("div", "bar-fill");
    const value = createElement("span", "bar-value", formatPercent(row.value));

    fill.style.width = `${Math.max(0, Math.min(100, row.value))}%`;
    label.append(createElement("strong", "", row.name), createElement("span", "muted", row.caption));
    track.append(fill);
    item.append(label, track, value);
    list.append(item);
  });

  block.append(list);
  return block;
}

function renderHistoryDetails(summary) {
  const grid = createElement("div", "history-detail-grid");
  grid.append(renderWeakHistory(summary), renderRecentAttempts(summary));
  return grid;
}

function renderWeakHistory(summary) {
  const section = createElement("section", "history-block");
  const list = createElement("div", "list-stack");
  section.append(createElement("h3", "", "Recurring Weak Topics"));

  if (!summary.weakTopics.length) {
    list.append(createElement("p", "muted", "Weak topics appear after wrong scorable attempts across submissions."));
  } else {
    summary.weakTopics.slice(0, 6).forEach((topic) => {
      const item = createElement("div", "compact-item");
      item.append(
        createElement("strong", "", topic.name),
        createElement(
          "span",
          "muted",
          `${topic.occurrences} appearance${topic.occurrences === 1 ? "" : "s"} · ${topic.wrong} wrong · ${formatPercent(topic.accuracy)} accuracy`,
        ),
      );
      list.append(item);
    });
  }

  section.append(list);
  return section;
}

function renderRecentAttempts(summary) {
  const section = createElement("section", "table-wrap history-block");
  const table = document.createElement("table");
  section.append(createElement("h3", "", "Recent Attempts"));
  table.innerHTML = `
    <thead>
      <tr>
        <th>Date</th>
        <th>Set</th>
        <th>Score</th>
        <th>Attempted</th>
        <th>Accuracy</th>
        <th>Time</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");
  summary.recentAttempts.forEach((entry) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${formatHistoryDateTime(entry.submittedAt)}</td>
      <td>${formatAttemptQuestionSet(entry)}</td>
      <td>${formatAttemptScore(entry)}</td>
      <td>${entry.attempted}</td>
      <td>${formatAttemptAccuracy(entry)}</td>
      <td>${formatTime(entry.timeTakenSeconds)}</td>
    `;
    tbody.append(tr);
  });

  section.append(table);
  return section;
}

function wireHistoryActions(refresh) {
  document.querySelectorAll("[data-history-action='export']").forEach((button) => {
    button.addEventListener("click", () => exportAttemptHistory());
  });

  document.querySelectorAll("[data-history-action='clear']").forEach((button) => {
    button.addEventListener("click", () => {
      showConfirmDialog({
        title: "Clear attempt history?",
        message: "This deletes score comparison data stored in this browser. Active or saved test attempts are not deleted.",
        confirmLabel: "Clear History",
        danger: true,
        onConfirm: async () => {
          clearAttemptHistory();
          await refresh?.();
        },
      });
    });
  });
}

function exportAttemptHistory() {
  const history = loadAttemptHistory();
  if (!history.length) return;

  const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `upsc-attempt-history-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function renderStatsTable(title, rows) {
  const section = createElement("section", "table-wrap");
  const heading = createElement("h3", "", title);
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Group</th>
        <th>Total</th>
        <th>Attempted</th>
        <th>Correct</th>
        <th>Wrong</th>
        <th>Accuracy</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector("tbody");
  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td></td>
      <td>${row.total}</td>
      <td>${row.attempted}</td>
      <td>${row.correct}</td>
      <td>${row.wrong}</td>
      <td>${formatNumber(row.accuracy)}%</td>
    `;
    tr.querySelector("td").textContent = row.name;
    tbody.append(tr);
  });
  section.append(heading, table);
  return section;
}

function renderTimeAnalysis(result) {
  const section = createElement("section", "table-wrap");
  const heading = createElement("h3", "", "Per-question Time");
  const summary = createElement(
    "p",
    "muted",
    `Total tracked time ${formatTime(result.totalTimeSpentSeconds)} · average ${formatTime(Math.round(result.averageTimePerQuestion))} per question · ${formatTime(Math.round(result.averageTimePerAttempted))} per attempted question`,
  );
  const table = document.createElement("table");
  table.innerHTML = `
    <thead>
      <tr>
        <th>Q</th>
        <th>Time</th>
        <th>Status</th>
        <th>Selected</th>
        <th>Subject</th>
        <th>Topic</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");
  result.questionTimeRows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.question.question_number}</td>
      <td>${formatTime(row.seconds)}</td>
      <td>${row.status}</td>
      <td>${row.selected ? row.selected.toUpperCase() : "-"}</td>
      <td></td>
      <td></td>
    `;
    tr.children[4].textContent = row.question.subject || "Unspecified";
    tr.children[5].textContent = row.question.micro_topic || row.question.theme || "Unspecified";
    tbody.append(tr);
  });

  const slowList = createElement("div", "list-stack time-summary-list");
  result.slowestQuestions.slice(0, 5).forEach((row) => {
    const item = createElement("div", "compact-item");
    item.append(
      createElement("strong", "", `Q${row.question.question_number} · ${formatTime(row.seconds)}`),
      createElement("span", "muted", `${row.status} · ${row.question.subject || "Subject"} · ${row.question.micro_topic || row.question.theme || "Topic"}`),
    );
    slowList.append(item);
  });

  section.append(heading, summary, slowList, table);
  return section;
}

function renderWeakTopics(result) {
  const section = createElement("section", "table-wrap");
  const heading = createElement("h3", "", "Weak Topics");
  const body = createElement("div", "list-stack");

  if (!result.weakTopics.length) {
    body.append(createElement("p", "muted", result.noAnswerKeys ? "Weak-topic detection needs answer keys." : "No weak topics detected."));
  } else {
    result.weakTopics.forEach((topic) => {
      const item = createElement("div", "compact-item");
      item.append(
        createElement("strong", "", topic.name),
        createElement("span", "muted", `${topic.wrong} wrong · ${formatNumber(topic.accuracy)}% accuracy`),
      );
      body.append(item);
    });
  }

  section.append(heading, body);
  return section;
}

function renderQuestionList(title, questions, emptyText) {
  const section = createElement("section", "table-wrap");
  const heading = createElement("h3", "", title);
  const body = createElement("div", "list-stack");

  if (!questions.length) {
    body.append(createElement("p", "muted", emptyText));
  } else {
    questions.slice(0, 20).forEach((question) => {
      const item = createElement("div", "compact-item");
      item.append(
        createElement("strong", "", `Q${question.question_number} · ${question.subject || "Subject"}`),
        createElement("span", "muted", question.question),
      );
      body.append(item);
    });
  }

  section.append(heading, body);
  return section;
}

function renderReview() {
  stopTimer();
  const rows = buildReviewRows(context.questions, context.state);
  const filteredRows = filterReviewRows(rows, context.reviewFilter);

  app.innerHTML = `
    ${renderTopStrip()}
    <main class="page">
      <section class="panel">
        <div class="panel-header">
          <h2>Review · ${getQuestionSetShortLabel()}</h2>
          <p>Selected answers, answer keys, explanations, and question metadata.</p>
        </div>
        <div class="panel-body">
          <div class="review-toolbar" id="reviewToolbar"></div>
          <div class="review-list" id="reviewList"></div>
          <div class="action-row">
            <button class="button" id="backToResult">Back to Result</button>
            <button class="button" id="homeFromReview">Home</button>
          </div>
        </div>
      </section>
    </main>
  `;

  renderReviewToolbar();
  renderReviewRows(filteredRows);
  document.querySelector("#backToResult").addEventListener("click", () => renderResult());
  document.querySelector("#homeFromReview").addEventListener("click", () => renderHome());
}

function renderReviewToolbar() {
  const filters = [
    ["all", "All"],
    ["attempted", "Attempted"],
    ["unattempted", "Unattempted"],
    ["marked", "Marked"],
    ["wrong", "Wrong"],
  ];
  const toolbar = document.querySelector("#reviewToolbar");
  toolbar.innerHTML = "";
  filters.forEach(([key, label]) => {
    const button = createElement("button", `segmented-button ${context.reviewFilter === key ? "active" : ""}`, label);
    button.type = "button";
    button.addEventListener("click", () => {
      context.reviewFilter = key;
      renderReview();
    });
    toolbar.append(button);
  });
}

function renderReviewRows(rows) {
  const list = document.querySelector("#reviewList");
  list.innerHTML = "";

  if (!rows.length) {
    list.append(createElement("p", "muted", "No questions match this filter."));
    return;
  }

  rows.forEach((row) => {
    const item = createElement("article", "review-item");
    const status = getReviewStatus(row);
    const header = createElement("div", "review-item-header");
    header.append(
      createElement("strong", "", `Question ${row.question.question_number}`),
      createElement("span", status.className, status.label),
    );

    const body = createElement("div", "review-item-body");
    const questionText = createElement("div", "question-text");
    const answerGrid = createElement("div", "answer-grid");
    const answerBoxes = [
      answerBox("Selected Answer", formatAnswer(row.question, row.selected) || "Not attempted"),
      answerBox("Correct Answer", formatAnswers(row.question, row.correct) || "Answer key missing"),
      answerBox("Explanation", row.question.explanation || "Explanation not available"),
      answerBox(
        "Metadata",
        `${row.question.subject || "Subject"} · ${row.question.theme || "Theme"} · ${row.question.micro_topic || "Topic"} · ${row.question.difficulty || "Difficulty"}`,
      ),
    ];
    if (row.trackQuestionTime) {
      answerBoxes.splice(2, 0, answerBox("Time Spent", formatTime(row.timeSpentSeconds)));
    }
    answerGrid.append(...answerBoxes);
    renderQuestionContent(row.question.question, questionText);
    body.append(questionText, answerGrid);
    item.append(header, body);
    list.append(item);
  });
}

function answerBox(title, value) {
  const box = createElement("div", "answer-box");
  box.append(createElement("strong", "", title), createElement("span", "", value));
  return box;
}

function renderQuestionContent(text, container) {
  container.innerHTML = "";
  const parsed = parseQuestionText(text);

  if (parsed.intro) {
    container.append(createElement("p", "", parsed.intro));
  }

  if (parsed.kind === "labeled") {
    const list = createElement("div", "statement-list labeled-statements");
    parsed.items.forEach((item) => {
      const block = createElement("div", "statement-card");
      block.append(createElement("strong", "", item.label), createElement("span", "", item.text));
      list.append(block);
    });
    container.append(list);
  } else if (parsed.kind === "ordered") {
    const list = document.createElement("ol");
    list.className = "statement-list";
    parsed.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.text;
      list.append(li);
    });
    container.append(list);
  } else if (!parsed.intro) {
    container.append(createElement("p", "", text));
  }

  if (parsed.tail) {
    container.append(createElement("p", "question-tail", parsed.tail));
  }
}

function parseQuestionText(text) {
  const normalizedText = String(text || "").replace(/\s+/g, " ").trim();
  return (
    parseLabeledQuestion(normalizedText)
    || parseOrderedQuestion(normalizedText, /(?:^|\s)(\d+)\.\s/g)
    || parseOrderedQuestion(normalizedText, /(?:^|\s)(I{1,3}|IV|V)\.\s/g)
    || { kind: "plain", intro: normalizedText, items: [], tail: "" }
  );
}

function parseLabeledQuestion(text) {
  const labelRegex = /(Statement\s*-\s*(?:I{1,3}|IV|V)|Statement\s*(?:I{1,3}|IV|V)|Assertion\s*\([A-Z]\)|Reason\s*\([A-Z]\)|Assertion|Reason)\s*:/gi;
  const matches = [...text.matchAll(labelRegex)];
  if (matches.length < 2) return null;

  const intro = text.slice(0, matches[0].index).trim();
  const items = matches.map((match, index) => {
    const nextMatch = matches[index + 1];
    const start = match.index + match[0].length;
    const end = nextMatch ? nextMatch.index : text.length;
    return {
      label: normalizeQuestionLabel(match[1]),
      text: text.slice(start, end).trim(),
    };
  });

  const splitLast = splitTail(items.at(-1).text);
  items[items.length - 1].text = splitLast.main;

  return {
    kind: "labeled",
    intro,
    items: items.filter((item) => item.text),
    tail: splitLast.tail,
  };
}

function parseOrderedQuestion(text, markerRegex) {
  const matches = [...text.matchAll(markerRegex)];
  if (matches.length < 2) return null;

  const intro = text.slice(0, matches[0].index).trim();
  const items = matches.map((match, index) => {
    const nextMatch = matches[index + 1];
    const start = match.index + match[0].length;
    const end = nextMatch ? nextMatch.index : text.length;
    return { label: match[1], text: text.slice(start, end).trim() };
  });

  const splitLast = splitTail(items.at(-1).text);
  items[items.length - 1].text = splitLast.main;

  return {
    kind: "ordered",
    intro,
    items: items.filter((item) => item.text),
    tail: splitLast.tail,
  };
}

function normalizeQuestionLabel(label) {
  return label.replace(/\s*-\s*/g, "-").replace(/\s+/g, " ").trim();
}

function splitTail(text) {
  const tailPatterns = [
    "Which one of the following",
    "Which of the above",
    "Which of the statements",
    "Which of the pairs",
    "Which of the following",
    "How many of the above",
    "How many of these",
    "Select the correct answer",
    "What is/are",
  ];
  const lowerText = text.toLowerCase();
  const tailIndex = tailPatterns
    .map((pattern) => lowerText.indexOf(pattern.toLowerCase()))
    .filter((index) => index > 0)
    .sort((a, b) => a - b)[0];

  if (!tailIndex) {
    return { main: text.trim(), tail: "" };
  }

  return {
    main: text.slice(0, tailIndex).trim(),
    tail: text.slice(tailIndex).trim(),
  };
}

function formatAttemptScore(entry) {
  if (!entry || !Number.isFinite(entry.score)) return "N/A";
  return formatNumber(entry.score);
}

function formatAttemptQuestionSet(entry) {
  if (!entry) return "Question set";
  return entry.questionSetLabel || (Number.isFinite(entry.year) ? String(entry.year) : "Question set");
}

function formatAttemptAccuracy(entry) {
  if (!entry || entry.correct + entry.wrong === 0) return "N/A";
  return formatPercent(entry.accuracy);
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "N/A";
  return `${formatNumber(value, 1)}%`;
}

function formatSignedPercent(value) {
  if (!Number.isFinite(value)) return "N/A";
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatNumber(value, 1)}%`;
}

function formatHistoryDate(timestamp) {
  return formatDate(timestamp, { month: "short", day: "numeric" });
}

function formatHistoryDateTime(timestamp) {
  return formatDate(timestamp, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(timestamp, options) {
  const date = new Date(Number(timestamp));
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function formatAnswer(question, key) {
  if (!key) return "";
  const option = question.options.find((item) => item.key === key);
  return option ? `${key.toUpperCase()}. ${option.text}` : key.toUpperCase();
}

function formatAnswers(question, keys) {
  if (!Array.isArray(keys) || !keys.length) return "";
  return keys.map((key) => formatAnswer(question, key)).join(" / ");
}

function getReviewStatus(row) {
  if (!row.attempted && row.markedForReview) return { label: "Marked · Unattempted", className: "status-neutral" };
  if (!row.attempted) return { label: "Unattempted", className: "status-neutral" };
  if (!row.hasAnswer) return { label: "Answer key missing", className: "status-neutral" };
  if (row.isCorrect) return { label: "Correct", className: "status-good" };
  return { label: "Wrong", className: "status-bad" };
}

function showConfirmDialog({ title, message, confirmLabel, danger = false, onConfirm }) {
  document.querySelector(".modal-backdrop")?.remove();

  const backdrop = createElement("div", "modal-backdrop");
  const dialog = createElement("section", "modal-dialog");
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "confirmDialogTitle");

  const heading = createElement("h2", "", title);
  heading.id = "confirmDialogTitle";
  const body = createElement("p", "muted", message);
  const actions = createElement("div", "modal-actions");
  const cancelButton = createElement("button", "button", "Cancel");
  const confirmButton = createElement("button", `button ${danger ? "danger" : "primary"}`, confirmLabel || "Confirm");

  cancelButton.type = "button";
  confirmButton.type = "button";
  cancelButton.addEventListener("click", () => backdrop.remove());
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) backdrop.remove();
  });
  confirmButton.addEventListener("click", async () => {
    backdrop.remove();
    await onConfirm?.();
  });

  actions.append(cancelButton, confirmButton);
  dialog.append(heading, body, actions);
  backdrop.append(dialog);
  document.body.append(backdrop);
  confirmButton.focus();
}

async function init() {
  try {
    context.pattern = await loadExamPattern();
    context.questionSetId = getAvailableQuestionSets(context.pattern)[0].id;
    await renderHome();
  } catch (error) {
    renderError(error);
  }
}

init();
