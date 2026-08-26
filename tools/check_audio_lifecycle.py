from pathlib import Path
import sys

AUDIO = Path('app/src/main/assets/audio.js')
errors=[]

def require(condition,message):
    if not condition: errors.append(message)

require(AUDIO.is_file(),'audio.js is missing')
if AUDIO.is_file():
    flat=''.join(AUDIO.read_text(encoding='utf-8').lower().split())
    require("addeventlistener('jumprunnerpause',suspendaudio)" in flat,'audio must suspend on Android pause')
    require("addeventlistener('jumprunnerresume',resumeaudio)" in flat,'audio must resume on Android resume')
    require("addeventlistener('pagehide',suspendaudio)" in flat,'audio must suspend when page is hidden')
    require("addeventlistener('pageshow',resumeaudio)" in flat,'audio must recover after page restore')
    require("document.visibilitystate==='hidden'" in flat,'audio resume must respect document visibility')
    require('jraudiounlocked' in flat,'audio must not resume before a user gesture unlock')
    require("else suspendaudio()" in flat,'turning sound off must suspend the active audio context')

if errors:
    print('AUDIO LIFECYCLE QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1): print(f'{i}. {error}')
    sys.exit(1)
print('AUDIO LIFECYCLE QUALITY GATE: PASSED')
print('android_pause=yes visibility_pause=yes restore=yes user_gesture_guard=yes sound_toggle_suspend=yes')
