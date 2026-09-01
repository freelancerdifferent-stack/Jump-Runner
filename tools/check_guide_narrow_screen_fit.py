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

require('box-sizing:border-box' in flat,'guide chip must include padding inside its viewport width cap')
require("constsafe_width='calc(100vw-env(safe-area-inset-left)-env(safe-area-inset-right)-32px)'" in flat,'guide chip width must reserve both horizontal safe-area insets plus edge padding')
require('max-width:${safe_width}' in flat,'guide chip must apply the safe-area-aware viewport width cap')
require('overflow:hidden' in flat and 'text-overflow:ellipsis' in flat and 'white-space:nowrap' in flat,'long guide objectives must truncate cleanly instead of spilling across controls')
require("chip.setattribute('aria-label',text)" in flat,'visual truncation must preserve the complete objective for assistive technology')
require("chip.textcontent=text" in flat,'guide chip must continue rendering the full objective string before CSS truncation')

if errors:
    print('GUIDE NARROW SCREEN FIT QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1):
        print(f'{i}. {error}')
    sys.exit(1)

print('GUIDE NARROW SCREEN FIT QUALITY GATE: PASSED')
print('viewport_bound=yes safe_area_horizontal=yes ellipsis=yes full_accessible_label=yes padding_safe=yes')
