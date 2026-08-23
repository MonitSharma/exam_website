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

function AtlasLeafletMap({ scope, features, boundariesOn, riversOn, riverSystem, selected, onSelect, onMapClick }) {
  const hostRef = useRefAtlas(null);
  const mapRef = useRefAtlas(null);
  const baseRef = useRefAtlas(null);
  const overlaysRef = useRefAtlas(null);
  const boundaryDataRef = useRefAtlas({ world: null, india: null, lakshadweep: null });
  const riverDataRef = useRefAtlas(null);
  const onMapClickRef = useRefAtlas(onMapClick);
  const [boundaryVersion, setBoundaryVersion] = useStateAtlas(0);
  const [riverVersion, setRiverVersion] = useStateAtlas(0);

  useEffectAtlas(() => { onMapClickRef.current = onMapClick; }, [onMapClick]);

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
    map.on("click", (event) => onMapClickRef.current?.(event.latlng));
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

function AtlasModeSwitch({ mode, onChange }) {
  return <div className="atlas-mode-switch" role="tablist" aria-label="Atlas mode">
    <button role="tab" aria-selected={mode === "news"} className={mode === "news" ? "on" : ""} onClick={() => onChange("news")}><Icon name="target" size={15} /> News & geography</button>
    <button role="tab" aria-selected={mode === "history"} className={mode === "history" ? "on" : ""} onClick={() => onChange("history")}><Icon name="clock" size={15} /> India through time</button>
  </div>;
}

// Places-in-News data grows by roughly a week of entries every Sunday, so it
// lives in data/atlas/news.json and is fetched when the Atlas opens rather than
// riding along in app.bundle.js for every visitor.
let atlasNewsPromise = null;
function loadAtlasNews() {
  if (!atlasNewsPromise) {
    atlasNewsPromise = fetch("data/atlas/news.json").then((response) => {
      if (!response.ok) throw new Error("Places in News data could not be loaded.");
      return response.json();
    }).then((data) => ({
      weeks: Array.isArray(data.weeks) ? data.weeks : [],
      features: Array.isArray(data.features) ? data.features : [],
    }));
  }
  return atlasNewsPromise;
}

let atlasHistoryPromise = null;
function loadAtlasHistory() {
  if (!atlasHistoryPromise) {
    atlasHistoryPromise = Promise.all([
      fetch("data/maps/bharatrajya-india-districts.geojson").then((response) => {
        if (!response.ok) throw new Error("District map could not be loaded.");
        return response.json();
      }),
      fetch("data/maps/bharatrajya-india-history.json").then((response) => {
        if (!response.ok) throw new Error("Historical data could not be loaded.");
        return response.json();
      }),
    ]).then(([districts, history]) => ({ districts, ...history }));
  }
  return atlasHistoryPromise;
}

function atlasHistorySpanAt(spans, year) {
  if (!spans?.length) return null;
  let low = 0;
  let high = spans.length - 1;
  while (low <= high) {
    const middle = (low + high) >> 1;
    const span = spans[middle];
    if (year < span.start) high = middle - 1;
    else if (year > span.end) low = middle + 1;
    else return span;
  }
  return null;
}

function atlasHistoryRulerAt(rulers, year) {
  return rulers?.find((item) => year >= item.start && year <= item.end) || null;
}

function atlasHistoryFallbackColor(name) {
  const palette = ["#AE6B42","#3C7662","#6972A8","#A15D66","#B18A3D","#5B7E9A","#7F668F","#73834B"];
  let hash = 0;
  for (const character of String(name || "")) hash = ((hash << 5) - hash + character.charCodeAt(0)) | 0;
  return palette[Math.abs(hash) % palette.length];
}

function atlasHistoryYearModel(data, year) {
  const assignments = new Map();
  const powers = new Map();
  Object.entries(data.territories).forEach(([code, spans]) => {
    const span = atlasHistorySpanAt(spans, year);
    if (!span) return;
    assignments.set(code, span);
    const item = powers.get(span.polity) || { name:span.polity, districts:0, area:0 };
    item.districts += 1;
    item.area += data.districtAreas[code] || 0;
    powers.set(span.polity, item);
  });
  return {
    assignments,
    powers:[...powers.values()].sort((a, b) => b.area - a.area || b.districts - a.districts),
    events:data.events.filter((item) => item.year === year),
  };
}

const ATLAS_HISTORY_ERAS = [
  { start:1188, end:1205, label:"Late early-medieval India", short:"Regional kingdoms", focus:"Contemporaneous regional powers, temple-centred states and the eve of the Delhi Sultanate." },
  { start:1206, end:1335, label:"Delhi Sultanate & regional powers", short:"Sultanate era", focus:"Sultanate expansion alongside resilient Deccan, southern, eastern and Himalayan polities." },
  { start:1336, end:1525, label:"Vijayanagara & regional sultanates", short:"Regional state systems", focus:"Vijayanagara, Bahmani and successor states, and shifting regional centres of power." },
  { start:1526, end:1706, label:"Mughal imperial age", short:"Mughal era", focus:"Mughal consolidation, regional accommodation and major contemporaries across the subcontinent." },
  { start:1707, end:1756, label:"Successor states & Maratha expansion", short:"18th-century transition", focus:"Mughal decentralisation, Maratha expansion and the rise of successor and regional states." },
  { start:1757, end:1857, label:"Company rule & Indian states", short:"Company era", focus:"Colonial expansion through wars, alliances and annexations alongside Indian kingdoms and confederacies." },
  { start:1858, end:1946, label:"Crown rule & princely India", short:"Raj era", focus:"British paramountcy, princely states, nationalism and the territorial setting of the freedom struggle." },
  { start:1947, end:2026, label:"Independent India", short:"Post-independence", focus:"Political integration, reorganisation of states and the making of the Indian Union." },
];

function atlasHistoryEraForYear(year) {
  return ATLAS_HISTORY_ERAS.find((era) => year >= era.start && year <= era.end) || ATLAS_HISTORY_ERAS[0];
}

function atlasHistoryTransitions(data, year) {
  if (year <= data.minYear) return [];
  const grouped = new Map();
  Object.entries(data.territories).forEach(([code, spans]) => {
    const before = atlasHistorySpanAt(spans, year - 1)?.polity;
    const after = atlasHistorySpanAt(spans, year)?.polity;
    if (!after || before === after) return;
    const key = `${before || "Unmapped"}→${after}`;
    const item = grouped.get(key) || { from:before || "Unmapped", to:after, count:0, sample:[] };
    item.count += 1;
    if (item.sample.length < 3) item.sample.push(code);
    grouped.set(key, item);
  });
  return [...grouped.values()].sort((a, b) => b.count - a.count);
}

function atlasHistoryExamLens(year) {
  if (year < 1707) return {
    paper:"GS I · Medieval India",
    prelims:"Pair dynasties with capitals, rulers, regions and contemporary powers.",
    mains:"Use the map to explain state formation, regional interaction and patterns of political integration.",
  };
  if (year < 1947) return {
    paper:"GS I · Modern India",
    prelims:"Connect wars, treaties, annexations, princely states and centres of resistance.",
    mains:"Trace how colonial expansion and regional responses reshaped political authority.",
  };
  return {
    paper:"GS I/II · Post-independence",
    prelims:"Revise accession, integration and the chronology of territorial reorganisation.",
    mains:"Use spatial context to discuss nation-building, federalism and state reorganisation.",
  };
}

function atlasHistoryEventTitle(event) {
  const text = String(event?.text || "Historical event").split(":")[0].trim();
  return text.length > 46 ? `${text.slice(0,43)}…` : text;
}

function atlasHistoryEscapeHtml(value) {
  return String(value || "").replace(/[&<>"']/g, (character) => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;",
  }[character]));
}

