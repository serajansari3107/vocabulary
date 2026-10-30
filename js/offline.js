/* Offline status - reports what is REALLY available offline (Profile > Offline status).

   It never assumes: it asks the service worker whether every app file is saved, reads the dictionary state, checks
   whether the browser promised to keep this site's data, and reports which voice features this browser has.
   Nothing here changes your data. */
(() => {
  'use strict';

  const holder = document.getElementById('offline-status');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  let persisted = null; // true / false / null (unknown or unsupported)

  async function readPersisted() {
    try { if (navigator.storage && navigator.storage.persisted) persisted = await navigator.storage.persisted(); } catch (error) { persisted = null; }
    return persisted;
  }

  async function requestPersistence() {
    try {
      if (navigator.storage && navigator.storage.persist) persisted = await navigator.storage.persist();
    } catch (error) { /* ignore */ }
    return persisted;
  }

  async function appFiles() {
    if (!('serviceWorker' in navigator)) return { state: 'unsupported' };
    const secure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    if (!secure) return { state: 'insecure' };
    let registration;
    try { registration = await navigator.serviceWorker.getRegistration(); } catch (error) { return { state: 'unknown' }; }
    if (!registration || !registration.active) return { state: 'not-active' };
    const worker = navigator.serviceWorker.controller || registration.active;
    return new Promise(resolve => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => resolve({ state: 'unknown' }), 3000);
      channel.port1.onmessage = event => {
        clearTimeout(timer);
        const data = event.data || {};
        resolve(data.missing && data.missing.length
          ? { state: 'partial', total: data.total, missing: data.missing.length }
          : { state: 'ok', total: data.total, build: data.build });
      };
      try { worker.postMessage({ type: 'STATUS' }, [channel.port2]); } catch (error) { clearTimeout(timer); resolve({ state: 'unknown' }); }
    });
  }

  function row(tone, title, text, action) {
    return `
      <div class="profile-row static offline-row is-${tone}">
        <span class="offline-dot" aria-hidden="true"></span>
        <span class="profile-row-text"><strong>${esc(title)}</strong><span>${text}</span></span>
        ${action || ''}
      </div>`;
  }

  function appRow(info) {
    switch (info.state) {
      case 'ok': return row('ok', 'App files', `All ${info.total} app files are saved on this device.`);
      case 'partial': return row('warn', 'App files', `${info.missing} of ${info.total} app files are not saved yet. Connect to the internet and reload once.`);
      case 'not-active': return row('warn', 'App files', 'Not saved for offline use yet. Open the app once with internet and wait a few seconds.');
      case 'insecure': return row('warn', 'App files', 'Offline mode needs the app to be opened from its https address.');
      case 'unsupported': return row('warn', 'App files', 'This browser does not support offline mode for web apps.');
      default: return row('warn', 'App files', 'Could not confirm yet. Reload and check again.');
    }
  }

  function dictionaryRow(dict) {
    if (!dict) return row('warn', 'Offline dictionary', 'Dictionary module did not load.');
    const s = dict.getState();
    const retry = '<button type="button" class="small-action offline-action" data-offline-retry>Retry</button>';
    if (s.phase === 'ready') {
      const where = s.backend === 'idb' ? 'stored on this device' : 'loaded for this session from the saved copy';
      return row('ok', 'Offline dictionary', `Ready: ${s.words} words, ${where}.${s.updating ? ' Checking for a newer version…' : ''}`);
    }
    if (s.phase === 'downloading') {
      return row('info', 'Offline dictionary', `Setting up… part ${Math.min(s.done + 1, s.total || 1)} of ${s.total || '?'}. Not ready yet.`);
    }
    if (s.phase === 'incomplete') {
      return row('warn', 'Offline dictionary', `Setup incomplete${s.total ? ` (${s.done} of ${s.total} parts)` : ''}. ${esc(s.message)}`, retry);
    }
    return row('info', 'Offline dictionary', 'Checking…');
  }

  function dataRow() {
    if (!(navigator.storage && navigator.storage.persist)) {
      return row('info', 'Your data', 'Saved words and progress are kept in this browser on this device. This browser cannot confirm protection from automatic clean-up.');
    }
    if (persisted) return row('ok', 'Your data', 'Saved words and progress stay on this device, and the browser has promised not to clear them automatically.');
    return row('warn', 'Your data',
      'Saved words and progress stay on this device, but the browser may clear them if the device runs very low on space.',
      '<button type="button" class="small-action offline-action" data-offline-persist>Protect</button>');
  }

  function voiceRow() {
    const speech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    const mic = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
    const text = `Listen (text-to-speech): ${speech ? 'available' : 'not supported'} here; it uses voices installed on your device. ` +
      `Mic practice: ${mic ? 'supported' : 'not supported'} here${mic ? ', but many browsers (for example Chrome) send your speech to an online service, so it may not work offline' : ''}.`;
    return row('info', 'Voice features (depend on your browser)', esc(text));
  }

  const needsInternetRow = () => row('info', 'Still needs internet',
    'First-time setup, app updates, and Word Explorer lookups for words that are not in the offline dictionary.');

  async function render() {
    if (!holder) return;
    const [files] = await Promise.all([appFiles(), readPersisted()]);
    holder.innerHTML = `
      <div class="panel profile-list-panel offline-panel">
        <div class="panel-heading"><div><div class="eyebrow">OFFLINE STATUS</div><h2>What works without internet</h2></div></div>
        <div class="profile-list">
          ${appRow(files)}
          ${dictionaryRow(window.VocabDictionary)}
          ${dataRow()}
          ${voiceRow()}
          ${needsInternetRow()}
        </div>
      </div>`;
  }

  holder?.addEventListener('click', async event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-offline-retry') && window.VocabDictionary) { window.VocabDictionary.retry(); }
    if (button.hasAttribute('data-offline-persist')) { await requestPersistence(); await render(); }
  });

  const profileVisible = () => { const view = document.getElementById('view-profile'); return Boolean(view && view.classList.contains('active')); };
  if (window.VocabDictionary) window.VocabDictionary.onChange(() => { if (profileVisible()) render(); });

  // Installed apps (standalone) can ask the browser to keep their data without a prompt in most browsers.
  const standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone;
  if (standalone) requestPersistence();

  window.VocabOffline = { renderProfile: render, requestPersistence };
})();
