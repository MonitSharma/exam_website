// Study Labs — focused, visual revision tools inspired by the reference site.
const { useState: useStateLabs, useEffect: useEffectLabs } = React;

const LAB_PAPERS = [
  { id: "gs1", label: "GS1", title: "History, Geography & Society", blurb: "Build memory with timelines, maps and active recall." },
  { id: "gs2", label: "GS2", title: "Polity, Governance & IR", blurb: "Connect institutions, schemes and current affairs." },
  { id: "gs3", label: "GS3", title: "Economy, Environment & Science", blurb: "Turn systems and processes into visual revision loops." },
  { id: "gs4", label: "GS4", title: "Ethics, Integrity & Aptitude", blurb: "Practise frameworks, thinkers and case decisions." },
];

const LABS_BY_PAPER = {
  gs1: [
    { id: "ancient-timeline", category: "History", status: "Live", tone: "indigo", icon: "timeline", title: "Ancient India Dynastic Timeline", description: "Scrub across four millennia and revise dynasties through overlap, sequence and place." },
    { id: "modern-timeline", category: "History", status: "Live", tone: "green", icon: "timeline", title: "Modern India Timeline (1857–1947)", description: "Trace the freedom struggle as a chain of cause, event and consequence — then test recall." },
    { id: "rivers-recall", category: "Geography", status: "Live", tone: "blue", icon: "map", title: "Rivers of India Recall", description: "Name a river from its source, course and basin clues before revealing the answer." },
    { id: "world-geography", category: "Geography", status: "Live", tone: "teal", icon: "globe", title: "Geography Layers & Recall", description: "Search local river and state layers, then switch to a clue-based physical geography drill." },
  ],
  gs2: [
    { id: "constitution", category: "Polity", status: "Live", tone: "green", icon: "scale", title: "Constitutional Architecture", description: "Recall Articles, amendments and institutions through anchor → function → exam hook cards." },
    { id: "governance", category: "Governance", status: "Live", tone: "saffron", icon: "target", title: "Governance Casebook", description: "Turn schemes and reports into issue → intervention → implementation → outcome chains." },
    { id: "ir", category: "International Relations", status: "Live", tone: "indigo", icon: "globe", title: "India & the World", description: "Explore the groupings, corridors and partnerships already covered in your IR notes." },
  ],
  gs3: [
    { id: "economy", category: "Economy", status: "Live", tone: "saffron", icon: "chart", title: "Economy Mechanism Chains", description: "Follow GST, monetary policy and fiscal concepts through trigger → mechanism → effect → trade-off." },
    { id: "environment", category: "Environment", status: "Live", tone: "teal", icon: "leaf", title: "Environment Recall Deck", description: "Connect species, conventions, protected areas and climate instruments with active recall." },
    { id: "science", category: "Science & Technology", status: "Live", tone: "blue", icon: "bolt", title: "Explain the Technology", description: "Reduce NISAR, SpaDeX, NavIC, CRISPR and IndiaAI to principle → use → limitation." },
  ],
  gs4: [
    { id: "thinkers", category: "Ethics", status: "Live", tone: "rose", icon: "book", title: "Thinkers & Quotations", description: "Revise the thinkers and quotations from your Fodder Bank by idea and answer use." },
    { id: "case-lab", category: "Case Studies", status: "Live", tone: "saffron", icon: "target", title: "Ethics Case Lab", description: "Work through the latest case's stakeholders, options, values and defensible action." },
  ],
};

const ANCIENT_ERAS = [
  { label: "2500 BCE", name: "Indus Valley Civilisation", note: "Urban planning, drainage, craft production and long-distance trade define the Harappan urban phase." },
  { label: "1500 BCE", name: "Early Vedic Period", note: "The early Vedic economy and polity are commonly studied through pastoral life, clans and the Rig Veda." },
  { label: "600 BCE", name: "Mahajanapadas", note: "The second urbanisation, new heterodox ideas and the rise of larger states reshape north India." },
  { label: "322 BCE", name: "Mauryan Empire", note: "A centralised imperial state links administration, economy, diplomacy and Ashokan dhamma." },
  { label: "320 CE", name: "Gupta Period", note: "Political consolidation and achievements in literature, science, art and temple architecture become key revision anchors." },
  { label: "1206 CE", name: "Delhi Sultanate", note: "A sequence of ruling dynasties introduces new political institutions, architecture and cultural synthesis." },
];

const MODERN_EVENTS = [
  { label: "1854", name: "Wood's Despatch", note: "The education despatch laid down a graded system from primary education to universities and is remembered as the Magna Carta of English education in India." },
  { label: "1857", name: "Meerut uprising", note: "Sepoys revolted at Meerut on 10 May and marched to Delhi, turning a military mutiny into a wider rebellion." },
  { label: "1857", name: "Siege of Delhi", note: "Rebel forces proclaimed Bahadur Shah Zafar as emperor; the fall of Delhi became a decisive moment in the suppression of the revolt." },
  { label: "1857", name: "Siege of Cawnpore", note: "Nana Sahib, Tantya Tope and local forces made Kanpur one of the central theatres of the revolt." },
  { label: "1857", name: "Siege of Arrah", note: "Kunwar Singh's region became another important centre of resistance in Bihar." },
  { label: "1878", name: "Vernacular Press Act", note: "Lord Lytton's government used the Act to restrict Indian-language newspapers; Lord Ripon repealed it in 1882." },
  { label: "1885", name: "Indian National Congress", note: "The first session met at Bombay under W. C. Bonnerjee, creating an all-India political platform." },
  { label: "1897", name: "Battle of Saragarhi", note: "Twenty-one Sikh soldiers' last stand became a durable memory of military courage on the frontier." },
  { label: "1897", name: "Siege of Malakand", note: "A frontier rising around the Malakand garrison showed the importance of the north-west frontier in colonial policy." },
  { label: "1897", name: "Tirah Campaign", note: "The campaign to reopen the Khyber exposed the military and administrative costs of frontier control." },
  { label: "1899", name: "Ulgulan", note: "Birsa Munda led the Munda uprising against colonial and landlord oppression in the Chhotanagpur region." },
  { label: "1905", name: "Partition of Bengal", note: "Lord Curzon's partition came into effect on 16 October and triggered the Swadeshi and Boycott movements." },
  { label: "1916", name: "Home Rule Leagues", note: "Bal Gangadhar Tilak and Annie Besant launched parallel leagues demanding self-government for India." },
  { label: "1916", name: "Lucknow Pact", note: "Congress and the Muslim League agreed on a constitutional reform programme; Moderates and Extremists also reunited." },
  { label: "1917", name: "Champaran Satyagraha", note: "Gandhi's first satyagraha in India challenged the tinkathia indigo system in Bihar." },
  { label: "1918", name: "Kheda Satyagraha", note: "The campaign linked crop failure, revenue demands and the claim that the state must respond to distress." },
  { label: "1918", name: "Ahmedabad mill strike", note: "Gandhi used satyagraha and a fast in a labour dispute, extending the repertoire of mass politics." },
  { label: "1919", name: "Rowlatt Act", note: "The Act extended wartime-style extraordinary powers and triggered widespread protest." },
  { label: "1919", name: "Jallianwala Bagh", note: "On Baisakhi, General Dyer ordered firing on an unarmed gathering at Amritsar, transforming the political mood." },
  { label: "1920", name: "Non-Cooperation Movement", note: "Congress adopted mass non-cooperation, linking boycott, swadeshi and the withdrawal of cooperation from colonial institutions." },
  { label: "1920", name: "Khilafat mobilisation", note: "The Khilafat issue created a major, though short-lived, Congress–Muslim political alignment." },
  { label: "1922", name: "Chauri Chaura", note: "After protesters killed policemen, Gandhi withdrew Non-Cooperation to preserve the movement's non-violent discipline." },
  { label: "1925", name: "Kakori action", note: "The Hindustan Republican Association targeted a train carrying government funds to finance revolutionary activity." },
  { label: "1927", name: "Simon Commission", note: "Its all-white composition provoked the 'Simon Go Back' protests and sharpened demands for constitutional self-government." },
  { label: "1929", name: "Purna Swaraj resolution", note: "The Lahore Congress adopted complete independence as the goal and fixed 26 January 1930 for Independence Day observance." },
  { label: "1929", name: "Assembly bomb case", note: "Bhagat Singh and B. K. Dutt threw a bomb in the Central Legislative Assembly to 'make the deaf hear' and courted arrest." },
  { label: "1930", name: "Dandi March", note: "Gandhi's march from Sabarmati to Dandi turned salt into a symbol of colonial extraction and civil disobedience." },
  { label: "1932", name: "Poona Pact", note: "Gandhi and Ambedkar replaced separate electorates for the Depressed Classes with reserved seats within a general electorate." },
  { label: "1942", name: "Quit India Movement", note: "The Bombay session issued the demand for an immediate end to British rule and Gandhi gave the 'Do or Die' call." },
  { label: "1943", name: "Azad Hind Government", note: "Subhas Chandra Bose assumed INA leadership, proclaimed the Provisional Government of Azad Hind and expanded the movement's military and international dimensions." },
  { label: "1946", name: "Cabinet Mission", note: "The plan proposed an interim government and Constituent Assembly while attempting to avoid a fully separate Pakistan through provincial grouping." },
  { label: "1947", name: "Independence and Partition", note: "Power was transferred amid freedom, displacement and the creation of two dominions." },
  { label: "1947", name: "Accession of Junagadh", note: "The Nawab's accession to Pakistan against the demographic majority led to Indian intervention and a plebiscite." },
  { label: "1947", name: "First Kashmir War", note: "The Maharaja's accession to India followed the tribal and Pakistani invasion; the conflict became the first India–Pakistan war." },
];