function atlasHistoryEventClusters(events, map) {
  const clusters = [];
  events.forEach((event) => {
    const point = map.latLngToContainerPoint([event.lat,event.lng]);
    const match = clusters.find((cluster) => Math.abs(cluster.point.x - point.x) < 164 && Math.abs(cluster.point.y - point.y) < 46);
    if (match) {
      match.events.push(event);
      match.lat = match.events.reduce((sum, item) => sum + item.lat, 0) / match.events.length;
      match.lng = match.events.reduce((sum, item) => sum + item.lng, 0) / match.events.length;
      match.point = map.latLngToContainerPoint([match.lat,match.lng]);
    } else {
      clusters.push({ lat:event.lat, lng:event.lng, point, events:[event] });
    }
  });
  return clusters;
}

function HistoricalLeafletMap({ data, yearModel, selectedCode, selectedPower, onSelectCode, onSelectEvent }) {
  const hostRef = useRefAtlas(null);
  const mapRef = useRefAtlas(null);
  const districtLayersRef = useRefAtlas(new Map());
  const eventLayerRef = useRefAtlas(null);
  const selectCodeRef = useRefAtlas(onSelectCode);
  const selectEventRef = useRefAtlas(onSelectEvent);
  const kingdomByName = useMemoAtlas(() => new Map(data.kingdoms.map((item) => [item.name, item])), [data]);

  useEffectAtlas(() => { selectCodeRef.current = onSelectCode; }, [onSelectCode]);
  useEffectAtlas(() => { selectEventRef.current = onSelectEvent; }, [onSelectEvent]);

  useEffectAtlas(() => {
    if (!hostRef.current || mapRef.current || !window.L) return undefined;
    const renderer = window.L.canvas({ padding:.35 });
    const map = window.L.map(hostRef.current, {
      zoomControl:true, attributionControl:false, minZoom:3, maxZoom:9,
      preferCanvas:true, renderer, zoomSnap:.5,
    });
    mapRef.current = map;
    map.createPane("historyContext");
    map.getPane("historyContext").style.zIndex = 300;
    map.createPane("historyDistricts");
    map.getPane("historyDistricts").style.zIndex = 330;
    map.createPane("historyEvents");
    map.getPane("historyEvents").style.zIndex = 430;
    const layers = districtLayersRef.current;
    if (data.contextCountries) {
      window.L.geoJSON(data.contextCountries, {
        pane:"historyContext",
        renderer,
        style:{ color:"#91a099", weight:.8, fillColor:"#d9e1dd", fillOpacity:.46, dashArray:"4 4" },
        onEachFeature:(feature, layer) => layer.bindTooltip(feature.properties?.ADMIN || "Neighbouring country", { sticky:true, className:"atlas-map-tooltip" }),
      }).addTo(map);
    }
    window.L.geoJSON(data.districts, {
      pane:"historyDistricts",
      renderer,
      style:{ color:"#ffffff", weight:.55, fillColor:"#d9ddd8", fillOpacity:.82 },
      onEachFeature:(feature, layer) => {
        const code = feature.properties?.code;
        layers.set(code, layer);
        layer.on("click", () => selectCodeRef.current(code));
        layer.on("mouseover", () => {
          const span = layer.__historySpan;
          layer.bindTooltip(`<strong>${feature.properties?.name || "District"}</strong><span>${feature.properties?.NAME_1 || ""}${span ? ` · ${span.polity}` : ""}</span>`, { sticky:true, className:"atlas-map-tooltip atlas-history-tooltip" }).openTooltip();
        });
      },
    }).addTo(map);
    eventLayerRef.current = window.L.layerGroup().addTo(map);
    const historyBounds = [[5.2,60.2],[37.6,100.7]];
    const resetControl = window.L.control({ position:"topleft" });
    resetControl.onAdd = () => {
      const button = window.L.DomUtil.create("button", "atlas-history-reset-view");
      button.type = "button";
      button.title = "Reset subcontinent view";
      button.setAttribute("aria-label", "Reset subcontinent view");
      button.textContent = "↺";
      window.L.DomEvent.disableClickPropagation(button);
      window.L.DomEvent.on(button, "click", () => map.fitBounds(historyBounds, { padding:[10,10] }));
      return button;
    };
    resetControl.addTo(map);
    map.fitBounds(historyBounds, { padding:[10,10] });
    window.setTimeout(() => map.invalidateSize(), 40);
    return () => { map.remove(); mapRef.current = null; layers.clear(); };
  }, [data]);

  useEffectAtlas(() => {
    const map = mapRef.current;
    const eventLayer = eventLayerRef.current;
    if (!map || !eventLayer) return undefined;
    function renderEvents() {
      eventLayer.clearLayers();
      const mapWidth = map.getSize().x;
      atlasHistoryEventClusters(yearModel.events, map).forEach((cluster) => {
        const event = cluster.events[0];
        const relatedCount = cluster.events.length - 1;
        const payload = relatedCount ? {
          ...event,
          text:`${atlasHistoryEventTitle(event)} + ${relatedCount} nearby event${relatedCount === 1 ? "" : "s"}`,
          detail:cluster.events.map((item) => item.text).join("\n\n"),
        } : event;
        const label = atlasHistoryEscapeHtml(atlasHistoryEventTitle(event));
        const placeLeft = cluster.point.x > mapWidth - 178;
        const marker = window.L.marker([cluster.lat,cluster.lng], {
          pane:"historyEvents",
          icon:window.L.divIcon({
            className:"atlas-history-event-divicon",
            html:`<span class="atlas-history-event-callout${placeLeft ? " left" : ""}"><i></i><b>${label}</b>${relatedCount ? `<small>+${relatedCount} nearby</small>` : ""}</span>`,
            iconSize:[154,42],
            iconAnchor:[placeLeft ? 142 : 12,42],
          }),
          keyboard:true,
          title:relatedCount ? `${atlasHistoryEventTitle(event)} and ${relatedCount} nearby events` : atlasHistoryEventTitle(event),
        }).addTo(eventLayer);
        marker.bindTooltip(`<strong>${atlasHistoryEscapeHtml(event.category)}</strong><span>${atlasHistoryEscapeHtml(event.text)}</span>`, { className:"atlas-map-tooltip atlas-history-tooltip" });
        marker.on("click", () => selectEventRef.current(payload));
      });
    }
    let frame = window.requestAnimationFrame(() => {
      districtLayersRef.current.forEach((layer, code) => {
        const span = yearModel.assignments.get(code);
        const color = span ? (kingdomByName.get(span.polity)?.color || atlasHistoryFallbackColor(span.polity)) : "#cbd2cd";
        const muted = selectedPower && span?.polity !== selectedPower;
        const selected = selectedCode === code;
        layer.__historySpan = span;
        layer.setStyle({
          fillColor:color,
          fillOpacity:muted ? .12 : (selected ? .98 : .82),
          color:selected ? "#172c24" : (muted ? "#d4d9d5" : "rgba(255,255,255,.92)"),
          weight:selected ? 2.3 : .55,
        });
        if (selected) layer.bringToFront();
      });
      renderEvents();
    });
    map.on("zoomend moveend", renderEvents);
    return () => {
      window.cancelAnimationFrame(frame);
      map.off("zoomend moveend", renderEvents);
    };
  }, [yearModel, selectedCode, selectedPower, kingdomByName]);

  return <div ref={hostRef} className="atlas-leaflet atlas-history-map" aria-label="Interactive historical map of the Indian subcontinent" />;
}

