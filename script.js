// ===============================
// Koordinat Pusat PUO
// ===============================
var puoCenter = [4.5886, 101.1261];

// ===============================
// Basemap Layers
// ===============================
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap Contributors',
  maxZoom: 22
});

var satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
  maxZoom: 22,
  subdomains: ['mt0','mt1','mt2','mt3'],
  attribution: '© Google Satellite'
});

// ===============================
// Initialize Map
// ===============================
var map = L.map('map', {
  center: puoCenter,
  zoom: 18,
  maxZoom: 20,
  scrollWheelZoom: true,
  touchZoom: true,
  doubleClickZoom: true,
  layers: [osm]
});

// ===============================
// Layer Switcher
// ===============================
var baseMaps = {
  "OpenStreetMap": osm,
  "Satelit": satellite
};

L.control.layers(baseMaps, {}, { collapsed: false }).addTo(map);

// ===============================
// Legend (Hanya gaya, tiada data)
// ===============================
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML = "<b>Legenda</b><br>PUO Campus Area";
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
// Search (TANPA marker)
// ===============================
L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: 'Cari lokasi...'
}).on('markgeocode', function(e){
  map.flyTo(e.geocode.center, 17);
}).addTo(map);

// ===============================
// Easy Button – Reset ke PUO
// ===============================
if (L.easyButton) {
  L.easyButton('PUO', function(btn, map){
    map.flyTo(puoCenter, 18);
  }, 'Fokus Kawasan PUO').addTo(map);
}

// ===============================
// Kawalan Zoom Minimum (lembut)
// ===============================
map.on('zoomend', function () {
  if (map.getZoom() < 14) {
    map.flyTo(puoCenter, 14, { animate: true, duration: 0.5 });
  }
});

