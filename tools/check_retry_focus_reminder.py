from pathlib import Path
import sys

ASSETS=Path('app/src/main/assets')
HTML=ASSETS/'index.html'
SCRIPT=ASSETS/'retry-focus-reminder.js'
APPROACH=ASSETS/'checkpoint-approach-feedback.js'
STREAK=ASSETS/'focus-recovery-streak.js'
errors=[]

def require(condition,message):
    if not condition:
        errors.append(message)

def token(value):
    return ''.join(value.lower().split())

require(HTML.is_file(),'index.html is missing')
require(SCRIPT.is_file(),'retry-focus-reminder.js is missing')
require(APPROACH.is_file(),'checkpoint-approach-feedback.js is missing')
require(STREAK.is_file(),'focus-recovery-streak.js is missing')
html=HTML.read_text(encoding='utf-8').lower() if HTML.is_file() else ''
script=token(SCRIPT.read_text(encoding='utf-8')) if SCRIPT.is_file() else ''
approach=token(APPROACH.read_text(encoding='utf-8')) if APPROACH.is_file() else ''
streak=token(STREAK.read_text(encoding='utf-8')) if STREAK.is_file() else ''
require('retry-focus-reminder.js' in html,'retry focus reminder must be packaged in index.html')
require('checkpoint-approach-feedback.js' in html,'checkpoint approach feedback must be packaged in index.html')
require('focus-recovery-streak.js' in html,'focus recovery streak must be packaged in index.html')
require(token("addEventListener('jumprunnercheckpointsplit'") in script,'retry focus reminder must consume checkpoint split events')
require(token("addEventListener('jumprunnerresult'") in script,'retry focus reminder must commit a target on result')
require('localstorage.setitem(storage_key' in script and 'localstorage.removeitem(storage_key' in script,'retry focus reminder must persist and clear the next-run target')
require(('row.delta>.15' in script or 'target.delta>.15' in script) and 'value.delta>.15' in script,'retry focus reminder must ignore insignificant pace noise when saving and restoring')
require(token('recover ${activeTarget.delta.toFixed(1)}s') in script,'retry focus reminder must communicate a concrete recovery target')
require(token("setAttribute('role','status')") in script and token("setAttribute('aria-live','polite')") in script and token("setAttribute('aria-atomic','true')") in script,'retry focus reminder must remain an accessible polite atomic status')
require('prefers-reduced-motion:reduce' in script,'retry focus reminder must respect reduced-motion preferences')
require(token("addEventListener('jumprunnerpause',()=>hideReminder({keepChip:false}))") in script,'retry focus reminder and chip must clear on pause')
require(token("addEventListener('jumprunnerresume',()=>{if(activeTarget&&state==='play')showFocusChip(activeTarget)})") in script,'retry focus chip must restore after resume while the target is still active')
require(token('setTimeout(showReminder,700)') in script,'retry focus reminder must wait until the run is visible before appearing')
require('retry-focus-chip' in script and token("focusChip.setAttribute('aria-hidden','true')") in script,'persistent focus chip must be visual-only so it does not duplicate live announcements')
require(token('hideTimer=setTimeout(()=>{hideReminder();showFocusChip(activeTarget)},3200)') in script,'opening reminder must hand off to the persistent focus chip')
require(token('if(activeTarget&&detail.index===activeTarget.index){hideReminder({keepChip:false});activeTarget=null;}') in script,'persistent focus chip must clear exactly when its coached checkpoint resolves')
require(token("addEventListener('jumprunnerresult',e=>{hideReminder({keepChip:false});activeTarget=null;") in script,'persistent focus chip must clear when the run ends')
require("focus_storage_key='jr_retry_focus'" in approach,'checkpoint approach must consume the persisted retry focus target')
require('localstorage.getitem(focus_storage_key)' in approach and 'value.delta)>.15' in approach,'checkpoint focus approach must restore only meaningful pace targets')
require('focustarget&&focustarget.index===i' in approach,'checkpoint approach must match coaching to the intended gate only')
require(token('FOCUS GATE · ${gate.label} · RECOVER ${delta.toFixed(1)}s') in approach,'focus checkpoint approach must show a concrete recovery target')
require(token("presentCue(`FOCUS GATE · ${gate.label} · RECOVER ${delta.toFixed(1)}s`") in approach,'focus checkpoint must use the shared timed cue path')
require(token('focusTarget=readFocusTarget()') in approach,'focus checkpoint target must refresh on every new run')
require(token("addEventListener('jumprunnercheckpointsplit',resolveFocus)") in approach,'focus checkpoint must resolve coaching from the canonical split event')
require('detail.index!==focustarget.index' in approach and 'focusresolved=true' in approach,'focus resolution must be one-shot and scoped to the intended gate')
require('boolean(detail.isbest)||delta<=.15' in approach,'focus resolution must treat a best split or noise-floor match as cleared')
require(token('FOCUS CLEARED · ${detail.label}') in approach and token('FOCUS GAP · ${detail.label} · +${Math.max(0,delta).toFixed(1)}s') in approach,'focus resolution must report success or remaining pace gap')
require(token("cue.setAttribute('aria-label',label)") in approach,'focus approach and resolution cues must expose equivalent accessible text')
require('settimeout(hidecue,duration)' in approach and token("addEventListener('jumprunnerpause',hideCue)") in approach,'focus cues must auto-hide even with reduced motion and clear on pause')
require("cue.classlist.remove('show','focus','cleared')" in approach,'focus cue visual states must reset cleanly between runs')
require("newcustomevent('jumprunnerfocusresolved'" in approach and 'cleared,delta' in approach,'focus resolution must publish a canonical coached-gate outcome event')
require("storage_key='jr_focus_recovery_streak'" in streak,'focus recovery streak must persist independently from the retry target')
require("best_storage_key='jr_focus_recovery_best'" in streak,'focus recovery best must persist independently from the current streak')
require(token("addEventListener('jumprunnerfocusresolved',onFocusResolved)") in streak,'focus recovery streak must consume the canonical coached-gate outcome')
require('streak=lastcleared?streak+1:0' in streak,'focus recovery streak must increment only on a clear and reset on a miss')
require('writenumber(storage_key,streak)' in streak,'focus recovery streak must persist locally')
require('if(lastcleared&&streak>best)' in streak and 'writenumber(best_storage_key,best)' in streak,'focus recovery personal best must update only when a cleared streak exceeds the saved best')
require("newbest?'newbestmomentum'" in streak and 'personalbestfocusstreak' in streak,'focus recovery result must celebrate a new personal best without changing gameplay')
require(token("addEventListener('jumprunnerresult',()=>requestAnimationFrame(renderResult))") in streak,'focus recovery streak must render only on the result surface')
require(token("card.setAttribute('role','status')") in streak and token("card.setAttribute('aria-live','polite')") in streak and token("card.setAttribute('aria-atomic','true')") in streak,'focus streak result must remain an accessible polite atomic status')
require('if(!attempted||!panel)return' in streak,'focus streak result must stay hidden when no coached gate was attempted')
require('newbest=false;basereset()' in streak,'focus personal-best celebration state must reset cleanly between runs')
require('focus-best-menu' in streak and token('COACHING BEST ×${best}') in streak,'saved focus personal best must surface as a restrained menu accolade')
require(token("badge.setAttribute('aria-label',`Best focus recovery streak ${best}`)") in streak,'menu focus personal best must expose equivalent accessible text')
require('best=readnumber(best_storage_key);if(best<=0)return' in streak,'menu accolade must refresh persisted best and remain hidden before a best exists')
require(token('const baseShowMenu=showMenu;showMenu=function(){baseShowMenu();requestAnimationFrame(renderMenuBest);};') in streak,'menu accolade must render after the canonical menu surface')

if errors:
    print('RETRY FOCUS REMINDER QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1):
        print(f'{i}. {error}')
    sys.exit(1)
print('RETRY FOCUS REMINDER QUALITY GATE: PASSED')
print('packaged=yes split_driven=yes result_driven=yes persistent=yes noise_floor=yes accessible=yes reduced_motion=yes pause_safe=yes focus_chip=yes focus_chip_split_clear=yes focus_gate_approach=yes focus_gate_resolution=yes focus_outcome_event=yes focus_recovery_streak=yes focus_recovery_personal_best=yes focus_best_menu=yes')
