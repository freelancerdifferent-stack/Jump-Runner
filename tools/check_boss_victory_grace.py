from pathlib import Path
import re
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
    require("constboss_victory_grace=1.4" in flat, "Sentinel victory grace duration must remain explicit")
    require("bossshots=[]" in flat, "boss projectiles must be cleared on defeat")
    require("player.inv=math.max(player.inv,boss_victory_grace)" in flat, "defeating the Sentinel must grant a short safe finish handoff")
    require("if(boss.hp<=0)" in flat and "boss.dead=true" in flat, "victory grace must stay tied to real Sentinel defeat")

    # Verify the grace is structurally inside the lethal HP branch rather than merely
    # existing somewhere else in boss.js. This prevents a future refactor from silently
    # granting permanent encounter invulnerability while still satisfying token checks.
    defeat_block = re.search(
        r"if\s*\(boss\.hp\s*<=\s*0\)\s*\{(?P<body>.*?)\}\s*\}",
        source,
        re.S,
    )
    require(defeat_block is not None, "Sentinel defeat branch must remain detectable")
    if defeat_block:
        body = "".join(defeat_block.group("body").lower().split())
        require("boss.dead=true" in body, "Sentinel defeat branch must mark the boss dead")
        require("boss.active=false" in body, "Sentinel defeat branch must end the encounter")
        require("bossshots=[]" in body, "Sentinel defeat branch must clear live projectiles")
        require(
            "player.inv=math.max(player.inv,boss_victory_grace)" in body,
            "victory grace must be granted inside the lethal HP branch only",
        )

if errors:
    print("BOSS VICTORY GRACE QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("BOSS VICTORY GRACE QUALITY GATE: PASSED")
print("projectiles_cleared=yes finish_handoff_grace=yes defeat_only=yes structural_scope=yes")
