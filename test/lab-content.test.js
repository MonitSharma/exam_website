const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const esbuild = require('esbuild');
const { TOPICS, splitArticles } = require('../scripts/generate_lab_articles');

test('article matching distinguishes ancient history from scholarship announcements', () => {
  assert.equal(TOPICS['ancient-timeline'].test('Post-Matric Scholarship for Scheduled Caste Students'), false);
  assert.equal(TOPICS['ancient-timeline'].test('Rakhigarhi skeletons transferred for ancient-DNA study'), true);
  assert.equal(TOPICS['ancient-timeline'].test('India announces an economic partnership'), false);
});
test('article extraction stops before mixed briefing practice sections', () => {
  const articles = splitArticles('# Briefing\n### 1. A river story\nRiver body.\n### 2. A tax story\nTax body.\n# PART B — PRACTICE\n### 1. MCQ\nUnrelated question.');
  assert.equal(articles.length, 2);
  assert.equal(articles[0].text, 'River body.');
  assert.equal(articles[1].text, 'Tax body.');
  const pib = splitArticles('## 1. Ministry: River\nFirst.\n## 2. Ministry: Economy\nSecond.\n## Sources\nReference.');
  assert.equal(pib[1].text, 'Second.');
});
test('Ramsar snapshot has 101 unique sites, recent additions and valid Indian anchors', () => {
  const data = require('../data/atlas/reference_updates.json');
  const sites = data.features.filter(feature => feature.ramsar);
  assert.equal(sites.length, 101);
  assert.equal(new Set(sites.map(feature => feature.siteNumber)).size, 101);
  for (const site of sites) {
    assert.ok(site.lat > 6 && site.lat < 38 && site.lon > 68 && site.lon < 98, site.name);
    assert.ok(site.areaHa > 0 && site.sources.length && site.designationDate);
  }
  for (const number of [2588, 2589, 2594, 2595, 2597]) assert.ok(sites.some(site => site.siteNumber === number));
});
test('reference updates preserve existing geometry and do not duplicate wetlands', () => {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('app/atlas-knowledge.js', 'utf8'), context);
  const original = context.window.ATLAS_KNOWLEDGE.find(feature => feature.id === 'ganga').coords;
  vm.runInContext(fs.readFileSync('app/atlas-verified.js', 'utf8'), context);
  const features = context.window.ATLAS_KNOWLEDGE;
  assert.equal(features.find(feature => feature.id === 'ganga').coords, original);
  assert.equal(features.filter(feature => feature.layer === 'wetlands' && feature.ramsar).length, 101);
  assert.equal(new Set(features.map(feature => feature.id)).size, features.length);
  assert.ok(features.find(feature => feature.id === 'sikhna-jwhwlao').state === 'Assam');
  assert.ok(features.filter(feature => feature.recallPrompt).length >= 12);
});
test('monthly flashcard names have stable chronological numbering across newest-first display', () => {
  const code = esbuild.transformSync(fs.readFileSync('app/labs.jsx', 'utf8'), {loader: 'jsx'}).code;
  const label = new Function('React', 'window', `${code}; return flashcardDeckLabel;`)({useState(){},useEffect(){}}, {});
  const decks = [{id:'late',date:'2026-07-26'}, {id:'early',date:'2026-07-05'}, {id:'next',date:'2026-08-02'}];
  assert.equal(label(decks[1], decks), 'July 2026 · Set 1 Flashcards');
  assert.equal(label(decks[0], decks), 'July 2026 · Set 2 Flashcards');
  assert.equal(label(decks[2], decks), 'August 2026 · Set 1 Flashcards');
});
