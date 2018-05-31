// Precache all files
workbox.precaching.precacheAndRoute(self.__precacheManifest, {
  ignoreUrlParametersMatching: [/./]
});

// Background Sync for form submission
const bgSyncPlugin = new workbox.backgroundSync.Plugin("review-frm", {
  maxRetentionTime: 24 * 60, // Retry for max of 24 Hours
  callbacks: {
    queueDidReplay: async () => {
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage("server-success");
      });
    }
  }
});

const networkOnlyStrategy = workbox.strategies.networkOnly({
  plugins: [bgSyncPlugin]
});

workbox.routing.registerRoute(
  "https://server.amanuelg.me/reviews/",
  networkOnlyStrategy,
  "POST"
);

workbox.routing.registerRoute(
  "https://server.amanuelg.me/reviews/",
  networkOnlyStrategy,
  "PUT"
);
