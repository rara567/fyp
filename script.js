// ===============================
// Koordinat Politeknik Ungku Omar
// ===============================
var puoLatLng = [4.588556, 101.126056];

// ===============================
// Initialize Map (AUTO FOCUS PUO)
// ===============================
var map = L.map('map', {
  zoomControl: true
}).setView(puoLatLng, 18);

// ===============================
// Basemap
// ===============================
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap Contributors'
}).addTo(map);

// ===============================
// Marker PUO (Auto Highlight)
// ===============================
var puoMarker = L.marker(puoLatLng)
  .addTo(map)
  .bindPopup("<b>Politeknik Ungku Omar</b><br>Ipoh, Perak")
  .openPopup();

// ===============================
// Layer Containers
// ===============================
var bangunanLayer = L.geoJSON(null, {
  style: {
    color: "#0b5ed7",
    weight: 2,
    fillOpacity: 0.6
  },
  onEachFeature: function (feature, layer) {
    layer.bindPopup(
      "<b>" + feature.properties.nama + "</b><br>" +
      feature.properties.keterangan
    );
  }
});

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
// Load Data
// ===============================
fetch('data/bangunan.geojson')
  .then(res => res.json())
  .then(data => {
    bangunanLayer.addData(data);
    bangunanLayer.addTo(map);
  });

fetch('data/fasiliti.geojson')
  .then(res => res.json())
  .then(data => {
    fasilitiLayer.addData(data);
  });

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
// Search Location (Global)
// ===============================
var searchMarker;

L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: 'Cari lokasi (contoh: Hospital, Bandar, Alamat)'
})
.on('markgeocode', function(e) {
  var center = e.geocode.center;

  if (searchMarker) {
    map.removeLayer(searchMarker);
  }

  map.setView(center, 17);
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
  div.innerHTML += '<i style="background:#ff0000"></i> Lokasi Carian<br>';
  return div;
};

legend.addTo(map);


