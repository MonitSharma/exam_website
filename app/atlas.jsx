// News Atlas — accurate local boundary maps plus UPSC study layers.
const { useState: useStateAtlas, useMemo: useMemoAtlas, useEffect: useEffectAtlas, useRef: useRefAtlas } = React;

const ATLAS_CURRENT = [
  { id:"dhemaji", layer:"current", name:"Dhemaji & Lakhimpur", country:"India", region:"Assam", lat:27.48, lon:94.58, scope:"india", topic:"Environment", week:"04 Jul 2026", fresh:true, hook:"Brahmaputra floodplain", fact:"The first major flood wave of the 2026 monsoon affected villages, farmland and a railway bridge over the Simen river.", locate:"Upper Assam, on the north bank of the Brahmaputra near Arunachal Pradesh." },
  { id:"dzongu", layer:"current", name:"Dzongu", country:"India", region:"Sikkim", lat:27.53, lon:88.55, scope:"india", topic:"Environment", week:"04 Jul 2026", fresh:true, hook:"Teesta–Kanchenjunga corridor", fact:"A Bailey bridge over the Phee Khola washed away, cutting the road link to Lachen and Lachung.", locate:"North Sikkim, between the Teesta valley and the Kanchenjunga massif." },
  { id:"jaintia", layer:"current", name:"Jaintia Hills", country:"India", region:"Meghalaya", lat:25.35, lon:92.35, scope:"india", topic:"Geography", week:"04 Jul 2026", fresh:true, hook:"Myntdu river basin", fact:"The Myntdu-Leshka Stage II hydro project revived downstream, transboundary river concerns.", locate:"Eastern Meghalaya on the Shillong plateau; the Myntdu drains towards Bangladesh." },
  { id:"kangpokpi", layer:"current", name:"Kangpokpi", country:"India", region:"Manipur", lat:25.13, lon:93.97, scope:"india", topic:"Security", week:"04 Jul 2026", fresh:true, hook:"NH-2 and NH-37", fact:"A highway-checkpoint ultimatum sharpened the continuing ethnic and security stand-off.", locate:"North of Imphal in the Sadar Hills, across the Imphal–Dimapur corridor." },
  { id:"malappuram", layer:"current", name:"Malappuram & Palakkad", country:"India", region:"Kerala", lat:10.95, lon:76.15, scope:"india", topic:"Health", week:"04 Jul 2026", fresh:true, hook:"Western Ghats foothills", fact:"Fresh Nipah cases widened concern beyond Kerala's usual Kozhikode hotspot.", locate:"Central Kerala, inland of the Malabar Coast and west of the Palakkad Gap." },
  { id:"sriharikota", layer:"current", name:"Sriharikota", country:"India", region:"Andhra Pradesh", lat:13.72, lon:80.23, scope:"india", topic:"Science & Tech", week:"04 Jul 2026", fresh:true, hook:"Pulicat Lake barrier island", fact:"Satish Dhawan Space Centre prepared for a July 2026 GSLV Mk II launch.", locate:"On the Andhra coast, between Pulicat Lake and the Bay of Bengal." },
  { id:"amarnath", layer:"current", name:"Amarnath Cave", country:"India", region:"Jammu & Kashmir", lat:34.21, lon:75.50, scope:"india", topic:"Culture", week:"27 Jun 2026", fresh:false, hook:"Upper Lidder valley", fact:"The 2026 Amarnath Yatra and new surveillance arrangements brought the route into focus.", locate:"Himalayan cave reached via the Pahalgam or Baltal routes." },
  { id:"gandhi-sagar", layer:"current", name:"Gandhi Sagar WLS", country:"India", region:"Madhya Pradesh", lat:24.72, lon:75.57, scope:"india", topic:"Environment", week:"27 Jun 2026", fresh:false, hook:"Chambal river landscape", fact:"The site was approved as part of a wider Kuno–Gandhi Sagar cheetah metapopulation.", locate:"On the Chambal near the Madhya Pradesh–Rajasthan border." },
  { id:"medog", layer:"current", name:"Medog / Yarlung Tsangpo", country:"China", region:"Tibet", lat:29.32, lon:95.33, scope:"world", topic:"Geography", week:"04 Jul 2026", fresh:true, hook:"World's deepest canyon", fact:"Construction advanced on a mega-dam cascade, raising downstream concerns in India and Bangladesh.", locate:"At the great bend around Namcha Barwa, before the river enters India as the Brahmaputra." },
  { id:"indus-news", layer:"current", name:"Indus Basin", country:"Pakistan", region:"Punjab & Sindh", lat:29.50, lon:70.50, scope:"world", topic:"International Relations", week:"04 Jul 2026", fresh:true, hook:"Chenab–Jhelum system", fact:"An international conference revisited the Indus Waters Treaty amid continuing India–Pakistan tension.", locate:"Across Pakistani Punjab and Sindh, draining to the Arabian Sea near Karachi." },
  { id:"gaza", layer:"current", name:"Gaza Strip", country:"Palestine", region:"Eastern Mediterranean", lat:31.42, lon:34.36, scope:"world", topic:"Security", week:"04 Jul 2026", fresh:true, hook:"Levantine coast", fact:"The conflict crossed the 1,000-day mark as territorial-control and ceasefire questions remained unsettled.", locate:"A narrow Mediterranean enclave between Israel and Egypt's Sinai Peninsula." },
  { id:"tobelo", layer:"current", name:"Tobelo", country:"Indonesia", region:"North Halmahera", lat:1.73, lon:128.01, scope:"world", topic:"Environment", week:"04 Jul 2026", fresh:true, hook:"Molucca Sea seismic arc", fact:"A magnitude-6.2 earthquake struck near Tobelo, distinct from the island's recent volcanic activity.", locate:"On the northeastern coast of Halmahera in North Maluku." },
  { id:"iwate", layer:"current", name:"Iwate Prefecture", country:"Japan", region:"Sanriku coast", lat:39.60, lon:141.50, scope:"world", topic:"Environment", week:"04 Jul 2026", fresh:true, hook:"Japan Trench", fact:"A magnitude-6.0 offshore earthquake highlighted this closely monitored subduction zone.", locate:"Northeastern Honshu, facing the Pacific Ocean." },
  { id:"etna-news", layer:"current", name:"Mount Etna", country:"Italy", region:"Sicily", lat:37.75, lon:14.99, scope:"world", topic:"Environment", week:"27 Jun 2026", fresh:false, hook:"Ionian volcanic arc", fact:"A pyroclastic flow and continuing summit activity renewed attention on Europe's largest active volcano.", locate:"Eastern Sicily, close to Catania and the Ionian Sea." },
  { id:"hormuz-news", layer:"current", name:"Strait of Hormuz", country:"Iran / Oman", region:"Persian Gulf", lat:26.57, lon:56.25, scope:"world", topic:"International Relations", week:"27 Jun 2026", fresh:false, hook:"Global energy chokepoint", fact:"A maritime incident interrupted a UN-backed corridor amid the continuing Gulf crisis.", locate:"Between Iran and Oman's Musandam Peninsula, linking the Persian Gulf with the Gulf of Oman." },
  { id:"goma", layer:"current", name:"Goma & Lake Kivu", country:"DR Congo", region:"North Kivu", lat:-1.68, lon:29.23, scope:"world", topic:"Security", week:"27 Jun 2026", fresh:false, hook:"Albertine Rift", fact:"Fighting and a drone strike kept the M23-held regional capital in the news.", locate:"On Lake Kivu's north shore at the Rwanda border, below Nyiragongo volcano." },
  { id:"busan", layer:"current", name:"Busan", country:"South Korea", region:"Korea Strait", lat:35.18, lon:129.08, scope:"world", topic:"Culture", week:"27 Jun 2026", fresh:false, hook:"Major Pacific port", fact:"Preparations accelerated for the 48th UNESCO World Heritage Committee session.", locate:"At the southeastern tip of the Korean Peninsula, facing Japan." },
];

