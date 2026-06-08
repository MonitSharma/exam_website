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

  const dailyQuiz = {
    isoDate: "2026-06-07",
    title: "Today’s Daily Quiz",
    dateLabel: formatDailyDate("2026-06-07"),
    compactDateLabel: formatDailyDate("2026-06-07", { compact: true }),
    description:
      "Ten fresh, fact-checked questions on this week’s current affairs — Ramsar sites, the Quad minerals push, the June MPC and more.",
    durationMinutes: 12,
  };

  const questions = [
    {
      n: 1,
      subject: "Environment",
      theme: "Wetlands & Ramsar Convention",
      micro: "Ramsar sites of India",
      nature: "Current Affairs",
      difficulty: "Moderate",
      source: "daily",
      stem: "With reference to India's recently designated 100th Ramsar site, consider the following statements:",
      statements: [
        "It is the Jai Prakash Narayan Bird Sanctuary (Surha Tal), located in Bihar.",
        "India now has the highest number of Ramsar sites in Asia.",
        "India ranks third in the world in number of Ramsar sites.",
      ],
      tail: "Which of the statements given above are correct?",
      options: [
        { key: "a", text: "1 and 2 only" },
        { key: "b", text: "2 and 3 only" },
        { key: "c", text: "1 and 3 only" },
        { key: "d", text: "1, 2 and 3" },
      ],
      answer: "b",
      explanation:
        "Surha Tal / Jai Prakash Narayan Bird Sanctuary is in Ballia, Uttar Pradesh (not Bihar), so 1 is wrong. With 100 sites India is now 1st in Asia and 3rd globally (after the UK with 176 and Mexico with 144).",
    },
    {
      n: 2,
      subject: "International Relations",
      theme: "Quad & Minilateral Groupings",
      micro: "Quad Critical Minerals Initiative",
      nature: "Current Affairs",
      difficulty: "Moderate",
      source: "daily",
      stem: "Consider the following about the Quad Critical Minerals Initiative (2026):",
      statements: [
        "It was announced at the Quad Foreign Ministers' Meeting held in New Delhi.",
        "Its members are India, Australia, Japan and the United States.",
        "The grouping intends to mobilise up to US $20 billion for critical-mineral supply chains.",
      ],
      tail: "Which of the statements given above are correct?",
      options: [
        { key: "a", text: "1 and 2 only" },
        { key: "b", text: "2 and 3 only" },
        { key: "c", text: "1 and 3 only" },
        { key: "d", text: "1, 2 and 3" },
      ],
      answer: "d",
      explanation:
        "All three are correct. The initiative was unveiled at the 11th Quad FMM in New Delhi (26 May 2026); members are India, Australia, Japan and the USA; and the grouping intends to mobilise up to $20 billion for critical-mineral supply chains.",
    },
    {
      n: 3,
      subject: "Economy",
      theme: "Monetary Policy",
      micro: "RBI MPC repo rate decision",
      nature: "Current Affairs",
      difficulty: "Easy",
      source: "daily",
      stem: "With reference to the RBI's June 2026 monetary policy, consider the following statements:",
      statements: [
        "The repo rate was kept unchanged at 5.25%.",
        "The MPC retained a 'neutral' policy stance.",
      ],
      tail: "Which of the statements given above are correct?",
      options: [
        { key: "a", text: "1 only" },
        { key: "b", text: "2 only" },
        { key: "c", text: "Both 1 and 2" },
        { key: "d", text: "Neither 1 nor 2" },
      ],
      answer: "c",
      explanation:
        "In its decision announced on 5 June 2026 the MPC unanimously kept the repo rate unchanged at 5.25% and retained a 'neutral' stance, citing CPI inflation below target but with an upward bias.",
    },
    {
      n: 4,
      subject: "Science & Tech",
      theme: "Space Technology",
      micro: "ISRO Earth-observation satellites",
      nature: "Current Affairs",
      difficulty: "Moderate",
      source: "daily",
      stem: "GISAT-1A (EOS-05), recently in the news, is best described as:",
      statements: [],
      tail: "",
      options: [
        { key: "a", text: "A polar Sun-synchronous remote-sensing satellite" },
        { key: "b", text: "A geostationary Earth-observation (geo-imaging) satellite" },
        { key: "c", text: "A navigation satellite of the NavIC constellation" },
        { key: "d", text: "A dedicated communication satellite for broadcasting" },
      ],
      answer: "b",
      explanation:
        "GISAT/EOS is a geostationary geo-imaging Earth-observation satellite. Unlike polar Sun-synchronous remote-sensing satellites, it sits over a fixed point and provides near-continuous, near-real-time imaging of the subcontinent for disaster and hazard monitoring.",
    },
    {
      n: 5,
      subject: "Polity",
      theme: "Education Governance / NEP 2020",
      micro: "UGC Foreign HEI Regulations 2023",
      nature: "Current Affairs",
      difficulty: "Easy",
      source: "pyq",
      stem:
        "The setting up of branch campuses of foreign universities in India (e.g., University of Liverpool, Bengaluru) is governed by the 2023 regulations of:",
      statements: [],
      tail: "",
      options: [
        { key: "a", text: "AICTE" },
        { key: "b", text: "University Grants Commission (UGC)" },
        { key: "c", text: "Ministry of External Affairs" },
        { key: "d", text: "NITI Aayog" },
      ],
      answer: "b",
      explanation:
        "Foreign branch campuses operate under the UGC (Setting up & Operation of Campuses of Foreign Higher Educational Institutions in India) Regulations, 2023, which flow from NEP 2020's emphasis on internationalisation of higher education.",
    },
    {
      n: 6,
      subject: "Environment",
      theme: "Wetlands & Ramsar Convention",
      micro: "Montreux Record",
      nature: "Conceptual",
      difficulty: "Moderate",
      source: "pyq",
      stem: "With reference to the Montreux Record under the Ramsar Convention, consider the following statements:",
      statements: [
        "It is a register of Ramsar sites where ecological character has changed, or is likely to change, due to human interference.",
        "Keoladeo National Park and Loktak Lake from India are on the Montreux Record.",
        "Chilika Lake was removed from the Montreux Record after successful restoration.",
      ],
      tail: "Which of the statements given above are correct?",
      options: [
        { key: "a", text: "1 and 2 only" },
        { key: "b", text: "2 and 3 only" },
        { key: "c", text: "1 and 3 only" },
        { key: "d", text: "1, 2 and 3" },
      ],
      answer: "d",
      explanation:
        "All three are correct. The Montreux Record flags ecological-character change at listed wetlands; India's entries are Keoladeo (Rajasthan) and Loktak (Manipur); Chilika was delisted after restoration, the second site globally to be removed.",
    },
    {
      n: 7,
      subject: "Economy",
      theme: "Monetary Policy",
      micro: "MPC composition and mandate",
      nature: "Conceptual",
      difficulty: "Moderate",
      source: "pyq",
      stem: "With reference to the Monetary Policy Committee (MPC) of India, consider the following statements:",
      statements: [
        "It is a statutory body constituted under the RBI Act, 1934 (as amended in 2016).",
        "It has six members — three from the RBI and three nominated by the Central Government.",
        "In the event of a tie, the RBI Governor has a second or casting vote.",
      ],
      tail: "Which of the statements given above are correct?",
      options: [
        { key: "a", text: "1 and 2 only" },
        { key: "b", text: "2 and 3 only" },
        { key: "c", text: "1 and 3 only" },
        { key: "d", text: "1, 2 and 3" },
      ],
      answer: "d",
      explanation:
        "All three are correct. The MPC is statutory under the RBI Act 1934 (2016 amendment), has six members (three RBI + three government-nominated), and the Governor holds a casting vote in case of a tie.",
    },
    {
      n: 8,
      subject: "History",
      theme: "Modern India",
      micro: "Revolt of 1857",
      nature: "Conceptual",
      difficulty: "Hard",
      source: "pyq",
      stem: "With reference to the Revolt of 1857, consider the following statements:",
      statements: [
        "The rebellion was proclaimed in the name of Bahadur Shah II.",
        "The Government of India Act, 1858 transferred power from the East India Company to the British Crown.",
      ],
      tail: "Which of the statements given above is/are correct?",
      options: [
        { key: "a", text: "1 only" },
        { key: "b", text: "2 only" },
        { key: "c", text: "Both 1 and 2" },
        { key: "d", text: "Neither 1 nor 2" },
      ],
      answer: "c",
      explanation:
        "Both are correct. The rebels proclaimed Bahadur Shah II as emperor, and the Government of India Act 1858 ended Company rule, transferring governance to the Crown.",
    },
    {
      n: 9,
      subject: "Geography",
      theme: "Physical Geography",
      micro: "Indian monsoon mechanism",
      nature: "Conceptual",
      difficulty: "Moderate",
      source: "ai",
      stem: "Consider the following with reference to the Indian summer monsoon:",
      statements: [
        "The Somali Jet strengthens the cross-equatorial flow that feeds the monsoon.",
        "A positive Indian Ocean Dipole is generally associated with above-normal monsoon rainfall over India.",
      ],
      tail: "Which of the statements given above are correct?",
      options: [
        { key: "a", text: "1 only" },
        { key: "b", text: "2 only" },
        { key: "c", text: "Both 1 and 2" },
        { key: "d", text: "Neither 1 nor 2" },
      ],
      answer: "c",
      explanation:
        "Both are correct. The Somali (Findlater) Jet intensifies the low-level cross-equatorial flow; a positive IOD, with warmer western Indian Ocean, typically favours a stronger monsoon over India.",
    },
    {
      n: 10,
      subject: "Polity",
      theme: "Constitutional Bodies",
      micro: "Finance Commission",
      nature: "Conceptual",
      difficulty: "Easy",
      source: "ai",
      stem: "With reference to the Finance Commission of India, consider the following statements:",
      statements: [
        "It is constituted by the President under Article 280 of the Constitution.",
        "Its recommendations are binding on the Government of India.",
      ],
      tail: "Which of the statements given above is/are correct?",
      options: [
        { key: "a", text: "1 only" },
        { key: "b", text: "2 only" },
        { key: "c", text: "Both 1 and 2" },
        { key: "d", text: "Neither 1 nor 2" },
      ],
      answer: "a",
      explanation:
        "Only 1 is correct. The Finance Commission is constituted under Article 280; its recommendations are advisory, not binding on the government.",
    },
  ];

  // Pre-filled answers to demo a completed attempt (review + results screens)
  const demoAttempt = {
    // qn -> chosen option key (null = unattempted)
    1: "b", 2: "d", 3: "c", 4: "a", 5: "b",
    6: "d", 7: "d", 8: "c", 9: "b", 10: "a",
  };

  // Mock attempt history for the dashboard
  const history = [
    { id: 1, date: "May 12", label: "UPSC GS — 2022", score: 78, max: 200, accuracy: 61, attempted: 78, correct: 49 },
    { id: 2, date: "May 18", label: "UPSC GS — 2023", score: 84, max: 200, accuracy: 64, attempted: 80, correct: 53 },
    { id: 3, date: "May 25", label: "Daily Quiz · May 25", score: 12, max: 20, accuracy: 70, attempted: 10, correct: 7 },
    { id: 4, date: "May 30", label: "UPSC GS — 2024", score: 96, max: 200, accuracy: 68, attempted: 82, correct: 56 },
    { id: 5, date: "Jun 03", label: "AI Set · Polity", score: 32, max: 40, accuracy: 80, attempted: 20, correct: 16 },
    { id: 6, date: "Jun 07", label: "UPSC GS — 2025", score: 108, max: 200, accuracy: 71, attempted: 85, correct: 60 },
  ];

  const subjectAccuracy = [
    { subject: "Polity", acc: 78, attempts: 120 },
    { subject: "Economy", acc: 64, attempts: 98 },
    { subject: "History", acc: 52, attempts: 86 },
    { subject: "Geography", acc: 69, attempts: 74 },
    { subject: "Environment", acc: 81, attempts: 110 },
    { subject: "Science & Tech", acc: 58, attempts: 64 },
    { subject: "Int'l Relations", acc: 73, attempts: 41 },
  ];

  const weakTopics = [
    { topic: "Medieval Indian art & architecture", subject: "History", acc: 38 },
    { topic: "Balance of Payments & external sector", subject: "Economy", acc: 44 },
    { topic: "Soil types & distribution", subject: "Geography", acc: 47 },
    { topic: "Biodiversity conventions", subject: "Environment", acc: 49 },
  ];

  function currentIsoDate(value = new Date()) {
    return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
  }

  const years = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019];
  const todayIso = currentIsoDate();
  const defaultQuestionSetId = "daily_questions_2026_06_07";
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
    { id: defaultQuestionSetId, label: "Daily Questions - Jun 07, 2026", shortLabel: "Daily Jun 07", category: "Daily Questions", sourceType: "daily", isoDate: dailyQuiz.isoDate, questionCount: questions.length, durationMinutes: dailyQuiz.durationMinutes, path: "data/processed/daily_questions_2026_06_07_processed.json" },
  ];
  const questionCache = new Map([[defaultQuestionSetId, questions]]);
  const noteDocuments = [
    { id: "daily-2026-06-07", cadence: "daily", title: "UPSC Daily CA Briefing", shortTitle: "7 Jun 2026", date: "2026-06-07", path: "daily/UPSC_CA_2026-06-07.md" },
    { id: "weekly-2026-06-07", cadence: "weekly", title: "Sunday Sweep", shortTitle: "Week of 7 Jun", date: "2026-06-07", path: "weekly/Sunday_Sweep_2026-06-07.md" },
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
    const answer = String(row.answer_option || row.answer || answerOptions[0] || "").trim().toLowerCase();
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
      acceptedAnswers: answerOptions.map((option) => String(option).trim().toLowerCase()).filter(Boolean),
      explanation: row.explanation || "Explanation not available.",
    };
  }

  function normalizeOptions(options) {
    if (Array.isArray(options)) {
      return options.map((option, index) => ({
        key: String(option.key || String.fromCharCode(97 + index)).trim().toLowerCase(),
        text: String(option.text || option.value || ""),
      }));
    }
    if (options && typeof options === "object") {
      return Object.entries(options).map(([key, text]) => ({
        key: String(key).trim().toLowerCase(),
        text: String(text || ""),
      }));
    }
    return [];
  }

  function inferSource(row, questionSet) {
    const raw = `${row.source_type || ""} ${questionSet.category || ""}`.toLowerCase();
    if (raw.includes("daily")) return "daily";
    if (raw.includes("csr")) return "csr";
    if (raw.includes("ai")) return "ai";
    if (questionSet.year || raw.includes("previous")) return "pyq";
    return "ai";
  }

  window.UPSC = {
    dailyQuiz,
    todayIso,
    questions,
    demoAttempt,
    history,
    subjectAccuracy,
    weakTopics,
    years,
    questionSets,
    noteDocuments,
    defaultQuestionSetId,
    defaultPracticeSetId,
    getQuestionSetById,
    getQuestionSetsBySource,
    loadQuestionSet,
    loadNoteDocument,
  };
})();
