import Lozad from "lozad";
import Normalize from "normalize.css/normalize.css";
import StarRating from "css-star-rating/css/star-rating.css";
import "./assets/css/styles.css";
import "./assets/css/app.scss";
import "./assets/css/snackbar.scss";
import Manifest from "./assets/data/manifest.json";
import loadGoogleMapsApi from "load-google-maps-api";
import { oneLineTrim } from "common-tags";
import {
  loadRestaurants,
  getCuisines,
  getNeighborhoods,
  getRestaurantByCuisineNeighborhood,
  urlForRestaurant,
  mapMarkerForRestaurant
} from "./assets/js/db";
import { MapStyle, MapsConfig } from "./assets/js/map";
import { MDCIconToggle } from "@material/icon-toggle";
import { getParameterByName, FavouriteEndpoint } from "./assets/js/util";

let restaurants, neighborhoods, cuisines;
var map;
var markers = [];
let InteractiveMapLoaded;

const observer = Lozad();
observer.observe();

// listen for message from SW, if BackgroundSync was a sucess
if ("serviceWorker" in navigator) {
  // Handler for messages coming from the service worker
  navigator.serviceWorker.addEventListener("message", function(event) {
    if (event.data === "favorite-success") {
      import(/* webpackChunkName: "notification" */ "./assets/js/snackbar").then(
        snackbar => {
          snackbar.showNotification(
            "Your favourite restaurants were sent successfully"
          );
        }
      );
    } else {
      console.log("Client received unknown message: " + event.data);
    }
  });
}

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", event => {
  initMap(400, "map");
  fetchNeighborhoods();
  fetchCuisines();
});

/**
 * Load interactive Map if user hoovers over static image
 */
const MapTarget = document.getElementById("map");
MapTarget.addEventListener(
  "mouseover",
  () => {
    if (!InteractiveMapLoaded) {
      addInteractiveMap(MapsConfig);
    }
  },
  { once: true }
);
/**
 * Fetch all neighborhoods and set their HTML.
 */
let fetchNeighborhoods = () => {
  loadRestaurants()
    .then(restaurants => {
      window.neighborhoods = getNeighborhoods(restaurants);
      fillNeighborhoodsHTML();
    })
    .catch(err => {
      console.error(err);
    });
};

/**
 * Set neighborhoods HTML.
 */
let fillNeighborhoodsHTML = (neighborhoods = window.neighborhoods) => {
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
  loadRestaurants()
    .then(restaurants => {
      window.cuisines = getCuisines(restaurants);
      fillCuisinesHTML();
    })
    .catch(err => {
      console.error(err);
    });
};

/**
 * Set cuisines HTML.
 */
let fillCuisinesHTML = (cuisines = window.cuisines) => {
  const select = document.getElementById("cuisines-select");

  cuisines.forEach(cuisine => {
    const option = document.createElement("option");
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 *  creates static map image
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
  markers=size:mid%7Ccolor:red%7C
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

const initMap = (height, element) => {
  // load static maps image for smaller devices
  if (window.matchMedia("(max-width:600px)").matches) {
    createStaticMapImage(height, element);
    loadRestaurants()
      .then(restaurants => {
        resetRestaurants(restaurants);
        fillRestaurantsHTML();
      })
      .catch(err => {
        console.error(err);
      });
  } else {
    addInteractiveMap(MapsConfig);
  }
};

const addInteractiveMap = options => {
  loadGoogleMapsApi(options)
    .then(googleMaps => {
      const loc = {
        lat: 40.722216,
        lng: -73.9875
      };
      map = new googleMaps.Map(document.getElementById("map"), {
        zoom: 12,
        center: loc,
        scrollwheel: false,
        styles: MapStyle
      });
      InteractiveMapLoaded = true;
      updateRestaurants();
    })
    .catch(error => {
      console.error(error);
    });
};

const changeMap = () => {
  if (!InteractiveMapLoaded) {
    addInteractiveMap(MapsConfig);
  } else {
    updateRestaurants();
  }
};

/*
 * Update page and map for current restaurants.
 */

const NeighborhoodSelect = document.getElementById("neighborhoods-select");
const CuisinesSelect = document.getElementById("cuisines-select");
NeighborhoodSelect.addEventListener("change", () => {
  changeMap();
});

CuisinesSelect.addEventListener("change", () => {
  changeMap();
});

let updateRestaurants = () => {
  const cSelect = document.getElementById("cuisines-select");
  const nSelect = document.getElementById("neighborhoods-select");

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  let cuisine = cSelect[cIndex].value;
  let neighborhood = nSelect[nIndex].value;
  console.log("Select" + neighborhood);
  loadRestaurants()
    .then(response => {
      let filtered = getRestaurantByCuisineNeighborhood(
        cuisine,
        neighborhood,
        response
      );
      resetRestaurants(filtered);
      fillRestaurantsHTML();
    })
    .catch(err => {
      console.error(err);
    });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
let resetRestaurants = restaurants => {
  // Remove all restaurants
  window.restaurants = [];
  const ul = document.getElementById("restaurants-list");
  ul.innerHTML = "";

  // Remove all map markers

  if (typeof window.markers !== "undefined") {
    window.markers.forEach(m => m.setMap(null));
  }

  window.markers = [];
  window.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
let fillRestaurantsHTML = (restaurants = window.restaurants) => {
  const ul = document.getElementById("restaurants-list");
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
    observer.observe();
  });
  // Check if interactive Map was already loaded
  if (InteractiveMapLoaded) {
    addMarkersToMap();
  }
};

/*
 * Create restaurant HTML.
 */
let createRestaurantHTML = restaurant => {
  const li = document.createElement("li");
  const image = document.createElement("img");
  image.className = "restaurant-img lozad";
  const img = require(`./assets/data/img/${restaurant.id}.jpg`);
  image.src = img.placeholder;
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

  const container = document.createElement("div");
  container.classList.add("container");

  const more = document.createElement("a");
  more.classList.add("flex-item");
  more.innerHTML = "View Details";
  more.href = urlForRestaurant(restaurant);

  const favorite = document.createElement("div");
  favorite.classList.add("flex-item");
  favorite.innerHTML = `<i class="mdc-icon-toggle material-icons md-24" role="button" aria-pressed=${
    restaurant.is_favorite
  }
  aria-label="Add to favorites" tabindex="0"
  data-id=${restaurant.id}
  data-toggle-on='{"label": "Remove from favorites", "content": "favorite", "cssClass": "active" }'
  data-toggle-off='{"label": "Add to favorites", "content": "favorite_border"}'>
 favorite_border
</i>`;
  const favouriteIcon = favorite.querySelector(".mdc-icon-toggle");
  MDCIconToggle.attachTo(favouriteIcon);
  favouriteIcon.addEventListener("click", e => {
    const state = e.target.getAttribute("aria-pressed");

    sendFavorite(FavouriteEndpoint, e.target.dataset.id, state).catch(error => {
      console.error(error);
    });
  });
  container.appendChild(more);
  container.appendChild(favorite);
  li.append(container);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
let addMarkersToMap = (restaurants = window.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = mapMarkerForRestaurant(restaurant, map);
    google.maps.event.addListener(marker, "click", () => {
      window.location.href = marker.url;
    });
    window.markers.push(marker);
  });
};

/*
* PUT request  tofavorite/unfavorite restaurant
*/
const sendFavorite = (URL, r_id, r_bool) => {
  return fetch(`${URL}${r_id}/`, {
    method: "PUT",
    headers: new Headers({
      "Content-Type": "application/x-www-form-urlencoded"
    }),
    body: `is_favorite=${r_bool}`
  });
};
