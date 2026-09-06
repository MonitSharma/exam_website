const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');
const esbuild = require('esbuild');
const { ROOT, loadBrowserModule } = require('./helpers');
const { buildContentManifest } = require('../scripts/generate_content_manifest');
const { validateCoverage, inventory } = require('../scripts/content_coverage');
const model = require('../app/content-model');
const manifest = buildContentManifest(ROOT);

function homeFunctions() {
  const source = fs.readFileSync(path.join(ROOT, 'app/home.jsx'), 'utf8');
  const React = { Fragment: 'fragment', createElement: (type, props, ...children) => ({ type, props: props || {}, children }) };
  const code = esbuild.transformSync(source, { loader: 'jsx' }).code;
  return new Function('React', 'window', `${code}; return { renderInline, MarkdownView, questionSetBundleKey, noteBundleKey };`)(React, { UPSC_CONTENT: model });
}
function nodes(tree, type) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap((child) => nodes(child, type));
  return [...(tree.type === type ? [tree] : []), ...nodes(tree.children, type)];
}

test('all 32 previously missing map questions become keyed playable quizzes', () => {
  for (const [date, count] of [['2026-08-08', 6], ['2026-08-15', 6], ['2026-08-22', 6], ['2026-08-29', 7], ['2026-09-05', 7]]) {
    const set = manifest.questionSets.find((s) => s.sourceType === 'weekly-news' && s.isoDate === date);
    assert.equal(set.questionCount, count);
    const rows = JSON.parse(fs.readFileSync(path.join(ROOT, set.path), 'utf8'));
    assert.ok(rows.every((q) => q.options.length === 4 && q.options.some((o) => o.key === q.answer)));
    assert.ok(set.relatedNoteIds.length);
  }
});

