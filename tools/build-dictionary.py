#!/usr/bin/env python3
"""Build the offline dictionary packs used by the Vocabulary PWA.

Usage (from the project root):   python3 tools/build-dictionary.py

Input : tools/dictionary-src/*.json   rows of [word, pos, hindi, [synonyms], english example, hindi example]
Output: data/dict/pack-NNN.<hash>.json  + data/dict/manifest.json  (+ README.txt)

Every row is validated. The build FAILS (and writes nothing) if any row is invalid, so
bad data can never reach the app. Nothing here downloads or scrapes data: all rows come
from the source files, which were written for this project.

To grow the dictionary later: add more rows (or new src files) in the same format and
re-run this script. Raise the version automatically (it is a hash of the content), commit
data/dict/, and users get the new packs on their next online visit.
"""
import glob
import hashlib
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'tools', 'dictionary-src')
OUT = os.path.join(ROOT, 'data', 'dict')
PACK_ENTRIES = 200  # words per pack file

POS = {'n', 'v', 'adj', 'adv', 'prep', 'conj', 'pron', 'interj'}
DEVANAGARI = re.compile(r'[\u0900-\u097F]')
LATIN = re.compile(r'[A-Za-z]')
WORD_RE = re.compile(r"^[a-z][a-z'-]*$")
SYN_RE = re.compile(r"^[a-z][a-z' -]*$")

# Irregular forms -> base word (only kept when the base word exists in the dictionary).
IRREGULAR = {
    'went': 'go', 'gone': 'go', 'goes': 'go', 'came': 'come', 'ate': 'eat', 'eaten': 'eat',
    'drank': 'drink', 'drunk': 'drink', 'slept': 'sleep', 'saw': 'see', 'seen': 'see',
    'gave': 'give', 'given': 'give', 'took': 'take', 'taken': 'take', 'made': 'make',
    'got': 'get', 'gotten': 'get', 'had': 'have', 'has': 'have', 'did': 'do', 'done': 'do',
    'does': 'do', 'said': 'say', 'spoke': 'speak', 'spoken': 'speak', 'wrote': 'write',
    'written': 'write', 'ran': 'run', 'knew': 'know', 'known': 'know', 'sat': 'sit',
    'stood': 'stand', 'wore': 'wear', 'worn': 'wear', 'sold': 'sell', 'sent': 'send',
    'fell': 'fall', 'fallen': 'fall', 'won': 'win', 'lost': 'lose', 'broke': 'break',
    'broken': 'break', 'caught': 'catch', 'taught': 'teach', 'told': 'tell',
    'met': 'meet', 'paid': 'pay', 'forgot': 'forget', 'forgotten': 'forget', 'forgave': 'forgive',
    'forgiven': 'forgive', 'grew': 'grow', 'grown': 'grow', 'lent': 'lend', 'built': 'build',
    'brought': 'bring', 'bought': 'buy', 'chose': 'choose', 'chosen': 'choose', 'felt': 'feel',
    'men': 'man', 'women': 'woman', 'children': 'child', 'wives': 'wife',
    'better': 'good', 'best': 'good', 'worse': 'bad', 'worst': 'bad',
    'began': 'begin', 'begun': 'begin', 'became': 'become', 'understood': 'understand',
    'held': 'hold', 'kept': 'keep', 'led': 'lead', 'going': 'go', 'doing': 'do',
}


def fail(errors):
    print('\nBUILD FAILED - %d problem(s):' % len(errors))
    for message in errors[:60]:
        print('  -', message)
    if len(errors) > 60:
        print('  ... and %d more' % (len(errors) - 60))
    sys.exit(1)


def load_rows():
    rows = []
    files = sorted(glob.glob(os.path.join(SRC, '*.json')))
    if not files:
        fail(['no source files found in tools/dictionary-src'])
    for path in files:
        with open(path, encoding='utf-8') as handle:
            try:
                data = json.load(handle)
            except ValueError as error:
                fail(['%s: invalid JSON (%s)' % (os.path.basename(path), error)])
        for index, row in enumerate(data):
            rows.append((os.path.basename(path), index + 1, row))
    return rows, [os.path.basename(p) for p in files]


