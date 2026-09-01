from pathlib import Path
import sys

HUD = Path('app/src/main/assets/guide-progress-hud.js')
errors=[]

def require(condition,message):
    if not condition:
        errors.append(message)

require(HUD.is_file(),'guide-progress-hud.js is missing')
text=HUD.read_text(encoding='utf-8') if HUD.is_file() else ''
flat=''.join(text.lower().split())

require("constnormal_top='max(72px,calc(env(safe-area-inset-top)+50px))'" in flat,'normal guide HUD top anchor must remain defined')
require("constboss_top='max(112px,calc(env(safe-area-inset-top)+90px))'" in flat,'boss-safe guide HUD top anchor must remain defined')
require('functionsetbosshudclearance(active){chip.style.top=active?boss_top:normal_top;}' in flat,'guide HUD must expose explicit boss clearance switching')
require("constbosshudactive=typeofboss!=='undefined'&&!boss.dead&&(boss.active||boss.intro>0);" in flat,'boss HUD clearance must track the live Sentinel encounter')
require('setbosshudclearance(active&&bosshudactive);' in flat,'boss clearance must apply only to active guided gameplay')
require('transition:opacity.18sease,transform.18sease,background.18sease,border-color.18sease,color.18sease,top.18sease' in flat,'guide HUD vertical movement must remain restrained and animated')

if errors:
    print('GUIDE BOSS HUD CLEARANCE QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1):
        print(f'{i}. {error}')
    sys.exit(1)

print('GUIDE BOSS HUD CLEARANCE QUALITY GATE: PASSED')
print('normal_anchor=yes boss_anchor=yes sentinel_tracking=yes guided_only=yes restrained_transition=yes')
