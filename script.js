// ===============================
// Koordinat PUO
// ===============================
var puoLatLng = [4.5886, 101.1261];

// ===============================
// Basemap Layers
// ===============================
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap Contributors',
    maxZoom: 22
});

var satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 22,
    subdomains:['mt0','mt1','mt2','mt3'],
    attribution: '© Google Satellite'
});

// ===============================
// Initialize Map
// ===============================
var map = L.map('map', {
    center: puoLatLng,
    zoom: 16,       // default zoom biasa
    minZoom: 5,
    maxZoom: 22,
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
// Legend (BERSIH)
// ===============================
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
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
// Search (TANPA marker / pin drop)
// ===============================
L.Control.geocoder({
  defaultMarkGeocode: false,
  placeholder: 'Cari lokasi...'
}).on('markgeocode', function(e){
  map.flyTo(e.geocode.center, 17);
}).addTo(map);

// ===============================
// Custom Icon PUO
// ===============================
var puoIcon = L.icon({
    iconUrl: 'icons/puo.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
});

// ===============================
// Marker PUO (Popup hanya muncul jika klik)
// ===============================
L.marker(puoLatLng, {icon: puoIcon})
  .addTo(map)
  .bindPopup("<b>Politeknik Ungku Omar</b><br>Ipoh, Perak");

// ===============================
// Easy Buttons – Fokus PUO sahaja
// ===============================
if(L.easyButton){
  L.easyButton('PUO', function(btn,map){
    map.flyTo(puoLatLng, 18);
  }, 'Fokus Kawasan PUO').addTo(map);
}

