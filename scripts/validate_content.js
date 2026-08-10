#!/usr/bin/env node
/* Validate every question set and note the manifest points at.
 *
 * scripts/validate_data.py only covers data/processed/*_processed.json, but the
 * scheduled jobs write into generated_data/ and daily/ too — the files most
 * likely to arrive malformed, and the ones users hit first each morning.
 *
 * Questions are pushed through the app's own normalizer (app/data.js) so this
 * checks what the UI will actually render, not a parallel idea of the schema.
 *
 * Usage: node scripts/validate_content.js [--quiet]
 * Exits non-zero when any error is found.
 */

const fs = require("fs");
const path = require("path");
const { loadAppData, ROOT } = require("./load_app_data");
const { buildContentManifest } = require("./generate_content_manifest");

const OPTION_KEYS = ["a", "b", "c", "d"];

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), "utf8"));
}

// data/processed files mark retired questions explicitly; the app excludes them
// from scoring, so a missing answer key there is expected rather than broken.
function isDropped(row) {
  const status = String(row.verification_status || "").toLowerCase();
  return status === "dropped" || row.dropped === true;
}

function validateQuestionSet(api, set, report) {
  const label = set.id;
  let rows;
  try {
    rows = readJson(set.path);
  } catch (error) {
    report.error(`${label}: cannot read ${set.path} (${error.message})`);
    return;
  }
  if (!Array.isArray(rows)) {
    report.error(`${label}: ${set.path} must contain a JSON array`);
    return;
  }
  if (!rows.length) {
    report.error(`${label}: ${set.path} is empty`);
    return;
  }
  if (set.questionCount && set.questionCount !== rows.length) {
    report.warn(`${label}: manifest says ${set.questionCount} questions, file has ${rows.length}`);
  }

  const seenNumbers = new Set();
  let answered = 0;
  rows.forEach((row, index) => {
    const where = `${label} q${index + 1}`;
    let question;
    try {
      question = api.parsing.normalizeQuestion(row, index, set);
    } catch (error) {
      report.error(`${where}: normalizer threw (${error.message})`);
      return;
    }

    const hasPrompt = question.stem.trim() || question.passage.trim() || question.statements.length;
    if (!hasPrompt) report.error(`${where}: no question text after parsing`);

    const keys = question.options.map((option) => option.key);
    if (question.options.length !== 4) {
      report.error(`${where}: ${question.options.length} options, expected 4`);
    }
    if (new Set(keys).size !== keys.length) {
      report.error(`${where}: duplicate option keys [${keys.join(", ")}]`);
    }
    const strayKeys = keys.filter((key) => !OPTION_KEYS.includes(key));
    if (strayKeys.length) {
      report.error(`${where}: option keys outside a-d [${strayKeys.join(", ")}]`);
    }
    const blank = question.options.filter((option) => !String(option.text).trim());
    if (blank.length) report.error(`${where}: ${blank.length} option(s) with no text`);

    if (!question.answer) {
      // The app already excludes unkeyed questions from scoring and shows a
      // provisional-score notice, so a gap degrades rather than breaks.
      if (!isDropped(row)) report.warn(`${where}: no answer key`);
    } else if (!keys.includes(question.answer)) {
      report.error(`${where}: answer "${question.answer}" is not one of [${keys.join(", ")}]`);
    } else {
      answered++;
    }
    for (const accepted of question.acceptedAnswers) {
      if (accepted && !keys.includes(accepted)) {
        report.error(`${where}: accepted answer "${accepted}" is not one of [${keys.join(", ")}]`);
      }
    }

    // A "consider the following statements" question whose list never parsed
    // renders as one unbroken blob instead of a numbered list.
    if (/consider the following statements|which of the above statements/i.test(question.stem)
      && !question.statements.length && !question.passage) {
      report.warn(`${where}: statement list did not parse — will render as a single block`);
    }

    // The stem attributes every statement to one actor; if the statements are
    // about other actors the question cannot be answered as asked.
    if (question.statements.length >= 2 && /\bdid\s+(india|the government|the centre|the union government)\b/i.test(question.stem)) {
      report.warn(`${where}: stem asks what India did, but the statements may not all be Indian actions`);
    }

    // Trailing document content swept into an explanation by the generator.
    // normalizeQuestion trims the known shapes, so only report what survives —
    // a warning here means a new footer shape needs handling.
    const rawExplanation = String(row.explanation || "");
    const contaminated = /Scoring guide|Recall Prompt|(^|[.!?)])\s+RP?\d\s*[.—–]\s|\s-{3,}\s/i;
    if (contaminated.test(question.explanation)) {
      report.warn(`${where}: explanation still carries the note's recap/footer text after trimming`);
    } else if (contaminated.test(rawExplanation)) {
      report.trimmed(`${where}: explanation footer trimmed (${rawExplanation.length} → ${question.explanation.length} chars)`);
    }

    if (seenNumbers.has(question.n)) report.warn(`${where}: duplicate question number ${question.n}`);
    seenNumbers.add(question.n);
  });

  if (!answered) {
    report.warn(`${label}: no answer keys at all — excluded from the site (${set.path})`);
  }
}

