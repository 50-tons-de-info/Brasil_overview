function initLeafletMap() {
  mapMode = 'leaflet';
  showPrimaryMap();
  var leafletMapEl = document.getElementById('google-map');
  if(!leafletMapEl || !window.L || !window.L.map) return;
  if(map) {
    map.remove();
    map = null;
  }
  map = L.map(leafletMapEl, { zoomControl: true, preferCanvas: true }).setView([DEFAULT_CENTER.lat, DEFAULT_CENTER.lng], 14);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);
  map.on('click', function(event) {
    tempLat = event.latlng.lat;
    tempLng = event.latlng.lng;
    selected = null;
    renderMarkers();
    openModal(null);
  });
  renderMarkers();
}