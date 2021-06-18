const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

const FILES_TO_CACHE = [
    "/icons/icon-144x144.png",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/favicon.ico",
    "/",
    "/index.html",
    "/index.js",
    "/manifest.webmanifest",
    "/database.js",
    "/styles.css",
];

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then( (cache) => {
        console.log("Your cache has been created.");
        return cache.addAll(FILES_TO_CACHE);
    }));

    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(caches.keys().then( (keys) => {
        return Promise.all(keys.map( (key) => {
            if (key != CACHE_NAME && key != DATA_CACHE_NAME) {
                console.log("Your old data has been removed.");
                return caches.delete(key);
            }
        }))
    }))

    self.clients.claim();
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
          return cache.match(event.request).then(response => {
            return response || fetch(evt.request);
          });
        })
    );
});