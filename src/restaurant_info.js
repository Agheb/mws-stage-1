import Lozad from "lozad";
import Normalize from "normalize.css/normalize.css";
import StarRating from "css-star-rating/css/star-rating.css";
import "./assets/css/styles.css";
import DBHelper from "./assets/js/dbhelper";
import loadGoogleMapsApi from "load-google-maps-api";
import { oneLineTrim } from "common-tags";
import {
  mapMarkerForRestaurant,
  loadRestaurants,
  getRestaurantById
} from "./assets/js/db";

let restaurant;
let map;
let InteractiveMapLoaded;

const MapsConfig = {
  key: "AIzaSyDXJhUDVZRlN4bLZm0nJbwsUUxRtCpRtQI",
  libraries: ["places"]
};

const observer = Lozad();
observer.observe();

window.addEventListener(
  "resize",
  () => {
    console.log("Event fired");
    if (!InteractiveMapLoaded) {
      addInteractiveRestaurantMap(MapsConfig);
    }
  },
  { once: true }
);

document.addEventListener("DOMContentLoaded", () => {
  loadRestaurants()
    .then(restaurants => {
      const id = getParameterByName("id");
      if (!id) {
        console.error("No restaurant id in URL");
      } else {
        self.restaurant = getRestaurantById(id);
        fillRestaurantHTML();
        fillBreadcrumb();
        initRestaurantMap(restaurant, "map", 300);
      }
    })
    .catch(error => {
      console.error(err);
    });
});

const initRestaurantMap = (restaurant, element, height) => {
  // load static maps image for smaller devices
  if (window.matchMedia("(max-width:600px)").matches) {
    createRestaurantMapImage(restaurant, element, height);
  } else {
    addInteractiveRestaurantMap(MapsConfig, restaurant);
  }
};

/**
 * Load interactive Map if user hoovers over static image
 */
const MapTarget = document.getElementById("map");
MapTarget.addEventListener(
  "mouseover",
  () => {
    if (!InteractiveMapLoaded) {
      console.log(!InteractiveMapLoaded);
      addInteractiveRestaurantMap(MapsConfig);
    }
  },
  { once: true }
);

const addInteractiveRestaurantMap = (options, restaurant = self.restaurant) => {
  console.log(options);
  loadGoogleMapsApi(options)
    .then(googleMaps => {
      map = new googleMaps.Map(document.getElementById("map"), {
        zoom: 12,
        center: restaurant.latlng,
        scrollwheel: false
      });
      InteractiveMapLoaded = true;
      mapMarkerForRestaurant(restaurant, map);
    })
    .catch(error => {
      console.error(error);
    });
};

const createRestaurantMapImage = (restaurant, element, height) => {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  // TODO: Tasks pending completion -@agheb at 4/26/2018, 6:38:24 PM
  // Strip out key and add to MapOptions
  const url = oneLineTrim`
  https://maps.googleapis.com/maps/api/staticmap?center=${
    restaurant.latlng.lat
  },${restaurant.latlng.lng}&
  zoom=12&
  scale=2&
  size=${width}x${height}&
  maptype=roadmap&format=png&
  visual_refresh=true&
  key=AIzaSyAI60PBarZdCiO-BYJqYvoDYBL8F68-PEU&
  markers=size:mid%7Ccolor:red%7C
  |${restaurant.latlng.lat},${restaurant.latlng.lng}|
  `;

  const mapsImage = `
  <img width="${width}px"
  src=${encodeURI(url)} alt="Map of${restaurant.name}">
  `;
  document.getElementById(`${element}`).innerHTML = mapsImage;
};

/**
 * Get current restaurant from page URL.
 */
let fetchRestaurantFromURL = callback => {};

/**
 * Create restaurant HTML and add it to the webpage
 */
let fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById("restaurant-name");
  name.innerHTML = restaurant.name;

  const address = document.getElementById("restaurant-address");
  address.innerHTML = restaurant.address;

  const image = document.getElementById("restaurant-img");
  image.className = "restaurant-img";
  const img = require(`./assets/data/img/${restaurant.photograph}`);
  image.src = img.src;
  image.srcset = img.srcSet;
  image.alt = `Image of ${restaurant.name} Restaurant`;
  observer.observe();
  const cuisine = document.getElementById("restaurant-cuisine");
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
let fillRestaurantHoursHTML = (
  operatingHours = self.restaurant.operating_hours
) => {
  const hours = document.getElementById("restaurant-hours");
  for (let key in operatingHours) {
    const row = document.createElement("tr");

    const day = document.createElement("td");
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement("td");
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
let fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById("reviews-container");
  const title = document.createElement("h3");
  title.innerHTML = "Reviews";
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement("p");
    noReviews.innerHTML = "No reviews yet!";
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById("reviews-list");
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
let createReviewHTML = review => {
  const li = document.createElement("li");
  const name = document.createElement("p");
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement("p");
  date.innerHTML = review.date;
  li.appendChild(date);

  const rating = document.createElement("p");
  rating.innerHTML = createReviewStars(review.rating);
  li.appendChild(rating);

  const comments = document.createElement("p");
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
let fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById("breadcrumb");
  const li = document.createElement("li");
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
let getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

/**
 * Create star rating in revies
 */
let createReviewStars = rating => {
  const star = `
  <div class="star">
  <i class="star-empty"></i>
  <i class="star-half"></i>
  <i class="star-filled"></i>
</div>
  `;
  const markup = `
  <div class="rating small star-icon value-${rating} color-ok">
   <div class="star-container">
       ${star.repeat(5)}
    </div>
  </div>
  `;
  return markup;
};
