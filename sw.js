/* Vocabulary - service worker (strict offline-first).

   How it works
   - On install every app file listed in CORE is downloaded and saved in a cache named after BUILD.
     If any CORE file cannot be saved the install FAILS, so a half-saved app is never used or reported as ready.
     (The previous working version keeps running until a complete new one is ready.)
   - Once installed, the app is served from that cache first. Internet is only needed for the first visit and for updates.
   - BUILD is a fingerprint of all app files. Run `python3 tools/stamp-sw.py` before every commit so a changed file
     produces a new BUILD; the browser then installs the update in the background. (See README.)
   - Dictionary packs (data/dict/) live in their own cache, filled by js/dictionary.js while it sets the dictionary up.
     They are not deleted when the app updates. The dictionary manifest is checked online first so new packs are found.
   - Google Fonts are cached after first use. Anything else (e.g. Word Explorer's optional online lookup) is never cached. */
const BUILD = 'c6b9fafdd966';
const APP_CACHE = `vocabulary-app-${BUILD}`;
const DICT_CACHE = 'vocabulary-dict';
const FONT_CACHE = 'vocabulary-fonts';

const CORE = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'css/grammar.css',
  'css/speaking.css',
  'js/app.js',
  'js/pwa.js',
  'js/offline.js',
  'js/dictionary.js',
  'js/grammar.js',
  'js/grammar-data-basics.js',
  'js/grammar-data-verbs.js',
  'js/grammar-data-sentences.js',
  'js/speaking-data.js',
  'js/speaking.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png'
];
const OPTIONAL = ['icons/icon-maskable-512.png']; // nice to have; never blocks an install

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    await Promise.all(CORE.map(async url => {
      const response = await fetch(new Request(url, { cache: 'reload' }));
      if (!response.ok) throw new Error(`Could not save ${url} (${response.status})`);
      await cache.put(url, response);
    }));
    await Promise.all(OPTIONAL.map(url =>
      fetch(new Request(url, { cache: 'reload' })).then(response => (response.ok ? cache.put(url, response) : null)).catch(() => null)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // Remove older app caches (including the old "vocabulary-v3" style names). Dictionary and font caches stay.
    await Promise.all(keys
      .filter(key => key !== APP_CACHE && (/^vocabulary-v\d+$/.test(key) || key.startsWith('vocabulary-app-')))
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function appResponse(request) {
  const cache = await caches.open(APP_CACHE);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    return await fetch(request);
  } catch (error) {
    if (request.mode === 'navigate') {
      const shell = (await cache.match('index.html')) || (await cache.match('./'));
      if (shell) return shell;
    }
    return new Response('Offline and this file was not saved yet.', { status: 503, statusText: 'Offline' });
  }
}

async function dictionaryResponse(request, url) {
  const cache = await caches.open(DICT_CACHE);
  if (url.pathname.endsWith('/manifest.json')) { // always look for a newer dictionary first
    try {
      const fresh = await fetch(request, { cache: 'no-store' });
      if (fresh.ok) { await cache.put(request, fresh.clone()); return fresh; }
    } catch (error) { /* offline: fall through to the saved copy */ }
    return (await cache.match(request, { ignoreSearch: true })) || new Response('', { status: 503, statusText: 'Offline' });
  }
  const cached = await cache.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  if (fresh.ok) await cache.put(request, fresh.clone());
  return fresh;
}

async function fontResponse(request) {
  const cache = await caches.open(FONT_CACHE);
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
    event.respondWith(fontResponse(request));
    return;
  }
  if (url.origin !== self.location.origin) return; // other sites (e.g. api.dictionaryapi.dev) are left untouched

  if (url.pathname.includes('/data/dict/')) event.respondWith(dictionaryResponse(request, url));
  else event.respondWith(appResponse(request));
});

// The page can ask whether every app file is really saved (used by Profile > Offline status).
self.addEventListener('message', event => {
  if (!event.data || event.data.type !== 'STATUS' || !event.ports[0]) return;
  event.waitUntil((async () => {
    const cache = await caches.open(APP_CACHE);
    const missing = [];
    for (const url of CORE) if (!(await cache.match(url))) missing.push(url);
    event.ports[0].postMessage({ build: BUILD, total: CORE.length, missing });
  })());
});
