const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const { ROOT, loadBrowserModule } = require('./helpers');
const manifest = require('../config/content_manifest.json');
const model = require('../app/content-model');

test('all published book-topic add-ons and missed sweeps enter catch-up independently', () => {
  const { window } = loadBrowserModule('app/progress.js');
  const api = window.UPSC_PROGRESS;
  const progress = { ...api.createFreshProgress(0), catchUpStartDate: '2026-06-01' };
  const today = '2026-10-15';
  const getMissed = (p) => api.getMissedSessions(p, today, manifest.questionSets, manifest.noteDocuments);
  const books = manifest.questionSets.filter(model.isBookTopicsSet);
  const sweeps = manifest.noteDocuments.filter((n) => n.cadence === 'sunday');
  assert.ok(books.length >= 16);
  assert.ok(sweeps.length >= 19);
  for (const book of books.filter((b) => b.isoDate < today)) {
    const item = getMissed(progress).find((row) => row.id === book.id);
    assert.equal(item?.category, 'book-topics', book.id);
    assert.equal(item.kind, 'quiz');
  }
  for (const sweep of sweeps.filter((s) => s.date < today)) {
    const item = getMissed(progress).find((row) => row.id === sweep.id);
    assert.equal(item?.category, 'sunday', sweep.id);
    assert.equal(item.kind, 'reading');
  }
  const [book, secondBook] = books;
  const sweep = sweeps[0];
  const done = {
    ...progress,
    history: [{ questionSetId: book.id }],
    dismissedSessions: { [secondBook.id]: { at: 1 } },
    manualCompletions: { [sweep.id]: { at: 1 } },
  };
  const ids = getMissed(done).map((row) => row.id);
  for (const id of [book.id, secondBook.id, sweep.id]) assert.ok(!ids.includes(id));
  assert.ok(getMissed({ ...progress, catchUpStartDate: '2026-10-01' }).every((row) => row.isoDate >= '2026-10-01'));
  const restored = api.setItemDone(api.setSessionDismissed(done, secondBook.id, false), sweep.id, false);
  assert.ok(getMissed(restored).some((row) => row.id === secondBook.id));
  assert.ok(getMissed(restored).some((row) => row.id === sweep.id));
});

function nodes(tree, predicate) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap((child) => nodes(child, predicate));
  return [...(predicate(tree) ? [tree] : []), ...nodes(tree.children, predicate)];
}

function screen(ds, progress, callbacks = {}, filter = 'all') {
  const { window } = loadBrowserModule('app/progress.js', { window: { UPSC: ds } });
  let stateIndex = 0;
  const React = {
    Fragment: 'fragment',
    useState: (value) => [stateIndex++ === 0 ? filter : value, () => {}],
    useEffect: () => {},
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
  };
  const code = esbuild.transformSync(fs.readFileSync(path.join(ROOT, 'app/catchup.jsx'), 'utf8'), { loader: 'jsx' }).code;
  new Function('React', 'window', 'Icon', 'Tag', code)(React, window, 'icon', 'tag');
  return window.CatchUpScreen({ go: () => {}, progress, ...callbacks });
}

test('Sunday archive includes old, completed, dismissed and current sweeps with working actions', () => {
  const sweep = (id, date) => ({ id, date, cadence: 'sunday', title: 'Sunday Sweep' });
  const ds = {
    todayIso: '2026-10-11', questionSets: [],
    noteDocuments: [sweep('old', '2026-06-07'), sweep('done', '2026-10-04'), sweep('dismissed', '2026-09-27'), sweep('today', '2026-10-11'), sweep('future', '2026-10-18')],
  };
  const progress = { catchUpStartDate: ds.todayIso, manualCompletions: { done: { at: 1 } }, dismissedSessions: { dismissed: { at: 1 } } };
  const calls = [];
  const tree = screen(ds, progress, {
    go: (...args) => calls.push(args),
    onMarkDone: (id) => calls.push(['done', id]),
    onUndoDone: (id) => calls.push(['undo', id]),
    onRestore: (id) => calls.push(['restore', id]),
  });
  const archive = nodes(tree, (n) => n.props.className === 'catchup-mains catchup-sweeps')[0];
  assert.ok(archive, 'archive is shown even with no pending backlog');
  const buttons = nodes(archive, (n) => n.type === 'button');
  assert.deepEqual(buttons.filter((n) => n.props['aria-label']?.startsWith('Open Sunday')).map((n) => n.props['aria-label']), [
    'Open Sunday Sweep 2026-10-11', 'Open Sunday Sweep 2026-10-04', 'Open Sunday Sweep 2026-09-27', 'Open Sunday Sweep 2026-06-07',
  ]);
  buttons.find((n) => n.props['aria-label'] === 'Open Sunday Sweep 2026-06-07').props.onClick();
  buttons.find((n) => n.props['aria-label'] === 'Mark done Sunday Sweep 2026-10-11').props.onClick();
  buttons.find((n) => n.props['aria-label'] === 'Undo completion for Sunday Sweep 2026-10-04').props.onClick();
  buttons.find((n) => n.children.includes('Restore')).props.onClick();
  assert.deepEqual(calls, [['library', { noteId: 'old' }], ['done', 'today'], ['undo', 'done'], ['restore', 'dismissed']]);
});

test('book-topic filter starts the add-on quiz and Sunday backlog opens its note', () => {
  const book = manifest.questionSets.find(model.isBookTopicsSet);
  const sweep = manifest.noteDocuments.find((n) => n.cadence === 'sunday');
  const ds = { todayIso: '2026-10-15', questionSets: [book], noteDocuments: [sweep] };
  const progress = { catchUpStartDate: '2026-06-01' };
  const calls = [];
  const tree = screen(ds, progress, { go: (...args) => calls.push(args) }, 'book-topics');
  const chips = nodes(tree, (n) => n.props.role === 'tab');
  assert.ok(chips.some((n) => n.props['aria-selected'] && n.children.includes('Book topics · Add-on')));
  const groups = nodes(tree, (n) => n.props.className === 'catchup-groups')[0];
  const start = nodes(groups, (n) => n.type === 'button' && n.children.includes(' Start'))[0];
  start.props.onClick();
  assert.deepEqual(calls.pop(), ['test', { setId: book.id, returnTo: 'catchup' }]);
  const sundayTree = screen(ds, progress, { go: (...args) => calls.push(args) }, 'sunday');
  const sundayGroups = nodes(sundayTree, (n) => n.props.className === 'catchup-groups')[0];
  nodes(sundayGroups, (n) => n.type === 'button' && n.children.includes(' Open'))[0].props.onClick();
  assert.deepEqual(calls.pop(), ['library', { noteId: sweep.id }]);
});
