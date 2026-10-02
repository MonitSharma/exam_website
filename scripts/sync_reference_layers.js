const fs = require('node:fs');
const path = require('node:path');
function syncReferenceLayers(root) {
  const source = path.join(root, 'data/atlas/reference_updates.json');
  if (!fs.existsSync(source)) return;
  const data = JSON.parse(fs.readFileSync(source, 'utf8'));
  const payload = `// Reviewed geography snapshot; edit data/atlas/reference_updates.json, then run npm run manifest.\n(function () {\n  const updates = ${JSON.stringify(data)};\n  for (const feature of updates.features) {\n    const index = window.ATLAS_KNOWLEDGE.findIndex(item => item.id === feature.id);\n    if (index >= 0) window.ATLAS_KNOWLEDGE[index] = { ...window.ATLAS_KNOWLEDGE[index], ...feature };\n    else window.ATLAS_KNOWLEDGE.push(feature);\n  }\n  window.ATLAS_REFERENCE_STATUS = { verifiedOn: updates.verifiedOn, ramsarCount: updates.ramsarCount, catalogueSource: updates.catalogueSource };\n})();\n`;
  fs.writeFileSync(path.join(root, 'app/atlas-verified.js'), payload);
}
module.exports = { syncReferenceLayers };
