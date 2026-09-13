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
    require("(previouspacestate==='ahead'||previouspacestate==='best')&&currentpacestate==='behind'" in flat, "pace slip must only trigger when an ahead/best run falls behind")
    require('paceslipped' in flat, "pace slip text cue is missing")
    require("classlist.add(recovered?'recovered':'slipped')" in flat and "classlist.remove('recovered','slipped')" in flat, "pace slip visual cue must be one-shot and cleared")
    require('pace-slipped' in flat and '@keyframes' in flat, "pace slip visual acknowledgement is missing")
    reduced_motion = 'prefers-reduced-motion:reduce' in flat and (
        '.checkpoint-pace-chip.recovered,.checkpoint-pace-chip.slipped{animation:none}' in flat
        or '.checkpoint-pace-chip.recovered,.checkpoint-pace-chip.slipped,.checkpoint-pace-chip.streak{animation:none}' in flat
    )
    require(reduced_motion, "pace slip animation must respect reduced motion")
    require('paceslipped.' in flat and 'secondsbehindbestsplit' in flat, "pace slip must remain explicit for assistive technology")
    require('previouspacestate=null' in flat and 'cleartransitioncue()' in flat, "pace slip state must reset cleanly between runs")

if errors:
    print("CHECKPOINT PACE SLIP QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("CHECKPOINT PACE SLIP QUALITY GATE: PASSED")
print("ahead_to_behind=yes best_to_behind=yes one_shot_visual=yes reduced_motion=yes accessible_text=yes reset_safe=yes")