function HistoricalAtlas({ onModeChange }) {
  const [data, setData] = useStateAtlas(null);
  const [loadError, setLoadError] = useStateAtlas("");
  const [year, setYear] = useStateAtlas(1947);
  const [playing, setPlaying] = useStateAtlas(false);
  const [query, setQuery] = useStateAtlas("");
  const [sidebarView, setSidebarView] = useStateAtlas("powers");
  const [selectedCode, setSelectedCode] = useStateAtlas(null);
  const [selectedPower, setSelectedPower] = useStateAtlas("");
  const [selectedEvent, setSelectedEvent] = useStateAtlas(null);

  useEffectAtlas(() => {
    let cancelled = false;
    loadAtlasHistory().then((loaded) => { if (!cancelled) setData(loaded); }).catch((error) => { if (!cancelled) setLoadError(error.message); });
    return () => { cancelled = true; };
  }, []);
  useEffectAtlas(() => {
    if (!playing || !data) return undefined;
    const interval = window.setInterval(() => {
      setYear((value) => value >= data.maxYear ? data.minYear : Math.min(data.maxYear, value + 2));
    }, 220);
    return () => window.clearInterval(interval);
  }, [playing, data]);
  useEffectAtlas(() => { setSelectedEvent(null); }, [year]);

  const kingdomByName = useMemoAtlas(() => new Map((data?.kingdoms || []).map((item) => [item.name, item])), [data]);
  const yearModel = useMemoAtlas(() => data ? atlasHistoryYearModel(data, year) : null, [data, year]);
  const featureByCode = useMemoAtlas(() => new Map((data?.districts.features || []).map((feature) => [feature.properties.code, feature])), [data]);
  const selectedFeature = selectedCode ? featureByCode.get(selectedCode) : null;
  const selectedSpans = selectedCode && data ? data.territories[selectedCode] : null;
  const selectedSpan = selectedSpans ? atlasHistorySpanAt(selectedSpans, year) : null;
  const selectedSpanIndex = selectedSpan && selectedSpans ? selectedSpans.indexOf(selectedSpan) : -1;
  const nearbyDistrictSpans = selectedSpanIndex >= 0 ? selectedSpans.slice(Math.max(0, selectedSpanIndex - 2), selectedSpanIndex + 3) : [];
  const activePowerName = selectedSpan?.polity || selectedPower;
  const activeKingdom = activePowerName ? kingdomByName.get(activePowerName) : null;
  const activeRuler = activePowerName && data ? atlasHistoryRulerAt(data.rulers[activePowerName], year) : null;
  const activeRulers = activePowerName && data ? (data.rulers[activePowerName] || []) : [];
  const activeRulerIndex = activeRuler ? activeRulers.indexOf(activeRuler) : -1;
  const nearbyRulers = activeRulerIndex >= 0 ? activeRulers.slice(Math.max(0, activeRulerIndex - 1), activeRulerIndex + 2) : activeRulers.slice(0,3);
  const activePower = activePowerName ? yearModel?.powers.find((item) => item.name === activePowerName) : null;
  const era = atlasHistoryEraForYear(year);
  const examLens = atlasHistoryExamLens(year);
  const transitions = useMemoAtlas(() => data ? atlasHistoryTransitions(data, year) : [], [data, year]);
  const needle = query.trim().toLowerCase();
  const visiblePowers = (yearModel?.powers || []).filter((item) => !needle || item.name.toLowerCase().includes(needle)).slice(0,80);
  const visibleEvents = (yearModel?.events || []).filter((item) => !needle || `${item.category} ${item.text} ${item.detail || ""}`.toLowerCase().includes(needle));

  function changeYear(next) {
    setYear(Math.max(data.minYear, Math.min(data.maxYear, Number(next))));
  }
  function choosePower(name) {
    setSelectedPower((current) => current === name ? "" : name);
    setSelectedCode(null);
    setSelectedEvent(null);
  }
  function chooseCode(code) {
    setSelectedCode(code);
    setSelectedPower("");
    setSelectedEvent(null);
  }
  function clearHistorySelection() {
    setSelectedCode(null);
    setSelectedPower("");
    setSelectedEvent(null);
  }
  function changeSidebarView(nextView) {
    setSidebarView(nextView);
    setQuery("");
  }

  return <main className="atlas-page atlas-page-v2 atlas-history-page">
    <header className="atlas-hero">
      <div>
        <div className="eyebrow small"><span className="eyebrow-line" /> Interactive Indian history</div>
        <h1>India through time</h1>
        <p>Move across eight centuries of the Indian subcontinent, compare contemporary powers, and click a modern district to follow its historical sequence.</p>
      </div>
      <AtlasModeSwitch mode="history" onChange={onModeChange} />
    </header>

    {!data && !loadError && <div className="atlas-history-loading"><span className="atlas-loading-ring" /><strong>Preparing the historical map…</strong><small>Loaded only when you open this mode.</small></div>}
    {loadError && <div className="atlas-history-loading error"><Icon name="info" size={22} /><strong>{loadError}</strong><button className="btn btn-outline sm" onClick={() => window.location.reload()}>Reload page</button></div>}
    {data && yearModel && <div className="atlas-shell atlas-shell-v2 atlas-history-shell">
      <aside className="atlas-controls atlas-history-controls" aria-label="Historical map controls">
        <div className="atlas-history-view-switch" role="tablist" aria-label="Browse historical data">
          <button role="tab" aria-selected={sidebarView === "powers"} className={sidebarView === "powers" ? "on" : ""} onClick={() => changeSidebarView("powers")}><Icon name="layers" size={13} /> Powers</button>
          <button role="tab" aria-selected={sidebarView === "events"} className={sidebarView === "events" ? "on" : ""} onClick={() => changeSidebarView("events")}><Icon name="flag" size={13} /> Events <b>{yearModel.events.length}</b></button>
        </div>
        <label className="atlas-search"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={sidebarView === "powers" ? "Find a power…" : `Search events in ${year}…`} /></label>
        <div className="atlas-history-summary"><span>Powers in {year}</span><strong>{yearModel.powers.length}</strong><small>{yearModel.assignments.size} districts across the subcontinent</small></div>
        {(selectedPower || selectedCode || selectedEvent) && <button className="atlas-clear-focus atlas-clear-focus-top" onClick={clearHistorySelection}><Icon name="arrowL" size={13} /> Back to {year} overview</button>}
        {sidebarView === "powers" ? <div className="atlas-history-power-list">
          {visiblePowers.map((power) => {
            const color = kingdomByName.get(power.name)?.color || atlasHistoryFallbackColor(power.name);
            return <button key={power.name} aria-pressed={selectedPower === power.name} className={selectedPower === power.name ? "on" : ""} onClick={() => choosePower(power.name)}>
              <i style={{background:color}} /><span><strong>{power.name}</strong><small>{Math.round(power.area).toLocaleString("en-IN")} km² · {power.districts} districts</small></span><Icon name="chevR" size={13} />
            </button>;
          })}
          {!visiblePowers.length && <p>No powers match this search.</p>}
        </div> : <div className="atlas-history-event-list">
          {visibleEvents.map((event, index) => <button key={`${event.text}-${index}`} className={selectedEvent === event ? "on" : ""} onClick={() => { setSelectedEvent(event); setSelectedCode(null); setSelectedPower(""); }}>
            <i /><span><strong>{event.category}</strong><small>{event.text}</small></span><Icon name="chevR" size={13} />
          </button>)}
          {!visibleEvents.length && <div className="atlas-history-no-events"><Icon name="calendar" size={20} /><strong>No mapped events in {year}</strong><p>Territorial coverage is still available. Try a nearby year.</p></div>}
        </div>}
      </aside>

      <section className="atlas-stage atlas-history-stage">
        <div className="atlas-stage-bar">
          <span><Icon name="layers" size={15} /> Subcontinent · historical control <b className="atlas-era-pill">{era.short}</b></span>
          <span className="atlas-stage-hint">{yearModel.events.length ? `${yearModel.events.length} mapped event${yearModel.events.length === 1 ? "" : "s"} this year` : "Click a district to trace it"}</span>
        </div>
        <div className="atlas-map-wrap atlas-map-wrap-v2">
          <HistoricalLeafletMap data={data} yearModel={yearModel} selectedCode={selectedCode} selectedPower={selectedPower} onSelectCode={chooseCode} onSelectEvent={(event) => { setSelectedEvent(event); setSelectedCode(null); }} />
          <div className="atlas-history-year-stamp">{year}</div>
          <div className="atlas-history-key"><span><i /> Territory</span><span><i className="event" /> Event / battle</span></div>
        </div>
        <div className="atlas-timeline">
          <button className="atlas-play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause timeline" : "Play timeline"}><Icon name={playing ? "pause" : "play"} size={16} /></button>
          <button className="atlas-year-step" onClick={() => changeYear(year - 1)} aria-label="Previous year"><Icon name="arrowL" size={14} /></button>
          <label><span>Year</span><input type="number" min={data.minYear} max={data.maxYear} value={year} onChange={(event) => changeYear(event.target.value)} aria-label="Historical year" /></label>
          <button className="atlas-year-step" onClick={() => changeYear(year + 1)} aria-label="Next year"><Icon name="arrowR" size={14} /></button>
          <div className="atlas-range-wrap"><input type="range" min={data.minYear} max={data.maxYear} value={year} onChange={(event) => changeYear(event.target.value)} aria-label="Historical timeline" style={{"--timeline-progress":`${((year-data.minYear)/(data.maxYear-data.minYear))*100}%`}} /><div><span>{data.minYear}</span><button onClick={() => changeYear(1206)} title="Delhi Sultanate">1206</button><button onClick={() => changeYear(1526)} title="Mughal Empire">1526</button><button onClick={() => changeYear(1757)} title="Company expansion">1757</button><button onClick={() => changeYear(1858)} title="Crown rule">1858</button><button onClick={() => changeYear(1947)} title="Independence">1947</button><span>{data.maxYear}</span></div></div>
        </div>
      </section>

      <aside className="atlas-detail atlas-history-detail" aria-live="polite">
        <div className="atlas-history-brief">
        {(selectedEvent || selectedFeature || activePowerName) && <button className="atlas-detail-back" onClick={clearHistorySelection}><Icon name="arrowL" size={14} /> Back to {year} overview</button>}
        {selectedEvent ? <>
          <div className="atlas-detail-kicker"><span className="history-event-color" /> {selectedEvent.category} · {year}</div>
          <h2>{atlasHistoryEventTitle(selectedEvent)}</h2>
          <div className="atlas-detail-section"><h3>What happened</h3><p>{selectedEvent.detail || selectedEvent.text}</p></div>
          {(selectedEvent.belligerents || selectedEvent.outcome) && <div className="atlas-history-facts">{selectedEvent.belligerents && <span><small>Belligerents</small><strong>{selectedEvent.belligerents}</strong></span>}{selectedEvent.outcome && <span><small>Outcome</small><strong>{selectedEvent.outcome}</strong></span>}</div>}
          {selectedEvent.commanders && <div className="atlas-detail-section"><h3>Commanders</h3><p>{selectedEvent.commanders}</p></div>}
          <div className="atlas-upsc-lens compact"><span>{examLens.paper}</span><p><strong>Why map it</strong>Connect the event to its region, contemporary powers and territorial consequence.</p></div>
          <div className="atlas-source-note"><Icon name="book" size={14} /><span>Historical event source<br /><strong>{selectedEvent.source || "See BharatRajya sources"}</strong></span></div>
        </> : (selectedFeature && selectedSpan) ? <>
          <div className="atlas-detail-kicker"><span style={{background:activeKingdom?.color || atlasHistoryFallbackColor(activePowerName)}} /> District in {year}</div>
          <h2>{selectedFeature.properties.name}</h2>
          <p className="atlas-detail-loc"><Icon name="map" size={14} /> {selectedFeature.properties.NAME_1} · {selectedFeature.properties.NAME_0}</p>
          <div className="atlas-hook history"><small>Mapped power</small><strong>{activePowerName}</strong><em>{selectedSpan.start}–{selectedSpan.end}</em></div>
          {activeRuler && <div className="atlas-detail-section"><h3>Ruler in this year</h3><p><strong>{activeRuler.ruler}</strong>{activeRuler.title ? ` · ${activeRuler.title}` : ""}{activeRuler.note && <small className="atlas-ruler-note">{activeRuler.note}</small>}</p></div>}
          {activeKingdom?.description && <div className="atlas-detail-section"><h3>Context</h3><p>{activeKingdom.description}</p></div>}
          <div className="atlas-history-facts">{activeKingdom?.capital && <span><small>Capital</small><strong>{activeKingdom.capital}</strong></span>}{activeKingdom?.type && <span><small>Polity type</small><strong>{activeKingdom.type}</strong></span>}</div>
          <div className="atlas-detail-section"><h3>This district through time</h3><div className="atlas-succession-list">{nearbyDistrictSpans.map((span) => <button key={`${span.start}-${span.polity}`} className={span === selectedSpan ? "on" : ""} onClick={() => changeYear(span.start)}><i style={{background:kingdomByName.get(span.polity)?.color || atlasHistoryFallbackColor(span.polity)}} /><span><strong>{span.polity}</strong><small>{span.start}–{span.end}</small></span></button>)}</div></div>
          <button className="atlas-focus-power" onClick={() => choosePower(activePowerName)}>Highlight this power</button>
        </> : activePowerName ? <>
          <div className="atlas-detail-kicker"><span style={{background:activeKingdom?.color || atlasHistoryFallbackColor(activePowerName)}} /> Power in {year}</div>
          <h2>{activePowerName}</h2>
          <div className="atlas-power-meta">{activeKingdom?.type && <span>{activeKingdom.type}</span>}{activeKingdom?.startYear && <span>{activeKingdom.startYear}–{activeKingdom.endYear || "?"}</span>}<span>{activePower?.districts || 0} mapped districts</span></div>
          {activeRuler && <div className="atlas-hook history"><small>Ruler in {year}</small><strong>{activeRuler.ruler}</strong><em>{activeRuler.start}–{activeRuler.end}</em>{activeRuler.note && <p>{activeRuler.note}</p>}</div>}
          {(activeKingdom?.description || activeKingdom?.notableRulers) && <div className="atlas-detail-section"><h3>Polity snapshot</h3><p>{activeKingdom.description || activeKingdom.notableRulers}</p></div>}
          <div className="atlas-history-facts">{activeKingdom?.capital && <span><small>Capital</small><strong>{activeKingdom.capital}</strong></span>}<span><small>Mapped extent</small><strong>{Math.round(activePower?.area || 0).toLocaleString("en-IN")} km²</strong></span></div>
          {nearbyRulers.length > 0 && <div className="atlas-detail-section"><h3>Ruler sequence</h3><div className="atlas-ruler-sequence">{nearbyRulers.map((ruler) => <button key={`${ruler.ruler}-${ruler.start}`} className={ruler === activeRuler ? "on" : ""} onClick={() => changeYear(Math.max(data.minYear, ruler.start))}><span>{ruler.ruler}</span><small>{ruler.start}–{ruler.end}</small></button>)}</div></div>}
          <div className="atlas-detail-section"><h3>Major contemporaries</h3><div className="atlas-peer-powers">{yearModel.powers.filter((power) => power.name !== activePowerName).slice(0,4).map((power) => <button key={power.name} onClick={() => choosePower(power.name)}>{power.name}</button>)}</div></div>
          <div className="atlas-upsc-lens compact"><span>{examLens.paper}</span><p><strong>Prelims focus</strong>Capital, ruler, region and contemporaries.</p></div>
        </> : <>
          <div className="atlas-detail-kicker"><span className="history-year-color" /> India in {year}</div>
          <h2>{era.label}</h2>
          <p className="atlas-detail-loc"><Icon name="map" size={14} /> {yearModel.powers.length} powers across {yearModel.assignments.size} mapped districts</p>
          <div className="atlas-era-context"><small>Period context</small><p>{era.focus}</p></div>
          <div className="atlas-detail-section"><h3>Largest mapped powers</h3><div className="atlas-top-powers">{yearModel.powers.slice(0,5).map((power, index) => <button key={power.name} onClick={() => choosePower(power.name)}><b>{index + 1}</b><span>{power.name}<small>{Math.round(power.area).toLocaleString("en-IN")} km²</small></span></button>)}</div></div>
          {transitions.length > 0 && <div className="atlas-detail-section"><h3>Territorial changes in {year}</h3><div className="atlas-transition-list">{transitions.slice(0,4).map((item) => <button key={`${item.from}-${item.to}`} onClick={() => choosePower(item.to)}><span>{item.from}</span><Icon name="arrowR" size={12} /><strong>{item.to}</strong><b>{item.count}</b></button>)}</div></div>}
          <div className="atlas-detail-section"><h3>Events on the map</h3>{yearModel.events.length ? <div className="atlas-year-events">{yearModel.events.slice(0,5).map((event, index) => <button key={`${event.text}-${index}`} onClick={() => setSelectedEvent(event)}><i />{event.text}</button>)}</div> : <p>No geocoded event is recorded for this year. The territory map remains available.</p>}</div>
          <div className="atlas-upsc-lens"><span>{examLens.paper}</span><p><strong>Prelims lens</strong>{examLens.prelims}</p><p><strong>Mains lens</strong>{examLens.mains}</p></div>
        </>}
        </div>
        <div className="atlas-history-credit"><Icon name="info" size={13} /><span>Historical reconstruction adapted from <a href="https://www.bharatrajya.com/" target="_blank" rel="noreferrer">BharatRajya</a>, released under <a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noreferrer">CC0 1.0</a>.</span></div>
      </aside>
    </div>}
    <p className="atlas-disclaimer"><Icon name="info" size={14} /> Historical frontiers are approximate and shown through modern district shapes for learning—not as legal or political claims. Consult the cited scholarship for research use.</p>
  </main>;
}

