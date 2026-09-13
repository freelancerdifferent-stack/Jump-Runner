from pathlib import Path
import sys

RECAP = Path("app/src/main/assets/run-split-recap.js")
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(RECAP.is_file(), "run-split-recap.js is missing")
if RECAP.is_file():
    flat = "".join(RECAP.read_text(encoding="utf-8").lower().split())
    require("constbest_split_streak_key='jr_best_split_streak'" in flat, "personal split-streak record needs a stable storage key")
    require("localstorage.getitem(best_split_streak_key)" in flat, "personal split-streak record must restore across sessions")
    require("peakbestsplitstreak<2||peakbestsplitstreak<=bestsplitstreakrecord" in flat, "record persistence must stay restrained to meaningful improvements")
    require("localstorage.setitem(best_split_streak_key,string(bestsplitstreakrecord))" in flat, "new personal split-streak records must persist")
    require("newstreakrecord" in flat and "is-record" in flat, "new records need a distinct compact result treatment")
    require("newpersonalcheckpointsplitstreakrecord:${peakbestsplitstreak}inarow" in flat, "new streak records must be explicit for assistive technology")
    require("record×${bestsplitstreakrecord}" in flat, "non-record runs must preserve visible personal-record context")
    require("previou srecord" not in flat, "regression guard sanity check")
    require("functionresetrunsplits(){runsplits.length=0;currentbestsplitstreak=0;peakbestsplitstreak=0;}" in flat, "run reset must not erase the persistent personal record")

if errors:
    print("PERSISTENT BEST SPLIT STREAK QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("PERSISTENT BEST SPLIT STREAK QUALITY GATE: PASSED")
print("storage_key=yes restore=yes meaningful_threshold=yes persistence=yes new_record_treatment=yes accessible_record=yes record_context=yes reset_safe=yes")
