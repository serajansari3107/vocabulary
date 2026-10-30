#!/usr/bin/env python3
"""Stamp sw.js with a fingerprint (BUILD) of every file it caches.

Run from the project root before every commit:   python3 tools/stamp-sw.py

If any app file (or the dictionary manifest) changed, BUILD changes, the browser sees a different sw.js,
installs the new version in the background and replaces the old cache. If nothing changed, BUILD stays the same.
Also checks that every CORE file exists, and that index.html does not reference a local file missing from CORE.
"""
import hashlib
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SW = os.path.join(ROOT, 'sw.js')
source = open(SW, encoding='utf-8').read()

core = re.search(r'const CORE = \[(.*?)\];', source, re.S)
optional = re.search(r'const OPTIONAL = \[(.*?)\];', source, re.S)
files = re.findall(r"'([^']+)'", core.group(1))
extra = re.findall(r"'([^']+)'", optional.group(1)) if optional else []

problems = []
digest = hashlib.sha256()
for name in sorted(set(f for f in files + extra if f != './')):
    path = os.path.join(ROOT, name)
    if not os.path.isfile(path):
        problems.append('missing file listed in sw.js: ' + name)
        continue
    digest.update(name.encode() + b'\0' + open(path, 'rb').read() + b'\0')
manifest = os.path.join(ROOT, 'data', 'dict', 'manifest.json')
if os.path.isfile(manifest):
    digest.update(open(manifest, 'rb').read())

html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
for ref in re.findall(r'(?:src|href)="([^":#?]+)"', html):
    if ref not in files and ref not in extra and not ref.endswith('/'):
        problems.append('index.html references %s but sw.js CORE does not list it' % ref)

if problems:
    print('PROBLEMS:')
    for p in problems:
        print('  -', p)
    sys.exit(1)

build = digest.hexdigest()[:12]
updated = re.sub(r"const BUILD = '[0-9a-f]+';", "const BUILD = '%s';" % build, source, count=1)
if updated != source:
    open(SW, 'w', encoding='utf-8').write(updated)
print('BUILD %s  (%d files fingerprinted)%s' % (build, len(files) + len(extra), '' if updated != source else '  [unchanged]'))
