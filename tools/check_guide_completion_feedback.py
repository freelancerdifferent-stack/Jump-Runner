from pathlib import Path
import sys

HUD = Path('app/src/main/assets/guide-progress-hud.js')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HUD.is_file(), 'guide-progress-hud.js is missing')
text = HUD.read_text(encoding='utf-8') if HUD.is_file() else ''
flat = ''.join(text.lower().split())

if text:
    require("constcomplete_hold_ms=720" in flat, 'guide completion acknowledgement must have a short bounded hold')
    require("stage>laststage" in flat and "completeuntil=now+complete_hold_ms" in flat, 'guide completion must trigger only when the lesson stage advances')
    require("✓guide·lessoncomplete" in flat, 'guide chip must expose an explicit lesson-complete acknowledgement')
    require("prefers-reduced-motion:reduce" in flat and "reducedmotion.matches" in flat, 'guide completion motion must respect reduced-motion preference')
    require("chip.setattribute('role','status')" in flat and "chip.setattribute('aria-live','polite')" in flat and "chip.setattribute('aria-atomic','true')" in flat, 'guide completion acknowledgement must remain a polite atomic status')
    require("alllessonscomplete" in flat, 'final all-lessons-complete state must remain present')

if errors:
    print('GUIDE COMPLETION FEEDBACK QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('GUIDE COMPLETION FEEDBACK QUALITY GATE: PASSED')
print('stage_transition=yes bounded_hold=yes reduced_motion=yes accessible_status=yes final_state=yes')
