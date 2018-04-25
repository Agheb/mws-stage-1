import Lozad from "lozad";
import Normalize from "normalize.css/normalize.css";
import StarRating from "css-star-rating/css/star-rating.css";
import "./assets/css/styles.css";
import Data from "./assets/data/restaurants.json";
import Manifest from "./assets/data/manifest.json";
import DBHelper from "./assets/js/dbhelper";
import loadGoogleMapsApi from "load-google-maps-api";
import { oneLineTrim } from "common-tags";

let restaurants, neighborhoods, cuisines;
var map;
var googleMap;
var markers = [];
let InteractiveMapLoaded = false;

const observer = Lozad();
observer.observe();

const MapsOption = {
  key: "AIzaSyDXJhUDVZRlN4bLZm0nJbwsUUxRtCpRtQI",
  libraries: ["places"]
};

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", event => {
  loadGoogleMaps(400, "map");
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
let fetchNeighborhoods = () => {
  console.log("entering location");
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
let fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById("neighborhoods-select");
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement("option");
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
let fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
let fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById("cuisines-select");

  cuisines.forEach(cuisine => {
    const option = document.createElement("option");
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize Google map, called from HTML.
 */
const createStaticMapImage = (height, element) => {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  const url = oneLineTrim`
  https://maps.googleapis.com/maps/api/staticmap?center=40.722216,+-73.987501&
  zoom=12&
  scale=2&
  size=${width}x${height}&
  maptype=roadmap&format=png&
  visual_refresh=true&
  key=AIzaSyAI60PBarZdCiO-BYJqYvoDYBL8F68-PEU&
  markers=
  |40.683555,-73.966393|
  |40.713829,-73.989667|
  |40.747143,-73.985414|
  |40.722216,-73.987501|
  |40.705089,-73.933585|
  |40.674925,-74.016162|
  |40.727397,-73.983645|
  |40.726584,-74.002082|
  |40.743797,-73.950652|
  |40.743394,-73.954235|

  `;

  const mapsImage = `
  <img width="${width}px"
  src=${encodeURI(url)} alt="Google Map of 40.722216, -73.987501">
  `;
  document.getElementById(`${element}`).innerHTML = mapsImage;
};

const loadGoogleMaps = (height, element) => {
  // load static maps image for smaller devices
  if (window.matchMedia("(max-width:600px)").matches) {
    console.log("width smaller than 600px");
    createStaticMapImage(height, element);
    updateRestaurants();
  } else {
    console.log("width bigger than 600px");
    createInteractiveMap(MapsOption);
  }
};

const createInteractiveMap = options => {
  loadGoogleMapsApi(options)
    .then(googleMaps => {
      const loc = {
        lat: 40.722216,
        lng: -73.9875
      };
      map = new googleMaps.Map(document.getElementById("map"), {
        zoom: 12,
        center: loc,
        scrollwheel: false
      });
      updateRestaurants();
    })
    .catch(error => {
      console.error(error);
    });
};

/*
 * Update page and map for current restaurants.
 */

const NeighborhoodSelect = document.getElementById("neighborhoods-select");
const CuisinesSelect = document.getElementById("cuisines-select");
NeighborhoodSelect.addEventListener("change", () => {
  if (!InteractiveMapLoaded) {
    createInteractiveMap(MapsOption);
    InteractiveMapLoaded = true;
  } else {
    updateRestaurants();
  }
});

CuisinesSelect.addEventListener("change", () => {
  if (!InteractiveMapLoaded) {
    createInteractiveMap(MapsOption);
    InteractiveMapLoaded = true;
  } else {
    updateRestaurants();
  }
});

let updateRestaurants = () => {
  const cSelect = document.getElementById("cuisines-select");
  const nSelect = document.getElementById("neighborhoods-select");

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    (error, restaurants) => {
      if (error) {
        // Got an error!
        console.error(error);
      } else {
        resetRestaurants(restaurants);
        fillRestaurantsHTML();
      }
    }
  );
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
let resetRestaurants = restaurants => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById("restaurants-list");
  ul.innerHTML = "";

  // Remove all map markers

  if (typeof self.markers !== "undefined") {
    self.markers.forEach(m => m.setMap(null));
  }

  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
let fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById("restaurants-list");
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
    observer.observe();
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
let createRestaurantHTML = restaurant => {
  const li = document.createElement("li");

  const image = document.createElement("img");
  image.className = "restaurant-img lozad";
  const img = require(`./assets/data/img/${restaurant.photograph}`);
  image.setAttribute("data-src", img.src);
  image.setAttribute("data-srcset", img.srcSet);
  image.alt = `Image of ${restaurant.name} Restaurant`;
  li.append(image);

  const name = document.createElement("h2");
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement("p");
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement("p");
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement("a");
  more.innerHTML = "View Details";
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
let addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, map);
    google.maps.event.addListener(marker, "click", () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
    console.log(self.markers);
  });
};
