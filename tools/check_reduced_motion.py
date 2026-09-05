from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
HTML = ASSETS / 'index.html'
SCRIPT = ASSETS / 'reduced-motion.js'
A11Y = ASSETS / 'accessibility.js'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HTML.is_file(), 'index.html is missing')
require(SCRIPT.is_file(), 'reduced-motion.js is missing')
require(A11Y.is_file(), 'accessibility.js is missing')

html = HTML.read_text(encoding='utf-8').lower() if HTML.is_file() else ''
script = ''.join(SCRIPT.read_text(encoding='utf-8').lower().split()) if SCRIPT.is_file() else ''
a11y = ''.join(A11Y.read_text(encoding='utf-8').lower().split()) if A11Y.is_file() else ''

require('reduced-motion.js' in html, 'reduced-motion runtime must be packaged')
require('accessibility.js' in html, 'accessibility runtime must be packaged')
if script:
    require("matchmedia?.('(prefers-reduced-motion:reduce)')" in script, 'must honor the platform reduced-motion preference')
    require(
        "addeventlistener('change',onsystemchange)" in script or "addlistener(onsystemchange)" in script or
        "addeventlistener('change',applypreference)" in script or "addlistener(applypreference)" in script,
        'reduced-motion preference changes must be observed')
    require('onsystemchange=()=>{if(override===null)applypreference()}' in script,
            'system preference changes must apply only while no explicit player override exists')
    require("localstorage.getitem(storage_key)" in script and "localstorage.setitem(storage_key" in script,
            'explicit motion preference must persist locally')
    require("toggleattribute('data-reduced-motion',reduced)" in script, 'document state must reflect reduced-motion preference')
    require('shake=0' in script, 'decorative screen shake must be suppressed')
    require('player.trail.length=0' in script, 'long player motion trails must be suppressed')
    require('math.min(n,4)' in script and 'math.min(power,90)' in script, 'particle bursts must be substantially reduced rather than removed')
    require('baseupdate(dt)' in script and 'baseburst(' in script, 'gameplay timing and essential feedback must remain delegated to base systems')
if a11y:
    require('functionreadstoreda11y(){try{' in a11y and 'catch(_){return{found:false' in a11y,
            'accessibility preference reads must survive blocked or unavailable localStorage')
    require('functionwritestoreda11y(value){try{' in a11y and 'catch(_){returnfalse;}' in a11y,
            'accessibility preference writes must survive blocked or unavailable localStorage')
    require('normalizea11y(json.parse(raw))' in a11y,
            'stored accessibility JSON must be parsed through the normalizer')
    require("typeofmatchmedia==='function'" in a11y and '!a11ystored.found' in a11y,
            'platform reduced-motion fallback must remain safe when no valid preference exists')
    require("btn.setattribute('aria-pressed',string(!!a11y[k]))" in a11y,
            'accessibility toggles must expose their pressed state')

if errors:
    print('REDUCED MOTION QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('REDUCED MOTION QUALITY GATE: PASSED')
print('platform_preference=yes live_updates=yes persisted_override=yes screen_shake=off trails=off particles=reduced gameplay_timing=unchanged accessibility_storage_fallback=yes accessibility_toggle_state=yes')
