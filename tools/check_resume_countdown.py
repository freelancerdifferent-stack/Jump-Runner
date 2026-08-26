from pathlib import Path
import sys

ASSETS = Path("app/src/main/assets")
HTML = ASSETS / "index.html"
RESUME = ASSETS / "resume-countdown.js"
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HTML.is_file(), "index.html is missing")
require(RESUME.is_file(), "resume-countdown.js is missing")

html = HTML.read_text(encoding="utf-8").lower() if HTML.is_file() else ""
resume = "".join(RESUME.read_text(encoding="utf-8").lower().split()) if RESUME.is_file() else ""

if html:
    require('<script src="resume-countdown.js"></script>' in html, "resume countdown must be packaged")
    require(html.index('pause-feedback.js') < html.index('resume-countdown.js'), "resume countdown must load after pause feedback")

if resume:
    require("addeventlistener('jumprunnerresume',startresumecountdown)" in resume, "resume event must start the fairness countdown")
    require("paused=true" in resume and "paused=false" in resume, "countdown must freeze and then release gameplay")
    require("state!=='play'" in resume, "countdown must not interrupt menu/results states")
    require("textcontent='go'" in resume and "letstep=3" in resume, "countdown must visibly run 3-2-1-GO")
    require("setattribute('role','status')" in resume, "countdown must expose role=status")
    require("setattribute('aria-live','assertive')" in resume, "countdown must announce resume timing promptly")
    require("setattribute('aria-atomic','true')" in resume, "countdown announcements must be atomic")
    require("pointer-events:none" in resume, "countdown must never block touch controls")
    require("last=performance.now()" in resume, "frame timing must reset when gameplay is released")
    require("jumprunnerresumeready" in resume, "resume completion event must be exposed for later polish layers")
    require("addeventlistener('jumprunnerpause'" in resume and "clearcountdown()" in resume, "re-pausing must cancel a pending countdown safely")

if errors:
    print("RESUME COUNTDOWN QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("RESUME COUNTDOWN QUALITY GATE: PASSED")
print("freeze=yes countdown=3-2-1-go timing_reset=yes nonblocking=yes accessible=yes repause_safe=yes")
