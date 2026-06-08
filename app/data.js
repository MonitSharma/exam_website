// UPSC Platform — sample data (attached to window.UPSC)
(function () {
  function formatDailyDate(isoDate, { compact = false } = {}) {
    const [yearValue, monthValue, dayValue] = String(isoDate).split("-").map(Number);
    const date = new Date(Date.UTC(yearValue, monthValue - 1, dayValue));
    if (Number.isNaN(date.getTime())) return "";
    const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: "UTC" }).format(date);
    const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit", timeZone: "UTC" }).format(date);
    const month = new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(date);
    const year = new Intl.DateTimeFormat("en-GB", { year: "numeric", timeZone: "UTC" }).format(date);
    return compact ? `${day} ${month} ${year}` : `${weekday} · ${day} ${month} ${year}`;
  }

  // Per-daily-set metadata for richer Home-card copy. Key: ISO date.
  // Optional — daily quizzes without an entry here get a generic description.
  const dailyMeta = {
    "2026-06-08": {
      title: "Today’s Daily Quiz",
      description:
        "Seven fresh questions from today’s current-affairs briefing — Oman CEPA, RudraM-II, WED 2026, RBI policy and GDP data.",
    },
  };


  function currentIsoDate(value = new Date()) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }

  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019];
  const todayIso = currentIsoDate();
  const defaultPracticeSetId = "2025";
  const questionSets = [
    { id: "2026", label: "2026 PYQ", shortLabel: "2026", category: "Previous Year Questions", sourceType: "pyq", year: 2026, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2026_processed.json" },
    { id: "2025", label: "2025 PYQ", shortLabel: "2025", category: "Previous Year Questions", sourceType: "pyq", year: 2025, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2025_processed.json" },
    { id: "2024", label: "2024 PYQ", shortLabel: "2024", category: "Previous Year Questions", sourceType: "pyq", year: 2024, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2024_processed.json" },
    { id: "2023", label: "2023 PYQ", shortLabel: "2023", category: "Previous Year Questions", sourceType: "pyq", year: 2023, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2023_processed.json" },
    { id: "2022", label: "2022 PYQ", shortLabel: "2022", category: "Previous Year Questions", sourceType: "pyq", year: 2022, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2022_processed.json" },
    { id: "2021", label: "2021 PYQ", shortLabel: "2021", category: "Previous Year Questions", sourceType: "pyq", year: 2021, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2021_processed.json" },
    { id: "2020", label: "2020 PYQ", shortLabel: "2020", category: "Previous Year Questions", sourceType: "pyq", year: 2020, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2020_processed.json" },
    { id: "2019", label: "2019 PYQ", shortLabel: "2019", category: "Previous Year Questions", sourceType: "pyq", year: 2019, questionCount: 100, durationMinutes: 120, path: "data/processed/upsc_2019_processed.json" },
    { id: "ai_generated_batch_1", label: "AI Generated Questions - Batch 1", shortLabel: "AI Batch 1", category: "AI Generated Practice", sourceType: "ai", questionCount: 93, durationMinutes: 120, path: "data/processed/ai_generated_batch_1_processed.json" },
    { id: "csr_batch_1", label: "CSR Monthly Mock - Batch 1", shortLabel: "CSR Batch 1", category: "CSR Monthly Mock", sourceType: "csr", questionCount: 58, durationMinutes: 120, path: "data/processed/csr_batch_1_processed.json" },
    { id: "csat_full_mock_2026_06_08", label: "CSAT Full Mock - Jun 08, 2026", shortLabel: "CSAT Mock Jun 08", category: "CSAT Full Mock", sourceType: "csat", paper: "GS Paper II (CSAT)", isoDate: "2026-06-08", questionCount: 80, durationMinutes: 120, marksPerCorrect: 2.5, negativeMark: -0.83, noNegativeFromQuestion: 75, path: "data/processed/csat_full_mock_2026_06_08_processed.json" },
    { id: "daily_questions_2026_06_07", label: "Daily Questions - Jun 07, 2026", shortLabel: "Daily Jun 07", category: "Daily Questions", sourceType: "daily", isoDate: "2026-06-07", questionCount: 7, durationMinutes: 10, path: "data/processed/daily_questions_2026_06_07_processed.json" },
    { id: "daily_questions_2026_06_08", label: "Daily Questions - Jun 08, 2026", shortLabel: "Daily Jun 08", category: "Daily Questions", sourceType: "daily", isoDate: "2026-06-08", questionCount: 7, durationMinutes: 10, path: "data/processed/daily_questions_2026_06_08_processed.json" },
  ];
  const questionCache = new Map();

  // Pick the most recent daily set whose isoDate is ≤ today, falling back to
  // whichever one is loaded if today's hasn't been added yet.
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
          : `Most recent daily set — ${formatDailyDate(target.isoDate, { compact: true })}.`),
      durationMinutes: target.durationMinutes || 10,
      isToday,
    };
  }

  const dailyQuiz = deriveDailyQuiz();
  const defaultQuestionSetId = dailyQuiz.questionSetId || defaultPracticeSetId;
  const noteDocuments = [
    { id: "daily-2026-06-08", cadence: "daily", title: "UPSC Daily CA Briefing", shortTitle: "8 Jun 2026", date: "2026-06-08", path: "daily/UPSC_CA_2026-06-08.md" },
    { id: "daily-rc-2026-06-08", cadence: "daily", title: "CSAT Daily RC Drill", shortTitle: "RC - 8 Jun", date: "2026-06-08", path: "daily/RC_Drill_2026-06-08.md" },
    { id: "daily-2026-06-07", cadence: "daily", title: "UPSC Daily CA Briefing", shortTitle: "7 Jun 2026", date: "2026-06-07", path: "daily/UPSC_CA_2026-06-07.md" },
    { id: "weekly-csat-pyq-2026-06-08", cadence: "weekly", title: "CSAT PYQ Plan", shortTitle: "2023 paper · 8 Jun", date: "2026-06-08", path: "weekly/CSAT_PYQ_2026-06-08.md" },
    { id: "weekly-2026-06-07", cadence: "weekly", title: "Sunday Sweep", shortTitle: "Week of 7 Jun", date: "2026-06-07", path: "weekly/Sunday_Sweep_2026-06-07.md" },
    { id: "strategy-csat-full-mock-2026-06-08", cadence: "strategy", title: "CSAT Full Mock", shortTitle: "80 Q - 8 Jun", date: "2026-06-08", path: "generated_data/csat_mocks/CSAT_Full_Mock_2026-06-08.md" },
    { id: "strategy-csat", cadence: "strategy", title: "CSAT Strategy & Technique Guide", shortTitle: "Paper 2 · 80+ aim", date: "2026-06-08", path: "CSAT_Strategy_Guide.md" },
  ];
  const noteCache = new Map();

  function getQuestionSetById(questionSetId) {
    const normalizedId = String(questionSetId || defaultQuestionSetId);
    return questionSets.find((set) => set.id === normalizedId) || questionSets.find((set) => set.id === defaultQuestionSetId);
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
    const answer = normalizeAnswerKey(row.answer_option || row.answer || answerOptions[0] || "");
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
      statements: Array.isArray(row.statements) ? row.statements : [],
      tail: row.tail || "",
      options: normalizeOptions(row.options),
      answer,
      acceptedAnswers: answerOptions.map(normalizeAnswerKey).filter(Boolean),
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
    if (raw.includes("daily")) return "daily";
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

  window.UPSC = {
    dailyQuiz,
    todayIso,
    years,
    questionSets,
    noteDocuments,
    defaultQuestionSetId,
    defaultPracticeSetId,
    getQuestionSetById,
    getQuestionSetsBySource,
    getQuestionMarking,
    getMarkingLabel,
    loadQuestionSet,
    loadNoteDocument,
  };
})();
