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
    { id: "daily_questions_2026_06_10", label: "Daily Questions - Jun 10, 2026", shortLabel: "Daily Jun 10", category: "Daily Questions", sourceType: "daily", isoDate: "2026-06-10", questionCount: 7, durationMinutes: 10, path: "generated_questions/daily_questions/daily_questions_2026-06-10.json" },
  ];

  const fallbackNoteDocuments = [
    { id: "daily-2026-06-10", cadence: "daily", title: "UPSC Daily CA Briefing", shortTitle: "10 Jun 2026", date: "2026-06-10", path: "daily_current_affairs/UPSC_CA_2026-06-10.md" },
    { id: "daily-rc-2026-06-10", cadence: "rc", title: "CSAT Daily RC Drill", shortTitle: "RC - 10 Jun", date: "2026-06-10", path: "daily_reading_comprehension/RC_Drill_2026-06-10.md" },
    { id: "weekly-sunday-2026-06-07", cadence: "sunday", title: "Sunday Sweep", shortTitle: "Week of 7 Jun", date: "2026-06-07", path: "weekly/Sunday/Sunday_Sweep_2026-06-07.md" },
    { id: "weekly-csat-practice-2026-06-09", cadence: "weekly-csat", title: "CSAT Practice", shortTitle: "Practice - 9 Jun", date: "2026-06-09", path: "weekly/CSAT/CSAT_Practice_2026-06-09.md" },
    { id: "weekly-csat-pyq-2026-06-08", cadence: "weekly-csat", title: "CSAT PYQ Plan", shortTitle: "PYQ - 8 Jun", date: "2026-06-08", path: "weekly/CSAT/CSAT_PYQ_2026-06-08.md" },
    { id: "weekly-physics-2026-06-10", cadence: "physics", title: "Physics Optional Drill", shortTitle: "10 Jun", date: "2026-06-10", path: "weekly/Physics/Physics_Drill_2026-06-10.md" },
  ];

  const todayIso = currentIsoDate();
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
    return normalized;
  }

  function sortQuestionSets(sets) {
    const rank = { daily: 0, rc: 1, pib: 2, "weekly-news": 3, "weekly-quiz": 4, sectional: 5, csat: 6, pyq: 7, ai: 8, csr: 9 };
    return [...sets].sort((a, b) => {
      if (a.sourceType !== b.sourceType) return (rank[a.sourceType] ?? 9) - (rank[b.sourceType] ?? 9);
      if (a.isoDate || b.isoDate) return String(b.isoDate || "").localeCompare(String(a.isoDate || ""));
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
    };
  }

  function sortNoteDocuments(docs) {
    return [...docs].sort((a, b) => {
      if (a.cadence !== b.cadence) return a.cadence.localeCompare(b.cadence);
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
  }

  function deriveDailyQuiz() {
    const dailySets = questionSets
      .filter((set) => set.sourceType === "daily" && set.isoDate)
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
      .filter((set) => set.sourceType === "rc" && set.isoDate)
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

  async function refreshContentManifest() {
    if (typeof fetch !== "function") return false;
    try {
      const response = await fetch("config/content_manifest.json", { cache: "no-store" });
      if (!response.ok) return false;
      const manifest = await response.json();
      applyManifest(manifest, { notify: true });
      return true;
    } catch (error) {
      return false;
    }
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

  function normalizeQuestion(row, index, questionSet) {
    const answerOptions = Array.isArray(row.accepted_answer_options) ? row.accepted_answer_options : [];
    const answer = normalizeAnswerKey(row.answer_option || row.answer || row.answer_key || answerOptions[0] || "");
    return {
      id: row.id || `${questionSet.id}_${index + 1}`,
      n: Number(row.question_number || row.source_question_number || index + 1),
      subject: row.subject || "General Studies",
      theme: row.theme || "",
      micro: row.micro_topic || row.micro || row.theme || "Topic",
      nature: row.nature || "",
      difficulty: row.difficulty || "Moderate",
      source: inferSource(row, questionSet),
      stem: row.question || row.stem || "",
      passage: row.passage || "",
      statements: Array.isArray(row.statements) ? row.statements : [],
      tail: row.tail || "",
      options: normalizeOptions(row.options),
      answer,
      acceptedAnswers: (answerOptions.length ? answerOptions : [answer]).map(normalizeAnswerKey).filter(Boolean),
      explanation: row.explanation || "Explanation not available.",
    };
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
    loadNoteDocument,
    refreshContentManifest,
    subscribeContent,
  };

  applyManifest(window.UPSC_CONTENT_MANIFEST);
  window.UPSC = api;
  if (!window.UPSC_CONTENT_MANIFEST) refreshContentManifest();
})();
