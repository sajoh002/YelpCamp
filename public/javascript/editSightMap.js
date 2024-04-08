mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v12",
  center: sight.geometry.coordinates,
  zoom: 10,
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker({
  draggable: true,
  color: "#3d0a91",
})
  .setLngLat(sight.geometry.coordinates)
  .addTo(map);

function onDragEnd() {
  const lngLat = marker.getLngLat();
  latitude.value = lngLat.lat;
  longitude.value = lngLat.lng;
}

marker.on("dragend", onDragEnd);
