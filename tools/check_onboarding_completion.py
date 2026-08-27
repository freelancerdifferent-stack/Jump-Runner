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
    require("letreplaytutorial=false" in text, "tutorial replay must use temporary session state")
    require("functiontutorialactive(){return!onboardingdone||replaytutorial;}" in text, "tutorial tips must activate for first run or temporary replay")
    require("onboardingdone||replaytutorial||onboardingstage<tips.length||state!=='win'" in text, "replay runs must not rewrite first-run completion")
    require("replay.onclick=()=>{replaytutorial=true" in text, "replay control must start temporary tutorial mode")
    require("replay.onclick=()=>{onboardingdone=false" not in text, "replay control must not clear completed onboarding state")
    require("saveonboardingdone(false)" not in text, "tutorial replay must never erase persisted completion")
    require("constaction_tip_repeat_ms=6200" in text, "unfinished action lessons must use a restrained repeat cadence")
    require("tiprepeatat=repeatable?performance.now()+action_tip_repeat_ms:0" in text, "only repeatable action prompts may schedule another reminder")
    require("current.action&&shownstage===onboardingstage&&!complete" in text, "action reminders must stop immediately after the lesson is completed")
    require("performance.now()>=tiprepeatat" in text, "action reminders must wait for their repeat deadline")
    require("showtip(current.text,true)" in text, "unfinished action lessons must be able to re-show their coaching prompt")
    require("if(complete){onboardingstage++;shownstage=-1;tiprepeatat=0;}" in text, "completed lessons must clear the reminder latch")

if errors:
    print("ONBOARDING COMPLETION QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("ONBOARDING COMPLETION QUALITY GATE: PASSED")
print("completion_requires_win=yes final_arena_failure_replays_tutorial=yes persistence_after_success=yes replay_preserves_completion=yes action_prompt_repeat=yes action_prompt_stops_on_success=yes")
