from pathlib import Path
import sys

ONBOARDING = Path('app/src/main/assets/onboarding.js')
errors=[]

def require(condition,message):
    if not condition:
        errors.append(message)

require(ONBOARDING.is_file(),'onboarding.js is missing')
if ONBOARDING.is_file():
    flat=''.join(ONBOARDING.read_text(encoding='utf-8').lower().split())
    require("tip.setattribute('role','status')" in flat,'onboarding tips must expose role=status')
    require("tip.setattribute('aria-live','polite')" in flat,'onboarding tips must use polite live announcements')
    require("tip.setattribute('aria-atomic','true')" in flat,'onboarding tips must be atomic')
    require("tip.textcontent=''" in flat and 'settimeout' in flat,'onboarding tips must retrigger cleanly for assistive technology')
    require('cleartimeout(tipannouncetimer)' in flat and 'cleartimeout(showtip.t)' in flat,'onboarding reset must cancel stale tip timers')
    require("tip.classlist.remove('show')" in flat,'onboarding reset must clear stale visual tips')
    require("action:'jump'" in flat and "action:'dash'" in flat and "action:'counter'" in flat,'first-run onboarding must explicitly teach core touch actions and enemy countering')
    require("if(current.action==='jump')return!player.onground||player.vy<-120" in flat,'Jump lesson must advance from performed gameplay input, not distance alone')
    require("if(current.action==='dash')returnbrokeninstanceofset&&broken.has(0)" in flat,'Dash lesson must advance only after a functional Dash breaks the first barrier')
    require("if(current.action==='dash')returnplayer.dash>0" not in flat,'Dash lesson must not complete from a context-free Dash tap')
    require("if(current.action==='counter')returndefeatedinstanceofset&&defeated.has(0)" in flat,'Drone lesson must advance only after the first drone is actually defeated')
    require('shownstage!==onboardingstage' in flat and 'shownstage=-1' in flat,'each onboarding lesson must announce once and rearm only on stage advance/reset')
    require('functionreadonboardingdone(){try{returnlocalstorage.getitem(onboardingkey)' in flat and 'catch(error){returnfalse;}' in flat,'onboarding persistence reads must tolerate unavailable localStorage')
    require('functionsaveonboardingdone(done){try{' in flat and 'localstorage.setitem(onboardingkey' in flat and 'localstorage.removeitem(onboardingkey)' in flat and 'catch(error)' in flat,'onboarding persistence writes must tolerate storage failures')
    require('letonboardingdone=readonboardingdone()' in flat,'onboarding startup must use the guarded persistence reader')
    require('saveonboardingdone(true)' in flat,'successful first-run completion must use the guarded persistence writer')
    require('letreplaytutorial=false' in flat and 'functiontutorialactive(){return!onboardingdone||replaytutorial;}' in flat,'tutorial replay must use temporary session state')
    require('replay.onclick=()=>{replaytutorial=true' in flat,'tutorial replay must enter temporary replay mode')
    require('replay.onclick=()=>{onboardingdone=false' not in flat and 'saveonboardingdone(false)' not in flat,'tutorial replay must not erase persisted completion')

if errors:
    print('ONBOARDING ACCESSIBILITY QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1):
        print(f'{i}. {error}')
    sys.exit(1)
print('ONBOARDING ACCESSIBILITY QUALITY GATE: PASSED')
print('role_status=yes polite=yes atomic=yes clean_retrigger=yes stale_timer_guard=yes action_aware_jump=yes functional_dash_lesson=yes functional_drone_counter=yes single_announce=yes storage_read_guard=yes storage_write_guard=yes replay_preserves_completion=yes')
