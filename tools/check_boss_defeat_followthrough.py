from pathlib import Path
import sys

PATH=Path('app/src/main/assets/boss-defeat-followthrough.js')
errors=[]

def require(condition,message):
    if not condition:
        errors.append(message)

require(PATH.is_file(),'boss-defeat-followthrough.js is missing')
if PATH.is_file():
    text=''.join(PATH.read_text(encoding='utf-8').lower().split())
    require("sentineldown·auto-runresumed·finishahead→" in text,'post-boss cue must explain that auto-run resumed and point toward the finish')
    require("dead&&!previousdead" in text,'post-boss cue must fire only on the live-to-dead Sentinel transition')
    require("setattribute('role','status')" in text and "setattribute('aria-live','polite')" in text and "setattribute('aria-atomic','true')" in text,'post-boss guidance must remain an atomic polite status announcement')
    require("setattribute('aria-hidden','true')" in text,'inactive post-boss guidance must stay hidden from assistive technology')
    require("el.setattribute('aria-hidden','false')" in text,'visible post-boss guidance must become available to assistive technology')
    require("functionhidecue(el)" in text and "el.style.opacity='0'" in text and "el.setattribute('aria-hidden','true')" in text,'post-boss cue must hide visually and accessibly through the same cleanup path')
    require("settimeout(()=>hidecue(el),1800)" in text,'post-boss cue must remain visible long enough to read without lingering')
    require("if(card)hidecue(card)" in text and "previousdead=false" in text,'post-boss cue state and assistive visibility must reset between runs')

if errors:
    print('BOSS DEFEAT FOLLOWTHROUGH QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1):
        print(f'{i}. {error}')
    sys.exit(1)
print('BOSS DEFEAT FOLLOWTHROUGH QUALITY GATE: PASSED')
print('autorun_resume_clarity=yes finish_direction=yes transition_only=yes accessible=yes inactive_hidden=yes readable_dwell=yes reset_safe=yes')
