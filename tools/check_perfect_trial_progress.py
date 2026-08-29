from pathlib import Path
import sys

ASSETS=Path('app/src/main/assets')
SCRIPT=ASSETS/'perfect-trial-progress.js'
INDEX=ASSETS/'index.html'
errors=[]

def require(condition,message):
    if not condition:
        errors.append(message)

def flat(path):
    return ''.join(path.read_text(encoding='utf-8').lower().split()) if path.is_file() else ''

require(SCRIPT.is_file(),'perfect-trial-progress.js is missing')
require(INDEX.is_file(),'index.html is missing')
script=flat(SCRIPT)
index=flat(INDEX)

if script:
    require("jr_perfect_trial_clears" in script,'perfect trial storage key must remain stable')
    require("health===maxhealth" in script,'perfect trial must require flawless integrity')
    require("crystals===totalcrystals" in script,'perfect trial must require every crystal')
    require("defeated.size===drones.length" in script,'perfect trial must require every patrol drone')
    require("time<34" in script,'perfect trial must preserve S-rank pace requirement')
    require("boolean(win)" in script,'perfect trial must only record successful clears')
    require("localstorage.setitem(perfect_trial_storage_key,string(total))" in script,'perfect trial total must persist locally')
    require("data-perfect-trials" in script or "dataset.perfecttrials" in script,'menu must expose persisted perfect trial mastery')
    require("srank·flawless·cleansweep" in script,'menu must explain the perfect trial requirements')
    require("role','status'" in script and "aria-live','polite'" in script and "aria-atomic','true'" in script,'perfect trial result feedback must remain accessible')
    require("perfecttrial·srank·${time.tofixed(1)}s" in script,'result feedback must celebrate perfect trial pace')
if index:
    require('<scriptsrc="perfect-trial-progress.js"></script>' in index,'perfect trial progression must be loaded by index.html')
    require(index.index('clean-sweep-progress.js') < index.index('perfect-trial-progress.js'),'perfect trial progression must wrap the existing clean-sweep result layer')

if errors:
    print('PERFECT TRIAL QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1):
        print(f'{i}. {error}')
    sys.exit(1)
print('PERFECT TRIAL QUALITY GATE: PASSED')
print('perfect_trial=yes offline_persistence=yes flawless=yes clean_sweep=yes s_rank_pace=yes accessible=yes')
