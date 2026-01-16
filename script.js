// ===============================
// MATIKAN SEMUA MARKER LEAFLET
// ===============================
L.Marker.prototype.options.icon = L.divIcon({
    className: 'no-marker'
});

// ===============================
// Koordinat Pusat PUO
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
    subdomains: ['mt0','mt1','mt2','mt3'],
    attribution: '© Google Satellite'
});

// ===============================
// Tentukan zoom awal ikut peranti
// ===============================
var initialZoom = 16; // desktop
if (window.innerWidth <= 768) {
    initialZoom = 17; // telefon
}

// ===============================
// Initialize Map
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
// Layer Switcher
// ===============================
var baseMaps = {
    "OpenStreetMap": osm,
    "Satelit": satellite
};
L.control.layers(baseMaps, {}, { collapsed: false }).addTo(map);

// ===============================
// Legend
// ===============================
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML = "<b>Legenda</b><br>PUO Campus Area";
    return div;
};
legend.addTo(map);

// ===============================
// Measure & Scale (TIADA AUTO PAN)
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
// Search (TANPA MARKER)
// ===============================
L.Control.geocoder({
    defaultMarkGeocode: false,
    placeholder: 'Cari lokasi...'
}).on('markgeocode', function (e) {
    map.flyTo(e.geocode.center, 17);
}).addTo(map);

// ===============================
// Easy Button – Fokus PUO
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

    // Papar popup sekali sahaja
    if (!localStorage.getItem("welcomeShown")) {
        modal.style.display = "flex";
    } else {
        modal.style.display = "none";
    }

    btnMasuk.addEventListener("click", function () {
        modal.style.display = "none";
        localStorage.setItem("welcomeShown", "true");

        // Zoom automatik ke PUO selepas masuk
        map.flyTo(puoLatLng, 18, {
            animate: true,
            duration: 1.2
        });
    });
});