function atlasLayerDef(id) { return window.ATLAS_LAYER_DEFS.find((item) => item.id === id); }
function atlasFeatureScope(feature) {
  if (feature.scope) return feature.scope;
  const def = atlasLayerDef(feature.layer);
  return def?.scopes?.length === 1 ? def.scopes[0] : "india";
}
function atlasFeatureSub(feature) { return feature.region || feature.group || feature.country || "Study location"; }

const ATLAS_RIVER_SYSTEMS = [
  { id:"all", label:"All river systems", color:"#2F6BB0" },
  { id:"ganga", label:"Ganga system", color:"#2F6BB0" },
  { id:"brahmaputra", label:"Brahmaputra system", color:"#16859A" },
  { id:"indus", label:"Indus system", color:"#6269B0" },
  { id:"east", label:"East-flowing peninsular", color:"#2E7D5B" },
  { id:"west", label:"West-flowing peninsular", color:"#7A5BA6" },
];

const ATLAS_RIVER_META = {
  Ganga:{system:"ganga",role:"main"}, Ganges:{system:"ganga",role:"main"}, Yamuna:{system:"ganga",role:"tributary"}, Ghaghara:{system:"ganga",role:"tributary"}, Gandak:{system:"ganga",role:"tributary"}, Gandaki:{system:"ganga",role:"tributary"}, Kosi:{system:"ganga",role:"tributary"}, Son:{system:"ganga",role:"tributary"}, Chambal:{system:"ganga",role:"tributary"}, Betwa:{system:"ganga",role:"tributary"},
  Brahmaputra:{system:"brahmaputra",role:"main"}, Teesta:{system:"brahmaputra",role:"tributary"},
  Indus:{system:"indus",role:"main"}, Jhelum:{system:"indus",role:"tributary"}, Chenab:{system:"indus",role:"tributary"}, Ravi:{system:"indus",role:"tributary"}, Beas:{system:"indus",role:"tributary"}, Sutlej:{system:"indus",role:"tributary"},
  Godavari:{system:"east",role:"main"}, Wainganga:{system:"east",role:"tributary"}, Krishna:{system:"east",role:"main"}, Tungabhadra:{system:"east",role:"tributary"}, Mahanadi:{system:"east",role:"main"}, Brahmani:{system:"east",role:"main"}, Kaveri:{system:"east",role:"main"},
  Narmada:{system:"west",role:"main"}, Tapi:{system:"west",role:"main"}, Tapti:{system:"west",role:"main"},
};

