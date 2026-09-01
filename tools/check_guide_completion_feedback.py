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
    require("'·next:'+objectivetext" in flat and "objective&&!complete" in flat, 'lesson completion must hand off to the next objective without overriding the final state')
    require("constinputlabels=" in flat and "jump:'jump'" in flat and "dash:'dash'" in flat, 'guided objectives must preserve explicit Jump and Dash input hints')
    require("counter:'jump/dash'" in flat and "bosshit:'jump/dash'" in flat and "boss:'jump/dash'" in flat, 'multi-solution combat lessons must expose both supported inputs')
    require("'·input'+input" in flat, 'required input must remain visible in the persistent guide chip')
    require("guide-control-focus" in flat and "jumpcontrol?.classlist.toggle('guide-control-focus',jumpneeded)" in flat and "dashcontrol?.classlist.toggle('guide-control-focus',dashneeded)" in flat, 'guided action lessons must visually point at the required touch controls')
    require("input==='jump/dash'" in flat and "!complete&&!celebrating" in flat, 'multi-solution lessons must highlight both controls only during the actionable objective state')
    require("setcontrolfocus('',false)" in flat, 'guide control highlighting must clear outside active guided gameplay')
    require("prefers-reduced-motion:reduce" in flat and "reducedmotion.matches" in flat and "transform:none" in flat, 'guide completion and control focus motion must respect reduced-motion preference')
    require("chip.setattribute('role','status')" in flat and "chip.setattribute('aria-live','polite')" in flat and "chip.setattribute('aria-atomic','true')" in flat, 'guide completion acknowledgement must remain a polite atomic status')
    require("alllessonscomplete" in flat, 'final all-lessons-complete state must remain present')

if errors:
    print('GUIDE COMPLETION FEEDBACK QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('GUIDE COMPLETION FEEDBACK QUALITY GATE: PASSED')
print('stage_transition=yes bounded_hold=yes next_objective_handoff=yes required_input_hints=yes guided_control_focus=yes reduced_motion=yes accessible_status=yes final_state=yes')
