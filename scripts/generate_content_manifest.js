#!/usr/bin/env node
/* Generate the static content manifest used by the frontend and Pages build. */

const fs = require("fs");
const path = require("path");

const DEFAULT_ROOT = path.resolve(__dirname, "..");

function toPosix(value) {
  return String(value).replace(/\\/g, "/");
}

function relPath(root, absPath) {
  return toPosix(path.relative(root, absPath));
}

function readJson(absPath, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(absPath, "utf8"));
  } catch (error) {
    return fallback;
  }
}

function readText(absPath, fallback = "") {
  try {
    return fs.readFileSync(absPath, "utf8");
  } catch (error) {
    return fallback;
  }
}

function walkFiles(absDir) {
  if (!fs.existsSync(absDir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(absDir, { withFileTypes: true })) {
    const absPath = path.join(absDir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(absPath));
    if (entry.isFile()) out.push(absPath);
  }
  return out.sort((a, b) => relPath(DEFAULT_ROOT, a).localeCompare(relPath(DEFAULT_ROOT, b)));
}

function listTopLevelFiles(absDir) {
  if (!fs.existsSync(absDir)) return [];
  return fs.readdirSync(absDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(absDir, entry.name))
    .sort((a, b) => a.localeCompare(b));
}

function normalizeIsoDate(value) {
  const match = String(value || "").match(/(\d{4})[-_](\d{2})[-_](\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : "";
}

function dateSlug(isoDate) {
  return String(isoDate || "").replace(/-/g, "_");
}

function formatDate(isoDate, options = { day: "2-digit", month: "short", year: "numeric" }) {
  const [year, month, day] = String(isoDate || "").split("-").map(Number);
  if (!year || !month || !day) return "";
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, day)));
}

function slugify(value) {
  return String(value || "")
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function jsonRows(absPath) {
  const data = readJson(absPath, []);
  return Array.isArray(data) ? data : [];
}

function uniqueSubjects(rows) {
  const seen = new Set();
  for (const row of rows) {
    const subject = String(row && row.subject ? row.subject : "").trim();
    if (subject) seen.add(subject);
  }
  return [...seen].slice(0, 5);
}

function writeDerivedQuestions(root, relFilePath, rows) {
  const absPath = path.join(root, relFilePath);
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  fs.writeFileSync(absPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  return relFilePath;
}

function optionKeyFromLabel(value) {
  const match = String(value || "").trim().match(/^\(?([a-dA-D])\)?$/);
  return match ? match[1].toLowerCase() : "";
}

function cleanMarkdownInline(value) {
  return String(value || "")
    .replace(/\*\*/g, "")
    .replace(/\\?₹/g, "Rs ")
    .trim();
}

function splitMarkdownSection(text, heading) {
  const pattern = new RegExp(`^##\\s+${heading}(?:\\s*\\([^\\n]*\\))?\\s*\\n([\\s\\S]*?)(?=^##\\s+|(?![\\s\\S]))`, "im");
  const match = String(text || "").match(pattern);
  return match ? match[1].trim() : "";
}

function parseMdQuestions(questionText) {
  const matches = [...String(questionText || "").matchAll(/^\*\*(?:(?:Q)?(\d+)\.\s*([^*]+?)|(?:Q)?(\d+)\.)\*\*[^\S\r\n]*([^\n]*)([\s\S]*?)(?=^\*\*(?:Q)?\d+\.\s*(?:[^*]+?)?\*\*|(?![\s\S]))/gm)];
  return matches.map((match) => {
    const number = Number(match[1] || match[3]);
    const stem = cleanMarkdownInline(match[2] || match[4]);
    const optionBlock = match[5] || "";
    const options = [...optionBlock.matchAll(/^\s*[-*]?\s*(?:\(([a-dA-D])\)|([a-dA-D])[).])\s+(.+)$/gm)]
      .map((item) => ({
        key: String(item[1] || item[2]).toLowerCase(),
        text: cleanMarkdownInline(item[3]),
      }));
    return { number, stem, options };
  }).filter((item) => item.number && item.stem && item.options.length);
}

function parseInlineOptions(line) {
  const text = String(line || "").trim();
  const matches = [...text.matchAll(/(?:^|\s)([a-dA-D])\)\s*/g)];
  if (matches.length < 2) return [];
  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    return {
      key: match[1].toLowerCase(),
      text: cleanMarkdownInline(text.slice(start, end)),
    };
  }).filter((option) => option.key && option.text);
}

