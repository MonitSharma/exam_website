const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { buildContentManifest } = require('../scripts/generate_content_manifest');
const { enrichManifest } = require('../scripts/content_relationships');
const { validateCoverage } = require('../scripts/content_coverage');

function fixture(t, files, overrides) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pariksha-weekly-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const file of files) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), file.endsWith('.txt') ? 'Question\tAnswer\n' : '# Study note\n');
  }
  if (overrides) {
    fs.mkdirSync(path.join(root, 'config'), { recursive: true });
    fs.writeFileSync(path.join(root, 'config/content_links.json'), JSON.stringify(overrides));
  }
  return root;
}

function assertLinked(manifest, sourcePath, targetPath) {
  const source = manifest.noteDocuments.find((n) => n.path === sourcePath);
  const target = manifest.noteDocuments.find((n) => n.path === targetPath);
  assert.deepEqual(source.relatedNoteIds, [target.id]);
  assert.ok(target.relatedNoteIds.includes(source.id));
}

test('new Sunday drops link automatically without dated config entries', (t) => {
  const dates = ['2026-10-18', '2026-10-25', '2026-11-01', '2027-01-03'];
  const files = dates.flatMap((date) => {
    const previous = new Date(Date.parse(`${date}T00:00:00Z`) - 86400000).toISOString().slice(0, 10);
    return [
      `anki/Prelims_Flashcards_${date}.txt`,
      `daily/daily_current_affairs/UPSC_CA_${previous}.md`,
      `weekly/Sunday/Sunday_Sweep_${date}.md`,
      `weekly/Sectional/Sectional_book-topics_${date}_chatgpt.md`,
    ];
  });
  const root = fixture(t, files);
  const manifest = buildContentManifest(root);
  assert.equal(validateCoverage(root, manifest).filter((row) => row.status === 'unclassified').length, 0);
  for (let i = 0; i < files.length; i += 4) {
    assertLinked(manifest, files[i], files[i + 1]);
    assertLinked(manifest, files[i + 3], files[i + 2]);
  }
  const again = enrichManifest(root, structuredClone(manifest));
  assert.deepEqual(again, manifest, 'Regeneration must not duplicate reciprocal links');
});

test('flashcards select the latest primary briefing, excluding future and supplementary notes', (t) => {
  const deck = 'anki/Prelims_Flashcards_2026-10-18.txt';
  const latest = 'daily/daily_current_affairs/UPSC_CA_2026-10-17.md';
  const root = fixture(t, [deck, latest,
    'daily/daily_current_affairs/UPSC_CA_2026-10-16.md',
    'daily/daily_current_affairs/UPSC_CA_2026-10-18_chatgpt.md',
    'daily/daily_current_affairs/UPSC_CA_2026-10-19.md']);
  assertLinked(buildContentManifest(root), deck, latest);
});

test('flashcards can link to a same-day primary briefing', (t) => {
  const deck = 'anki/Prelims_Flashcards_2026-10-18_chatgpt.txt';
  const briefing = 'daily/daily_current_affairs/UPSC_CA_2026-10-18.md';
  const root = fixture(t, [deck, briefing]);
  assertLinked(buildContentManifest(root), deck, briefing);
});

test('the previous Sunday is eligible across a year boundary', (t) => {
  const deck = 'anki/Prelims_Flashcards_2027-01-03.txt';
  const briefing = 'daily/daily_current_affairs/UPSC_CA_2026-12-27.md';
  const root = fixture(t, [deck, briefing]);
  assertLinked(buildContentManifest(root), deck, briefing);
});

test('a same-date Sunday Sweep is used when weekly primary briefings are absent', (t) => {
  const deck = 'anki/Prelims_Flashcards_2027-01-03.txt';
  const sweep = 'weekly/Sunday/Sunday_Sweep_2027-01-03.md';
  const root = fixture(t, [deck, sweep,
    'daily/daily_current_affairs/UPSC_CA_2026-12-26.md',
    'daily/daily_current_affairs/UPSC_CA_2027-01-04.md',
    'daily/daily_current_affairs/UPSC_CA_2027-01-03_chatgpt.md']);
  assertLinked(buildContentManifest(root), deck, sweep);
});

test('explicit related reading takes precedence over automatic weekly choices', (t) => {
  const deck = 'anki/Prelims_Flashcards_2026-10-18.txt';
  const companion = 'weekly/Sectional/Sectional_book-topics_2026-10-18_chatgpt.md';
  const selected = 'daily/daily_current_affairs/UPSC_CA_2026-09-01.md';
  const root = fixture(t, [deck, companion, selected,
    'daily/daily_current_affairs/UPSC_CA_2026-10-17.md',
    'weekly/Sunday/Sunday_Sweep_2026-10-18.md'], {
    [deck]: { notes: [selected, selected] },
    [companion]: { notes: [selected] },
  });
  const manifest = buildContentManifest(root);
  assertLinked(manifest, deck, selected);
  assertLinked(manifest, companion, selected);
});
