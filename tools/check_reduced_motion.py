from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
HTML = ASSETS / 'index.html'
SCRIPT = ASSETS / 'reduced-motion.js'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HTML.is_file(), 'index.html is missing')
require(SCRIPT.is_file(), 'reduced-motion.js is missing')

html = HTML.read_text(encoding='utf-8').lower() if HTML.is_file() else ''
script = ''.join(SCRIPT.read_text(encoding='utf-8').lower().split()) if SCRIPT.is_file() else ''

require('reduced-motion.js' in html, 'reduced-motion runtime must be packaged')
if script:
    require("matchmedia?.('(prefers-reduced-motion:reduce)')" in script, 'must honor the platform reduced-motion preference')
    require("addeventlistener('change',applypreference)" in script or "addlistener(applypreference)" in script, 'reduced-motion preference changes must be observed')
    require("toggleattribute('data-reduced-motion',reduced)" in script, 'document state must reflect reduced-motion preference')
    require('shake=0' in script, 'decorative screen shake must be suppressed')
    require('player.trail.length=0' in script, 'long player motion trails must be suppressed')
    require('math.min(n,4)' in script and 'math.min(power,90)' in script, 'particle bursts must be substantially reduced rather than removed')
    require('baseupdate(dt)' in script and 'baseburst(' in script, 'gameplay timing and essential feedback must remain delegated to base systems')

if errors:
    print('REDUCED MOTION QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('REDUCED MOTION QUALITY GATE: PASSED')
print('platform_preference=yes live_updates=yes screen_shake=off trails=off particles=reduced gameplay_timing=unchanged')
