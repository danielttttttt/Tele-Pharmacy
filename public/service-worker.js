// service-worker.js
// Basic service worker for caching app shell and enabling offline functionality

const CACHE_NAME = 'tele-pharmacy-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo.svg',
  // Add other critical assets here
];

// Install event - cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache open failed: ', error);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and Vite development resources
  if (event.request.method !== 'GET' || 
      event.request.url.includes('@vite') || 
      event.request.url.includes('@react-refresh')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // Clone the request for fetching
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response for caching
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.log('Cache put failed: ', error);
              });
              
            return response;
          })
          .catch(() => {
            // If offline and HTML request, return the homepage
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/');
            }
            return new Response('You are offline and no cache is available.', {
              status: 408,
              statusText: 'Offline',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  // Ensure CACHE_NAME is defined before using it
 if (typeof CACHE_NAME === 'undefined') {
    console.error('CACHE_NAME is not defined');
    return;
  }
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
    .catch((error) => {
      console.log('Cache cleanup failed: ', error);
    })
  );
});