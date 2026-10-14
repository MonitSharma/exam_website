const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const esbuild = require('esbuild');
const { ROOT } = require('./helpers');

const React = { Fragment: 'fragment', createElement: (type, props, ...children) => ({ type, props: props || {}, children }) };
const code = esbuild.transformSync(fs.readFileSync(path.join(ROOT, 'app/home.jsx'), 'utf8'), { loader: 'jsx' }).code;
const { MarkdownView, parseNoteHeadings, splitDailyCaFields, MathText, renderInline } = new Function('React', 'window', `${code}; return { MarkdownView, parseNoteHeadings, splitDailyCaFields, MathText, renderInline };`)(React, { UPSC_CONTENT: require('../app/content-model') });

function nodes(tree, type) {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap((child) => nodes(child, type));
  return [...(tree.type === type ? [tree] : []), ...nodes(tree.children, type)];
}
function text(tree) {
  if (tree == null || typeof tree === 'boolean') return '';
  if (typeof tree !== 'object') return String(tree);
  const value = (Array.isArray(tree) ? tree : tree.children).map(text).join('');
  return ['p', 'li', 'ul', 'ol', 'table', 'h2', 'h3', 'h4'].includes(tree.type) ? `${value}\n` : value;
}
const source = (date) => fs.readFileSync(path.join(ROOT, `daily/daily_current_affairs/UPSC_CA_${date}.md`), 'utf8');

function groups(tree) {
  return nodes(tree, 'ul').filter((node) => node.props.className === 'briefing-points');
}
function rows(group) { return group.children.flat(Infinity).filter((node) => node?.type === 'li'); }
function labels(group) { return rows(group).map((row) => text(nodes(row, 'strong')[0]).trim()); }

test('daily CA matches the plain bulleted reference, including the latest day', () => {
  for (const date of ['2026-10-11', '2026-10-12', '2026-10-14']) {
    const tree = MarkdownView({ text: source(date), cadence: 'daily' });
    assert.equal(nodes(tree, 'dl').length, 0, 'no boxed field rows');
    assert.equal(groups(tree).length, 5, date);
    for (const group of groups(tree)) {
      assert.deepEqual(labels(group), ['Exam angle:', 'Key facts:', 'Notebook:', 'Static anchor:']);
      assert.ok(text(rows(group)[3]).includes('Nudge:'), 'nudge stays in the static-anchor bullet');
    }
  }
  const quota = groups(MarkdownView({ text: source('2026-10-12'), cadence: 'daily' }))[0];
  assert.ok(text(rows(quota)[0]).includes('34% reservation'));
  assert.ok(text(rows(quota)[1]).includes('total (SC+ST+OBC) within 50%'));
  assert.ok(text(rows(quota)[3]).includes('Bihar 65% quota cases'));
});

test('bullets, consecutive lines and a single paragraph produce the same separate bullets', () => {
  const lines = ['**Exam angle:** Context with **emphasis**.', '**Memorise:** 50% and Article 243D(6).', '**Notebook:** GS2.', '**Static anchor:** Read [source](https://example.org/report). *Nudge:* Add a note.'];
  const variants = [lines.map((line) => `- ${line}`).join('\n'), lines.join('\n'), lines.join(' ')];
  const content = variants.map((variant) => groups(MarkdownView({ text: `### 1. Story\n${variant}`, cadence: 'daily' })).map((group) => rows(group).map(text)));
  assert.deepEqual(content[0], content[1]);
  assert.deepEqual(content[1], content[2]);
  assert.equal(content[0][0].length, 4);
});

test('older detailed fact lists, tables, citations and inline markup remain intact', () => {
  const old = MarkdownView({ text: source('2026-06-07'), cadence: 'daily' });
  const first = groups(old)[0];
  assert.deepEqual(labels(first), ['Headline:', 'Exam angle:', 'Key facts:', 'Notebook:', 'Static anchor:']);
  assert.equal(nodes(rows(first)[2], 'li').length, 4, 'three nested facts plus the outer bullet');
  const rich = '### Story\n**Exam angle.** See [official report](https://example.org/report_(2026)) and `Nudge: literal`.\n**Key facts / figures to memorise:**\n- **Repo:** 5.50%.\n- GDP: 7.1%.\n\n| Year | Rate |\n| --- | --- |\n| 2026 | 5.50% |\n\n$$x=2$$\n\n**Destination notebook.** GS3.\n**STATIC ANCHOR:** Text.\n> **Update nudge:** Revise.';
  const tree = MarkdownView({ text: rich, cadence: 'daily' });
  assert.deepEqual(labels(groups(tree)[0]), ['Exam angle:', 'Key facts:', 'Notebook:', 'Static anchor:']);
  assert.equal(nodes(tree, 'table').length, 1);
  assert.equal(nodes(tree, MathText)[0].props.value, 'x=2');
  assert.equal(nodes(tree, 'a')[0].props.href, 'https://example.org/report_(2026)');
  assert.equal(nodes(tree, 'code')[0].children[0], 'Nudge: literal');
});

