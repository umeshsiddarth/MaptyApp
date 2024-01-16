"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
let inputDistance = document.querySelector(".form__input--distance");
let inputDuration = document.querySelector(".form__input--duration");
let inputCadence = document.querySelector(".form__input--cadence");
let inputElevation = document.querySelector(".form__input--elevation");

let map, mapEvent;

// syntax navigator.geolocation.getCurrentPosition(success Callback fn, error callback fn)
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords; // Object Destructuring
      // const longitude = position.coords.longitude; // Normal way of getting properties from object using key
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      // Implementing Leaflet library. Added stlesheet and scrip in HTML file

      map = L.map("map").setView([latitude, longitude], 13);
      // Different L.tileLayer can be found here: https://leaflet-extras.github.io/leaflet-providers/preview/
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
      }).addTo(map);

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("A pretty CSS popup.<br> Easily customizable.")
        .openPopup();

      // map is created by Leaflet and it comes with its own methods.
      // Setting Marker
      map.on("click", function (mapE) {
        mapEvent = mapE;
        // Render a form when clicked on a location
        form.classList.remove("hidden");
        inputDistance.focus(); // This makes the form ready to use by putting a curson in the distance box
      });
    },
    function () {
      alert("Could not get your location");
    }
  );
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  // Clear Input fields
  inputDistance.value =
    inputDuration.value =
    inputCadence.value =
    inputElevation.value =
      "";

  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("Workout")
    .openPopup();
  form.classList.add("hidden");
});

inputType.addEventListener("change", function () {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});
