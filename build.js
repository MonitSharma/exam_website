// Production build for GitHub Pages.
//   - transforms app/*.jsx with esbuild (no Babel-in-browser)
//   - concatenates into a single app.bundle.js (preserving load order)
//   - swaps the dev React CDN for the production build
//   - copies static content (data/, notes folders, weekly/, monthly/, etc.) into dist/
//
// Local dev still uses index.html with babel-in-browser, untouched.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const esbuild = require("esbuild");
const { buildContentManifest } = require("./scripts/generate_content_manifest");
const { unscoreableSetIds } = require("./scripts/validate_content");
const { writeSearchIndex } = require("./scripts/generate_search_index");
const { writeServiceWorker } = require("./scripts/generate_service_worker");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
const MANIFEST_REL = "config/content_manifest.json";
let contentManifest = null;

// Load order matters — these files attach to window globals and rely on each
// other (data → shared → screens → root). Rather than duplicating the list,
// it is read from index.html so dev and production can never drift apart.
function readSources() {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const sources = [...html.matchAll(/<script[^>]*\bsrc="(app\/[^"?]+)/g)].map((match) => match[1]);
  if (!sources.length) throw new Error("No app/* script tags found in index.html.");
  const missing = sources.filter((relPath) => !fs.existsSync(path.join(ROOT, relPath)));
  if (missing.length) throw new Error(`index.html references missing files: ${missing.join(", ")}`);
  return sources;
}

// Directories / files copied verbatim into dist/
const STATIC_PATHS = [
  "data",
  "daily",
  "anki",
  "weekly",
  "monthly",
  "reference",
  "fodder",
  "generated_data",
  "generated_questions",
  "config",
  "vendor",
  "CSAT_Strategy_Guide.md",
  "favicon.svg",
  "icon-maskable.svg",
  "manifest.webmanifest",
];

// Nothing in the app fetches these; they are ~1 MB of source data kept in the
// repo for offline analysis, so they stay out of the deployed site.
const STATIC_EXCLUDES = [
  "generated_questions/unified_dataset.json",
  "generated_questions/unified_dataset.csv",
  // Retained upstream source variant; the app only fetches the India POV file.
  "data/maps/world_countries.geojson",
  // Development React builds are for index.html's Babel-in-browser loop only.
  "vendor/react/react.development.js",
  "vendor/react/react-dom.development.js",
  "vendor/react/README.md",
];

function clean() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  fs.mkdirSync(path.join(DIST, "app"), { recursive: true });
}

function hashOf(contents) {
  return crypto.createHash("sha256").update(contents).digest("hex").slice(0, 12);
}

// The manifest grows with every scheduled content drop, so it is served as a
// separate, content-hashed file the browser can cache indefinitely instead of
// being inlined into the bundle (which forced a re-download of everything on
// every content change) and re-fetched with `no-store` on every page load.
function writeManifest() {
  const json = JSON.stringify(contentManifest);
  const outPath = path.join(DIST, MANIFEST_REL);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, json, "utf8");
  return { url: `${MANIFEST_REL}?v=${hashOf(json)}`, bytes: json.length };
}

// Per-month search shards. Only the current month changes day to day, so the
// rest stay in the browser cache; the shard manifest carries each shard's hash.
function writeSearch() {
  const outDir = path.join(DIST, "config", "search");
  const written = writeSearchIndex(outDir, ROOT);
  const payload = JSON.stringify(written);
  const bytes = written.shards.reduce((sum, shard) => sum + shard.bytes, 0);
  return { url: `config/search/shards.json?v=${hashOf(payload)}`, shards: written.shards.length, bytes };
}

