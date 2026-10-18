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
  const [book, secondBook] = books.filter((b) => b.isoDate < today);
  const sweep = sweeps.find((s) => s.date < today);
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
  const book = manifest.questionSets.filter(model.isBookTopicsSet).find((b) => b.isoDate < '2026-10-15');
  const sweep = manifest.noteDocuments.filter((n) => n.cadence === 'sunday').find((s) => s.date < '2026-10-15');
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

test('revision tasks respect dates and completion while daily CA and PIB always stay out', () => {
  const { window } = loadBrowserModule('app/progress.js');
  const api = window.UPSC_PROGRESS;
  const progress = { ...api.createFreshProgress(0), catchUpStartDate: '2026-10-01' };
  const notes = ['weekly-news', 'schemes', 'anki', 'physics', 'monthly', 'daily', 'pib'].map((cadence) => ({ id: `${cadence}-note`, cadence, date: '2026-10-04', title: cadence }));
  notes.push(
    { id: 'old', cadence: 'schemes', date: '2026-09-30' },
    { id: 'today', cadence: 'schemes', date: '2026-10-15' },
    { id: 'future', cadence: 'schemes', date: '2026-10-16' },
    { id: 'undated', cadence: 'monthly' },
    { id: 'supplement', cadence: 'physics', date: '2026-10-04', isSupplementary: true },
  );
  const sets = ['weekly-news', 'daily', 'pib'].map((sourceType) => ({ id: `${sourceType}-quiz`, sourceType, isoDate: '2026-10-04' }));
  const missed = (p) => api.getMissedSessions(p, '2026-10-15', sets, notes);
  assert.deepEqual(missed(progress).map((item) => item.id).sort(), ['anki-note', 'monthly-note', 'physics-note', 'schemes-note', 'weekly-news-note', 'weekly-news-quiz']);
  assert.equal(missed(progress).find((item) => item.id === 'monthly-note').durationMinutes, 120);
  for (const note of notes.slice(0, 5)) {
    const done = api.setItemDone(progress, note.id, true, '2026-10-15');
    assert.ok(!missed(done).some((item) => item.id === note.id));
    const dismissed = api.setSessionDismissed(progress, note.id, true);
    assert.ok(!missed(dismissed).some((item) => item.id === note.id));
    assert.ok(missed(api.setSessionDismissed(dismissed, note.id, false)).some((item) => item.id === note.id));
  }
  const quizDone = { ...progress, history: [{ questionSetId: 'weekly-news-quiz' }] };
  assert.ok(missed(quizDone).some((item) => item.id === 'weekly-news-note'), 'quiz attempts do not silently complete location revision');
  assert.ok(!missed(quizDone).some((item) => item.id === 'weekly-news-quiz'));
});

test('Places in News archive opens notes, maps and exact linked quizzes, with independent completion', () => {
  const note = manifest.noteDocuments.filter((n) => n.cadence === 'weekly-news').find((n) => n.date < '2026-10-15');
  const quizzes = manifest.questionSets.filter((s) => note.relatedSetIds.includes(s.id));
  assert.ok(quizzes.length);
  const ds = {
    todayIso: '2026-10-15', questionSets: quizzes,
    noteDocuments: [note, { ...note, id: 'future', date: '2026-10-16' }],
  };
  const calls = [];
  const tree = screen(ds, { catchUpStartDate: ds.todayIso }, {
    go: (...args) => calls.push(args),
    onMarkDone: (id) => calls.push(['done', id]),
  });
  const archive = nodes(tree, (n) => n.props.className === 'catchup-mains catchup-places')[0];
  assert.ok(archive, 'notes outside the pending window remain available');
  assert.equal(nodes(archive, (n) => n.props.className === 'catchup-card tone-teal').length, 1, 'future notes excluded');
  const buttons = nodes(archive, (n) => n.type === 'button');
  buttons.find((n) => n.props['aria-label'] === `Open Places in News ${note.date}`).props.onClick();
  buttons.find((n) => n.props['aria-label'] === `Open map for Places in News ${note.date}`).props.onClick();
  buttons.find((n) => n.props['aria-label'] === `Start ${quizzes[0].label}`).props.onClick();
  buttons.find((n) => n.props['aria-label'] === `Mark done Places in News ${note.date}`).props.onClick();
  assert.deepEqual(calls, [
    ['library', { noteId: note.id }], ['atlas', { weekId: note.atlasWeekId }],
    ['test', { setId: quizzes[0].id, returnTo: 'catchup' }], ['done', note.id],
  ]);
  const doneTree = screen(ds, { catchUpStartDate: ds.todayIso, manualCompletions: { [note.id]: { at: 1 } } }, { onUndoDone: (id) => calls.push(['undo', id]) });
  nodes(doneTree, (n) => n.props['aria-label'] === `Undo completion for Places in News ${note.date}`)[0].props.onClick();
  assert.deepEqual(calls.pop(), ['undo', note.id]);
});

test('Places in News filter includes notes and quizzes; all added revision types have usable cards', () => {
  const ds = { todayIso: '2026-10-15', questionSets: manifest.questionSets, noteDocuments: manifest.noteDocuments };
  const progress = { catchUpStartDate: '2026-06-01' };
  const tree = screen(ds, progress, {}, 'weekly-news');
  assert.ok(nodes(tree, (n) => n.props.role === 'tab' && n.props['aria-selected'] && n.children.includes('Places in News')).length);
  const groups = nodes(tree, (n) => n.props.className === 'catchup-groups')[0];
  const buttons = nodes(groups, (n) => n.type === 'button');
  assert.ok(buttons.some((n) => n.children.includes(' Open')));
  assert.ok(buttons.some((n) => n.children.includes(' Start')));
  for (const [cadence, label] of [['schemes', 'Schemes & reports'], ['anki', 'Flashcards'], ['physics', 'Physics Optional'], ['monthly', 'Monthly mocks']]) {
    const filtered = screen(ds, progress, {}, cadence);
    assert.ok(nodes(filtered, (n) => n.props.role === 'tab' && n.props['aria-selected'] && n.children.includes(label)).length, cadence);
    const cards = nodes(filtered, (n) => n.props.className === 'catchup-groups')[0];
    assert.ok(nodes(cards, (n) => n.type === 'button' && n.children.includes(' Open')).length, cadence);
  }
});
