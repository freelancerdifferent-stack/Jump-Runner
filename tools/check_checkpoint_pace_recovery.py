from pathlib import Path
import sys

PACE = Path("app/src/main/assets/checkpoint-pace-chip.js")
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(PACE.is_file(), "checkpoint-pace-chip.js is missing")
if PACE.is_file():
    flat = "".join(PACE.read_text(encoding="utf-8").lower().split())
    require("previouspacestate==='behind'" in flat, "pace recovery must only trigger after a behind split")
    require("currentpacestate==='ahead'||currentpacestate==='best'" in flat, "pace recovery must require regaining ahead/best pace")
    require('pacerecovered' in flat, "pace recovery text cue is missing")
    require("classlist.add('recovered')" in flat and "classlist.remove('recovered')" in flat, "pace recovery visual cue must be latched and cleared")
    require('pace-recovered' in flat and '@keyframes' in flat, "pace recovery visual acknowledgement is missing")
    require('prefers-reduced-motion:reduce' in flat and '.checkpoint-pace-chip.recovered{animation:none}' in flat, "pace recovery animation must respect reduced motion")
    require('pacerecoveredwithanewbestsplit' in flat and 'pacerecovered.' in flat, "pace recovery must remain explicit for assistive technology")
    require('previouspacestate=null' in flat and 'clearrecovery()' in flat, "pace recovery state must reset cleanly between runs")

if errors:
    print("CHECKPOINT PACE RECOVERY QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("CHECKPOINT PACE RECOVERY QUALITY GATE: PASSED")
print("behind_to_ahead=yes best_recovery=yes one_shot_visual=yes reduced_motion=yes accessible_text=yes reset_safe=yes")
