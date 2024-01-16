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
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

// syntax navigator.geolocation.getCurrentPosition(success Callback fn, error callback fn)
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords; // Object Destructuring
      // const longitude = position.coords.longitude; // Normal way of getting properties from object using key
      console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

      // Implementing Leaflet library. Added stlesheet and scrip in HTML file

      const map = L.map("map").setView([latitude, longitude], 13);
      // Different L.tileLayer can be found here: https://leaflet-extras.github.io/leaflet-providers/preview/
      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
      }).addTo(map);

      L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("A pretty CSS popup.<br> Easily customizable.")
        .openPopup();
    },
    function () {
      alert("Could not get your location");
    }
  );
}
