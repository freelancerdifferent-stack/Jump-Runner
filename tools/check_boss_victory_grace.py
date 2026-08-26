from pathlib import Path
import sys

BOSS = Path("app/src/main/assets/boss.js")
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(BOSS.is_file(), "boss.js is missing")
if BOSS.is_file():
    flat = "".join(BOSS.read_text(encoding="utf-8").lower().split())
    require("constboss_victory_grace=1.4" in flat, "Sentinel victory grace duration must remain explicit")
    require("bossshots=[]" in flat, "boss projectiles must be cleared on defeat")
    require("player.inv=math.max(player.inv,boss_victory_grace)" in flat, "defeating the Sentinel must grant a short safe finish handoff")
    require("if(boss.hp<=0)" in flat and "boss.dead=true" in flat, "victory grace must stay tied to real Sentinel defeat")

if errors:
    print("BOSS VICTORY GRACE QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("BOSS VICTORY GRACE QUALITY GATE: PASSED")
print("projectiles_cleared=yes finish_handoff_grace=yes defeat_only=yes")
