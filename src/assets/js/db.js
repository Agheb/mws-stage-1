import LF from "localforage";

/*
* API's server specified URL
*/
export const URL = () => {
  let port = 1337; // Change this to your server port
  let url = `http://localhost:${port}/`;
  if (location.href !== url) {
    url = "";
  }
  return `${url}restaurants.json`;
};

export const fetchRestaurants = (URL = this.URL) => {
  return fetch(URL, { credentials: "omit" }).then(response => {
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
