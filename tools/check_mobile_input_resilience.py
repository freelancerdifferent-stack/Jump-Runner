from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
HTML = ASSETS / 'index.html'
SCRIPT = ASSETS / 'mobile-input-resilience.js'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HTML.is_file(), 'index.html is missing')
require(SCRIPT.is_file(), 'mobile-input-resilience.js is missing')

html = HTML.read_text(encoding='utf-8').lower() if HTML.is_file() else ''
script = ''.join(SCRIPT.read_text(encoding='utf-8').lower().split()) if SCRIPT.is_file() else ''

require('mobile-input-resilience.js' in html, 'mobile input resilience layer must be packaged')
require('setpointercapture' in script, 'touch controls must capture their active pointer')
require('lostpointercapture' in script, 'lost pointer capture must release control state')
require("addeventlistener('pointercancel'" in script, 'pointer cancellation must be handled')
require("addeventlistener('pointerup'" in script, 'global pointer release must be handled')
require("addeventlistener('blur'" in script, 'window blur must release held input')
require("visibilitychange" in script and 'document.hidden' in script, 'backgrounding must release held input')
require("window.inputjump(false)" in script, 'jump state must be explicitly released after interrupted touches')

if errors:
    print('MOBILE INPUT RESILIENCE QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('MOBILE INPUT RESILIENCE QUALITY GATE: PASSED')
print('pointer_capture=yes pointer_cancel=yes lost_capture=yes blur_release=yes background_release=yes stuck_jump_guard=yes')