function atlasRiverMetaForName(name) {
  const clean = String(name || "").split(" /")[0];
  return ATLAS_RIVER_META[clean] || Object.entries(ATLAS_RIVER_META).find(([key]) => clean.includes(key))?.[1] || null;
}

function atlasRiverReferenceFeatures() {
  const existing = window.ATLAS_KNOWLEDGE.filter((item) => item.layer === "rivers");
  return Object.entries(ATLAS_RIVER_META).filter(([name]) => !["Ganges","Gandaki","Tapti"].includes(name) && !existing.some((item) => item.name.toLowerCase().includes(name.toLowerCase()))).map(([name, meta]) => ({
    id:`river-reference-${name.toLowerCase()}`, layer:"rivers", name, group:`${ATLAS_RIVER_SYSTEMS.find((item) => item.id === meta.system)?.label} · ${meta.role}`, scope:"india",
    fact:`${name} is mapped as a ${meta.role === "main" ? "main stem" : "tributary"} in the ${ATLAS_RIVER_SYSTEMS.find((item) => item.id === meta.system)?.label}.`, hook:"Follow the labelled centreline to its confluence or outfall.",
  }));
}

function atlasSymbolSvg(layer) {
  const symbols = {
    current: '<circle cx="10" cy="10" r="3.2"/><circle cx="10" cy="10" r="7" fill="none" stroke-width="1.3" opacity=".55"/>',
    dams: '<path d="M3 5h14l-2 9H5z"/><path d="M2 16c2-1 3-1 5 0s3 1 5 0 3-1 6 0" fill="none" stroke-width="1.5"/>',
    power: '<path d="m11 1-6 10h5l-1 8 6-11h-5z"/>',
    passes: '<path d="m1 17 6-10 4 6 2-3 6 7z"/><path d="m7 7 2 3 2-3" fill="none" stroke-width="1.3"/>',
    protected: '<path d="M10 18V9" fill="none" stroke-width="1.5"/><path d="M10 2C4 5 4 11 10 13c6-2 6-8 0-11z"/>',
    ports: '<path d="M10 2v14M6 5h8M3 11c1 5 3 7 7 7s6-2 7-7l-3 2-4-2-4 2z" fill="none" stroke-width="1.5"/>',
    heritage: '<path d="M2 7h16L10 2zM4 8v8M8 8v8M12 8v8M16 8v8M2 17h16" fill="none" stroke-width="1.5"/>',
    wetlands: '<path d="M2 7c3-2 5-2 8 0s5 2 8 0M2 11c3-2 5-2 8 0s5 2 8 0M2 15c3-2 5-2 8 0s5 2 8 0" fill="none" stroke-width="1.6"/>',
    ranges: '<path d="m1 17 6-10 4 6 2-3 6 7z"/><path d="m7 7 2 3 2-3" fill="none" stroke-width="1.3"/>',
    islands: '<circle cx="7" cy="8" r="3"/><circle cx="14" cy="13" r="2.5"/><path d="M2 18c3-2 5-2 8 0s5 2 8 0" fill="none" stroke-width="1.3"/>',
    reference: '<circle cx="10" cy="10" r="6" fill="none" stroke-width="1.4"/><path d="M10 1v18M1 10h18" fill="none" stroke-width="1.4"/>',
    space: '<path d="M12 2c3 3 3 7 0 11l-3 3-4-4 3-3c1-4 2-6 4-7z"/><circle cx="11" cy="7" r="1.2" fill="white"/><path d="m6 13-3 1-1 4 4-2z"/>',
    chokepoints: '<path d="M2 4c5 1 5 11 0 12M18 4c-5 1-5 11 0 12M7 10h6" fill="none" stroke-width="1.6"/>',
    worldPhysical: '<path d="m2 17 5-10 3 5 3-8 5 13z"/><path d="M8 5c1-3 3-3 4 0" fill="none" stroke-width="1.3"/>',
    institutions: '<path d="M2 7h16L10 2zM4 8v8M8 8v8M12 8v8M16 8v8M2 17h16" fill="none" stroke-width="1.5"/>',
  };
  return `<svg viewBox="0 0 20 20" aria-hidden="true">${symbols[layer] || '<circle cx="10" cy="10" r="6"/>'}</svg>`;
}

