/* Service worker: guarda la app en el móvil para que funcione sin conexión */

const VERSION = 'tth-v4';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/styles.css',
  './js/app.js',
  './js/core.js',
  './js/data.js',
  './js/store.js',
  './js/photos.js',
  './js/views.js',
  './vendor/leaflet.js',
  './vendor/leaflet.css',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Tiempo y cambio de moneda: siempre de la red, sin guardar
  if (/open-meteo|frankfurter/.test(url.hostname)) return;

  // Teselas del mapa y fotos: primero caché, si no, red
  if (/basemaps\.cartocdn|tile\.openstreetmap|unsplash/.test(url.hostname)) {
    e.respondWith(
      caches.open(VERSION + '-media').then(async c => {
        const hit = await c.match(req);
        if (hit) return hit;
        try {
          const res = await fetch(req);
          if (res.ok) c.put(req, res.clone());
          return res;
        } catch { return hit || Response.error(); }
      })
    );
    return;
  }

  // Archivos de la app: primero red (para ver cambios), con caché de respaldo
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res.ok) caches.open(VERSION).then(c => c.put(req, res.clone()));
          return res;
        })
        .catch(async () =>
          (await caches.match(req)) ||
          (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()))
    );
    return;
  }

  // Tipografías y demás
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) caches.open(VERSION + '-media').then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => hit || Response.error()))
  );
});
