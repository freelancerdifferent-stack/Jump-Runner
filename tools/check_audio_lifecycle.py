from pathlib import Path
import sys

AUDIO = Path('app/src/main/assets/audio.js')
PACE = Path('app/src/main/assets/run-pace-milestones.js')
SPEED_FX = Path('app/src/main/assets/speed-fx.js')
MENU_MAX_PACE = Path('app/src/main/assets/menu-max-pace-record.js')
RESULT_MAX_PACE = Path('app/src/main/assets/result-max-pace-recap.js')
errors=[]

def require(condition,message):
    if not condition: errors.append(message)

require(AUDIO.is_file(),'audio.js is missing')
require(PACE.is_file(),'run-pace-milestones.js is missing')
require(SPEED_FX.is_file(),'speed-fx.js is missing')
require(MENU_MAX_PACE.is_file(),'menu-max-pace-record.js is missing')
require(RESULT_MAX_PACE.is_file(),'result-max-pace-recap.js is missing')
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
    require('speedfxmaxheld=math.min(99.9,speedfxmaxheld+dt)' in fx and 'speedfxmaxheld=0' in fx,
            'sustained max-pace timer must advance only during valid non-boss play and reset otherwise')
    require("if(speedfxmaxheld<.8||sentinelarenapinned())return" in fx,
            'maximum pace must expose a restrained sustained HUD acknowledgement')
    require("constheld=math.min(99.9,speedfxmaxheld).tofixed(1)" in fx and "filltext('maxpace·'+held+'s',vw/2,y+15)" in fx,
            'sustained maximum pace HUD must report a bounded one-decimal hold duration')
    require("constspeed_fx_best_key='jr_max_pace_best'" in fx and 'functionreadspeedfxbest(){try{' in fx and 'catch(_){return0;}' in fx,
            'maximum pace personal best reads must survive unavailable localStorage')
    require('functionwritespeedfxbest(value){try{' in fx and 'catch(_){returnfalse;}' in fx,
            'maximum pace personal best writes must survive unavailable localStorage')
    persisted_best="'best'+math.min(99.9,speedfxbestheld).tofixed(1)+'s'"
    record_or_best="recording?'newmaxpacerecord':"+persisted_best
    require("localstorage" in fx and persisted_best in fx,
            'maximum pace HUD must expose the persisted personal best')
    require('commitspeedfxbest()' in fx and 'speedfxbestheld=bounded' in fx,
            'maximum pace personal best must update as a new sustained record is reached')
    require('speedfxrecordbaseline=speedfxbestheld' in fx and 'speedfxrecordcelebrated=false' in fx,
            'maximum pace record celebration must arm from the pre-run personal best')
    require('!speedfxrecordcelebrated&&bounded>speedfxrecordbaseline+.049' in fx and 'speedfxrecordpulse=' in fx,
            'maximum pace record celebration must trigger once when the previous record is beaten')
    require(record_or_best in fx,
            'maximum pace HUD must surface a restrained new-record acknowledgement')
    require("constreduced=speedfxreducedmotion()" in fx and "if(!reduced){" in fx,
            'sustained max-pace acknowledgement must honor reduced motion')
if MENU_MAX_PACE.is_file():
    menu=''.join(MENU_MAX_PACE.read_text(encoding='utf-8').lower().split())
    require("conststorage_key='jr_max_pace_best'" in menu,
            'start-menu max-pace challenge must reuse the persisted gameplay record')
    require('try{constvalue=number(localstorage.getitem(storage_key)||0)' in menu and 'catch(_){return0;}' in menu,
            'start-menu max-pace record reads must survive unavailable localStorage')
    require('math.max(0,math.min(99.9,value))' in menu,
            'start-menu max-pace record must remain bounded')
    require("record.tofixed(1)" in menu and "goal.textcontent='beatitthisrun'" in menu,
            'existing max-pace records must become a clear replay challenge')
    require("value.textcontent='setarecord'" in menu and "goal.textcontent='holdmaxpace1.0s+'" in menu,
            'players without a max-pace record must get a clear first target')
    require("setattribute('role','status')" in menu and "setattribute('aria-live','polite')" in menu and "setattribute('aria-atomic','true')" in menu,
            'start-menu max-pace challenge must remain accessible')
    require("constbaseshowmenu=window.showmenu" in menu and "window.showmenu=function(){baseshowmenu();decoratemenu();}" in menu,
            'start-menu max-pace challenge must survive menu rebuilds')
if RESULT_MAX_PACE.is_file():
    recap=''.join(RESULT_MAX_PACE.read_text(encoding='utf-8').lower().split())
    require("addeventlistener('jumprunnerresult',decorateresult)" in recap,
            'result max-pace recap must attach to the shared result transition')
    require("typeofspeedfxmaxheld==='undefined'" in recap and 'math.max(0,math.min(99.9,value))' in recap,
            'result max-pace recap must safely read and bound the current run hold')
    require("if(held<.05)return" in recap,
            'result max-pace recap must stay hidden when the run never sustained max pace')
    require("typeofspeedfxrecordcelebrated!=='undefined'" in recap and "record?'newrecord':'best'+best.tofixed(1)+'s'" in recap,
            'result max-pace recap must distinguish a new record from the persistent best')
    require("setattribute('role','status')" in recap and "setattribute('aria-live','polite')" in recap and "setattribute('aria-atomic','true')" in recap,
            'result max-pace recap must remain accessible')
    require("queryselector('.actions')" in recap and "insertadjacentelement('beforebegin',card)" in recap,
            'result max-pace recap must sit with result summary content before actions')

if errors:
    print('AUDIO LIFECYCLE QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1): print(f'{i}. {error}')
    sys.exit(1)
print('AUDIO LIFECYCLE QUALITY GATE: PASSED')
print('android_pause=yes visibility_pause=yes restore=yes user_gesture_guard=yes sound_toggle_suspend=yes storage_fallback=yes toggle_accessibility=yes boss_core_open_cue=yes boss_core_open_latch=yes pace_event=yes pace_audio=yes pace_haptics=yes pace_visual=yes pace_reduced_motion=yes pace_hold_state=yes pace_hold_timer=yes pace_hold_personal_best=yes pace_hold_record_celebration=yes menu_max_pace_record=yes result_max_pace_recap=yes')
