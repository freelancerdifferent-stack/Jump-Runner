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
    require("functionvictoryguidanceclear(){constel=document.getelementbyid('bossdefeatfollowthrough');return!el||el.getattribute('aria-hidden')==='true';}" in flat,
            'finish approach cue must wait until Sentinel defeat guidance has cleared')
    require("state!=='play'||announced||!sentinelresolved()||!victoryguidanceclear()" in flat,
            'finish approach cue must suppress itself during the boss encounter and overlapping victory guidance')
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
    require("functionplayarrivalfeedback(){if(typeofchord==='function')chord([659,784],.075,.018,'sine');if(typeofhaptic==='function')haptic(12);}" in flat,
            'finish approach cue must provide restrained optional audio and haptic acknowledgement')
    require('functionshowcue(withfeedback=true)' in flat and 'if(withfeedback)playarrivalfeedback();' in flat,
            'finish approach sensory feedback must fire only through the visible cue path')
    require("addeventlistener('jumprunnerpause'" in flat and 'pendingafterpause=true' in flat and "addeventlistener('jumprunnerresume'" in flat,
            'finish approach cue must preserve a visible cue across app pause/resume')
    require("pendingafterpause&&state==='play'" in flat and 'pendingafterpause=false;showcue(false);' in flat,
            'finish approach cue must replay visually after resume without duplicating audio or haptics')
    require("constprogresstrack=document.queryselector('.progress')" in flat and
            "functionsetprogressemphasis(active){if(progresstrack)progresstrack.classlist.toggle('finish-near',boolean(active));}" in flat,
            'final stretch must expose a persistent progress-track emphasis through a null-safe helper')
    require(".progress.finish-near{" in flat and ".progress.finish-neari{" in flat and '.high-contrast.progress.finish-near' not in flat,
            'final stretch progress emphasis must style the existing track without replacing its structure')
    require('setprogressemphasis(true);' in flat and 'hidetimer=settimeout(()=>{hidetimer=0;hidecue();},760);' in flat,
            'progress emphasis must persist after the brief arrival cue fades')
    require('functionclearcue(){cleartimeout(hidetimer);hidetimer=0;pendingafterpause=false;hidecue();setprogressemphasis(false);}' in flat,
            'finish approach cleanup must centralize timer, replay, assistive, and progress-emphasis cleanup')
    require("addeventlistener('jumprunnerresult',clearcue)" in flat,
            'finish approach cue must clear immediately when a win/death result transition begins')
    require("announced=false;clearcue();reset();" in flat,
            'finish approach cue must reset cleanly for a new run')

if errors:
    print('FINISH APPROACH AFTER BOSS GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('FINISH APPROACH AFTER BOSS GATE: PASSED')
print('boss_resolved_gate=yes victory_guidance_sequence=yes final_stretch_threshold=yes accessible_status=yes assistive_visibility=yes mobile_readability=yes safe_area=yes narrow_screen=yes reduced_motion=yes sensory_ack=yes pause_resume_preserved=yes resume_no_duplicate_sensory=yes persistent_progress_emphasis=yes result_cleanup=yes reset=yes')
