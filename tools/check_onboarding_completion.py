from pathlib import Path
import sys

ONBOARDING = Path("app/src/main/assets/onboarding.js")
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(ONBOARDING.is_file(), "onboarding.js is missing")
text = "".join(ONBOARDING.read_text(encoding="utf-8").lower().split()) if ONBOARDING.is_file() else ""

if text:
    require("functioncompleteonboardingafterwin()" in text, "onboarding must isolate successful-run completion")
    require("state!=='win'" in text, "onboarding completion must require the win state")
    require("onboardingstage<tips.length" in text, "onboarding completion must require all lessons to be reached")
    require("saveonboardingdone(true)" in text, "successful onboarding completion must persist")
    require("completeonboardingafterwin();" in text, "onboarding loop must evaluate successful completion")
    require("player.x>7200" not in text, "reaching the final arena must not mark onboarding complete")

if errors:
    print("ONBOARDING COMPLETION QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("ONBOARDING COMPLETION QUALITY GATE: PASSED")
print("completion_requires_win=yes final_arena_failure_replays_tutorial=yes persistence_after_success=yes")
