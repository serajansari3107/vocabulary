
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const views = $$('.view');
  const navItems = $$('.nav-item');
  const bottomItems = $$('.bn-item');
  // Which bottom-nav tab owns each screen (Word Explorer and Grammar Academy live under Learn).
  const bottomTabFor = { home: 'home', learn: 'learn', explorer: 'learn', grammar: 'learn', speak: 'speak', progress: 'progress', profile: 'profile' };
  const toast = $('#toast');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function openView(name) {
    const target = $(`#view-${name}`);
    if (!target) return;

    views.forEach(view => view.classList.toggle('active', view === target));
    navItems.forEach(item => item.classList.toggle('active', item.dataset.view === name));
    bottomItems.forEach(item => {
      const on = item.dataset.view === bottomTabFor[name];
      item.classList.toggle('active', on);
      if (on) item.setAttribute('aria-current', 'page'); else item.removeAttribute('aria-current');
    });

    try {
      localStorage.setItem('vocabulary_last_view', name);
    } catch (e) {}

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (name === 'explorer') {
      setTimeout(() => $('#word-input')?.focus({ preventScroll: true }), 180);
    }

    if (name === 'progress') renderSavedWords();
    if (name === 'profile') updateProfile();
  }

  function updateProfile() {
    const saved = $('#profile-saved-count');
    if (saved) {
      const total = getSavedWords().length;
      saved.textContent = `${total} WORD${total === 1 ? '' : 'S'}`;
    }
    const grammar = $('#profile-grammar-progress');
    const homeLabel = $('#ga-home-progress'); // kept up to date by Grammar Academy
    if (grammar && homeLabel) grammar.textContent = homeLabel.textContent;
  }

  document.addEventListener('click', event => {
    const navigation = event.target.closest('[data-view]');
    if (navigation) {
      event.preventDefault();
      openView(navigation.dataset.view);
    }

    const removeSaved = event.target.closest('[data-remove-saved]');
    if (removeSaved) {
      const word = removeSaved.dataset.removeSaved;
      setSavedWords(getSavedWords().filter(item => item !== word));
      renderSavedWords();
      showToast('Word removed from your saved list.');
      return;
    }

    const searchSaved = event.target.closest('[data-search-saved]');
    if (searchSaved) {
      const word = searchSaved.dataset.searchSaved;
      $('#word-input').value = word;
      openView('explorer');
      searchWord(word);
      return;
    }

    const suggestion = event.target.closest('[data-word]');
    if (suggestion) {
      $('#word-input').value = suggestion.dataset.word;
      searchWord(suggestion.dataset.word);
    }
  });

  $('#search-shortcut')?.addEventListener('click', () => openView('explorer'));

  const dictionary = {
    ambitious: {
      phonetic: '/æmˈbɪʃəs/',
      parts: [
        {
          part: 'Adjective',
          meaning: 'Bade goals achieve karne ki strong ichchha rakhna; kuch bada karne ka jazba.',
          definition: 'Having a strong desire to succeed or achieve something important.',
          example: 'She is ambitious and wants to become a doctor.',
          translation: 'Woh ambitious hai aur doctor banna chahti hai.'
        },
        {
          part: 'Adjective',
          meaning: 'Aisa plan ya kaam jise karna mushkil ho aur jisme kaafi mehnat lage.',
          definition: 'Difficult to achieve, often requiring effort or skill.',
          example: 'Building a school in one month is an ambitious plan.',
          translation: 'Ek mahine mein school banana ek bada aur mushkil plan hai.'
        }
      ]
    },
    resilient: {
      phonetic: '/rɪˈzɪliənt/',
      parts: [{
        part: 'Adjective',
        meaning: 'Mushkil ya setback ke baad sambhal kar dobara koshish karne wala.',
        definition: 'Able to recover quickly after difficulties or change.',
        example: 'She stayed resilient through every challenge.',
        translation: 'Woh har mushkil ke bawajood himmat se khadi rahi.'
      }]
    },
    curious: {
      phonetic: '/ˈkjʊəriəs/',
      parts: [
        {
          part: 'Adjective',
          meaning: 'Kuch jaanne, seekhne ya samajhne ki bahut ichchha rakhna; jigyaasu.',
          definition: 'Eager to know or learn something.',
          example: 'Curious students ask thoughtful questions.',
          translation: 'Jigyaasu students soch-samajh kar sawal poochte hain.'
        },
        {
          part: 'Adjective',
          meaning: 'Ajeeb ya unusual lagne wala.',
          definition: 'Strange or unusual, sometimes in an interesting way.',
          example: 'There was a curious noise outside.',
          translation: 'Bahar ek ajeeb si awaaz thi.'
        }
      ]
    },
    serendipity: {
      phonetic: '/ˌserənˈdɪpəti/',
      parts: [{
        part: 'Noun',
        meaning: 'Jab bina plan kiye achanak koi achchi ya useful cheez mil jaaye.',
        definition: 'The chance occurrence of a happy or useful discovery.',
        example: 'Finding that little café was pure serendipity.',
        translation: 'Us chhote café ka mil jaana ek achanak hui khushgawar discovery thi.'
      }]
    },
    eloquent: {
      phonetic: '/ˈeləkwənt/',
      parts: [{
        part: 'Adjective',
        meaning: 'Apni baat ko saaf, asardaar aur khoobsurati se kehne wala.',
        definition: 'Fluent or persuasive in speaking or writing.',
        example: 'He gave an eloquent speech.',
        translation: 'Usne bahut asardaar aur behtareen speech di.'
      }]
    },
    pragmatic: {
      phonetic: '/præɡˈmætɪk/',
      parts: [{
        part: 'Adjective',
        meaning: 'Practical soch rakhna aur theory se zyada workable solution par focus karna.',
        definition: 'Dealing with problems in a practical and realistic way.',
        example: 'We need a pragmatic solution to this problem.',
        translation: 'Humein is problem ka practical aur realistic solution chahiye.'
      }]
    },
    ubiquitous: {
      phonetic: '/juːˈbɪkwɪtəs/',
      parts: [{
        part: 'Adjective',
        meaning: 'Jo lagbhag har jagah maujood ho; har taraf dikhne wala.',
        definition: 'Present, appearing, or found everywhere.',
        example: 'Smartphones have become ubiquitous.',
        translation: 'Smartphones ab lagbhag har jagah dikhte hain.'
      }]
    },
    benevolent: {
      phonetic: '/bəˈnevələnt/',
      parts: [{
        part: 'Adjective',
        meaning: 'Doosron ki bhalai chahne wala aur madad karne ko taiyaar.',
        definition: 'Well-meaning and kindly.',
        example: 'A benevolent neighbour helped the family.',
        translation: 'Ek nek-dil padosi ne family ki madad ki.'
      }]
    },
    articulate: {
      phonetic: '/ɑːrˈtɪkjələt/',
      parts: [
        {
          part: 'Adjective',
          meaning: 'Apne thoughts ko clearly aur effectively express karne wala.',
          definition: 'Able to express ideas clearly and effectively.',
          example: 'She is articulate and confident in meetings.',
          translation: 'Woh meetings mein apni baat saaf aur confidence se rakhti hai.'
        },
        {
          part: 'Verb',
          meaning: 'Kisi thought ya idea ko saaf shabdon mein bayan karna.',
          definition: 'To express an idea or feeling clearly in words.',
          example: 'It is hard to articulate how grateful I feel.',
          translation: 'Main kitna shukraguzaar hoon, ise shabdon mein batana mushkil hai.'
        }
      ]
    },
    diligent: {
      phonetic: '/ˈdɪlɪdʒənt/',
      parts: [{
        part: 'Adjective',
        meaning: 'Mehnati, lagan se aur dhyaan dekar kaam karne wala.',
        definition: 'Showing care and steady effort in your work.',
        example: 'She is a diligent student who revises every day.',
        translation: 'Woh ek mehnati student hai jo roz revision karti hai.'
      }]
    }
  };

  const savedKey = 'vocabulary.savedWords';

  function getSavedWords() {
    try {
      const words = JSON.parse(localStorage.getItem(savedKey) || '[]');
      return Array.isArray(words) ? words : [];
    } catch {
      return [];
    }
  }

  function setSavedWords(words) {
    try {
      localStorage.setItem(savedKey, JSON.stringify(words));
    } catch {
      showToast('Saving is unavailable in this browser mode.');
    }
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>'"]/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    })[char]);
  }

  function renderSavedWords() {
    const container = $('#saved-words-list');
    const count = $('#saved-word-count');
    if (!container || !count) return;

    const words = getSavedWords();
    count.textContent = `${words.length} WORD${words.length === 1 ? '' : 'S'}`;

    if (!words.length) {
      container.innerHTML = `
        <div class="empty-icon">Aa</div>
        <h3>No saved words yet</h3>
        <p>Explore a word and tap Save Word to build your personal collection.</p>
        <button class="primary-button" data-view="explorer">Explore words <span>→</span></button>`;
      return;
    }

    container.innerHTML = words.map(word => `
      <div class="meaning-item saved-word-item">
        <strong>${escapeHTML(word.charAt(0).toUpperCase() + word.slice(1))}</strong>
        <button class="small-action" data-remove-saved="${escapeHTML(word)}">♥ Remove</button>
        <button class="small-action" data-search-saved="${escapeHTML(word)}">View →</button>
      </div>`).join('');
  }

  function renderWord(word, data, fromDictionary) {
    const result = $('#word-result');
    if (!result) return;

    const saved = getSavedWords().includes(word.toLowerCase());

    const parts = data.parts.map((item, index) => `
      <article class="meaning-item">
        <p><span class="sense-number">MEANING ${index + 1}</span>${escapeHTML(item.meaning)}</p>
        ${item.meaning === item.definition ? '' : `<p class="english-definition">${escapeHTML(item.definition)}</p>`}
        <div class="example-sentence">“${escapeHTML(item.example)}”</div>
        <p class="example-translation">${escapeHTML(item.translation)}</p>
      </article>`).join('');

    result.innerHTML = `
      <article class="word-result-card">
        <div class="result-top">
          <div>
            <h2>${escapeHTML(word.charAt(0).toUpperCase() + word.slice(1))}</h2>
            <div class="result-pronunciation">${escapeHTML(data.phonetic || 'Pronunciation not available')}</div>
          </div>
          <div class="result-actions">
            <button class="small-action" id="result-speak" aria-label="Hear word pronunciation" title="Hear pronunciation">♫</button>
            <button class="small-action ${saved ? 'saved' : ''}" id="save-word" aria-label="${saved ? 'Remove saved word' : 'Save word'}" title="${saved ? 'Saved' : 'Save word'}">${saved ? '♥' : '♡'}</button>
          </div>
        </div>
        ${parts}
        <p class="result-note">${fromDictionary
          ? 'Meanings and examples from your built-in dictionary.'
          : 'Meaning retrieved from the online dictionary. Hindi translations are machine-generated and may not be perfect.'}</p>
      </article>`;

    $('#result-speak')?.addEventListener('click', () => speakWord(word));

    $('#save-word')?.addEventListener('click', () => {
      let words = getSavedWords();
      const key = word.toLowerCase();

      if (words.includes(key)) {
        words = words.filter(item => item !== key);
        showToast('Word removed from your saved list.');
      } else {
        words.push(key);
        showToast('Word saved on this device.');
      }

      setSavedWords(words);
      renderSavedWords();
      renderWord(word, data, fromDictionary);
    });
  }

  /* ------------------------------------------------------------------
     Hinglish meanings for external words (offline, rule-based engine)

     Why not a translation API? Free services (MyMemory etc.) translate
     fragments without context: "(of the weather) Pleasant; clear." became
     "Aanand" (joy). No free API gives reliable, contextual Hinglish for
     arbitrary dictionary definitions.

     So every definition is read as a whole - context label, glosses and
     sentences - and is converted ONLY when every part of it is understood
     by the tables below. If anything is unknown, hinglishMeaning() returns
     null and the app shows the original English definition instead.
     Nothing is guessed, so a wrong Hinglish meaning is never displayed.

     To teach the engine more, add entries to the tables (plain data).
     ------------------------------------------------------------------ */

  // "(of the weather) ..." -> subject word used in the Hinglish sentence.
  const HG_SUBJECTS = {
    'of the weather': 'mausam', 'of weather': 'mausam', 'of a person': 'insaan',
    'of food': 'khaana', 'of water': 'paani'
  };
  const HG_SUBJECT_FORMAT = {
    mausam: list => `Mausam ${list} hona`,
    khaana: list => `Khaana ${list} hona`,
    paani: list => `Paani ${list} hona`,
    insaan: list => `${list} insaan`
  };

  // "(informal) ..." labels that can be carried over safely.
  const HG_REGISTERS = {
    informal: 'Bolchaal mein', colloquial: 'Bolchaal mein', slang: 'Bolchaal mein',
    archaic: 'Purane zamaane mein', dated: 'Purane zamaane mein',
    literary: 'Saahitya mein', poetic: 'Saahitya mein'
  };

  // Single-sense adjectives (dominant meaning only; ambiguous words such as light/sharp/clear are left out).
  const HG_ADJECTIVES = {
    'beautiful': 'sundar', 'pretty': 'sundar', 'handsome': 'khoobsurat', 'attractive': 'aakarshak', 'ugly': 'badsoorat',
    'good': 'achha', 'excellent': 'bahut badhiya', 'wonderful': 'shaandaar', 'superb': 'shaandaar',
    'bad': 'bura', 'terrible': 'bahut kharab', 'awful': 'bahut kharab',
    'big': 'bada', 'large': 'bada', 'huge': 'bahut bada', 'enormous': 'bahut bada', 'small': 'chhota', 'tiny': 'bahut chhota',
    'happy': 'khush', 'sad': 'udaas', 'angry': 'naaraaz', 'afraid': 'dara hua', 'scared': 'dara hua', 'shy': 'sharmila', 'calm': 'shaant',
    'brave': 'bahaadur', 'kind': 'dayalu', 'generous': 'udaar', 'clever': 'hoshiyaar', 'intelligent': 'samajhdaar', 'wise': 'samajhdaar',
    'lazy': 'aalsi', 'honest': 'imaandaar', 'polite': 'tameezdaar', 'rude': 'badtameez', 'rich': 'ameer', 'famous': 'mashhoor',
    'strong': 'taaqatwar', 'weak': 'kamzor',
    'tired': 'thaka hua', 'weary': 'thaka hua', 'fatigued': 'thaka hua', 'exhausted': 'bahut thaka hua', 'bored': 'ubaa hua',
    'hungry': 'bhookha', 'thirsty': 'pyaasa',
    'hackneyed': 'ghisa-pita', 'overused': 'bahut zyada istemaal kiya hua', 'delicate': 'nazuk',
    'abundant': 'bahut zyada', 'plentiful': 'bahut zyada', 'more than adequate': 'zaroorat se zyada', 'more than enough': 'zaroorat se zyada',
    'dangerous': 'khatarnaak', 'safe': 'surakshit', 'dirty': 'ganda', 'new': 'naya', 'ancient': 'bahut purana',
    'easy': 'aasaan', 'difficult': 'mushkil', 'correct': 'sahi', 'wrong': 'galat', 'fake': 'nakli', 'expensive': 'mehnga',
    'fast': 'tez', 'quick': 'tez', 'slow': 'dheema', 'hot': 'garam', 'cold': 'thanda',
    'sweet': 'meetha', 'sour': 'khatta', 'bitter': 'kadwa', 'tasty': 'swaadisht', 'delicious': 'bahut swaadisht'
  };

  // Adjectives that describe people (used for "Someone who is ..." and "(of a person) ...").
  const HG_PERSON_ADJECTIVES = new Set([
    'beautiful', 'pretty', 'handsome', 'ugly', 'good', 'bad', 'happy', 'sad', 'angry', 'afraid', 'scared', 'shy', 'calm',
    'brave', 'kind', 'generous', 'clever', 'intelligent', 'wise', 'lazy', 'honest', 'polite', 'rude', 'rich', 'famous',
    'strong', 'weak', 'tired', 'weary', 'fatigued', 'exhausted', 'bored', 'hungry', 'thirsty'
  ]);

  // Adjectives that only make sense for one subject.
  const HG_CONTEXT_ADJECTIVES = {
    mausam: {
      'pleasant': 'suhana', 'clear': 'saaf', 'sunny': 'dhoop wala', 'rainy': 'baarish wala', 'cloudy': 'badlon wala',
      'windy': 'hawa wala', 'foggy': 'kohre wala', 'stormy': 'toofaani', 'humid': 'umas bhara', 'dry': 'sookha',
      'wet': 'geela', 'hot': 'garam', 'cold': 'thanda', 'cool': 'thanda', 'warm': 'halka garam', 'calm': 'shaant'
    },
    khaana: {
      'tasty': 'swaadisht', 'delicious': 'bahut swaadisht', 'sweet': 'meetha', 'sour': 'khatta', 'bitter': 'kadwa',
      'spicy': 'teekha', 'bland': 'feeka', 'fresh': 'taaza', 'stale': 'baasi', 'hot': 'garam', 'cold': 'thanda'
    },
    paani: {
      'clear': 'saaf', 'clean': 'saaf', 'dirty': 'ganda', 'cold': 'thanda', 'hot': 'garam', 'deep': 'gehra', 'fresh': 'taaza'
    }
  };

  // Nouns for "Possessing/Having ..." and "Having a need for ..." (only nouns that need no gender/oblique change).
  const HG_NOUNS = {
    'charm': 'charm', 'rest': 'aaraam', 'sleep': 'neend', 'qualities': 'khoobiyan', 'quality': 'khoobi',
    'courage': 'himmat', 'strength': 'taaqat', 'patience': 'sabr', 'skill': 'hunar', 'knowledge': 'gyaan',
    'experience': 'tajurba', 'time': 'waqt', 'water': 'paani', 'love': 'pyaar', 'hope': 'ummeed', 'fear': 'dar',
    'help': 'madad', 'trust': 'bharosa', 'attention': 'dhyaan', 'wealth': 'daulat', 'beauty': 'sundarta',
    'kindness': 'meharbaani', 'intelligence': 'samajh'
  };

  // Verbs (oblique infinitive, used before "ko taiyaar") and adverbs for "Willing to ...".
  const HG_VERBS = {
    'give': 'dene', 'share': 'baantne', 'help': 'madad karne', 'forgive': 'maaf karne', 'spend': 'kharch karne',
    'work': 'kaam karne', 'listen': 'sunne', 'learn': 'seekhne', 'wait': 'intezaar karne', 'try': 'koshish karne'
  };
  const HG_ADVERBS = {
    'unsparingly': 'khule dil se', 'freely': 'khule dil se', 'gladly': 'khushi se', 'happily': 'khushi se',
    'eagerly': 'josh se', 'quickly': 'jaldi se', 'carefully': 'dhyaan se', 'honestly': 'imaandaari se', 'bravely': 'himmat se'
  };

  // "Well made / Well executed ..." -> passive form.
  const HG_PARTICIPLES = {
    'executed': 'kiya gaya', 'done': 'kiya gaya', 'performed': 'kiya gaya',
    'made': 'banaya gaya', 'built': 'banaya gaya', 'written': 'likha gaya'
  };

  // Whole sentences that are always translated the same way.
  const HG_PHRASES = {
    'can be used as a term of address': 'kisi ko pyaar se bulane ke liye bhi kaha jaata hai',
    'can be used as a term of endearment': 'kisi ko pyaar se bulane ke liye bhi kaha jaata hai'
  };

  const hgNorm = text => String(text || '')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/^[\s.]+|[\s.;:,]+$/g, '')
    .trim();

  const hgCapitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

  function hgJoin(items, conj) {
    const unique = items.filter((item, index) => items.indexOf(item) === index);
    if (unique.length <= 1) return unique[0] || '';
    return `${unique.slice(0, -1).join(', ')} ${conj} ${unique[unique.length - 1]}`;
  }

  // "rest or sleep" -> { items: ['rest', 'sleep'], conj: 'ya' }
  function hgSplitList(text) {
    const pieces = text.split(/\s*,\s*|\s+(and|or)\s+/);
    const items = [];
    const conjs = new Set();

    pieces.forEach((piece, index) => {
      if (index % 2 === 1) {
        if (piece) conjs.add(piece);
        return;
      }
      let item = String(piece || '').trim();
      const lead = item.match(/^(and|or)\s+(.*)$/);
      if (lead) {
        conjs.add(lead[1]);
        item = lead[2];
      }
      items.push(item);
    });

    if (!items.length || items.some(item => !item) || conjs.size > 1) return null;
    return { items, conj: conjs.has('or') ? 'ya' : 'aur' };
  }

  // One adjective gloss, understood only inside the subject it belongs to.
  function hgAdjective(gloss, subject) {
    const key = hgNorm(gloss);
    const lookup = word => {
      if (subject === 'insaan') return HG_PERSON_ADJECTIVES.has(word) ? HG_ADJECTIVES[word] : null;
      if (subject) return (HG_CONTEXT_ADJECTIVES[subject] || {})[word] || null;
      return HG_ADJECTIVES[word] || null;
    };

    const direct = lookup(key);
    if (direct) return direct;

    const intensified = key.match(/^(?:very|extremely)\s+(.+)$/);
    const base = intensified && lookup(intensified[1]);
    return base ? `bahut ${base}` : null;
  }

  // "attractive qualities" -> "aakarshak khoobiyan" (invariant adjectives only, so no gender mistakes).
  function hgNounPhrase(text) {
    const words = hgNorm(text).replace(/^(?:a|an|the)\s+/, '').split(' ');
    const noun = HG_NOUNS[words[words.length - 1]];
    const modifiers = words.slice(0, -1).map(word => HG_ADJECTIVES[word]);

    if (!noun || modifiers.some(word => !word || /\s/.test(word) || /a$/.test(word))) return null;
    return [...modifiers, noun].join(' ');
  }

  function hgNounList(text) {
    const list = hgSplitList(text);
    if (!list) return null;
    const nouns = list.items.map(hgNounPhrase);
    return nouns.some(noun => !noun) ? null : hgJoin(nouns, list.conj);
  }

  function hgVerbPhrase(text) {
    const words = hgNorm(text).split(' ');
    let adverb = '';
    if (HG_ADVERBS[words[words.length - 1]]) adverb = HG_ADVERBS[words.pop()];
    else if (HG_ADVERBS[words[0]]) adverb = HG_ADVERBS[words.shift()];

    const list = hgSplitList(words.join(' '));
    if (!list) return null;
    const verbs = list.items.map(verb => HG_VERBS[verb]);
    if (verbs.some(verb => !verb)) return null;
    return `${adverb ? `${adverb} ` : ''}${hgJoin(verbs, list.conj)}`;
  }

  // "Pleasant; clear" (a list of adjective glosses).
  function hgGlossList(text, part, subject) {
    if (part !== 'adjective') return null;
    const glosses = text.split(/\s*[;,]\s*/).map(hgNorm);
    if (glosses.some(gloss => !gloss)) return null;

    const converted = glosses.map(gloss => hgAdjective(gloss, subject));
    if (converted.some(item => !item)) return null;

    const list = hgJoin(converted, 'aur');
    return subject ? HG_SUBJECT_FORMAT[subject](list) : list;
  }

  // Translates one sentence of a definition, or returns null when any part is unknown.
  function hgSentence(sentence, part, subject) {
    const text = hgNorm(sentence);
    if (!text) return null;

    // A context label such as "(of the weather)" must be used by the sentence, never dropped.
    if (subject) return hgGlossList(text, part, subject);

    if (HG_PHRASES[text]) return HG_PHRASES[text];

    let match = text.match(/^(?:someone|somebody|a person|one) who is (.+)$/);
    if (match) {
      const list = hgSplitList(match[1]);
      if (!list) return null;
      const adjectives = list.items.map(item => hgAdjective(item, 'insaan'));
      return adjectives.some(item => !item) ? null : `${hgJoin(adjectives, list.conj)} insaan`;
    }

    match = text.match(/^having a need for (.+)$/);
    if (match) {
      const nouns = hgNounList(match[1]);
      return nouns ? `${nouns} ki zaroorat hona` : null;
    }

    match = text.match(/^(?:possessing|having) (.+)$/);
    if (match) {
      const nouns = hgNounList(match[1]);
      return nouns ? `jisme ${nouns} ho` : null;
    }

    match = text.match(/^willing to (.+)$/);
    if (match) {
      const verbs = hgVerbPhrase(match[1]);
      return verbs ? `${verbs} ko taiyaar` : null;
    }

    match = text.match(/^(?:very )?well (\w+)$/);
    if (match && HG_PARTICIPLES[match[1]]) {
      return `bahut achhe tareeke se ${HG_PARTICIPLES[match[1]]}`;
    }

    return hgGlossList(text, part, '');
  }

  // Main entry. Returns simple Roman Hinglish, or null when the definition is not fully understood.
  function hinglishMeaning(definition, partOfSpeech) {
    try {
      let text = String(definition || '').replace(/\s+/g, ' ').trim();
      if (!text || /\d|e\.g\.|i\.e\.|\betc\b|\bvs\b|[:"\u201C\u201D]/i.test(text)) return null;

      let subject = '';
      let register = '';
      let labels;
      while ((labels = text.match(/^\(([^)]*)\)\s*(.*)$/))) {
        for (const raw of labels[1].split(',')) {
          const label = hgNorm(raw);
          if (HG_SUBJECTS[label] && !subject) subject = HG_SUBJECTS[label];
          else if (HG_REGISTERS[label] && !register) register = HG_REGISTERS[label];
          else return null;                                   // unknown label: context would be lost
        }
        text = labels[2];
      }
      if (/[()]/.test(text)) return null;

      const sentences = text.split(/\.\s+/).map(item => item.replace(/\.+$/, '').trim()).filter(Boolean);
      if (!sentences.length || (subject && sentences.length > 1)) return null;

      const part = hgNorm(partOfSpeech);
      const converted = [];
      for (const sentence of sentences) {
        const result = hgSentence(sentence, part, subject);
        if (!result) return null;
        converted.push(result);
      }

      let meaning = converted
        .map((item, index) => (index ? item.charAt(0).toLowerCase() + item.slice(1) : item))
        .join('; ');
      if (register) meaning = `${register}: ${meaning.charAt(0).toLowerCase()}${meaning.slice(1)}`;
      return `${hgCapitalize(meaning)}.`;
    } catch {
      return null;
    }
  }

  async function searchWord(rawWord) {
    const word = rawWord.trim().replace(/\s+/g, ' ');
    if (!word) return;

    if (!/^[a-zA-Z][a-zA-Z'-]{0,59}$/.test(word)) {
      showToast('Please enter one English word.');
      return;
    }

    const normalized = word.toLowerCase();
    const result = $('#word-result');
    if (!result) return;

    // Existing sample words keep their original Hinglish meanings.
    const localData = dictionary[normalized];

    if (localData) {
      renderWord(normalized, localData, true);
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    result.innerHTML = `
      <article class="word-result-card">
        <h3>Searching dictionary...</h3>
        <p>Meaning aur Hindi translation dhoondh rahe hain...</p>
      </article>`;

    result.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalized)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          result.innerHTML = `
            <article class="word-result-card">
              <h3>Word not found</h3>
              <p>Spelling check karo ya koi doosra English word try karo.</p>
            </article>`;
          return;
        }

        throw new Error('Dictionary request failed');
      }

      const entries = await response.json();
      const entry = entries[0];

      if (!entry) throw new Error('No dictionary entry');

      const phonetic =
        entry.phonetic ||
        entry.phonetics?.find(item => item.text)?.text ||
        '';

      const rawParts = (entry.meanings || [])
        .flatMap(meaning =>
          (meaning.definitions || []).map(definition => ({
            part: meaning.partOfSpeech || 'Meaning',
            definition: definition.definition || '',
            example: definition.example || ''
          }))
        )
        .slice(0, 4);

      if (!rawParts.length) throw new Error('No definitions available');

      // Hinglish meaning comes from the offline engine. If a definition is not fully
      // understood, the original English definition is shown instead of a guess.
      const parts = rawParts.map(item => {
        const definition = item.definition || 'Definition unavailable.';
        return {
          part: item.part,
          meaning: hinglishMeaning(item.definition, item.part) || definition,
          definition,
          example: item.example || 'Example sentence unavailable.',
          translation: item.example
            ? 'Example in English.'
            : 'Example unavailable.'
        };
      });

      renderWord(normalized, { phonetic, parts }, false);
    } catch (error) {
      console.error('Word search failed:', error);

      result.innerHTML = `
        <article class="word-result-card">
          <h3>Dictionary unavailable</h3>
          <p>Internet connection check karo aur dobara search karo.</p>
          <p>Hindi translation service bhi temporarily unavailable ho sakti hai.</p>
        </article>`;
    }
  }

  $('#word-search-form')?.addEventListener('submit', event => {
    event.preventDefault();
    searchWord($('#word-input')?.value || '');
  });

  function speakWord(word) {
    if (!('speechSynthesis' in window)) {
      showToast('Pronunciation audio is not supported by this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  }

  $('#speak-word')?.addEventListener('click', () => speakWord('resilient'));

  // Restore the last screen while handling restricted browser storage.
  try {
    openView(localStorage.getItem('vocabulary_last_view') || 'home');
  } catch (e) {
    openView('home');
  }
})();
