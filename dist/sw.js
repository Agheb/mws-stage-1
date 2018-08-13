importScripts(
  "precache-manifest.53aa32280ecf443f6b58ef3901e72b31.js",
  "https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js"
);

// Skip usual SW lifecycle. Helpful for debugging, but should not be used in Production
workbox.skipWaiting();
workbox.clientsClaim();

// Precache all files
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  ignoreUrlParametersMatching: [/./]
});

// options object for main
const mainOptions = {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
  callbacks: {
    queueDidReplay: async () => {
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage("server-success");
      });
    }
  }
};

// options object for restaurrant details
const restaurantOptions = {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
  callbacks: {
    queueDidReplay: async () => {
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage("favorite-success");
      });
    }
  }
};

workbox.routing.registerRoute(
  "https://apiserver-bsxyywmzus.now.sh/reviews/",
  workbox.strategies.networkOnly({
    plugins: [new workbox.backgroundSync.Plugin("review-frm", mainOptions)]
  }),
  "POST"
);

workbox.routing.registerRoute(
  new RegExp("https://apiserver-bsxyywmzus.now.sh/restaurants/.*"),
  workbox.strategies.networkOnly({
    plugins: [
      new workbox.backgroundSync.Plugin("restaurant-frm", restaurantOptions)
    ]
  }),
  "PUT"
);
