// Simple service worker for offline support
const CACHE_NAME = 'mindmeasure-v1'
const STATIC_CACHE = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
]

// Install - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE))
      .then(() => self.skipWaiting())
  )
})

// Activate - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(names => 
      Promise.all(
        names.map(name => 
          name !== CACHE_NAME ? caches.delete(name) : null
        )
      )
    ).then(() => self.clients.claim())
  )
})

// Fetch - cache-first for static assets, network-first for API
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Only handle GET requests
  if (request.method !== 'GET') return
  
  // Static assets - cache first
  if (STATIC_CACHE.includes(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(response => 
          response || fetch(request).then(response => {
            cache.put(request, response.clone())
            return response
          })
        )
      )
    )
  }
  
  // API calls - network first with fallback
  else if (url.pathname.includes('/api/') || url.hostname.includes('supabase')) {
    event.respondWith(
      fetch(request).catch(() => 
        caches.match(request).then(response => 
          response || new Response('Offline', { status: 503 })
        )
      )
    )
  }
})