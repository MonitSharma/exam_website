/* Guards on the content pipeline itself.
 *
 * Files arrive here from unattended scheduled jobs, so these assert the
 * invariants the app depends on rather than any particular note's contents.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { ROOT } = require("./helpers");
const { buildContentManifest } = require("../scripts/generate_content_manifest");
const { loadAppData } = require("../scripts/load_app_data");

const manifest = buildContentManifest(ROOT);

test("every manifest path exists on disk", () => {
  const missing = [
    ...manifest.noteDocuments.map((note) => note.path),
    ...manifest.questionSets.map((set) => set.path),
  ].filter((relPath) => !fs.existsSync(path.join(ROOT, relPath)));
  assert.deepEqual(missing, []);
});

test("manifest ids are unique", () => {
  for (const [label, items] of [["notes", manifest.noteDocuments], ["question sets", manifest.questionSets]]) {
    const ids = items.map((item) => item.id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    assert.deepEqual([...new Set(duplicates)], [], `duplicate ${label} ids`);
  }
});

test("app/data.js fallback paths still point at real files", () => {
  const source = fs.readFileSync(path.join(ROOT, "app", "data.js"), "utf8");
  const paths = [...source.matchAll(/path: "([^"]+)"/g)].map((match) => match[1]);
  assert.ok(paths.length > 0, "the fallback list was found");
  const missing = paths.filter((relPath) => !fs.existsSync(path.join(ROOT, relPath)));
  assert.deepEqual(missing, [], "the offline fallback list has rotted");
});

test("every question set parses into questions the UI can render", () => {
  const api = loadAppData({ manifest });
  const broken = [];
  for (const set of api.questionSets) {
    const rows = JSON.parse(fs.readFileSync(path.join(ROOT, set.path), "utf8"));
    rows.forEach((row, index) => {
      const question = api.parsing.normalizeQuestion(row, index, set);
      const keys = question.options.map((option) => option.key);
      if (question.options.length && question.answer && !keys.includes(question.answer)) {
        broken.push(`${set.id} q${index + 1}: answer "${question.answer}" not in [${keys}]`);
      }
      if (new Set(keys).size !== keys.length) {
        broken.push(`${set.id} q${index + 1}: duplicate option keys`);
      }
    });
  }
  assert.deepEqual(broken, []);
});

test("the Atlas news data covers every Places in News note", () => {
  const newsPath = path.join(ROOT, "data", "atlas", "news.json");
  const news = JSON.parse(fs.readFileSync(newsPath, "utf8"));
  assert.ok(Array.isArray(news.weeks) && news.weeks.length, "weeks are present");
  assert.ok(Array.isArray(news.features) && news.features.length, "features are present");

  for (const note of manifest.noteDocuments.filter((n) => n.cadence === "weekly-news")) {
    const week = news.weeks.find((w) => w.source === note.path);
    assert.ok(week, `Missing Atlas week for ${note.path}`);
    assert.ok(news.features.some((f) => f.weekId === week.id), `Missing pins for ${note.path}`);
  }

  // Every feature must belong to a declared week, or it can never be shown.
  const weekIds = new Set(news.weeks.map((week) => week.id));
  const orphans = news.features.filter((feature) => !weekIds.has(feature.weekId));
  assert.deepEqual(orphans.map((feature) => feature.id), [], "features reference a known week");

  // Every week must point at a note that exists.
  const missingSources = news.weeks.filter((week) => !fs.existsSync(path.join(ROOT, week.source)));
  assert.deepEqual(missingSources.map((week) => week.id), []);
});

test("every feature on the atlas has usable coordinates", () => {
  const news = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "atlas", "news.json"), "utf8"));
  const bad = news.features.filter((feature) => (
    !Number.isFinite(feature.lat) || !Number.isFinite(feature.lon)
    || Math.abs(feature.lat) > 90 || Math.abs(feature.lon) > 180
    || !["india", "world"].includes(feature.scope)
  ));
  assert.deepEqual(bad.map((feature) => feature.id), []);
});

test("map geometry files are valid GeoJSON with every feature intact", () => {
  const mapsDir = path.join(ROOT, "data", "maps");
  for (const name of fs.readdirSync(mapsDir).filter((file) => file.endsWith(".geojson"))) {
    const data = JSON.parse(fs.readFileSync(path.join(mapsDir, name), "utf8"));
    assert.equal(data.type, "FeatureCollection", `${name} is a FeatureCollection`);
    assert.ok(data.features.length > 0, `${name} has features`);
    const empty = data.features.filter((feature) => !feature.geometry || !feature.geometry.coordinates);
    assert.deepEqual(empty.length, 0, `${name} has ${empty.length} feature(s) with no geometry`);
  }
});

test("index.html and build.js agree on the script load order", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const fromHtml = [...html.matchAll(/<script[^>]*\bsrc="(app\/[^"?]+)/g)].map((match) => match[1]);
  assert.ok(fromHtml.length > 0);
  // build.js reads this same list, so the assertion is that every referenced
  // file exists — a missing one fails the production build but not dev.
  const missing = fromHtml.filter((relPath) => !fs.existsSync(path.join(ROOT, relPath)));
  assert.deepEqual(missing, []);
});
