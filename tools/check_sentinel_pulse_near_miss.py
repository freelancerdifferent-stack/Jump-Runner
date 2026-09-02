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
    require("typeofbossshots!=='undefined'" in src and "array.isarray(bossshots)" in src, "Sentinel projectiles must participate in near-miss detection")
    require("shot.life<=0" in src, "expired Sentinel projectiles must not create false near misses")
    require("'pulse'" in src and "'pulsedodged'" in src, "Sentinel pulse escapes must expose distinct restrained feedback")
    require("state==='play'&&cooldown===0" in src, "near-miss celebration must only fire during active gameplay with cooldown protection")
    require("toast.textcontent='closecall'" in src, "near-miss feedback must reset to the baseline label between runs")

if errors:
    print("SENTINEL PULSE NEAR-MISS QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("SENTINEL PULSE NEAR-MISS QUALITY GATE: PASSED")
print("boss_projectiles=yes expired_guard=yes distinct_feedback=yes cooldown=yes reset=yes")
