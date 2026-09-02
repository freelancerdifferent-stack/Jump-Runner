from pathlib import Path
import sys

PATH = Path("app/src/main/assets/boss-core-window-feedback.js")
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(PATH.is_file(), "boss-core-window-feedback.js is missing")
if PATH.is_file():
    flat = "".join(PATH.read_text(encoding="utf-8").lower().split())
    require("cue.setattribute('role','status')" in flat, "core cue must expose role=status")
    require("cue.setattribute('aria-live','polite')" in flat, "core cue must use polite live announcements")
    require("cue.setattribute('aria-atomic','true')" in flat, "core cue announcements must be atomic")
    require("cue.setattribute('aria-hidden','true')" in flat, "core cue must start hidden from assistive technology")
    require("cue.setattribute('aria-hidden',string(!visible))" in flat, "core cue assistive visibility must track visual visibility")
    require("@media(prefers-reduced-motion:reduce)" in flat, "core cue must respect reduced motion")
    require("transition:opacity.12sease,border-color.14sease" in flat, "reduced-motion cue must remove transform animation")
    require(".boss-core-window-cue.show{transform:translate(-50%,0)}" in flat, "reduced-motion visible state must remain position-stable")
    require("cue.setattribute('aria-hidden','true');renderopen()" in flat, "reset must clear stale assistive status")

if errors:
    print("BOSS CORE CUE ACCESSIBILITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("BOSS CORE CUE ACCESSIBILITY GATE: PASSED")
print("live_status=yes hidden_when_inactive=yes reduced_motion=yes transform_motion_removed=yes")
