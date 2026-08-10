/* Search index generation and the client-side query path.
 *
 * The generator (node) and the client (browser) each carry their own copy of
 * the tokenizer because they run in different places. If they ever disagree, a
 * query silently stops matching the terms that were indexed — so the agreement
 * between them is asserted here directly.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { loadBrowserModule, ROOT } = require("./helpers");
const generator = require("../scripts/generate_search_index");

const { window: searchWindow } = loadBrowserModule("app/search.js");
const client = searchWindow.UPSC_SEARCH;

const SAMPLES = [
  "Ramsar wetlands and the Glaw Lake designation",
  "India's GDP grew 7.8 per cent in 2025",
  "Directive Principles of State Policy",
  "SUSTAINABLE development report 2026 — SDSN",
  "policies policy studies study buses bus classes class",
  "the and of a an   ",
  "G20 UPI RBI WTO",
  "Kanlaon volcano erupts; Mindanao earthquake",
];

test("the generator and the client tokenize identically", () => {
  for (const sample of SAMPLES) {
    assert.deepEqual(
      client.tokenize(sample),
      generator.tokenize(sample),
      `tokenizers disagree on: ${sample}`,
    );
  }
});

test("the generator and the client stem identically", () => {
  const words = ["policies", "policy", "buses", "bus", "classes", "class", "address", "status",
    "wetlands", "wetland", "series", "analysis", "crisis", "cities", "city"];
  for (const word of words) {
    assert.equal(client.stem(word), generator.stem(word), `stemmers disagree on: ${word}`);
  }
});

test("stemming merges plurals but leaves short words and -ss/-us endings alone", () => {
  assert.equal(generator.stem("wetlands"), "wetland");
  assert.equal(generator.stem("cities"), "city");
  assert.equal(generator.stem("gas"), "gas", "too short to strip");
  assert.equal(generator.stem("address"), "address", "-ss is not a plural");
  assert.equal(generator.stem("status"), "status", "-us is not a plural");
});

test("tokenize drops stopwords, bare numbers and very short tokens", () => {
  const tokens = generator.tokenize("The RBI cut the repo rate by 25 in 2026 and it is a big deal");
  assert.ok(!tokens.includes("the"));
  assert.ok(!tokens.includes("25"));
  assert.ok(!tokens.includes("2026"));
  assert.ok(tokens.includes("rbi"));
  assert.ok(tokens.includes("repo"));
});

test("the index round-trips: every note is findable by a term from its body", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pariksha-search-"));
  const notesDir = path.join(dir, "notes");
  fs.mkdirSync(notesDir, { recursive: true });
  fs.writeFileSync(path.join(notesDir, "a.md"), "# Alpha\nThe Pamba river flooded Pathanamthitta district.");
  fs.writeFileSync(path.join(notesDir, "b.md"), "# Beta\nGlaw Lake became a Ramsar site in Arunachal Pradesh.");
  fs.writeFileSync(path.join(notesDir, "c.md"), "# Gamma\nThe Kanlaon volcano remained at alert level two.");

  const manifest = {
    noteDocuments: [
      { id: "a", cadence: "daily", title: "Alpha", shortTitle: "", date: "2026-08-01", path: "notes/a.md" },
      { id: "b", cadence: "daily", title: "Beta", shortTitle: "", date: "2026-08-02", path: "notes/b.md" },
      { id: "c", cadence: "weekly-news", title: "Gamma", shortTitle: "", date: "2026-07-30", path: "notes/c.md" },
    ],
  };
  const index = generator.buildSearchIndex(dir, manifest);

  // Sharded by month: August and July.
  assert.deepEqual(index.shards.map((shard) => shard.key), ["2026-08", "2026-07"]);

  const august = index.shards[0];
  assert.equal(august.docs.length, 2);
  assert.ok(august.terms.pamba, "a body term is indexed");
  assert.ok(august.terms.ramsar, "a body term from the second note is indexed");

  // Delta decoding must recover the original document ids.
  const expand = (deltas) => { let n = 0; return deltas.map((d) => (n += d)); };
  assert.deepEqual(expand(august.terms.pamba).map((i) => august.docs[i].i), ["a"]);
  assert.deepEqual(expand(august.terms.ramsar).map((i) => august.docs[i].i), ["b"]);

  const july = index.shards[1];
  assert.deepEqual(expand(july.terms.kanlaon).map((i) => july.docs[i].i), ["c"]);

  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
});

test("writeSearchIndex emits one file per shard plus a hashed manifest", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pariksha-shards-"));
  const notesDir = path.join(dir, "notes");
  fs.mkdirSync(notesDir, { recursive: true });
  fs.writeFileSync(path.join(notesDir, "a.md"), "Cyclone Remal made landfall over the Sundarbans.");
  const manifest = {
    noteDocuments: [{ id: "a", cadence: "daily", title: "Alpha", shortTitle: "", date: "2026-08-01", path: "notes/a.md" }],
  };
  const outDir = path.join(dir, "out");
  const written = generator.writeSearchIndex(outDir, dir, generator.buildSearchIndex(dir, manifest));

  assert.equal(written.shards.length, 1);
  assert.equal(written.shards[0].key, "2026-08");
  assert.ok(written.shards[0].hash, "each shard carries a content hash for cache-busting");
  assert.ok(fs.existsSync(path.join(outDir, "2026-08.json")));
  assert.ok(fs.existsSync(path.join(outDir, "shards.json")));

  // Rebuilding with a different corpus must not leave the old shard behind.
  const second = generator.writeSearchIndex(outDir, dir, generator.buildSearchIndex(dir, {
    noteDocuments: [{ id: "a", cadence: "daily", title: "Alpha", shortTitle: "", date: "2026-09-01", path: "notes/a.md" }],
  }));
  assert.equal(second.shards[0].key, "2026-09");
  assert.ok(!fs.existsSync(path.join(outDir, "2026-08.json")), "stale shards are cleaned up");

  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
});

test("notes without a date land in the undated shard", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pariksha-undated-"));
  fs.writeFileSync(path.join(dir, "guide.md"), "Strategy for the CSAT paper.");
  const index = generator.buildSearchIndex(dir, {
    noteDocuments: [{ id: "g", cadence: "strategy", title: "Guide", shortTitle: "", date: "", path: "guide.md" }],
  });
  assert.deepEqual(index.shards.map((shard) => shard.key), ["undated"]);
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
});

test("the committed index is consistent with the notes on disk", () => {
  const shardsPath = path.join(ROOT, "config", "search", "shards.json");
  if (!fs.existsSync(shardsPath)) {
    // Generated by `npm run search-index`; skip when a checkout has not run it.
    return;
  }
  const manifest = JSON.parse(fs.readFileSync(shardsPath, "utf8"));
  assert.ok(manifest.shards.length > 0);
  for (const shard of manifest.shards) {
    const file = path.join(ROOT, "config", "search", shard.file);
    assert.ok(fs.existsSync(file), `${shard.file} is present`);
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    assert.equal(data.docs.length, shard.documents, `${shard.key} document count matches the manifest`);
    for (const doc of data.docs) {
      assert.ok(fs.existsSync(path.join(ROOT, doc.p)), `indexed note still exists: ${doc.p}`);
    }
  }
});
