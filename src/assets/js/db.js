import LF from "localforage";

/*
* API's server specified URL.
  
*/
const SERVER_URL = "https://server.amanuelg.me/restaurants";

export const fetchRestaurants = () => {
  console.log(SERVER_URL);
  return fetch(SERVER_URL, { credentials: "omit" }).then(response => {
    return response.json();
  });
};

export const filterByCuisineNeighborhood = (
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

export const fetchNeighborhoods = () => {};
