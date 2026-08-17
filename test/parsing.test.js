/* app/data.js question parsing.
 *
 * This is the riskiest code in the repo: a stack of regexes that silently
 * mangles a question when it guesses wrong, producing a quiz that looks fine
 * but reads badly. The cases below are the real shapes found in the corpus.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const { loadAppData } = require("../scripts/load_app_data");

const api = loadAppData();
const { normalizeAnswerKey, normalizeOptions, splitQuestionParts, normalizeQuestion, inferSourceType } = api.parsing;

const SET = { id: "set", sourceType: "daily", label: "Set" };

test("normalizeAnswerKey accepts every shape the generators emit", () => {
  for (const input of ["a", "A", "(a)", "(A)", " a ", "(a) "]) {
    assert.equal(normalizeAnswerKey(input), "a", `for ${JSON.stringify(input)}`);
  }
  assert.equal(normalizeAnswerKey(""), "");
  assert.equal(normalizeAnswerKey(null), "");
  assert.equal(normalizeAnswerKey(undefined), "");
});

test("normalizeAnswerKey leaves an unrecognised value alone rather than guessing", () => {
  assert.equal(normalizeAnswerKey("both a and b"), "both a and b");
});

test("normalizeOptions parses the prefixed-string form", () => {
  const options = normalizeOptions(["(a) First", "(b) Second", "(c) Third", "(d) Fourth"]);
  assert.deepEqual(options.map((o) => o.key), ["a", "b", "c", "d"]);
  assert.deepEqual(options.map((o) => o.text), ["First", "Second", "Third", "Fourth"]);
});

test("normalizeOptions handles 'a.' and 'a)' prefixes", () => {
  assert.deepEqual(normalizeOptions(["a. One", "b) Two"]), [
    { key: "a", text: "One" },
    { key: "b", text: "Two" },
  ]);
});

test("normalizeOptions falls back to positional keys for bare strings", () => {
  const options = normalizeOptions(["One", "Two", "Three", "Four"]);
  assert.deepEqual(options.map((o) => o.key), ["a", "b", "c", "d"]);
  assert.equal(options[2].text, "Three");
});

test("normalizeOptions accepts the object and key/text forms", () => {
  assert.deepEqual(normalizeOptions({ a: "One", b: "Two" }), [
    { key: "a", text: "One" },
    { key: "b", text: "Two" },
  ]);
  assert.deepEqual(normalizeOptions([{ key: "A", text: "One" }]), [{ key: "a", text: "One" }]);
});

test("normalizeOptions never throws on missing or malformed input", () => {
  assert.deepEqual(normalizeOptions(null), []);
  assert.deepEqual(normalizeOptions(undefined), []);
  assert.deepEqual(normalizeOptions("not an array"), []);
});

test("splitQuestionParts separates numbered statements from stem and tail", () => {
  const parts = splitQuestionParts(
    "Consider the following statements: 1. Alpha 2. Beta 3. Gamma Which of the statements given above is correct?",
  );
  assert.equal(parts.stem, "Consider the following statements:");
  assert.deepEqual(parts.statements, ["Alpha", "Beta", "Gamma"]);
  assert.match(parts.tail, /^Which of the statements/);
});

test("splitQuestionParts prefers explicit statements over re-parsing the stem", () => {
  const parts = splitQuestionParts("Stem text", ["One", "Two"], "How many?");
  assert.equal(parts.stem, "Stem text");
  assert.deepEqual(parts.statements, ["One", "Two"]);
  assert.equal(parts.tail, "How many?");
});

test("splitQuestionParts leaves a plain question untouched", () => {
  const parts = splitQuestionParts("Which body publishes the Sustainable Development Report?");
  assert.equal(parts.stem, "Which body publishes the Sustainable Development Report?");
  assert.deepEqual(parts.statements, []);
  assert.equal(parts.tail, "");
});

test("splitQuestionParts does not treat a decimal or date as a statement marker", () => {
  const parts = splitQuestionParts("India's GDP grew 7.8 per cent in 2025. Which agency reported it?");
  assert.deepEqual(parts.statements, []);
  assert.match(parts.stem, /GDP grew 7\.8 per cent/);
});

test("splitQuestionParts keeps interleaved match columns whole", () => {
  const parts = splitQuestionParts(
    "Match the following cut motions with their descriptions:\nA. Policy Cut  1. Amount of the demand be reduced to Re 1\nB. Economy Cut 2. Amount be reduced by a specified sum to effect economy\nC. Token Cut   3. Amount be reduced by Rs 100 to ventilate a specific grievance",
  );
  assert.equal(parts.stem, "Match the following cut motions with their descriptions:");
  assert.deepEqual(parts.statements, []);
  assert.deepEqual(parts.matchLeft, [
    { label: "A", text: "Policy Cut" },
    { label: "B", text: "Economy Cut" },
    { label: "C", text: "Token Cut" },
  ]);
  assert.deepEqual(parts.matchRight.map((r) => r.label), ["1", "2", "3"]);
  assert.equal(parts.matchRight[0].text, "Amount of the demand be reduced to Re 1");
});

test("splitQuestionParts parses List I / List II match blocks", () => {
  const parts = splitQuestionParts(
    "Match List I with List II and select the answer using the code given below the Lists: List I (Project) A. Alpha B. Beta C. Gamma D. Delta List II (Country) 1. Afghanistan 2. Bhutan 3. Sri Lanka 4. Maldives. Code: A B C D",
  );
  assert.deepEqual(parts.matchLeft.map((r) => r.label), ["A", "B", "C", "D"]);
  assert.equal(parts.matchLeft[0].text, "Alpha");
  assert.deepEqual(parts.matchRight.map((r) => r.text), ["Afghanistan", "Bhutan", "Sri Lanka", "Maldives"]);
});

test("splitQuestionParts does not treat 'correctly matched pairs' lists as match columns", () => {
  const parts = splitQuestionParts(
    "Consider the following pairs and select the correctly matched pairs: 1. Alpha : One 2. Beta : Two 3. Gamma : Three",
  );
  assert.equal(parts.matchLeft, undefined);
  assert.deepEqual(parts.statements, ["Alpha : One", "Beta : Two", "Gamma : Three"]);
});

test("splitQuestionParts tolerates empty input", () => {
  assert.deepEqual(splitQuestionParts(""), { stem: "", statements: [], tail: "" });
  assert.deepEqual(splitQuestionParts(null), { stem: "", statements: [], tail: "" });
});

test("normalizeQuestion fills sane defaults for a sparse row", () => {
  const question = normalizeQuestion({ question: "Q?", options: ["(a) x", "(b) y"], answer: "(b)" }, 0, SET);
  assert.equal(question.id, "set_1");
  assert.equal(question.n, 1);
  assert.equal(question.answer, "b");
  assert.deepEqual(question.acceptedAnswers, ["b"]);
  assert.equal(question.subject, "General Studies");
  assert.equal(question.difficulty, "Moderate");
  assert.equal(question.explanation, "Explanation not available.");
});

test("normalizeQuestion keeps every accepted answer when a question has more than one", () => {
  const question = normalizeQuestion(
    { question: "Q?", options: ["(a) x", "(b) y"], answer_option: "a", accepted_answer_options: ["a", "(b)"] },
    0,
    SET,
  );
  assert.deepEqual(question.acceptedAnswers, ["a", "b"]);
});

test("normalizeQuestion carries the reading-comprehension passage through", () => {
  const question = normalizeQuestion(
    { question: "What does the author imply?", passage: "A long passage.", options: ["(a) x"], answer: "a" },
    0,
    { id: "rc", sourceType: "rc" },
  );
  assert.equal(question.passage, "A long passage.");
});

test("normalizeQuestion honours an explicit question number over position", () => {
  const question = normalizeQuestion({ question: "Q?", question_number: 42, options: [], answer: "a" }, 7, SET);
  assert.equal(question.n, 42);
});

test("inferSourceType classifies the generated set ids", () => {
  assert.equal(inferSourceType({ id: "2025" }), "pyq");
  assert.equal(inferSourceType({ id: "pib_questions_2026_07_14" }), "pib");
  assert.equal(inferSourceType({ id: "daily_questions_2026_06_10" }), "daily");
  assert.equal(inferSourceType({ id: "weekly_quiz_2026_07_03" }), "weekly-quiz");
  assert.equal(inferSourceType({ id: "csat_practice_x" }), "csat");
  // An explicit sourceType always wins over the id heuristics.
  assert.equal(inferSourceType({ id: "2025", sourceType: "review" }), "review");
});

/* ---------- regression cases from real corpus defects ---------- */

