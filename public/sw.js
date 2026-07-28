const CACHE = "jx-genesis-shell-v3";
const SHELL = ["/", "/manifest.webmanifest", "/icon.svg", "/images/genesis/solar-system-sun.jpg", "/images/genesis/creation-stars.webp", "/images/genesis/adam-formed.webp", "/images/genesis/fall-choice.webp", "/images/genesis/creation-fish-close.webp", "/images/genesis/creation-fish-school.webp", "/images/genesis/eden-trees-close.webp", "/images/genesis/eden-trees-wide.webp", "/images/genesis/tower-of-babel.webp", "/images/rewards/blue-gem.png", "/images/rewards/reward-coin.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then((cached) => cached || caches.match("/"))));
});
