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

require('@media(prefers-reduced-motion:reduce)' in flat,'guide HUD must honor reduced-motion preference')
require('.guide-progress-chip{transition:none!important}' in flat,'guide HUD transitions must be disabled under reduced motion')
require("active&&!reducedmotion.matches?'1.045':'1'" in flat,'guide completion scale must remain disabled under reduced motion')
require('.control.guide-control-focus{transform:none}' in flat,'guide control focus transform must remain disabled under reduced motion')

if errors:
    print('GUIDE REDUCED MOTION QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1):
        print(f'{i}. {error}')
    sys.exit(1)

print('GUIDE REDUCED MOTION QUALITY GATE: PASSED')
print('chip_transition=disabled completion_scale=disabled control_transform=disabled')
