import LF from "localforage";

/*
* API's server specified URL.
  
*/
const SERVER_URL = "https://server.amanuelg.me/restaurants";

export const loadRestaurants = () => {
  console.log(SERVER_URL);
  return fetch(SERVER_URL, { credentials: "omit" }).then(response => {
    return response.json();
  });
};

/**
 * get a restaurant by its ID.
 */
export const getRestaurantById = id => {
  // TODO: Tasks pending completion -@agheb at 5/1/2018, 9:12:45 PM
  // Error Handling if Restaurant does not exist
  const restaurant = restaurants.find(r => r.id == id);
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
    console.log("Ich bin hier");
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
  const marker = new google.maps.Marker({
    position: restaurant.latlng,
    title: restaurant.name,
    url: urlForRestaurant(restaurant),
    map: map
  });
  return marker;
};
