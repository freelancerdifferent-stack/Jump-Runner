from pathlib import Path
import sys

BOSS = Path("app/src/main/assets/boss.js")
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(BOSS.is_file(), "boss.js is missing")
if BOSS.is_file():
    source = BOSS.read_text(encoding="utf-8")
    flat = "".join(source.lower().split())
    require("constboss_hit_grace=.42" in flat, "Sentinel hit grace duration must remain explicit")
    require("constboss_hit_recoil=96" in flat, "Sentinel hit recoil distance must remain explicit")
    require("boss.recoil=boss_hit_recoil" in flat, "successful Sentinel hits must trigger recoil")
    require("player.inv=math.max(player.inv,boss_hit_grace)" in flat, "successful Sentinel hits must grant brief contact grace")
    require("boss.recoil=math.max(0,boss.recoil-dt*220)" in flat, "Sentinel recoil must decay deterministically")
    require("constbaselead=105+approach*185" in flat and "constlead=baselead+boss.recoil" in flat, "recoil must push the Sentinel away without changing pass timing")
    require("if(baselead>=165)boss.passspent=false" in flat, "recoil must not prematurely reset the one-hit-per-pass latch")
    require("baselead<150&&boss.recoil<=0" in flat, "the core must stay closed during post-hit recoil")

if errors:
    print("BOSS HIT RECOVERY QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("BOSS HIT RECOVERY QUALITY GATE: PASSED")
print("hit_grace=yes recoil=yes deterministic_decay=yes pass_latch_preserved=yes core_closed_during_recoil=yes")
