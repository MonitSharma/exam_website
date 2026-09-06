// Shared vocabulary and identities for build scripts and every screen.
(function (root) {
  const notes = {
    daily: { label: 'Daily CA', group: 'Daily', source: 'daily' },
    pib: { label: 'Daily PIB', group: 'Daily', source: 'pib' },
    rc: { label: 'Daily RC', group: 'Daily', source: 'rc' },
    mains: { label: 'Daily Mains', group: 'Daily', writing: true },
    editorials: { label: 'Editorials', group: 'Weekly', writing: true },
    schemes: { label: 'Schemes', group: 'Weekly' },
    sunday: { label: 'Sunday Sweep', group: 'Weekly' },
    'weekly-csat': { label: 'CSAT', group: 'Weekly', source: 'csat' },
    physics: { label: 'Physics', group: 'Weekly' },
    'weekly-news': { label: 'Places in News', group: 'Weekly', source: 'weekly-news' },
    'weekly-quiz': { label: 'Recall Quiz', group: 'Weekly', source: 'weekly-quiz' },
    weekly: { label: 'Weekly', group: 'Weekly' },
    sectional: { label: 'Sectional', group: 'Weekly', source: 'sectional' },
    ethics: { label: 'Ethics', group: 'Weekly', writing: true },
    essay: { label: 'Essays', group: 'Weekly', writing: true },
    review: { label: 'Study Reviews', group: 'Weekly' },
    monthly: { label: 'Monthly', group: 'Monthly' },
    anki: { label: 'Flashcards', group: 'Reference' },
    fodder: { label: 'Fodder', group: 'Reference' },
    strategy: { label: 'Strategy', group: 'Reference' },
  };
  function bundleKey(item) { return item?.bundleId || item?.id || ''; }
  function variantLabel(item) { return item?.variantLabel || item?.shortTitle || item?.shortLabel || item?.title || item?.label || 'Open'; }
  function subjectId(value) {
    const key = String(value || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return ({ 'polity-and-governance': 'polity', governance: 'polity', 'art-and-culture': 'culture', 'ancient-history': 'history', 'modern-history': 'history', 'science-and-technology': 'science-technology', 'social-issues': 'society' })[key] || key;
  }
  function topicId(subject, topic) { return [subjectId(subject), subjectId(topic)].filter(Boolean).join('/'); }
  function matchesSubjects(question, subjects) { return subjects.some((s) => subjectId(s) === subjectId(question.subject)); }
  const api = { notes, bundleKey, variantLabel, subjectId, topicId, matchesSubjects, writingCadences: Object.keys(notes).filter((key) => notes[key].writing) };
  root.UPSC_CONTENT = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
