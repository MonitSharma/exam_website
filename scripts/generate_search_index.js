#!/usr/bin/env node
/* Build the full-text search index over every note in the content manifest.
 *
 * The app previously searched note titles only, which stops being useful once
 * there are hundreds of briefings. This produces a compact inverted index that
 * the client fetches lazily the first time the search palette is opened.
 *
 * Snippets are deliberately NOT stored: the note body is fetched (and cached)
 * on demand when a result is shown, which keeps the index an order of magnitude
 * smaller than embedding surrounding text for every posting.
 *
 * Usage: node scripts/generate_search_index.js [outfile]
 */

const fs = require("fs");
const path = require("path");
const { buildContentManifest } = require("./generate_content_manifest");

const ROOT = path.resolve(__dirname, "..");

// Common English + boilerplate that appears in nearly every briefing. Terms
// this frequent cost space and rank nothing.
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
// A term in almost every document cannot discriminate between them.
const MAX_DOCUMENT_FRACTION = 0.4;

// A deliberately conservative suffix stripper. It merges the plural/tense
// variants that otherwise triple the term count, and must be applied
// identically to the query at search time (app/search.js mirrors it).
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
  // Keep intra-word digits (e.g. "g20", "article370") but split everything else.
  for (const raw of String(text).toLowerCase().split(/[^a-z0-9]+/)) {
    if (raw.length < MIN_TERM_LENGTH || raw.length > MAX_TERM_LENGTH) continue;
    if (STOPWORDS.has(raw) || /^\d+$/.test(raw)) continue;
    const token = stem(raw);
    if (token.length < MIN_TERM_LENGTH || STOPWORDS.has(token)) continue;
    out.push(token);
  }
  return out;
}

// Markdown decoration adds noise to the index without adding meaning.
function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, " ")
    .replace(/[*_>|~-]+/g, " ");
}

// The index is split by note month. Content lands daily, so a single index file
// would be invalidated every single day and re-downloaded in full. Sharded,
// only the current month's shard changes; every earlier shard stays in the
// browser cache for good, and adding a year of content adds twelve small files
// instead of inflating one big one.
function shardKeyFor(note) {
  const month = String(note.date || "").slice(0, 7);
  return /^\d{4}-\d{2}$/.test(month) ? month : "undated";
}

function buildShard(root, notes) {
  const docs = [];
  const postings = new Map();
  for (const note of notes) {
    let body = "";
    try {
      body = fs.readFileSync(path.join(root, note.path), "utf8");
    } catch (error) {
      continue;
    }
    const docIndex = docs.length;
    docs.push({
      i: note.id,
      c: note.cadence,
      t: note.title,
      s: note.shortTitle || "",
      d: note.date || "",
      p: note.path,
    });
    // Presence only, no term frequency: storing counts doubled the index for a
    // ranking signal the client can approximate from title matches instead.
    const seen = new Set(tokenize(`${note.title} ${note.shortTitle || ""} ${stripMarkdown(body)}`));
    for (const term of seen) {
      if (!postings.has(term)) postings.set(term, []);
      postings.get(term).push(docIndex);
    }
  }

  const maxDocs = Math.max(4, Math.floor(docs.length * MAX_DOCUMENT_FRACTION));
  const terms = {};
  let dropped = 0;
  for (const [term, entries] of postings) {
    if (entries.length > maxDocs) {
      dropped++;
      continue;
    }
    // Delta-encode document ids: postings are appended in ascending order, so
    // gaps are small integers and the JSON compresses well.
    let previous = 0;
    const deltas = [];
    for (const docIndex of entries) {
      deltas.push(docIndex - previous);
      previous = docIndex;
    }
    terms[term] = deltas;
  }
  return { docs, terms, dropped };
}

function buildSearchIndex(root = ROOT, manifest = buildContentManifest(root)) {
  const byShard = new Map();
  for (const note of manifest.noteDocuments) {
    const key = shardKeyFor(note);
    if (!byShard.has(key)) byShard.set(key, []);
    byShard.get(key).push(note);
  }
  // Newest first so the client can search recent months before older ones.
  const keys = [...byShard.keys()].sort((a, b) => b.localeCompare(a));
  const shards = keys.map((key) => ({ key, ...buildShard(root, byShard.get(key)) }));
  return { version: 2, shards };
}

function writeSearchIndex(outDir, root = ROOT, index = buildSearchIndex(root)) {
  fs.mkdirSync(outDir, { recursive: true });
  // Remove stale shards so a renamed or emptied month cannot linger.
  for (const name of fs.readdirSync(outDir)) {
    if (name.endsWith(".json")) fs.rmSync(path.join(outDir, name));
  }
  const entries = [];
  for (const shard of index.shards) {
    const payload = JSON.stringify({ docs: shard.docs, terms: shard.terms });
    const file = `${shard.key}.json`;
    fs.writeFileSync(path.join(outDir, file), payload, "utf8");
    entries.push({
      key: shard.key,
      file,
      documents: shard.docs.length,
      terms: Object.keys(shard.terms).length,
      bytes: Buffer.byteLength(payload),
      hash: require("crypto").createHash("sha256").update(payload).digest("hex").slice(0, 12),
    });
  }
  const manifestPayload = { version: index.version, shards: entries };
  fs.writeFileSync(path.join(outDir, "shards.json"), JSON.stringify(manifestPayload), "utf8");
  return manifestPayload;
}

if (require.main === module) {
  const outArg = process.argv[2] || path.join(ROOT, "config", "search");
  const outDir = path.resolve(process.cwd(), outArg);
  const written = writeSearchIndex(outDir, ROOT);
  const total = written.shards.reduce((sum, shard) => sum + shard.bytes, 0);
  const docs = written.shards.reduce((sum, shard) => sum + shard.documents, 0);
  console.log(`wrote ${path.relative(ROOT, outDir)}/ — ${written.shards.length} shards, ${docs} notes, ${(total / 1024).toFixed(1)} KB total`);
  for (const shard of written.shards) {
    console.log(`  ${shard.key.padEnd(9)} ${String(shard.documents).padStart(4)} notes  ${(shard.bytes / 1024).toFixed(1)} KB`);
  }
}

module.exports = { buildSearchIndex, writeSearchIndex, tokenize, stem };
