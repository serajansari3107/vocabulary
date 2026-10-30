/* Offline dictionary - setup, storage and lookup.

   Data: data/dict/manifest.json + pack files (built by tools/build-dictionary.py).
   Storage: IndexedDB database "vocabulary-dictionary" (separate from your saved words and progress, which are never
   touched by dictionary updates). If IndexedDB is unavailable the packs are held in memory for the session and are
   re-read from the saved copy in the "vocabulary-dict" cache, so lookups still work offline.

   "Ready" is only reported after EVERY pack has been downloaded, verified (SHA-256 when the browser supports it),
   stored, and the stored word count matches the manifest. Until then the state is "downloading" or "incomplete".
   Setup is resumable: packs that were already stored are not downloaded again. */
(() => {
  'use strict';

  const MANIFEST_URL = 'data/dict/manifest.json';
  const DB_NAME = 'vocabulary-dictionary';
  const DB_VERSION = 1;
  const DICT_CACHE = 'vocabulary-dict';

  /* ---------- state + subscribers ---------- */
  const listeners = new Set();
  const state = {
    phase: 'checking',   // checking | downloading | ready | incomplete
    done: 0, total: 0, bytesDone: 0, bytesTotal: 0,
    words: 0, version: null, backend: null, updating: false, message: ''
  };
  function setState(patch) {
    Object.assign(state, patch);
    const snapshot = Object.assign({}, state);
    listeners.forEach(listener => { try { listener(snapshot); } catch (error) { /* a broken listener must not stop setup */ } });
  }

  /* ---------- IndexedDB / memory stores ---------- */
  const request = req => new Promise((resolve, reject) => { req.onsuccess = () => resolve(req.result); req.onerror = () => reject(req.error); });
  const transactionDone = tx => new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error('Transaction aborted'));
  });

  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window) || !window.indexedDB) { reject(new Error('IndexedDB is not available')); return; }
      let opened;
      try { opened = indexedDB.open(DB_NAME, DB_VERSION); } catch (error) { reject(error); return; }
      opened.onupgradeneeded = () => {
        const db = opened.result;
        if (!db.objectStoreNames.contains('entries')) db.createObjectStore('entries', { keyPath: 'w' });
        if (!db.objectStoreNames.contains('packs')) db.createObjectStore('packs', { keyPath: 'f' });
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'k' });
      };
      opened.onsuccess = () => resolve(opened.result);
      opened.onerror = () => reject(opened.error || new Error('Could not open IndexedDB'));
      opened.onblocked = () => reject(new Error('IndexedDB is blocked'));
    });
  }

  function indexedStore(db) {
    return {
      kind: 'idb',
      async getMeta() { const row = await request(db.transaction('meta').objectStore('meta').get('state')); return row ? row.v : null; },
      async setMeta(value) { const tx = db.transaction('meta', 'readwrite'); tx.objectStore('meta').put({ k: 'state', v: value }); await transactionDone(tx); },
      async get(word) { return request(db.transaction('entries').objectStore('entries').get(word)); },
      async allKeys() { return request(db.transaction('entries').objectStore('entries').getAllKeys()); },
      async count() { return request(db.transaction('entries').objectStore('entries').count()); },
      async packFiles() { return request(db.transaction('packs').objectStore('packs').getAllKeys()); },
      async putPack(file, entries) {
        const tx = db.transaction(['entries', 'packs'], 'readwrite');
        const entryStore = tx.objectStore('entries');
        entries.forEach(item => entryStore.put({ w: item[0], s: item[1] }));
        tx.objectStore('packs').put({ f: file, words: entries.map(item => item[0]) });
        await transactionDone(tx);
      },
      async removeStale(liveFiles) {
        const live = new Set(liveFiles);
        const all = await request(db.transaction('packs').objectStore('packs').getAll());
        const stale = all.filter(row => !live.has(row.f));
        if (!stale.length) return;
        const liveWords = new Set();
        all.filter(row => live.has(row.f)).forEach(row => row.words.forEach(word => liveWords.add(word)));
        const tx = db.transaction(['entries', 'packs'], 'readwrite');
        stale.forEach(row => {
          row.words.forEach(word => { if (!liveWords.has(word)) tx.objectStore('entries').delete(word); });
          tx.objectStore('packs').delete(row.f);
        });
        await transactionDone(tx);
      }
    };
  }

  function memoryStore() {
    const entries = new Map();
    const packs = new Map();
    let meta = null;
    return {
      kind: 'memory',
      async getMeta() { return meta; },
      async setMeta(value) { meta = value; },
      async get(word) { return entries.get(word) || null; },
      async allKeys() { return Array.from(entries.keys()); },
      async count() { return entries.size; },
      async packFiles() { return Array.from(packs.keys()); },
      async putPack(file, list) { list.forEach(item => entries.set(item[0], { w: item[0], s: item[1] })); packs.set(file, list.map(item => item[0])); },
      async removeStale(liveFiles) {
        const live = new Set(liveFiles);
        const liveWords = new Set();
        packs.forEach((words, file) => { if (live.has(file)) words.forEach(word => liveWords.add(word)); });
        Array.from(packs.keys()).forEach(file => {
          if (live.has(file)) return;
          packs.get(file).forEach(word => { if (!liveWords.has(word)) entries.delete(word); });
          packs.delete(file);
        });
      }
    };
  }

  /* ---------- in-memory word index (words only; entries are read on demand) ---------- */
  let store = null;
  let meta = { packsDone: [], complete: false, version: null, forms: {} };
  let keys = [];
  let keySet = new Set();
  let forms = {};

  async function refreshKeys() {
    const all = await store.allKeys();
    keys = all.map(String).sort();
    keySet = new Set(keys);
  }

  const normalise = raw => String(raw || '')
    .toLowerCase()
    .replace(/[\u2018\u2019`]/g, "'")
    .replace(/'s$/, '')
    .trim()
    .replace(/^[^a-z]+|[^a-z]+$/g, '')
    .replace(/\s+/g, ' ');

  const hasWord = word => keySet.has(word);

  function lowerBound(prefix) {
    let low = 0;
    let high = keys.length;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (keys[mid] < prefix) low = mid + 1; else high = mid;
    }
    return low;
  }

  function prefixMatches(prefix, limit) {
    const out = [];
    for (let i = lowerBound(prefix); i < keys.length && keys[i].startsWith(prefix) && out.length < limit; i += 1) out.push(keys[i]);
    return out;
  }

  /* Optimal string alignment distance (insert, delete, replace, swap two letters), stops early above `max`. */
  function distance(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    let previous2 = null;
    let previous = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i += 1) {
      const row = [i];
      let rowMin = i;
      for (let j = 1; j <= b.length; j += 1) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        let value = Math.min(previous[j] + 1, row[j - 1] + 1, previous[j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, previous2[j - 2] + 1);
        row.push(value);
        if (value < rowMin) rowMin = value;
      }
      if (rowMin > max) return max + 1;
      previous2 = previous;
      previous = row;
    }
    return previous[b.length];
  }

  function similarWords(word, limit) {
    if (word.length < 3) return [];
    const max = word.length <= 4 ? 1 : 2;
    const scored = [];
    for (const key of keys) {
      const value = distance(word, key, max);
      if (value <= max) scored.push({ key, value });
    }
    const shared = key => { let n = 0; while (n < key.length && n < word.length && key[n] === word[n]) n += 1; return n; };
    scored.sort((x, y) => x.value - y.value || shared(y.key) - shared(x.key) || x.key.localeCompare(y.key));
    return scored.slice(0, limit).map(item => item.key);
  }

  /* ---------- reading entries ---------- */
  async function readEntry(word) {
    if (!hasWord(word)) return null;
    const row = await store.get(word);
    if (!row) return null;
    return row.s.map(sense => ({ pos: sense[0], hi: sense[1], syn: sense[2] || [], ex: sense[3], exHi: sense[4] }));
  }

  const undouble = text => (text.length > 2 && text[text.length - 1] === text[text.length - 2] ? text.slice(0, -1) : null);
  const RULES = [
    { suffix: 'ies', pos: ['n', 'v'], make: w => [w.slice(0, -3) + 'y'] },
    { suffix: 'ied', pos: ['v'], make: w => [w.slice(0, -3) + 'y'] },
    { suffix: 'ing', pos: ['v'], make: w => [w.slice(0, -3), w.slice(0, -3) + 'e', undouble(w.slice(0, -3))] },
    { suffix: 'ed', pos: ['v'], make: w => [w.slice(0, -2), w.slice(0, -1), undouble(w.slice(0, -2))] },
    { suffix: 'es', pos: ['n', 'v'], make: w => [w.slice(0, -2), w.slice(0, -1)] },
    { suffix: 's', pos: ['n', 'v'], make: w => (w.endsWith('ss') ? [] : [w.slice(0, -1)]) },
    { suffix: 'iest', pos: ['adj', 'adv'], make: w => [w.slice(0, -4) + 'y'] },
    { suffix: 'ier', pos: ['adj', 'adv'], make: w => [w.slice(0, -3) + 'y'] },
    { suffix: 'est', pos: ['adj', 'adv'], make: w => [w.slice(0, -3), w.slice(0, -2), undouble(w.slice(0, -3))] },
    { suffix: 'er', pos: ['adj', 'adv'], make: w => [w.slice(0, -2), w.slice(0, -1), undouble(w.slice(0, -2))] },
    { suffix: 'ily', pos: ['adj'], make: w => [w.slice(0, -3) + 'y'] },
    { suffix: 'ly', pos: ['adj'], make: w => [w.slice(0, -2)] }
  ];

  /* "running" -> "run", "studies" -> "study". The base word must exist AND have a matching part of speech,
     so "news" is never shown as "new". */
  async function viaInflection(word) {
    for (const rule of RULES) {
      if (!word.endsWith(rule.suffix) || word.length - rule.suffix.length < 2) continue;
      for (const candidate of rule.make(word)) {
        if (!candidate || candidate.length < 3 || !hasWord(candidate)) continue;
        const senses = await readEntry(candidate);
        if (senses && senses.some(sense => rule.pos.includes(sense.pos))) return { word: candidate, senses };
      }
    }
    return null;
  }

  async function lookup(raw) {
    await init();
    const word = normalise(raw);
    if (!word) return { status: 'empty', word: '', suggestions: [] };
    const found = (headword, senses, via) => ({ status: 'found', word: headword, senses, via: via || null });

    const exact = await readEntry(word);
    if (exact) return found(word, exact);

    const formBase = forms[word];
    if (formBase) {
      const senses = await readEntry(formBase);
      if (senses) return found(formBase, senses, { type: 'form', from: word });
    }
    const inflected = await viaInflection(word);
    if (inflected) return found(inflected.word, inflected.senses, { type: 'inflection', from: word });

    const suggestions = [];
    prefixMatches(word, 3).forEach(key => suggestions.push(key));
    similarWords(word, 5).forEach(key => { if (!suggestions.includes(key)) suggestions.push(key); });
    return { status: 'not-found', word, suggestions: suggestions.slice(0, 5), ready: state.phase === 'ready' };
  }

  /* Autocomplete: [{ word, hi }] for the typing box. */
  async function suggest(raw, limit = 6) {
    await init();
    const prefix = normalise(raw);
    if (prefix.length < 2) return [];
    let words = prefixMatches(prefix, limit);
    if (!words.length && prefix.length >= 3) words = similarWords(prefix, limit);
    const out = [];
    for (const word of words) {
      const senses = await readEntry(word);
      out.push({ word, hi: senses && senses[0] ? senses[0].hi : '' });
    }
    return out;
  }

  /* ---------- setup ---------- */
  const fetchJson = async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`Request failed (${response.status}) for ${url}`);
    return response;
  };

  async function sha256Hex(buffer) {
    if (!(window.crypto && crypto.subtle)) return null;
    const hash = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function saveCopy(url, response) {
    try { if ('caches' in window) { const cache = await caches.open(DICT_CACHE); await cache.put(url, response); } } catch (error) { /* optional */ }
  }

  async function loadManifest() {
    const response = await fetchJson(MANIFEST_URL, { cache: 'no-store' });
    const copy = response.clone();
    const manifest = await response.json();
    if (!manifest || manifest.format !== 1 || !Array.isArray(manifest.packs) || !manifest.packs.length) throw new Error('Dictionary manifest is not valid');
    saveCopy(MANIFEST_URL, copy);
    return manifest;
  }

  async function loadPack(pack) {
    const url = `data/dict/${pack.file}`;
    const response = await fetchJson(url);
    const copy = response.clone();
    const buffer = await response.arrayBuffer();
    const digest = await sha256Hex(buffer);
    if (digest && digest !== pack.sha256) throw new Error(`Downloaded file ${pack.file} is damaged (checksum mismatch)`);
    const parsed = JSON.parse(new TextDecoder('utf-8').decode(buffer));
    if (!parsed || !Array.isArray(parsed.entries) || parsed.entries.length !== pack.entries) throw new Error(`Dictionary part ${pack.file} is incomplete`);
    await saveCopy(url, copy);
    return parsed.entries;
  }

  async function pruneSavedCopies(manifest) {
    try {
      if (!('caches' in window)) return;
      const cache = await caches.open(DICT_CACHE);
      const keep = new Set(manifest.packs.map(pack => new URL(`data/dict/${pack.file}`, location.href).href));
      keep.add(new URL(MANIFEST_URL, location.href).href);
      for (const req of await cache.keys()) if (!keep.has(req.url)) await cache.delete(req);
    } catch (error) { /* optional */ }
  }

  function friendlyError(error) {
    if (!navigator.onLine || /Failed to fetch|NetworkError|Load failed|network/i.test(String(error && error.message))) {
      return 'Internet nahi mila. Ek baar online hokar setup poora karo; usse pehle dictionary offline ready nahi hai.';
    }
    if (/damaged|incomplete|not valid/i.test(String(error && error.message))) return 'Downloaded dictionary file theek nahi thi. Dobara try karo.';
    return 'Dictionary setup poora nahi ho paaya. Dobara try karo.';
  }

  let running = null;
  function runSetup() {
    if (running) return running;
    running = (async () => {
      const wasReady = state.phase === 'ready';
      try {
        if (!wasReady) setState({ phase: 'downloading', message: '', done: 0, total: 0, bytesDone: 0, bytesTotal: 0 });
        const manifest = await loadManifest();
        const stored = new Set(await store.packFiles());
        const todo = manifest.packs.filter(pack => !stored.has(pack.file));

        if (!todo.length && meta.complete && meta.version === manifest.version) {
          setState({ phase: 'ready', words: keys.length, version: meta.version, updating: false });
          return;
        }
        setState({
          phase: wasReady ? 'ready' : 'downloading', updating: wasReady,
          total: manifest.packs.length, done: manifest.packs.length - todo.length,
          bytesTotal: manifest.totalBytes || 0,
          bytesDone: manifest.packs.filter(pack => stored.has(pack.file)).reduce((sum, pack) => sum + pack.bytes, 0)
        });

        for (const pack of todo) {
          const entries = await loadPack(pack);
          await store.putPack(pack.file, entries);
          setState({ done: state.done + 1, bytesDone: state.bytesDone + pack.bytes });
        }

        const count = await store.count();
        if (count < manifest.entries) throw new Error('Dictionary is incomplete after download');
        await store.removeStale(manifest.packs.map(pack => pack.file));
        meta = { packsDone: manifest.packs.map(pack => pack.file), complete: true, version: manifest.version, forms: manifest.forms || {}, entries: manifest.entries, finishedAt: Date.now() };
        await store.setMeta(meta);
        forms = meta.forms;
        await refreshKeys();
        setState({ phase: 'ready', words: keys.length, version: manifest.version, updating: false, done: manifest.packs.length, total: manifest.packs.length, message: '' });
        pruneSavedCopies(manifest);
        window.dispatchEvent(new CustomEvent('vocabulary:dictionary-ready', { detail: { words: keys.length } }));
      } catch (error) {
        if (wasReady) { setState({ updating: false }); return; } // an update failed; the dictionary you already have keeps working
        console.warn('Dictionary setup incomplete:', error);
        await refreshKeys().catch(() => {});
        setState({ phase: 'incomplete', words: keys.length, updating: false, message: friendlyError(error) });
      }
    })().finally(() => { running = null; });
    return running;
  }

  /* ---------- start-up ---------- */
  let starting = null;
  function init() {
    if (starting) return starting;
    starting = (async () => {
      try {
        store = indexedStore(await openDatabase());
      } catch (error) {
        store = memoryStore();
      }
      setState({ backend: store.kind });
      try { meta = (await store.getMeta()) || meta; } catch (error) { /* keep defaults */ }
      forms = meta.forms || {};
      await refreshKeys();
      if (meta.complete && keys.length) setState({ phase: 'ready', words: keys.length, version: meta.version, done: (meta.packsDone || []).length, total: (meta.packsDone || []).length });
      else setState({ phase: 'checking', words: keys.length });
    })();
    return starting;
  }

  function startSetup() { return init().then(runSetup); }

  window.addEventListener('online', () => { if (starting && state.phase !== 'downloading') runSetup(); });
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && starting && state.phase === 'incomplete' && navigator.onLine !== false) runSetup();
  });

  window.VocabDictionary = {
    init,
    start: startSetup,
    retry: startSetup,
    lookup,
    suggest,
    has: raw => hasWord(normalise(raw)),
    getState: () => Object.assign({}, state),
    onChange(listener) { listeners.add(listener); return () => listeners.delete(listener); }
  };

  // Begin as soon as the browser is idle so first-time setup never delays the first screen.
  const begin = () => startSetup();
  if ('requestIdleCallback' in window) requestIdleCallback(begin, { timeout: 1500 }); else setTimeout(begin, 400);
})();
