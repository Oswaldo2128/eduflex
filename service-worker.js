// EDUFLEX Service Worker optimizado
const CACHE_NAME = 'eduflex-v2.0';
const STATIC_CACHE = 'eduflex-static-v2.0';
const DYNAMIC_CACHE = 'eduflex-dynamic-v1.0';

// Archivos esenciales para cache
const staticAssets = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Cache estático creado');
        return cache.addAll(staticAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Eliminando cache antigua:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Estrategia de cache: Cache First para recursos estáticos, Network First para dinámicos
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache First para recursos estáticos
  if (staticAssets.some(asset => url.pathname === asset || request.url.includes(asset))) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request)
            .then(fetchResponse => {
              const responseClone = fetchResponse.clone();
              caches.open(STATIC_CACHE)
                .then(cache => cache.put(request, responseClone));
              return fetchResponse;
            });
        })
        .catch(() => {
          // Fallback para HTML
          if (request.headers.get('accept').includes('text/html')) {
            return caches.match('./index.html');
          }
        })
    );
  } else {
    // Network First para contenido dinámico
    event.respondWith(
      fetch(request)
        .then(response => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone));
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});
