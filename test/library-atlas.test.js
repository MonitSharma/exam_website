const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {syncLibraryAtlas, wordMatch, regionAnchor} = require('../scripts/generate_library_atlas');
const {buildContentManifest} = require('../scripts/generate_content_manifest');
const root = path.join(__dirname, '..');

test('library Atlas rebuilds deterministically and preserves original weekly maps', () => {
  const news = JSON.parse(fs.readFileSync(path.join(root, 'data/atlas/news.json')));
  const original = news.features.filter((feature) => !feature.libraryDerived);
  syncLibraryAtlas(root, news);
  const first = JSON.stringify(news);
  syncLibraryAtlas(root, news);
  assert.equal(JSON.stringify(news), first);
  assert.deepEqual(news.features.filter((feature) => !feature.libraryDerived), original);
  const latest = news.features.filter((feature) => feature.weekId === '2026-09-27-library');
  assert.ok(latest.some((feature) => feature.name === 'Pakistan'));
  assert.ok(latest.some((feature) => feature.name === 'Sriharikota'));
  assert.ok(!latest.some((feature) => ['Sagar','South','Central'].includes(feature.name)));
  for (const feature of news.features.filter((feature) => feature.libraryDerived)) {
    assert.equal(feature.coordinatePrecision, 'regional-study-anchor');
    assert.ok(fs.existsSync(path.join(root, feature.coordinateSource)));
    for (const ref of feature.references) {
      const text = fs.readFileSync(path.join(root, ref.source), 'utf8').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim();
      assert.ok(text.includes(ref.excerpt), ref.source);
    }
  }
});

test('briefing map links point to their own extracted places and keep quizzes unchanged', () => {
  const manifest = buildContentManifest(root);
  const atlas = JSON.parse(fs.readFileSync(path.join(root, 'data/atlas/news.json')));
  for (const cadence of ['daily', 'pib']) {
    const note = manifest.noteDocuments.find((item) => item.cadence === cadence && item.date === '2026-10-01');
    assert.equal(note.mapStatus, 'ready');
    assert.ok(note.relatedSetIds.length);
    for (const id of note.atlasFeatureIds) assert.ok(atlas.features.find((feature) => feature.id === id).references.some((ref) => ref.source === note.path));
  }
});

test('gazetteer matches whole place names and anchors geometry within its bounds', () => {
  assert.equal(wordMatch('Pakistan and Islamabad', 'Pakistan'), true);
  assert.equal(wordMatch('Pakistanis', 'Pakistan'), false);
  assert.equal(wordMatch('New Delhi (India)', 'New Delhi'), true);
  assert.deepEqual(regionAnchor({type:'Polygon',coordinates:[[[70,10],[74,10],[74,14],[70,10]]]}), {lat:12,lon:72});
});
