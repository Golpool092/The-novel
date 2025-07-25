const CACHE_NAME = 'shkola13-v1';
const urlsToCache = [
  'index.html',
  'style.css',
  'main.js',
  'story.js',
  'manifest.json',
  'video/beginning.mp4',
  'audio/beginning.mp3',
  'audio/dooroff.mp3',
  'audio/paper.mp3',
  'audio/fon.mp3',
  'pages/diary.png',
  'pages/diar.png',
  'pages/pass.png',
  'pages/passed.png',
  'pages/settings.png',
  'pages/fon1.png',
  'pages/fon2.png',
  'pages/fon3.png',
  'pages/fon4.png',
  'pages/fon5.png',
  'pages/fon6.png',
  'pages/fon7.png',
  'pages/fon8.png',
  'pages/fon5-1.png',
  'pages/fon6-1.png',
  'pages/fon7-1.png',
  'pages/fon8-1.png',
  'pages/icon-192.png',
  'pages/icon-512.png',
  'pages/dowicon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type !== 'basic'
        ) {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    })
  );
});