test("a relative clause inside a statement is not mistaken for the closing question", () => {
  // The tail matcher used to be case-insensitive and unanchored, so ", which
  // causes renal failure" was treated as the closing clause. That truncated the
  // list below two statements and the whole question fell back to one blob.
  const parts = splitQuestionParts(
    "With reference to vulture conservation in India, consider the following statements:\n"
    + "1. The decline of Gyps vultures was traced to diclofenac, which causes renal failure in birds feeding on treated carcasses.\n"
    + "2. Meloxicam has been validated as a vulture-safe alternative.\n"
    + "3. Veterinary use of diclofenac was banned in India in 2006.\n"
    + "Which of the statements given above are correct?",
  );
  assert.equal(parts.stem, "With reference to vulture conservation in India, consider the following statements:");
  assert.equal(parts.statements.length, 3);
  assert.match(parts.statements[0], /which causes renal failure/, "the relative clause stays in its statement");
  assert.equal(parts.tail, "Which of the statements given above are correct?");
});

test("statements numbered with 1) 2) 3) are split", () => {
  const parts = splitQuestionParts(
    "Consider the following statements about millisecond pulsars: 1) They are rapidly rotating neutron stars. "
    + "2) They act as precise natural clocks. 3) The MWA is a low-frequency radio telescope. "
    + "Which of the statements given above are correct?",
  );
  assert.deepEqual(parts.statements.length, 3);
  assert.equal(parts.statements[0], "They are rapidly rotating neutron stars.");
  assert.equal(parts.tail, "Which of the statements given above are correct?");
});

