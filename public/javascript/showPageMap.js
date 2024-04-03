mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v12",
  center: nationalPark.geometry.coordinates,
  zoom: 11,
});

map.addControl(new mapboxgl.NavigationControl());

const marker = new mapboxgl.Marker({
  color: "#3d0a91",
})
  .setLngLat(nationalPark.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`<h5>${nationalPark.title}</h5>`)
  )
  .addTo(map);
