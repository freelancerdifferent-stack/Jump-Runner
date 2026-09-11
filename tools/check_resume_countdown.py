from pathlib import Path
import sys

ASSETS = Path("app/src/main/assets")
HTML = ASSETS / "index.html"
START = ASSETS / "start-countdown.js"
RESUME = ASSETS / "resume-countdown.js"
AUDIO = ASSETS / "audio-feedback.js"
CUE = ASSETS / "auto-run-control-clarity.js"
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HTML.is_file(), "index.html is missing")
require(START.is_file(), "start-countdown.js is missing")
require(RESUME.is_file(), "resume-countdown.js is missing")
require(AUDIO.is_file(), "audio-feedback.js is missing")
require(CUE.is_file(), "auto-run-control-clarity.js is missing")

html = HTML.read_text(encoding="utf-8").lower() if HTML.is_file() else ""
start = "".join(START.read_text(encoding="utf-8").lower().split()) if START.is_file() else ""
resume = "".join(RESUME.read_text(encoding="utf-8").lower().split()) if RESUME.is_file() else ""
audio = "".join(AUDIO.read_text(encoding="utf-8").lower().split()) if AUDIO.is_file() else ""
cue = "".join(CUE.read_text(encoding="utf-8").lower().split()) if CUE.is_file() else ""

if html:
    require('<script src="resume-countdown.js"></script>' in html, "resume countdown must be packaged")
    require('<script src="auto-run-control-clarity.js"></script>' in html, "auto-run control cue must be packaged")
    require('<script src="start-countdown.js"></script>' in html, "start countdown must be packaged")
    require('<script src="audio-feedback.js"></script>' in html, "audio feedback must be packaged")
    require(html.index('pause-feedback.js') < html.index('resume-countdown.js'), "resume countdown must load after pause feedback")

if start:
    require("jumprunnercountdowntick" in start and "source:'start'" in start, "start countdown must emit shared audio tick events")
    require("announcetick('ready')" in start and "announcetick(labels[step])" in start, "start countdown must announce READY through GO")

if resume:
    require("addeventlistener('jumprunnerresume',startresumecountdown)" in resume, "resume event must start the fairness countdown")
    require("paused=true" in resume and "paused=false" in resume, "countdown must freeze and then release gameplay")
    require("state!=='play'" in resume, "countdown must not interrupt menu/results states")
    require("showstep('go')" in resume and "letstep=3" in resume and "showstep(string(step))" in resume, "countdown must visibly run 3-2-1-GO")
    require("setattribute('role','status')" in resume, "countdown must expose role=status")
    require("setattribute('aria-live','assertive')" in resume, "countdown must announce resume timing promptly")
    require("setattribute('aria-atomic','true')" in resume, "countdown announcements must be atomic")
    require("pointer-events:none" in resume, "countdown must never block touch controls")
    require("last=performance.now()" in resume, "frame timing must reset when gameplay is released")
    require("jumprunnerresumeready" in resume, "resume completion event must be exposed for later polish layers")
    require("addeventlistener('jumprunnerpause'" in resume and "clearcountdown()" in resume, "re-pausing must cancel a pending countdown safely")
    require("constbaseinputjump=inputjump" in resume and "constbaseinputdash=inputdash" in resume, "resume layer must preserve the original input handlers")
    require("if(resumeinputlocked)return" in resume, "resume countdown must reject buffered Jump/Dash input while gameplay is frozen")
    require("setcontrolslocked(true)" in resume and "setcontrolslocked(false)" in resume, "resume countdown must visibly lock then restore controls")
    require("classlist.toggle('countdown-locked',locked)" in resume, "resume countdown must reuse the countdown control de-emphasis")
    require("setattribute('aria-disabled',locked?'true':'false')" in resume, "resume control readiness must be exposed accessibly")
    require("addeventlistener('jumprunnerresult',clearcountdown)" in resume, "results must clear any pending resume input lock")
    require("jumprunnercountdowntick" in resume and "source:'resume'" in resume, "resume countdown must emit shared audio tick events")
    require("announcetick(text)" in resume, "every visible resume countdown step must emit one audio tick event")

if audio:
    require("addeventlistener('jumprunnercountdowntick'" in audio, "audio layer must listen for countdown tick events")
    require("functioncountdowntick(label)" in audio, "audio layer must define restrained countdown cues")
    require("value==='ready'" in audio and "value==='go'" in audio, "READY and GO must use distinct audio cues")
    require("step>=1&&step<=3" in audio, "numeric countdown steps must use tick cues")
    require("addeventlistener('jumprunnerresume',ensureaudio" in audio, "audio context should be re-awakened on Android resume")

if cue:
    require("addeventlistener('jumprunnercountdowncomplete',show)" in cue, "initial control cue must wait for start controls to become live")
    require("addeventlistener('jumprunnerresumeready',show)" in cue, "resume control cue must wait for resume controls to become live")
    require("addeventlistener('jumprunnerpause',hide)" in cue, "pausing must hide stale control guidance")
    require("addeventlistener('jumprunnerresult',reset)" in cue, "result transitions must reset one-shot control guidance")
    require("state!=='play'" in cue, "control cue must refuse to show outside live gameplay")
    require("setattribute('aria-hidden','true')" in cue and "setattribute('aria-hidden','false')" in cue, "control cue accessibility visibility must track visual visibility")
    require("addeventlistener('jumprunnerresume'" not in cue, "control cue must not fire before resume controls are released")
    require("settimeout(show,180)" not in cue, "control cue must not fire during the initial READY countdown")

if errors:
    print("RESUME COUNTDOWN QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("RESUME COUNTDOWN QUALITY GATE: PASSED")
print("freeze=yes countdown=3-2-1-go timing_reset=yes nonblocking=yes accessible=yes repause_safe=yes input_buffer_blocked=yes control_readiness=yes cue_after_start_ready=yes cue_after_resume_ready=yes countdown_audio=yes resume_audio_wake=yes")
