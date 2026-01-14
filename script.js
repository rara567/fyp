// ===============================
// Koordinat PUO (4 titik perpuluhan)
// ===============================
var puoLatLng = [4.5886, 101.1261];

// ===============================
// Initialize Map
// ===============================
var map = L.map('map').setView(puoLatLng, 18);

// ===============================
// Basemap
// ===============================
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap Contributors'
}).addTo(map);

// ===============================
// Marker PUO
// ===============================
L.marker(puoLatLng)
  .addTo(map)
  .bindPopup("<b>Politeknik Ungku Omar</b><br>Ipoh, Perak")
  .openPopup();

// ===============================
// Bangunan Layer (Polygon)
// ===============================
var bangunanLayer = L.geoJSON(null, {
  style: {
    color: "#0b5ed7",
    weight: 2,
    fillColor: "#0b5ed7",
    fillOpacity: 0.5
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<b>" + (feature.properties.nama || "Bangunan") + "</b><br>" +
      (feature.properties.keterangan || "")
    );

    layer.on('click', function () {
      map.fitBounds(layer.getBounds());
    });
  }
});

// ===============================
// Fasiliti Layer (Point)
// ===============================
var fasilitiLayer = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 6,
      fillColor: "#198754",
      color: "#000",
      weight: 1,
      fillOpacity: 0.8
    }).bindPopup("<b>" + feature.properties.nama + "</b>");
  }
});

// ===============================
// Load GeoJSON Data
// ===============================
fetch('data/bangunan.geojson')
  .then(res => res.json())
  .then(data => bangunanLayer.addData(data).addTo(map));

fetch('data/fasiliti.geojson')
  .then(res => res.json())
  .then(data => fasilitiLayer.addData(data).addTo(map));

// ===============================
// Layer Control
// ===============================
L.control.layers(null, {
  "Bangunan Kampus": bangunanLayer,
  "Fasiliti": fasilitiLayer
}, { collapsed: false }).addTo(map);

// ===============================
// Measure Tool
// ===============================
L.control.measure({
  primaryLengthUnit: 'meters',
  secondaryLengthUnit: 'kilometers',
  primaryAreaUnit: 'sqmeters',
  secondaryAreaUnit: 'hectares'
}).addTo(map);

// ===============================
// Scale Bar
// ===============================
L.control.scale().addTo(map);

// ===============================
// Search (Global)
// ===============================
var searchMarker;

L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: 'Cari lokasi'
})
.on('markgeocode', function(e) {
  var center = e.geocode.center;

  if (searchMarker) map.removeLayer(searchMarker);

  map.flyTo(center, 17, { duration: 1.5 });

  searchMarker = L.marker(center)
    .addTo(map)
    .bindPopup(e.geocode.name)
    .openPopup();
})
.addTo(map);

// ===============================
// Legend
// ===============================
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML += "<b>Legenda</b><br>";
  div.innerHTML += '<i style="background:#0b5ed7"></i> Bangunan<br>';
  div.innerHTML += '<i style="background:#198754"></i> Fasiliti<br>';
  return div;
};

legend.addTo(map);

