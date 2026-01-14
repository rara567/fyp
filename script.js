// ===============================
// Koordinat PUO
// ===============================
var puoLatLng = [4.5886, 101.1261];

// ===============================
// Initialize Map
// ===============================
var map = L.map('map', {
  center: puoLatLng,
  zoom: 18,
  maxZoom: 19,       // Sesuai dengan tiles
  minZoom: 5,
  zoomControl: false, 
  zoomSnap: 0.5,     // zoom lebih smooth
  zoomDelta: 0.5
});

// ===============================
// Custom Zoom Control Besar + Fokus PUO
// ===============================
var customZoom = L.control({ position: 'topright' });

customZoom.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'custom-zoom');
  div.style.background = 'white';
  div.style.padding = '5px';
  div.style.borderRadius = '5px';
  div.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
  div.style.display = 'flex';
  div.style.flexDirection = 'column';
  div.style.alignItems = 'center';
  
  // Zoom In
  var zoomIn = L.DomUtil.create('button', '', div);
  zoomIn.innerHTML = '+';
  zoomIn.style.fontSize = '25px';
  zoomIn.style.width = '50px';
  zoomIn.style.height = '50px';
  zoomIn.style.marginBottom = '5px';
  zoomIn.style.cursor = 'pointer';

  // Zoom Out
  var zoomOut = L.DomUtil.create('button', '', div);
  zoomOut.innerHTML = '-';
  zoomOut.style.fontSize = '25px';
  zoomOut.style.width = '50px';
  zoomOut.style.height = '50px';
  zoomOut.style.cursor = 'pointer';

  // Fokus PUO
  var focusPUO = L.DomUtil.create('button', '', div);
  focusPUO.innerHTML = 'PUO';
  focusPUO.style.fontSize = '18px';
  focusPUO.style.width = '50px';
  focusPUO.style.height = '50px';
  focusPUO.style.marginTop = '5px';
  focusPUO.style.cursor = 'pointer';

  // Event Buttons
  L.DomEvent.on(zoomIn, 'click', function(e) { map.zoomIn(); });
  L.DomEvent.on(zoomOut, 'click', function(e) { map.zoomOut(); });
  L.DomEvent.on(focusPUO, 'click', function(e) { map.flyTo(puoLatLng, 18, {animate:true,duration:1.2}); });

  return div;
};

customZoom.addTo(map);

// ===============================
// Basemap
// ===============================
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap Contributors',
  maxZoom: 19
}).addTo(map);

// ===============================
// Marker PUO
// ===============================
L.marker(puoLatLng)
  .addTo(map)
  .bindPopup("<b>Politeknik Ungku Omar</b><br>Ipoh, Perak")
  .openPopup();

// ===============================
// Bangunan Layer
// ===============================
var bangunanLayer = L.geoJSON(null, {
  style: { color: "#0b5ed7", weight: 2, fillColor: "#0b5ed7", fillOpacity: 0.5 },
  onEachFeature: function(feature, layer) {
    layer.bindPopup("<b>" + (feature.properties.nama || "Bangunan") + "</b><br>" + (feature.properties.keterangan || ""));
    layer.on('click', function() { map.fitBounds(layer.getBounds()); });
  }
});

// ===============================
// Fasiliti Layer
// ===============================
var fasilitiLayer = L.geoJSON(null, {
  pointToLayer: function(feature, latlng) {
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
// Load GeoJSON
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
// Search
// ===============================
var searchMarker; // Hanya satu marker search

L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: 'Cari lokasi'
})
.on('markgeocode', function(e) {
  var center = e.geocode.center;

  // Hapus marker search lama jika ada
  if(searchMarker) map.removeLayer(searchMarker);

  searchMarker = L.marker(center)
    .addTo(map)
    .bindPopup(e.geocode.name)
    .openPopup();

  map.flyTo(center, 17, {duration:1.5});
})
.addTo(map);

// ===============================
// Legend
// ===============================
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML += "<b>Legenda</b><br>";
  div.innerHTML += '<i style="background:#0b5ed7;width:15px;height:15px;display:inline-block;margin-right:5px;"></i> Bangunan<br>';
  div.innerHTML += '<i style="background:#198754;width:15px;height:15px;display:inline-block;margin-right:5px;"></i> Fasiliti<br>';
  div.innerHTML += '<i style="background:#136aec;width:15px;height:15px;display:inline-block;margin-right:5px;"></i> Lokasi Pengguna<br>';
  return div;
};
legend.addTo(map);

// ===============================
// User Location Tracking (Pin Tetap)
// ===============================
var userMarker, accuracyCircle;
var followUser = true;

map.on('mousedown touchstart', function() { followUser = false; });

function onLocationFound(e) {
  var latlng = e.latlng;
  var radius = Math.min(e.accuracy, 100);

  // Jika userMarker sudah ada, update lokasi sahaja
  if(!userMarker) {
    userMarker = L.marker(latlng).addTo(map).bindPopup("📍 Lokasi Anda");
  } else {
    userMarker.setLatLng(latlng);
  }

  // Bulatan ketepatan GPS
  if(!accuracyCircle) {
    accuracyCircle = L.circle(latlng, {
      radius: radius,
      color: '#136aec',
      fillColor: '#136aec',
      fillOpacity: 0.2
    }).addTo(map);
  } else {
    accuracyCircle.setLatLng(latlng).setRadius(radius);
  }

  if(followUser) {
    map.flyTo(latlng, 18, { animate:true, duration:1.2 });
  }
}

function onLocationError(e) { alert("Sila benarkan akses lokasi untuk menggunakan fungsi ini."); }

map.locate({ watch:true, setView:false, maxZoom:19, minZoom:5, enableHighAccuracy:true });
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

