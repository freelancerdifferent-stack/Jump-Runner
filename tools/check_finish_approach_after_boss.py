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
    require('font-size:clamp(10px,1.35vw,13px)' in flat and 'max-width:min(82vw,360px)' in flat,
            'finish approach cue must stay legible without overrunning mobile landscape')
    require('env(safe-area-inset-top,0px)' in flat and 'top:max(15%,' in flat,
            'finish approach cue must avoid top display cutouts and system insets')
    require('@media(max-width:520px)' in flat and 'max-width:88vw' in flat and 'letter-spacing:.14em' in flat,
            'finish approach cue must retain a compact narrow-screen presentation')
    require('border-radius:999px' in flat and 'background:#07101ecc' in flat and 'text-align:center' in flat,
            'finish approach cue must use a high-contrast focused status treatment')
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
print('boss_resolved_gate=yes final_stretch_threshold=yes accessible_status=yes assistive_visibility=yes mobile_readability=yes safe_area=yes narrow_screen=yes reduced_motion=yes pause_resume_preserved=yes reset=yes')
