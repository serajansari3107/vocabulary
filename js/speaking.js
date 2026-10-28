/* Speaking Studio - UI, text-to-speech, speech recognition and progress (offline, vanilla JS).
   Content lives in js/speaking-data.js (window.SpeakingStudio).
   Progress is saved in localStorage under "vocabulary.speakingStudio.v1".
   Voice features use only what the browser provides (speechSynthesis / SpeechRecognition):
   no API keys, no external service added by this app. */
(() => {
  'use strict';

  const STORAGE_KEY = 'vocabulary.speakingStudio.v1';
  const RECOGNITION_LANG = 'en-IN';

  const root = document.getElementById('speaking-root');
  const data = window.SpeakingStudio;
  if (!root) return;

  /* ---------- content ---------- */
  const levels = (data && data.levels) || [];
  const levelTitle = id => (levels.find(level => level.id === id) || { title: id }).title;

  const topics = ((data && data.topics) || []).map(topic => ({
    id: topic.id, title: topic.title, icon: topic.icon, level: topic.level, tip: topic.tip, real: topic.real,
    sentences: topic.s.map((row, index) => ({
      id: `${topic.id}:${index + 1}`, topicId: topic.id, en: row[0], hi: row[1], use: row[2], speaker: 0
    }))
  }));
  const dialogues = ((data && data.dialogues) || []).map(dialogue => ({
    id: dialogue.id, title: dialogue.title, level: dialogue.level, scene: dialogue.scene, roles: dialogue.roles,
    lines: dialogue.lines.map((line, index) => ({
      id: `d:${dialogue.id}:${index}`, speaker: line[0], en: line[1], hi: line[2]
    }))
  }));

  const topicById = new Map(topics.map(topic => [topic.id, topic]));
  const dialogueById = new Map(dialogues.map(dialogue => [dialogue.id, dialogue]));
  const speakables = new Map(); // key -> { en, speaker }
  topics.forEach(topic => topic.sentences.forEach(s => speakables.set(s.id, s)));
  dialogues.forEach(dialogue => dialogue.lines.forEach(line => speakables.set(line.id, line)));
  const totalSentences = topics.reduce((sum, topic) => sum + topic.sentences.length, 0);

  /* ---------- small helpers ---------- */
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const toastEl = document.getElementById('toast');
  let toastTimer;
  function notify(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3200);
  }

  const searchKey = text => String(text || '').toLowerCase().replace(/[^a-z0-9\s]+/g, ' ').replace(/\s+/g, ' ').trim();

  const ICON = {
    listen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4Z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></svg>',
    mic: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 8 12l7 7"/></svg>'
  };

  /* ---------- progress (localStorage) ---------- */
  const isObject = value => value && typeof value === 'object' && !Array.isArray(value);
  const defaults = () => ({ version: 1, sentences: {}, dialogues: {}, rounds: {} });
  let storageWarned = false;

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      return {
        version: 1,
        sentences: isObject(parsed.sentences) ? parsed.sentences : {},
        dialogues: isObject(parsed.dialogues) ? parsed.dialogues : {},
        rounds: isObject(parsed.rounds) ? parsed.rounds : {}
      };
    } catch (error) {
      return defaults();
    }
  }
  let progress = loadProgress();

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch (error) {
      if (!storageWarned) {
        storageWarned = true;
        notify('Progress save nahi ho paaya (browser storage band hai). Is session mein hi dikhega.');
      }
      return false;
    }
  }

  const sentenceDone = id => Boolean(progress.sentences[id]);
  const dialogueDone = id => Boolean(progress.dialogues[id]);

  function topicStats(topic) {
    const done = topic.sentences.filter(s => sentenceDone(s.id)).length;
    const total = topic.sentences.length;
    return { done, total, complete: total > 0 && done === total, rounds: Number(progress.rounds[topic.id]) || 0 };
  }

  function overallStats() {
    const sentencesDone = topics.reduce((sum, topic) => sum + topicStats(topic).done, 0);
    const topicsDone = topics.filter(topic => topicStats(topic).complete).length;
    const dialoguesDone = dialogues.filter(d => dialogueDone(d.id)).length;
    const unitsTotal = totalSentences + dialogues.length;
    const unitsDone = sentencesDone + dialoguesDone;
    return {
      sentencesDone, sentencesTotal: totalSentences,
      topicsDone, topicsTotal: topics.length,
      dialoguesDone, dialoguesTotal: dialogues.length,
      percent: unitsTotal ? Math.round((unitsDone / unitsTotal) * 100) : 0
    };
  }

  function setSentence(id, value) {
    if (value) progress.sentences[id] = Date.now();
    else delete progress.sentences[id];
    saveProgress();
  }

  /* ---------- daily set ---------- */
  function dayNumber() {
    const now = new Date();
    return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
  }

  function dailyItems() {
    if (!topics.length) return [];
    const day = dayNumber();
    const items = [];
    for (let i = 0; i < 5; i += 1) {
      const n = day * 5 + i;
      const topic = topics[n % topics.length];
      items.push(topic.sentences[Math.floor(n / topics.length) % topic.sentences.length]);
    }
    return items;
  }

  function getSet(id) {
    if (id === 'daily') {
      return {
        id: 'daily', title: 'Today\u2019s Speaking', icon: 'Dy', level: null, daily: true, items: dailyItems(),
        tip: 'Aaj ke 5 sentences alag-alag topics se chune gaye hain. Roz naye sentences milenge.', real: ''
      };
    }
    const topic = topicById.get(id);
    if (!topic) return null;
    return { id: topic.id, title: topic.title, icon: topic.icon, level: topic.level, daily: false, items: topic.sentences, tip: topic.tip, real: topic.real };
  }

  /* ---------- browser voice capability ---------- */
  const synth = ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) ? window.speechSynthesis : null;
  const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition || null;

  let voices = [];
  function loadVoices() {
    try { voices = synth ? synth.getVoices() : []; } catch (error) { voices = []; }
  }
  if (synth) {
    loadVoices();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', loadVoices);
  }

  function pickVoice() {
    const wanted = ['en-in', 'en-us', 'en-gb'];
    const clean = voice => String(voice.lang || '').replace('_', '-').toLowerCase();
    for (const lang of wanted) {
      const found = voices.find(voice => clean(voice) === lang);
      if (found) return found;
    }
    return voices.find(voice => /^en/.test(clean(voice))) || null;
  }

  let playingButton = null;
  function stopSpeech() {
    if (synth) { try { synth.cancel(); } catch (error) { /* ignore */ } }
    if (playingButton) playingButton.classList.remove('is-playing');
    playingButton = null;
  }

  function listenTo(key, button) {
    if (!synth) { notify('Is browser mein Text-to-Speech support nahi hai.'); return; }
    const item = speakables.get(key);
    if (!item) return;
    if (playingButton === button) { stopSpeech(); return; }
    stopSpeech();
    loadVoices();
    const utterance = new SpeechSynthesisUtterance(item.en);
    const voice = pickVoice();
    if (voice) { utterance.voice = voice; utterance.lang = voice.lang; } else { utterance.lang = 'en-US'; }
    utterance.rate = 0.9;
    utterance.pitch = item.speaker === 1 ? 1.1 : 1;
    const finish = () => {
      if (playingButton === button) playingButton = null;
      button.classList.remove('is-playing');
    };
    utterance.onend = finish;
    utterance.onerror = event => {
      finish();
      const code = event && event.error;
      if (code && code !== 'canceled' && code !== 'interrupted') {
        notify('Audio play nahi ho paaya. Device ki English voice/volume check karo.');
      }
    };
    playingButton = button;
    button.classList.add('is-playing');
    setTimeout(() => { if (playingButton === button) synth.speak(utterance); }, 40);
    if (!voices.length) {
      // Some browsers load voices late; if there truly is none, speak() may stay silent.
      setTimeout(() => {
        loadVoices();
        if (!voices.length && playingButton === button) notify('Is device par English voice nahi mili, isliye audio na aaye to device settings mein voice install karo.');
      }, 1500);
    }
  }

  /* ---------- speech comparison (real word-level match, no invented scores) ---------- */
  const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const numberWords = n => (n < 20 ? ONES[n] : `${TENS[Math.floor(n / 10)]}${n % 10 ? ` ${ONES[n % 10]}` : ''}`);

  const CONTRACTIONS = {
    "i'm": 'i am', "you're": 'you are', "we're": 'we are', "they're": 'they are',
    "i'll": 'i will', "you'll": 'you will', "we'll": 'we will', "they'll": 'they will',
    "i'd": 'i would', "you'd": 'you would', "we'd": 'we would',
    "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have',
    "let's": 'let us', "that's": 'that is', "it's": 'it is', "there's": 'there is',
    "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "can't": 'cannot', "won't": 'will not',
    "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "haven't": 'have not', "hasn't": 'has not',
    "couldn't": 'could not', "wouldn't": 'would not', "shouldn't": 'should not'
  };
  const WORD_ALIASES = { mister: 'mr', ok: 'okay', 'can not': 'cannot' };

  function tokenize(word) {
    let text = String(word).toLowerCase().replace(/[\u2018\u2019`]/g, "'").replace(/%/g, ' percent ');
    text = text.replace(/\b\d{1,2}\b/g, number => ` ${numberWords(Number(number))} `);
    text = text.replace(/[^a-z0-9'\s-]/g, ' ').replace(/-/g, ' ');
    const out = [];
    text.split(/\s+/).forEach(piece => {
      const cleaned = piece.replace(/^'+|'+$/g, '');
      if (!cleaned) return;
      const expanded = CONTRACTIONS[cleaned] || WORD_ALIASES[cleaned] || cleaned;
      expanded.split(' ').forEach(part => { if (part) out.push(part); });
    });
    return out;
  }

  /* Compare what the sentence should be with what the browser recognised. */
  function compareSpeech(target, heard) {
    const targetWords = String(target).split(/\s+/).filter(Boolean);
    const flat = []; // { token, owner }
    targetWords.forEach((word, owner) => tokenize(word).forEach(token => flat.push({ token, owner })));
    const heardTokens = tokenize(heard);

    const n = flat.length;
    const m = heardTokens.length;
    const table = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i -= 1) {
      for (let j = m - 1; j >= 0; j -= 1) {
        table[i][j] = flat[i].token === heardTokens[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }
    const matchedFlat = new Array(n).fill(false);
    const matchedHeard = new Array(m).fill(false);
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (flat[i].token === heardTokens[j]) { matchedFlat[i] = true; matchedHeard[j] = true; i += 1; j += 1; }
      else if (table[i + 1][j] >= table[i][j + 1]) i += 1;
      else j += 1;
    }
    const ownerOk = targetWords.map(() => true);
    const ownerHasToken = targetWords.map(() => false);
    flat.forEach((entry, index) => {
      ownerHasToken[entry.owner] = true;
      if (!matchedFlat[index]) ownerOk[entry.owner] = false;
    });
    const matchedCount = matchedFlat.filter(Boolean).length;
    return {
      score: n ? matchedCount / n : 0,
      words: targetWords.map((word, index) => ({ word, ok: ownerHasToken[index] ? ownerOk[index] : true })),
      extra: heardTokens.filter((token, index) => !matchedHeard[index])
    };
  }

  /* ---------- speech recognition ---------- */
  let recognition = null;
  let recognitionKey = null;
  let recognitionButton = null;
  let recognitionAborted = false;
  let recognitionWatchdog = null;

  const feedbackFor = key => Array.from(root.querySelectorAll('[data-sp-feedback]')).find(el => el.dataset.spFeedback === key) || null;

  function showMessage(el, tone, text) {
    if (!el) return;
    el.innerHTML = `<div class="sp-result is-${tone}" role="status"><p>${esc(text)}</p></div>`;
  }

  function resetMicButton(button) {
    if (!button) return;
    button.classList.remove('is-listening');
    const label = button.querySelector('span');
    if (label) label.textContent = 'Speak';
  }

  function stopRecognition() {
    clearTimeout(recognitionWatchdog);
    if (recognition) {
      recognitionAborted = true;
      try { recognition.abort(); } catch (error) { /* ignore */ }
    }
    resetMicButton(recognitionButton);
    recognition = null;
    recognitionKey = null;
    recognitionButton = null;
  }

  const RECOGNITION_ERRORS = {
    'not-allowed': 'Microphone permission nahi mili. Browser ya site settings mein microphone allow karo (https ya localhost zaroori hai). Tab tak Listen aur manual practice use kar sakte ho.',
    'service-not-allowed': 'Is browser ne speech recognition service block ki hai. Listen aur manual practice abhi bhi kaam karte hain.',
    'audio-capture': 'Microphone nahi mila. Mic connect ya enable karke dobara try karo.',
    network: 'Speech recognition ke liye browser ki online service chahiye. Internet check karke dobara try karo.',
    'language-not-supported': 'Is browser mein English speech recognition available nahi hai.',
    'no-speech': 'Kuch sunai nahi diya. Mic ke paas saaf bolkar dobara try karo.'
  };

  function renderRecognitionResult(el, target, alternatives) {
    const ranked = alternatives
      .filter(text => text && text.trim())
      .map(text => ({ text, result: compareSpeech(target, text) }))
      .sort((a, b) => b.result.score - a.result.score);
    if (!ranked.length) { showMessage(el, 'warn', RECOGNITION_ERRORS['no-speech']); return; }
    const { text, result } = ranked[0];
    const percent = Math.round(result.score * 100);
    const tone = percent >= 90 ? 'good' : percent >= 60 ? 'ok' : 'low';
    const verdict = tone === 'good'
      ? 'Bahut achha! Aapne lagbhag poora sentence sahi bola.'
      : tone === 'ok'
        ? 'Achha try! Red words par dhyan dekar dobara bolo.'
        : 'Dobara try karo. Pehle Listen dabao, phir dheere aur saaf bolo.';
    const words = result.words.map(item => `<span class="${item.ok ? 'is-ok' : 'is-miss'}">${esc(item.word)}</span>`).join(' ');
    const extra = result.extra.length ? `<p class="sp-extra">Extra words: ${esc(result.extra.join(', '))}</p>` : '';
    el.innerHTML = `
      <div class="sp-result is-${tone}" role="status">
        <p class="sp-result-head"><strong>Word match: ${percent}%</strong> <span>${esc(verdict)}</span></p>
        <p class="sp-words" aria-label="Target sentence with matched and missed words">${words}</p>
        <p class="sp-heard">Browser ne suna: \u201c${esc(text)}\u201d</p>
        ${extra}
        <p class="sp-note">Yeh browser ki recognition se bane text ka word-match hai, pronunciation score nahi.</p>
      </div>`;
  }

  function startRecognition(key, button) {
    if (!SpeechRecognitionCtor) { notify('Is browser mein speech recognition support nahi hai.'); return; }
    if (recognitionKey === key) { stopRecognition(); showMessage(feedbackFor(key), 'warn', 'Recording rok di gayi.'); return; }
    stopSpeech();
    stopRecognition();
    const item = speakables.get(key);
    const el = feedbackFor(key);
    if (!item) return;

    let instance;
    try {
      instance = new SpeechRecognitionCtor();
    } catch (error) {
      showMessage(el, 'low', 'Speech recognition start nahi ho paayi. Page refresh karke dobara try karo.');
      return;
    }
    instance.lang = RECOGNITION_LANG;
    instance.interimResults = false;
    instance.maxAlternatives = 3;
    instance.continuous = false;

    let gotResult = false;
    let failed = false;
    recognitionAborted = false;

    instance.onstart = () => {
      clearTimeout(recognitionWatchdog);
      button.classList.add('is-listening');
      const label = button.querySelector('span');
      if (label) label.textContent = 'Listening\u2026';
      showMessage(el, 'info', 'Sun raha hoon\u2026 ab sentence boliye. Rokne ke liye button dobara dabao.');
    };
    instance.onresult = event => {
      gotResult = true;
      const alternatives = Array.from((event.results && event.results[0]) || []).map(alt => alt.transcript);
      renderRecognitionResult(el, item.en, alternatives);
    };
    instance.onerror = event => {
      clearTimeout(recognitionWatchdog);
      if (recognitionAborted) return;
      failed = true;
      const code = event && event.error;
      showMessage(el, 'low', RECOGNITION_ERRORS[code] || `Speech recognition mein problem aayi${code ? ` (${code})` : ''}. Dobara try karo.`);
    };
    instance.onend = () => {
      clearTimeout(recognitionWatchdog);
      resetMicButton(button);
      if (recognition === instance) { recognition = null; recognitionKey = null; recognitionButton = null; }
      if (!gotResult && !failed && !recognitionAborted) showMessage(el, 'warn', RECOGNITION_ERRORS['no-speech']);
    };

    recognition = instance;
    recognitionKey = key;
    recognitionButton = button;
    try {
      instance.start();
      // Never stay silent: tell the user right away, and again if the browser never reports that listening began.
      const label = button.querySelector('span');
      if (label) label.textContent = 'Starting\u2026';
      showMessage(el, 'info', 'Microphone start ho raha hai\u2026 agar browser permission poochhe to Allow dabao.');
      recognitionWatchdog = setTimeout(() => {
        if (recognition === instance && !button.classList.contains('is-listening')) {
          showMessage(el, 'warn', 'Abhi tak microphone start nahi hua. Agar permission prompt dikha hai to Allow dabao. Prompt na aaye to is browser ya device par mic recognition kaam nahi kar rahi; Listen aur manual practice use karo. Rokne ke liye Speak button dobara dabao.');
        }
      }, 6000);
    } catch (error) {
      resetMicButton(button);
      recognition = null; recognitionKey = null; recognitionButton = null;
      showMessage(el, 'low', 'Microphone start nahi ho paaya. Permission aur browser support check karo.');
    }
  }

  function stopAll() {
    stopSpeech();
    stopRecognition();
  }

  /* ---------- state ---------- */
  let state = { screen: 'hub', level: 'all', query: '', setId: null, step: 0, countedPass: false, dialogueId: null, mode: 'read', role: 0, dstep: 0 };

  /* ---------- render: shared pieces ---------- */
  function supportNote() {
    const lines = [];
    if (!synth) lines.push('Is browser mein Text-to-Speech support nahi hai, isliye Listen button kaam nahi karega.');
    if (!SpeechRecognitionCtor) lines.push('Is browser mein microphone speech recognition support nahi hai. Aap Listen sunkar bolkar practice kar sakte ho aur sentence ko manually practiced mark kar sakte ho. Mic feedback ke liye Chrome ya Edge try karo.');
    else lines.push('Mic feedback browser ki speech recognition par depend karta hai. Pehli baar microphone permission poochi jaayegi.');
    return `<p class="sp-support ${(!synth || !SpeechRecognitionCtor) ? 'is-limited' : ''}">${esc(lines.join(' '))}</p>`;
  }

  function voiceControls(key, options = {}) {
    const listenDisabled = synth ? '' : ' disabled aria-disabled="true" title="Text-to-Speech support nahi hai"';
    const mic = SpeechRecognitionCtor && options.mic !== false
      ? `<button type="button" class="sp-btn" data-sp-mic="${esc(key)}">${ICON.mic}<span>Speak</span></button>` : '';
    const toggle = options.toggle
      ? `<button type="button" class="sp-btn sp-done-btn" data-sp-toggle="${esc(key)}" aria-pressed="${sentenceDone(key)}">${ICON.check}<span>Practiced</span></button>` : '';
    return `
      <div class="sp-actions">
        <button type="button" class="sp-btn" data-sp-listen="${esc(key)}"${listenDisabled}>${ICON.listen}<span>Listen</span></button>
        ${mic}${toggle}
      </div>
      <div class="sp-feedback" data-sp-feedback="${esc(key)}" aria-live="polite"></div>`;
  }

  const levelChip = id => id ? `<span class="sp-level is-${esc(id)}">${esc(levelTitle(id))}</span>` : '';

  /* ---------- render: hub ---------- */
  function topicCard(topic) {
    const st = topicStats(topic);
    const percent = Math.round((st.done / st.total) * 100);
    const status = st.complete ? `Completed${st.rounds ? ` \u00b7 ${st.rounds} round${st.rounds > 1 ? 's' : ''}` : ''}`
      : st.done ? `${st.done}/${st.total} practiced` : 'Not started';
    return `
      <button type="button" class="sp-topic ${st.complete ? 'is-complete' : ''}" data-sp-open-topic="${esc(topic.id)}">
        <span class="sp-topic-icon">${esc(topic.icon)}</span>
        <span class="sp-topic-body"><strong>${esc(topic.title)}</strong><span class="sp-topic-meta">${st.total} sentences ${levelChip(topic.level)}</span></span>
        <span class="sp-bar" aria-hidden="true"><i style="width:${percent}%"></i></span>
        <span class="sp-status ${st.complete ? 'is-complete' : st.done ? 'is-started' : ''}">${esc(status)}</span>
      </button>`;
  }

  function dialogueCard(dialogue) {
    const done = dialogueDone(dialogue.id);
    return `
      <button type="button" class="sp-topic sp-dialogue-card ${done ? 'is-complete' : ''}" data-sp-open-dialogue="${esc(dialogue.id)}">
        <span class="sp-topic-icon">Dg</span>
        <span class="sp-topic-body"><strong>${esc(dialogue.title)}</strong><span class="sp-topic-meta">${dialogue.lines.length} lines \u00b7 ${esc(dialogue.roles.join(' & '))} ${levelChip(dialogue.level)}</span></span>
        <span class="sp-status ${done ? 'is-complete' : ''}">${done ? 'Practiced' : 'Not started'}</span>
      </button>`;
  }

  function sentenceHit(sentence) {
    const topic = topicById.get(sentence.topicId);
    return `
      <article class="sp-hit">
        <div class="sp-hit-text">
          <p class="sp-en">${esc(sentence.en)}</p>
          <p class="sp-hi">${esc(sentence.hi)}</p>
          <span class="sp-hit-topic">${esc(topic.title)} \u00b7 ${esc(levelTitle(topic.level))}</span>
        </div>
        <div class="sp-hit-actions">
          <button type="button" class="sp-btn" data-sp-listen="${esc(sentence.id)}"${synth ? '' : ' disabled aria-disabled="true"'}>${ICON.listen}<span>Listen</span></button>
          <button type="button" class="sp-btn" data-sp-open-topic="${esc(topic.id)}"><span>Open topic</span></button>
        </div>
      </article>`;
  }

  function renderResults() {
    const q = searchKey(state.query);
    const level = state.level;
    const levelOk = id => level === 'all' || id === level;

    if (q) {
      const foundTopics = topics.filter(t => levelOk(t.level) && searchKey(`${t.title} ${t.tip}`).includes(q));
      const foundDialogues = dialogues.filter(d => levelOk(d.level) && searchKey(`${d.title} ${d.scene}`).includes(q));
      const foundSentences = [];
      topics.forEach(t => {
        if (!levelOk(t.level)) return;
        t.sentences.forEach(s => { if (searchKey(`${s.en} ${s.hi} ${s.use}`).includes(q)) foundSentences.push(s); });
      });
      if (!foundTopics.length && !foundDialogues.length && !foundSentences.length) {
        return `<div class="sp-empty"><h3>Koi result nahi mila</h3><p>Dusra word try karo, jaise \u201cticket\u201d, \u201cmeeting\u201d ya \u201cdoctor\u201d, ya level filter badlo.</p></div>`;
      }
      const shown = foundSentences.slice(0, 24);
      return `
        ${foundTopics.length ? `<section class="sp-group"><h3>Topics <span>${foundTopics.length}</span></h3><div class="sp-grid">${foundTopics.map(topicCard).join('')}</div></section>` : ''}
        ${foundDialogues.length ? `<section class="sp-group"><h3>Conversations <span>${foundDialogues.length}</span></h3><div class="sp-grid">${foundDialogues.map(dialogueCard).join('')}</div></section>` : ''}
        ${shown.length ? `<section class="sp-group"><h3>Sentences <span>${foundSentences.length}</span></h3><div class="sp-hits">${shown.map(sentenceHit).join('')}</div>${foundSentences.length > shown.length ? `<p class="sp-more">Pehle ${shown.length} sentences dikhaye gaye hain. Search thoda aur specific karo.</p>` : ''}</section>` : ''}`;
    }

    const groups = levels.filter(item => levelOk(item.id)).map(item => {
      const levelTopics = topics.filter(t => t.level === item.id);
      const levelDialogues = dialogues.filter(d => d.level === item.id);
      return `
        <section class="sp-group">
          <div class="sp-group-head"><div><span class="sp-level is-${esc(item.id)}">${esc(item.title)}</span><p>${esc(item.note)}</p></div></div>
          <div class="sp-grid">${levelTopics.map(topicCard).join('')}</div>
          ${levelDialogues.length ? `<h4 class="sp-sub">Conversation Practice</h4><div class="sp-grid">${levelDialogues.map(dialogueCard).join('')}</div>` : ''}
        </section>`;
    });
    return groups.join('');
  }

  function renderHub() {
    const st = overallStats();
    const items = dailyItems();
    const dailyDone = items.filter(s => sentenceDone(s.id)).length;
    const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const chips = ['all', ...levels.map(l => l.id)].map(id => `
      <button type="button" class="sp-chip" data-sp-level="${esc(id)}" aria-pressed="${state.level === id}">${id === 'all' ? 'All' : esc(levelTitle(id))}</button>`).join('');

    return `
      <section class="sp-hero" aria-label="Speaking progress">
        <div class="sp-ring" style="--sp-pct:${st.percent}" role="img" aria-label="${st.percent} percent complete"><span>${st.percent}%</span></div>
        <div class="sp-hero-text">
          <span class="skill-tag">YOUR SPEAKING PROGRESS</span>
          <h2 id="sp-title" tabindex="-1">Speaking Studio</h2>
          <p>${st.sentencesDone} of ${st.sentencesTotal} sentences \u00b7 ${st.topicsDone} of ${st.topicsTotal} topics \u00b7 ${st.dialoguesDone} of ${st.dialoguesTotal} conversations</p>
          <div class="sp-caps">
            <span class="sp-cap ${synth ? 'is-on' : 'is-off'}">Listen: ${synth ? 'available' : 'not supported'}</span>
            <span class="sp-cap ${SpeechRecognitionCtor ? 'is-on' : 'is-off'}">Mic practice: ${SpeechRecognitionCtor ? 'supported' : 'not supported here'}</span>
          </div>
        </div>
      </section>

      <section class="sp-daily" aria-label="Daily Speaking">
        <div class="sp-daily-text">
          <span class="skill-tag">DAILY SPEAKING \u00b7 ${esc(today.toUpperCase())}</span>
          <h3>Aaj ke 5 sentences</h3>
          <p>Alag-alag topics se chune gaye roz ke naye sentences. Aaj ${dailyDone} of ${items.length} practiced.</p>
        </div>
        <button type="button" class="primary-button sp-daily-btn" data-sp-open-set="daily">${dailyDone === items.length && items.length ? 'Practice again' : dailyDone ? 'Continue today' : 'Start today\u2019s practice'} <span aria-hidden="true">\u2192</span></button>
      </section>

      <section class="sp-search-panel" aria-label="Find a topic">
        <label class="sp-search" for="sp-search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg>
          <input id="sp-search" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="Search topics ya sentences" value="${esc(state.query)}" aria-label="Search speaking topics and sentences">
        </label>
        <div class="sp-chips" role="group" aria-label="Difficulty filter">${chips}</div>
      </section>

      <div id="sp-results" class="sp-results" aria-live="polite">${renderResults()}</div>`;
  }

  /* ---------- render: sentence list (topic or daily) ---------- */
  function renderSet(set) {
    const done = set.items.filter(s => sentenceDone(s.id)).length;
    const total = set.items.length;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const topic = set.daily ? null : topicById.get(set.id);
    const rounds = topic ? topicStats(topic).rounds : 0;
    const rows = set.items.map(s => {
      const origin = set.daily ? `<span class="sp-hit-topic">${esc(topicById.get(s.topicId).title)}</span>` : '';
      return `
        <article class="sp-sentence ${sentenceDone(s.id) ? 'is-done' : ''}" data-sp-row="${esc(s.id)}">
          <div class="sp-sentence-text">
            ${origin}
            <p class="sp-en">${esc(s.en)}</p>
            <p class="sp-hi">${esc(s.hi)}</p>
            <p class="sp-use"><b>Kab bolein:</b> ${esc(s.use)}</p>
          </div>
          ${voiceControls(s.id, { toggle: true })}
        </article>`;
    }).join('');

    return `
      <div class="sp-toolbar"><button type="button" class="sp-back" data-sp-back>${ICON.back}<span>Speaking Studio</span></button></div>
      <section class="sp-set-head">
        <div class="sp-set-title">
          <span class="sp-topic-icon is-large">${esc(set.icon)}</span>
          <div>
            <h2 id="sp-title" tabindex="-1">${esc(set.title)}</h2>
            <div class="sp-set-meta">${levelChip(set.level)}<span id="sp-set-count">${done}/${total} practiced</span>${rounds ? `<span>${rounds} round${rounds > 1 ? 's' : ''} done</span>` : ''}</div>
          </div>
        </div>
        <span class="sp-bar is-wide" aria-hidden="true"><i id="sp-set-bar" style="width:${percent}%"></i></span>
        <p class="sp-tip">${esc(set.tip)}</p>
        ${set.real ? `<div class="sp-real"><b>Real-life example</b><p>${esc(set.real)}</p></div>` : ''}
        ${supportNote()}
        <div class="sp-cta">
          <button type="button" class="primary-button" data-sp-start>${total && done === total ? 'Repeat practice' : 'Start step-by-step practice'} <span aria-hidden="true">\u2192</span></button>
        </div>
      </section>
      <section class="sp-list" aria-label="Sentences">${rows}</section>`;
  }

  /* ---------- render: guided practice ---------- */
  function renderPractice(set) {
    const total = set.items.length;
    const item = set.items[state.step];
    const percent = Math.round((state.step / total) * 100);
    const alreadyDone = sentenceDone(item.id);
    const last = state.step === total - 1;
    return `
      <div class="sp-toolbar"><button type="button" class="sp-back" data-sp-exit-practice>${ICON.back}<span>${esc(set.title)}</span></button></div>
      <section class="sp-practice">
        <div class="sp-practice-top">
          <h2 id="sp-title" tabindex="-1">Sentence ${state.step + 1} of ${total}</h2>
          ${alreadyDone ? '<span class="sp-badge-done">Already practiced</span>' : ''}
        </div>
        <span class="sp-bar is-wide" aria-hidden="true"><i style="width:${percent}%"></i></span>
        <div class="sp-big">
          <p class="sp-en is-big">${esc(item.en)}</p>
          <p class="sp-hi">${esc(item.hi)}</p>
          <p class="sp-use"><b>Kab bolein:</b> ${esc(item.use)}</p>
        </div>
        <p class="sp-steps-help">1. Listen dabao  2. Sentence ko 2\u20133 baar bolo${SpeechRecognitionCtor ? '  3. Speak se check karo' : ''}  ${SpeechRecognitionCtor ? '4' : '3'}. Practiced dabao.</p>
        ${voiceControls(item.id, { toggle: false })}
        ${(!synth || !SpeechRecognitionCtor) ? supportNote() : ''}
        <div class="sp-pager">
          <button type="button" class="sp-ghost" data-sp-prev ${state.step === 0 ? 'disabled' : ''}>Previous</button>
          <button type="button" class="sp-ghost" data-sp-skip>Skip</button>
          <button type="button" class="primary-button" data-sp-next>${last ? 'Practiced \u2014 finish' : 'Practiced \u2014 next'} <span aria-hidden="true">\u2192</span></button>
        </div>
      </section>`;
  }

  function renderSetDone(set) {
    const done = set.items.filter(s => sentenceDone(s.id)).length;
    const total = set.items.length;
    const all = done === total;
    const topic = set.daily ? null : topicById.get(set.id);
    const rounds = topic ? topicStats(topic).rounds : 0;
    return `
      <div class="sp-toolbar"><button type="button" class="sp-back" data-sp-exit-practice>${ICON.back}<span>${esc(set.title)}</span></button></div>
      <section class="sp-finish">
        <div class="sp-finish-icon">${all ? ICON.check : '\u2026'}</div>
        <h2 id="sp-title" tabindex="-1">${all ? (set.daily ? 'Aaj ka practice poora!' : 'Round complete!') : 'Kuch sentences baaki hain'}</h2>
        <p>${done} of ${total} sentences practiced${rounds ? ` \u00b7 ${rounds} round${rounds > 1 ? 's' : ''} completed` : ''}.</p>
        <p class="sp-muted">${all ? 'Bahut badhiya. Yaad rakhne ke liye is topic ko kuch din baad dobara repeat karo.' : 'Skip kiye hue sentences list se practice karke \u201cPracticed\u201d mark kar sakte ho.'}</p>
        <div class="sp-pager is-center">
          <button type="button" class="primary-button" data-sp-restart>Repeat practice <span aria-hidden="true">\u21bb</span></button>
          <button type="button" class="sp-ghost" data-sp-exit-practice>View sentences</button>
          <button type="button" class="sp-ghost" data-sp-back>Speaking Studio</button>
        </div>
      </section>`;
  }

  /* ---------- render: dialogue ---------- */
  function bubble(line, dialogue, options) {
    const mine = line.speaker === state.role;
    return `
      <div class="sp-bubble is-s${line.speaker} ${mine ? 'is-mine' : ''} ${options.current ? 'is-current' : ''}" data-sp-line="${esc(line.id)}">
        <span class="sp-speaker">${esc(dialogue.roles[line.speaker])}${mine ? ' \u00b7 Aapki line' : ''}</span>
        <p class="sp-en">${esc(line.en)}</p>
        <p class="sp-hi">${esc(line.hi)}</p>
        ${options.controls ? voiceControls(line.id, { mic: mine, toggle: false }) : ''}
      </div>`;
  }

  function renderDialogue(dialogue) {
    const done = dialogueDone(dialogue.id);
    const roleButtons = dialogue.roles.map((name, index) => `
      <button type="button" class="sp-chip" data-sp-role="${index}" aria-pressed="${state.role === index}">${esc(name)}</button>`).join('');
    const head = `
      <div class="sp-toolbar"><button type="button" class="sp-back" data-sp-back>${ICON.back}<span>Speaking Studio</span></button></div>
      <section class="sp-set-head">
        <div class="sp-set-title">
          <span class="sp-topic-icon is-large">Dg</span>
          <div>
            <h2 id="sp-title" tabindex="-1">${esc(dialogue.title)}</h2>
            <div class="sp-set-meta">${levelChip(dialogue.level)}<span>${dialogue.lines.length} lines</span>${done ? '<span class="sp-badge-done">Practiced</span>' : ''}</div>
          </div>
        </div>
        <p class="sp-tip"><b>Situation:</b> ${esc(dialogue.scene)}</p>
        <div class="sp-role"><span>Aap kiska part bolenge?</span><div class="sp-chips" role="group" aria-label="Choose your role">${roleButtons}</div></div>
        <div class="sp-modes" role="group" aria-label="Practice mode">
          <button type="button" class="sp-chip" data-sp-mode="read" aria-pressed="${state.mode === 'read'}">Read all</button>
          <button type="button" class="sp-chip" data-sp-mode="step" aria-pressed="${state.mode === 'step'}">Step-by-step</button>
        </div>
        ${supportNote()}
      </section>`;

    if (state.mode === 'step') {
      const visible = dialogue.lines.slice(0, Math.min(state.dstep + 1, dialogue.lines.length));
      const bubbles = visible.map((line, index) => bubble(line, dialogue, { current: index === state.dstep, controls: index === state.dstep })).join('');
      return `${head}
        <section class="sp-chat" aria-label="Dialogue practice">${bubbles}</section>
        <div class="sp-pager">
          <button type="button" class="sp-ghost" data-sp-dprev ${state.dstep === 0 ? 'disabled' : ''}>Previous line</button>
          ${state.dstep >= dialogue.lines.length - 1
            ? `<button type="button" class="primary-button" data-sp-dfinish>${done ? 'Finish again' : 'Finish & mark practiced'} ${ICON.check}</button>`
            : `<button type="button" class="primary-button" data-sp-dnext>Next line <span aria-hidden="true">\u2192</span></button>`}
        </div>`;
    }

    const bubbles = dialogue.lines.map(line => bubble(line, dialogue, { current: false, controls: true })).join('');
    return `${head}
      <section class="sp-chat" aria-label="Dialogue">${bubbles}</section>
      <div class="sp-pager">
        <button type="button" class="sp-ghost" data-sp-mode="step">Start step-by-step</button>
        <button type="button" class="sp-btn sp-done-btn is-wide" data-sp-dtoggle="${esc(dialogue.id)}" aria-pressed="${done}">${ICON.check}<span>Mark conversation practiced</span></button>
      </div>`;
  }

  /* ---------- render + focus ---------- */
  function render(options = {}) {
    let html;
    const set = state.setId ? getSet(state.setId) : null;
    if (!topics.length) {
      html = '<div class="sp-empty"><h3>Speaking content load nahi hua</h3><p>Page refresh karke dobara try karo. Agar problem bani rahe, to js/speaking-data.js check karo.</p></div>';
    } else if (state.screen === 'set' && set) html = renderSet(set);
    else if (state.screen === 'practice' && set) html = state.step >= set.items.length ? renderSetDone(set) : renderPractice(set);
    else if (state.screen === 'dialogue' && dialogueById.has(state.dialogueId)) html = renderDialogue(dialogueById.get(state.dialogueId));
    else { state.screen = 'hub'; state.setId = null; state.dialogueId = null; html = renderHub(); }

    root.innerHTML = html;

    if (options.scroll) {
      const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const top = Math.max(0, root.getBoundingClientRect().top + window.scrollY - 24);
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    }
    if (options.focus) {
      const target = root.querySelector(options.focus);
      if (target) target.focus({ preventScroll: true });
    }
    if (options.scrollCurrent) {
      const current = root.querySelector('.sp-bubble.is-current');
      if (current) current.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  }

  function go(next, options = {}) {
    stopAll();
    state = Object.assign({}, state, next);
    render(Object.assign({ scroll: true, focus: '#sp-title' }, options));
  }

  /* ---------- in-place updates ---------- */
  function syncSetProgress() {
    const set = state.setId ? getSet(state.setId) : null;
    if (!set) return;
    const done = set.items.filter(s => sentenceDone(s.id)).length;
    const count = root.querySelector('#sp-set-count');
    const bar = root.querySelector('#sp-set-bar');
    if (count) count.textContent = `${done}/${set.items.length} practiced`;
    if (bar) bar.style.width = `${set.items.length ? Math.round((done / set.items.length) * 100) : 0}%`;
  }

  function refreshResults() {
    const holder = root.querySelector('#sp-results');
    if (holder) holder.innerHTML = renderResults();
  }

  /* ---------- actions ---------- */
  function startPractice() {
    const set = getSet(state.setId);
    if (!set) return;
    go({ screen: 'practice', step: 0, countedPass: false });
  }

  function advance(markDone) {
    const set = getSet(state.setId);
    if (!set) return;
    const item = set.items[state.step];
    if (markDone && item) setSentence(item.id, true);
    const nextStep = state.step + 1;
    if (nextStep >= set.items.length) {
      if (!set.daily && !state.countedPass && set.items.every(s => sentenceDone(s.id))) {
        progress.rounds[set.id] = (Number(progress.rounds[set.id]) || 0) + 1;
        saveProgress();
        state.countedPass = true;
      }
      go({ step: nextStep });
      return;
    }
    go({ step: nextStep }, { scroll: false, focus: '#sp-title' });
  }

  function toggleSentence(key, button) {
    const next = !sentenceDone(key);
    setSentence(key, next);
    button.setAttribute('aria-pressed', String(next));
    const row = button.closest('[data-sp-row]');
    if (row) row.classList.toggle('is-done', next);
    syncSetProgress();
  }

  function toggleDialogue(id, button) {
    const next = !dialogueDone(id);
    if (next) progress.dialogues[id] = Date.now(); else delete progress.dialogues[id];
    saveProgress();
    button.setAttribute('aria-pressed', String(next));
    notify(next ? 'Conversation practiced mark ho gayi.' : 'Conversation practiced se hata di gayi.');
  }

  /* ---------- events ---------- */
  root.addEventListener('click', event => {
    const target = event.target.closest('button');
    if (!target || !root.contains(target)) return;
    const d = target.dataset;

    if (d.spListen !== undefined) { listenTo(d.spListen, target); return; }
    if (d.spMic !== undefined) { startRecognition(d.spMic, target); return; }
    if (d.spToggle !== undefined) { toggleSentence(d.spToggle, target); return; }
    if (d.spDtoggle !== undefined) { toggleDialogue(d.spDtoggle, target); return; }

    if (d.spLevel !== undefined) {
      state.level = d.spLevel;
      root.querySelectorAll('[data-sp-level]').forEach(chip => chip.setAttribute('aria-pressed', String(chip.dataset.spLevel === state.level)));
      refreshResults();
      return;
    }
    if (d.spOpenTopic !== undefined) { go({ screen: 'set', setId: d.spOpenTopic }); return; }
    if (d.spOpenSet !== undefined) { go({ screen: 'set', setId: d.spOpenSet }); return; }
    if (d.spOpenDialogue !== undefined) { go({ screen: 'dialogue', dialogueId: d.spOpenDialogue, mode: 'read', role: 0, dstep: 0 }); return; }
    if (d.spBack !== undefined) { go({ screen: 'hub', setId: null, dialogueId: null }); return; }
    if (d.spStart !== undefined || d.spRestart !== undefined) { startPractice(); return; }
    if (d.spExitPractice !== undefined) { go({ screen: 'set', step: 0 }); return; }
    if (d.spNext !== undefined) { advance(true); return; }
    if (d.spSkip !== undefined) { advance(false); return; }
    if (d.spPrev !== undefined) { if (state.step > 0) go({ step: state.step - 1 }, { scroll: false, focus: '#sp-title' }); return; }

    if (d.spRole !== undefined) { state.role = Number(d.spRole) === 1 ? 1 : 0; stopAll(); render({ scrollCurrent: state.mode === 'step' }); return; }
    if (d.spMode !== undefined) { state.mode = d.spMode === 'step' ? 'step' : 'read'; state.dstep = 0; stopAll(); render({ scroll: true, focus: '#sp-title' }); return; }
    if (d.spDnext !== undefined) {
      const dialogue = dialogueById.get(state.dialogueId);
      if (dialogue && state.dstep < dialogue.lines.length - 1) { stopAll(); state.dstep += 1; render({ scrollCurrent: true }); }
      return;
    }
    if (d.spDprev !== undefined) { if (state.dstep > 0) { stopAll(); state.dstep -= 1; render({ scrollCurrent: true }); } return; }
    if (d.spDfinish !== undefined) {
      progress.dialogues[state.dialogueId] = Date.now();
      saveProgress();
      notify('Conversation practiced mark ho gayi. Shabash!');
      go({ screen: 'hub', setId: null, dialogueId: null });
    }
  });

  root.addEventListener('input', event => {
    if (event.target && event.target.id === 'sp-search') {
      state.query = event.target.value;
      refreshResults();
    }
  });

  document.addEventListener('visibilitychange', () => { if (document.hidden) stopAll(); });
  window.addEventListener('pagehide', stopAll);

  // Speak tab / Home card always opens the hub; progress rows can jump straight into a topic.
  document.addEventListener('click', event => {
    const jump = event.target.closest && event.target.closest('[data-sp-jump]');
    if (jump) {
      const [kind, id] = String(jump.dataset.spJump).split(':');
      setTimeout(() => {
        if (kind === 'topic' && topicById.has(id)) go({ screen: 'set', setId: id });
        else if (kind === 'dialogue' && dialogueById.has(id)) go({ screen: 'dialogue', dialogueId: id, mode: 'read', role: 0, dstep: 0 });
        else go({ screen: 'hub', setId: null, dialogueId: null });
      }, 0);
      return;
    }
    const nav = event.target.closest && event.target.closest('[data-view="speak"]');
    if (nav && !root.contains(nav)) go({ screen: 'hub', setId: null, dialogueId: null }, { scroll: false, focus: null });
  });

  /* ---------- My Progress integration ---------- */
  function renderProgress() {
    const holder = document.getElementById('speaking-progress');
    if (!holder) return;
    const st = overallStats();
    const started = topics.filter(t => topicStats(t).done > 0);
    const rows = started.map(topic => {
      const ts = topicStats(topic);
      const percent = Math.round((ts.done / ts.total) * 100);
      return `
        <div class="sp-prog-row">
          <div class="sp-prog-info">
            <strong>${esc(topic.title)}</strong>
            <span>${ts.done}/${ts.total} sentences${ts.rounds ? ` \u00b7 ${ts.rounds} round${ts.rounds > 1 ? 's' : ''}` : ''}</span>
            <span class="sp-bar" aria-hidden="true"><i style="width:${percent}%"></i></span>
          </div>
          <button type="button" class="sp-btn" data-view="speak" data-sp-jump="topic:${esc(topic.id)}"><span>${ts.complete ? 'Repeat' : 'Continue'}</span></button>
        </div>`;
    }).join('');
    const doneDialogues = dialogues.filter(d => dialogueDone(d.id));

    holder.innerHTML = `
      <section class="panel sp-progress-panel" aria-label="Speaking progress">
        <div class="panel-heading">
          <div><div class="eyebrow">SPEAKING STUDIO</div><h2>Speaking progress</h2></div>
          <span class="tiny-badge">${st.percent}% COMPLETE</span>
        </div>
        <span class="sp-bar is-wide" aria-hidden="true"><i style="width:${st.percent}%"></i></span>
        <div class="sp-prog-stats">
          <div><strong>${st.sentencesDone}<small>/${st.sentencesTotal}</small></strong><span>Sentences practiced</span></div>
          <div><strong>${st.topicsDone}<small>/${st.topicsTotal}</small></strong><span>Topics completed</span></div>
          <div><strong>${st.dialoguesDone}<small>/${st.dialoguesTotal}</small></strong><span>Conversations</span></div>
        </div>
        ${rows || '<p class="sp-muted">Abhi koi speaking practice shuru nahi hui. Speaking Studio kholo aur pehla topic try karo.</p>'}
        ${doneDialogues.length ? `<p class="sp-muted">Practiced conversations: ${esc(doneDialogues.map(d => d.title).join(', '))}</p>` : ''}
        <button type="button" class="text-link" data-view="speak" data-sp-jump="hub">Open Speaking Studio \u2192</button>
      </section>`;
  }

  /* ---------- public API (used by app.js) ---------- */
  window.VocabSpeaking = {
    stop: stopAll,
    stats: overallStats,
    renderProgress,
    compare: compareSpeech // exposed for testing the matching logic
  };

  render();
  renderProgress();
})();
