mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v12",
  center: sight.geometry.coordinates,
  zoom: 14,
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker({
  color: "#3d0a91",
})
  .setLngLat(sight.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`<h5>${sight.title}</h5>`)
  )
  .addTo(map);
