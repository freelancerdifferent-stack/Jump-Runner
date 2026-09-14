from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
HTML = ASSETS / 'index.html'
SCRIPT = ASSETS / 'menu-max-pace-record.js'
errors=[]

def require(condition,message):
    if not condition: errors.append(message)

def flat(path):
    return ''.join(path.read_text(encoding='utf-8').lower().split()) if path.is_file() else ''

require(HTML.is_file(),'index.html is missing')
require(SCRIPT.is_file(),'menu-max-pace-record.js is missing')
if HTML.is_file():
    html=HTML.read_text(encoding='utf-8').lower()
    require('menu-max-pace-record.js' in html,'max-pace record menu polish must be packaged')
if SCRIPT.is_file():
    src=flat(SCRIPT)
    require("conststorage_key='jr_max_pace_best'" in src,'menu max-pace record must use the persistent gameplay record key')
    require('try{constvalue=number(localstorage.getitem(storage_key)||0)' in src and 'catch(_){return0;}' in src,'menu record reads must survive unavailable localStorage')
    require('math.max(0,math.min(99.9,value))' in src,'menu record must clamp malformed or oversized saved values')
    require("state!=='menu'" in src and "panel.queryselector('.menu-max-pace-record')" in src,'menu card must only decorate menu state and replace stale copies')
    require("record.tofixed(1)" in src and "goal.textcontent='beatitthisrun'" in src,'existing max-pace records must expose a one-decimal replay challenge')
    require("value.textcontent='setarecord'" in src and "goal.textcontent='holdmaxpace1.0s+'" in src,'players without a record must receive a clear first target')
    require("setattribute('role','status')" in src and "setattribute('aria-live','polite')" in src and "setattribute('aria-atomic','true')" in src,'menu max-pace challenge must remain accessible')
    require("constbaseshowmenu=window.showmenu" in src and "window.showmenu=function(){baseshowmenu();decoratemenu();}" in src,'menu challenge must survive HOME/menu rebuilds')

if errors:
    print('MENU MAX PACE RECORD QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1): print(f'{i}. {error}')
    sys.exit(1)
print('MENU MAX PACE RECORD QUALITY GATE: PASSED')
print('storage_key=yes safe_read=yes bounded=yes replay_target=yes first_target=yes accessibility=yes menu_rebuild=yes')
