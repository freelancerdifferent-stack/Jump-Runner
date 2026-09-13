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
    require("beststreak=isbest?beststreak+1:0" in flat, "best split streak must advance only on consecutive best splits")
    require("beststreakactive=isbest&&beststreak>=2" in flat, "best split streak celebration must begin at two consecutive best splits")
    require("`bestsplit×${beststreak}`" in flat, "consecutive best split count must be visible in the pace chip")
    require("classlist.add('streak')" in flat and "classlist.remove('streak')" in flat, "best split streak visual cue must be one-shot and cleared")
    require("@keyframespace-streak" in flat, "best split streak visual acknowledgement is missing")
    require(".checkpoint-pace-chip.recovered,.checkpoint-pace-chip.slipped,.checkpoint-pace-chip.streak{animation:none}" in flat, "best split streak animation must respect reduced motion")
    require("bestsplitsinarow" in flat, "best split streak must remain explicit for assistive technology")
    require("beststreak=0" in flat and "cleartransitioncue()" in flat, "best split streak state must reset cleanly between runs")

if errors:
    print("CHECKPOINT BEST SPLIT STREAK QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("CHECKPOINT BEST SPLIT STREAK QUALITY GATE: PASSED")
print("consecutive_best_tracking=yes visible_count=yes one_shot_visual=yes reduced_motion=yes accessible_text=yes reset_safe=yes")
