mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v12",
  center: campground.geometry.coordinates,
  zoom: 11,
});

const marker = new mapboxgl.Marker({
  color: "#3d0a91",
})
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h5>${campground.title}</h5><p>${campground.location}</p>`
    )
  )
  .addTo(map);
