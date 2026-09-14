from pathlib import Path
import sys

PATH = Path("app/src/main/assets/result-max-pace-recap.js")
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(PATH.is_file(), "result-max-pace-recap.js is missing")
source = "".join(PATH.read_text(encoding="utf-8").lower().split()) if PATH.is_file() else ""

require("result-max-pace-best" in source, "result recap must expose a visible personal-best reference")
require("besttext.textcontent='best'+best.tofixed(1)+'s'" in source, "result recap must show the bounded personal-best hold value")
require("meta.append(besttext,progresstext)" in source, "best reference and percent progress must share the compact result metadata row")
require("personalbest${best.tofixed(1)}seconds" in source, "new-record accessibility copy must include the personal-best reference")
require("matchingyour${best.tofixed(1)}secondpersonalbest" in source, "matched-best accessibility copy must include the personal-best reference")
require("Math.max(0,Math.min(99.9,Number(speedFxBestHeld)))".lower().replace(" ", "") in source, "personal-best result value must remain bounded")

if errors:
    print("RESULT MAX-PACE BEST REFERENCE GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("RESULT MAX-PACE BEST REFERENCE GATE: PASSED")
print("visible_best=yes bounded=yes percent_context=yes accessible=yes")
