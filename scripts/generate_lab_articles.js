const fs = require('node:fs');
const path = require('node:path');

// Match the story's title, never the mixed briefing's broad subject tags.
const TOPICS = {
  'ancient-timeline': /harapp|indus valley|maurya|gupta|ancient|archaeolog|excavation|buddhis|jainis|vedic|\bcholas?\b|\bpallavas?\b|satavahana/i,
  'modern-timeline': /freedom struggle|colonial|independence movement|gandhi|ambedkar|quit india|swadeshi|1857|subhas|bhagat singh/i,
  'rivers-recall': /\briver\b|\brivers\b|tributar|drainage|\bdam\b|ganga|brahmaputra|indus|cauvery|krishna|godavari|narmada|teesta/i,
  'world-geography': /geography|wetland|ramsar|national park|river|glacier|monsoon|cyclone|earthquake|volcan|ocean|sea level|offshore mineral/i,
  constitution: /constitution|supreme court|high court|judiciar|election commission|fundamental right|parliament|governor|\barticle \d|reservation|federal/i,
  governance: /\bscheme\b|\bmission\b|cabinet|aadhaar|social audit|panchayat|welfare|msp|government polic|public service/i,
  ir: /international relations|\bG20\b|\bSCO\b|\bBRICS\b|\bQuad\b|bilateral|diploma|summit|united nations|india.{0,25}(?:china|pakistan|us|russia)|trade deal/i,
  economy: /economy|\bGST\b|inflation|\bRBI\b|monetary|fiscal|\bGDP\b|tax|trade|bank|finance|msp|employment/i,
  environment: /environment|wetland|ramsar|national park|biodiversity|pollution|emission|climate|conservation|carbon|\bCAFE\b|wildlife|forest/i,
  science: /science|technology|\bISRO\b|space|satellite|quantum|semiconductor|\bAI\b|artificial intelligence|crispr|genom|nisar|spadex/i,
  thinkers: /ethics|philosoph|thinker|moral|gandhi|ambedkar/i,
  'case-lab': /ethics|conflict of interest|integrity|corruption|whistleblow/i,
};
function splitArticles(text) {
  const body = text.split(/^#{1,4}\s+(?:PART B|(?:\d+[.)]?\s*)?(?:Prelims|Practice|MCQs|Answers|Sources))/mi)[0];
  const headings = [...body.matchAll(/^(#{2,4})\s+(\d+[.)]\s+.+)$/gm)];
  return headings.map((match, i) => ({
    title: match[2].replace(/^\d+[.)]\s*/, '').replace(/\*\*/g, ''),
    text: body.slice(match.index + match[0].length, headings[i + 1]?.index ?? body.length).trim().replace(/\n---\s*$/, ''),
  })).filter(article => article.text && !/question|quiz|answer key/i.test(article.title));
}
function writeLabArticles(root, documents) {
  const articles = [];
  for (const note of documents.filter(note => ['daily', 'pib'].includes(note.cadence)).sort((a,b) => b.date.localeCompare(a.date))) {
    for (const [i, article] of splitArticles(fs.readFileSync(path.join(root, note.path), 'utf8')).entries()) {
      const labIds = Object.entries(TOPICS).filter(([, pattern]) => pattern.test(article.title)).map(([id]) => id);
      if (labIds.length) articles.push({ id: `${note.id}:${i}`, noteId: note.id, date: note.date, cadence: note.cadence, labIds, ...article });
    }
  }
  const selected = new Set(Object.keys(TOPICS).flatMap(id => articles.filter(article => article.labIds.includes(id)).slice(0, 8).map(article => article.id)));
  fs.mkdirSync(path.join(root, 'data'), { recursive: true });
  fs.writeFileSync(path.join(root, 'data/lab_articles.json'), JSON.stringify({ version: 1, articles: articles.filter(article => selected.has(article.id)) }));
  return articles;
}
module.exports = { TOPICS, splitArticles, writeLabArticles };
