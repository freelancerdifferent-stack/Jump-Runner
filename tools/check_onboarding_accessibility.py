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

if errors:
    print('ONBOARDING ACCESSIBILITY QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1):
        print(f'{i}. {error}')
    sys.exit(1)
print('ONBOARDING ACCESSIBILITY QUALITY GATE: PASSED')
print('role_status=yes polite=yes atomic=yes clean_retrigger=yes stale_timer_guard=yes')
