/* Build-time generators: the service worker and the content-validation rules. */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { ROOT } = require("./helpers");
const { serviceWorkerSource } = require("../scripts/generate_service_worker");
const { unscoreableSetIds } = require("../scripts/validate_content");

test("the generated service worker is syntactically valid and version-stamped", () => {
  const source = serviceWorkerSource({ version: "abc123", precache: ["index.html", "app/app.bundle.js?v=abc123"] });
  // Throws on a syntax error without executing anything.
  assert.doesNotThrow(() => new Function(source));
  assert.match(source, /const VERSION = "abc123"/);
  assert.match(source, /pariksha-shell-/);
  assert.ok(source.includes('"index.html"'), "the shell list is embedded");
});

test("a new build version produces a different shell cache name", () => {
  const a = serviceWorkerSource({ version: "aaa", precache: [] });
  const b = serviceWorkerSource({ version: "bbb", precache: [] });
  assert.notEqual(a, b, "the worker changes when the bundle changes, so clients update");
});

test("the service worker keeps hashed and content URLs in separate caches", () => {
  const source = serviceWorkerSource({ version: "v", precache: [] });
  // Both the fetch handler and the offline-save handler must route through the
  // same helper, or a saved file is written where it will never be looked up.
  assert.match(source, /function cacheNameFor/);
  assert.match(source, /cacheNameFor\(new URL\(url, self\.location\.origin\)\)/);
});

test("unscoreableSetIds flags a set with no answer keys and passes a good one", (t) => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pariksha-scoreable-"));
  const cwd = process.cwd();
  process.chdir(dir);
  t.after(() => { process.chdir(cwd); fs.rmSync(dir, { recursive: true, force: true }); });

  fs.writeFileSync(path.join(dir, "good.json"), JSON.stringify([
    { question: "Q1", options: ["(a) x", "(b) y"], answer: "(a)" },
  ]));
  fs.writeFileSync(path.join(dir, "bad.json"), JSON.stringify([
    { question: "Q1", options: ["(a) x", "(b) y"] },
    { question: "Q2", options: ["(a) x", "(b) y"] },
  ]));
  fs.writeFileSync(path.join(dir, "empty.json"), "[]");

  // unscoreableSetIds resolves paths against the repository root, so point the
  // fixture paths back at the temp directory via an absolute-ish relative path.
  const relative = path.relative(ROOT, dir);
  const flagged = unscoreableSetIds({
    questionSets: [
      { id: "good", path: path.join(relative, "good.json") },
      { id: "bad", path: path.join(relative, "bad.json") },
      { id: "empty", path: path.join(relative, "empty.json") },
      { id: "gone", path: path.join(relative, "missing.json") },
    ],
  });
  assert.deepEqual(
    flagged.map((item) => `${item.id}:${item.reason}`).sort(),
    ["bad:no answer keys", "empty:empty", "gone:unreadable"],
  );
});

test("a question marked dropped does not make a set look unscoreable on its own", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "pariksha-dropped-"));
  const file = path.join(dir, "set.json");
  fs.writeFileSync(file, JSON.stringify([
    { question: "Retired", options: ["(a) x"], answer_option: "", verification_status: "dropped" },
    { question: "Live", options: ["(a) x", "(b) y"], answer_option: "b" },
  ]));
  const flagged = unscoreableSetIds({ questionSets: [{ id: "s", path: path.relative(ROOT, file) }] });
  assert.deepEqual(flagged, []);
  fs.rmSync(dir, { recursive: true, force: true });
});

test("the production build output is complete", () => {
  const dist = path.join(ROOT, "dist");
  assert.ok(fs.existsSync(dist), "Run npm run check to build and test the deployment artifact");
  for (const required of ["index.html", "sw.js", "manifest.webmanifest", "favicon.svg",
    "app/app.bundle.js", "app/styles.css", "config/content_manifest.json", "config/search/shards.json"]) {
    assert.ok(fs.existsSync(path.join(dist, required)), `dist/${required} is missing`);
  }
  const html = fs.readFileSync(path.join(dist, "index.html"), "utf8");
  assert.ok(!html.includes("unpkg.com"), "no third-party script hosts in the production page");
  assert.match(html, /serviceWorker/, "the service worker is registered");
  assert.match(html, /rel="manifest"/, "the web app manifest is linked");
});
