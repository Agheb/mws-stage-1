import LF from "localforage";
import mapboxgl from "mapbox-gl";

// FIXME: Needing refactor or cleanup -@agheb at 6/1/2018, 10:46:27 PM
// Endpoints from util.js
// Endpoint URL to get restaurants.
const RESTAURANT_ENDPOINT = "https://apiserver-bsxyywmzus.now.sh/restaurants";
// Endpoints URL for all reviews of given restaurant
const REVIEWS_ENDPOINT =
  "https://apiserver-bsxyywmzus.now.sh/reviews/?restaurant_id=";

// Configure IndexedDB
LF.config({
  driver: LF.INDEXEDDB, // Force INDEXEDDB
  name: "Restaurants reviews",
  version: 1.0,
  size: 4980736, // Size of database, in bytes. Used only in WebSQL.
  storeName: "datastore_1",
  description: "Storing blobs"
});

export const loadRestaurants = () => {
  return fetch(RESTAURANT_ENDPOINT, { credentials: "omit" })
    .then(response => {
      return response
        .json()
        .then(json => {
          return LF.setItem("restaurants", JSON.stringify(json));
        })
        .then(() => {
          return LF.getItem("restaurants");
        })
        .then(restaurants => {
          return JSON.parse(restaurants);
        });
    })
    .catch(() => {
      //  network failure or offline situation
      console.log(
        "Can not fetch restaurant data. Trying to get it from IndexedDB..."
      );
      return getFromIndexeDB("restaurants");
    });
};

export const loadReviews = id => {
  // Add restaurant id value
  const reviews_endpoint = REVIEWS_ENDPOINT + id;
  console.log(reviews_endpoint);

  return fetch(reviews_endpoint, { credentials: "omit" })
    .then(response => {
      console.log("Reviews fetched");
      return response
        .json()
        .then(json => {
          return LF.setItem(`reviews-${id}`, JSON.stringify(json));
        })
        .then(() => {
          console.log("Reviews stored in IndexedDB");
          return LF.getItem(`reviews-${id}`);
        })
        .then(reviews => {
          return JSON.parse(reviews);
        });
    })
    .catch(error => {
      console.log(error);
      //  network failure or offline situation
      console.log(
        "Can not fetch  reviews data Trying to get it from IndexedDB..."
      );
      return getFromIndexeDB(`reviews-${id}`);
    });
};

/*
* Get data from IndexedDB
* IremName:  String
*/
const getFromIndexeDB = ItemName => {
  return LF.getItem(ItemName)
    .then(value => {
      return JSON.parse(value);
    })
    .catch(error => {
      console.log(error);
    });
};
/**
 * get a restaurant by its ID.
 */
export const getRestaurantById = (id, restaurants) => {
  return restaurants.find(r => r.id == id);
};

/**
 * get restaurants by a cuisine type
 */
export const getRestaurantByCuisine = cuisine => {
  return restaurants.filter(r => r.cuisine_type == cuisine);
};

/**
 * get restaurants by a neighborhood with proper error handling.
 */
export const getRestaurantByNeighborhood = neighborhood => {
  // Filter restaurants to have only given neighborhood
  return restaurants.filter(r => r.neighborhood == neighborhood);
};

export const getRestaurantByCuisineNeighborhood = (
  cuisine,
  neighborhood,
  restaurants
) => {
  let results = restaurants;
  if (cuisine != "all") {
    // filter by cuisine
    results = results.filter(r => r.cuisine_type == cuisine);
  }
  if (neighborhood != "all") {
    // filter by neighborhood
    results = results.filter(r => r.neighborhood == neighborhood);
  }
  return results;
};

export const getNeighborhoods = restaurants => {
  const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
  // Remove duplicates from neighborhoods
  const uniqueNeighborhoods = neighborhoods.filter(
    (v, i) => neighborhoods.indexOf(v) == i
  );

  return uniqueNeighborhoods;
};

/**
 * Fetch all cuisenes with proper error handling.
 */
export const getCuisines = restaurants => {
  // Get all cuisines from all restaurants
  const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
  // Remove duplicates from cuisines
  const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);

  return uniqueCuisines;
};

/**
 * Restaurant page URL.
 */
export const urlForRestaurant = restaurant => {
  return `./restaurant.html?id=${restaurant.id}`;
};

/**
 * Map marker for a restaurant.
 */
export const mapMarkerForRestaurant = (restaurant, map) => {
  const marker = new mapboxgl.Marker({
    color: "#000000",
    url: urlForRestaurant(restaurant)
  }).setLngLat([restaurant.latlng.lng, restaurant.latlng.lat]);
  return marker;
};
