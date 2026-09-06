const fs = require('fs');
const path = require('path');
function syncAtlasNews(root) {
  const output = path.join(root, 'data/atlas/news.json');
  const dir = path.join(root, 'data/atlas/weeks');
  if (!fs.existsSync(dir)) return;
  const news = JSON.parse(fs.readFileSync(output, 'utf8'));
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
    const { features, ...week } = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (!week.id || !fs.existsSync(path.join(root, week.source)) || !features?.length) throw new Error(`Incomplete Atlas companion: ${file}`);
    news.weeks = news.weeks.filter((w) => w.id !== week.id).concat(week);
    news.features = news.features.filter((f) => f.weekId !== week.id).concat(features);
  }
  news.weeks.sort((a, b) => b.id.localeCompare(a.id));
  const text = JSON.stringify(news, null, 2) + '\n';
  if (fs.readFileSync(output, 'utf8') !== text) fs.writeFileSync(output, text);
}
module.exports = { syncAtlasNews };
