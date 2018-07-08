/**
 * Get a parameter by name from page URL.
 */
export const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

export const ReviewEndpoint = "https://server.amanuelg.me/reviews/";
export const FavouriteEndpoint = "https://server.amanuelg.me/restaurants/";
export const MAPBOX_API_TOKEN =
  "pk.eyJ1IjoiYWdoZWIiLCJhIjoiY2ppN3ZodXN4MGZvczN3bGd6MGtlZ25uMyJ9.m3nup5JuyeeDbZ8ovxBzxg";
export const MAPBOX_STYLE = "mapbox://styles/agheb/cjincsidz13122sq8lvfgmn1t";
