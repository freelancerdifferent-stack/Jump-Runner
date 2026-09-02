from pathlib import Path
import sys

TARGET = Path("app/src/main/assets/near-miss-feedback.js")
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(TARGET.is_file(), "near-miss-feedback.js is missing")
if TARGET.is_file():
    src = "".join(TARGET.read_text(encoding="utf-8").lower().split())
    require("setattribute('role','status')" in src, "near-miss feedback must expose role=status")
    require("setattribute('aria-live','polite')" in src, "near-miss feedback must use polite live announcements")
    require("setattribute('aria-atomic','true')" in src, "near-miss feedback must announce each message atomically")
    require("@media(prefers-reduced-motion:reduce)" in src, "near-miss feedback must respect reduced-motion preference")
    require("transition:opacity.14sease" in src, "reduced-motion mode must retain only the restrained opacity transition")
    require(".near-miss-toast.show{transform:translate(-50%,0)}" in src, "reduced-motion mode must remove toast slide/scale motion")

if errors:
    print("NEAR-MISS REDUCED-MOTION QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("NEAR-MISS REDUCED-MOTION QUALITY GATE: PASSED")
print("status_role=yes polite=yes atomic=yes reduced_motion=yes transform_motion_removed=yes")
