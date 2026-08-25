from pathlib import Path
import sys

ASSETS = Path("app/src/main/assets")
BOSS_HIT = ASSETS / "boss-health-feedback.js"
BOSS_PHASE = ASSETS / "boss-phase-feedback.js"
BOSS_INTRO = ASSETS / "boss-intro-feedback.js"
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

def flat(path):
    return "".join(path.read_text(encoding="utf-8").lower().split()) if path.is_file() else ""

require(BOSS_HIT.is_file(), "boss-health-feedback.js is missing")
require(BOSS_PHASE.is_file(), "boss-phase-feedback.js is missing")
require(BOSS_INTRO.is_file(), "boss-intro-feedback.js is missing")

hit = flat(BOSS_HIT)
phase = flat(BOSS_PHASE)
intro = flat(BOSS_INTRO)

if hit:
    require("status.setattribute('role','status')" in hit, "boss core-hit feedback must expose role=status")
    require("status.setattribute('aria-live','polite')" in hit, "boss core-hit feedback must use polite live announcements")
    require("status.setattribute('aria-atomic','true')" in hit, "boss core-hit feedback must be atomic")
    require("'sentinelcorehit.'+boss.hp+'of'+boss.maxhp+'integrityremaining.'" in hit, "boss core-hit announcement must report remaining integrity")
    require("cleartimeout(announcetimer)" in hit and "settimeout" in hit, "boss core-hit announcements must retrigger cleanly")
    require("boss.hp<previous&&!boss.dead" in hit, "boss core-hit announcements must only fire on real damage")
    require("!previousdead&&boss.dead" in hit, "Sentinel defeat announcement must only fire on the alive-to-defeated transition")
    require("'skysentineldefeated.finishlineunlocked.'" in hit, "Sentinel defeat must announce that the finish line is unlocked")
    require("previousdead=boss.dead" in hit, "Sentinel defeat transition state must be latched after refresh")
    require("previousdead=false" in hit, "Sentinel defeat transition state must reset for a new encounter")

if phase:
    require("toast.setattribute('role','status')" in phase, "boss phase feedback must expose role=status")
    require("toast.setattribute('aria-live','polite')" in phase, "boss phase feedback must use polite live announcements")
    require("toast.setattribute('aria-atomic','true')" in phase, "boss phase feedback must be atomic")
    require("sentineloverdrive" in phase and "sentinelcoreexposed" in phase, "boss phase escalation announcements must remain present")

if intro:
    require("status.setattribute('role','status')" in intro, "boss encounter feedback must expose role=status")
    require("status.setattribute('aria-live','polite')" in intro, "boss encounter feedback must use polite live announcements")
    require("status.setattribute('aria-atomic','true')" in intro, "boss encounter feedback must be atomic")
    require("!previousactive&&boss.active&&!boss.dead" in intro, "boss encounter announcement must only fire when the Sentinel becomes active")
    require("'skysentinelengaged.dashorstomptobreakitscore.'" in intro, "boss encounter announcement must explain the core-break action")
    require("previousactive=boss.active" in intro, "boss encounter active state must be latched after refresh")
    require("previousactive=false" in intro, "boss encounter active state must reset for a new encounter")

if errors:
    print("BOSS ACCESSIBILITY QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("BOSS ACCESSIBILITY QUALITY GATE: PASSED")
print("boss_core_hit_status=yes boss_phase_status=yes boss_intro_status=yes boss_defeat_status=yes atomic=yes polite=yes integrity_remaining=yes")
