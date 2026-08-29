from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
HTML = ASSETS / 'index.html'
SCRIPT = ASSETS / 'clean-sweep-progress.js'
errors=[]

def require(condition,message):
    if not condition:
        errors.append(message)

require(SCRIPT.is_file(),'clean-sweep-progress.js is missing')
require(HTML.is_file(),'index.html is missing')
script=''.join(SCRIPT.read_text(encoding='utf-8').lower().split()) if SCRIPT.is_file() else ''
html=HTML.read_text(encoding='utf-8').lower() if HTML.is_file() else ''
require('clean-sweep-progress.js' in html,'clean sweep progression must be loaded')
require("constclean_sweep_storage_key='jr_clean_sweep_clears'" in script,'clean sweep persistence key is missing')
require('boolean(win)&&crystals===totalcrystals&&defeated.size===drones.length' in script,'clean sweep must require a win, every crystal, and every patrol drone')
require('localstorage.setitem(clean_sweep_storage_key,string(total))' in script,'clean sweep total must persist locally')
require('data-clean-sweeps' in script,'menu must surface earned clean sweeps')
require('allcrystals·alldrones' in script,'menu mastery label must explain clean sweep requirements')
require("note.setattribute('role','status')" in script,'clean sweep result must expose role=status')
require("note.setattribute('aria-live','polite')" in script,'clean sweep result must use polite announcements')
require("note.setattribute('aria-atomic','true')" in script,'clean sweep result announcement must be atomic')
require('basecleansweepshowresult(win)' in script,'clean sweep wrapper must preserve existing result behavior')
if errors:
    print('CLEAN SWEEP PROGRESSION QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1): print(f'{i}. {error}')
    sys.exit(1)
print('CLEAN SWEEP PROGRESSION QUALITY GATE: PASSED')
print('win_required=yes all_crystals=yes all_drones=yes persistence=yes menu_badge=yes accessible_result=yes')
