// Pusatkan peta (contoh koordinat PUO)
var map = L.map('map').setView([4.5975, 101.0901], 17);

// Base map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Load bangunan
fetch('data/bangunan.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data, {
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<b>" + feature.properties.nama + "</b><br>" +
          feature.properties.keterangan
        );
      }
    }).addTo(map);
  });

// Load fasiliti
fetch('data/fasiliti.geojson')
  .then(res => res.json())
  .then(data => {
    L.geoJSON(data).addTo(map);
  });