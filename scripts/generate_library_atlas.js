// Map explicit place mentions in CA/PIB notes using the project's own geography.
// Excerpts are source text, not newly verified news. Never geocode an unknown name.
const fs = require('fs');
const path = require('path');
function plain(text) {
  return text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`#]/g, '').replace(/\s+/g, ' ').trim();
}
function placeMention(text, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, name.length <= 3 && /^[A-Z]+$/.test(name) ? 'u' : 'iu').exec(text);
}
function wordMatch(text, name) { return Boolean(placeMention(text, name)); }
function regionAnchor(geometry) {
  const points = geometry.coordinates.flat(geometry.type === 'MultiPolygon' ? 2 : 1);
  const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
  return { lat: (Math.min(...ys) + Math.max(...ys)) / 2, lon: (Math.min(...xs) + Math.max(...xs)) / 2 };
}
function buildGazetteer(root, news) {
  const anchors = new Map();
  function add(item) {
    const key = `${item.country}:${item.name}`.toLowerCase();
    if (!anchors.has(key)) anchors.set(key, item);
  }
  for (const feature of news.features.filter((f) => !f.libraryDerived)) {
    if (!feature.name || !Number.isFinite(feature.lat)) continue;
    const aliases = [...new Set([feature.name, feature.name.split(/\s*[/→&]\s*/)[0]].map((s) => s.replace(/\s*\([^)]*\)/g, '').trim()))].filter((s) => s.length >= 5);
    if (aliases.length) add({ ...feature, aliases, coordinateSource: 'data/atlas/news.json' });
  }
  const countriesFile = path.join(root, 'data/maps/world_countries_india_pov.geojson');
  if (fs.existsSync(countriesFile)) for (const feature of JSON.parse(fs.readFileSync(countriesFile)).features) {
    const p = feature.properties;
    if (['India', 'Antarctica'].includes(p.ADMIN) || !Number.isFinite(p.LABEL_X)) continue;
    add({ name: p.ADMIN, country: p.ADMIN, region: 'Country study anchor', scope: 'world', lat: p.LABEL_Y, lon: p.LABEL_X,
      aliases: [...new Set([p.ADMIN, p.NAME_EN, ...(p.ADMIN === 'United States of America' ? ['United States', 'US', 'USA'] : p.ADMIN === 'United Kingdom' ? ['UK'] : p.ADMIN === 'United Arab Emirates' ? ['UAE'] : [])].filter(Boolean))], coordinateSource: 'data/maps/world_countries_india_pov.geojson' });
  }
  const districtsFile = path.join(root, 'data/maps/bharatrajya-india-districts.geojson');
  if (fs.existsSync(districtsFile)) for (const feature of JSON.parse(fs.readFileSync(districtsFile)).features) {
    const p = feature.properties;
    if (p.COUNTRY !== 'India' || !p.name || p.name.length < 5 || ['North', 'South', 'East', 'West', 'Central', 'Sagar', 'Chamba', 'Gaya', 'Mansa', 'Tonk'].includes(p.name)) continue;
    const aliases = p.name === 'Thoothukkudi' ? ['Thoothukkudi', 'Thoothukudi', 'Kulasekarapattinam', 'Kulasekharapatnam'] : p.name === 'New Delhi' ? ['New Delhi', 'Delhi'] : [p.name];
    add({ name: p.name, country: 'India', region: p.NAME_1, scope: 'india', ...regionAnchor(feature.geometry), aliases, district: true,
      coordinateSource: 'data/maps/bharatrajya-india-districts.geojson' });
  }
  return [...anchors.values()];
}
function sunday(date) {
  const d = new Date(`${date}T00:00:00Z`); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); return d.toISOString().slice(0, 10);
}
function syncLibraryAtlas(root, news) {
  const gazetteer = buildGazetteer(root, news);
  const cutoff = news.weeks.filter((w) => !w.libraryDerived).map((w) => w.id).sort().at(-1) || '';
  news.weeks = news.weeks.filter((w) => !w.libraryDerived);
  news.features = news.features.filter((f) => !f.libraryDerived);
  const groups = new Map();
  for (const [dir, cadence] of [['daily/daily_current_affairs', 'daily'], ['daily/daily_pib', 'pib']]) {
    const absolute = path.join(root, dir);
    if (!fs.existsSync(absolute)) continue;
    for (const file of fs.readdirSync(absolute).sort()) {
      const date = file.match(/_(\d{4}-\d{2}-\d{2})\.md$/)?.[1];
      if (!date || date <= cutoff) continue;
      const source = `${dir}/${file}`;
      let body = fs.readFileSync(path.join(root, source), 'utf8');
      body = body.split(/^#{1,4}\s+(?:PART B|\d*\s*(?:Prelims MCQs|Prelims Practice|MCQs)|Practice|Sources|Answers)/mi)[0];
      const headings = [...body.matchAll(/^#{2,4}\s+(.+)$/gm)].map((match) => plain(match[1]));
      const blocks = body.split(/\n\s*\n/).map(plain).filter((block) => block && !/^Window scanned|^Date:|^Daily.*Briefing|^UPSC.*Briefing/i.test(block));
      const id = `${sunday(date)}-library`;
      if (!groups.has(id)) groups.set(id, new Map());
      for (const anchor of gazetteer) {
        if (anchor.district && !headings.some((heading) => anchor.aliases.some((name) => wordMatch(heading, name)))) continue;
        const block = blocks.find((block) => anchor.aliases.some((name) => wordMatch(block, name)));
        if (!block) continue;
        const mentions = anchor.aliases.map((name) => placeMention(block, name)).filter(Boolean);
        const start = Math.max(0, Math.min(...mentions.map((match) => match.index)) - 120);
        const excerpt = block.slice(start, start + 650).trim();
        const key = `${anchor.country}:${anchor.name}`;
        const refs = groups.get(id).get(key)?.references || [];
        refs.push({ source, date, cadence, excerpt });
        groups.get(id).set(key, { anchor, references: refs });
      }
    }
  }
  for (const [weekId, entries] of groups) {
    const features = [...entries.values()].map(({anchor, references}) => {
      references.sort((a, b) => b.date.localeCompare(a.date) || a.source.localeCompare(b.source));
      const latest = references[0];
      return { id: `${weekId}-${anchor.country}-${anchor.name}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'), weekId,
        layer: 'current', name: anchor.name, country: anchor.country, region: anchor.region, scope: anchor.scope,
        lat: Number(anchor.lat.toFixed(4)), lon: Number(anchor.lon.toFixed(4)), topic: 'Briefing geography',
        hook: `${anchor.region || anchor.country} · mentioned ${latest.date}`, fact: latest.excerpt,
        locate: `Approximate study anchor for ${anchor.name}, ${anchor.country}. Country and district anchors represent a region, not the exact site mentioned in the briefing.`,
        coordinatePrecision: 'regional-study-anchor', coordinateSource: anchor.coordinateSource,
        source: latest.source, references, libraryDerived: true };
    });
    if (!features.length) continue;
    news.weeks.push({id: weekId, label: `CA & PIB · week of ${weekId.slice(0,10)}`, source: features[0].source,
      libraryDerived: true, sourceCount: new Set(features.flatMap((f) => f.references.map((r) => r.source))).size});
    news.features.push(...features);
  }
}
module.exports = { syncLibraryAtlas, wordMatch, regionAnchor };
