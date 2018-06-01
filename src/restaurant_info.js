import Lozad from "lozad";
import Normalize from "normalize.css/normalize.css";
import StarRating from "css-star-rating/css/star-rating.css";
import "./assets/css/styles.css";
import "./assets/css/app.scss";
import "./assets/css/dialog.scss";
import "./assets/css/snackbar.scss";
import Manifest from "./assets/data/manifest.json";
import loadGoogleMapsApi from "load-google-maps-api";
import { oneLineTrim } from "common-tags";
import {
  mapMarkerForRestaurant,
  loadRestaurants,
  loadReviews,
  getRestaurantById
} from "./assets/js/db";
import { MapsConfig, MapStyle } from "./assets/js/map";
import { getParameterByName } from "./assets/js/util";
import { showNotification } from "./assets/js/snackbar";

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
            "Thank you! Your reviews has been sent successfully"
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
        initRestaurantMap(window.restaurant, "map", 300);
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
      addInteractiveRestaurantMap(MapsConfig);
    }
  },
  { once: true }
);

const addInteractiveRestaurantMap = (
  options,
  restaurant = window.restaurant
) => {
  loadGoogleMapsApi(options)
    .then(googleMaps => {
      map = new googleMaps.Map(document.getElementById("map"), {
        zoom: 12,
        center: restaurant.latlng,
        scrollwheel: false,
        styles: MapStyle
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
  const addReview = document.createElement("a");
  addReview.innerHTML = "Add Review";
  addReview.classList.add("mdc-button", "add-review");

  container.appendChild(addReview);

  const addReviewButton = document.querySelector(".mdc-button");
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