test('daily PIB has separate labelled paragraphs and preserves fact bullets and qualifiers', () => {
  const raw = fs.readFileSync(path.join(ROOT, 'daily/daily_pib/PIB_2026-10-14.md'), 'utf8');
  const tree = MarkdownView({ text: raw, cadence: 'pib' });
  assert.equal(nodes(tree, 'dl').length, 0);
  assert.equal(groups(tree).length, 0, 'PIB uses ordinary paragraphs and fact lists');
  const paragraphs = nodes(tree, 'p');
  const labelled = (label) => paragraphs.filter((p) => text(nodes(p, 'strong')[0]) === label);
  assert.equal(labelled('What it is: ').length, 4);
  assert.equal(labelled('Why it matters: ').length, 4);
  assert.equal(labelled('Notebook: ').length, 4);
  assert.equal(labelled('Key facts (single-source summary of the declaration): ').length, 1);
  assert.ok(labelled('What it is: ').every((p) => !text(p).includes('Why it matters:')));
  assert.ok(nodes(tree, 'ul').some((ul) => nodes(ul, 'li').length === 4 && text(ul).includes('Delhi Declaration')));
});

test('practice questions and other document types retain their ordinary Markdown layout', () => {
  const practice = '## Part B — Practice Set\n\n**Q1.** Explain. **Notebook:** This is question text.\n1. First statement.\n2. Second statement.\n\n## Sources\n\n- [Report](https://example.org)';
  for (const cadence of ['daily', 'pib']) assert.deepEqual(MarkdownView({ text: practice, cadence }), MarkdownView({ text: practice }));
  assert.equal(groups(MarkdownView({ text: '**Exam angle:** Text. **Notebook:** GS2.', cadence: 'essay' })).length, 0);
  assert.deepEqual(splitDailyCaFields('Read `**Notebook:**` or [**Exam angle:**](https://example.org).'), [{ text: 'Read `**Notebook:**` or [**Exam angle:**](https://example.org).' }]);
});

test('all daily CA and PIB briefings keep heading anchors, links and numbers', () => {
  for (const [folder, cadence] of [['daily_current_affairs', 'daily'], ['daily_pib', 'pib']]) {
    const dir = path.join(ROOT, 'daily', folder);
    for (const file of fs.readdirSync(dir).filter((name) => name.endsWith('.md'))) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8');
      const before = MarkdownView({ text: raw });
      const after = MarkdownView({ text: raw, cadence });
      if (cadence === 'daily') assert.ok(groups(after).length >= 5, file);
      const headings = [...nodes(after, 'h2'), ...nodes(after, 'h3'), ...nodes(after, 'h4')];
      assert.deepEqual(headings.map((h) => h.props.id).sort(), parseNoteHeadings(raw).map((h) => h.id).sort(), file);
      assert.deepEqual(nodes(after, 'a').map((a) => a.props.href), nodes(before, 'a').map((a) => a.props.href), file);
      const numbers = (tree) => text(tree).match(/\d+(?:[.,]\d+)*(?:%|\b)/g);
      assert.deepEqual(numbers(after), numbers(before), file);
    }
  }
});

test('numeric inline formulas render while dollar amounts stay literal', () => {
  const formulas = renderInline('At $30^\\circ$, use $1/e$ and $2\\pi$; $1+2$ is arithmetic.');
  assert.deepEqual(nodes(formulas, MathText).map((n) => n.props.value), ['30^\\circ', '1/e', '2\\pi', '1+2']);
  const currency = 'US$20 billion, $5 million, $100 → $5, $20.50 and $30.00. Costs $2 million and $3 million.';
  const literal = renderInline(currency);
  assert.equal(nodes(literal, MathText).length, 0);
  assert.equal(text(literal), currency);
});
