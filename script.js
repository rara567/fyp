/* ===============================
   Initialize Map
================================ */
var map = L.map('map').setView([3.139, 101.6869], 12);

/* ===============================
   Basemap Layers
================================ */
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap Contributors'
});

var satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: '© Esri' }
);

osm.addTo(map);

/* ===============================
   Layer Control (Basemap Only)
================================ */
var baseMaps = {
  "OpenStreetMap": osm,
  "Satellite": satellite
};

L.control.layers(baseMaps, null, { collapsed: false }).addTo(map);

/* ===============================
   Legend (Static / Example)
================================ */
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML += "<b>Legend (Sample)</b><br>";
  div.innerHTML += '<i style="background:#1f78b4"></i> Kawasan Kajian<br>';
  div.innerHTML += '<i style="background:#33a02c"></i> Infrastruktur<br>';
  div.innerHTML += '<i style="background:#e31a1c"></i> Zon Sensitif<br>';
  return div;
};

legend.addTo(map);

/* ===============================
   Measure Tool
================================ */
L.control.measure({
  position: 'topleft',
  primaryLengthUnit: 'meters',
  secondaryLengthUnit: 'kilometers',
  primaryAreaUnit: 'sqmeters',
  secondaryAreaUnit: 'hectares'
}).addTo(map);

/* ===============================
   Scale Bar
================================ */
L.control.scale().addTo(map);
