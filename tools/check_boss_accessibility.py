from pathlib import Path
import sys

ASSETS = Path("app/src/main/assets")
BOSS_GAME = ASSETS / "boss.js"
BOSS_HIT = ASSETS / "boss-health-feedback.js"
BOSS_PHASE = ASSETS / "boss-phase-feedback.js"
BOSS_INTRO = ASSETS / "boss-intro-feedback.js"
BOSS_WINDOW = ASSETS / "boss-core-window-feedback.js"
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

def flat(path):
    return "".join(path.read_text(encoding="utf-8").lower().split()) if path.is_file() else ""

require(BOSS_GAME.is_file(), "boss.js is missing")
require(BOSS_HIT.is_file(), "boss-health-feedback.js is missing")
require(BOSS_PHASE.is_file(), "boss-phase-feedback.js is missing")
require(BOSS_INTRO.is_file(), "boss-intro-feedback.js is missing")
require(BOSS_WINDOW.is_file(), "boss-core-window-feedback.js is missing")

game = flat(BOSS_GAME)
hit = flat(BOSS_HIT)
phase = flat(BOSS_PHASE)
intro = flat(BOSS_INTRO)
window = flat(BOSS_WINDOW)

if game:
    require("constboss_arena_limit=7680" in game, "Sentinel arena must cap auto-run before the locked finish")
    require("player.x=math.min(player.x,boss_arena_limit)" in game, "auto-runner must stay inside the Sentinel arena until victory")
    require("constlead=105+approach*185" in game and "boss.x=player.x+lead" in game, "Sentinel must cycle through reachable attack passes")
    require("boss.x=math.max(player.x+235,7040)" not in game, "Sentinel must never preserve an impossible fixed lead ahead of the auto-runner")
    require("boss.coreopen=boss.intro<=0&&boss.hitcd<=0&&lead<150" in game, "Sentinel core must open during a reachable close pass")
    require("dashstrike=boss.coreopen&&player.dash>0&&dx<155&&dy<135" in game, "Dash must have an explicit reachable Sentinel strike window")
    require("stompstrike=boss.coreopen&&player.vy>120&&dx<120&&dy<120" in game, "Stomp must have an explicit reachable Sentinel strike window")
    require("coreopen·dashnow" in game, "Sentinel must visibly tell the player when Dash can connect")

if window:
    require("windowmissed" in window and "nextpass" in window, "missed Sentinel core windows must teach the player to wait for the next pass")
    require("!open&&wasopen&&state==='play'&&boss.active&&!boss.dead&&boss.hp===hpatopen" in window, "missed-window feedback must only fire when no damage was dealt")
    require("missedtimer=.62" in window, "missed-window acknowledgement must remain brief and non-blocking")
    require("cue.setattribute('role','status')" in window and "cue.setattribute('aria-live','polite')" in window and "cue.setattribute('aria-atomic','true')" in window, "core-window teaching feedback must remain accessible")

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
print("boss_reachable_arena=yes two_button_kill_path=yes missed_window_teaching=yes boss_core_hit_status=yes boss_phase_status=yes boss_intro_status=yes boss_defeat_status=yes atomic=yes polite=yes integrity_remaining=yes")
