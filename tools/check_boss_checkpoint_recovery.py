from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
HTML = ASSETS / 'index.html'
RECOVERY = ASSETS / 'boss-checkpoint-recovery.js'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

def flat(path):
    return ''.join(path.read_text(encoding='utf-8').lower().split()) if path.is_file() else ''

require(HTML.is_file(), 'index.html is missing')
require(RECOVERY.is_file(), 'boss-checkpoint-recovery.js is missing')
html = flat(HTML)
recovery = flat(RECOVERY)

if html:
    require('<scriptsrc="boss.js"></script><scriptsrc="boss-checkpoint-recovery.js"></script>' in html,
            'Sentinel checkpoint recovery guard must load immediately after boss.js')
if recovery:
    require("constoriginalrestore=window.restorecheckpoint" in recovery,
            'checkpoint recovery must wrap the existing restore path')
    require("typeofwindow.resetboss!=='function'" in recovery,
            'checkpoint recovery must require the boss reset contract')
    require('boss.active||boss.dead||boss.hp!==boss.maxhp' in recovery,
            'dirty Sentinel encounters must be detected before recovery')
    require('bossshots.length>0' in recovery,
            'live Sentinel projectiles must mark the encounter dirty')
    require('window.resetboss();' in recovery,
            'dirty Sentinel state must reset before checkpoint restoration')
    require('originalrestore();' in recovery,
            'normal checkpoint restoration must still run after boss cleanup')
    require("jumprunnercheckpointrestore" in recovery and 'sentinelreset:encounterdirty' in recovery,
            'checkpoint recovery must expose whether Sentinel cleanup occurred')

if errors:
    print('BOSS CHECKPOINT RECOVERY QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('BOSS CHECKPOINT RECOVERY QUALITY GATE: PASSED')
print('sentinel_checkpoint_reset=yes projectiles_cleared=yes boss_hp_reset=yes normal_checkpoint_restore=yes')
