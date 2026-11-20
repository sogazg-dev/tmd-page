/* Service worker mínimo para que la página se pueda instalar como app.
   No guarda la página en caché (siempre se carga la versión más reciente);
   solo muestra una pantalla "Sin conexión" si no hay internet.
   También muestra los avisos (notificaciones) de videos y publicaciones
   nuevas: el aviso llega vacío y aquí se pide el texto a la función avisos. */
const OFFLINE_CACHE = 'tmd-offline-v2';
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(OFFLINE_CACHE).then((cache) => cache.addAll([OFFLINE_URL, '/app-icon-192.png'])));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== OFFLINE_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return; // todo lo demás va directo a la red
  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
});

// ---------- Avisos (notificaciones push) ----------
self.addEventListener('push', (event) => {
  const mostrar = (a) => self.registration.showNotification(a.titulo || 'TheMarioDimension', {
    body: a.texto || '¡Hay algo nuevo en la página de TMD!',
    icon: '/app-icon-192.png',
    badge: '/app-icon-192.png',
    image: a.imagen || undefined,
    tag: a.tag || 'tmd-aviso',
    data: { url: a.url || '/' },
  });
  event.waitUntil((async () => {
    let aviso = null;
    try { aviso = event.data ? event.data.json() : null; } catch (e) { aviso = null; }
    if (!aviso) {
      try {
        const res = await fetch('/.netlify/functions/avisos', { cache: 'no-store' });
        aviso = (await res.json()).ultima;
      } catch (e) { aviso = null; }
    }
    return mostrar(aviso || {});
  })());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = new URL((event.notification.data && event.notification.data.url) || '/', self.location.origin).href;
  event.waitUntil((async () => {
    const ventanas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const abierta = ventanas.find((c) => c.url.startsWith(self.location.origin));
    if (abierta) {
      await abierta.focus();
      if ('navigate' in abierta) return abierta.navigate(url);
      return undefined;
    }
    return self.clients.openWindow(url);
  })());
});
