from pathlib import Path
import sys

ASSETS = Path("app/src/main/assets")
PACE = ASSETS / "run-pace-milestones.js"
AUDIO = ASSETS / "audio.js"
errors = []


def require(condition, message):
    if not condition:
        errors.append(message)


def flat(path):
    return "".join(path.read_text(encoding="utf-8").lower().split()) if path.is_file() else ""


require(PACE.is_file(), "run-pace-milestones.js is missing")
require(AUDIO.is_file(), "audio.js is missing")

pace = flat(PACE)
audio = flat(AUDIO)

if pace:
    require("newcustomevent('jumprunnerpacemilestone'" in pace, "pace milestones must dispatch the shared gameplay event")
    require("speed:tier.speed" in pace and "max:tier.speed===455" in pace, "pace event must expose the reached speed and max-pace state")
    require("announced.add(tier.speed)" in pace, "pace milestones must stay one-shot per run")

if audio:
    require("functionsfxpacemilestone(maxpace)" in audio, "pace milestone SFX function is missing")
    require("addeventlistener('jumprunnerpacemilestone'" in audio, "audio layer must subscribe to the pace milestone event")
    require("boolean(e.detail&&e.detail.max)" in audio, "max-pace audio treatment must be derived from the event detail")
    require("if(maxpace){chord([659,784,988]" in audio, "max pace must use the restrained distinct completion chord")
    require("else{tone(610" in audio, "intermediate pace milestones must use the restrained single cue")
    require("functionhaptic(pattern){if(!jrhapticsenabled" in audio, "pace haptics must continue honoring the global haptics preference")
    require("functionensureaudio(){if(!jraudioenabled)returnnull" in audio, "pace audio must continue honoring the global sound preference")

if errors:
    print("RUN PACE AUDIO QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("RUN PACE AUDIO QUALITY GATE: PASSED")
print("pace_event=yes one_shot=yes tiered_audio=yes haptics=yes preferences_respected=yes")
