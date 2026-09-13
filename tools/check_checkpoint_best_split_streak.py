from pathlib import Path
import sys

PACE = Path("app/src/main/assets/checkpoint-pace-chip.js")
RECAP = Path("app/src/main/assets/run-split-recap.js")
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(PACE.is_file(), "checkpoint-pace-chip.js is missing")
require(RECAP.is_file(), "run-split-recap.js is missing")
if PACE.is_file():
    flat = "".join(PACE.read_text(encoding="utf-8").lower().split())
    require("beststreak=isbest?beststreak+1:0" in flat, "best split streak must advance only on consecutive best splits")
    require("beststreakactive=isbest&&beststreak>=2" in flat, "best split streak celebration must begin at two consecutive best splits")
    require("`bestsplit×${beststreak}`" in flat, "consecutive best split count must be visible in the pace chip")
    require("classlist.add('streak')" in flat and "classlist.remove('streak')" in flat, "best split streak visual cue must be one-shot and cleared")
    require("@keyframespace-streak" in flat, "best split streak visual acknowledgement is missing")
    require(".checkpoint-pace-chip.recovered,.checkpoint-pace-chip.slipped,.checkpoint-pace-chip.streak,.checkpoint-pace-chip.streak-ended{animation:none}" in flat, "best split streak animations must respect reduced motion")
    require("bestsplitsinarow" in flat, "best split streak must remain explicit for assistive technology")
    require("beststreak=0" in flat and "cleartransitioncue()" in flat, "best split streak state must reset cleanly between runs")
    require("endedbeststreak=!isbest&&beststreak>=2?beststreak:0" in flat, "a streak break must snapshot the completed consecutive-best count before reset")
    require("streakended=endedbeststreak>=2" in flat, "streak break feedback must only trigger after a meaningful two-plus best streak")
    require("beststreakended×${endedbeststreak}" in flat, "streak break count must be visible in the pace chip")
    require("classlist.add('streak-ended')" in flat and "classlist.remove('streak-ended')" in flat, "streak break visual cue must be one-shot and cleared")
    require("@keyframespace-streak-ended" in flat, "streak break visual acknowledgement is missing")
    require("bestsplitstreakendedafter${endedbeststreak}consecutivebestsplits" in flat, "streak break must remain explicit for assistive technology")

if RECAP.is_file():
    recap = "".join(RECAP.read_text(encoding="utf-8").lower().split())
    require("functionlongestbestsplitstreak(rows)" in recap, "result recap must compute the longest consecutive best-split streak")
    require("if(split.isbest){current++;longest=math.max(longest,current);}elsecurrent=0;" in recap, "result streak summary must reset at non-best checkpoints")
    require("beststreak>=2" in recap, "result streak summary must stay restrained until two consecutive best splits")
    require("beststreak×${beststreak}" in recap, "result recap must show the best-split streak count")
    require("checkpointsplitrecap.bestsplitstreak${beststreak}." in recap, "result streak summary must be represented in the recap accessible name")
    require("badge.setattribute('aria-hidden','true')" in recap, "visual result streak badge must avoid duplicate assistive announcements")

if errors:
    print("CHECKPOINT BEST SPLIT STREAK QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("CHECKPOINT BEST SPLIT STREAK QUALITY GATE: PASSED")
print("consecutive_best_tracking=yes visible_count=yes streak_break_feedback=yes result_summary=yes one_shot_visual=yes reduced_motion=yes accessible_text=yes reset_safe=yes")
