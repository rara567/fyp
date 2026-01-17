// ===============================
// MATIKAN SEMUA MARKER LEAFLET
// ===============================
L.Marker.prototype.options.icon = L.divIcon({ className: 'no-marker' });

// ===============================
// KOORDINAT PUO
// ===============================
var puoLatLng = [4.5886, 101.1261];

// ===============================
// BASEMAP LAYERS
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
// INITIAL ZOOM BERGANTUNG PERANTI
// ===============================
var initialZoom = window.innerWidth <= 768 ? 17 : 16;

// ===============================
// INITIALIZE MAP
// ===============================
var map = L.map('map', {
    center: puoLatLng,
    zoom: initialZoom,
    minZoom: 5,
    maxZoom: 22,
    scrollWheelZoom: true,
    touchZoom: true,
    doubleClickZoom: true,
    layers: [osm]
});

// ===============================
// LAYER SWITCHER
// ===============================
var baseMaps = { "OpenStreetMap": osm, "Satelit": satellite };
L.control.layers(baseMaps, {}, { collapsed: false }).addTo(map);

// ===============================
// LEGEND
// ===============================
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = "<b>Legenda</b><br>PUO Campus Area";
    return div;
};
legend.addTo(map);

// ===============================
// MEASURE & SCALE
// ===============================
L.control.measure({
    primaryLengthUnit: 'meters',
    secondaryLengthUnit: 'kilometers',
    activeColor: '#0b5ed7',
    completedColor: '#198754',
    popupOptions: { autoPan: false }
}).addTo(map);

L.control.scale().addTo(map);

// ===============================
// SEARCH
// ===============================
L.Control.geocoder({
    defaultMarkGeocode: false,
    placeholder: 'Cari lokasi...'
}).on('markgeocode', function (e) {
    map.flyTo(e.geocode.center, 17);
}).addTo(map);

// ===============================
// EASY BUTTON – FOKUS PUO
// ===============================
if (L.easyButton) {
    L.easyButton({
        id: 'btn-puo',
        position: 'topright',
        type: 'replace',
        leafletClasses: true,
        states: [{
            stateName: 'focus-puo',
            onClick: function(btn, map){
                map.flyTo(puoLatLng, 18);
            },
            title: 'Fokus Kawasan PUO',
            icon: '<span class="puo-btn-text">PUO</span>'
        }]
    }).addTo(map);
}

// ===============================
// WELCOME MODAL – BUTANG MASUK
// ===============================
document.addEventListener("DOMContentLoaded", function () {
    var modal = document.getElementById("welcomeModal");
    var btnMasuk = document.getElementById("btnMasuk");

    if (!localStorage.getItem("welcomeShown")) {
        modal.style.display = "flex"; // modal muncul sepenuhnya
    } else {
        modal.style.display = "none";
    }

    btnMasuk.addEventListener("click", function () {
        modal.style.display = "none";
        localStorage.setItem("welcomeShown", "true");
        map.flyTo(puoLatLng, 18, { animate: true, duration: 1.2 });
    });
});

