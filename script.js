L.Marker.prototype.options.icon = L.divIcon({ className: 'no-marker' });

var puoLatLng = [4.5886, 101.1261];

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 22 });
var satellite = L.tileLayer(
  'https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
  { maxZoom: 22, subdomains: ['mt0','mt1','mt2','mt3'] }
);

var map = L.map('map', {
  center: puoLatLng,
  zoom: 17,
  layers: [osm]
});

L.control.scale().addTo(map);

L.control.measure({
  primaryLengthUnit: 'meters',
  secondaryLengthUnit: 'kilometers'
}).addTo(map);

L.easyButton('📍', () => map.flyTo(puoLatLng, 18)).addTo(map);

var btnSidebar = document.getElementById("btnSidebar");
var sidebar = document.getElementById("sidebar");
btnSidebar.onclick = () => {
  sidebar.classList.toggle("active");
  setTimeout(() => map.invalidateSize(), 300);
};

function focusPUO() {
  map.flyTo(puoLatLng, 18);
}

function changeBasemap(type) {
  map.eachLayer(l => { if (l === osm || l === satellite) map.removeLayer(l); });
  (type === 'sat' ? satellite : osm).addTo(map);
}

// ===== USER LOCATION =====
var userLatLng = null;
var userMarker = null;

map.locate({ setView: false });
map.on('locationfound', e => {
  userLatLng = e.latlng;
  userMarker = L.circleMarker(userLatLng, {
    radius: 8,
    color: "#0d6efd",
    fillOpacity: 1
  }).addTo(map).bindPopup("Lokasi Anda");
});

// ===== ROUTING =====
var routingControl = null;
function navigateToBuilding(dest, name) {
  if (!userLatLng) return alert("Lokasi pengguna belum dikesan");

  if (routingControl) map.removeControl(routingControl);

  routingControl = L.Routing.control({
    waypoints: [userLatLng, dest],
    router: L.Routing.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1'
    }),
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true
  }).addTo(map);
}

// ===== LOAD BUILDINGS =====
var buildingIndex = [];

fetch("data/buildings.geojson")
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      style: { color:"#0b5ed7", fillColor:"#198754", fillOpacity:0.55 },
      onEachFeature: (f, l) => {
        var c = l.getBounds().getCenter();
        buildingIndex.push({ name: f.properties.name.toLowerCase(), latlng: c });

        l.bindPopup(`
          <strong>${f.properties.name}</strong><br>
          <button class="popup-btn"
            onclick="navigateToBuilding(L.latLng(${c.lat},${c.lng}),'${f.properties.name}')">
            🚶 Arah ke sini
          </button>
        `);
      }
    }).addTo(map);
  });

// ===== SEARCH =====
document.getElementById("searchBox").addEventListener("keyup", e => {
  if (e.key === "Enter") {
    var q = e.target.value.toLowerCase();
    var b = buildingIndex.find(x => x.name.includes(q));
    if (b) {
      map.flyTo(b.latlng, 18);
      navigateToBuilding(b.latlng, q);
    } else alert("Bangunan tidak ditemui");
  }
});

// ===== MODAL =====
document.addEventListener("DOMContentLoaded", () => {
  var modal = document.getElementById("welcomeModal");
  var btn = document.getElementById("btnMasuk");
  if (!localStorage.getItem("welcomeShown")) modal.style.display = "flex";
  btn.onclick = () => {
    modal.style.display = "none";
    localStorage.setItem("welcomeShown", "true");
  };
});

