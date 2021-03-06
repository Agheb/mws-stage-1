import Lozad from "lozad";
import Normalize from "normalize.css/normalize.css";
import StarRating from "css-star-rating/css/star-rating.css";
import "./assets/css/styles.css";
import "./assets/css/app.scss";
import "./assets/css/dialog.scss";
import "./assets/css/snackbar.scss";
import "./assets/css/restaurant.scss";
import Manifest from "./assets/data/manifest.json";
import { oneLineTrim } from "common-tags";
import {
  mapMarkerForRestaurant,
  loadRestaurants,
  loadReviews,
  getRestaurantById
} from "./assets/js/db";
import { getParameterByName, MAPBOX_API_TOKEN } from "./assets/js/util";
import { showNotification } from "./assets/js/snackbar";
import mapboxgl from "mapbox-gl";

let restaurant;
let map;
let InteractiveMapLoaded;

const observer = Lozad();
observer.observe();

// listen for message from SW, if BackgroundSync was a sucess
if ("serviceWorker" in navigator) {
  // Handler for messages coming from the service worker
  navigator.serviceWorker.addEventListener("message", function(event) {
    if (event.data === "server-success") {
      import(/* webpackChunkName: "notification" */ "./assets/js/snackbar").then(
        snackbar => {
          snackbar.showNotification(
            "Thank you! Your reviews has been sent successfully.Please reload the page."
          );
        }
      );
    } else {
      console.log("Client received unknown message: " + event.data);
    }
  });
}

window.addEventListener(
  "resize",
  () => {
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
        window.restaurant = getRestaurantById(id, restaurants);
        fillRestaurantHTML();
        fillBreadcrumb();
        initRestaurantMap(window.restaurant, "mapbox", 300);
        loadReviews(id).then(reviews => {
          console.log(reviews);
          fillReviewsHTML(reviews);
        });
      }
    })
    .catch(err => {
      console.error(err);
    });
});

const initRestaurantMap = (restaurant, element, height) => {
  // load static maps image for smaller devices
  if (window.matchMedia("(max-width:600px)").matches) {
    createRestaurantMapImage(restaurant, element, height);
  } else {
    addInteractiveRestaurantMap(restaurant);
  }
};

/**
 * Load interactive Map if user hoovers over static image
 */
const MapTarget = document.getElementById("mapbox");
MapTarget.addEventListener(
  "mouseover",
  () => {
    if (!InteractiveMapLoaded) {
      addInteractiveRestaurantMap();
    }
  },
  { once: true }
);

const addInteractiveRestaurantMap = (restaurant = window.restaurant) => {
  const ll = [restaurant.latlng.lng, restaurant.latlng.lat];

  // delete static image from DOM if it already exists
  if (document.querySelector("#mapImage")) {
    const el = document.querySelector("#mapImage");
    el.parentNode.removeChild(el);
  }
  mapboxgl.accessToken = MAPBOX_API_TOKEN;

  const mapboxMap = new mapboxgl.Map({
    center: ll,
    zoom: 14,
    scrollZoom: false,
    container: "mapbox",
    style: "mapbox://styles/agheb/cjjddhl0w3qu22sp5gmnlffum?optimize=true"
  });
  InteractiveMapLoaded = true;

  new mapboxgl.Marker({ color: "#000000" })
    .setLngLat([restaurant.latlng.lng, restaurant.latlng.lat])
    .addTo(mapboxMap);

  // mapMarkerForRestaurant(restaurant, map);
};

const createRestaurantMapImage = (restaurant, element, height) => {
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;

  // TODO: Change Markercolor to black -@agheb at 6/18/2018, 2:41:25 PM

  const url2 = oneLineTrim`
   https://api.mapbox.com/styles/v1/mapbox/light-v9/static/
   pin-l+3455d9(${restaurant.latlng.lng},${restaurant.latlng.lat})/
   ${restaurant.latlng.lng},${restaurant.latlng.lat},17/
   ${width}x${height}@2x?
   access_token=pk.eyJ1IjoiYWdoZWIiLCJhIjoiY2ppN3ZodXN4MGZvczN3bGd6MGtlZ25uMyJ9.m3nup5JuyeeDbZ8ovxBzxg
   `;

  const mapImage = `
  <img width="${width}px"
  id="mapImage"
  src=${encodeURI(url2)} alt="Map of ${restaurant.name}">
  `;
  document.getElementById(`${element}`).innerHTML = mapImage;
};

/**
 * Get current restaurant from page URL.
 */
let fetchRestaurantFromURL = callback => {};

/**
 * Create restaurant HTML and add it to the webpage
 */
let fillRestaurantHTML = (restaurant = window.restaurant) => {
  const name = document.getElementById("restaurant-name");
  name.innerHTML = restaurant.name;

  const address = document.getElementById("restaurant-address");
  address.innerHTML = restaurant.address;

  const image = document.getElementById("restaurant-img");
  image.className = "restaurant-img";
  const img = require(`./assets/data/img/${restaurant.id}.jpg`);
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
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
let fillRestaurantHoursHTML = (
  operatingHours = window.restaurant.operating_hours
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
let fillReviewsHTML = (reviews = window.restaurant.reviews) => {
  const container = document.getElementById("reviews-container");
  const title = document.createElement("h3");
  title.innerHTML = "Reviews";
  container.appendChild(title);
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttonContainer");
  container.appendChild(buttonContainer);
  const addReview = document.createElement("Button");
  addReview.innerHTML = `<span class="mdc-fab__icon">add</span>`;
  addReview.classList.add("mdc-fab", "add-review");

  buttonContainer.appendChild(addReview);

  const addReviewButton = document.querySelector(".mdc-fab");
  addReviewButton.addEventListener("click", evt => {
    import(/* webpackChunkName: "addReview" */ "./assets/js/dialog").then(
      module => {
        module.render(evt);
      }
    );
  });

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
  date.innerHTML = review.createdAt;
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
let fillBreadcrumb = (restaurant = window.restaurant) => {
  const breadcrumb = document.getElementById("breadcrumb");
  const li = document.createElement("li");
  console.log();
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Create star rating in reviews
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
