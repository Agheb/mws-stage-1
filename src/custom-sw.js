// Precache all files
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  ignoreUrlParametersMatching: [/./]
});

// Background Sync for form submission
const bgSyncPlugin = new workbox.backgroundSync.Plugin("review-frm", {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
  callbacks: {
    queueDidReplay: console.log("Background Sync success")
  }
});

workbox.routing.registerRoute(
  /\/reviews\//, //  regex to match API endpoint
  workbox.strategies.networkOnly({
    plugins: [bgSyncPlugin]
  }),
  "POST" // Network-only strategie has to be use for Non-Get requests
);
