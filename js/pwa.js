/* Registers the service worker (needs https or localhost; skipped when opened as a plain file)
   and tells you when a new version of the app has been installed in the background. */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  var secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!secure) return;

  var hadController = Boolean(navigator.serviceWorker.controller);

  function showUpdateBanner() {
    if (document.getElementById('update-banner')) return;
    var banner = document.createElement('div');
    banner.id = 'update-banner';
    banner.className = 'update-banner';
    banner.setAttribute('role', 'status');
    banner.innerHTML = '<span>Naya version ready hai.</span><button type="button">Reload</button>';
    banner.querySelector('button').addEventListener('click', function () { location.reload(); });
    document.body.appendChild(banner);
  }

  // A new service worker took over: the page you see is still the old version until it is reloaded.
  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (hadController) showUpdateBanner();
    hadController = true;
  });

  window.addEventListener('load', function () {
    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(function (registration) {
      function check() { registration.update().catch(function () { /* offline: keep using the saved app */ }); }
      document.addEventListener('visibilitychange', function () { if (!document.hidden) check(); });
      window.addEventListener('online', check);
      setInterval(check, 30 * 60 * 1000);
    }).catch(function () { /* app still works without offline support */ });
  });
})();
