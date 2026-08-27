from pathlib import Path
import sys

ASSETS=Path('app/src/main/assets')
HTML=ASSETS/'index.html'
JS=ASSETS/'boss-hit-confirmation.js'
errors=[]

def require(condition,message):
    if not condition: errors.append(message)

def flat(text):
    return ''.join(text.lower().split())

require(HTML.is_file(),'index.html is missing')
require(JS.is_file(),'boss-hit-confirmation.js is missing')
if HTML.is_file():
    html=flat(HTML.read_text(encoding='utf-8'))
    require('<scriptsrc="boss-hit-confirmation.js"></script>' in html,'Sentinel hit confirmation must be packaged')
if JS.is_file():
    js=flat(JS.read_text(encoding='utf-8'))
    require("boss.hp<previoushp" in js,'confirmation must only trigger when boss HP decreases')
    require("boss.dead?'coreshattered':'corehit·'+boss.hp+'/'+boss.maxhp" in js,'confirmation must report successful core damage and final shatter')
    require("aria-hidden','true'" in js,'visual-only confirmation must stay hidden from assistive tech to avoid duplicate announcements')
    require('updateboss=function(dt){base(dt);refresh(dt);}' in js,'confirmation must follow boss update without changing combat physics')
    require('timer=.48' in js,'confirmation duration must remain brief')
if errors:
    print('BOSS HIT CONFIRMATION QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1): print(f'{i}. {error}')
    sys.exit(1)
print('BOSS HIT CONFIRMATION QUALITY GATE: PASSED')
print('damage_only=yes final_shatter=yes visual_only=yes brief=yes combat_unchanged=yes')
