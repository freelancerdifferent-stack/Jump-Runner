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
require("record||matched||progresspct>=100?'elite':progresspct>=90?'close':'building'" in source, "pace grade must use deterministic elite/close/building thresholds")
require("gradelabel.textcontent='pacegrade·'+grade" in source, "result recap must expose a visible pace grade")
require("pacegrade${grade}" in source, "pace grade must be included in the accessible result announcement")
require("constnexttarget=grade==='building'?best*.9:grade==='close'?best:held" in source, "next pace-grade target must derive from the same deterministic thresholds")
require("constnextgap=math.max(0,nexttarget-held)" in source, "next pace-grade coaching must clamp the remaining seconds at zero")
require("'next·close+'+nextgap.tofixed(1)+'s'" in source and "'next·elite+'+nextgap.tofixed(1)+'s'" in source, "next pace-grade coaching must show an actionable seconds gap")
require("${nextgap.tofixed(1)}secondsmore" in source, "accessible coaching must announce the seconds needed for the next grade")
require("gradetext.append(gradelabel,nextlabel)" in source, "pace grade and next target must share the compact grade row")
require("card.append(label,value,note,meter,meta,gradetext)" in source, "pace grade must remain inside the compact result card")

if errors:
    print("RESULT MAX-PACE BEST REFERENCE GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("RESULT MAX-PACE BEST REFERENCE GATE: PASSED")
print("visible_best=yes bounded=yes percent_context=yes pace_grade=yes next_grade_coaching=yes next_grade_gap=yes accessible=yes")
