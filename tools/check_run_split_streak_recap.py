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
    require("currentbestsplitstreak=isbest?currentbestsplitstreak+1:0" in flat, "result recap must track consecutive best checkpoint splits")
    require("peakbestsplitstreak=math.max(peakbestsplitstreak,currentbestsplitstreak)" in flat, "result recap must preserve the run peak best-split streak")
    require("peakbestsplitstreak>=2" in flat, "best-split streak recap must stay restrained to meaningful streaks")
    require("bestsplitstreak" in flat and "×${peakbestsplitstreak}" in flat, "result recap must visibly report the peak best-split streak")
    require("bestcheckpointsplitstreak:${peakbestsplitstreak}inarow" in flat, "best-split streak recap must remain explicit for assistive technology")
    require("currentbestsplitstreak=0;peakbestsplitstreak=0" in flat, "best-split streak recap state must reset between runs")
    require("run-split-recap-achievement" in flat, "best-split streak recap needs a dedicated compact achievement treatment")

if errors:
    print("RUN SPLIT STREAK RECAP QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("RUN SPLIT STREAK RECAP QUALITY GATE: PASSED")
print("consecutive_tracking=yes peak_tracking=yes result_recap=yes meaningful_threshold=yes accessible_text=yes reset_safe=yes")
