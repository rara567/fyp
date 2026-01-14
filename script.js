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
  maxZoom: 22,
  minZoom: 5,
  scrollWheelZoom: true,
  touchZoom: true,
  doubleClickZoom: true
});

// ===============================
// Basemap
// ===============================
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap Contributors',
  maxZoom: 22,
  maxNativeZoom: 19
}).addTo(map);

// ===============================
// Marker PUO
// ===============================
var puoMarker = L.marker(puoLatLng, {
  icon: L.icon({
    iconUrl: 'icons/user.png', // pastikan fail marker.png ada dalam folder icons/
    iconSize: [40, 40]
  })
}).addTo(map).bindPopup("<b>Politeknik Ungku Omar</b><br>Ipoh, Perak").openPopup();

// ===============================
// Layer Bangunan
// ===============================
var bangunanLayer = L.geoJSON(null, {
  style: { color: "#0b5ed7", weight: 2, fillColor: "#0b5ed7", fillOpacity: 0.5 },
  onEachFeature: function(feature, layer) {
    var popupContent = "<b>" + feature.properties.nama + "</b><br>";
    if(feature.properties.gambar) popupContent += "<img src='" + feature.properties.gambar + "' width='150' style='border-radius:5px'><br>";
    if(feature.properties.keterangan) popupContent += feature.properties.keterangan;
    layer.bindPopup(popupContent);
    layer.on('click', function() { map.fitBounds(layer.getBounds()); });
  }
});

// ===============================
// Layer Fasiliti
// ===============================
var fasilitiLayer = L.geoJSON(null, {
  pointToLayer: function(feature, latlng) {
    var iconColor = "#198754"; // default hijau
    if(feature.properties.kategori === "Kedai") iconColor = "#ffc107"; // kuning
    if(feature.properties.kategori === "Ruang Rekreasi") iconColor = "#dc3545"; // merah
    return L.circleMarker(latlng, {
      radius: 8,
      fillColor: iconColor,
      color: "#000",
      weight: 1,
      fillOpacity: 0.9
    }).bindPopup("<b>" + feature.properties.nama + "</b><br>" + (feature.properties.keterangan || ""));
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
// Layer Control & Legend
// ===============================
var overlayMaps = {
  "Bangunan Kampus": bangunanLayer,
  "Fasiliti": fasilitiLayer
};
L.control.layers(null, overlayMaps, { collapsed: false }).addTo(map);

var legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
  var div = L.DomUtil.create('div', 'legend');
  div.innerHTML = "<b>Legenda</b><br>";
  div.innerHTML += '<i style="background:#0b5ed7"></i> Bangunan<br>';
  div.innerHTML += '<i style="background:#198754"></i> Fasiliti<br>';
  div.innerHTML += '<i style="background:#ffc107"></i> Kedai<br>';
  div.innerHTML += '<i style="background:#dc3545"></i> Ruang Rekreasi<br>';
  div.innerHTML += '<i style="background:#136aec"></i> Lokasi Pengguna<br>';
  return div;
};
legend.addTo(map);

// ===============================
// Measure & Scale
// ===============================
L.control.measure({
  primaryLengthUnit: 'meters',
  secondaryLengthUnit: 'kilometers',
  primaryAreaUnit: 'sqmeters',
  secondaryAreaUnit: 'hectares'
}).addTo(map);
L.control.scale().addTo(map);

// ===============================
// Search
// ===============================
var searchMarker;
L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: 'Cari lokasi...'
}).on('markgeocode', function(e){
  var center = e.geocode.center;
  if(searchMarker) map.removeLayer(searchMarker);
  map.flyTo(center, 19);
  searchMarker = L.marker(center).addTo(map)
                 .bindPopup(e.geocode.name).openPopup();
}).addTo(map);

// ===============================
// User Location Tracking
// ===============================
var userMarker, accuracyCircle;
var followUser = true;

function onLocationFound(e) {
  var latlng = e.latlng;
  var radius = e.accuracy;
  if(radius > 30) radius = 30; // hadkan radius bulatan

  if(!userMarker){
    userMarker = L.marker(latlng, {
      icon: L.icon({ iconUrl: 'icons/user.png', iconSize: [30,30] }) // pastikan fail user.png ada dalam folder icons/
    }).addTo(map).bindPopup("📍 Lokasi Anda");
  } else userMarker.setLatLng(latlng);

  if(!accuracyCircle){
    accuracyCircle = L.circle(latlng, {
      radius: radius,
      color: '#136aec',
      fillColor: '#136aec',
      fillOpacity: 0.2
    }).addTo(map);
  } else accuracyCircle.setLatLng(latlng).setRadius(radius);

  if(followUser) map.flyTo(latlng, 19, { animate: true, duration: 1.2 });
}

function onLocationError(e){
  alert("Sila benarkan akses lokasi untuk menggunakan fungsi ini.");
}

map.locate({ watch:true, setView:false, maxZoom:19, enableHighAccuracy:true });
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

// ===============================
// Butang Fokus & Toggle Live Tracking
// ===============================
if(L.easyButton){
  L.easyButton('fa-university', function(btn,map){
    map.flyTo(puoLatLng, 19);
  }, 'Fokus ke PUO').addTo(map);

  L.easyButton('fa-location-arrow', function(btn,map){
    followUser = !followUser;
    if(followUser && userMarker) map.flyTo(userMarker.getLatLng(), 19);
  }, 'Toggle Live Tracking').addTo(map);
}