const RIVER_CARDS = [
  { prompt: "Rises near Lake Mansarovar, flows through the Himalayas and enters India in Arunachal Pradesh.", answer: "Brahmaputra", hook: "Think: Tsangpo in Tibet → Siang/Dihang in Arunachal Pradesh → Brahmaputra in Assam." },
  { prompt: "Rises at Amarkantak and flows west through a rift valley before meeting the Arabian Sea.", answer: "Narmada", hook: "Think: central Indian rift valley, marble rocks at Bhedaghat and westward flow." },
  { prompt: "Rises in the Gangotri glacier and joins the Alaknanda at Devprayag.", answer: "Bhagirathi", hook: "Think: Bhagirathi + Alaknanda = Ganga at Devprayag." },
  { prompt: "Rises in the Brahmagiri Hills and is a major east-flowing river of peninsular India.", answer: "Cauvery", hook: "Think: Karnataka → Tamil Nadu, deltaic agriculture and the Cauvery water dispute." },
];

const LAB_SOURCES = {
  "ancient-timeline": [
    { label: "Historical Atlas", path: "data/maps/bharatrajya-india-history.json" },
    { label: "History sectional pack", id: "weekly-sectional-sectional-modern-history-2026-08-10" },
  ],
  "modern-timeline": [
    { label: "Modern History sectional pack", id: "weekly-sectional-sectional-modern-history-2026-08-10" },
    { label: "Historical Atlas events", path: "data/maps/bharatrajya-india-history.json" },
  ],
  "rivers-recall": [
    { label: "India rivers layer", path: "data/maps/india_rivers.geojson" },
    { label: "Geography sectional pack", id: "weekly-sectional-sectional-geography-2026-07-06" },
  ],
  "world-geography": [
    { label: "World country layer", path: "data/maps/world_countries_india_pov.geojson" },
    { label: "Geography sectional pack", id: "weekly-sectional-sectional-geography-2026-07-06" },
  ],
  constitution: [
    { label: "Polity & Governance sectional pack", id: "weekly-sectional-sectional-polity-governance-2026-06-20" },
    { label: "Polity book-topics pack", id: "weekly-sectional-sectional-book-topics-2026-08-02-chatgpt" },
  ],
  governance: [
    { label: "Schemes & Reports", id: "weekly-schemes-schemes-reports-2026-08-09" },
    { label: "Monthly current-affairs compilation", id: "monthly-ca-compilation-2026-07" },
  ],
  ir: [
    { label: "International Relations sectional pack", id: "weekly-sectional-sectional-international-relations-2026-06-29" },
    { label: "International Relations fodder", id: "reference-fodder-bank" },
  ],
  economy: [
    { label: "Economy sectional pack", id: "weekly-sectional-sectional-economy-2026-06-29" },
    { label: "GS3 Economy mains practice", id: "daily-daily-mains-gs-mains-2026-06-23" },
  ],
  environment: [
    { label: "Environment sectional pack", id: "weekly-sectional-sectional-environment-2026-06-29" },
    { label: "Environment & sustainability fodder", id: "reference-fodder-bank" },
  ],
  science: [
    { label: "Science & Technology sectional pack", id: "weekly-sectional-sectional-science-technology-2026-06-29" },
    { label: "Monthly current-affairs compilation", id: "monthly-ca-compilation-2026-07" },
  ],
  thinkers: [
    { label: "Fodder Bank · Ethics & Philosophy", id: "reference-fodder-bank" },
    { label: "Weekly Ethics case", id: "ethics-case-2026-08-10" },
  ],
  "case-lab": [
    { label: "Weekly Ethics Case Study", id: "ethics-case-2026-08-10" },
    { label: "Earlier Ethics Case Study", id: "ethics-case-2026-06-29" },
  ],
};

const LAB_GUIDES = {
  "ancient-timeline": { path: "GS1 · Indian culture · Ancient Indian history", syllabus: "Salient features of art forms, literature and architecture from ancient to modern times", pyqSubjects: ["History", "Art and Culture"], exam: "Prelims + Mains" },
  "modern-timeline": { path: "GS1 · Modern Indian history · Freedom struggle", syllabus: "The Freedom Struggle — its various stages and important contributors from different parts of the country", pyqSubjects: ["History"], exam: "Prelims + Mains" },
  "rivers-recall": { path: "GS1 · Physical geography · Indian drainage", syllabus: "Important geophysical phenomena and geographical features, including rivers and water resources", pyqSubjects: ["Geography"], exam: "Prelims" },
  "world-geography": { path: "GS1 · Geography · Physical and human geography", syllabus: "Distribution of key natural resources and factors responsible for the location of primary, secondary and tertiary activities", pyqSubjects: ["Geography", "Environment"], exam: "Prelims + Mains" },
  constitution: { path: "GS2 · Indian polity · Constitution and institutions", syllabus: "Indian Constitution — historical underpinnings, evolution, features, amendments, significant provisions and basic structure", pyqSubjects: ["Polity", "Polity & Governance"], exam: "Prelims + Mains" },
  governance: { path: "GS2 · Governance · Government policies and interventions", syllabus: "Government policies and interventions for development in various sectors and issues arising out of their design and implementation", pyqSubjects: ["Governance", "Polity", "Polity & Governance"], exam: "Mains" },
  ir: { path: "GS2 · International relations · India and its neighbourhood", syllabus: "India and its neighbourhood — relations; bilateral, regional and global groupings and agreements involving India", pyqSubjects: ["International Relations"], exam: "Mains" },
  economy: { path: "GS3 · Indian economy · Growth and resource mobilisation", syllabus: "Indian Economy and issues relating to planning, mobilisation of resources, growth, development and employment", pyqSubjects: ["Economy"], exam: "Prelims + Mains" },
  environment: { path: "GS3 · Environment · Conservation and pollution", syllabus: "Conservation, environmental pollution and degradation, environmental impact assessment", pyqSubjects: ["Environment"], exam: "Prelims + Mains" },
  science: { path: "GS3 · Science and technology · Developments and applications", syllabus: "Science and Technology — developments and their applications and effects in everyday life", pyqSubjects: ["Science & Technology", "Science and Technology"], exam: "Prelims + Mains" },
  thinkers: { path: "GS4 · Ethics · Human values and thinkers", syllabus: "Contributions of moral thinkers and philosophers from India and world", pyqSubjects: ["Ethics"], exam: "Mains" },
  "case-lab": { path: "GS4 · Ethics · Case studies", syllabus: "Case Studies on the above issues", pyqSubjects: ["Ethics"], exam: "Mains" },
};

