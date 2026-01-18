// MATIKAN MARKER DEFAULT
L.Marker.prototype.options.icon = L.divIcon({ className: 'no-marker' });

// KOORDINAT PUO
var puoLatLng = [4.5886, 101.1261];

// BASEMAP
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 22
});

var satellite = L.tileLayer(
  'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  { maxZoom: 22, subdomains: ['mt0','mt1','mt2','mt3'] }
);

// INIT MAP
var map = L.map('map', {
  center: puoLatLng,
  zoom: window.innerWidth <= 768 ? 17 : 16,
  layers: [osm]
});

// PLUGINS
L.control.scale().addTo(map);

L.control.measure({
  popupOptions: { autoPan: false }
}).addTo(map);

L.Control.geocoder({
  defaultMarkGeocode: false
})
.on('markgeocode', function(e){
  map.flyTo(e.geocode.center, 17);
})
.addTo(map);

// EASY BUTTON
L.easyButton({
  position: 'topright',
  states: [{
    icon: '<b>PUO</b>',
    title: 'Fokus PUO',
    onClick: function () {
      map.flyTo(puoLatLng, 18);
    }
  }]
}).addTo(map);

// SIDEBAR TOGGLE (MOBILE)
var btnSidebar = document.getElementById("btnSidebar");
var sidebar = document.getElementById("sidebar");

btnSidebar.onclick = function () {
  sidebar.classList.toggle("active");
  setTimeout(() => map.invalidateSize(), 300);
};

// FUNCTIONS
function focusPUO() {
  map.flyTo(puoLatLng, 18);
}

function changeBasemap(type) {
  map.eachLayer(function(layer){
    if (layer === osm || layer === satellite) {
      map.removeLayer(layer);
    }
  });
  (type === 'sat' ? satellite : osm).addTo(map);
}

// MODAL
document.addEventListener("DOMContentLoaded", function () {
  var modal = document.getElementById("welcomeModal");
  var btn = document.getElementById("btnMasuk");

  if (!localStorage.getItem("welcomeShown")) {
    modal.style.display = "flex";
  }

  btn.onclick = function () {
    modal.style.display = "none";
    localStorage.setItem("welcomeShown", "true");
    setTimeout(() => map.invalidateSize(), 300);
  };
});

// FIX SAIZ MAP DESKTOP
window.addEventListener("load", () => {
  map.invalidateSize();
});

