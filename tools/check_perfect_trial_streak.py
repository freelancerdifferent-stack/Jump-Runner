from pathlib import Path
import sys

ASSETS=Path('app/src/main/assets')
HTML=ASSETS/'index.html'
STREAK=ASSETS/'perfect-trial-streak.js'
errors=[]

def require(condition,message):
    if not condition: errors.append(message)

def flat(text):
    return ''.join(text.lower().split())

require(STREAK.is_file(),'perfect-trial-streak.js is missing')
require(HTML.is_file(),'index.html is missing')

if STREAK.is_file():
    src=flat(STREAK.read_text(encoding='utf-8'))
    require("jr_perfect_trial_streak" in src,'current perfect streak must persist locally')
    require("jr_perfect_trial_best_streak" in src,'best perfect streak must persist locally')
    require("boolean(win)&&health===maxhealth&&crystals===totalcrystals&&defeated.size===drones.length&&time<34" in src,'perfect streak must use the established perfect-trial contract')
    require("letcurrent=perfect?storedperfectstreak()+1:0" in src,'non-perfect results must reset the current perfect streak')
    require("constbest=math.max(previousbest,current)" in src,'best perfect streak must never regress')
    require("current<2" in src,'result celebration must stay restrained until a multi-clear streak exists')
    require("newstreakrecord" in src,'new perfect streak records must be acknowledged')
    require("setattribute('role','status')" in src and "setattribute('aria-live','polite')" in src and "setattribute('aria-atomic','true')" in src,'perfect streak result feedback must be accessible and atomic')
    require("data-perfect-streak" in src or "dataset.perfectstreak" in src,'menu streak state must expose a stable marker')

if HTML.is_file():
    html=HTML.read_text(encoding='utf-8')
    require('perfect-trial-progress.js' in html and 'perfect-trial-streak.js' in html,'perfect trial progression scripts must be packaged')
    require(html.find('perfect-trial-progress.js') < html.find('perfect-trial-streak.js'),'perfect trial streak must load after perfect trial counting')

if errors:
    print('PERFECT TRIAL STREAK QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1): print(f'{i}. {error}')
    sys.exit(1)
print('PERFECT TRIAL STREAK QUALITY GATE: PASSED')
print('current_streak=yes best_streak=yes reset_on_miss=yes perfect_contract=yes restrained_feedback=yes accessible=yes')
