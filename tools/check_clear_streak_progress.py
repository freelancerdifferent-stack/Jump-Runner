from pathlib import Path
import sys

ASSETS = Path("app/src/main/assets")
INDEX = ASSETS / "index.html"
STREAK = ASSETS / "clear-streak-progress.js"
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

def flat(path):
    return "".join(path.read_text(encoding="utf-8").lower().split()) if path.is_file() else ""

require(INDEX.is_file(), "index.html is missing")
require(STREAK.is_file(), "clear-streak-progress.js is missing")
index = flat(INDEX)
streak = flat(STREAK)

if index:
    require('src="clear-streak-progress.js"' in index, "clear streak progression must be loaded")
    require(index.find('src="lifetime-clears.js"') < index.find('src="clear-streak-progress.js"'), "clear streak progression must layer after lifetime clears")

if streak:
    require("'jr_clear_streak'" in streak and "'jr_best_clear_streak'" in streak, "current and best streaks must persist locally")
    require("conststreak=currentclearstreak()+1" in streak, "successful clears must increment the current streak")
    require("if(!win){resetclearstreak();return;}" in streak, "failed runs must reset the current streak")
    require("math.max(previousbest,streak)" in streak, "best streak must never regress")
    require("streakrecord·${progress.streak}clears" in streak, "new multi-clear records must expose result feedback")
    require("note.setattribute('role','status')" in streak and "note.setattribute('aria-live','polite')" in streak and "note.setattribute('aria-atomic','true')" in streak, "streak record feedback must remain accessible and atomic")
    require("clearstreak·${streak}" in streak and "beststreak·${best}" in streak, "menu must surface current and best streak progression")

if errors:
    print("CLEAR STREAK PROGRESSION QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("CLEAR STREAK PROGRESSION QUALITY GATE: PASSED")
print("current_streak=yes best_streak=yes loss_reset=yes record_feedback=yes accessible=yes")
