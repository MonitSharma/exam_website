# Map data

- `world_countries.geojson` — Natural Earth, Admin 0 Countries, 1:110m (retained source variant).
- `world_countries_india_pov.geojson` — Natural Earth Admin 0 Countries, India point-of-view variant, simplified locally for web display.
- `india_rivers.geojson` — selected named South Asian river centreline features from Natural Earth 1:10m Rivers + Lake Centerlines, simplified locally.
- `india_states.geojson` — geoBoundaries `gbOpen` India ADM1 dataset, simplified locally for web display. Source: DataMeet India community / Election Commission of India; distributed by geoBoundaries under CC BY 2.5 IN: https://www.geoboundaries.org/
- `lakshadweep.geojson` — the ungeneralised Lakshadweep ADM1 feature extracted from the same geoBoundaries source. It preserves 35 polygon components that disappear from the general-purpose simplified India file.
- `bharatrajya-india-districts.geojson` — modern district geometry for the wider Indian subcontinent (present-day India, Pakistan, Bangladesh, Nepal and Sri Lanka), adapted from BharatRajya's CC0 atlas export.
- `bharatrajya-india-history.json` — compact historical territory spans, polities, rulers, frontier-country context and mapped events for the wider subcontinent, adapted from BharatRajya's CC0 atlas export. Retrieved 2026-07-26; see https://www.bharatrajya.com/ and https://www.bharatrajya.com/sources

## Web optimisation

Every file the app fetches has been passed through mapshaper with
`precision=0.0001` (~11 m), which is well below one screen pixel at the zoom
levels used here and preserves every polygon ring. `bharatrajya-india-districts.geojson`
additionally carries a `-simplify percentage=40% keep-shapes` pass, because it is
the largest download and renders as a subcontinent-scale overview; that pass drops
447 sub-pixel coastal islets (1561 rings to 1114). The other files are **not**
geometrically simplified — mapshaper removes rings that collapse below the
simplification threshold, which would delete small islands from the state,
world and Lakshadweep layers.

To reproduce, from the repository root:

    npx mapshaper@0.6 data/maps/<file>.geojson -o out.geojson format=geojson precision=0.0001

Natural Earth data is public domain: https://www.naturalearthdata.com/

BharatRajya publishes its maps and data under Creative Commons Zero (CC0 1.0):
https://creativecommons.org/publicdomain/zero/1.0/
The historical scholarship behind those reconstructions remains attributable
to the sources listed by BharatRajya.

The files are used as educational map outlines. Boundary depiction and labels do not imply a legal or political position.
