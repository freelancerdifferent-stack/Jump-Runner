from pathlib import Path
import sys

HUD=Path('app/src/main/assets/guide-progress-hud.js')
errors=[]

def require(condition,message):
    if not condition:
        errors.append(message)

require(HUD.is_file(),'guide-progress-hud.js is missing')
text=HUD.read_text(encoding='utf-8') if HUD.is_file() else ''
flat=''.join(text.lower().split())

require("constgameplaypaused=typeofpaused!=='undefined'&&paused" in flat,'guided HUD must safely read the gameplay pause state')
require("state==='play'&&!gameplaypaused" in flat,'guided HUD must be inactive while gameplay is paused')
require("if(!active){chip.style.opacity='0'" in flat,'inactive guided HUD must hide the objective chip')
require("setcontrolfocus('',false)" in flat,'inactive guided HUD must clear Jump/Dash focus highlights')
require('completeuntil=0' in flat and 'laststage=null' in flat,'pause/inactive cleanup must reset transient lesson-complete state')

if errors:
    print('GUIDE PAUSE VISIBILITY QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1):
        print(f'{i}. {error}')
    sys.exit(1)

print('GUIDE PAUSE VISIBILITY QUALITY GATE: PASSED')
print('pause_hidden=yes control_focus_cleared=yes transient_state_reset=yes')
