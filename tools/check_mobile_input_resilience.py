from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
HTML = ASSETS / 'index.html'
SCRIPT = ASSETS / 'mobile-input-resilience.js'
DASH_BUFFER = ASSETS / 'dash-input-buffer.js'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HTML.is_file(), 'index.html is missing')
require(SCRIPT.is_file(), 'mobile-input-resilience.js is missing')
require(DASH_BUFFER.is_file(), 'dash-input-buffer.js is missing')

html = HTML.read_text(encoding='utf-8').lower() if HTML.is_file() else ''
script = ''.join(SCRIPT.read_text(encoding='utf-8').lower().split()) if SCRIPT.is_file() else ''
dash_buffer = ''.join(DASH_BUFFER.read_text(encoding='utf-8').lower().split()) if DASH_BUFFER.is_file() else ''

require('mobile-input-resilience.js' in html, 'mobile input resilience layer must be packaged')
require('dash-input-buffer.js' in html, 'dash input buffer must be packaged')
require('setpointercapture' in script, 'touch controls must capture their active pointer')
require('lostpointercapture' in script, 'lost pointer capture must release control state')
require("addeventlistener('pointercancel'" in script, 'pointer cancellation must be handled')
require("addeventlistener('pointerup'" in script, 'global pointer release must be handled')
require("addeventlistener('blur'" in script, 'window blur must release held input')
require("visibilitychange" in script and 'document.hidden' in script, 'backgrounding must release held input')
require("window.inputjump(false)" in script, 'jump state must be explicitly released after interrupted touches')
require("addeventlistener('jumprunnerpause',cleartransientinput)" in script, 'pause must clear transient jump/touch state')
require('player.jumpbuffer=0' in script and 'player.jumpheld=false' in script, 'pause/background input cleanup must clear buffered and held jump intent')
require("addeventlistener('jumprunnerpause',cleardashbuffer)" in dash_buffer, 'pause must clear queued dash intent')
require('functioncleardashbuffer()' in dash_buffer and 'dashbuffer=0' in dash_buffer, 'dash buffer must expose a deterministic clear path')

if errors:
    print('MOBILE INPUT RESILIENCE QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('MOBILE INPUT RESILIENCE QUALITY GATE: PASSED')
print('pointer_capture=yes pointer_cancel=yes lost_capture=yes blur_release=yes background_release=yes pause_release=yes stuck_jump_guard=yes stale_dash_guard=yes')
