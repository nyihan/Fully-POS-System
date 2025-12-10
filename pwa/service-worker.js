/* pwa/service-worker.js
   Simple offline caching service worker for Smart POS (GitHub Pages / repo = /fpos/)
   - Ensure this file is served at /fpos/pwa/service-worker.js (or change register path in index.html)
   - When you update files, bump CACHE_NAME to force clients to refetch
*/

const CACHE_NAME = 'smartpos-v2'; // bump when you change cache contents
const BASE = '/fpos';

// files to cache (absolute under repo)
const FILES_TO_CACHE = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/assets/css/theme.css`,
  `${BASE}/assets/js/app.js`,
  `${BASE}/assets/icons/green-192.png`,
  `${BASE}/assets/icons/green-512.png`,
  `${BASE}/assets/icons/green-maskable.png`,
  // optional extras you want pre-cached:
  // `${BASE}/assets/js/chext_loader.js`,
  // `${BASE}/pwa/manifest.json`
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
      .catch(err => console.warn('SW cache addAll failed', err))
  );
});

self.addEventListener('activate', event => {
  // remove old caches
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Try cache first, then network, fallback to root
  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          // optionally cache new resources (one-by-one)
          // but avoid caching POST or opaque third-party responses here
          return response;
        }).catch(() => {
          // fallback — serve cached index (app shell)
          return caches.match(`${BASE}/`);
        });
      })
  );
});
