const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const model = require('../app/content-model');
const manifest = require('../config/content_manifest.json');
const React = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
  useState: (value) => [value, () => {}], useEffect: () => {},
};
function functions() {
  const code = ['labs.jsx', 'home.jsx'].map((file) => esbuild.transformSync(fs.readFileSync(path.join(__dirname, '../app', file), 'utf8'), { loader: 'jsx' }).code).join('\n');
  const window = { UPSC_CONTENT: model, UPSC: { ...manifest, todayIso: '2026-10-02' } };
  return new Function('React', 'window', 'Icon', `${code}; return { RelatedStudy, StudyLabs, recentLabNotes, LABS_BY_PAPER };`)(React, window, () => null);
}
function nodes(tree, type) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap((child) => nodes(child, type));
  return [...(tree.type === type ? [tree] : []), ...nodes(tree.children, type)];
}

test('CA and PIB links select their exact lab even when another lab review is due', () => {
  const api = functions();
  for (const cadence of ['daily', 'pib']) {
    const doc = manifest.noteDocuments.find((note) => note.cadence === cadence && note.date === '2026-10-01');
    const requests = [];
    const tree = api.RelatedStudy({ doc, go: (...args) => requests.push(args) });
    for (const button of nodes(tree, 'button')) button.props.onClick();
    const labRequests = requests.filter(([screen]) => screen === 'labs');
    assert.ok(labRequests.length > 0);
    for (const [, options] of labRequests) {
      assert.equal(options.fromNoteId, doc.id);
      const labs = api.StudyLabs({ ...options, go: () => {}, progress: {labStats: {'ancient-timeline': {due: '2026-09-01'}}} });
      const selected = nodes(labs, 'button').find((button) => button.props.className?.includes(' selected'));
      const expected = Object.values(api.LABS_BY_PAPER).flat().find((lab) => lab.id === options.labId);
      assert.equal(nodes(selected, 'h3')[0].children[0], expected.title);
    }
    // Shared Polity metadata must not collapse Governance into Constitution.
    if (doc.subjectIds.includes('polity')) {
      assert.ok(labRequests.some(([, options]) => options.labId === 'governance'));
      assert.ok(labRequests.some(([, options]) => options.labId === 'constitution'));
    }
  }
});

test('recent briefings refresh by subject and date, excluding the originating note', () => {
  const {recentLabNotes} = functions();
  const docs = [
    {id: 'old', cadence: 'daily', date: '2026-06-01', subjectIds: ['polity']},
    {id: 'new', cadence: 'pib', date: '2026-10-02', subjectIds: ['polity']},
    {id: 'origin', cadence: 'daily', date: '2026-10-01', subjectIds: ['polity']},
    {id: 'other', cadence: 'daily', date: '2026-10-03', subjectIds: ['economy']},
    {id: 'pack', cadence: 'sectional', date: '2026-10-04', subjectIds: ['polity']},
  ];
  assert.deepEqual(recentLabNotes('governance', docs, 'origin').map((note) => note.id), ['new', 'old']);
  assert.deepEqual(recentLabNotes('unknown', docs).map((note) => note.id), []);
});
