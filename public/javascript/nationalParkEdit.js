window.addEventListener("load", (event) => {
  if (nationalPark.pricePer === "Per Vehicle") {
    document.querySelector("#vehicle").selected = true;
  } else {
    document.querySelector("#person").selected = true;
  }

  document.querySelector(`#${nationalPark.state}`).selected = true;
});
