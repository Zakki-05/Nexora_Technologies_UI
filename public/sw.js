const CACHE_NAME = 'nexora-workforce-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.svg',
  '/favicon-32x32.png',
  '/favicon-512x512.png',
  '/apple-touch-icon.png',
  '/nexora-official-logo.png'
];

// Install: Cache critical shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean older caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy
// 1. Strictly bypass cache for API calls, auth, documents, and dynamic database endpoints
// 2. Cache-first with stale-while-revalidate for immutable static assets (scripts, styles, images)
// 3. Fallback to offline.html for HTML navigation failures
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Strictly NETWORK-ONLY for all dynamic API calls, authentication, and corporate employee data
  if (
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/employees') ||
    url.pathname.startsWith('/departments') ||
    url.pathname.startsWith('/attendance') ||
    url.pathname.startsWith('/leaves') ||
    url.pathname.startsWith('/salaries') ||
    url.pathname.startsWith('/expenses') ||
    url.pathname.startsWith('/documents') ||
    url.pathname.startsWith('/notifications') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/api') ||
    event.request.method !== 'GET'
  ) {
    return;
  }

  // Navigation requests: Network first, fallback to offline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html');
      })
    );
    return;
  }

  // Static Assets: Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