def validate(rows):
    errors, warnings = [], []
    seen_example = {}
    seen_sense = set()
    for name, line, row in rows:
        where = '%s #%d' % (name, line)
        if not isinstance(row, list) or len(row) != 6:
            errors.append('%s: row must have 6 fields' % where)
            continue
        word, pos, hi, syn, ex, exhi = row
        where = '%s #%d (%s)' % (name, line, word)
        if not isinstance(word, str) or not WORD_RE.match(word):
            errors.append('%s: bad headword' % where)
        if pos not in POS:
            errors.append('%s: bad pos %r' % (where, pos))
        if not isinstance(hi, str) or not DEVANAGARI.search(hi) or LATIN.search(hi) or len(hi) > 70:
            errors.append('%s: Hindi meaning must be Devanagari only (<=70 chars)' % where)
        if hi != hi.strip() or '  ' in hi:
            errors.append('%s: stray spaces in Hindi meaning' % where)
        if not isinstance(syn, list) or len(syn) > 5:
            errors.append('%s: synonyms must be a list of at most 5' % where)
        else:
            if len(set(syn)) != len(syn):
                errors.append('%s: duplicate synonyms' % where)
            for item in syn:
                if not isinstance(item, str) or not SYN_RE.match(item):
                    errors.append('%s: bad synonym %r' % (where, item))
                elif item == word:
                    errors.append('%s: synonym equals headword' % where)
        if not isinstance(ex, str) or not re.match(r"^[A-Z0-9].{4,140}[.?!]$", ex):
            errors.append('%s: English example must start with a capital and end with . ? or !' % where)
        elif word[: max(3, len(word) - 2)] not in ex.lower() and not any(w[:3] == word[:3] for w in re.findall(r"[a-z']+", ex.lower())):
            warnings.append('%s: example may not contain the word' % where)
        if not isinstance(exhi, str) or not DEVANAGARI.search(exhi) or not re.search(r'[।?!]$', exhi):
            errors.append('%s: Hindi example must be Devanagari and end with । ? or !' % where)
        elif LATIN.search(exhi):
            warnings.append('%s: Hindi example contains Latin letters' % where)
        if isinstance(ex, str):
            if ex in seen_example:
                errors.append('%s: example sentence repeated (also used by %s)' % (where, seen_example[ex]))
            seen_example[ex] = where
        key = (word, pos, hi)
        if key in seen_sense:
            errors.append('%s: duplicate sense' % where)
        seen_sense.add(key)
    return errors, warnings


def group(rows):
    entries = {}
    for _, _, (word, pos, hi, syn, ex, exhi) in rows:
        entries.setdefault(word, []).append([pos, hi, syn, ex, exhi])
    return dict(sorted(entries.items()))


def main():
    rows, files = load_rows()
    errors, warnings = validate(rows)
    if errors:
        fail(errors)
    entries = group(rows)
    words = list(entries)
    forms = {form: base for form, base in IRREGULAR.items() if base in entries and form not in entries}

    os.makedirs(OUT, exist_ok=True)
    for old in glob.glob(os.path.join(OUT, 'pack-*.json')) + [os.path.join(OUT, 'manifest.json')]:
        if os.path.exists(old):
            os.remove(old)

    packs = []
    whole = hashlib.sha256()
    for number, start in enumerate(range(0, len(words), PACK_ENTRIES), 1):
        chunk = [[w, entries[w]] for w in words[start:start + PACK_ENTRIES]]
        body = json.dumps({'v': 1, 'entries': chunk}, ensure_ascii=False, separators=(',', ':'))
        data = body.encode('utf-8')
        digest = hashlib.sha256(data).hexdigest()
        whole.update(data)
        file_name = 'pack-%03d.%s.json' % (number, digest[:8])
        with open(os.path.join(OUT, file_name), 'wb') as handle:
            handle.write(data)
        packs.append({'file': file_name, 'entries': len(chunk), 'bytes': len(data), 'sha256': digest,
                      'first': chunk[0][0], 'last': chunk[-1][0]})

    senses = sum(len(v) for v in entries.values())
    manifest = {
        'format': 1,
        'version': whole.hexdigest()[:12],
        'entries': len(words),
        'senses': senses,
        'totalBytes': sum(p['bytes'] for p in packs),
        'packs': packs,
        'forms': forms,
        'source': 'Written for this project (tools/dictionary-src). No third-party dictionary data is included.'
    }
    with open(os.path.join(OUT, 'manifest.json'), 'w', encoding='utf-8') as handle:
        json.dump(manifest, handle, ensure_ascii=False, indent=1)
    with open(os.path.join(OUT, 'README.txt'), 'w', encoding='utf-8') as handle:
        handle.write(
            'Offline dictionary packs for the Vocabulary PWA.\n'
            'Generated by tools/build-dictionary.py from tools/dictionary-src/*.json - do not edit by hand.\n'
            'Content was written for this project; it is not copied from any third-party dictionary.\n'
            'Entries: %d words, %d senses. Version: %s\n' % (len(words), senses, manifest['version']))

    print('OK  %d words, %d senses, %d packs, %.1f KB total, %d irregular forms'
          % (len(words), senses, len(packs), manifest['totalBytes'] / 1024, len(forms)))
    print('    source files:', ', '.join(files))
    if warnings:
        print('\n%d warning(s):' % len(warnings))
        for message in warnings:
            print('  -', message)


if __name__ == '__main__':
    main()