// A generation that produced questions but no answer keys cannot be scored, so
// serving it is worse than not serving it. buildContentManifest output is
// filtered through this before the site is built.
function unscoreableSetIds(manifest) {
  const bad = [];
  for (const set of manifest.questionSets || []) {
    let rows;
    try {
      rows = readJson(set.path);
    } catch (error) {
      bad.push({ id: set.id, path: set.path, reason: "unreadable" });
      continue;
    }
    if (!Array.isArray(rows) || !rows.length) {
      bad.push({ id: set.id, path: set.path, reason: "empty" });
      continue;
    }
    const hasAnyKey = rows.some((row) => {
      if (isDropped(row)) return false;
      const raw = row.answer_option || row.answer || row.answer_key
        || (Array.isArray(row.accepted_answer_options) ? row.accepted_answer_options[0] : "");
      return Boolean(String(raw || "").trim());
    });
    if (!hasAnyKey) bad.push({ id: set.id, path: set.path, reason: "no answer keys" });
  }
  return bad;
}

function validateNote(note, report) {
  const abs = path.join(ROOT, note.path);
  if (!fs.existsSync(abs)) {
    report.error(`${note.id}: missing note file ${note.path}`);
    return;
  }
  if (fs.statSync(abs).size === 0) report.error(`${note.id}: ${note.path} is empty`);
}

function run({ quiet = false, manifest = null } = {}) {
  const api = loadAppData({ manifest: manifest || buildContentManifest(ROOT) });
  const errors = [];
  const warnings = [];
  const trimmed = [];
  const report = {
    error: (message) => errors.push(message),
    warn: (message) => warnings.push(message),
    trimmed: (message) => trimmed.push(message),
  };

  for (const set of api.questionSets) validateQuestionSet(api, set, report);
  for (const note of api.noteDocuments) validateNote(note, report);

  const totalQuestions = api.questionSets.reduce((sum, set) => sum + (set.questionCount || 0), 0);
  if (!quiet) {
    console.log(`Validated ${api.questionSets.length} question sets (~${totalQuestions} questions) and ${api.noteDocuments.length} notes.`);
  }
  if (trimmed.length && !quiet) {
    console.log(`\n${trimmed.length} explanation(s) auto-trimmed at render time:`);
    for (const item of trimmed) console.log(`  - ${item}`);
  }
  if (warnings.length) {
    console.warn(`\n${warnings.length} warning(s):`);
    for (const warning of warnings) console.warn(`  - ${warning}`);
  }
  if (errors.length) {
    console.error(`\n${errors.length} error(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    return 1;
  }
  if (!quiet) console.log("Content validation passed.");
  return 0;
}

if (require.main === module) {
  process.exit(run({ quiet: process.argv.includes("--quiet") }));
}

module.exports = { run, unscoreableSetIds };
