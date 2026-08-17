// UPSC Platform data adapter (attached to window.UPSC)
(function () {
  function formatDailyDate(isoDate, { compact = false } = {}) {
    const [yearValue, monthValue, dayValue] = String(isoDate).split("-").map(Number);
    const date = new Date(Date.UTC(yearValue, monthValue - 1, dayValue));
    if (Number.isNaN(date.getTime())) return "";
    const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" }).format(date);
    const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone: "UTC" }).format(date);
    const month = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(date);
    const year = new Intl.DateTimeFormat("en-GB", { year: "numeric", timeZone: "UTC" }).format(date);
    return compact ? `${day} ${month} ${year}` : `${weekday} - ${day} ${month} ${year}`;
  }

  function currentIsoDate(value = new Date()) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }

  const dailyMeta = {
    "2026-06-09": {
      title: "Daily Quiz",
      description:
        "Seven fresh questions from the current-affairs briefing: BRICS chairship, Gaganyaan, Ramsar wetlands, Parliament and inflation.",
    },
    "2026-06-08": {
      title: "Daily Quiz",
      description:
        "Seven questions from the current-affairs briefing: Oman CEPA, RudraM-II, WED 2026, RBI policy and GDP data.",
    },
  };

  const fallbackQuestionSets = [
    { id: "2026", label: "2026 PYQ", shortLabel: "2026", category: "Previous Year Questions", sourceType: "pyq", year: 2026, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2026_processed.json" },
    { id: "2025", label: "2025 PYQ", shortLabel: "2025", category: "Previous Year Questions", sourceType: "pyq", year: 2025, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2025_processed.json" },
    { id: "2024", label: "2024 PYQ", shortLabel: "2024", category: "Previous Year Questions", sourceType: "pyq", year: 2024, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2024_processed.json" },
    { id: "2023", label: "2023 PYQ", shortLabel: "2023", category: "Previous Year Questions", sourceType: "pyq", year: 2023, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2023_processed.json" },
    { id: "2022", label: "2022 PYQ", shortLabel: "2022", category: "Previous Year Questions", sourceType: "pyq", year: 2022, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2022_processed.json" },
    { id: "2021", label: "2021 PYQ", shortLabel: "2021", category: "Previous Year Questions", sourceType: "pyq", year: 2021, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2021_processed.json" },
    { id: "2020", label: "2020 PYQ", shortLabel: "2020", category: "Previous Year Questions", sourceType: "pyq", year: 2020, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2020_processed.json" },
    { id: "2019", label: "2019 PYQ", shortLabel: "2019", category: "Previous Year Questions", sourceType: "pyq", year: 2019, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2019_processed.json" },
    { id: "csat_practice_2026_06_09", label: "CSAT Practice - Jun 09, 2026", shortLabel: "CSAT Practice Jun 09", category: "CSAT Practice", sourceType: "csat", paper: "GS Paper II (CSAT)", isoDate: "2026-06-09", questionCount: 22, durationMinutes: 35, marksPerCorrect: 2, negativeMark: -0.66, path: "data/processed/csat_practice_2026_06_09_processed.json" },
    { id: "daily_questions_2026_06_10", label: "Daily Questions - Jun 10, 2026", shortLabel: "Daily Jun 10", category: "Daily Questions", sourceType: "daily", isoDate: "2026-06-10", questionCount: 7, durationMinutes: 10, path: "daily/daily_questions/daily_questions_2026-06-10.json" },
  ];

  const fallbackNoteDocuments = [
    { id: "daily-2026-06-10", cadence: "daily", title: "UPSC Daily CA Briefing", shortTitle: "10 Jun 2026", date: "2026-06-10", path: "daily/daily_current_affairs/UPSC_CA_2026-06-10.md" },
    { id: "daily-rc-2026-06-10", cadence: "rc", title: "CSAT Daily RC Drill", shortTitle: "RC - 10 Jun", date: "2026-06-10", path: "daily/daily_reading_comprehension/RC_Drill_2026-06-10.md" },
    { id: "weekly-sunday-2026-06-07", cadence: "sunday", title: "Sunday Sweep", shortTitle: "Week of 7 Jun", date: "2026-06-07", path: "weekly/Sunday/Sunday_Sweep_2026-06-07.md" },
    { id: "weekly-csat-practice-2026-06-09", cadence: "weekly-csat", title: "CSAT Practice", shortTitle: "Practice - 9 Jun", date: "2026-06-09", path: "weekly/CSAT/CSAT_Practice_2026-06-09.md" },
    { id: "weekly-csat-pyq-2026-06-08", cadence: "weekly-csat", title: "CSAT PYQ Plan", shortTitle: "PYQ - 8 Jun", date: "2026-06-08", path: "weekly/CSAT/CSAT_PYQ_2026-06-08.md" },
    { id: "weekly-physics-2026-06-10", cadence: "physics", title: "Physics Optional Drill", shortTitle: "10 Jun", date: "2026-06-10", path: "weekly/Physics/Physics_Drill_2026-06-10.md" },
  ];

  const todayIso = currentIsoDate();
  const REVIEW_SET_ID = "__review__";
  const defaultPracticeSetId = "2025";
  const questionCache = new Map();
  const noteCache = new Map();
  const subscribers = new Set();
  let years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019];
  let questionSets = [];
  let noteDocuments = [];
  let dailyQuiz = null;
  let dailyRc = null;
  let defaultQuestionSetId = defaultPracticeSetId;

  function inferSourceType(set) {
    const category = String(set.category || "").toLowerCase();
    const id = String(set.id || "");
    if (set.sourceType) return set.sourceType;
    if (/^\d{4}$/.test(id) || category.includes("previous")) return "pyq";
    if (category.includes("reading comprehension") || id.startsWith("daily_rc")) return "rc";
    if (category.includes("weekly news") || id.startsWith("weekly_news")) return "weekly-news";
    if (category.includes("weekly quiz") || id.startsWith("weekly_quiz")) return "weekly-quiz";
    if (category.includes("daily") || id.startsWith("daily_questions")) return "daily";
    if (category.includes("pib") || id.startsWith("pib_questions")) return "pib";
    if (category.includes("sectional") || id.startsWith("sectional_")) return "sectional";
    if (category.includes("csat") || id.startsWith("csat_")) return "csat";
    if (category.includes("csr") || id.startsWith("csr_")) return "csr";
    return "ai";
  }

  function normalizeQuestionSetMeta(set) {
    const sourceType = inferSourceType(set);
    const questionCount = Number(set.questionCount || set.question_count || 0);
    const durationMinutes = Number(set.durationMinutes || set.duration_minutes || (sourceType === "daily" || sourceType === "pib" ? 10 : sourceType === "rc" ? 8 : sourceType === "sectional" ? 40 : 120));
    const normalized = {
      id: String(set.id || ""),
      label: set.label || set.id || "Question set",
      shortLabel: set.shortLabel || set.short_label || set.label || set.id || "Set",
      category: set.category || "Practice",
      sourceType,
      questionCount,
      durationMinutes,
      path: set.path,
      subjects: Array.isArray(set.subjects) ? set.subjects : [],
    };
    if (set.year) normalized.year = Number(set.year);
    if (set.isoDate || set.iso_date) normalized.isoDate = set.isoDate || set.iso_date;
    if (set.paper) normalized.paper = set.paper;
    if (set.marksPerCorrect || set.marks_per_correct) normalized.marksPerCorrect = Number(set.marksPerCorrect || set.marks_per_correct);
    if (set.negativeMark || set.negative_mark) normalized.negativeMark = Number(set.negativeMark || set.negative_mark);
    if (set.noNegativeFromQuestion || set.no_negative_from_question) normalized.noNegativeFromQuestion = Number(set.noNegativeFromQuestion || set.no_negative_from_question);
    if (set.variant) normalized.variant = set.variant;
    if (set.variantLabel || set.variant_label) normalized.variantLabel = set.variantLabel || set.variant_label;
    if (set.isSupplementary || set.is_supplementary) normalized.isSupplementary = true;
    return normalized;
  }

  function sortQuestionSets(sets) {
    const rank = { daily: 0, rc: 1, pib: 2, "weekly-news": 3, "weekly-quiz": 4, sectional: 5, csat: 6, pyq: 7, ai: 8, csr: 9 };
    return [...sets].sort((a, b) => {
      if (a.sourceType !== b.sourceType) return (rank[a.sourceType] ?? 9) - (rank[b.sourceType] ?? 9);
      if (a.isoDate || b.isoDate) {
        const dateOrder = String(b.isoDate || "").localeCompare(String(a.isoDate || ""));
        if (dateOrder) return dateOrder;
      }
      if (!!a.isSupplementary !== !!b.isSupplementary) return a.isSupplementary ? 1 : -1;
      if (a.year || b.year) return Number(b.year || 0) - Number(a.year || 0);
      return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
    });
  }

  function normalizeNoteDocument(note) {
    return {
      id: String(note.id || note.path || ""),
      cadence: note.cadence || "daily",
      title: note.title || "Note",
      shortTitle: note.shortTitle || note.short_title || note.date || "",
      date: note.date || "",
      path: note.path,
      variant: note.variant || "",
      variantLabel: note.variantLabel || note.variant_label || "",
      isSupplementary: !!(note.isSupplementary || note.is_supplementary),
    };
  }

  function sortNoteDocuments(docs) {
    return [...docs].sort((a, b) => {
      if (a.cadence !== b.cadence) return a.cadence.localeCompare(b.cadence);
      const dateOrder = String(b.date || "").localeCompare(String(a.date || ""));
      if (dateOrder) return dateOrder;
      if (!!a.isSupplementary !== !!b.isSupplementary) return a.isSupplementary ? 1 : -1;
      return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
    });
  }

  function deriveDailyQuiz() {
    const dailySets = questionSets
      .filter((set) => set.sourceType === "daily" && set.isoDate && !set.isSupplementary)
      .sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    if (!dailySets.length) {
      return {
        isoDate: null,
        questionSetId: null,
        title: "Daily quiz coming soon",
        dateLabel: "",
        compactDateLabel: "",
        description: "No daily quizzes have been added yet.",
        durationMinutes: 0,
        isToday: false,
      };
    }
    const dueToday = [...dailySets].reverse().find((set) => set.isoDate <= todayIso);
    const target = dueToday || dailySets[dailySets.length - 1];
    const meta = dailyMeta[target.isoDate] || {};
    const isToday = target.isoDate === todayIso;
    return {
      isoDate: target.isoDate,
      questionSetId: target.id,
      title: meta.title || (isToday ? "Today's Daily Quiz" : "Latest Daily Quiz"),
      dateLabel: formatDailyDate(target.isoDate),
      compactDateLabel: formatDailyDate(target.isoDate, { compact: true }),
      description:
        meta.description ||
        (isToday
          ? "Fresh current-affairs questions for today."
          : `Most recent daily set: ${formatDailyDate(target.isoDate, { compact: true })}.`),
      durationMinutes: target.durationMinutes || 10,
      isToday,
    };
  }

  function deriveDailyRc() {
    const rcSets = questionSets
      .filter((set) => set.sourceType === "rc" && set.isoDate && !set.isSupplementary)
      .sort((a, b) => a.isoDate.localeCompare(b.isoDate));
    if (!rcSets.length) {
      return {
        isoDate: null,
        questionSetId: null,
        title: "Daily RC coming soon",
        dateLabel: "",
        compactDateLabel: "",
        description: "No reading-comprehension drills have been added yet.",
        durationMinutes: 0,
        isToday: false,
      };
    }
    const dueToday = [...rcSets].reverse().find((set) => set.isoDate <= todayIso);
    const target = dueToday || rcSets[rcSets.length - 1];
    const isToday = target.isoDate === todayIso;
    return {
      isoDate: target.isoDate,
      questionSetId: target.id,
      title: isToday ? "Today's Daily RC" : "Latest Daily RC",
      dateLabel: formatDailyDate(target.isoDate),
      compactDateLabel: formatDailyDate(target.isoDate, { compact: true }),
      description: isToday
        ? "Timed CSAT reading-comprehension drill for today."
        : `Most recent RC drill: ${formatDailyDate(target.isoDate, { compact: true })}.`,
      durationMinutes: target.durationMinutes || 8,
      isToday,
    };
  }

  function applyManifest(manifest, { notify = false } = {}) {
    const source = manifest && Array.isArray(manifest.questionSets) ? manifest : {};
    years = Array.isArray(source.years) && source.years.length ? source.years : years;
    questionSets = sortQuestionSets((source.questionSets || fallbackQuestionSets).map(normalizeQuestionSetMeta).filter((set) => set.id && set.path));
    noteDocuments = sortNoteDocuments((source.noteDocuments || fallbackNoteDocuments).map(normalizeNoteDocument).filter((note) => note.id && note.path));
    dailyQuiz = deriveDailyQuiz();
    dailyRc = deriveDailyRc();
    defaultQuestionSetId = dailyQuiz.questionSetId || defaultPracticeSetId;
    if (notify) subscribers.forEach((callback) => callback(api));
  }

  // Production builds hand us a content-hashed manifest URL, so the browser can
  // cache it and only re-download when the content actually changes. Without one
  // (local dev) fall back to the unversioned path with revalidation.
  let manifestPromise = null;
  function refreshContentManifest() {
    if (typeof fetch !== "function") return Promise.resolve(false);
    if (manifestPromise) return manifestPromise;
    const versionedUrl = typeof window !== "undefined" ? window.UPSC_MANIFEST_URL : "";
    const url = versionedUrl || "config/content_manifest.json";
    manifestPromise = fetch(url, versionedUrl ? {} : { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((manifest) => {
        if (!manifest) return false;
        applyManifest(manifest, { notify: true });
        return true;
      })
      .catch(() => false);
    return manifestPromise;
  }

  function getQuestionSetById(questionSetId) {
    const normalizedId = String(questionSetId || defaultQuestionSetId);
    return questionSets.find((set) => set.id === normalizedId)
      || questionSets.find((set) => set.id === defaultQuestionSetId)
      || questionSets[0]
      || null;
  }

  function getQuestionSetsBySource(sourceType) {
    return questionSets.filter((set) => set.sourceType === sourceType);
  }

  async function loadQuestionSet(questionSetId) {
    const questionSet = getQuestionSetById(questionSetId);
    if (!questionSet) throw new Error("Question set not found.");
    if (!questionCache.has(questionSet.id)) {
      const response = await fetch(questionSet.path);
      if (!response.ok) throw new Error(`Could not load ${questionSet.label}.`);
      const rows = await response.json();
      questionCache.set(questionSet.id, rows.map((row, index) => normalizeQuestion(row, index, questionSet)));
    }
    return { questionSet, questions: questionCache.get(questionSet.id) };
  }

  // Build an ad-hoc question set from questions spread across many sets, for
  // the spaced-repetition queue. Questions keep a pointer back to where they
  // came from so their review schedule updates the original, not this session.
  async function loadReviewSession(refs) {
    const bySet = new Map();
    for (const ref of refs) {
      if (!bySet.has(ref.setId)) bySet.set(ref.setId, new Set());
      bySet.get(ref.setId).add(Number(ref.n));
    }
    const collected = [];
    const missing = [];
    for (const [setId, numbers] of bySet) {
      try {
        const { questions } = await loadQuestionSet(setId);
        const found = questions.filter((question) => numbers.has(Number(question.n)));
        for (const question of found) collected.push({ question, setId });
        if (found.length < numbers.size) missing.push(setId);
      } catch (error) {
        // A set that has since been removed or excluded simply drops out.
        missing.push(setId);
      }
    }
    // Renumber sequentially: the test screen keys answers by question number,
    // which is only unique within a single source set.
    const questions = collected.map((item, index) => ({
      ...item.question,
      n: index + 1,
      sourceSetId: item.setId,
      sourceQuestionNumber: item.question.n,
      sourceLabel: getQuestionSetById(item.setId)?.shortLabel || "",
    }));
    const questionSet = {
      id: REVIEW_SET_ID,
      label: "Revision session",
      shortLabel: "Revision",
      category: "Spaced repetition",
      sourceType: "review",
      questionCount: questions.length,
      // Practice, not a mock: no negative marking on a revision run.
      marksPerCorrect: 2,
      negativeMark: 0,
      durationMinutes: Math.max(5, Math.ceil(questions.length * 1.2)),
      subjects: [...new Set(questions.map((question) => question.subject).filter(Boolean))],
      isReview: true,
    };
    return { questionSet, questions, missing };
  }

  // Ask the service worker to store recent material so it is readable with no
  // connection. Without a controlling worker (dev, or first load before the
  // worker activates) this is a no-op rather than an error.
  function offlineAvailable() {
    return typeof navigator !== "undefined"
      && "serviceWorker" in navigator
      && Boolean(navigator.serviceWorker.controller);
  }

  async function saveRecentForOffline({ days = 14 } = {}) {
    if (!offlineAvailable()) return { ok: false, reason: "unsupported" };
    const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    const recent = (item, date) => !date || date >= cutoff;
    // Search shards travel with the notes, otherwise search silently returns
    // nothing when offline even though the notes themselves are available.
    let searchShards = [];
    try {
      searchShards = (await window.UPSC_SEARCH?.shardUrls()) || [];
    } catch (error) {
      searchShards = [];
    }
    const urls = [
      ...noteDocuments.filter((note) => recent(note, note.date)).map((note) => note.path),
      ...questionSets.filter((set) => recent(set, set.isoDate)).map((set) => set.path),
      "data/atlas/news.json",
      ...searchShards,
    ].filter(Boolean);
    return new Promise((resolve) => {
      const done = () => {
        navigator.serviceWorker.removeEventListener("message", onMessage);
        resolve({ ok: true, count: urls.length });
      };
      function onMessage(event) {
        if (event.data && event.data.type === "cache-urls-done") done();
      }
      navigator.serviceWorker.addEventListener("message", onMessage);
      navigator.serviceWorker.controller.postMessage({ type: "cache-urls", urls });
      // Do not leave the UI spinning if the worker never reports back.
      window.setTimeout(done, 30000);
    });
  }

  async function loadNoteDocument(noteId) {
    const note = noteDocuments.find((item) => item.id === noteId);
    if (!note) throw new Error("Note not found.");
    if (!noteCache.has(note.id)) {
      const response = await fetch(note.path);
      if (!response.ok) throw new Error(`Could not load ${note.title}.`);
      noteCache.set(note.id, await response.text());
    }
    return { note, content: noteCache.get(note.id) };
  }

  // The weekly-quiz generator sometimes sweeps the surrounding document into
  // the last question's explanation — the rapid-recap answers and the quiz's
  // scoring footer. Those belong to the note, not to this question, so they are
  // trimmed off. The data files are cleaned too; this keeps a future bad drop
  // from showing a page of unrelated text under one answer.
  const EXPLANATION_TRAILERS = [
    // Markdown rule separating the quiz body from its footer.
    /\s*-{3,}\s[\s\S]*$/,
    /\s*\*?\s*Scoring guide[\s\S]*$/i,
    // "Part C — Recall Prompts" and similar section headings.
    /\s*Part\s+[A-Z]\s*[—–-]\s*Recall[\s\S]*$/i,
    // Recap items: "R1.", "RP2 —", at a sentence boundary.
    /([.!?)])\s+RP?\d\s*[.—–]\s[\s\S]*$/,
  ];

  function cleanExplanation(value) {
    let text = String(value || "").trim();
    for (const pattern of EXPLANATION_TRAILERS) {
      const trimmed = text.replace(pattern, pattern.source.startsWith("(") ? "$1" : "").trim();
      // Never trim away the whole explanation.
      if (trimmed) text = trimmed;
    }
    return text;
  }

  function normalizeQuestion(row, index, questionSet) {
    const answerOptions = Array.isArray(row.accepted_answer_options) ? row.accepted_answer_options : [];
    const answer = normalizeAnswerKey(row.answer_option || row.answer || row.answer_key || answerOptions[0] || "");
    const questionParts = splitQuestionParts(row.question || row.stem || row.q || "", row.statements, row.tail);
    return {
      id: row.id || `${questionSet.id}_${index + 1}`,
      n: Number(row.question_number || row.source_question_number || index + 1),
      subject: row.subject || "General Studies",
      theme: row.theme || "",
      micro: row.micro_topic || row.micro || row.theme || "Topic",
      nature: row.nature || "",
      difficulty: row.difficulty || "Moderate",
      source: inferSource(row, questionSet),
      stem: questionParts.stem,
      passage: row.passage || "",
      statements: questionParts.statements,
      matchLeft: questionParts.matchLeft || null,
      matchRight: questionParts.matchRight || null,
      tail: questionParts.tail,
      options: normalizeOptions(row.options),
      answer,
      acceptedAnswers: (answerOptions.length ? answerOptions : [answer]).map(normalizeAnswerKey).filter(Boolean),
      explanation: cleanExplanation(row.explanation) || "Explanation not available.",
    };
  }

  // Closing clauses ("Which of the statements given above is correct?"). These
  // must only match at a sentence or line boundary and are case-sensitive: an
  // earlier version matched case-insensitively anywhere, so a relative clause
  // inside a statement ("..., which causes renal failure...") was mistaken for
  // the tail and truncated the list, leaving the whole question as one blob.
  const TAIL_OPENERS = "Which|How many|How much|Select|Choose|Consider the above|With reference to the statements";
  const TAIL_START = new RegExp(`(?:^|[.?!\\n])[ \\t]*(?:${TAIL_OPENERS})\\b`, "g");

  function splitTrailingQuestion(text) {
    let start = -1;
    let match;
    TAIL_START.lastIndex = 0;
    while ((match = TAIL_START.exec(text)) !== null) {
      // The opener begins after the boundary character and any spacing.
      const offset = match.index + match[0].length;
      const openerStart = text.slice(match.index, offset).search(/[A-Z]/) + match.index;
      // The closing clause is the last one; earlier hits sit inside statements.
      start = openerStart;
      TAIL_START.lastIndex = match.index + 1;
    }
    if (start <= 0) {
      // Fallback for statements that end without punctuation ("... 3. Gamma
      // Which of the statements above is correct?"). Safe because it demands a
      // capitalised opener whose clause runs unbroken to a final question mark.
      const trailing = text.match(new RegExp(`\\s((?:${TAIL_OPENERS})\\b[^?]*\\?)\\s*$`));
      if (trailing && trailing.index > 0) {
        return { body: text.slice(0, trailing.index).trim(), tail: trailing[1].trim() };
      }
      return { body: text, tail: "" };
    }
    return { body: text.slice(0, start).trim(), tail: text.slice(start).trim() };
  }

  // Statement markers seen across the generated sets, in priority order.
  const STATEMENT_MARKERS = [
    { name: "arabic-dot", first: /(?:^|\n|\s)\s*1\.\s+/, at: (n) => new RegExp(`(?:^|\\s)${n}\\.\\s+`), strip: (n) => new RegExp(`^${n}\\.\\s+`), labels: null },
    { name: "arabic-paren", first: /(?:^|\n|\s)\s*1\)\s+/, at: (n) => new RegExp(`(?:^|\\s)${n}\\)\\s+`), strip: (n) => new RegExp(`^${n}\\)\\s+`), labels: null },
    { name: "arabic-bracketed", first: /(?:^|\n|\s)\s*\(1\)\s+/, at: (n) => new RegExp(`(?:^|\\s)\\(${n}\\)\\s+`), strip: (n) => new RegExp(`^\\(${n}\\)\\s+`), labels: null },
    { name: "roman-upper", first: /(?:^|\n|\s)\s*I\.\s+/, at: (n, l) => new RegExp(`(?:^|\\s)${l}\\.\\s+`), strip: (n, l) => new RegExp(`^${l}\\.\\s+`), labels: ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"] },
    { name: "roman-lower", first: /(?:^|\n|\s)\s*i\.\s+/, at: (n, l) => new RegExp(`(?:^|\\s)${l}\\.\\s+`), strip: (n, l) => new RegExp(`^${l}\\.\\s+`), labels: ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"] },
    // "Statement I: ... Statement II: ..." — standard in recent UPSC papers.
    {
      name: "statement-roman",
      // Papers use "Statement I:", "Statement-I:" and "Statement-I :".
      first: /(?:^|\n|\s)\s*Statement[\s-]+I\s*[:.]/,
      at: (n, l) => new RegExp(`(?:^|\\s)Statement[\\s-]+${l}\\s*[:.]`),
      strip: (n, l) => new RegExp(`^Statement[\\s-]+${l}\\s*[:.]\\s*`),
      keepLabel: (n, l) => `Statement ${l}`,
      labels: ["I", "II", "III", "IV", "V", "VI"],
    },
    // "Statement 1: ... Statement 2: ..." — the Arabic-numeral variant.
    {
      name: "statement-arabic",
      first: /(?:^|\n|\s)\s*Statement[\s-]+1\s*[:.]/,
      at: (n, l) => new RegExp(`(?:^|\\s)Statement[\\s-]+${l}\\s*[:.]`),
      strip: (n, l) => new RegExp(`^Statement[\\s-]+${l}\\s*[:.]\\s*`),
      keepLabel: (n, l) => `Statement ${l}`,
      labels: ["1", "2", "3", "4", "5", "6"],
    },
    // Assertion–Reason pairs.
    {
      name: "assertion-reason",
      first: /(?:^|\n|\s)\s*Assertion\s*\(A\)\s*[:.-]/,
      at: (n, l) => new RegExp(`(?:^|\\s)${l}\\s*[:.-]`),
      strip: (n, l) => new RegExp(`^${l}\\s*[:.-]\\s*`),
      keepLabel: (n, l) => l,
      labels: ["Assertion \\(A\\)", "Reason \\(R\\)"],
      display: ["Assertion (A)", "Reason (R)"],
    },
  ];

  function extractStatements(rest, marker) {
    const statements = [];
    // Assertion/Reason must keep their labels — the list is rendered with plain
    // numbers, which would otherwise lose which half is which.
    const label = (index) => {
      if (!marker.keepLabel) return "";
      const shown = marker.display ? marker.display[index] : marker.labels[index];
      return `${marker.keepLabel(index + 1, shown)}: `;
    };
    let index = 0;
    let position = 0;
    while (index < 12) {
      const current = marker.labels ? marker.labels[index] : String(index + 1);
      const next = marker.labels ? marker.labels[index + 1] : String(index + 2);
      if (!current) break;
      if (!next) {
        statements.push(label(index) + rest.slice(position).replace(marker.strip(index + 1, current), "").trim());
        break;
      }
      const found = rest.slice(position).match(marker.at(index + 2, next));
      if (!found) {
        statements.push(label(index) + rest.slice(position).replace(marker.strip(index + 1, current), "").trim());
        break;
      }
      const boundary = position + found.index + (/^\s/.test(found[0]) ? 1 : 0);
      statements.push(label(index) + rest.slice(position, boundary).replace(marker.strip(index + 1, current), "").trim());
      position = boundary;
      index++;
    }
    return statements.map((item) => item.trim()).filter((item) => item && !/^[A-Za-z()\s]+:$/.test(item));
  }

  // Match-the-columns questions carry two parallel lists — a lettered column
  // (A/B/C…) paired against a numbered column (1/2/3…). They arrive in two
  // shapes: interleaved lines ("A. Foo   1. Bar") and the classic UPSC "List I
  // … List II …" block. Both were previously force-fit through the numbered
  // statement splitter, which sliced each row at its "1." and stranded the "B."
  // label at the tail of the prior item. Detect them first and keep the columns
  // whole so the stem can render them side by side.
  function parseMatchColumns(rawText) {
    const text = String(rawText || "").replace(/\r/g, "");
    if (!/\bmatch\b/i.test(text)) return null;
    return parseInterleavedMatch(text) || parseListMatch(text);
  }

  // "A. Policy Cut   1. Amount…" — one pair per line.
  function parseInterleavedMatch(text) {
    const lineRe = /^\s*([A-Ea-e])\.\s+(.*?)\s+(\d{1,2})\.\s+(.+?)\s*$/;
    const left = [];
    const right = [];
    const stemLines = [];
    let sawPair = false;
    for (const line of text.split("\n")) {
      const m = line.match(lineRe);
      if (m) {
        sawPair = true;
        left.push({ label: m[1].toUpperCase(), text: m[2].trim() });
        right.push({ label: m[3], text: m[4].trim() });
      } else if (!sawPair) {
        stemLines.push(line);
      }
    }
    if (sawPair && left.length >= 2 && left.length === right.length) {
      return { stem: stemLines.join("\n").trim() || "Match the following:", left, right, tail: "" };
    }
    return null;
  }

  // "…List I (…) A. … B. … List II (…) 1. … 2. … Code: …" on a single line.
  function parseListMatch(rawText) {
    const text = rawText.replace(/\s+/g, " ").trim();
    if (!/List\s*I\b/i.test(text) || !/List\s*II\b/i.test(text)) return null;
    let iiIdx = -1;
    let m;
    const gII = /List\s*II\b/gi;
    while ((m = gII.exec(text))) iiIdx = m.index;
    if (iiIdx < 0) return null;
    // "Match List I with List II …" repeats "List I" in the intro, so take the
    // last occurrence before List II — that is the actual column header.
    let iIdx = -1;
    const gI = /List\s*I\b/gi;
    while ((m = gI.exec(text))) {
      if (m.index < iiIdx) iIdx = m.index;
      else break;
    }
    if (iIdx < 0) return null;
    const stem = text.slice(0, iIdx).replace(/\band select the.*/i, "").replace(/[:\-\s]+$/, "").trim()
      || "Match the following:";
    const leftPart = text.slice(iIdx, iiIdx);
    const rightPart = text.slice(iiIdx).replace(/\bCode\s*:.*$/i, "");
    const letterRe = /([A-E])\.\s+(.*?)(?=\s+[A-E]\.\s|\s*$)/g;
    const numRe = /(\d{1,2})\.\s+(.*?)(?=\s+\d{1,2}\.\s|\s*$)/g;
    const left = [];
    const right = [];
    let x;
    while ((x = letterRe.exec(leftPart))) left.push({ label: x[1], text: x[2].replace(/[.\s]+$/, "").trim() });
    while ((x = numRe.exec(rightPart))) right.push({ label: x[1], text: x[2].replace(/[.\s]+$/, "").trim() });
    if (left.length >= 2 && right.length >= 2) return { stem, left, right, tail: "" };
    return null;
  }

  function splitQuestionParts(rawStem, rawStatements, rawTail) {
    const providedStatements = Array.isArray(rawStatements)
      ? rawStatements.map((item) => String(item || "").trim()).filter(Boolean)
      : [];
    const providedTail = String(rawTail || "").trim();
    if (providedStatements.length) {
      // When the generator supplies the parts explicitly, take them as given.
      // A closing clause left inside the stem reads correctly above the list,
      // so moving it is churn rather than a fix.
      return {
        stem: String(rawStem || "").trim(),
        statements: providedStatements,
        tail: providedTail,
      };
    }

    const rawText = String(rawStem || "").trim();
    if (!rawText) return { stem: "", statements: [], tail: providedTail };

    const match = parseMatchColumns(rawText);
    if (match) {
      return { stem: match.stem, statements: [], matchLeft: match.left, matchRight: match.right, tail: providedTail };
    }

    for (const marker of STATEMENT_MARKERS) {
      const first = rawText.match(marker.first);
      if (!first) continue;
      const stem = rawText.slice(0, first.index).trim();
      if (!stem) continue;
      const split = splitTrailingQuestion(rawText.slice(first.index).trim());
      const statements = extractStatements(split.body, marker);
      if (statements.length >= 2) {
        return { stem, statements, tail: split.tail || providedTail };
      }
    }

    // No statement list: the trailing question, if any, still belongs in tail.
    return { stem: rawText, statements: [], tail: providedTail };
  }

  function normalizeAnswerKey(value) {
    const raw = String(value || "").trim().toLowerCase();
    const match = raw.match(/^\(?([a-d])\)?$/);
    return match ? match[1] : raw;
  }

  function normalizeOptions(options) {
    if (Array.isArray(options)) {
      return options.map((option, index) => normalizeOption(option, index));
    }
    if (options && typeof options === "object") {
      return Object.entries(options).map(([key, text]) => ({
        key: String(key).trim().toLowerCase(),
        text: String(text || ""),
      }));
    }
    return [];
  }

  function normalizeOption(option, index) {
    if (option && typeof option === "object" && !Array.isArray(option)) {
      return {
        key: String(option.key || String.fromCharCode(97 + index)).trim().toLowerCase(),
        text: String(option.text || option.value || ""),
      };
    }
    const raw = String(option || "").trim();
    const match = raw.match(/^\s*(?:\(([a-dA-D])\)|([a-dA-D])[.)])\s*(.*)$/);
    return {
      key: String((match && (match[1] || match[2])) || String.fromCharCode(97 + index)).trim().toLowerCase(),
      text: match ? match[3].trim() : raw,
    };
  }

  function inferSource(row, questionSet) {
    const raw = `${row.source_type || ""} ${questionSet.category || ""}`.toLowerCase();
    if (questionSet.sourceType === "csat" || raw.includes("csat")) return "csat";
    if (questionSet.sourceType === "rc" || raw.includes("rc")) return "rc";
    if (questionSet.sourceType === "weekly-news" || raw.includes("weekly-news")) return "weekly-news";
    if (questionSet.sourceType === "weekly-quiz" || raw.includes("weekly-quiz")) return "weekly-quiz";
    if (questionSet.sourceType === "daily" || raw.includes("daily")) return "daily";
    if (questionSet.sourceType === "pib" || raw.includes("pib")) return "pib";
    if (questionSet.sourceType === "sectional" || raw.includes("sectional")) return "sectional";
    if (raw.includes("csr")) return "csr";
    if (raw.includes("ai")) return "ai";
    if (questionSet.year || raw.includes("previous")) return "pyq";
    return "ai";
  }

  function getQuestionMarking(questionSet, question) {
    const correct = Number(questionSet?.marksPerCorrect || 2);
    const negative = Number(questionSet?.negativeMark ?? (questionSet?.sourceType === "csat" ? -0.83 : -0.66));
    const noNegativeFrom = Number(questionSet?.noNegativeFromQuestion || 0);
    const hasNoNegative = noNegativeFrom && Number(question?.n || 0) >= noNegativeFrom;
    return { correct, wrong: hasNoNegative ? 0 : negative };
  }

  function getMarkingLabel(questionSet) {
    const correct = Number(questionSet?.marksPerCorrect || 2);
    const negative = Number(questionSet?.negativeMark ?? (questionSet?.sourceType === "csat" ? -0.83 : -0.66));
    const base = `UPSC marking - +${correct} correct, ${negative} wrong`;
    return questionSet?.noNegativeFromQuestion
      ? `${base}; no negative from Q${questionSet.noNegativeFromQuestion} onward`
      : base;
  }

  function subscribeContent(callback) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  }

  const api = {
    get dailyQuiz() { return dailyQuiz; },
    get dailyRc() { return dailyRc; },
    get todayIso() { return todayIso; },
    get years() { return years; },
    get questionSets() { return questionSets; },
    get noteDocuments() { return noteDocuments; },
    get defaultQuestionSetId() { return defaultQuestionSetId; },
    defaultPracticeSetId,
    getQuestionSetById,
    getQuestionSetsBySource,
    getQuestionMarking,
    getMarkingLabel,
    loadQuestionSet,
    loadReviewSession,
    saveRecentForOffline,
    offlineAvailable,
    loadNoteDocument,
    REVIEW_SET_ID,
    refreshContentManifest,
    subscribeContent,
    // Pure helpers, exposed so scripts/validate_content.js and the test suite
    // exercise the same parsing the app uses instead of a drifting copy.
    parsing: {
      normalizeQuestion,
      normalizeQuestionSetMeta,
      normalizeNoteDocument,
      normalizeOptions,
      normalizeAnswerKey,
      splitQuestionParts,
      inferSourceType,
      applyManifest,
    },
  };

  applyManifest(null);
  window.UPSC = api;
  refreshContentManifest();
})();
