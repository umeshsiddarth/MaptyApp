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

// let map,mapEvent; Used this earlier before implementing the class.

class App {
  #map;
  #mapEvent;
  constructor() {
    // We are adding this in cosntructor instead of calling after creating the App is because we need this method to be called immediately when the page is loaded.
    this._getLocation();

    form.addEventListener("submit", this._newWorkout.bind(this)); // We use bind(this) in most of the event listeners inside class so that it points to the correct this and not the element to which the event handler is attached.
    inputType.addEventListener("change", this._toggleElevationField);
  }

  _getLocation() {
    // syntax navigator.geolocation.getCurrentPosition(success Callback fn, error callback fn)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          // We are adding bind(this) to loadMap function because it is triggered by API and it is treated as a normal function call. Normal function calls return undefined so we need to bind this keyword for our methods to work properly.
          alert("Could not get your location");
        }
      );
    }
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords; // Object Destructuring
    // const longitude = position.coords.longitude; // Normal way of getting properties from object using key
    // console.log(`https://www.google.com/maps/@${latitude},${longitude}`); // Reference for google maps

    // Implementing Leaflet library. Added stlesheet and script in HTML file

    this.#map = L.map("map").setView([latitude, longitude], 13);
    // Different L.tileLayer can be found here: https://leaflet-extras.github.io/leaflet-providers/preview/
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>',
    }).addTo(this.#map);

    L.marker([latitude, longitude])
      .addTo(this.#map)
      .bindPopup("A pretty CSS popup")
      .openPopup();

    // map is created by Leaflet and it comes with its own methods.
    // Setting Marker
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    // Render a form when clicked on a location
    form.classList.remove("hidden");
    inputDistance.focus(); // This makes the form ready to use by putting a cursor in the distance box
  }

  _toggleElevationField() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();
    // Clear Input fields
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";

    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
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
  }
}

class Workout {
  date = new Date();
  id = String(Date.now()).slice(-10); // We are using id here just for this local app. In real time it is not a good idea to use timestamp as id as there will many users trying to create the objects at the same time. We implement id so that we can search something using these unique ids.
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lon]
    this.distance = distance; // Kms
    this.duration = duration; // mins
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
const app = new App();
