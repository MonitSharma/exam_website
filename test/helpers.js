/* Shared harness for loading browser modules under node:test. */

const path = require("path");
const { runBrowserModule, ROOT } = require("../scripts/load_app_data");

// Minimal localStorage stand-in so app/progress.js can be exercised directly.
function createLocalStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => { store.set(key, String(value)); },
    removeItem: (key) => { store.delete(key); },
    clear: () => store.clear(),
    get length() { return store.size; },
    key: (index) => [...store.keys()][index] ?? null,
    _dump: () => Object.fromEntries(store),
  };
}

function loadBrowserModule(relPath, { window: windowExtras = {}, localStorage } = {}) {
  const storage = localStorage || createLocalStorage();
  const windowStub = { localStorage: storage, ...windowExtras };
  runBrowserModule(relPath, windowStub);
  return { window: windowStub, localStorage: storage };
}

module.exports = { ROOT, createLocalStorage, loadBrowserModule, path };
