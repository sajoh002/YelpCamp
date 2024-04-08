const typeSelect = document.getElementById("type");
const distance = document.querySelector("#distanceInput");
const difficulty = document.querySelector("#difficultyInput");
console.log(sight.type);

window.addEventListener("load", (event) => {
  if (sight.type === "Hike") {
    distance.classList.remove("d-none");
    difficulty.classList.remove("d-none");
  }
  document.querySelector(`#${sight.type}`).selected = true;
  document.querySelector(`#${sight.difficulty}`).selected = true;
});

type.addEventListener("change", (event) => {
  if (event.target.value === "Hike") {
    distance.classList.remove("d-none");
    difficulty.classList.remove("d-none");
  } else {
    distance.classList.add("d-none");
    difficulty.classList.add("d-none");
  }
});