test("Statement I / Statement II lists split and keep their labels", () => {
  const parts = splitQuestionParts(
    "Consider the following statements: Statement I: Alpha is true. Statement II: Beta is true. "
    + "Which one of the following is correct in respect of the above statements?",
  );
  assert.equal(parts.statements.length, 2);
  assert.equal(parts.statements[0], "Statement I: Alpha is true.");
  assert.equal(parts.statements[1], "Statement II: Beta is true.");
  assert.match(parts.tail, /^Which one of the following/);
});

test("the hyphenated and Arabic Statement variants split too", () => {
  const hyphen = splitQuestionParts("Consider the following statements: Statement-I: Alpha. Statement-II : Beta. Which one is correct?");
  assert.equal(hyphen.statements.length, 2);
  assert.equal(hyphen.statements[0], "Statement I: Alpha.");

  const arabic = splitQuestionParts("Consider the following statements: Statement 1: Alpha. Statement 2: Beta. Which one is correct?");
  assert.equal(arabic.statements.length, 2);
  assert.equal(arabic.statements[1], "Statement 2: Beta.");
});

test("Assertion-Reason pairs split and keep their labels", () => {
  const parts = splitQuestionParts(
    "Consider the following statements:\nAssertion (A): The DPSPs are not enforceable by any court.\n"
    + "Reason (R): The DPSPs are fundamental in the governance of the country.\n"
    + "Select the correct answer using the code given below:",
  );
  assert.equal(parts.statements.length, 2);
  assert.match(parts.statements[0], /^Assertion \(A\): /);
  assert.match(parts.statements[1], /^Reason \(R\): /);
  assert.match(parts.tail, /^Select the correct answer/);
});

test("explicitly supplied statements are passed through untouched", () => {
  const parts = splitQuestionParts("Which of the following statements is/are correct?", ["One", "Two"], "");
  assert.equal(parts.stem, "Which of the following statements is/are correct?", "the stem is not reordered");
  assert.deepEqual(parts.statements, ["One", "Two"]);
  assert.equal(parts.tail, "");
});

test("a question with no statement list is left alone", () => {
  const parts = splitQuestionParts("Which body publishes the Sustainable Development Report?");
  assert.deepEqual(parts.statements, []);
  assert.equal(parts.stem, "Which body publishes the Sustainable Development Report?");
});

test("explanations are trimmed of the note's recap and scoring footer", () => {
  const question = normalizeQuestion({
    question: "Q?", options: ["(a) x", "(b) y"], answer: "a",
    explanation: 'India follows "principled distance". RP1. (i) Parliament passed a Bill. RP2. GOBARdhan scheme. '
      + "--- *Scoring guide: 16-20 strong recall. Next week's static subject: Polity.*",
  }, 0, SET);
  assert.equal(question.explanation, 'India follows "principled distance".');
});

test("explanation trimming handles the 'Part C - Recall Prompts' heading and dashed recaps", () => {
  const a = normalizeQuestion({
    question: "Q?", options: [], answer: "a",
    explanation: "Mohiniyattam originates in Kerala. Part C — Recall Prompts R1. Something unrelated.",
  }, 0, SET);
  assert.equal(a.explanation, "Mohiniyattam originates in Kerala.");

  const b = normalizeQuestion({
    question: "Q?", options: [], answer: "a",
    explanation: "Only two are correct. RP1 — (i) China's helium ban. (ii) A US Senate bill.",
  }, 0, SET);
  assert.equal(b.explanation, "Only two are correct.");
});

test("a clean explanation is never truncated", () => {
  const text = "The 44th Amendment removed the Right to Property as a Fundamental Right (Article 300A).";
  const question = normalizeQuestion({ question: "Q?", options: [], answer: "a", explanation: text }, 0, SET);
  assert.equal(question.explanation, text);
});
