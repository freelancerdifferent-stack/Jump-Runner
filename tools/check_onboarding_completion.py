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
    require("constaction_tip_visible_ms=4200" in text, "action coaching must retain enough dwell time for first-run input guidance")
    require("constpassive_tip_visible_ms=2600" in text, "passive coaching must clear quickly enough to avoid covering later hazards")
    require("tiprepeatat=repeatable?performance.now()+action_tip_repeat_ms:0" in text, "only repeatable action prompts may schedule another reminder")
    require("constvisiblems=repeatable?action_tip_visible_ms:passive_tip_visible_ms" in text, "action and passive coaching must use distinct dwell times")
    require("settimeout(()=>tip.classlist.remove('show'),visiblems)" in text, "coach-tip dismissal must use the selected dwell time")
    require("current.action&&shownstage===onboardingstage&&!complete" in text, "action reminders must stop immediately after the lesson is completed")
    require("performance.now()>=tiprepeatat" in text, "action reminders must wait for their repeat deadline")
    require("showtip(current.text,true)" in text, "unfinished action lessons must be able to re-show their coaching prompt")
    require("if(complete){" in text and "if(current.action)hidetip();" in text and "onboardingstage++;shownstage=-1;tiprepeatat=0;" in text, "completed lessons must dismiss stale action coaching and clear the reminder latch")
    require("autorunactive" in text and "runnermovesforwardonitsown" in text, "first lesson must explain automatic forward movement")
    require("tapjumpforalowhop" in text and "holdalittlelongerforheight" in text, "first lesson must teach variable jump height without adding new controls")
    require("functionskipfirstrunguide()" in text, "first-run onboarding must provide an explicit opt-out path")
    require("skip.textcontent='skipguide'" in text and "skip.onclick=skipfirstrunguide" in text, "first-run menu must expose the guide skip control")
    require("skip.setattribute('aria-label','skipguidedfirstrun')" in text, "guide skip control must have an explicit accessible label")
    require("functionskipfirstrunguide(){if(onboardingdone)return;onboardingdone=true;replaytutorial=false;" in text, "guide skip must only complete an unfinished first-run tutorial")
    require("saveonboardingdone(true);showmenu();" in text, "guide skip must persist completion and rebuild the normal menu")
    require("replay.textcontent='replaytutorial'" in text, "skipped players must retain a discoverable tutorial replay path")
    require("functionguideprogresstext(text){conststep=math.min(onboardingstage+1,tips.length);return'guide'+step+'/'+tips.length+'·'+text;}" in text, "guided coaching must expose the current lesson number and total lesson count")
    require("tip.textcontent=guideprogresstext(text)" in text, "every visible coaching tip must include lesson progress")
    require("functionshowguidecomplete(){if(guidecompleteshown)return;guidecompleteshown=true;" in text, "guided mode must latch its completion acknowledgement")
    require("tip.textcontent='guidecomplete·finishtherun'" in text, "guided mode must visibly acknowledge that all lessons are complete")
    require("if(onboardingstage===tips.length)showguidecomplete();" in text, "the completion cue must fire only after the final lesson advances")
    require("guidecompleteshown=false" in text, "guide completion acknowledgement must reset between guided attempts")
    require("finalarena·" in text and "greencoreopen" in text and "dashorstomptheskysentinel" in text and "action:'boss'" in text, "final arena lesson must remain active until the Sentinel objective is completed")
    require("if(current.action==='boss')returntypeofboss!=='undefined'&&boss.dead;" in text, "final arena lesson must complete only after the Sentinel is defeated")

if errors:
    print("ONBOARDING COMPLETION QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("ONBOARDING COMPLETION QUALITY GATE: PASSED")
print("completion_requires_win=yes final_arena_failure_replays_tutorial=yes persistence_after_success=yes replay_preserves_completion=yes action_prompt_repeat=yes action_prompt_stops_on_success=yes action_prompt_dismisses_immediately=yes passive_prompt_short_dwell=yes autorun_explained=yes variable_jump_explained=yes first_run_skip=yes replay_after_skip=yes lesson_progress=yes lesson_completion_cue=yes final_boss_lesson_requires_defeat=yes")