function atlasPointIcon(feature, color, isSelected) {
  return window.L.divIcon({
    className: "atlas-symbol-marker",
    html: `<span class="atlas-symbol${isSelected ? " selected" : ""}" style="--symbol:${color}">${atlasSymbolSvg(feature.layer)}</span>`,
    iconSize: [isSelected ? 27 : 23, isSelected ? 27 : 23],
    iconAnchor: [isSelected ? 13.5 : 11.5, isSelected ? 13.5 : 11.5],
  });
}

function AtlasLeafletMap({ scope, features, boundariesOn, riversOn, riverSystem, selected, onSelect }) {
  const hostRef = useRefAtlas(null);
  const mapRef = useRefAtlas(null);
  const baseRef = useRefAtlas(null);
  const overlaysRef = useRefAtlas(null);
  const boundaryDataRef = useRefAtlas({ world: null, india: null, lakshadweep: null });
  const riverDataRef = useRefAtlas(null);
  const [boundaryVersion, setBoundaryVersion] = useStateAtlas(0);
  const [riverVersion, setRiverVersion] = useStateAtlas(0);

  useEffectAtlas(() => {
    if (!hostRef.current || mapRef.current || !window.L) return undefined;
    const map = window.L.map(hostRef.current, { zoomControl: true, attributionControl: false, minZoom: 1, maxZoom: 9, worldCopyJump: true, preferCanvas: true });
    map.createPane("boundaries");
    map.getPane("boundaries").style.zIndex = 320;
    map.createPane("studyLines");
    map.getPane("studyLines").style.zIndex = 410;
    map.createPane("studyPoints");
    map.getPane("studyPoints").style.zIndex = 430;
    mapRef.current = map;
    baseRef.current = window.L.layerGroup().addTo(map);
    overlaysRef.current = window.L.layerGroup().addTo(map);
    map.setView([18, 10], 2);
    window.setTimeout(() => map.invalidateSize(), 30);
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  useEffectAtlas(() => {
    let cancelled = false;
    const path = scope === "india" ? "data/maps/india_states.geojson" : "data/maps/world_countries_india_pov.geojson";
    if (boundaryDataRef.current[scope]) { setBoundaryVersion((value) => value + 1); return undefined; }
    fetch(path).then((response) => response.json()).then((data) => {
      if (cancelled) return;
      boundaryDataRef.current[scope] = data;
      setBoundaryVersion((value) => value + 1);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [scope]);

  useEffectAtlas(() => {
    if (scope !== "india" || boundaryDataRef.current.lakshadweep) return undefined;
    let cancelled = false;
    fetch("data/maps/lakshadweep.geojson").then((response) => response.json()).then((data) => {
      if (cancelled) return;
      boundaryDataRef.current.lakshadweep = data;
      setBoundaryVersion((value) => value + 1);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [scope]);

  useEffectAtlas(() => {
    if (!riversOn || riverDataRef.current) return undefined;
    let cancelled = false;
    fetch("data/maps/india_rivers.geojson").then((response) => response.json()).then((data) => {
      if (cancelled) return;
      riverDataRef.current = data;
      setRiverVersion((value) => value + 1);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, [riversOn]);

  useEffectAtlas(() => {
    const map = mapRef.current;
    const base = baseRef.current;
    if (!map || !base) return;
    base.clearLayers();
    const geojson = boundaryDataRef.current[scope];
    if (geojson) {
      window.L.geoJSON(geojson, {
        pane: "boundaries",
        style: (feature) => {
          const props = feature.properties || {};
          const isIndia = scope === "world" && (props.ADM0_A3 === "IND" || props.ADMIN === "India");
          return { color: isIndia ? "#1E4D3A" : (scope === "india" ? "#53685f" : "#8b978f"), weight: isIndia ? 1.8 : (scope === "india" ? 1.25 : .65), fillColor: isIndia ? "#e4eee7" : "#faf8f1", fillOpacity: scope === "india" && boundariesOn ? .92 : .84 };
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties || {};
          const name = props.shapeName || props.ADMIN || props.NAME_EN || props.NAME || props.SOVEREIGNT || "Administrative unit";
          layer.bindTooltip(name, { sticky: true, className: "atlas-map-tooltip" });
          if (scope === "india" && boundariesOn) {
            layer.on("click", () => onSelect({ id:`boundary-${name}`, layer:"boundaries", name, group:"State / Union Territory", scope:"india", fact:"Administrative boundary shown from the locally stored India ADM1 dataset.", hook:"State / Union Territory boundary" }));
          }
        },
      }).addTo(base);
      if (scope === "india") {
        const lakshadweep = { id:"boundary-Lakshadweep", layer:"boundaries", name:"Lakshadweep", group:"Union Territory · Arabian Sea", scope:"india", lat:10.57, lon:72.64, fact:"India's smallest Union Territory: a coral archipelago of 36 islands in the Arabian Sea.", hook:"Kavaratti · Nine Degree Channel · Minicoy" };
        if (boundaryDataRef.current.lakshadweep) {
          const color = "#1E4D3A";
          const fillColor = "#e4eee7";
          const fillOpacity = boundariesOn ? 0.92 : 0.84;
          window.L.geoJSON(boundaryDataRef.current.lakshadweep, {
            pane:"boundaries",
            style:() => ({ color, weight:1.25, fillColor, fillOpacity }),
            onEachFeature: (_feature, layer) => {
              layer.bindTooltip("Lakshadweep", { sticky:true, className:"atlas-map-tooltip" });
              if (boundariesOn) {
                layer.on("click", () => onSelect(lakshadweep));
              }
            },
          }).addTo(base);
        }
        window.L.tooltip({ permanent:true, direction:"left", className:"atlas-boundary-label atlas-island-label", offset:[-6,0] }).setLatLng([10.57,72.64]).setContent("Lakshadweep islands").addTo(base);
      }
    }
    if (scope === "india") map.fitBounds([[6.3, 67.3], [37.6, 98.2]], { padding:[8,8] });
    else map.setView([18, 10], 2);
    window.setTimeout(() => map.invalidateSize(), 40);
  }, [scope, boundariesOn, boundaryVersion]);

  useEffectAtlas(() => {
    const map = mapRef.current;
    const overlays = overlaysRef.current;
    if (!map || !overlays) return;
    overlays.clearLayers();
    if (scope === "india" && riversOn && riverDataRef.current) {
      const labelled = new Set();
      const majorRivers = new Set(["Ganga","Brahmaputra","Indus","Godavari","Krishna","Narmada","Mahanadi","Kaveri"]);
      const riverAliases = { Ganges:"Ganga", Gandaki:"Gandak", Tapti:"Tapi" };
      const riverGeoLayer = window.L.geoJSON(riverDataRef.current, {
        pane:"studyLines",
        filter: (geoFeature) => {
          const rawName = geoFeature.properties?.name_en || geoFeature.properties?.name || "";
          const meta = atlasRiverMetaForName(riverAliases[rawName] || rawName);
          return riverSystem === "all" || meta?.system === riverSystem;
        },
        style: (geoFeature) => {
          const rawName = geoFeature.properties?.name_en || geoFeature.properties?.name || "";
          const meta = atlasRiverMetaForName(riverAliases[rawName] || rawName) || { system:"ganga", role:"tributary" };
          const color = ATLAS_RIVER_SYSTEMS.find((item) => item.id === meta.system)?.color || "#2F6BB0";
          return { color, weight:meta.role === "main" ? 3.4 : 2, opacity:meta.role === "main" ? .95 : .8, dashArray:meta.role === "main" ? null : "5 4", lineCap:"round", lineJoin:"round" };
        },
        onEachFeature: (geoFeature, riverLayer) => {
          const rawName = geoFeature.properties?.name_en || geoFeature.properties?.name || "River";
          const name = riverAliases[rawName] || rawName;
          const meta = atlasRiverMetaForName(name);
          const match = window.ATLAS_KNOWLEDGE.find((item) => item.layer === "rivers" && item.name.toLowerCase().includes(name.toLowerCase()));
          const riverFeature = match || atlasRiverReferenceFeatures().find((item) => item.name === name) || { id:`river-${name}`, layer:"rivers", name, group:"River system", scope:"india", fact:`${name} is part of the Natural Earth river-centreline study layer.`, hook:"Trace its source, course, tributaries and outfall." };
          riverLayer.on("click", () => onSelect(riverFeature));
          const showPermanent = true;
          if (showPermanent && !labelled.has(name)) {
            riverLayer.bindTooltip(name, { permanent:true, direction:"center", className:"atlas-permanent-label atlas-river-label", opacity:1 });
            labelled.add(name);
          }
        },
      }).addTo(overlays);
      const riverBounds = riverGeoLayer.getBounds();
      const kosi = features.find((item) => item.layer === "rivers" && item.name === "Kosi");
      if (kosi && (riverSystem === "all" || riverSystem === "ganga")) {
        const kosiLayer = window.L.polyline(kosi.coords, { pane:"studyLines", color:"#2F6BB0", weight:2.4, opacity:.88, lineCap:"round" }).addTo(overlays);
        kosiLayer.setStyle({ dashArray:"5 4", weight:2 });
        kosiLayer.bindTooltip("Kosi", { permanent:true, direction:"center", className:"atlas-permanent-label atlas-river-label", opacity:1 });
        kosiLayer.on("click", () => onSelect(kosi));
        riverBounds.extend(kosiLayer.getBounds());
      }
      if (riverSystem !== "all" && riverBounds.isValid()) {
        window.setTimeout(() => map.fitBounds(riverBounds, { padding:[58,58], maxZoom:5 }), 35);
      }
    }
    features.forEach((feature) => {
      if (feature.layer === "rivers") return;
      const layerDef = atlasLayerDef(feature.layer) || { color:"#1E4D3A" };
      let layer;
      if (feature.type === "line") {
        layer = window.L.polyline(feature.coords, { pane:"studyLines", color:layerDef.color, weight:selected?.id === feature.id ? 5 : 3, opacity:.9, lineJoin:"round" });
      } else {
        layer = window.L.marker([feature.lat, feature.lon], { pane:"studyPoints", icon:atlasPointIcon(feature, layerDef.color, selected?.id === feature.id), keyboard:true, title:feature.name });
      }
      const labelDirection = feature.lon != null && feature.lon < 78 ? "left" : "right";
      layer.bindTooltip(feature.name, { permanent:true, direction:labelDirection, offset:[labelDirection === "right" ? 10 : -10,0], className:"atlas-permanent-label atlas-feature-label", opacity:1 });
      layer.on("click", () => onSelect(feature));
      layer.addTo(overlays);
    });
  }, [features, selected?.id, scope, riversOn, riverSystem, riverVersion]);

  useEffectAtlas(() => {
    const map = mapRef.current;
    if (!map || !selected || selected.lat == null || selected.lon == null) return;
    map.panTo([selected.lat, selected.lon], { animate:true, duration:.35 });
  }, [selected?.id]);

  return <div ref={hostRef} className="atlas-leaflet" aria-label={`${scope === "india" ? "India" : "World"} interactive study map`} />;
}

function LakshadweepInset({ onSelect }) {
  const [geometry, setGeometry] = useStateAtlas(null);
  useEffectAtlas(() => {
    let cancelled = false;
    fetch("data/maps/lakshadweep.geojson").then((response) => response.json()).then((data) => { if (!cancelled) setGeometry(data.features?.[0]?.geometry || null); }).catch(() => {});
    return () => { cancelled = true; };
  }, []);
  const points = useMemoAtlas(() => {
    if (!geometry) return [];
    const polygons = geometry.type === "MultiPolygon" ? geometry.coordinates : [geometry.coordinates];
    return polygons.map((polygon) => {
      const ring = polygon[0] || [];
      const centre = ring.reduce((acc, pair) => [acc[0] + pair[0], acc[1] + pair[1]], [0,0]);
      const lon = centre[0] / Math.max(1, ring.length);
      const lat = centre[1] / Math.max(1, ring.length);
      return { x:8 + ((lon - 71.7) / 1.7) * 92, y:14 + ((12.1 - lat) / 4.1) * 120 };
    });
  }, [geometry]);
  const feature = { id:"boundary-Lakshadweep", layer:"boundaries", name:"Lakshadweep", group:"Union Territory · Arabian Sea", scope:"india", lat:10.57, lon:72.64, fact:"India's smallest Union Territory: 36 coral islands grouped into the Amindivi, Laccadive and Minicoy island groups.", hook:"Kavaratti · Nine Degree Channel · Minicoy" };
  return <button className="atlas-lakshadweep-inset" onClick={() => onSelect(feature)} aria-label="Open Lakshadweep study card">
    <span><strong>Lakshadweep</strong><small>accurate archipelago inset</small></span>
    <svg viewBox="0 0 110 150" role="img" aria-label="Relative positions of Lakshadweep islands">
      <path d="M2 7h106v136H2z" className="lak-inset-sea" />
      {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="1.7" />)}
      <text x="57" y="55">Kavaratti</text><line x1="52" y1="57" x2="47" y2="62" />
      <text x="59" y="136">Minicoy</text><line x1="54" y1="133" x2="49" y2="128" />
    </svg>
  </button>;
}

function NewsAtlas() {
  const [scope, setScope] = useStateAtlas("world");
  const [activeLayers, setActiveLayers] = useStateAtlas(["current"]);
  const [query, setQuery] = useStateAtlas("");
  const [weekId, setWeekId] = useStateAtlas(window.ATLAS_NEWS_WEEKS[0].id);
  const [riverSystem, setRiverSystem] = useStateAtlas("all");
  const [selected, setSelected] = useStateAtlas(window.ATLAS_NEWS_FEATURES.find((item) => item.weekId === window.ATLAS_NEWS_WEEKS[0].id && item.scope === "world"));

  const layerDefs = useMemoAtlas(() => window.ATLAS_LAYER_DEFS.filter((item) => item.scopes.includes(scope)), [scope]);
  const scopeFeatures = useMemoAtlas(() => {
    const current = window.ATLAS_NEWS_FEATURES.filter((feature) => feature.scope === scope && feature.weekId === weekId);
    const knowledge = window.ATLAS_KNOWLEDGE.filter((feature) => atlasFeatureScope(feature) === scope);
    return [...current, ...knowledge, ...(scope === "india" ? atlasRiverReferenceFeatures() : [])];
  }, [scope, weekId]);
  const mapFeatures = useMemoAtlas(() => {
    const needle = query.trim().toLowerCase();
    return scopeFeatures.filter((feature) => {
      if (!activeLayers.includes(feature.layer)) return false;
      if (feature.layer === "rivers" && riverSystem !== "all" && atlasRiverMetaForName(feature.name)?.system !== riverSystem) return false;
      return !needle || `${feature.name} ${atlasFeatureSub(feature)} ${feature.fact || ""}`.toLowerCase().includes(needle);
    });
  }, [scopeFeatures, activeLayers, query, riverSystem]);
  const listFeatures = mapFeatures;
  const boundariesOn = activeLayers.includes("boundaries");
  const riversOn = activeLayers.includes("rivers");

  function changeScope(nextScope) {
    setScope(nextScope);
    setQuery("");
    setRiverSystem("all");
    setActiveLayers(nextScope === "india" ? ["current", "boundaries"] : ["current"]);
    setSelected(window.ATLAS_NEWS_FEATURES.find((item) => item.scope === nextScope && item.weekId === weekId));
  }
  function changeWeek(nextWeek) {
    setWeekId(nextWeek);
    setSelected(window.ATLAS_NEWS_FEATURES.find((item) => item.scope === scope && item.weekId === nextWeek));
  }
  function changeRiverSystem(nextSystem) {
    setRiverSystem(nextSystem);
    if (nextSystem === "all") return;
    const mainStem = scopeFeatures.find((feature) => {
      const meta = feature.layer === "rivers" ? atlasRiverMetaForName(feature.name) : null;
      return meta?.system === nextSystem && meta.role === "main";
    });
    const firstRiver = scopeFeatures.find((feature) => feature.layer === "rivers" && atlasRiverMetaForName(feature.name)?.system === nextSystem);
    setSelected(mainStem || firstRiver || null);
  }
  function toggleLayer(id) {
    setActiveLayers((current) => {
      const removing = current.includes(id);
      const next = removing ? current.filter((item) => item !== id) : [...current, id];
      if (removing && selected?.layer === id) setSelected(scopeFeatures.find((feature) => next.includes(feature.layer)) || null);
      return next;
    });
  }
  function layerCount(def) {
    if (def.id === "boundaries") return 36;
    if (def.id === "rivers") return 25;
    return scopeFeatures.filter((feature) => feature.layer === def.id).length;
  }

  const selectedDef = selected ? atlasLayerDef(selected.layer) : null;
  const activeWeek = window.ATLAS_NEWS_WEEKS.find((week) => week.id === weekId);
  const selectedWeek = selected?.weekId ? window.ATLAS_NEWS_WEEKS.find((week) => week.id === selected.weekId) : null;
  return (
    <main className="atlas-page atlas-page-v2">
      <header className="atlas-hero">
        <div>
          <div className="eyebrow small"><span className="eyebrow-line" /> Interactive UPSC geography</div>
          <h1>News Atlas</h1>
          <p>Current affairs on a proper political map—plus the static geography that turns a location into an exam-ready mental model.</p>
        </div>
        <div className="atlas-freshness"><span className="atlas-live-dot" /><span><small>Selected news set</small><strong>{activeWeek.label.replace("Week of ", "")}</strong><em>Local Places in News notes</em></span></div>
      </header>

      <div className="atlas-shell atlas-shell-v2">
        <aside className="atlas-controls" aria-label="Map controls">
          <div className="atlas-scope" role="tablist" aria-label="Map scope">
            <button className={scope === "world" ? "on" : ""} onClick={() => changeScope("world")}><Icon name="map" size={15} /> World</button>
            <button className={scope === "india" ? "on" : ""} onClick={() => changeScope("india")}><Icon name="target" size={15} /> India</button>
          </div>
          <label className="atlas-search"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this atlas…" /></label>
          <label className="atlas-week-select"><span>Places in News week</span><select value={weekId} onChange={(event) => changeWeek(event.target.value)} aria-label="Places in News week">{window.ATLAS_NEWS_WEEKS.map((week) => <option key={week.id} value={week.id}>{week.label}</option>)}</select><small>{activeWeek.source}</small></label>
          <div className="atlas-filter-head"><span>Knowledge layers</span><strong>{activeLayers.length}</strong></div>
          <div className="atlas-layer-list">
            {layerDefs.map((def) => <label key={def.id} className={activeLayers.includes(def.id) ? "on" : ""}>
              <input type="checkbox" checked={activeLayers.includes(def.id)} onChange={() => toggleLayer(def.id)} />
              <span className="atlas-layer-swatch" style={{ background:def.color }} />
              <span>{def.label}</span><strong>{layerCount(def)}</strong>
            </label>)}
          </div>
          {riversOn && <div className="atlas-river-system-picker"><span>Visualise one basin</span>{ATLAS_RIVER_SYSTEMS.map((system) => <button key={system.id} className={riverSystem === system.id ? "on" : ""} onClick={() => changeRiverSystem(system.id)}><i style={{background:system.color}} />{system.label}</button>)}</div>}
          <div className="atlas-place-list atlas-place-list-v2">
            {listFeatures.slice(0, 80).map((feature) => <button key={`${feature.layer}-${feature.id}`} className={selected?.id === feature.id ? "on" : ""} onClick={() => setSelected(feature)}>
              <span style={{ background:(atlasLayerDef(feature.layer) || {}).color }} />
              <span><strong>{feature.name}</strong><small>{atlasFeatureSub(feature)}</small></span>
              <Icon name="chevR" size={14} />
            </button>)}
            {!listFeatures.length && <p>Turn on a layer or clear the search.</p>}
          </div>
        </aside>

        <section className="atlas-stage">
          <div className="atlas-stage-bar">
            <span><Icon name="layers" size={15} /> {scope === "world" ? "Political world map · India POV" : "India · States & Union Territories"}</span>
            <span className="atlas-stage-hint">Scroll to zoom · drag to move</span>
          </div>
          <div className="atlas-map-wrap atlas-map-wrap-v2">
            <AtlasLeafletMap scope={scope} features={mapFeatures} boundariesOn={boundariesOn} riversOn={riversOn} riverSystem={riverSystem} selected={selected} onSelect={setSelected} />
            <div className="atlas-map-key">{activeLayers.filter((id) => id !== "boundaries").map((id) => { const def = atlasLayerDef(id); return def && <span key={id}><i style={{background:def.color}} />{def.short}</span>; })}</div>
            {riversOn && <div className="atlas-river-legend"><span><i className="main" /> Main stem</span><span><i className="tributary" /> Tributary</span><strong>{ATLAS_RIVER_SYSTEMS.find((item) => item.id === riverSystem)?.label}</strong></div>}
          </div>
        </section>

        <aside className="atlas-detail" aria-live="polite">
          {selected ? <>
            <div className="atlas-detail-kicker"><span style={{ background:selectedDef?.color || "var(--green)" }} /> {selectedDef?.label || "Study layer"}</div>
            <h2>{selected.name}</h2>
            <p className="atlas-detail-loc"><Icon name="map" size={14} /> {atlasFeatureSub(selected)}{selected.country ? ` · ${selected.country}` : ""}</p>
            {selected.lat != null && <div className="atlas-coordinate"><span>{Math.abs(selected.lat).toFixed(2)}°{selected.lat >= 0 ? "N" : "S"}</span><span>{Math.abs(selected.lon).toFixed(2)}°{selected.lon >= 0 ? "E" : "W"}</span></div>}
            {selected.hook && <div className="atlas-hook"><small>{selected.layer === "current" ? "Map hook" : "Remember"}</small><strong>{selected.hook}</strong></div>}
            <div className="atlas-detail-section"><h3>{selected.layer === "current" ? "Why in news" : "Why it matters"}</h3><p>{selected.fact}</p></div>
            {selected.locate && <div className="atlas-detail-section"><h3>Locate it</h3><p>{selected.locate}</p></div>}
            <div className="atlas-source-note"><Icon name={selected.layer === "current" ? "clock" : "book"} size={14} /><span>{selected.layer === "current" ? "Places in News" : "UPSC map layer"}<br /><strong>{selectedWeek?.label || selectedDef?.short}</strong>{selectedWeek && <small>{selectedWeek.source}</small>}</span></div>
          </> : <div className="atlas-empty-detail"><Icon name="map" size={30} /><strong>Select a feature</strong><p>Choose any marker, river or boundary.</p></div>}
        </aside>
      </div>
      <p className="atlas-disclaimer"><Icon name="info" size={14} /> Boundary data: Natural Earth India point-of-view world layer and geoBoundaries/DataMeet India ADM1. River centrelines: Natural Earth 1:10m.</p>
    </main>
  );
}

Object.assign(window, { NewsAtlas });
