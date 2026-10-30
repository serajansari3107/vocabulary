# Vocabulary

Premium dark English-learning web app starter built with HTML, CSS and vanilla JavaScript.

## Run locally
- Open `index.html` in a browser, or
- In VS Code terminal, run `py -m http.server 8000` from this folder and visit `http://localhost:8000`.

## Current starter features
- Responsive premium dark + purple UI.
- Home, Learn, Word Explorer and My Progress navigation, plus a fixed bottom navigation on mobile (Home, Learn, Speak, Progress, Profile).
- Word Explorer with sample meanings, Hinglish explanations, examples and translations.
- Browser speech synthesis pronunciation (where supported).
- Save/unsave sample words using local browser storage.
- Grammar Academy: 15 offline topics (incl. all 12 tenses) with easy Hinglish lessons, examples, common mistakes, 5-question quizzes and progress saved in local browser storage.
- Speaking Studio: 15 topics across Beginner / Intermediate / Advanced (120 sentences with Roman Hinglish meanings), Daily Speaking (5 new sentences a day), 7 role-based conversation dialogues, search and level filters. Content is stored locally in `js/speaking-data.js`, so it works offline.
- Speak & Repeat uses only the browser: Listen uses speech synthesis, the Speak button appears only where the browser supports speech recognition and shows a word-by-word match of what the browser recognised (it is not a pronunciation score). No API key or external service is added by this app.
- Speaking progress (practiced sentences, completed topics and rounds, practiced conversations) is saved in the browser under `vocabulary.speakingStudio.v1` and also appears in My Progress and Profile.

## Install as an app (PWA)
- Host the folder on any https site (e.g. GitHub Pages), open it on your phone, then:
  - Android (Chrome): menu ⋮ > Install app (or Add to Home screen).
  - iPhone (Safari): Share > Add to Home Screen.
- Grammar Academy, Speaking Studio content and the built-in words work offline. Online dictionary lookups need internet.
- Updates: after you push new files, the app picks them up the next time it is opened with internet.

## Current limitations
The built-in dictionary is a small sample only. Any word not included shows a clear unavailable message; it does not fabricate a definition. A reliable broad dictionary source/API will be added in a later step. Saved words stay in this browser/device only.

Speaking Studio voice features depend on the browser: Listen needs speech synthesis and an English voice on the device; the Speak button needs speech recognition (Chrome/Edge are the most reliable), microphone permission, https or localhost, and in Chrome an internet connection because the browser's own service does the recognition. Where a feature is missing the app says so and everything else keeps working. Speaking progress stays in this browser/device only.

## Offline dictionary and offline-first app

- Word Explorer searches a local dictionary (`data/dict/`, built from `tools/dictionary-src/`): Hindi meaning (Devanagari), synonyms, an English example and its Hindi translation. It handles upper/lower case, extra punctuation, common word forms (running -> run, went -> go) and spelling mistakes ("Did you mean...").
- The dictionary is downloaded once (about 150 KB) and stored in IndexedDB. A progress bar shows the setup. "Offline dictionary ready" appears only after every part is downloaded, checked and stored; if anything fails the app says "setup incomplete" and can retry (finished parts are not downloaded again).
- The app files are saved by the service worker (`sw.js`) the first time you open the app with internet. After that the app opens and works without internet. If a file cannot be saved, the install fails instead of pretending.
- Your saved words and progress live in browser storage on your device. App and dictionary updates never delete them. Profile > Offline status shows what is really available offline.
- Content in the dictionary was written for this project; no third-party dictionary data is included. To add words, edit/add rows in `tools/dictionary-src/*.json` (format: `[word, pos, hindi, [synonyms], english example, hindi example]`).

### Before every commit

```
python3 tools/build-dictionary.py   # only if you changed dictionary rows; validates every row
python3 tools/stamp-sw.py           # always: gives sw.js a new BUILD when any app file changed
```

If you forget `stamp-sw.py`, installed apps keep serving their old saved files.

### Still needs internet
First-time setup, app updates, Word Explorer lookups for words that are not in the offline dictionary (optional online fallback, English definition only), and in many browsers the Speak (microphone recognition) button. Listen uses voices installed on the device.
