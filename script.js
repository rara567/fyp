// ===============================
// Koordinat & Kawasan PUO
// ===============================
var puoCenter = [4.5886, 101.1261];

var puoBounds = [
  [4.5800, 101.1150], // Southwest
  [4.5970, 101.1370]  // Northeast
];

// ===============================
// Basemap Layers
// ===============================
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap Contributors',
  maxZoom: 22,
  maxNativeZoom: 19
});

var satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 22,
  subdomains:['mt0','mt1','mt2','mt3'],
  attribution: '© Google Satellite'
});

// ===============================
// Initialize Map (Fokus PUO)
// ===============================
var map = L.map('map', {
  center: puoCenter,
  zoom: 18,
  minZoom: 17,
  maxZoom: 20,
  maxBounds: puoBounds,
  maxBoundsViscosity: 1.0,
  layers: [osm]
});

// ===============================
// Layer Switcher
// ===============================
var baseMaps = {
  "OpenStreetMap": osm,
  "Satelit": satellite
};

// ===============================
// Layer Bangunan
// ===============================
var bangunanLayer = L.geoJSON(null, {
  style: {
    color: "#0b5ed7",
    weight: 2,
    fillColor: "#0b5ed7",
    fillOpacity: 0.5
  },
  onEachFeature: function(feature, layer) {
    var popup = "<b>" + feature.properties.nama + "</b><br>";
    if(feature.properties.gambar){
      popup += "<img src='" + feature.properties.gambar +
               "' width='150' style='border-radius:5px'><br>";
    }
    layer.bindPopup(popup);
  }
});

// ===============================
// Layer Fasiliti (Tanpa Marker Biasa)
// ===============================
var fasilitiLayer = L.geoJSON(null, {
  pointToLayer: function(feature, latlng) {
    var color = "#198754";
    if(feature.properties.kategori === "Kedai") color = "#ffc107";
    if(feature.properties.kategori === "Ruang Rekreasi") color = "#dc3545";

    return L.circleMarker(latlng, {
      radius: 7,
      fillColor: color,
      color: "#000",
      weight: 1,
      fillOpacity: 0.9
    }).bindPopup("<b>" + feature.properties.nama + "</b>");
  }
});

// ===============================
// Load GeoJSON
// ===============================
fetch('data/bangunan.geojson')
  .then(r => r.json())
  .then(d => bangunanLayer.addData(d).addTo(map));

fetch('data/fasiliti.geojson')
  .then(r => r.json())
  .then(d => fasilitiLayer.addData(d).addTo(map));

// ===============================
// Overlay Control
// ===============================
L.control.layers(baseMaps, {
  "Bangunan Kampus": bangunanLayer,
  "Fasiliti": fasilitiLayer
}, { collapsed: false }).addTo(map);

// ===============================
// Legend (BERSIH – Tiada Lokasi Pengguna)
// ===============================
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML = `
    <b>Legenda</b><br>
    <i style="background:#0b5ed7"></i> Bangunan<br>
    <i style="background:#198754"></i> Fasiliti<br>
    <i style="background:#ffc107"></i> Kedai<br>
    <i style="background:#dc3545"></i> Ruang Rekreasi
  `;
  return div;
};
legend.addTo(map);

// ===============================
// Measure & Scale
// ===============================
L.control.measure({
  primaryLengthUnit: 'meters',
  secondaryLengthUnit: 'kilometers'
}).addTo(map);

L.control.scale().addTo(map);

// ===============================
// Search (TANPA marker / pin drop)
// ===============================
L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: 'Cari lokasi...'
}).on('markgeocode', function(e){
  map.flyTo(e.geocode.center, 19);
}).addTo(map);

// ===============================
// Easy Button – Fokus PUO Sahaja
// ===============================
if (L.easyButton) {
  L.easyButton('PUO', function(btn, map){
    map.flyTo(puoCenter, 18);
  }, 'Fokus Kawasan PUO').addTo(map);
}

