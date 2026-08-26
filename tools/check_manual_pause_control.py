from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
HTML = ASSETS / 'index.html'
PAUSE = ASSETS / 'manual-pause-control.js'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HTML.is_file(), 'index.html is missing')
require(PAUSE.is_file(), 'manual-pause-control.js is missing')

html = HTML.read_text(encoding='utf-8').lower() if HTML.is_file() else ''
code = ''.join(PAUSE.read_text(encoding='utf-8').lower().split()) if PAUSE.is_file() else ''

if html:
    require('manual-pause-control.js' in html, 'manual pause runtime must be packaged')
    require(html.index('pause-feedback.js') < html.index('manual-pause-control.js') < html.index('resume-countdown.js'), 'manual pause must reuse pause presentation before resume countdown')

if code:
    require("button.id='pausebtn'" in code, 'touch pause control must expose a stable id')
    require("setattribute('aria-label','pauserun')" in code and "setattribute('aria-pressed','false')" in code, 'pause control must start with accessible state')
    require("window.dispatchevent(newevent('jumprunnerpause'))" in code, 'manual pause must reuse the native pause event')
    require("window.dispatchevent(newevent('jumprunnerresume'))" in code, 'manual resume must reuse the native resume event')
    require("e.code==='keyp'||e.code==='escape'" in code, 'keyboard pause shortcut must remain available')
    require("pausecard.addeventlistener('pointerdown'" in code, 'visible pause card must support tap-to-resume')
    require("button.hidden=!playing&&!ispaused" in code, 'pause control must stay out of menus/results')
    require("button.setattribute('aria-pressed',ispaused?'true':'false')" in code, 'pause button accessibility state must track pause state')
    require('safe-area-inset-right' in code and 'safe-area-inset-top' in code, 'pause control must respect Android display safe areas')

if errors:
    print('MANUAL PAUSE QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('MANUAL PAUSE QUALITY GATE: PASSED')
print('touch_pause=yes tap_resume=yes keyboard_pause=yes lifecycle_reuse=yes accessibility=yes safe_area=yes')
