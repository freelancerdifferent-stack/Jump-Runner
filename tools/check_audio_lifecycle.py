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
    require('functionreadaudiosetting(key,fallback=true){try{' in flat and 'catch(_){returnfallback;}' in flat,
            'audio preference reads must survive unavailable localStorage')
    require('functionwriteaudiosetting(key,enabled){try{' in flat and 'catch(_){returnfalse;}' in flat,
            'audio preference writes must survive unavailable localStorage')
    require("writeaudiosetting('jr_audio',jraudioenabled)" in flat and "elsesuspendaudio();" in flat,
            'turning sound off must persist safely and suspend the active audio context')
    require("writeaudiosetting('jr_haptics',jrhapticsenabled)" in flat,
            'haptics preference must persist through the safe storage wrapper')
    require("a.setattribute('aria-pressed',string(jraudioenabled))" in flat and "h.setattribute('aria-pressed',string(jrhapticsenabled))" in flat,
            'audio and haptics toggles must expose their current pressed state')
    require('functionsfxbosscoreopen()' in flat and 'chord([523,659,784]' in flat,
            'Sentinel core-open window must expose a restrained procedural audio cue')
    require('lastbosscoreopen=false' in flat and 'if(coreopen&&!lastbosscoreopen)sfxbosscoreopen();' in flat and 'lastbosscoreopen=coreopen;' in flat,
            'Sentinel core-open audio cue must fire once per open-window transition')
    require("state==='play'&&typeofboss!=='undefined'&&boss.active&&!boss.dead&&boss.coreopen" in flat,
            'Sentinel core-open cue must only run for a live active encounter')

if errors:
    print('AUDIO LIFECYCLE QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1): print(f'{i}. {error}')
    sys.exit(1)
print('AUDIO LIFECYCLE QUALITY GATE: PASSED')
print('android_pause=yes visibility_pause=yes restore=yes user_gesture_guard=yes sound_toggle_suspend=yes storage_fallback=yes toggle_accessibility=yes boss_core_open_cue=yes boss_core_open_latch=yes')