// The Focus card hands Study Labs the learner's weakest subject. Resolve it to
// the most relevant paper + lab so the screen opens on something useful instead
// of the generic default. Matches the subject against each lab's syllabus
// subjects and its category label.
function normalizeLabSubject(value) {
  return String(value || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
}

function findLabForSubject(subject) {
  const target = normalizeLabSubject(subject);
  if (!target) return null;
  for (const paperId of Object.keys(LABS_BY_PAPER)) {
    for (const lab of LABS_BY_PAPER[paperId]) {
      const candidates = [lab.category, ...(LAB_GUIDES[lab.id]?.pyqSubjects || [])].map(normalizeLabSubject);
      if (candidates.some((c) => c && (c === target || c.includes(target) || target.includes(c)))) {
        return { paperId, labId: lab.id };
      }
    }
  }
  return null;
}

// Every live lab follows the same loop, so one explainer covers them all.
const LAB_STEPS = [
  { n: "01", title: "Learn the map", body: "Read through the visual — timeline, chain or map — to see how the pieces connect." },
  { n: "02", title: "Switch to Recall", body: "Use the Recall tab (or the clues) to answer from memory before revealing." },
  { n: "03", title: "Mark your confidence", body: "Tell the Memory check how it felt so spaced review can bring it back on time." },
];

function LabHowTo() {
  return (
    <section className="labs-howto" aria-label="How to use this lab">
      <span className="labs-kicker">How to use this lab</span>
      <ol className="labs-howto-steps">
        {LAB_STEPS.map((step) => (
          <li key={step.n}>
            <span className="labs-howto-num">{step.n}</span>
            <div><strong>{step.title}</strong><small>{step.body}</small></div>
          </li>
        ))}
      </ol>
    </section>
  );
}

const ECO_MAP_LAYERS = [
  { id: "protected", label: "National parks & reserves", short: "Protected areas" },
  { id: "wetlands", label: "Wetlands & lakes", short: "Wetlands" },
  { id: "rivers", label: "Rivers & tributaries", short: "Rivers" },
];

const PROTECTED_AREA_META = {
  hemis: { state: "Ladakh", river: "Indus system", hook: "Cold desert · snow leopard · high altitude" },
  dachigam: { state: "Jammu & Kashmir", river: "Dachigam stream / Jhelum basin", hook: "Hangul · temperate Himalaya · Kashmir" },
  "jim-corbett": { state: "Uttarakhand", river: "Ramganga", hook: "Oldest national park · Project Tiger · Terai–Bhabar" },
  kaziranga: { state: "Assam", river: "Brahmaputra floodplain", hook: "One-horned rhinoceros · floodplain grasslands · UNESCO" },
  manas: { state: "Assam", river: "Manas", hook: "Bhutan border · tiger reserve · transboundary landscape" },
  namdapha: { state: "Arunachal Pradesh", river: "Noa-Dihing", hook: "Eastern Himalaya · four big cats · elevation gradient" },
  sundarbans: { state: "West Bengal", river: "Ganga–Brahmaputra–Meghna delta", hook: "Mangrove delta · tiger habitat · tidal ecology" },
  similipal: { state: "Odisha", river: "Budhabalanga / Subarnarekha basin", hook: "Biosphere reserve · tiger reserve · melanistic tiger" },
  kanha: { state: "Madhya Pradesh", river: "Banjar / Narmada basin", hook: "Hard-ground barasingha · sal forest · central highlands" },
  gir: { state: "Gujarat", river: "Hiran / west-flowing Saurashtra rivers", hook: "Asiatic lion · dry deciduous forest · Kathiawar" },
  ranthambore: { state: "Rajasthan", river: "Banas / Chambal system", hook: "Tiger reserve · Aravalli–Vindhya transition" },
  keoladeo: { state: "Rajasthan", river: "Gambhir / Banganga system", hook: "Human-made wetland · migratory birds · Ramsar + UNESCO" },
  periyar: { state: "Kerala", river: "Periyar", hook: "Western Ghats · reservoir landscape · elephant and tiger" },
  "silent-valley": { state: "Kerala", river: "Kunthipuzha / Bharathapuzha basin", hook: "Evergreen rainforest · endemic biodiversity · Western Ghats" },
};

const CONSTITUTION_CARDS = [
  { label: "Article 32", title: "Constitutional remedies", prompt: "Which Article did Ambedkar call the Constitution's 'heart and soul'?", answer: "Article 32 — the right to move the Supreme Court for enforcement of Fundamental Rights.", hook: "Exam hook: unlike many legal remedies, this right itself is guaranteed as a Fundamental Right." },
  { label: "Money Bill", title: "Lok Sabha primacy", prompt: "What is the cleanest way to remember the Money Bill route?", answer: "Introduced only in Lok Sabha on the President's recommendation; Rajya Sabha can recommend, but not amend or reject.", hook: "Exam hook: the Speaker certifies a Money Bill; Rajya Sabha gets 14 days." },
  { label: "Article 352", title: "National Emergency", prompt: "What changed when the 44th Amendment replaced 'internal disturbance'?", answer: "The ground became 'armed rebellion', narrowing the trigger for a National Emergency.", hook: "Exam hook: war, external aggression and armed rebellion are the three grounds." },
  { label: "73rd Amendment", title: "Local self-government", prompt: "What did the 73rd Amendment add to the Constitution?", answer: "Part IX and the Eleventh Schedule, with 29 subjects and a minimum one-third reservation for women in Panchayats.", hook: "Exam hook: connect devolution, State Election Commissions and State Finance Commissions." },
  { label: "Article 324", title: "Election Commission", prompt: "What is the constitutional anchor for the Election Commission of India?", answer: "Article 324 creates a permanent and independent constitutional body to supervise elections.", hook: "Exam hook: the Constitution does not prescribe member qualifications; Parliament may regulate them." },
];

const GOVERNANCE_CARDS = [
  { label: "PM-KISAN", title: "Income support", prompt: "When revising a scheme, start with the problem it is designed to solve. What is PM-KISAN's core intervention?", answer: "Direct income support to eligible farmer families, delivered through DBT.", hook: "Answer hook: identify beneficiary, delivery mechanism, ministry and the last-mile exclusion risk." },
  { label: "PM Surya Ghar", title: "Distributed energy", prompt: "What makes rooftop solar a governance case rather than just an energy fact?", answer: "It combines household subsidy, decentralised generation, DISCOM coordination and the challenge of reaching eligible households.", hook: "Answer hook: connect clean energy with affordability, implementation capacity and behavioural adoption." },
  { label: "e-GramSwaraj", title: "Digital Panchayat", prompt: "What does a digital Panchayat platform add to decentralisation?", answer: "Planning, accounting, progress tracking and public visibility for Gram Panchayat work.", hook: "Answer hook: technology is an enabler; actual devolution of funds, functions and functionaries still matters." },
  { label: "Social audit", title: "Accountability from below", prompt: "Why is a social audit more than an audit of accounts?", answer: "It lets affected citizens verify whether a programme reached them and whether delivery matched official records.", hook: "Answer hook: pair transparency with participation, grievance redress and protection for whistle-blowers." },
];

const IR_NETWORKS = [
  { name: "BRICS", members: "Brazil · Russia · India · China · South Africa · expanded partners", india: "India chairs BRICS in 2026; use the group to discuss Global South voice, development finance and multipolarity.", hook: "Recall: grouping + current chair + institution/theme + India's interest." },
  { name: "Quad", members: "Australia · India · Japan · United States", india: "A diplomatic and strategic platform for a free, open, inclusive Indo-Pacific, with cooperation beyond hard security.", hook: "Recall: maritime domain awareness, critical technology, resilient supply chains and disaster response." },
  { name: "SCO", members: "China · India · Kazakhstan · Kyrgyzstan · Pakistan · Russia · Tajikistan · Uzbekistan", india: "A Eurasian forum where India balances security, connectivity and counter-terrorism concerns.", hook: "Recall: full member, not observer; headquarters/secretariat and regional security are common traps." },
  { name: "BIMSTEC", members: "Bay of Bengal bridge: South Asia + Southeast Asia", india: "Connects neighbourhood diplomacy, Act East, connectivity and the Bay of Bengal without Pakistan in the grouping.", hook: "Recall: secretariat at Dhaka; geography is the memory key." },
  { name: "G4", members: "India · Brazil · Germany · Japan", india: "The four countries jointly advocate permanent representation for themselves on a reformed UN Security Council.", hook: "Recall: G4 is not a security alliance; it is a UNSC reform coalition." },
  { name: "ISA", members: "International Solar Alliance · launched by India and France", india: "A flagship example of India using a development and climate partnership to build institutional influence.", hook: "Recall: headquarters at Gurugram and the solar-rich countries between the tropics." },
];

const ECONOMY_CHAINS = [
  { label: "GST 2.0", title: "Simplification vs. federal risk", steps: ["Two principal slabs: 5% and 18%", "Fewer classifications and lower compliance friction", "Potential consumption and buoyancy gains", "State revenue exposure after the compensation era"], hook: "Mains link: 101st Amendment · Articles 246A, 269A, 279A · cooperative federalism." },
  { label: "Repo rate", title: "Monetary transmission", steps: ["RBI changes the policy repo rate", "Banks' short-term funding cost shifts", "Loan and deposit rates respond with a lag", "Demand, inflation and investment are affected"], hook: "Prelims link: repo = RBI lends to banks against securities; reverse repo absorbs liquidity." },
  { label: "Fiscal deficit", title: "Borrowing and demand", steps: ["Government expenditure exceeds non-borrowing receipts", "The gap is financed through borrowing", "Demand and public investment can be supported", "Debt servicing and fiscal space become constraints"], hook: "Formula: total expenditure − total receipts excluding borrowings; primary deficit removes interest payments." },
  { label: "Current account", title: "External sector map", steps: ["Goods trade is recorded", "Services and income flows are added", "Transfers/remittances complete the current account", "FDI belongs to the financial/capital side, not the current account"], hook: "Recall the category boundary before memorising examples." },
];

const ENVIRONMENT_CARDS = [
  { label: "Cali Fund", title: "Digital Sequence Information", prompt: "What problem is the Cali Fund designed to address?", answer: "Fair and equitable sharing of benefits arising from the use of digital sequence information on genetic resources.", hook: "Answer hook: biodiversity governance now includes data, not only physical genetic material." },
  { label: "IBCA", title: "Big-cat conservation", prompt: "What is the useful UPSC angle for the International Big Cat Alliance?", answer: "An India-led conservation initiative with a mandate spanning seven big-cat species and an international institutional form.", hook: "Answer hook: species + institution + habitat protection + community dimensions." },
  { label: "Project Cheetah", title: "Reintroduction & resilience", prompt: "Why is a second home important in Project Cheetah?", answer: "It reduces concentration risk and spreads conservation capacity beyond the initial landscape; Gandhi Sagar is a second home in Madhya Pradesh.", hook: "Answer hook: conservation success is not the same as conservation security." },
  { label: "Emissions Gap", title: "Science-policy gap", prompt: "Which organisation publishes the Emissions Gap Report?", answer: "The United Nations Environment Programme (UNEP).", hook: "Answer hook: separate IPCC assessment reports from UNEP's annual emissions-gap framing." },
  { label: "Great Indian Bustard", title: "Infrastructure conflict", prompt: "What is a major threat to the Great Indian Bustard?", answer: "Collision with overhead power-transmission lines, alongside habitat and landscape pressures.", hook: "Answer hook: conservation needs cross-sector design, not only a protected-area boundary." },
];

const SCIENCE_CARDS = [
  { label: "NISAR", title: "Dual-frequency radar", prompt: "Why can NISAR observe Earth through cloud and at night?", answer: "It is a radar-imaging Earth-observation mission using L-band and S-band synthetic aperture radar.", hook: "Recall: NASA + ISRO, all-weather/day-night imaging, applications in hazards and ecosystems." },
  { label: "SpaDeX", title: "In-space docking", prompt: "What capability did SpaDeX demonstrate?", answer: "In-space docking of two satellites — a capability relevant to future space stations, servicing and complex missions.", hook: "Recall: docking is not the same as soft landing or reusable launch." },
  { label: "NavIC", title: "Regional navigation", prompt: "What is the common trap in a NavIC question?", answer: "NavIC is an independent regional navigation system, not a global GPS-equivalent; it uses L-band and S-band signals.", hook: "Recall: regional coverage + ISRO + navigation signals." },
  { label: "CRISPR-Cas9", title: "Programmable editing", prompt: "How does CRISPR-Cas9 find its target?", answer: "A guide RNA directs the Cas9 protein to a complementary DNA sequence, where Cas9 makes a cut.", hook: "Recall: bacterial defence mechanism → programmable molecular scissors → ethics and safety." },
  { label: "IndiaAI", title: "Compute + public infrastructure", prompt: "What is the policy angle beyond 'AI is important'?", answer: "Affordable compute access, datasets/models through AIKosh and a domestic ecosystem for responsible innovation.", hook: "Answer hook: access, capacity, governance and inclusion." },
];

const THINKER_CARDS = [
  { label: "Rawls", title: "Justice as fairness", quote: "Justice is the first virtue of social institutions.", use: "Use for welfare, rights, distribution and institutional design answers." },
  { label: "Ambedkar", title: "Institutions need good people", quote: "However good a Constitution may be, it is sure to turn out bad because those who are called to work it happen to be a bad lot.", use: "Use for implementation gaps, constitutional morality and civil-service ethics." },
  { label: "Amartya Sen", title: "Development as freedom", quote: "Development is a process of expanding the real freedoms that people enjoy.", use: "Use against GDP-only framings; connect capability, transparency and protective security." },
  { label: "Kautilya", title: "Citizen-centric duty", quote: "In the happiness of his subjects lies the king's happiness; in their welfare his welfare.", use: "Use for public service motivation, welfare delivery and administrative accountability." },
  { label: "Brundtland", title: "Inter-generational equity", quote: "Development that meets the needs of the present without compromising the ability of future generations to meet their own needs.", use: "Use for sustainable development, climate policy and environmental governance." },
  { label: "Hannah Arendt", title: "The right to have rights", quote: "The right to have rights.", use: "Use for citizenship, statelessness, belonging and access to institutions." },
  { label: "Aldo Leopold", title: "Land ethic", quote: "A thing is right when it tends to preserve the integrity, stability, and beauty of the biotic community.", use: "Use for biodiversity, conservation and non-anthropocentric ethics." },
];

const ETHICS_SECTIONS = [
  { id: "dilemma", label: "Dilemma", title: "Protect lives without abandoning livelihoods", body: "Three textile units are discharging untreated effluent into a river feeding drinking-water intakes. A senior official asks the regulator to go slow because the cluster employs 8,000 people and an investment summit is near. The career implication is left deliberately implicit.", tags: ["public health", "livelihood", "rule of law", "political pressure"] },
  { id: "stakeholders", label: "Stakeholders", title: "Map power, vulnerability and duty", items: ["Downstream villagers — right to safe water, health and life.", "Workers — livelihood and dignity, especially migrant workers and women.", "Junior scientist — professional conscience and whistle-blower vulnerability.", "Regulator — statutory duty, objectivity and public trust.", "Industries, government, media and the river ecosystem — economic, institutional and inter-generational stakes."] },
  { id: "options", label: "Options", title: "Evaluate before choosing", items: ["Immediate total closure: strongest health and legality signal, but abrupt economic harm and worker exposure.", "Quiet warning and a 90-day window: protects short-term jobs but knowingly prolongs harm and conceals material information.", "Calibrated enforcement: stop the offending discharge, protect villages, allow supervised restart only after verified compliance."] },
  { id: "action", label: "Action", title: "A defensible course of action", items: ["Stop the harmful discharge immediately and arrange safe drinking water.", "Issue a documented, time-bound compliance order with monitoring and automatic closure on breach.", "Record political pressure on file, escalate through proper channels and protect the junior scientist.", "Communicate factually; do not trade public health for career convenience."] },
  { id: "values", label: "Values", title: "Values and frameworks", items: ["Integrity, objectivity, accountability, openness and courage of conviction.", "Precautionary principle and polluter pays.", "Gandhi's talisman: test the decision against the face of the poorest and weakest.", "Kant: do not treat villagers or workers merely as means to an institutional end."] },
];

function LabIcon({ name }) {
  const glyphs = { timeline: "↔", map: "⌖", globe: "◎", scale: "⚖", target: "◎", chart: "▥", leaf: "⌁", bolt: "ϟ", book: "▤" };
  return <span className={`labs-glyph labs-glyph-${name}`} aria-hidden="true">{glyphs[name] || "✦"}</span>;
}

function openLabSource(go, source) {
  if (!source.id) return;
  go("library", { noteId: source.id });
}

function LabSources({ labId, go }) {
  const ds = window.UPSC;
  const sources = LAB_SOURCES[labId] || [];
  const resolved = sources.map((source) => ({ ...source, note: source.id ? ds.noteDocuments.find((item) => item.id === source.id) : null }));
  return (
    <div className="labs-source-strip">
      <span className="labs-source-label">Built from local library</span>
      <div className="labs-source-list">
        {resolved.map((source) => (
          source.id && source.note
            ? <button key={source.id} onClick={() => openLabSource(go, source)}>{source.label} <Icon name="arrowR" size={11} /></button>
            : <span key={source.path || source.label}>{source.label}</span>
        ))}
      </div>
    </div>
  );
}

function LabSyllabusMap({ labId, go }) {
  const ds = window.UPSC;
  const guide = LAB_GUIDES[labId];
  if (!guide) return null;
  const normalizeSubject = (value) => String(value || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, " ").trim();
  const matchesSubject = (set) => (set.subjects || []).some((subject) => guide.pyqSubjects.some((target) => {
    const left = normalizeSubject(subject);
    const right = normalizeSubject(target);
    return left === right || left.includes(right) || right.includes(left);
  }));
  const pyqs = ds.getQuestionSetsBySource("pyq").filter(matchesSubject).sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  const sectionals = ds.getQuestionSetsBySource("sectional").filter(matchesSubject).slice(0, 3);
  return (
    <section className="labs-syllabus-map">
      <div className="labs-map-head"><div><span className="labs-kicker">UPSC alignment</span><h3>{guide.path}</h3></div><span className="labs-map-exam">{guide.exam}</span></div>
      <p>{guide.syllabus}</p>
      <div className="labs-map-meta"><span>{pyqs.length} related PYQ years</span><span>{sectionals.length} sectional links</span></div>
      <div className="labs-map-row"><span>Previous-year papers</span><div>{pyqs.map((set) => <button key={set.id} onClick={() => go("test", { setId: set.id, subjects: guide.pyqSubjects, returnTo: "labs" })}>{set.year || set.shortLabel || set.label} · topic questions <Icon name="arrowR" size={11} /></button>)}</div></div>
      {sectionals.length > 0 && <div className="labs-map-row"><span>Targeted practice</span><div>{sectionals.map((set) => <button key={set.id} onClick={() => go("test", { setId: set.id, subjects: guide.pyqSubjects, returnTo: "labs" })}>{set.shortLabel || set.label} <Icon name="arrowR" size={11} /></button>)}</div></div>}
    </section>
  );
}

function LabProgressPanel({ labId, progress, onLabProgress }) {
  const ds = window.UPSC;
  const status = progress?.labStats?.[labId];
  const due = Boolean(status?.due && status.due <= ds.todayIso);
  const statusLabel = !status ? "Not started" : due ? "Due for another pass" : status.mastered ? `Scheduled · ${status.due}` : `Last marked ${status.lastConfidence}`;
  const mark = (confidence) => onLabProgress?.(labId, confidence);
  return (
    <section className="labs-progress-panel">
      <div><span className="labs-kicker">Memory check</span><strong>{statusLabel}</strong><small>{status ? `${status.seen} check-in${status.seen === 1 ? "" : "s"} · confidence is saved on this device` : "Mark how this felt so the next review can find you."}</small></div>
      <div className="labs-progress-actions"><button className="labs-confidence review" onClick={() => mark("review")}>Need another pass</button><button className="labs-confidence unsure" onClick={() => mark("unsure")}>Getting there</button><button className="labs-confidence mastered" onClick={() => mark("mastered")}>I can recall this</button></div>
    </section>
  );
}

function ToolTabs({ mode, setMode, learnLabel = "Learn", recallLabel = "Recall" }) {
  return <div className="labs-mode-tabs" role="tablist" aria-label="Study mode"><button className={mode === "learn" ? "active" : ""} aria-selected={mode === "learn"} onClick={() => setMode("learn")}>{learnLabel}</button><button className={mode === "recall" ? "active" : ""} aria-selected={mode === "recall"} onClick={() => setMode("recall")}>{recallLabel}</button></div>;
}

function RecallDeckLab({ labId, kicker, title, cards, go, accent = "green" }) {
  const [index, setIndex] = useStateLabs(0);
  const [mode, setMode] = useStateLabs("learn");
  const card = cards[index];
  const move = (delta) => setIndex((index + delta + cards.length) % cards.length);
  return (
    <div className={"labs-tool-panel labs-deck-panel accent-" + accent}>
      <div className="labs-tool-head"><div><span className="labs-kicker">{kicker}</span><h2>{title}</h2></div><span className="labs-year-badge">{index + 1} / {cards.length}</span></div>
      <ToolTabs mode={mode} setMode={setMode} />
      <div className="labs-deck-card">
        <div className="labs-deck-meta"><span>{card.label}</span><span>{card.title}</span></div>
        {mode === "learn" ? <><h3>{card.title}</h3><p>{card.answer}</p><div className="labs-deck-hook">{card.hook}</div></> : <><span className="labs-recall-label">Recall prompt</span><p className="labs-deck-prompt">{card.prompt}</p><button className="btn btn-saffron" onClick={() => setMode("learn")}>Reveal explanation</button></>}
      </div>
      <div className="labs-tool-actions"><button className="btn ghost sm" onClick={() => move(-1)}><Icon name="arrowL" size={14} /> Previous</button><LabSources labId={labId} go={go} /><button className="btn ghost sm" onClick={() => move(1)}>Next <Icon name="arrowR" size={14} /></button></div>
    </div>
  );
}

function NetworkLab({ go }) {
  const [index, setIndex] = useStateLabs(0);
  const network = IR_NETWORKS[index];
  return (
    <div className="labs-tool-panel labs-network-panel">
      <div className="labs-tool-head"><div><span className="labs-kicker">Active recall · International Relations</span><h2>Build the grouping in your head</h2></div><span className="labs-year-badge">{index + 1} / {IR_NETWORKS.length}</span></div>
      <div className="labs-network-nav">{IR_NETWORKS.map((item, itemIndex) => <button key={item.name} className={itemIndex === index ? "active" : ""} onClick={() => setIndex(itemIndex)}>{item.name}</button>)}</div>
      <div className="labs-network-card"><span className="labs-network-name">{network.name}</span><h3>{network.members}</h3><p>{network.india}</p><div className="labs-network-hook">{network.hook}</div></div>
      <div className="labs-tool-actions"><span className="labs-tool-count">India angle · membership · exam hook</span><LabSources labId="ir" go={go} /></div>
    </div>
  );
}

function EconomyFlowLab({ go }) {
  const [index, setIndex] = useStateLabs(0);
  const chain = ECONOMY_CHAINS[index];
  return (
    <div className="labs-tool-panel labs-flow-panel">
      <div className="labs-tool-head"><div><span className="labs-kicker">Mechanism lab · Economy</span><h2>Follow the chain, then write the trade-off</h2></div><span className="labs-year-badge">{index + 1} / {ECONOMY_CHAINS.length}</span></div>
      <div className="labs-flow-picker">{ECONOMY_CHAINS.map((item, itemIndex) => <button key={item.label} className={itemIndex === index ? "active" : ""} onClick={() => setIndex(itemIndex)}><span>{item.label}</span><small>{item.title}</small></button>)}</div>
      <div className="labs-flow-chain">{chain.steps.map((step, stepIndex) => <div className="labs-flow-step" key={step}><span>{String(stepIndex + 1).padStart(2, "0")}</span><strong>{step}</strong>{stepIndex < chain.steps.length - 1 && <i>↓</i>}</div>)}</div>
      <div className="labs-flow-hook"><span>Write it into an answer</span><strong>{chain.hook}</strong></div>
      <div className="labs-tool-actions"><LabSources labId="economy" go={go} /><span className="labs-tool-count">Trigger → mechanism → effect → constraint</span></div>
    </div>
  );
}

function GeographyExplorerLab({ go }) {
  const atlas = window.ATLAS_KNOWLEDGE || [];
  const [layer, setLayer] = useStateLabs("protected");
  const [mode, setMode] = useStateLabs("learn");
  const [query, setQuery] = useStateLabs("");
  const [stateFilter, setStateFilter] = useStateLabs("all");
  const [selectedId, setSelectedId] = useStateLabs(null);
  const [revealed, setRevealed] = useStateLabs(false);
  const sourceFeatures = atlas.filter((feature) => feature.layer === layer);
  const stateOptions = [...new Set(atlas.filter((feature) => feature.layer === "protected").map((feature) => PROTECTED_AREA_META[feature.id]?.state).filter(Boolean))].sort();
  const filtered = sourceFeatures
    .map((feature) => ({ ...feature, ...(PROTECTED_AREA_META[feature.id] || {}) }))
    .filter((feature) => layer !== "protected" || stateFilter === "all" || feature.state === stateFilter)
    .filter((feature) => {
      const haystack = [feature.name, feature.state, feature.group, feature.fact, feature.hook, feature.river].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });
  const selectedFeature = filtered.find((feature) => feature.id === selectedId) || null;
  const mapFeatures = mode === "recall" ? filtered.map((feature) => ({ ...feature, name: feature.type === "line" ? "Recall route" : "Recall marker" })) : filtered;
  const activeLayer = ECO_MAP_LAYERS.find((item) => item.id === layer) || ECO_MAP_LAYERS[0];
  const selectFeature = (feature) => {
    if (String(feature.id || "").startsWith("boundary-")) {
      const nextState = stateOptions.find((state) => state === feature.name);
      if (nextState) setStateFilter(nextState);
      return;
    }
    setSelectedId(feature.id);
    setRevealed(false);
  };
  const reset = () => { setStateFilter("all"); setQuery(""); setSelectedId(null); setRevealed(false); };
  return (
    <div className="labs-tool-panel labs-geo-panel labs-eco-map-panel">
      <div className="labs-tool-head"><div><span className="labs-kicker">Layers + recall · Protected areas</span><h2>Learn the place, then locate it from memory</h2></div><span className="labs-year-badge">{filtered.length} places</span></div>
      <div className="labs-eco-mode" role="tablist" aria-label="Map study mode"><button role="tab" aria-selected={mode === "learn"} className={mode === "learn" ? "active" : ""} onClick={() => setMode("learn")}>Learn mode</button><button role="tab" aria-selected={mode === "recall"} className={mode === "recall" ? "active" : ""} onClick={() => { setMode("recall"); setRevealed(false); }}>Recall mode</button></div>
      <div className="labs-eco-search"><Icon name="search" size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search parks, reserves, wetlands…" aria-label="Search parks, reserves, wetlands and rivers" /></div>
      <div className="labs-eco-workspace">
        <aside className="labs-eco-sidebar"><span className="labs-eco-label">Layers</span><div className="labs-eco-layer-list">{ECO_MAP_LAYERS.map((item) => <button key={item.id} className={layer === item.id ? "active" : ""} onClick={() => { setLayer(item.id); setSelectedId(null); setRevealed(false); }}><i className={`labs-eco-swatch ${item.id}`} /><span>{item.label}</span><small>{atlas.filter((feature) => feature.layer === item.id).length}</small></button>)}</div>{layer === "protected" && <label className="labs-eco-state"><span>State filter</span><select value={stateFilter} onChange={(event) => { setStateFilter(event.target.value); setSelectedId(null); }}><option value="all">All India</option>{stateOptions.map((state) => <option key={state} value={state}>{state}</option>)}</select></label>}<button className="labs-eco-reset" onClick={reset}>↺ Reset view</button></aside>
        <div className="labs-eco-map-stage">{typeof AtlasLeafletMap === "function" ? <AtlasLeafletMap scope="india" features={mapFeatures} boundariesOn={true} riversOn={layer === "rivers"} riverSystem="all" selected={mapFeatures.find((feature) => feature.id === selectedId) || null} onSelect={selectFeature} /> : <div className="labs-eco-map-loading">Loading local India map…</div>}<div className="labs-eco-map-caption"><span>{activeLayer.short}</span><small>Click a marker or state · drag to explore · scroll to zoom</small></div></div>
        <aside className="labs-eco-detail">{selectedFeature ? <>{mode === "recall" && !revealed ? <><span className="labs-eco-detail-label">Recall prompt</span><h3>Which {layer === "protected" ? "protected area" : activeLayer.short.toLowerCase()} is this?</h3><p>{selectedFeature.state || selectedFeature.group || "Trace the marker on the map."}</p><button className="btn btn-saffron sm" onClick={() => setRevealed(true)}>Reveal place</button></> : <><span className="labs-eco-detail-label">{activeLayer.short}</span><h3>{selectedFeature.name}</h3><p>{selectedFeature.fact}</p>{selectedFeature.state && <div className="labs-eco-facts"><span><b>State</b>{selectedFeature.state}</span><span><b>River / basin</b>{selectedFeature.river}</span></div>}<div className="labs-eco-hook"><span>Exam hook</span><strong>{selectedFeature.hook || selectedFeature.group}</strong></div>{mode === "recall" && <button className="btn ghost sm" onClick={() => setRevealed(false)}>Hide answer</button>}</>}</> : <div className="labs-eco-empty"><span className="labs-eco-detail-label">Select a place</span><strong>Click a marker to open its exam card</strong><p>Use Learn mode to build the association, then switch to Recall mode and test yourself.</p></div>}</aside>
      </div>
      <div className="labs-eco-legend"><span><i className="labs-eco-swatch protected" />Protected area</span><span><i className="labs-eco-swatch wetlands" />Wetland</span><span><i className="labs-eco-swatch rivers" />River line</span><span>{filtered.length} visible · local map layers</span></div>
      <div className="labs-tool-actions"><button className="btn btn-green sm" onClick={() => go("atlas")}>Open full News Atlas <Icon name="arrowR" size={14} /></button><LabSources labId="world-geography" go={go} /></div>
    </div>
  );
}

function EthicsCaseLab({ go }) {
  const [sectionId, setSectionId] = useStateLabs("dilemma");
  const section = ETHICS_SECTIONS.find((item) => item.id === sectionId) || ETHICS_SECTIONS[0];
  return (
    <div className="labs-tool-panel labs-ethics-panel">
      <div className="labs-tool-head"><div><span className="labs-kicker">Case lab · Weekly Ethics Case Study</span><h2>Decide under pressure</h2></div><span className="labs-year-badge">5 lenses</span></div>
      <div className="labs-case-nav">{ETHICS_SECTIONS.map((item) => <button key={item.id} className={item.id === sectionId ? "active" : ""} onClick={() => setSectionId(item.id)}>{item.label}</button>)}</div>
      <div className="labs-case-card"><span className="labs-case-kicker">{section.label}</span><h3>{section.title}</h3>{section.body && <p>{section.body}</p>}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}{section.tags && <div className="labs-case-tags">{section.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>}</div>
      <div className="labs-tool-actions"><span className="labs-tool-count">Write first · compare second · cite one framework</span><LabSources labId="case-lab" go={go} /></div>
    </div>
  );
}

function groupTimelineEvents(events) {
  const groups = new Map();
  events.forEach((event) => {
    const key = String(event.label);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(event);
  });
  const result = [...groups.entries()].map(([label, items]) => ({ label, items }));
  if (result.every((group) => /^\d+$/.test(group.label))) {
    result.sort((a, b) => Number(a.label) - Number(b.label));
  }
  return result;
}

function timelineEventCount(count) {
  return `${count} ${count === 1 ? "event" : "events"}`;
}

function TimelineLab({ modern = false, go }) {
  const [atlasEvents, setAtlasEvents] = useStateLabs([]);
  const [yearIndex, setYearIndex] = useStateLabs(modern ? 3 : 3);
  const [eventIndex, setEventIndex] = useStateLabs(0);
  useEffectLabs(() => {
    if (!modern) return undefined;
    let cancelled = false;
    fetch("data/maps/bharatrajya-india-history.json")
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return;
        const mapped = (data.events || [])
          .filter((event) => Number(event.year) >= 1857 && Number(event.year) <= 1947)
          .map((event) => ({
            label: String(event.year),
            name: event.text,
            note: [event.category, event.outcome, event.belligerents].filter(Boolean).join(" · "),
            atlas: true,
          }));
        setAtlasEvents(mapped);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [modern]);
  const events = modern ? MODERN_EVENTS.concat(atlasEvents) : ANCIENT_ERAS;
  const groups = groupTimelineEvents(events);
  const safeYearIndex = Math.min(yearIndex, Math.max(0, groups.length - 1));
  const yearGroup = groups[safeYearIndex] || { label: "—", items: [] };
  const safeEventIndex = Math.min(eventIndex, Math.max(0, yearGroup.items.length - 1));
  const current = yearGroup.items[safeEventIndex] || { name: "Select a milestone", note: "" };
  const moveYear = (delta) => { setYearIndex(Math.max(0, Math.min(groups.length - 1, safeYearIndex + delta))); setEventIndex(0); };
  return (
    <div className="labs-tool-panel labs-timeline-panel">
      <div className="labs-tool-head"><div><span className="labs-kicker">{modern ? "Multi-event timeline · Modern India" : "Multi-event timeline · Indian history"}</span><h2>{current.name}</h2></div><span className="labs-year-badge">{yearGroup.label} · {timelineEventCount(yearGroup.items.length)}</span></div>
      <p className="labs-tool-note">{current.note}</p>
      <div className="labs-timeline-summary"><span><strong>{events.length}</strong> milestones</span><span><strong>{groups.length}</strong> years / periods</span>{modern && atlasEvents.length > 0 && <span><strong>{atlasEvents.length}</strong> atlas events added</span>}</div>
      <div className="labs-year-strip" aria-label="Years in timeline">{groups.map((group, groupIndex) => <button key={group.label} className={groupIndex === safeYearIndex ? "active" : ""} onClick={() => { setYearIndex(groupIndex); setEventIndex(0); }}><strong>{group.label}</strong><small>{timelineEventCount(group.items.length)}</small></button>)}</div>
      <div className="labs-event-browser">
        <div className="labs-event-list"><span className="labs-event-list-label">{yearGroup.label} · select an event</span>{yearGroup.items.map((event, itemIndex) => <button key={event.name + itemIndex} className={itemIndex === safeEventIndex ? "active" : ""} onClick={() => setEventIndex(itemIndex)}><span>{String(itemIndex + 1).padStart(2, "0")}</span><strong>{event.name}</strong>{event.atlas && <small>Atlas</small>}</button>)}</div>
        <div className="labs-event-detail"><span className="labs-event-detail-label">Selected milestone</span><h3>{current.name}</h3><p>{current.note}</p>{current.atlas && <span className="labs-atlas-badge">From local Historical Atlas event data</span>}</div>
      </div>
      <div className="labs-tool-actions"><button className="btn ghost sm" onClick={() => moveYear(-1)} disabled={safeYearIndex === 0}><Icon name="arrowL" size={14} /> Previous year</button><LabSources labId={modern ? "modern-timeline" : "ancient-timeline"} go={go} /><span className="labs-tool-count">{safeYearIndex + 1} / {groups.length}</span><button className="btn btn-green sm" onClick={() => moveYear(1)} disabled={safeYearIndex === groups.length - 1}>Next year <Icon name="arrowR" size={14} /></button></div>
    </div>
  );
}

function RiverRecallLab({ go }) {
  const [index, setIndex] = useStateLabs(0);
  const [revealed, setRevealed] = useStateLabs(false);
  const card = RIVER_CARDS[index];
  function move(delta) { setIndex((index + delta + RIVER_CARDS.length) % RIVER_CARDS.length); setRevealed(false); }
  return <div className="labs-tool-panel labs-recall-panel"><div className="labs-tool-head"><div><span className="labs-kicker">Active recall · Rivers of India</span><h2>Name the river from the clues</h2></div><span className="labs-year-badge">{index + 1} / {RIVER_CARDS.length}</span></div><div className="labs-recall-card"><span className="labs-recall-label">Clue</span><p>{card.prompt}</p>{revealed ? <div className="labs-answer"><span>Answer</span><strong>{card.answer}</strong><small>{card.hook}</small></div> : <button className="btn btn-saffron" onClick={() => setRevealed(true)}>Reveal answer</button>}</div><div className="labs-tool-actions"><button className="btn ghost sm" onClick={() => move(-1)}><Icon name="arrowL" size={14} /> Previous</button><LabSources labId="rivers-recall" go={go} /><button className="btn ghost sm" onClick={() => move(1)}>Next <Icon name="arrowR" size={14} /></button></div></div>;
}

function WorldGeographyLab({ go }) {
  return <GeographyExplorerLab go={go} />;
}

function LabsTool({ lab, go, progress, onLabProgress }) {
  let tool;
  if (lab.id === "ancient-timeline") tool = <TimelineLab go={go} />;
  else if (lab.id === "modern-timeline") tool = <TimelineLab modern go={go} />;
  else if (lab.id === "rivers-recall") tool = <RiverRecallLab go={go} />;
  else if (lab.id === "world-geography") tool = <WorldGeographyLab go={go} />;
  else if (lab.id === "constitution") tool = <RecallDeckLab labId="constitution" kicker="Active recall · Polity" title="Anchor the Constitution to the exam hook" cards={CONSTITUTION_CARDS} go={go} />;
  else if (lab.id === "governance") tool = <RecallDeckLab labId="governance" kicker="Active recall · Governance" title="Turn programmes into answer structures" cards={GOVERNANCE_CARDS} go={go} accent="saffron" />;
  else if (lab.id === "ir") tool = <NetworkLab go={go} />;
  else if (lab.id === "economy") tool = <EconomyFlowLab go={go} />;
  else if (lab.id === "environment") tool = <RecallDeckLab labId="environment" kicker="Active recall · Environment" title="Link the fact to the governance problem" cards={ENVIRONMENT_CARDS} go={go} accent="teal" />;
  else if (lab.id === "science") tool = <RecallDeckLab labId="science" kicker="Active recall · Science & Technology" title="Explain it in three moves" cards={SCIENCE_CARDS} go={go} accent="blue" />;
  else if (lab.id === "thinkers") tool = <RecallDeckLab labId="thinkers" kicker="Fodder deck · Ethics" title="Carry one precise thinker into the answer" cards={THINKER_CARDS.map((card) => ({ ...card, answer: card.quote, hook: card.use, prompt: "Which thinker or principle fits this idea: " + card.title + "?" }))} go={go} accent="rose" />;
  else if (lab.id === "case-lab") tool = <EthicsCaseLab go={go} />;
  else tool = <div className="labs-tool-panel labs-placeholder-panel"><LabIcon name={lab.icon} /><span className="labs-kicker">{lab.category}</span><h2>{lab.title}</h2><p>{lab.description}</p></div>;
  return <><div>{tool}</div><LabSyllabusMap labId={lab.id} go={go} /><LabProgressPanel labId={lab.id} progress={progress} onLabProgress={onLabProgress} /></>;
}

function StudyLabs({ go, progress, review, focusSubject, onLabProgress }) {
  const ds = window.UPSC;
  const dueLab = Object.keys(LABS_BY_PAPER).flatMap((paperId) => LABS_BY_PAPER[paperId].map((lab) => ({ ...lab, paperId }))).find((lab) => progress?.labStats?.[lab.id]?.due && progress.labStats[lab.id].due <= ds.todayIso);
  // A due review comes first; otherwise honour the Focus subject the learner
  // arrived with, then fall back to the default opening lab.
  const focusMatch = !dueLab && focusSubject ? findLabForSubject(focusSubject) : null;
  const [paper, setPaper] = useStateLabs(dueLab?.paperId || focusMatch?.paperId || "gs1");
  const [selectedId, setSelectedId] = useStateLabs(dueLab?.id || focusMatch?.labId || "ancient-timeline");
  const activePaper = LAB_PAPERS.find((item) => item.id === paper);
  const labs = LABS_BY_PAPER[paper];
  const selectedLab = labs.find((item) => item.id === selectedId) || labs[0];
  const questionCount = ds.questionSets.reduce((sum, item) => sum + (Number(item.questionCount) || 0), 0);
  function selectPaper(nextPaper) { setPaper(nextPaper); setSelectedId(LABS_BY_PAPER[nextPaper][0].id); }
  const showFocus = Boolean(focusMatch && focusSubject);
  return <main className="labs-page"><section className="labs-hero"><div><span className="labs-kicker">Pariksha · Study Labs</span><h1>Make the syllabus interactive.</h1><p>A separate home for visual revision tools — timelines, maps, mechanism chains and active recall decks built from your own study library.</p></div><div className="labs-hero-note"><span className="labs-hero-mark">✦</span><strong>Recall over re-reading</strong><small>{ds.noteDocuments.length} notes · {questionCount.toLocaleString()} questions · local map layers</small></div></section>{showFocus && <div className="labs-focus-banner"><span className="labs-hero-mark">◎</span><div><strong>Focus: {focusSubject}</strong><small>This is your weakest area right now, so we've opened <em>{selectedLab.title}</em> below. Do a learn pass, then switch to Recall and mark how it felt.</small></div></div>}{review?.labDue > 0 && <div className="labs-due-banner"><span className="labs-hero-mark">↻</span><div><strong>{review.labDue} lab review{review.labDue === 1 ? "" : "s"} due</strong><small>Start with the highlighted lab and mark your confidence after the pass.</small></div></div>}<div className="labs-paper-tabs" role="tablist" aria-label="General Studies paper">{LAB_PAPERS.map((item) => <button key={item.id} role="tab" aria-selected={paper === item.id} className={paper === item.id ? "active" : ""} onClick={() => selectPaper(item.id)}><span>{item.label}</span><small>{item.title}</small></button>)}</div><section className="labs-section-head"><div><span className="labs-kicker">{activePaper.label}</span><h2>{activePaper.title}</h2><p>{activePaper.blurb}</p></div><span className="labs-count">{labs.filter((item) => item.status === "Live").length} live · {labs.length} tools</span></section><section className="labs-grid" aria-label={`${activePaper.label} tools`}>{labs.map((lab) => <button key={lab.id} className={`labs-card tone-${lab.tone}${selectedLab.id === lab.id ? " selected" : ""}`} onClick={() => setSelectedId(lab.id)}><div className="labs-card-art"><LabIcon name={lab.icon} /><span className={`tag ${lab.status === "Live" ? "tag-green" : "tag-soft"}`}>{lab.status}</span></div><div className="labs-card-body"><span className="labs-card-category">{activePaper.label} · {lab.category}</span><h3>{lab.title}</h3><p>{lab.description}</p><span className="labs-open-link">{lab.status === "Live" ? "Open lab" : "Preview tool"} <Icon name="arrowR" size={14} /></span></div></button>)}</section><section className="labs-workbench"><div className="labs-workbench-head"><span className="labs-kicker">Selected lab</span><span className="labs-workbench-label">{selectedLab.category}</span></div><LabHowTo /><LabsTool lab={selectedLab} go={go} progress={progress} onLabProgress={onLabProgress} /></section></main>;
}

Object.assign(window, { StudyLabs });
