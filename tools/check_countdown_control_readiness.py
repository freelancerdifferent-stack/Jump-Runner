from pathlib import Path
import sys

JS = Path('app/src/main/assets/start-countdown.js')
CSS = Path('app/src/main/assets/start-countdown.css')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(JS.is_file(), 'start-countdown.js is missing')
require(CSS.is_file(), 'start-countdown.css is missing')
js = ''.join(JS.read_text(encoding='utf-8').lower().split()) if JS.is_file() else ''
css = ''.join(CSS.read_text(encoding='utf-8').lower().split()) if CSS.is_file() else ''

if js:
    require("functionsetcontrolslocked(locked)" in js, 'countdown must expose a single control-lock state helper')
    require("control.classlist.toggle('countdown-locked',locked)" in js, 'countdown must visually mark controls as unavailable')
    require("control.setattribute('aria-disabled',locked?'true':'false')" in js, 'countdown control readiness must be exposed accessibly')
    require("state='countdown';setcontrolslocked(true)" in js, 'controls must lock before countdown play begins')
    require("state='play';setcontrolslocked(false)" in js, 'controls must unlock exactly when gameplay starts')
    require("jumprunnerresult" in js and "setcontrolslocked(false)" in js, 'result transitions must never leave controls visually locked')

if css:
    require('.control.countdown-locked{' in css and 'opacity:.46' in css, 'locked controls need a restrained visual state')
    require('filter:saturate(.45)' in css, 'locked controls should reduce emphasis without disappearing')
    require('prefers-reduced-motion:reduce' in css and '.control.countdown-locked{transform:none}' in css, 'countdown control readiness must respect reduced motion')

if errors:
    print('COUNTDOWN CONTROL READINESS QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('COUNTDOWN CONTROL READINESS QUALITY GATE: PASSED')
print('visual_lock=yes accessible_state=yes unlock_on_go=yes result_cleanup=yes reduced_motion=yes')
