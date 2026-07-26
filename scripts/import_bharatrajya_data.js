#!/usr/bin/env node

// Build the compact historical-subcontinent atlas payload used by Pariksha.
// Source files are the CC0 data exports published by https://www.bharatrajya.com/.

const fs = require("fs");
const path = require("path");

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error("Usage: node scripts/import_bharatrajya_data.js <bharatrajya-data-directory>");
  process.exit(1);
}

function read(name) {
  return JSON.parse(fs.readFileSync(path.join(sourceDir, name), "utf8"));
}

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "data", "maps");
const districts = read("districts.geojson");
const territories = read("territories.json");
const kingdoms = read("kingdoms.json");
const rulers = read("dynasty_rulers.json");
const events = read("events.json");
const districtAreas = read("district_areas.json");
const worldCountries = JSON.parse(fs.readFileSync(path.join(root, "data", "maps", "world_countries_india_pov.geojson"), "utf8"));

const subcontinentFeatures = districts.features;
const subcontinentCodes = new Set(subcontinentFeatures.map((feature) => feature.properties.code));
const subcontinentTerritories = territories.filter((item) => subcontinentCodes.has(item.districtCode));
const usedPolities = new Set(subcontinentTerritories.map((item) => item.kingdomName));
const contextCountryNames = new Set(["Afghanistan", "Bhutan", "China", "Iran", "Myanmar", "Tajikistan", "Turkmenistan", "Uzbekistan"]);
const contextCountries = worldCountries.features.filter((feature) => contextCountryNames.has(feature.properties?.ADMIN));

const territoriesByDistrict = {};
for (const item of subcontinentTerritories) {
  const list = territoriesByDistrict[item.districtCode] || (territoriesByDistrict[item.districtCode] = []);
  list.push({
    start: item.startYear,
    end: item.endYear,
    polity: item.kingdomName,
  });
}
for (const list of Object.values(territoriesByDistrict)) {
  list.sort((a, b) => a.start - b.start);
}

const payload = {
  version: 1,
  source: {
    name: "BharatRajya",
    url: "https://www.bharatrajya.com/",
    licence: "CC0 1.0",
    licenceUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    retrieved: "2026-07-26",
  },
  minYear: 1188,
  maxYear: 2026,
  districtAreas: Object.fromEntries(
    [...subcontinentCodes].filter((code) => districtAreas[code] != null).map((code) => [code, districtAreas[code]]),
  ),
  contextCountries: { type:"FeatureCollection", features:contextCountries },
  territories: territoriesByDistrict,
  kingdoms: kingdoms.filter((item) => usedPolities.has(item.name)),
  rulers: Object.fromEntries(Object.entries(rulers).filter(([name]) => usedPolities.has(name))),
  events: events.filter((item) => (
    item.year >= 1188
    && item.year <= 2026
    && Number.isFinite(item.lat)
    && Number.isFinite(item.lng)
    && item.lat >= 5
    && item.lat <= 38
    && item.lng >= 60
    && item.lng <= 101
  )),
};

fs.writeFileSync(
  path.join(outputDir, "bharatrajya-india-districts.geojson"),
  JSON.stringify({ type: "FeatureCollection", features: subcontinentFeatures }),
);
fs.writeFileSync(
  path.join(outputDir, "bharatrajya-india-history.json"),
  JSON.stringify(payload),
);

console.log(`Imported ${subcontinentFeatures.length} districts, ${subcontinentTerritories.length} reign spans, ${payload.kingdoms.length} polities, and ${payload.events.length} mapped events across the historical subcontinent.`);
