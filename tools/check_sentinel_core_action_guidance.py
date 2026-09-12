from pathlib import Path
import sys

PATH = Path('app/src/main/assets/boss-core-window-feedback.js')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(PATH.is_file(), 'boss-core-window-feedback.js is missing')
if PATH.is_file():
    text = ''.join(PATH.read_text(encoding='utf-8').lower().split())
    require("functioncurrentaction()" in text, 'core cue must derive the action from live player state')
    require("if(player.dashcd<=.001)return'dashnow'" in text, 'ready Dash must remain the preferred core action')
    require("if(player.onground)return'jump→stomp'" in text, 'grounded fallback must explicitly teach Jump then Stomp')
    require("if(player.vy<-80)return'riseabovecore'" in text, 'ascending fallback must explain the stomp setup')
    require("return'landoncore'" in text, 'descending fallback must explain the stomp finish')
    require("role','status'" in text and "aria-live','polite'" in text and "aria-atomic','true'" in text, 'dynamic core guidance must remain accessible')
    require("@media(prefers-reduced-motion:reduce)" in text, 'core guidance must preserve reduced-motion handling')
    require("windowmissed" in text and "nextpass" in text, 'missed-window recovery cue must remain present')

if errors:
    print('SENTINEL CORE ACTION GUIDANCE QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('SENTINEL CORE ACTION GUIDANCE QUALITY GATE: PASSED')
print('dash_preferred=yes grounded_jump_stomp=yes airborne_setup=yes descending_stomp=yes accessible=yes reduced_motion=yes')
