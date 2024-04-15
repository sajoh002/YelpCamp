const typeSelect = document.getElementById("type");
const distance = document.querySelector("#distanceInput");
const difficulty = document.querySelector("#difficultyInput");

type.addEventListener("change", (event) => {
  if (event.target.value.includes("Hike")) {
    distance.classList.remove("d-none");
    difficulty.classList.remove("d-none");
  } else {
    distance.classList.add("d-none");
    difficulty.classList.add("d-none");
  }
});
