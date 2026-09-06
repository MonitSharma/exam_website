const fs = require('fs');
const path = require('path');
const model = require('../app/content-model');
function walk(root, rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(root, `${rel}/${e.name}`) : [`${rel}/${e.name}`]);
}
function inventory(root, manifest) {
  const published = new Set([...manifest.noteDocuments, ...manifest.questionSets].map((x) => x.path));
  const sourcePaths = new Set(manifest.questionSets.map((x) => x.sourcePath).filter(Boolean));
  const excludedPath = path.join(root, 'config/content_exclusions.json');
  const excluded = fs.existsSync(excludedPath) ? JSON.parse(fs.readFileSync(excludedPath, 'utf8')) : {};
  const files = ['daily', 'weekly', 'monthly', 'anki', 'reference', 'reviews', 'generated_questions', 'generated_data', 'data/processed'].flatMap((dir) => walk(root, dir)).filter((f) => /\.(md|txt|json|docx|csv)$/i.test(f));
  files.push(...fs.readdirSync(root).filter((f) => /^(Ethics_Case_|Essay_Topic_|CSAT_Strategy_Guide).*\.md$/.test(f)));
  return [...new Set(files)].sort().map((file) => {
    if (published.has(file)) return { path: file, status: 'published' };
    if (sourcePaths.has(file)) return { path: file, status: 'source-only', reason: 'Parsed into a published question set' };
    if (excluded[file]) return { path: file, ...excluded[file] };
    return { path: file, status: 'unclassified' };
  });
}
function validateCoverage(root, manifest) {
  const errors = [];
  const notes = new Map(manifest.noteDocuments.map((n) => [n.id, n]));
  const sets = new Map(manifest.questionSets.map((s) => [s.id, s]));
  for (const item of [...notes.values(), ...sets.values()]) {
    if (!fs.existsSync(path.join(root, item.path))) errors.push(`Missing resource: ${item.path}`);
    if (item.cadence && !model.notes[item.cadence]) errors.push(`Unknown category: ${item.cadence}`);
    for (const id of item.relatedNoteIds || []) if (!notes.has(id)) errors.push(`Missing linked note: ${id}`);
    for (const id of item.relatedSetIds || []) if (!sets.has(id)) errors.push(`Missing linked set: ${id}`);
    const peers = item.cadence ? notes : sets;
    if (item.parentId && (!peers.has(item.parentId) || !item.isSupplementary)) errors.push(`Invalid bundle parent: ${item.id}`);
    if (!item.isSupplementary && item.bundleId !== item.id) errors.push(`Primary content collapsed: ${item.id}`);
  }
  const newsFile = path.join(root, 'data/atlas/news.json');
  if (fs.existsSync(newsFile)) {
    const news = JSON.parse(fs.readFileSync(newsFile, 'utf8'));
    const weeks = new Map(news.weeks.map((w) => [w.id, w]));
    const ids = new Set();
    for (const feature of news.features) {
      if (ids.has(feature.id)) errors.push(`Duplicate Atlas feature: ${feature.id}`);
      ids.add(feature.id);
      if (!weeks.has(feature.weekId)) errors.push(`Orphan Atlas feature: ${feature.id}`);
      if (!Number.isFinite(feature.lat) || !Number.isFinite(feature.lon) || Math.abs(feature.lat) > 90 || Math.abs(feature.lon) > 180) errors.push(`Invalid coordinates: ${feature.id}`);
    }
    for (const week of weeks.values()) if (![...notes.values()].some((n) => n.path === week.source)) errors.push(`Orphan Atlas source: ${week.source}`);
    for (const note of notes.values()) if (note.cadence === 'weekly-news' && note.mapStatus !== 'ready') errors.push(`Missing Atlas companion: ${note.path}`);
  }
  const rows = inventory(root, manifest);
  for (const row of rows) if (row.status === 'unclassified') errors.push(`Unclassified generated content: ${row.path}`);
  if (errors.length) throw new Error(errors.join('\n'));
  return rows;
}
if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const manifest = require('./generate_content_manifest').buildContentManifest(root);
  const rows = validateCoverage(root, manifest);
  console.log(rows.reduce((counts, row) => ({ ...counts, [row.status]: (counts[row.status] || 0) + 1 }), {}));
}
module.exports = { inventory, validateCoverage };
