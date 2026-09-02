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

require("chip.setattribute('aria-hidden','true')" in flat,'guide HUD must begin hidden from assistive technology')
require("functionsetaccessiblevisibility(active){chip.setattribute('aria-hidden',active?'false':'true')}" in flat,'guide HUD must synchronize aria-hidden with gameplay visibility')
require('setaccessiblevisibility(active)' in flat,'guide HUD refresh must update accessible visibility every frame')
require("if(!active){chip.style.opacity='0'" in flat,'inactive guide HUD must remain visually hidden')

if errors:
    print('GUIDE ACCESSIBLE VISIBILITY QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1):
        print(f'{i}. {error}')
    sys.exit(1)

print('GUIDE ACCESSIBLE VISIBILITY QUALITY GATE: PASSED')
print('visual_visibility_synced=yes assistive_visibility_synced=yes stale_status_hidden=yes')
