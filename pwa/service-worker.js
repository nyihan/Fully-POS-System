const CACHE_NAME = "smartpos-v6";
const ROOT = "/fpos";

const FILES_TO_CACHE = [
  `${ROOT}/`,
  `${ROOT}/index.html`,
  `${ROOT}/assets/css/theme.css`,
  `${ROOT}/assets/js/app.js`,
  `${ROOT}/assets/icons/green-192.png`,
  `${ROOT}/assets/icons/green-512.png`,
  `${ROOT}/assets/icons/green-maskable.png`
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if (k !== CACHE_NAME) return caches.delete(k); })))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request).catch(()=>caches.match(`${ROOT}/index.html`)))
  );
});