function parseMdAnswerMap(answerText) {
  const answers = new Map();
  const matches = [...String(answerText || "").matchAll(/^\s*(?:\*\*)?(?:Q)?(\d+)(?:\.|\s*[—-])\s*(?:\(([a-dA-D])\)|\*\*([A-Da-d])\*\*|([A-Da-d]))(?:\.\*\*|\*\*)?[\s.:—-]*([^\n]+(?:\n(?!\s*(?:\*\*)?(?:Q)?\d+(?:\.|\s*[—-])\s*(?:\([a-dA-D]\)|\*\*[A-Da-d]\*\*|[A-Da-d])).*)*)/gm)];
  for (const match of matches) {
    answers.set(Number(match[1]), {
      answer: optionKeyFromLabel(match[2] || match[3] || match[4]),
      explanation: cleanMarkdownInline(match[5]).replace(/\s+/g, " "),
    });
  }
  return answers;
}

function parseRcAnswerMap(answerText) {
  return parseMdAnswerMap(answerText);
}

function parseDailyRcMarkdown(absPath, isoDate) {
  const text = readText(absPath);
  const passage = splitMarkdownSection(text, "Passage").replace(/\n---+\s*$/, "").trim();
  const questionSection = splitMarkdownSection(text, "Questions");
  const answerSection = splitMarkdownSection(text, "Answers");
  const answers = parseRcAnswerMap(answerSection);
  return parseMdQuestions(questionSection).map((item) => {
    const answer = answers.get(item.number) || {};
    return {
      id: `daily_rc_${dateSlug(isoDate)}_${item.number}`,
      question_number: item.number,
      passage,
      question: item.stem,
      options: item.options,
      answer: answer.answer,
      explanation: answer.explanation || "Explanation not available.",
      subject: "Reading Comprehension",
      theme: "CSAT Daily RC",
      micro_topic: "Reading comprehension",
      nature: "CSAT",
      difficulty: "Moderate",
      source_type: "rc",
    };
  });
}

