from pathlib import Path
import sys

PATH = Path('app/src/main/assets/finish-approach-feedback.js')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(PATH.is_file(), 'finish-approach-feedback.js is missing')
if PATH.is_file():
    flat = ''.join(PATH.read_text(encoding='utf-8').lower().split())
    require("functionsentinelresolved(){returntypeofboss==='undefined'||boss.dead;}" in flat,
            'finish approach cue must wait until the Sentinel is resolved')
    require("state!=='play'||announced||!sentinelresolved()" in flat,
            'finish approach cue must suppress itself during the boss encounter')
    require('player.x/level_end' in flat and 'pct>=.88' in flat,
            'finish approach cue must retain the final-stretch distance threshold')
    require("setattribute('role','status')" in flat and "setattribute('aria-live','polite')" in flat and "setattribute('aria-atomic','true')" in flat,
            'finish approach cue must expose an atomic polite status announcement')
    require("setattribute('aria-hidden','true')" in flat and "setattribute('aria-hidden','false')" in flat and 'functionhidecue()' in flat,
            'finish approach cue assistive visibility must follow its visual lifecycle')
    require('prefers-reduced-motion:reduce' in flat and 'finishapproachreduced' in flat,
            'finish approach cue must avoid transform motion for reduced-motion users')
    require("addeventlistener('jumprunnerpause'" in flat and 'pendingafterpause=true' in flat and "addeventlistener('jumprunnerresume'" in flat,
            'finish approach cue must preserve a visible cue across app pause/resume')
    require("pendingafterpause&&state==='play'" in flat and 'pendingafterpause=false;showcue();' in flat,
            'finish approach cue must replay only after gameplay resumes')
    require("announced=false" in flat and "pendingafterpause=false" in flat and "cleartimeout(hidetimer)" in flat and "hidecue();reset();" in flat,
            'finish approach cue must reset cleanly for a new run')

if errors:
    print('FINISH APPROACH AFTER BOSS GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('FINISH APPROACH AFTER BOSS GATE: PASSED')
print('boss_resolved_gate=yes final_stretch_threshold=yes accessible_status=yes assistive_visibility=yes reduced_motion=yes pause_resume_preserved=yes reset=yes')
