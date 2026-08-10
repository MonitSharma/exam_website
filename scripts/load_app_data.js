#!/usr/bin/env node
/* Load app/data.js outside the browser.
 *
 * data.js is a browser IIFE that attaches window.UPSC. Executing it here lets
 * build scripts and tests use the real parsing code rather than a second copy
 * that can drift away from what users actually get.
 *
 * It is run through `new Function` in this realm rather than a vm context, so
 * the arrays and objects it returns share prototypes with the caller's — under
 * a vm context, assert.deepEqual fails on cross-realm prototypes alone.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function runBrowserModule(relPath, windowStub) {
  const source = fs.readFileSync(path.join(ROOT, relPath), "utf8");
  // `fetch` and `navigator` are passed as undefined so the module takes its
  // no-network branches deterministically; Node would otherwise supply real
  // ones and the module would try to load a relative URL.
  const factory = new Function(
    "window", "localStorage", "document", "fetch", "navigator", "self",
    `${source}\n//# sourceURL=${relPath}`,
  );
  factory(windowStub, windowStub.localStorage, undefined, undefined, undefined, undefined);
  return windowStub;
}

function loadAppData({ manifest = null } = {}) {
  const windowStub = {};
  runBrowserModule("app/data.js", windowStub);
  const api = windowStub.UPSC;
  if (!api) throw new Error("app/data.js did not attach window.UPSC");
  if (manifest) api.parsing.applyManifest(manifest);
  return api;
}

module.exports = { loadAppData, runBrowserModule, ROOT };