function parseWeeklyQuizMarkdown(absPath, isoDate) {
  const text = readText(absPath);
  const questionSection = text.split(/^##\s+Part C\b/im)[0] || text;
  const answerSection = splitMarkdownSection(text, "Answers");
  const answers = parseMdAnswerMap(answerSection);
  return parseMdQuestions(questionSection).map((item) => {
    const answer = answers.get(item.number) || {};
    const staticSubject = item.number >= 13 ? "Polity" : "Current Affairs";
    return {
      id: `weekly_quiz_${dateSlug(isoDate)}_${item.number}`,
      question_number: item.number,
      question: item.stem,
      options: item.options,
      answer: answer.answer,
      explanation: answer.explanation || "Explanation not available.",
      subject: staticSubject,
      theme: item.number >= 13 ? "Weekly static recall" : "Weekly current affairs recall",
      micro_topic: "Weekly recall quiz",
      nature: item.number >= 13 ? "Static" : "Current Affairs",
      difficulty: "Moderate",
      source_type: "weekly-quiz",
    };
  });
}

function parseWeeklyNewsMarkdown(absPath, isoDate) {
  const text = readText(absPath);
  const questionSection = splitMarkdownSection(text, "Quick map MCQs");
  const answerSection = text.match(/^#{3}\s+Answer key\s*\n([\s\S]*?)(?=^##\s+|^---+|(?![\s\S]))/im)?.[1] || "";
  const answers = parseMdAnswerMap(answerSection);
  const matches = [...questionSection.matchAll(/^\*\*Q?(\d+)\.\*\*\s*([^\n]+)\n([^\n]+)/gm)];
  return matches.map((match) => {
    const number = Number(match[1]);
    const answer = answers.get(number) || {};
    return {
      id: `weekly_news_${dateSlug(isoDate)}_${number}`,
      question_number: number,
      question: cleanMarkdownInline(match[2]),
      options: parseInlineOptions(match[3]),
      answer: answer.answer,
      explanation: answer.explanation || "Explanation not available.",
      subject: "Geography",
      theme: "Places in News",
      micro_topic: "Map-based current affairs",
      nature: "Current Affairs",
      difficulty: "Easy",
      source_type: "weekly-news",
    };
  }).filter((item) => item.question && item.options.length);
}

function inferIdFromProcessedName(name) {
  const base = name.replace(/_processed\.json$/, "");
  const pyq = base.match(/^upsc_(\d{4})$/);
  return pyq ? pyq[1] : base;
}

function inferSourceType(raw) {
  if (raw.sourceType) return raw.sourceType;
  const id = String(raw.id || "");
  const category = String(raw.category || "").toLowerCase();
  const filePath = String(raw.path || "").toLowerCase();
  if (/^\d{4}$/.test(id) || category.includes("previous") || filePath.includes("/upsc_")) return "pyq";
  if (id.startsWith("daily_questions") || category.includes("daily")) return "daily";
  if (id.startsWith("daily_rc") || category.includes("reading comprehension") || filePath.includes("/rc_questions/")) return "rc";
  if (id.startsWith("weekly_news") || category.includes("weekly news") || filePath.includes("/weekly_news_questions/")) return "weekly-news";
  if (id.startsWith("weekly_quiz") || category.includes("weekly quiz") || filePath.includes("/weekly_quiz_questions/")) return "weekly-quiz";
  if (id.startsWith("pib_questions") || category.includes("pib") || filePath.includes("/pib_questions/")) return "pib";
  if (id.startsWith("csat_") || category.includes("csat")) return "csat";
  if (id.startsWith("ai_generated") || category.includes("ai generated")) return "ai";
  if (id.startsWith("csr_") || category.includes("csr")) return "csr";
  return "ai";
}

function inferCategory(sourceType, id, count) {
  if (sourceType === "pyq") return "Previous Year Questions";
  if (sourceType === "daily") return "Daily Questions";
  if (sourceType === "rc") return "Daily Reading Comprehension";
  if (sourceType === "weekly-news") return "Weekly News";
  if (sourceType === "weekly-quiz") return "Weekly Quiz";
  if (sourceType === "pib") return "PIB Questions";
  if (sourceType === "csat") return id.includes("full_mock") || count >= 75 ? "CSAT Full Mock" : "CSAT Practice";
  if (sourceType === "csr") return "CSR Monthly Mock";
  return "AI Generated Practice";
}

function defaultDuration(sourceType, id, count) {
  if (sourceType === "daily") return 10;
  if (sourceType === "rc") return Math.max(8, Math.round(count * 2));
  if (sourceType === "weekly-news") return Math.max(8, Math.round(count * 1.5));
  if (sourceType === "weekly-quiz") return Math.max(25, Math.round(count * 1.5));
  if (sourceType === "pib") return 10;
  if (sourceType === "csat") return id.includes("full_mock") || count >= 75 ? 120 : Math.max(20, Math.round(count * 1.6));
  if (sourceType === "ai" && count < 30) return 30;
  return 120;
}

function labelForQuestionSet(sourceType, id, isoDate, count) {
  const dateLabel = formatDate(isoDate);
  if (sourceType === "pyq") return `${id} PYQ`;
  if (sourceType === "daily") return `Daily Questions - ${dateLabel}`;
  if (sourceType === "rc") return `Daily RC Drill - ${dateLabel}`;
  if (sourceType === "weekly-news") return `Weekly Places in News - ${dateLabel}`;
  if (sourceType === "weekly-quiz") return `Weekly Recall Quiz - ${dateLabel}`;
  if (sourceType === "pib") return `PIB Questions - ${dateLabel}`;
  if (sourceType === "csat") return `${id.includes("full_mock") || count >= 75 ? "CSAT Full Mock" : "CSAT Practice"} - ${dateLabel}`;
  if (sourceType === "csr") {
    const batch = id.match(/batch_(\d+)/)?.[1] || "";
    return `CSR Monthly Mock - Batch ${batch}`;
  }
  const batch = id.match(/batch_(\d+)/)?.[1] || "";
  return batch ? `AI Generated Questions - Batch ${batch}` : id.replace(/_/g, " ");
}

function shortLabelForQuestionSet(sourceType, id, isoDate, count) {
  const shortDate = isoDate ? formatDate(isoDate, { day: "2-digit", month: "short" }) : "";
  if (sourceType === "pyq") return id;
  if (sourceType === "daily") return `Daily ${shortDate}`;
  if (sourceType === "rc") return `RC ${shortDate}`;
  if (sourceType === "weekly-news") return `News ${shortDate}`;
  if (sourceType === "weekly-quiz") return `Weekly Quiz ${shortDate}`;
  if (sourceType === "pib") return `PIB ${shortDate}`;
  if (sourceType === "csat") return `${id.includes("full_mock") || count >= 75 ? "CSAT Mock" : "CSAT Practice"} ${shortDate}`;
  if (sourceType === "csr") return `CSR Batch ${id.match(/batch_(\d+)/)?.[1] || ""}`.trim();
  return `AI Batch ${id.match(/batch_(\d+)/)?.[1] || ""}`.trim();
}

function normalizeQuestionSet(root, raw) {
  const filePath = raw.path || "";
  const absPath = filePath ? path.join(root, filePath) : "";
  const rows = absPath ? jsonRows(absPath) : [];
  const count = Number(raw.questionCount || raw.question_count || rows.length || 0);
  const id = String(raw.id || inferIdFromProcessedName(path.basename(filePath || ""))).trim();
  const sourceType = inferSourceType({ ...raw, id });
  const isoDate = raw.isoDate || raw.iso_date || normalizeIsoDate(id) || normalizeIsoDate(filePath);
  const year = raw.year || (/^\d{4}$/.test(id) ? Number(id) : undefined);
  const category = raw.category || inferCategory(sourceType, id, count);
  const durationMinutes = Number(raw.durationMinutes || raw.duration_minutes || defaultDuration(sourceType, id, count));
  const normalized = {
    id,
    label: raw.label || labelForQuestionSet(sourceType, id, isoDate, count),
    shortLabel: raw.shortLabel || raw.short_label || shortLabelForQuestionSet(sourceType, id, isoDate, count),
    category,
    sourceType,
    questionCount: count,
    durationMinutes,
    path: filePath,
  };
  if (year) normalized.year = year;
  if (isoDate) normalized.isoDate = isoDate;
  if (sourceType === "csat") {
    normalized.paper = "GS Paper II (CSAT)";
    normalized.marksPerCorrect = id.includes("full_mock") || count >= 75 ? 2.5 : 2;
    normalized.negativeMark = id.includes("full_mock") || count >= 75 ? -0.83 : -0.66;
    if (id.includes("full_mock") || count >= 75) normalized.noNegativeFromQuestion = 75;
  }
  if (sourceType === "rc") {
    normalized.paper = "GS Paper II (CSAT)";
    normalized.marksPerCorrect = 2;
    normalized.negativeMark = -0.66;
  }
  const subjects = Array.isArray(raw.subjects) ? raw.subjects : uniqueSubjects(rows);
  if (subjects.length) normalized.subjects = subjects;
  return normalized;
}

function upsertQuestionSet(root, byId, raw) {
  const next = normalizeQuestionSet(root, raw);
  if (!next.id || !next.path) return;
  const current = byId.get(next.id);
  if (!current) {
    byId.set(next.id, next);
    return;
  }
  byId.set(next.id, {
    ...next,
    ...current,
    questionCount: current.questionCount || next.questionCount,
    durationMinutes: current.durationMinutes || next.durationMinutes,
    isoDate: current.isoDate || next.isoDate,
    subjects: current.subjects || next.subjects,
  });
}

function addProcessedQuestionSets(root, byId) {
  const processedDir = path.join(root, "data", "processed");
  for (const absPath of listTopLevelFiles(processedDir).filter((item) => item.endsWith("_processed.json"))) {
    const rel = relPath(root, absPath);
    upsertQuestionSet(root, byId, {
      id: inferIdFromProcessedName(path.basename(absPath)),
      path: rel,
    });
  }
}

function addRawDailyQuestionSets(root, byId) {
  const dirs = [
    path.join(root, "daily", "daily_questions"),
    path.join(root, "generated_questions", "daily_questions"),
  ];
  const seenDates = new Set();
  for (const dir of dirs) {
    const files = listTopLevelFiles(dir)
      .filter((item) => item.endsWith(".json"))
      .sort((a, b) => {
        const aNamed = /^daily_questions_\d{4}-\d{2}-\d{2}\.json$/.test(path.basename(a));
        const bNamed = /^daily_questions_\d{4}-\d{2}-\d{2}\.json$/.test(path.basename(b));
        if (aNamed !== bNamed) return aNamed ? -1 : 1;
        return a.localeCompare(b);
      });
    for (const absPath of files) {
      const isoDate = normalizeIsoDate(path.basename(absPath));
      if (!isoDate) continue;
      if (seenDates.has(isoDate)) continue;
      seenDates.add(isoDate);
      upsertQuestionSet(root, byId, {
        id: `daily_questions_${dateSlug(isoDate)}`,
        category: "Daily Questions",
        sourceType: "daily",
        isoDate,
        durationMinutes: 10,
        path: relPath(root, absPath),
      });
    }
  }
}

function addRawPibQuestionSets(root, byId) {
  const dir = path.join(root, "generated_data", "pib_questions");
  for (const absPath of listTopLevelFiles(dir).filter((item) => item.endsWith(".json"))) {
    const isoDate = normalizeIsoDate(path.basename(absPath));
    if (!isoDate) continue;
    upsertQuestionSet(root, byId, {
      id: `pib_questions_${dateSlug(isoDate)}`,
      category: "PIB Questions",
      sourceType: "pib",
      isoDate,
      durationMinutes: 10,
      path: relPath(root, absPath),
    });
  }
}

function addRawCsatQuestionSets(root, byId) {
  const sources = [
    path.join(root, "generated_data", "csat_questions"),
    path.join(root, "generated_questions", "csat_questions"),
    path.join(root, "generated_questions", "csat_mocks"),
  ];
  for (const dir of sources) {
    for (const absPath of listTopLevelFiles(dir).filter((item) => item.endsWith(".json"))) {
      const isoDate = normalizeIsoDate(path.basename(absPath));
      if (!isoDate) continue;
      const count = jsonRows(absPath).length;
      const fullMock = count >= 75;
      upsertQuestionSet(root, byId, {
        id: `${fullMock ? "csat_full_mock" : "csat_practice"}_${dateSlug(isoDate)}`,
        category: fullMock ? "CSAT Full Mock" : "CSAT Practice",
        sourceType: "csat",
        isoDate,
        durationMinutes: fullMock ? 120 : Math.max(20, Math.round(count * 1.6)),
        path: relPath(root, absPath),
      });
    }
  }
}

function addRawAiGeneratedQuestionSets(root, byId) {
  const dir = path.join(root, "generated_questions", "ai_generated_questions");
  for (const absPath of listTopLevelFiles(dir).filter((item) => /^batch_\d+\.json$/.test(path.basename(item)))) {
    const base = path.basename(absPath, ".json");
    const count = jsonRows(absPath).length;
    if (!count) continue;
    upsertQuestionSet(root, byId, {
      id: `ai_generated_${base}`,
      category: "AI Generated Practice",
      sourceType: "ai",
      durationMinutes: defaultDuration("ai", base, count),
      path: relPath(root, absPath),
    });
  }
}

function addDailyRcQuestionSets(root, byId) {
  const dir = path.join(root, "daily", "daily_reading_comprehension");
  for (const absPath of listTopLevelFiles(dir).filter((item) => /^RC_Drill_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(path.basename(absPath));
    if (!isoDate) continue;
    const rows = parseDailyRcMarkdown(absPath, isoDate);
    if (!rows.length) continue;
    const rel = writeDerivedQuestions(root, path.join("generated_data", "rc_questions", `${isoDate}.json`), rows);
    upsertQuestionSet(root, byId, {
      id: `daily_rc_${dateSlug(isoDate)}`,
      category: "Daily Reading Comprehension",
      sourceType: "rc",
      isoDate,
      durationMinutes: defaultDuration("rc", "", rows.length),
      path: rel,
    });
  }
}

function addWeeklyQuizQuestionSets(root, byId) {
  const dir = path.join(root, "weekly", "weekly_quiz");
  for (const absPath of listTopLevelFiles(dir).filter((item) => /^Recall_Quiz_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(path.basename(absPath));
    if (!isoDate) continue;
    const rows = parseWeeklyQuizMarkdown(absPath, isoDate);
    if (!rows.length) continue;
    const rel = writeDerivedQuestions(root, path.join("generated_data", "weekly_quiz_questions", `${isoDate}.json`), rows);
    upsertQuestionSet(root, byId, {
      id: `weekly_quiz_${dateSlug(isoDate)}`,
      category: "Weekly Quiz",
      sourceType: "weekly-quiz",
      isoDate,
      durationMinutes: defaultDuration("weekly-quiz", "", rows.length),
      path: rel,
    });
  }
  for (const absPath of listTopLevelFiles(dir).filter((item) => /^weekly_questions_\d{4}-\d{2}-\d{2}\.json$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(path.basename(absPath));
    if (!isoDate) continue;
    const count = jsonRows(absPath).length;
    if (!count) continue;
    upsertQuestionSet(root, byId, {
      id: `weekly_quiz_${dateSlug(isoDate)}`,
      category: "Weekly Quiz",
      sourceType: "weekly-quiz",
      isoDate,
      durationMinutes: defaultDuration("weekly-quiz", "", count),
      path: relPath(root, absPath),
    });
  }
}

function addWeeklyNewsQuestionSets(root, byId) {
  const dir = path.join(root, "weekly", "weekly_news");
  for (const absPath of listTopLevelFiles(dir).filter((item) => /^Places_in_News_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(path.basename(absPath));
    if (!isoDate) continue;
    const rows = parseWeeklyNewsMarkdown(absPath, isoDate);
    if (!rows.length) continue;
    const rel = writeDerivedQuestions(root, path.join("generated_data", "weekly_news_questions", `${isoDate}.json`), rows);
    upsertQuestionSet(root, byId, {
      id: `weekly_news_${dateSlug(isoDate)}`,
      category: "Weekly News",
      sourceType: "weekly-news",
      isoDate,
      durationMinutes: defaultDuration("weekly-news", "", rows.length),
      path: rel,
    });
  }
}

function sortQuestionSets(items) {
  const rank = { daily: 0, rc: 1, pib: 2, "weekly-news": 3, "weekly-quiz": 4, csat: 5, pyq: 6, ai: 7, csr: 8 };
  return [...items].sort((a, b) => {
    if (a.sourceType !== b.sourceType) return (rank[a.sourceType] ?? 9) - (rank[b.sourceType] ?? 9);
    if (a.isoDate || b.isoDate) return String(b.isoDate || "").localeCompare(String(a.isoDate || ""));
    if (a.year || b.year) return Number(b.year || 0) - Number(a.year || 0);
    return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
  });
}

function noteTitleFromHeading(absPath, fallback) {
  const heading = readText(absPath).split(/\r?\n/).find((line) => /^#\s+/.test(line));
  if (!heading) return fallback;
  return heading.replace(/^#\s+/, "").replace(/\s+[-\u2013\u2014]\s+.*$/, "").trim() || fallback;
}

function note(root, absPath, cadence, title, shortTitle, isoDate) {
  const rel = relPath(root, absPath);
  return {
    id: slugify(rel),
    cadence,
    title,
    shortTitle,
    date: isoDate || normalizeIsoDate(rel),
    path: rel,
  };
}

function buildNoteDocuments(root = DEFAULT_ROOT) {
  const docs = [];
  const dailyDir = path.join(root, "daily", "daily_current_affairs");
  for (const absPath of listTopLevelFiles(dailyDir).filter((item) => /^UPSC_CA_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(absPath);
    docs.push(note(root, absPath, "daily", "UPSC Daily CA Briefing", formatDate(isoDate), isoDate));
  }

  const pibDir = path.join(root, "daily", "daily_pib");
  for (const absPath of listTopLevelFiles(pibDir).filter((item) => /^PIB_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(absPath);
    docs.push(note(root, absPath, "pib", "Daily PIB Briefing", `PIB - ${formatDate(isoDate, { day: "2-digit", month: "short" })}`, isoDate));
  }

  const rcDir = path.join(root, "daily", "daily_reading_comprehension");
  for (const absPath of listTopLevelFiles(rcDir).filter((item) => /^RC_Drill_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(absPath);
    docs.push(note(root, absPath, "rc", "CSAT Daily RC Drill", `RC - ${formatDate(isoDate, { day: "2-digit", month: "short" })}`, isoDate));
  }

  const sundayDir = path.join(root, "weekly", "Sunday");
  for (const absPath of listTopLevelFiles(sundayDir).filter((item) => /^Sunday_Sweep_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(absPath);
    docs.push(note(root, absPath, "sunday", "Sunday Sweep", `Week of ${formatDate(isoDate, { day: "2-digit", month: "short" })}`, isoDate));
  }

  const csatDir = path.join(root, "weekly", "CSAT");
  for (const absPath of listTopLevelFiles(csatDir).filter((item) => /^CSAT_(Practice|PYQ)_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(absPath);
    const isPyq = path.basename(absPath).includes("PYQ");
    const title = isPyq ? "CSAT PYQ Plan" : "CSAT Practice";
    const prefix = isPyq ? "PYQ" : "Practice";
    docs.push(note(root, absPath, "weekly-csat", title, `${prefix} - ${formatDate(isoDate, { day: "2-digit", month: "short" })}`, isoDate));
  }

  const physicsDir = path.join(root, "weekly", "Physics");
  for (const absPath of listTopLevelFiles(physicsDir).filter((item) => /^Physics_Drill_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(absPath);
    docs.push(note(root, absPath, "physics", "Physics Optional Drill", formatDate(isoDate, { day: "2-digit", month: "short" }), isoDate));
  }

  const editorialsDir = path.join(root, "weekly", "Editorials");
  for (const absPath of listTopLevelFiles(editorialsDir).filter((item) => /^Editorials_Mains_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(absPath);
    docs.push(note(root, absPath, "editorials", "Editorials to Mains", `Mains - ${formatDate(isoDate, { day: "2-digit", month: "short" })}`, isoDate));
  }

  const schemesDir = path.join(root, "weekly", "Schemes");
  for (const absPath of listTopLevelFiles(schemesDir).filter((item) => /^Schemes_Reports_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(absPath);
    docs.push(note(root, absPath, "schemes", "Schemes & Reports", `Reports - ${formatDate(isoDate, { day: "2-digit", month: "short" })}`, isoDate));
  }

  const weeklyNewsDir = path.join(root, "weekly", "weekly_news");
  for (const absPath of listTopLevelFiles(weeklyNewsDir).filter((item) => /^Places_in_News_\d{4}-\d{2}-\d{2}\.md$/.test(path.basename(item)))) {
    const isoDate = normalizeIsoDate(absPath);
    docs.push(note(root, absPath, "weekly-news", "Places in News", `Map - ${formatDate(isoDate, { day: "2-digit", month: "short" })}`, isoDate));
  }

  const legacyWeeklyDir = path.join(root, "weekly");
  for (const absPath of listTopLevelFiles(legacyWeeklyDir).filter((item) => item.endsWith(".md"))) {
    const isoDate = normalizeIsoDate(absPath);
    docs.push(note(root, absPath, "weekly", noteTitleFromHeading(absPath, "Weekly Note"), formatDate(isoDate), isoDate));
  }

  const monthlyDir = path.join(root, "monthly");
  for (const absPath of listTopLevelFiles(monthlyDir).filter((item) => item.endsWith(".md"))) {
    const isoDate = normalizeIsoDate(absPath);
    docs.push(note(root, absPath, "monthly", noteTitleFromHeading(absPath, "Monthly Note"), formatDate(isoDate), isoDate));
  }

  const csatGuide = path.join(root, "CSAT_Strategy_Guide.md");
  if (fs.existsSync(csatGuide)) {
    docs.push(note(root, csatGuide, "strategy", "CSAT Strategy & Technique Guide", "Paper 2", ""));
  }
  const strategyDir = path.join(root, "generated_questions", "csat_mocks_readme");
  for (const absPath of walkFiles(strategyDir).filter((item) => item.endsWith(".md"))) {
    const isoDate = normalizeIsoDate(absPath);
    docs.push(note(root, absPath, "strategy", noteTitleFromHeading(absPath, "CSAT Full Mock"), formatDate(isoDate), isoDate));
  }

  return docs.sort((a, b) => {
    if (a.cadence !== b.cadence) return a.cadence.localeCompare(b.cadence);
    return String(b.date || "").localeCompare(String(a.date || ""));
  });
}

function buildQuestionSets(root = DEFAULT_ROOT) {
  const byId = new Map();
  const patterns = readJson(path.join(root, "config", "exam_patterns.json"), {});
  const registered = patterns?.upsc_cse_gs_paper_1?.question_sets || [];
  for (const item of registered) {
    upsertQuestionSet(root, byId, {
      ...item,
      shortLabel: item.shortLabel || item.short_label,
      durationMinutes: item.durationMinutes || item.duration_minutes,
    });
  }
  addProcessedQuestionSets(root, byId);
  addRawDailyQuestionSets(root, byId);
  addRawPibQuestionSets(root, byId);
  addRawCsatQuestionSets(root, byId);
  addRawAiGeneratedQuestionSets(root, byId);
  addDailyRcQuestionSets(root, byId);
  addWeeklyNewsQuestionSets(root, byId);
  addWeeklyQuizQuestionSets(root, byId);
  return sortQuestionSets([...byId.values()]);
}

function buildContentManifest(root = DEFAULT_ROOT) {
  return {
    version: 1,
    years: [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019],
    questionSets: buildQuestionSets(root),
    noteDocuments: buildNoteDocuments(root),
  };
}

function writeManifestFile(outPath, root = DEFAULT_ROOT, manifest = buildContentManifest(root)) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}

if (require.main === module) {
  const outArg = process.argv[2] || path.join(DEFAULT_ROOT, "config", "content_manifest.json");
  const outPath = path.resolve(process.cwd(), outArg);
  const manifest = writeManifestFile(outPath, DEFAULT_ROOT);
  console.log(`wrote ${relPath(DEFAULT_ROOT, outPath)} (${manifest.questionSets.length} question sets, ${manifest.noteDocuments.length} notes)`);
}

module.exports = {
  buildContentManifest,
  writeManifestFile,
};
