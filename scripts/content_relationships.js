const fs = require('fs');
const path = require('path');
const model = require('../app/content-model');

function parentPath(file) { return file.replace(/(?:-\d+)?_chatgpt(?=\.[^.]+$)/, ''); }
function enrichManifest(root, manifest) {
  const { questionSets: sets, noteDocuments: notes } = manifest;
  const overridesPath = path.join(root, 'config/content_links.json');
  const overrides = fs.existsSync(overridesPath) ? JSON.parse(fs.readFileSync(overridesPath, 'utf8')) : {};
  const atlasPath = path.join(root, 'data/atlas/news.json');
  const atlas = fs.existsSync(atlasPath) ? JSON.parse(fs.readFileSync(atlasPath, 'utf8')) : { weeks: [], features: [] };
  for (const item of [...sets, ...notes]) {
    const siblings = item.cadence ? notes : sets;
    const parent = item.isSupplementary && siblings.find((other) => other.path === parentPath(item.path) || (item.sourcePath && other.sourcePath === parentPath(item.sourcePath)));
    // No primary source? Keep the resource independent; date is never identity.
    item.bundleId = parent ? parent.id : item.id;
    if (parent) item.parentId = parent.id;
    if (item.isSupplementary) {
      const index = item.path.match(/-(\d+)_chatgpt|_extra_(\d+)/);
      item.variantLabel = `${item.cadence ? 'Companion' : 'Add-on'}${index ? ' ' + (index[1] || index[2]) : ''}`;
    }
    item.relatedNoteIds = [];
    item.relatedSetIds = [];
  }
  const link = (note, set) => {
    if (!note || !set) return;
    if (!note.relatedSetIds.includes(set.id)) note.relatedSetIds.push(set.id);
    if (!set.relatedNoteIds.includes(note.id)) set.relatedNoteIds.push(note.id);
  };
  for (const set of sets) {
    const rows = JSON.parse(fs.readFileSync(path.join(root, set.path), 'utf8'));
    set.subjects = [...new Set(rows.map((q) => q.subject).filter(Boolean))];
    set.subjectIds = [...new Set(set.subjects.map(model.subjectId))];
    set.topicIds = [...new Set(rows.map((q) => model.topicId(q.subject, q.micro_topic || q.theme)))];
    set.format = set.category?.includes('Full Mock') || set.sourceType === 'pyq' ? 'full-paper' : set.category?.includes('Monthly') ? 'monthly-mock' : set.sourceType === 'sectional' ? 'sectional' : 'drill';
    set.provenance = set.sourceType === 'pyq' ? 'previous-year' : set.sourceType === 'csr' ? 'csr' : 'generated';
    // Exact parser lineage takes precedence. Known generation streams use a
    // deterministic filename contract; record the resulting IDs explicitly.
    const sourceNote = notes.find((n) => n.path === set.sourcePath);
    if (sourceNote) link(sourceNote, set);
    else {
      const stream = { daily: 'daily', pib: 'pib', rc: 'rc', sectional: 'sectional', csat: 'weekly-csat', 'weekly-quiz': 'weekly-quiz' }[set.sourceType];
      let candidates = notes.filter((n) => n.cadence === stream && n.date === set.isoDate && !!n.isSupplementary === !!set.isSupplementary);
      if (stream === 'sectional') {
        const topic = path.basename(set.path).replace(/_\d{4}-.*$/, '');
        candidates = candidates.filter((n) => path.basename(n.path).startsWith(`Sectional_${topic}_`));
      }
      if (stream === 'weekly-csat') candidates = candidates.filter((n) => /CSAT_Practice_/.test(n.path));
      if (candidates.length === 1) link(candidates[0], set);
    }
  }
  for (const [notePath, related] of Object.entries(overrides)) {
    const note = notes.find((n) => n.path === notePath);
    if (!note) throw new Error(`Unknown relationship source: ${notePath}`);
    for (const setPath of related.questionSets || []) {
      const set = sets.find((s) => s.path === setPath);
      if (!set) throw new Error(`Unknown related question set: ${setPath}`);
      link(note, set);
    }
    for (const relatedPath of related.notes || []) {
      const target = notes.find((n) => n.path === relatedPath);
      if (!target) throw new Error(`Unknown related note: ${relatedPath}`);
      note.relatedNoteIds.push(target.id);
      target.relatedNoteIds.push(note.id);
    }
  }
  for (const note of notes) {
    if (!model.notes[note.cadence]) throw new Error(`Unknown UI category: ${note.cadence}`);
    const linkedSets = sets.filter((s) => note.relatedSetIds.includes(s.id));
    note.subjectIds = [...new Set(linkedSets.flatMap((s) => s.subjectIds))];
    note.topicIds = [...new Set(linkedSets.flatMap((s) => s.topicIds))];
    const week = atlas.weeks.find((w) => w.source === note.path);
    if (note.cadence === 'weekly-news') {
      note.atlasWeekId = week?.id || note.date;
      note.atlasFeatureIds = atlas.features.filter((f) => f.weekId === week?.id).map((f) => f.id);
      note.mapStatus = note.atlasFeatureIds.length ? 'ready' : 'pending';
    }
  }
  return manifest;
}
module.exports = { enrichManifest };