function bundleApp(manifestUrl, searchUrl, sources) {
  const prelude = `window.UPSC_MANIFEST_URL=${JSON.stringify(manifestUrl)};window.UPSC_SEARCH_URL=${JSON.stringify(searchUrl)};`;
  const chunks = [prelude].concat(sources.map((relPath) => {
    const abs = path.join(ROOT, relPath);
    const code = fs.readFileSync(abs, "utf8");
    const loader = relPath.endsWith(".jsx") ? "jsx" : "js";
    const result = esbuild.transformSync(code, {
      loader,
      target: ["es2020"],
      minify: true,
      sourcemap: false,
      // Files use bare `React.useState` / JSX, no imports. The default JSX
      // transform calls `React.createElement` which matches the global on
      // window.React from the CDN.
      jsx: "transform",
    });
    return `/* ${relPath} */\n${result.code}`;
  }));
  fs.writeFileSync(path.join(DIST, "app", "app.bundle.js"), chunks.join("\n;"));
}

function copyStylesAndHtml(manifestUrl) {
  const css = fs.readFileSync(path.join(ROOT, "app", "styles.css"), "utf8");
  const minifiedCss = esbuild.transformSync(css, { loader: "css", minify: true }).code;
  fs.writeFileSync(path.join(DIST, "app", "styles.css"), minifiedCss);

  const assetVersion = (relativePath) => hashOf(fs.readFileSync(path.join(DIST, relativePath)));
  const bundleVersion = assetVersion("app/app.bundle.js");
  const stylesVersion = assetVersion("app/styles.css");
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pariksha - UPSC Practice Platform</title>
  <meta name="description" content="Free UPSC CSE practice: a decade of previous-year papers, daily current-affairs quizzes, CSAT drills and an interactive news atlas. No login, scores stay on your device.">
  <meta name="theme-color" content="#1d4032">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="preload" as="fetch" href="${manifestUrl}" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="vendor/katex/katex.min.css">
  <link rel="stylesheet" href="vendor/leaflet/leaflet.css">
  <link rel="stylesheet" href="app/styles.css?v=${stylesVersion}">
</head>
<body data-vibe="academic" data-qfont="serif" data-density="regular">
  <div id="root"></div>
  <script src="vendor/react/react.production.min.js"></script>
  <script src="vendor/react/react-dom.production.min.js"></script>
  <script src="vendor/katex/katex.min.js"></script>
  <script src="vendor/leaflet/leaflet.js"></script>
  <script src="app/app.bundle.js?v=${bundleVersion}"></script>
  <script>
    // Registered only in the production build: the dev server deliberately
    // serves everything no-store so edits show up on reload.
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  </script>
</body>
</html>
`;
  fs.writeFileSync(path.join(DIST, "index.html"), html);
  return { cssBytes: minifiedCss.length, cssSourceBytes: css.length, bundleVersion, stylesVersion };
}

function copyStatic() {
  const excluded = new Set(STATIC_EXCLUDES.map((name) => path.join(ROOT, name)));
  for (const name of STATIC_PATHS) {
    const src = path.join(ROOT, name);
    if (!fs.existsSync(src)) continue;
    fs.cpSync(src, path.join(DIST, name), {
      recursive: true,
      filter: (from) => !excluded.has(from),
    });
  }
}

// The manifest can reference files outside STATIC_PATHS — root-level notes such
// as Ethics_Case_*.md, for instance — which then 404 on the deployed site. Copy
// anything the manifest points at that the static copy missed.
function copyManifestReferences() {
  const referenced = [
    ...contentManifest.noteDocuments.map((note) => note.path),
    ...contentManifest.questionSets.map((set) => set.path),
  ];
  const copied = [];
  for (const relPath of new Set(referenced)) {
    if (!relPath) continue;
    const src = path.join(ROOT, relPath);
    const dest = path.join(DIST, relPath);
    if (fs.existsSync(dest)) continue;
    if (!fs.existsSync(src)) {
      console.warn(`  manifest references a missing file: ${relPath}`);
      continue;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    copied.push(relPath);
  }
  if (copied.length) console.log(`  copied ${copied.length} manifest-referenced file(s) outside STATIC_PATHS`);
}

// app/data.js carries a hardcoded snapshot used only when the manifest fetch
// fails. It is invisible in normal use, so a content reshuffle can silently
// break it; three of its paths had already rotted before this check existed.
function validateFallbackPaths() {
  const source = fs.readFileSync(path.join(ROOT, "app", "data.js"), "utf8");
  const paths = [...source.matchAll(/path: "([^"]+)"/g)].map((match) => match[1]);
  const missing = paths.filter((relPath) => !fs.existsSync(path.join(ROOT, relPath)));
  if (missing.length) {
    throw new Error(`app/data.js fallback paths point at missing files:\n  ${missing.join("\n  ")}`);
  }
}

// A scheduled generation that produced questions but no answer keys yields a
// quiz nobody can be scored on. Shipping it is worse than omitting it, so it is
// dropped from the manifest and reported loudly enough to be fixed.
function dropUnscoreableSets() {
  const bad = unscoreableSetIds(contentManifest);
  if (!bad.length) return;
  const dropped = new Set(bad.map((item) => item.id));
  contentManifest.questionSets = contentManifest.questionSets.filter((set) => !dropped.has(set.id));
  console.warn(`  ${bad.length} question set(s) excluded — regenerate these:`);
  for (const item of bad) console.warn(`    ${item.path} (${item.reason})`);
}

function validateAtlasNewsCoverage() {
  const weeklyNewsDir = path.join(ROOT, "weekly", "weekly_news");
  const atlasNews = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "atlas", "news.json"), "utf8"));
  const noteDates = fs.readdirSync(weeklyNewsDir)
    .map((name) => name.match(/^Places_in_News_(\d{4}-\d{2}-\d{2})\.md$/)?.[1])
    .filter(Boolean);
  const mappedWeeks = atlasNews.weeks.map((week) => week.id);
  const mappedFeatureWeeks = new Set(atlasNews.features.map((feature) => feature.weekId));
  const missingWeeks = noteDates.filter((date) => !mappedWeeks.includes(date));
  const missingFeatures = noteDates.filter((date) => !mappedFeatureWeeks.has(date));
  if (missingWeeks.length || missingFeatures.length) {
    console.warn([
      "Atlas coverage warning (the site will still build):",
      missingWeeks.length ? `Atlas week entries missing for: ${missingWeeks.join(", ")}` : "",
      missingFeatures.length ? `Atlas feature entries missing for: ${missingFeatures.join(", ")}` : "",
    ].filter(Boolean).join(" "));
  }
}

function run() {
  console.log("Building production bundle into dist/");
  contentManifest = buildContentManifest(ROOT);
  dropUnscoreableSets();
  validateFallbackPaths();
  validateAtlasNewsCoverage();
  const sources = readSources();
  clean();
  copyStatic();
  const manifest = writeManifest();
  const search = writeSearch();
  bundleApp(manifest.url, search.url, sources);
  const styles = copyStylesAndHtml(manifest.url);
  copyManifestReferences();

  // The shell is everything needed to open the app with no network at all.
  const shell = [
    "index.html",
    `app/app.bundle.js?v=${styles.bundleVersion}`,
    `app/styles.css?v=${styles.stylesVersion}`,
    manifest.url,
    search.url,
    "manifest.webmanifest",
    "favicon.svg",
    "vendor/react/react.production.min.js",
    "vendor/react/react-dom.production.min.js",
    "vendor/katex/katex.min.css",
    "vendor/katex/katex.min.js",
    "vendor/leaflet/leaflet.css",
    "vendor/leaflet/leaflet.js",
  ];
  const worker = writeServiceWorker(DIST, { version: styles.bundleVersion, precache: shell });
  const bundleBytes = fs.statSync(path.join(DIST, "app", "app.bundle.js")).size;
  const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
  console.log(`  app.bundle.js:  ${kb(bundleBytes)} (${sources.length} sources)`);
  console.log(`  styles.css:     ${kb(styles.cssBytes)} (minified from ${kb(styles.cssSourceBytes)})`);
  console.log(`  ${MANIFEST_REL}: ${kb(manifest.bytes)}, cache-busted as ?v=${manifest.url.split("=")[1]}`);
  console.log(`  search index:   ${kb(search.bytes)} across ${search.shards} monthly shards`);
  console.log(`  sw.js:          ${kb(worker.bytes)}, precaching ${worker.precached} shell assets`);
  console.log("Done.");
}

run();
