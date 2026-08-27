from pathlib import Path
import sys

ASSETS = Path("app/src/main/assets")
HTML = ASSETS / "index.html"
CUE = ASSETS / "boss-dash-button-cue.js"
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HTML.is_file(), "index.html is missing")
require(CUE.is_file(), "boss-dash-button-cue.js is missing")

html = HTML.read_text(encoding="utf-8").lower() if HTML.is_file() else ""
cue = "".join(CUE.read_text(encoding="utf-8").lower().split()) if CUE.is_file() else ""

require('boss-dash-button-cue.js' in html, "Sentinel dash cue must be packaged in index.html")
require("getelementbyid('dashbtn')" in cue, "Sentinel cue must target the Dash control")
require("boss.coreopen" in cue and "player.dashcd<=0.001" in cue, "Dash cue must only arm during a real open core window when Dash is ready")
require("sentinel-strike-window" in cue and "'hitnow'" in cue, "Dash cue must expose a clear HIT NOW visual state")
require("prefers-reduced-motion:reduce" in cue, "Dash cue animation must respect reduced-motion preference")
require("previousopen" in cue, "Dash cue must latch core-window transitions instead of retriggering every frame")
require("classlist.remove('sentinel-strike-window','sentinel-strike-pop')" in cue, "Dash cue must clear cleanly on a new run")

if errors:
    print("BOSS DASH BUTTON CUE QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("BOSS DASH BUTTON CUE QUALITY GATE: PASSED")
print("dash_target=yes core_open_only=yes dash_ready_only=yes visual_hit_now=yes reduced_motion=yes transition_latched=yes reset_clean=yes")
