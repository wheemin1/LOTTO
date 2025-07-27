const CACHE_NAME = 'luckysim-v1.0.0';
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  // Add static assets here as needed
];

const RUNTIME_CACHE = 'luckysim-runtime-cache';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle same-origin requests
  if (url.origin === location.origin) {
    // For navigation requests, try cache first, then network
    if (request.mode === 'navigate') {
      event.respondWith(
        caches.match('/')
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return fetch(request)
              .then((response) => {
                // Cache the response for offline use
                const responseClone = response.clone();
                caches.open(RUNTIME_CACHE)
                  .then((cache) => {
                    cache.put('/', responseClone);
                  });
                return response;
              });
          })
          .catch(() => {
            // Return cached index page as fallback
            return caches.match('/');
          })
      );
      return;
    }

    // For other requests, try cache first, then network
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request)
            .then((response) => {
              // Only cache successful responses
              if (response.status === 200) {
                const responseClone = response.clone();
                caches.open(RUNTIME_CACHE)
                  .then((cache) => {
                    cache.put(request, responseClone);
                  });
              }
              return response;
            });
        })
        .catch(() => {
          // For failed requests, try to return a cached fallback
          if (request.destination === 'document') {
            return caches.match('/');
          }
          // For other resources, return a basic response
          return new Response('Offline', {
            status: 200,
            statusText: 'OK',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        })
    );
  }
});

// Background sync for lottery data
self.addEventListener('sync', (event) => {
  if (event.tag === 'lottery-data-sync') {
    event.waitUntil(syncLotteryData());
  }
});

async function syncLotteryData() {
  try {
    // In a real implementation, this would sync data with a server
    // For this offline-first app, we'll just update local storage
    console.log('Syncing lottery data...');
    
    // Send message to clients about sync completion
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'DATA_SYNC_COMPLETE',
        payload: { success: true }
      });
    });
  } catch (error) {
    console.error('Lottery data sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/manifest-icon-192.png',
      badge: '/manifest-icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: '확인하기',
          icon: '/images/checkmark.png'
        },
        {
          action: 'close',
          title: '닫기',
          icon: '/images/xmark.png'
        },
      ]
    };

    event.waitUntil(
      self.registration.showNotification('LuckySim', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'close') {
    // Notification is already closed
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic background sync (requires permission)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'lottery-stats-update') {
    event.waitUntil(updateLotteryStats());
  }
});

async function updateLotteryStats() {
  try {
    // Update lottery statistics in the background
    console.log('Updating lottery statistics...');
    
    // In a real implementation, this might fetch new lottery results
    // or update cached statistics
    
    // Notify clients of the update
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'STATS_UPDATED',
        payload: { timestamp: Date.now() }
      });
    });
  } catch (error) {
    console.error('Stats update failed:', error);
  }
}

// Cache management utilities
async function cleanupOldCaches() {
  const cacheWhitelist = [CACHE_NAME, RUNTIME_CACHE];
  const cacheNames = await caches.keys();
  
  return Promise.all(
    cacheNames.map((cacheName) => {
      if (cacheWhitelist.indexOf(cacheName) === -1) {
        return caches.delete(cacheName);
      }
    })
  );
}

// Preload critical resources
async function preloadCriticalResources() {
  const cache = await caches.open(CACHE_NAME);
  
  // Preload fonts
  const fontUrls = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap'
  ];
  
  return Promise.allSettled(
    fontUrls.map(url => 
      fetch(url).then(response => {
        if (response.ok) {
          cache.put(url, response.clone());
        }
        return response;
      })
    )
  );
}

// Initialize service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      preloadCriticalResources(),
      // Add other initialization tasks here
    ])
  );
});
