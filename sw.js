/* Vocabulary - service worker (offline support).
   Strategy: network first, so after you push an update the app shows it as soon as the phone is online;
   if the network is missing or very slow, the last saved copy is used. Grammar Academy works fully offline.
   Word Explorer's online dictionary lookups are never cached or touched (built-in words still work offline). */
const CACHE = 'vocabulary-v2';
const NETWORK_TIMEOUT_MS = 4000;

const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'css/grammar.css',
  'js/app.js',
  'js/pwa.js',
  'js/grammar.js',
  'js/grammar-data-basics.js',
  'js/grammar-data-verbs.js',
  'js/grammar-data-sentences.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => Promise.all(SHELL.map(url => cache.add(url).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('vocabulary-') && key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

const timeout = ms => new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  try {
    const fresh = await Promise.race([fetch(request, { cache: 'no-cache' }), timeout(NETWORK_TIMEOUT_MS)]);
    if (fresh && fresh.ok) cache.put(request, fresh.clone());
    return fresh;
  } catch (error) {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const shell = (await cache.match('index.html')) || (await cache.match('./'));
      if (shell) return shell;
    }
    throw error;
  }
}

// Google Fonts: show the saved copy instantly, refresh it in the background.
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then(response => { if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone()); return response; })
    .catch(() => cached);
  return cached || refresh;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
  if (url.origin !== self.location.origin) return; // e.g. dictionaryapi.dev: leave untouched

  event.respondWith(networkFirst(request));
});
