from pathlib import Path
import sys

ASSETS = Path("app/src/main/assets")
HTML = ASSETS / "index.html"
CUE = ASSETS / "auto-run-control-clarity.js"
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HTML.is_file(), "index.html is missing")
require(CUE.is_file(), "auto-run-control-clarity.js is missing")

html = HTML.read_text(encoding="utf-8").lower() if HTML.is_file() else ""
cue = "".join(CUE.read_text(encoding="utf-8").lower().split()) if CUE.is_file() else ""

if html:
    require('<script src="auto-run-control-clarity.js"></script>' in html, "auto-run control cue must be packaged")
    require('<script src="start-countdown.js"></script>' in html, "start countdown must be packaged")
    require('<script src="resume-countdown.js"></script>' in html, "resume countdown must be packaged")

if cue:
    require("addeventlistener('jumprunnercountdowncomplete',show)" in cue, "initial control cue must wait for the start countdown to finish")
    require("addeventlistener('jumprunnerresumeready',show)" in cue, "resume control cue must wait for the resume countdown to finish")
    require("addeventlistener('jumprunnerpause',hide)" in cue, "pausing must immediately hide stale control guidance")
    require("addeventlistener('jumprunnerresult',reset)" in cue, "result transitions must reset one-shot control guidance")
    require("state!=='play'" in cue, "control cue must refuse to show outside live gameplay")
    require("setattribute('aria-hidden','true')" in cue and "setattribute('aria-hidden','false')" in cue, "control cue accessibility visibility must track visual visibility")
    require("addeventlistener('jumprunnerresume'" not in cue, "control cue must not fire before resume controls are released")
    require("settimeout(show,180)" not in cue, "control cue must not fire during the initial READY countdown")

if errors:
    print("AUTO-RUN CONTROL CUE TIMING QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("AUTO-RUN CONTROL CUE TIMING QUALITY GATE: PASSED")
print("start_ready=yes resume_ready=yes pause_hide=yes result_reset=yes accessible_visibility=yes")
