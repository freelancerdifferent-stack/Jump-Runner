from pathlib import Path
import sys

CUE = Path('app/src/main/assets/boss-dash-button-cue.js')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(CUE.is_file(), 'boss-dash-button-cue.js is missing')
text = ''.join(CUE.read_text(encoding='utf-8').lower().split()) if CUE.is_file() else ''
if text:
    require("constjumpbutton=document.getelementbyid('jumpbtn')" in text, 'Sentinel core cue must bind the Jump control')
    require('conststompsetup=coreopen&&!dashready&&player.onground' in text, 'stomp fallback cue must only appear for grounded core-open windows while Dash recharges')
    require("jumpbutton.classlist.toggle('sentinel-stomp-setup',stompsetup)" in text, 'Jump control must expose the stomp setup visual state')
    require("content:'jump→stomp'" in text, 'stomp fallback badge must name the Jump-to-Stomp action')
    require("jumpbutton.setattribute('aria-label','jumptosetupastomp,sentinelcoreopen')" in text, 'stomp fallback must expose an accessible Jump instruction')
    require("@media(prefers-reduced-motion:reduce)" in text and '#jumpbtn.sentinel-stomp-pop{animation:none}' in text, 'stomp control cue must respect reduced motion')
    require("jumpbutton.classlist.remove('sentinel-stomp-setup','sentinel-stomp-pop')" in text, 'stomp cue must clear on lifecycle/reset transitions')

if errors:
    print('SENTINEL STOMP CONTROL CUE GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('SENTINEL STOMP CONTROL CUE GATE: PASSED')
print('grounded_fallback=yes jump_badge=yes accessible_label=yes reduced_motion=yes lifecycle_clear=yes')
