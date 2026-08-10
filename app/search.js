// Full-text note search over the sharded index built by
// scripts/generate_search_index.js.
//
// Shards are per-month and content-hashed, so only the current month's shard is
// ever re-downloaded; earlier months stay in the browser cache indefinitely.
// The newest shards are loaded first and older ones only on request, which
// keeps a year of notes from turning every search into a multi-megabyte fetch.
(function () {
  const SHARD_MANIFEST_PATH = "config/search/shards.json";
  const DEFAULT_SHARD_BUDGET = 4;

  // Must mirror scripts/generate_search_index.js exactly, or a query will not
  // match the terms that were indexed. test/search.test.js asserts they agree.
  const STOPWORDS = new Set(`a about above after again against all also am an and any are as at be because been
before being below between both but by can cannot could did do does doing down during each few for from further had
has have having he her here hers herself him himself his how i if in into is it its itself just me more most my
myself no nor not of off on once only or other our ours ourselves out over own same she should so some such than
that the their theirs them themselves then there these they this those through to too under until up very was we
were what when where which while who whom why will with would you your yours yourself yourselves via etc per may
must shall might upon within without among across since given many much such one two three first second new used
use using including include includes based due since often across around towards toward however therefore thus
also read note notes point points key exam angle hook fact statement statements correct incorrect option options
answer question questions`.split(/\s+/).filter(Boolean));

  const MIN_TERM_LENGTH = 3;
  const MAX_TERM_LENGTH = 24;

  function stem(token) {
    if (token.length <= 4) return token;
    if (token.endsWith("ies") && token.length > 5) return `${token.slice(0, -3)}y`;
    if (token.endsWith("sses")) return token.slice(0, -2);
    if (token.endsWith("es") && token.length > 5 && /(sh|ch|x|z|s)es$/.test(token)) return token.slice(0, -2);
    if (token.endsWith("s") && !token.endsWith("ss") && !token.endsWith("us")) return token.slice(0, -1);
    return token;
  }

  function tokenize(text) {
    const out = [];
    for (const raw of String(text).toLowerCase().split(/[^a-z0-9]+/)) {
      if (raw.length < MIN_TERM_LENGTH || raw.length > MAX_TERM_LENGTH) continue;
      if (STOPWORDS.has(raw) || /^\d+$/.test(raw)) continue;
      const token = stem(raw);
      if (token.length < MIN_TERM_LENGTH || STOPWORDS.has(token)) continue;
      out.push(token);
    }
    return out;
  }

  let shardManifestPromise = null;
  const shardCache = new Map();

  function shardManifest() {
    if (!shardManifestPromise) {
      const url = window.UPSC_SEARCH_URL || SHARD_MANIFEST_PATH;
      shardManifestPromise = fetch(url, window.UPSC_SEARCH_URL ? {} : { cache: "no-store" })
        .then((response) => (response.ok ? response.json() : { shards: [] }))
        .catch(() => ({ shards: [] }));
    }
    return shardManifestPromise;
  }

  function loadShard(entry) {
    if (!shardCache.has(entry.key)) {
      const url = `config/search/${entry.file}${entry.hash ? `?v=${entry.hash}` : ""}`;
      shardCache.set(entry.key, fetch(url)
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => (data ? { key: entry.key, docs: data.docs || [], terms: data.terms || {} } : null))
        .catch(() => null));
    }
    return shardCache.get(entry.key);
  }

  // Undo the delta encoding used by the generator.
  function expandPostings(deltas) {
    const out = [];
    let current = 0;
    for (const delta of deltas) {
      current += delta;
      out.push(current);
    }
    return out;
  }

  function searchShard(shard, terms, rawQuery) {
    const hits = new Map();
    for (const term of terms) {
      const postings = shard.terms[term];
      if (!postings) continue;
      for (const docIndex of expandPostings(postings)) {
        hits.set(docIndex, (hits.get(docIndex) || 0) + 1);
      }
    }
    const needle = rawQuery.trim().toLowerCase();
    const results = [];
    for (const [docIndex, matched] of hits) {
      const doc = shard.docs[docIndex];
      if (!doc) continue;
      const haystack = `${doc.t} ${doc.s}`.toLowerCase();
      // All query terms present beats a partial match; a title hit beats both.
      let score = matched * 10;
      if (matched === terms.length) score += 15;
      if (haystack.includes(needle)) score += 30;
      results.push({
        id: doc.i, cadence: doc.c, title: doc.t, shortTitle: doc.s, date: doc.d, path: doc.p,
        matched, score, terms,
      });
    }
    return results;
  }

  async function search(rawQuery, { limit = 12, budget = DEFAULT_SHARD_BUDGET, all = false } = {}) {
    const terms = [...new Set(tokenize(rawQuery))];
    const manifest = await shardManifest();
    const entries = manifest.shards || [];
    if (!terms.length || !entries.length) {
      return { results: [], terms, loadedShards: 0, totalShards: entries.length, hasMore: false };
    }
    const selected = all ? entries : entries.slice(0, budget);
    const shards = (await Promise.all(selected.map(loadShard))).filter(Boolean);
    const results = [];
    for (const shard of shards) results.push(...searchShard(shard, terms, rawQuery));
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return String(b.date || "").localeCompare(String(a.date || ""));
    });
    return {
      results: results.slice(0, limit),
      terms,
      loadedShards: shards.length,
      totalShards: entries.length,
      hasMore: !all && entries.length > selected.length,
    };
  }

  // Snippets are not stored in the index; the note body is fetched on demand
  // (and cached by the data layer) only for the handful of results on screen.
  async function snippetFor(result, radius = 90) {
    try {
      const { content } = await window.UPSC.loadNoteDocument(result.id);
      const plain = String(content)
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/[#*_>`|]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      const lower = plain.toLowerCase();
      let at = -1;
      for (const term of result.terms) {
        const found = lower.indexOf(term);
        if (found !== -1 && (at === -1 || found < at)) at = found;
      }
      if (at === -1) return plain.slice(0, radius * 2).trim();
      const start = Math.max(0, at - radius);
      const end = Math.min(plain.length, at + radius);
      return `${start > 0 ? "… " : ""}${plain.slice(start, end).trim()}${end < plain.length ? " …" : ""}`;
    } catch (error) {
      return "";
    }
  }

  // Used by the offline save so search keeps working with no connection.
  async function shardUrls() {
    const manifest = await shardManifest();
    return (manifest.shards || []).map((entry) => `config/search/${entry.file}${entry.hash ? `?v=${entry.hash}` : ""}`);
  }

  Object.assign(window, {
    UPSC_SEARCH: { search, snippetFor, tokenize, stem, shardUrls },
  });
})();
