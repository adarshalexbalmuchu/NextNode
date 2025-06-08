// Service Worker for offline functionality and caching
const CACHE_NAME = 'quantum-read-flow-v1';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  // Add critical CSS and JS files
];

const API_CACHE_NAME = 'quantum-read-flow-api-v1';
const RUNTIME_CACHE_NAME = 'quantum-read-flow-runtime-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        // Force the waiting service worker to become the active service worker
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            // Delete old caches
            return cacheName.startsWith('quantum-read-flow-') && 
                   cacheName !== CACHE_NAME && 
                   cacheName !== API_CACHE_NAME && 
                   cacheName !== RUNTIME_CACHE_NAME;
          })
          .map((cacheName) => {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      // Take control of all pages
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API requests with network-first strategy
  if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE_NAME));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html')
        .then((response) => {
          return response || fetch(request);
        })
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'image') {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // Default: network-first for everything else
  event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE_NAME));
});

// Network-first strategy
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    // Only cache successful responses
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache...', error);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline.html') || 
             new Response('Offline - Please check your internet connection', {
               status: 503,
               statusText: 'Service Unavailable',
               headers: { 'Content-Type': 'text/plain' }
             });
    }
    
    throw error;
  }
}

// Cache-first strategy
async function cacheFirstStrategy(request, cacheName) {
  // Skip caching for chrome-extension and unsupported schemes
  if (request.url.startsWith('chrome-extension://') || 
      request.url.startsWith('moz-extension://') || 
      request.url.startsWith('webkit-extension://') ||
      request.url.startsWith('data:') ||
      request.url.startsWith('blob:')) {
    try {
      return await fetch(request);
    } catch (error) {
      console.log('Fetch failed for unsupported scheme:', request.url);
      throw error;
    }
  }

  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200 && networkResponse.type !== 'opaque') {
      const cache = await caches.open(cacheName);
      // Only cache valid responses
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network and cache failed for:', request.url);
    throw error;
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle queued offline actions
  console.log('Performing background sync...');
  
  // Example: Sync offline comments, likes, etc.
  try {
    // Get queued actions from IndexedDB or localStorage
    // Process them when online
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'You have a new notification',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.tag || 'default',
      data: data.url || '/',
      actions: [
        {
          action: 'open',
          title: 'Open',
        },
        {
          action: 'close',
          title: 'Close',
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Quantum Read Flow', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'open' || event.action === '') {
    const url = event.notification.data || '/';
    
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Try to find an existing window
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if none found
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
});

console.log('Service Worker loaded');
