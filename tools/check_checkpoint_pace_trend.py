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
    require('checkpoint-pace-meter' in flat, "checkpoint pace chip must include a visual trend meter")
    require("math.min(1,math.abs(delta)/3)" in flat, "pace trend meter must clamp large split deltas")
    require("currentpacestate=isbest?'best':(delta<-.05?'ahead':(delta>.05?'behind':'neutral'))" in flat, "pace state thresholds must preserve best/ahead/behind/neutral semantics")
    require("classlist.toggle('ahead',currentpacestate==='ahead')" in flat, "ahead pace state must remain distinct")
    require("classlist.toggle('behind',currentpacestate==='behind')" in flat, "behind pace state must remain distinct")
    require("classlist.toggle('neutral',currentpacestate==='neutral')" in flat, "near-zero pace deltas must use a neutral state")
    require("classlist.toggle('best',currentpacestate==='best')" in flat, "best pace state must remain distinct")
    require('aria-hidden="true"' in flat or "setattribute('aria-hidden','true')" in flat, "continuous pace meter must stay visual-only for assistive technology")
    require('prefers-reduced-motion:reduce' in flat and 'transition:none' in flat, "pace trend meter must respect reduced motion")
    require("setattribute('aria-label'" in flat and "seconds${delta<0?'aheadof':'behind'}bestsplit" in flat, "pace chip must preserve explicit accessible split wording")

if errors:
    print("CHECKPOINT PACE TREND QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("CHECKPOINT PACE TREND QUALITY GATE: PASSED")
print("visual_meter=yes clamped=yes neutral_band=yes reduced_motion=yes accessible_text=yes")