test('unexpected quiz headings fail instead of silently dropping a quiz', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pariksha-schema-'));
  try {
    fs.mkdirSync(path.join(root, 'weekly/weekly_news'), { recursive: true });
    fs.writeFileSync(path.join(root, 'weekly/weekly_news/Places_in_News_2026-09-05.md'), '# Note\n## New heading\n**Q1.** Stem\na) A b) B c) C d) D\n');
    assert.throws(() => buildContentManifest(root), /Incomplete map quiz extraction/);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test('all primary resources have independent identities including same-date papers', () => {
  for (const items of [manifest.questionSets, manifest.noteDocuments]) {
    const primary = items.filter((x) => !x.isSupplementary);
    assert.equal(new Set(primary.map(model.bundleKey)).size, primary.length);
  }
  const { questionSetBundleKey, noteBundleKey } = homeFunctions();
  assert.notEqual(questionSetBundleKey({id:'economy',sourceType:'sectional',isoDate:'2026-06-29'}), questionSetBundleKey({id:'environment',sourceType:'sectional',isoDate:'2026-06-29'}));
  assert.notEqual(noteBundleKey({id:'paper1',cadence:'physics',date:'2026-06-15'}), noteBundleKey({id:'paper2',cadence:'physics',date:'2026-06-15'}));
});

test('all subjects survive manifest generation, including 2026 Polity and science', () => {
  for (const set of manifest.questionSets) {
    const rows = JSON.parse(fs.readFileSync(path.join(ROOT, set.path), 'utf8'));
    for (const q of rows) if (q.subject) assert.ok(set.subjects.includes(q.subject), `${set.id}: ${q.subject}`);
  }
  const set = manifest.questionSets.find((s) => s.id === '2026');
  assert.ok(set.subjectIds.includes('polity'));
  assert.ok(set.subjectIds.includes('science-technology'));
  assert.ok(model.matchesSubjects({ subject: 'Polity & Governance' }, ['Polity']));
  assert.equal(model.matchesSubjects({ subject: 'Economy' }, ['Polity']), false);
});

test('every generated resource is classified and relationships are valid', () => {
  const rows = validateCoverage(ROOT, manifest);
  assert.ok(rows.length > 600);
  assert.ok(manifest.noteDocuments.some((n) => n.path === 'Essay_Topic_2026-08-10.md'));
  assert.ok(manifest.noteDocuments.some((n) => n.path === 'reviews/Weekly_Review_2026-06-20.md'));
  assert.equal(inventory(ROOT, manifest).filter((r) => r.status === 'unclassified').length, 0);
  const broken = structuredClone(manifest);
  broken.noteDocuments.find((n) => n.cadence === 'weekly-news').mapStatus = 'pending';
  assert.throws(() => validateCoverage(ROOT, broken), /Missing Atlas companion/);
});

test('essays and Mains use shared writing and category metadata', () => {
  for (const note of manifest.noteDocuments) assert.ok(model.notes[note.cadence]);
  assert.ok(model.writingCadences.includes('essay'));
  assert.ok(model.writingCadences.includes('mains'));
});

test('weekly explanation extraction stops before recall prompts and scoring footers', () => {
  for (const set of manifest.questionSets.filter((s) => s.sourceType === 'weekly-quiz')) {
    const rows = JSON.parse(fs.readFileSync(path.join(ROOT, set.path), 'utf8'));
    for (const row of rows) assert.doesNotMatch(row.explanation || '', /Scoring guide|Recall Prompts|RP?\d[.—]|Auto-generated run/i, set.path);
  }
});

test('Markdown citations are links, nested URL parentheses survive, unsafe schemes stay text', () => {
  const { renderInline } = homeFunctions();
  const safe = nodes(renderInline('[Read **source**](https://example.org/report_(2026)?a=1&b=2)'), 'a');
  assert.equal(safe.length, 1);
  assert.equal(safe[0].props.href, 'https://example.org/report_(2026)?a=1&b=2');
  assert.match(safe[0].props.rel, /noopener/);
  assert.equal(nodes(renderInline('[bad](javascript:alert(1)) [bad](data:text/html,test)'), 'a').length, 0);
});

test('Markdown ordered list starts, tables and math remain represented', () => {
  const { MarkdownView } = homeFunctions();
  const tree = MarkdownView({text:'1. First\n\n2. Second\n\n| A | B |\n| --- | --- |\n| C | D |\n\n$$E=mc^2$$'});
  assert.deepEqual(nodes(tree, 'ol').map((n) => n.props.start), [1, 2]);
  assert.equal(nodes(tree, 'table').length, 1);
  assert.ok(JSON.stringify(tree).includes('E=mc^2'));
});

test('fresh catch-up starts today, chosen history window and essay completion persist', () => {
  const { window } = loadBrowserModule('app/progress.js');
  const api = window.UPSC_PROGRESS;
  const fresh = api.createFreshProgress(new Date('2026-09-06T12:00:00').getTime());
  const notes = [{id:'essay',cadence:'essay',date:'2026-09-05',title:'Essay'}];
  assert.equal(api.getMissedSessions(fresh,'2026-09-06',[],notes).length,0);
  const chosen = {...fresh,catchUpStartDate:'2026-09-01'};
  assert.equal(api.getMissedSessions(chosen,'2026-09-06',[],notes).length,1);
  api.saveProgress(chosen);
  assert.equal(api.loadProgress().catchUpStartDate,'2026-09-01');
  assert.equal(api.getMissedSessions(api.setItemDone(chosen,'essay',true,'2026-09-06'),'2026-09-06',[],notes).length,0);
  const restored = api.normalizeProgress({...chosen,version:5,catchUpStartDate:undefined});
  assert.equal(restored.catchUpStartDate,'2026-09-06');
});

test('deployment uses the same manifest and content assets as the checked source', () => {
  const built = JSON.parse(fs.readFileSync(path.join(ROOT,'dist/config/content_manifest.json'),'utf8'));
  assert.deepEqual(built,JSON.parse(JSON.stringify(manifest)));
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(ROOT,'config/content_manifest.json'),'utf8')),built);
  for (const item of [...built.noteDocuments,...built.questionSets]) {
    assert.ok(fs.readFileSync(path.join(ROOT,item.path)).equals(fs.readFileSync(path.join(ROOT,'dist',item.path))),item.path);
  }
});