function CurrentAtlas({ onModeChange }) {
  const [scope, setScope] = useStateAtlas("world");
  const [activeLayers, setActiveLayers] = useStateAtlas(["current"]);
  const [query, setQuery] = useStateAtlas("");
  const [news, setNews] = useStateAtlas(null);
  const [newsError, setNewsError] = useStateAtlas("");
  const [weekId, setWeekId] = useStateAtlas("");
  const [riverSystem, setRiverSystem] = useStateAtlas("all");
  const [selected, setSelected] = useStateAtlas(null);
  const [atlasMode, setAtlasMode] = useStateAtlas("explore");
  const [drillIndex, setDrillIndex] = useStateAtlas(0);
  const [drillRevealed, setDrillRevealed] = useStateAtlas(false);
  const [drillMessage, setDrillMessage] = useStateAtlas("");
  const [drillDone, setDrillDone] = useStateAtlas(() => {
    try { return JSON.parse(window.localStorage.getItem("pariksha:atlas-drill-v1") || "{}"); } catch { return {}; }
  });

  const newsWeeks = news?.weeks || [];
  const newsFeatures = news?.features || [];

  useEffectAtlas(() => {
    window.localStorage.setItem("pariksha:atlas-drill-v1", JSON.stringify(drillDone));
  }, [drillDone]);

  useEffectAtlas(() => {
    let cancelled = false;
    loadAtlasNews().then((loaded) => {
      if (cancelled) return;
      setNews(loaded);
      const firstWeek = loaded.weeks[0]?.id || "";
      setWeekId(firstWeek);
      setSelected(loaded.features.find((item) => item.weekId === firstWeek && item.scope === "world") || null);
    }).catch((error) => { if (!cancelled) setNewsError(error.message); });
    return () => { cancelled = true; };
  }, []);

  const layerDefs = useMemoAtlas(() => window.ATLAS_LAYER_DEFS.filter((item) => item.scopes.includes(scope)), [scope]);
  const scopeFeatures = useMemoAtlas(() => {
    const current = newsFeatures.filter((feature) => feature.scope === scope && feature.weekId === weekId);
    const knowledge = window.ATLAS_KNOWLEDGE.filter((feature) => atlasFeatureScope(feature) === scope);
    return [...current, ...knowledge, ...(scope === "india" ? atlasRiverReferenceFeatures() : [])];
  }, [news, scope, weekId]);
  const weekFeatures = useMemoAtlas(() => newsFeatures.filter((feature) => feature.layer === "current" && feature.scope === scope && feature.weekId === weekId), [newsFeatures, scope, weekId]);
  const drillKey = `${weekId}:${scope}`;
  const completedIds = drillDone[drillKey] || [];
  const drillTarget = weekFeatures[drillIndex] || weekFeatures[0] || null;
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
    setSelected(newsFeatures.find((item) => item.scope === nextScope && item.weekId === weekId) || null);
    setDrillIndex(0); setDrillRevealed(false); setDrillMessage("");
  }
  function changeWeek(nextWeek) {
    setWeekId(nextWeek);
    setSelected(newsFeatures.find((item) => item.scope === scope && item.weekId === nextWeek) || null);
    setDrillIndex(0); setDrillRevealed(false); setDrillMessage("");
  }
  function startDrill() {
    setAtlasMode("drill");
    setActiveLayers(["current"]);
    setDrillIndex(0);
    setDrillRevealed(false);
    setDrillMessage("");
  }
  function markDrillDone(feature = drillTarget) {
    if (!feature) return;
    setDrillDone((current) => ({ ...current, [drillKey]: Array.from(new Set([...(current[drillKey] || []), feature.id])) }));
  }
  function nextDrill() {
    if (!drillTarget) return;
    markDrillDone();
    setDrillIndex((index) => Math.min(index + 1, Math.max(0, weekFeatures.length - 1)));
    setDrillRevealed(false);
    setDrillMessage("");
  }
  function handleMapClick(latlng) {
    if (atlasMode !== "drill" || !drillTarget?.lat || !drillTarget?.lon) return;
    const distance = Math.sqrt((latlng.lat - drillTarget.lat) ** 2 + ((latlng.lng - drillTarget.lon) * Math.cos(drillTarget.lat * Math.PI / 180)) ** 2);
    const threshold = scope === "india" ? 3.2 : 7.5;
    if (distance <= threshold) {
      markDrillDone(); setDrillRevealed(true); setDrillMessage("Good locate — the place is in the right region."); setSelected(drillTarget);
    } else setDrillMessage("Not quite. Use the clue and try the map again, or reveal the answer when ready.");
  }
  const drillMapFeatures = atlasMode === "drill" ? (drillRevealed && drillTarget ? [drillTarget] : []) : mapFeatures;
  const drillCompleted = completedIds.length;
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
  const activeWeek = newsWeeks.find((week) => week.id === weekId) || null;
  const selectedWeek = selected?.weekId ? newsWeeks.find((week) => week.id === selected.weekId) : null;
  return (
    <main className="atlas-page atlas-page-v2">
      <header className="atlas-hero">
        <div>
          <div className="eyebrow small"><span className="eyebrow-line" /> Interactive UPSC geography</div>
          <h1>News Atlas</h1>
          <p>Current affairs on a proper political map—plus the static geography that turns a location into an exam-ready mental model.</p>
        </div>
        <div className="atlas-hero-actions"><AtlasModeSwitch mode="news" onChange={onModeChange} /><div className="atlas-freshness"><span className="atlas-live-dot" /><span><small>Selected news set</small><strong>{activeWeek ? activeWeek.label.replace("Week of ", "") : "Loading…"}</strong><em>Local Places in News notes</em></span></div></div>
      </header>

      {!news && !newsError && <div className="atlas-history-loading"><span className="atlas-loading-ring" /><strong>Loading this week's places in news…</strong><small>Fetched only when you open the Atlas.</small></div>}
      {newsError && <div className="atlas-history-loading error"><Icon name="info" size={22} /><strong>{newsError}</strong><button className="btn btn-outline sm" onClick={() => window.location.reload()}>Reload page</button></div>}

      {news && <div className="atlas-shell atlas-shell-v2">
        <aside className="atlas-controls" aria-label="Map controls">
          <div className="atlas-scope" role="tablist" aria-label="Map scope">
            <button className={scope === "world" ? "on" : ""} onClick={() => changeScope("world")}><Icon name="map" size={15} /> World</button>
            <button className={scope === "india" ? "on" : ""} onClick={() => changeScope("india")}><Icon name="target" size={15} /> India</button>
          </div>
          <label className="atlas-search"><Icon name="search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this atlas…" /></label>
          <label className="atlas-week-select"><span>Places in News week</span><select value={weekId} onChange={(event) => changeWeek(event.target.value)} aria-label="Places in News week">{newsWeeks.map((week) => <option key={week.id} value={week.id}>{week.label}</option>)}</select><small>{activeWeek?.source || ""}</small></label>
          <div className="atlas-atlas-mode" role="tablist" aria-label="News Atlas activity">
            <button className={atlasMode === "explore" ? "on" : ""} onClick={() => setAtlasMode("explore")}><Icon name="layers" size={13} /> Explore</button>
            <button className={atlasMode === "drill" ? "on" : ""} onClick={startDrill}><Icon name="target" size={13} /> Map drill</button>
          </div>
          {atlasMode === "drill" ? <div className="atlas-drill-card">
            <div className="atlas-drill-progress"><span>{drillCompleted}/{weekFeatures.length} identified</span><b>{weekFeatures.length ? Math.round((drillCompleted / weekFeatures.length) * 100) : 0}%</b></div>
            <div className="atlas-drill-bar"><i style={{ width:`${weekFeatures.length ? (drillCompleted / weekFeatures.length) * 100 : 0}%` }} /></div>
            <small>Read the clue, click the approximate location on the map, then reveal and continue.</small>
          </div> : <div className="atlas-filter-head"><span>Knowledge layers</span><strong>{activeLayers.length}</strong></div>}
          {atlasMode !== "drill" && <>
          <div className="atlas-layer-list">
            {layerDefs.map((def) => <label key={def.id} className={activeLayers.includes(def.id) ? "on" : ""}>
              <input type="checkbox" checked={activeLayers.includes(def.id)} onChange={() => toggleLayer(def.id)} />
              <span className="atlas-layer-swatch" style={{ background:def.color }} />
              <span>{def.label}</span><strong>{layerCount(def)}</strong>
            </label>)}
          </div>
          {riversOn && <div className="atlas-river-system-picker"><span>Visualise one basin</span>{ATLAS_RIVER_SYSTEMS.map((system) => <button key={system.id} className={riverSystem === system.id ? "on" : ""} onClick={() => changeRiverSystem(system.id)}><i style={{background:system.color}} />{system.label}</button>)}</div>}
          </>}
          <div className="atlas-place-list atlas-place-list-v2">
            {atlasMode === "drill" ? weekFeatures.map((feature, index) => <button key={feature.id} className={index === drillIndex ? "on" : ""} onClick={() => { setDrillIndex(index); setDrillRevealed(false); setDrillMessage(""); }}>
              <span style={{ background: completedIds.includes(feature.id) ? "var(--green)" : "var(--saffron)" }} /><span><strong>{completedIds.includes(feature.id) ? "✓ " : `${index + 1}. `}{feature.name}</strong><small>{feature.hook || atlasFeatureSub(feature)}</small></span><Icon name="chevR" size={14} />
            </button>) : listFeatures.slice(0, 80).map((feature) => <button key={`${feature.layer}-${feature.id}`} className={selected?.id === feature.id ? "on" : ""} onClick={() => setSelected(feature)}>
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
            <span className="atlas-stage-hint">{atlasMode === "drill" ? "Click the map to locate the place" : "Scroll to zoom · drag to move"}</span>
          </div>
          <div className="atlas-map-wrap atlas-map-wrap-v2">
            <AtlasLeafletMap scope={scope} features={drillMapFeatures} boundariesOn={boundariesOn} riversOn={riversOn} riverSystem={riverSystem} selected={selected} onSelect={setSelected} onMapClick={handleMapClick} />
            <div className="atlas-map-key">{activeLayers.filter((id) => id !== "boundaries").map((id) => { const def = atlasLayerDef(id); return def && <span key={id}><i style={{background:def.color}} />{def.short}</span>; })}</div>
            {riversOn && <div className="atlas-river-legend"><span><i className="main" /> Main stem</span><span><i className="tributary" /> Tributary</span><strong>{ATLAS_RIVER_SYSTEMS.find((item) => item.id === riverSystem)?.label}</strong></div>}
          </div>
        </section>

        <aside className="atlas-detail" aria-live="polite">
          {atlasMode === "drill" && drillTarget ? <>
            <div className="atlas-detail-kicker"><span style={{ background:"var(--saffron)" }} /> Weekly map drill</div>
            <h2>{drillRevealed ? drillTarget.name : `Place ${drillIndex + 1} of ${weekFeatures.length}`}</h2>
            {!drillRevealed ? <>
              <div className="atlas-drill-prompt"><small>LOCATE FROM THE CLUE</small><strong>{drillTarget.hook || "Use the regional clue in the note."}</strong><p>{drillTarget.locate || drillTarget.fact}</p></div>
              <button className="btn btn-primary atlas-drill-action" onClick={() => { markDrillDone(); setDrillRevealed(true); setSelected(drillTarget); }}>Reveal place</button>
            </> : <>
              <p className="atlas-detail-loc"><Icon name="map" size={14} /> {atlasFeatureSub(drillTarget)}{drillTarget.country ? ` · ${drillTarget.country}` : ""}</p>
              <div className="atlas-drill-success">{drillMessage || "Place revealed — connect it to the surrounding physical and political geography."}</div>
              <div className="atlas-detail-section"><h3>Why in news</h3><p>{drillTarget.fact}</p></div>
              {drillTarget.locate && <div className="atlas-detail-section"><h3>Locate it</h3><p>{drillTarget.locate}</p></div>}
              <button className="btn btn-primary atlas-drill-action" onClick={nextDrill}>{drillIndex + 1 < weekFeatures.length ? "Next place" : "Review the week"}</button>
            </>}
            {drillMessage && !drillRevealed && <p className="atlas-drill-message">{drillMessage}</p>}
          </> : selected ? <>
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
      </div>}
      <p className="atlas-disclaimer"><Icon name="info" size={14} /> Boundary data: Natural Earth India point-of-view world layer and geoBoundaries/DataMeet India ADM1. River centrelines: Natural Earth 1:10m.</p>
    </main>
  );
}

function NewsAtlas() {
  const [mode, setMode] = useStateAtlas("news");
  return mode === "history" ? <HistoricalAtlas onModeChange={setMode} /> : <CurrentAtlas onModeChange={setMode} />;
}

Object.assign(window, { NewsAtlas });
