// Production build for GitHub Pages.
//   - transforms app/*.jsx with esbuild (no Babel-in-browser)
//   - concatenates into a single app.bundle.js (preserving load order)
//   - swaps the dev React CDN for the production build
//   - copies static content (data/, notes folders, weekly/, monthly/, etc.) into dist/
//
// Local dev still uses index.html with babel-in-browser, untouched.

const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const { buildContentManifest, writeManifestFile } = require("./scripts/generate_content_manifest");

const ROOT = __dirname;
const DIST = path.join(ROOT, "dist");
let contentManifest = null;

// Load order matters — these files attach to window globals and rely on each
// other (data → shared → screens → root). Same order as index.html script tags.
const SOURCES = [
  "app/data.js",
  "app/shared.jsx",
  "app/tweaks-panel.jsx",
  "app/home.jsx",
  "app/practice.jsx",
  "app/test.jsx",
  "app/results.jsx",
  "app/dashboard.jsx",
  "app/workflow.jsx",
  "app/root.jsx",
];

// Directories / files copied verbatim into dist/
const STATIC_PATHS = [
  "data",
  "daily_current_affairs",
  "daily_reading_comprehension",
  "weekly",
  "monthly",
  "generated_questions",
  "config",
  "CSAT_Strategy_Guide.md",
];

function clean() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  fs.mkdirSync(path.join(DIST, "app"), { recursive: true });
}

function bundleApp() {
  const manifestPrelude = `window.UPSC_CONTENT_MANIFEST=${JSON.stringify(contentManifest || {})};`;
  const chunks = [manifestPrelude].concat(SOURCES.map((relPath) => {
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

function copyStylesAndHtml() {
  fs.copyFileSync(
    path.join(ROOT, "app", "styles.css"),
    path.join(DIST, "app", "styles.css"),
  );

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pariksha - UPSC Practice Platform</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css" crossorigin="anonymous">
  <link rel="stylesheet" href="app/styles.css">
</head>
<body data-vibe="academic" data-qfont="serif" data-density="regular">
  <div id="root"></div>
  <script src="https://unpkg.com/react@18.3.1/umd/react.production.min.js" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js" crossorigin="anonymous"></script>
  <script src="app/app.bundle.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(DIST, "index.html"), html);
}

function copyStatic() {
  for (const name of STATIC_PATHS) {
    const src = path.join(ROOT, name);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(DIST, name);
    fs.cpSync(src, dest, { recursive: true });
  }
  writeManifestFile(path.join(DIST, "config", "content_manifest.json"), ROOT, contentManifest);
}

function run() {
  console.log("Building production bundle into dist/");
  contentManifest = buildContentManifest(ROOT);
  clean();
  bundleApp();
  copyStylesAndHtml();
  copyStatic();
  const bundlePath = path.join(DIST, "app", "app.bundle.js");
  const bytes = fs.statSync(bundlePath).size;
  console.log(`  app.bundle.js: ${(bytes / 1024).toFixed(1)} KB`);
  console.log("Done.");
}

run();
