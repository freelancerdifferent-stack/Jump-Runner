from pathlib import Path
import sys

ASSETS = Path("app/src/main/assets")
HTML = ASSETS / "index.html"
TARGET = ASSETS / "split-streak-target.js"
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HTML.is_file(), "index.html is missing")
require(TARGET.is_file(), "split-streak-target.js is missing")

if HTML.is_file():
    html = "".join(HTML.read_text(encoding="utf-8").lower().split())
    require('<scriptsrc="split-streak-target.js"></script>' in html, "split streak target polish must be packaged")

if TARGET.is_file():
    flat = "".join(TARGET.read_text(encoding="utf-8").lower().split())
    require("conststorage_key='jr_best_split_streak'" in flat, "target must reuse the persistent split-streak storage key")
    require("target=math.max(2,record+1)" in flat, "target must ask the player to beat the stored record")
    require("streak++" in flat and "!detail.isbest" in flat, "target progress must advance only on consecutive best splits")
    require("streakchallenge" in flat and "streakrecordpace" in flat, "target needs clear normal and record-pace states")
    require("challengecleared" in flat and "justcleared=!challengecleared&&streak>=target" in flat, "target must acknowledge challenge completion exactly once per streak")
    require("label.textcontent=justcleared?'challengecleared'" in flat, "challenge completion needs a clear player-facing label")
    require("checkpointstreakchallengecleared." in flat and "newrecordpaceachieved." in flat, "challenge completion must be announced explicitly")
    require("challengecleared=false" in flat, "challenge completion state must reset on streak loss and new runs")
    require("justcleared?2300:1700" in flat, "challenge-clear acknowledgement should be slightly longer than routine target updates")
    require(".split-streak-target.cleared" in flat, "challenge completion needs a distinct restrained visual state")
    require("jumprunnercheckpointsplit" in flat and "jumprunnerresult" in flat, "target must follow checkpoint events and clear on results")
    require("constbasereset=window.resetrun" in flat, "target state must reset for a new run")
    require("role','status'" in flat and "aria-live','polite'" in flat and "aria-atomic','true'" in flat, "target must remain explicit for assistive technology")
    require("prefers-reduced-motion:reduce" in flat and ".split-streak-target.cleared.pop{animation:none}" in flat, "challenge acknowledgement must respect reduced motion")
    require("settimeout(()=>{chip.hidden=true" in flat, "target must remain a restrained temporary cue")

if errors:
    print("SPLIT STREAK TARGET QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("SPLIT STREAK TARGET QUALITY GATE: PASSED")
print("packaged=yes persistent_target=yes consecutive_tracking=yes challenge_clear=yes record_pace=yes lifecycle_reset=yes accessibility=yes reduced_motion=yes restrained=yes")
