from pathlib import Path
import sys

ASSETS = Path("app/src/main/assets")
INDEX = ASSETS / "index.html"
PROGRESS = ASSETS / "flawless-clear-progress.js"
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

def flat(path):
    return "".join(path.read_text(encoding="utf-8").lower().split()) if path.is_file() else ""

require(INDEX.is_file(), "index.html is missing")
require(PROGRESS.is_file(), "flawless-clear-progress.js is missing")
index = flat(INDEX)
progress = flat(PROGRESS)

if index:
    require('src="flawless-clear-progress.js"' in index, "flawless clear progression must be loaded")
    require(index.find('src="clear-streak-progress.js"') < index.find('src="flawless-clear-progress.js"'), "flawless clear progression must layer after clear streak progression")

if progress:
    require("'jr_flawless_clears'" in progress, "flawless clear count must persist locally")
    require("boolean(win)&&health===maxhealth" in progress, "only full-integrity wins may count as flawless")
    require("storedflawlessclears()+1" in progress, "flawless wins must increment lifetime progression")
    require("flawlessclears·${total}" in progress and "nointegritylost" in progress, "menu must surface flawless mastery progression")
    require("flawlessclear·integrity${maxhealth}/${maxhealth}" in progress, "results must acknowledge a flawless clear")
    require("note.setattribute('role','status')" in progress and "note.setattribute('aria-live','polite')" in progress and "note.setattribute('aria-atomic','true')" in progress, "flawless result feedback must remain accessible and atomic")
    require("score+=" not in progress and "flow=" not in progress, "flawless progression must not alter gameplay scoring or flow")

if errors:
    print("FLAWLESS CLEAR PROGRESSION QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("FLAWLESS CLEAR PROGRESSION QUALITY GATE: PASSED")
print("full_integrity_only=yes lifetime_progress=yes menu_badge=yes result_feedback=yes accessible=yes scoring_unchanged=yes")
