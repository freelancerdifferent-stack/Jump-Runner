from pathlib import Path
import sys

AUDIO = Path('app/src/main/assets/audio.js')
PACE = Path('app/src/main/assets/run-pace-milestones.js')
SPEED_FX = Path('app/src/main/assets/speed-fx.js')
errors=[]

def require(condition,message):
    if not condition: errors.append(message)

require(AUDIO.is_file(),'audio.js is missing')
require(PACE.is_file(),'run-pace-milestones.js is missing')
require(SPEED_FX.is_file(),'speed-fx.js is missing')
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
    require('lastbosscoreopen=false' in flat and 'if(coreopen&&!lastbosscoreopen){' in flat and 'sfxbosscoreopen();' in flat and 'lastbosscoreopen=coreopen;' in flat,
            'Sentinel core-open audio cue must fire once per open-window transition')
    require("state==='play'&&typeofboss!=='undefined'&&boss.active&&!boss.dead&&boss.coreopen" in flat,
            'Sentinel core-open cue must only run for a live active encounter')
    require('functionsfxpacemilestone(maxpace)' in flat and "addeventlistener('jumprunnerpacemilestone'" in flat,
            'automatic pace milestones must connect to the procedural audio layer')
    require('if(maxpace){chord([659,784,988]' in flat and 'else{tone(610' in flat,
            'maximum pace must sound distinct from intermediate pace increases')
    require('boolean(e.detail&&e.detail.max)' in flat,
            'pace audio must derive the maximum-pace treatment from the gameplay event')
if PACE.is_file():
    pace=''.join(PACE.read_text(encoding='utf-8').lower().split())
    require("newcustomevent('jumprunnerpacemilestone'" in pace,
            'pace milestone feedback must dispatch the shared audio event')
    require('speed:tier.speed' in pace and 'max:tier.speed===455' in pace,
            'pace milestone event must expose reached speed and the maximum-pace state')
    require('announced.add(tier.speed)' in pace,
            'pace milestone feedback must remain one-shot per run')
if SPEED_FX.is_file():
    fx=''.join(SPEED_FX.read_text(encoding='utf-8').lower().split())
    require("addeventlistener('jumprunnerpacemilestone'" in fx,
            'automatic pace milestones must connect to the visual momentum layer')
    require('speedfxpacepulse' in fx and 'speedfxmaxpace' in fx,
            'pace visual feedback must be latched as a short one-shot accent')
    require("document.documentelement.hasattribute('data-reduced-motion')" in fx,
            'pace visual feedback must honor the reduced-motion preference')
    require("speedfxmaxpace?'#ffd86b':'#69edff'" in fx,
            'maximum pace must remain visually distinct from intermediate milestones')
    require('speedfxpacepulse=math.max(0,speedfxpacepulse-dt)' in fx,
            'pace visual accent must decay automatically')
    require('if(speedfxpacepulse>0&&!arenapinned)' in fx,
            'pace visual accent must remain suppressed while the Sentinel arena is pinned')
    require('functionatautomaticmaxpace(){returnstate===\'play\'&&time>=115/3.2;}' in fx,
            'sustained max-pace state must mirror the automatic runner speed cap')
    require('speedfxmaxheld=atautomaticmaxpace()&&!arenapinned?math.min(99.9,speedfxmaxheld+dt):0' in fx,
            'sustained max-pace timer must reset outside valid non-boss play')
    require("if(speedfxmaxheld<.8||sentinelarenapinned())return" in fx,
            'maximum pace must expose a restrained sustained HUD acknowledgement')
    require("constheld=math.min(99.9,speedfxmaxheld).tofixed(1)" in fx and "filltext('maxpace·'+held+'s',vw/2,y+17)" in fx,
            'sustained maximum pace HUD must report a bounded one-decimal hold duration')
    require("constreduced=speedfxreducedmotion()" in fx and "if(!reduced){" in fx,
            'sustained max-pace acknowledgement must honor reduced motion')

if errors:
    print('AUDIO LIFECYCLE QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1): print(f'{i}. {error}')
    sys.exit(1)
print('AUDIO LIFECYCLE QUALITY GATE: PASSED')
print('android_pause=yes visibility_pause=yes restore=yes user_gesture_guard=yes sound_toggle_suspend=yes storage_fallback=yes toggle_accessibility=yes boss_core_open_cue=yes boss_core_open_latch=yes pace_event=yes pace_audio=yes pace_haptics=yes pace_visual=yes pace_reduced_motion=yes pace_hold_state=yes pace_hold_timer=yes')
