from pathlib import Path
import sys

ASSET = Path('app/src/main/assets/retry-coaching.js')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(ASSET.is_file(), 'retry-coaching.js is missing')
if ASSET.is_file():
    text = ''.join(ASSET.read_text(encoding='utf-8').lower().split())
    require("action:'jump'" in text, 'retry coaching must expose a JUMP action')
    require("action:'dash'" in text, 'retry coaching must expose a DASH action')
    require("action:'jump/dash'" in text, 'retry coaching must expose combined JUMP / DASH guidance')
    require("action:'dash/stomp'" in text, 'Sentinel retry coaching must expose DASH / STOMP guidance')
    require("className='retry-action'".lower().replace(' ','') in text, 'retry action badge must be rendered separately from the coaching copy')
    require("setattribute('aria-label','nexttry.'+coach.action+'.'+coach.tip)" in text, 'retry action and coaching copy must be announced together')
    require("if(event?.detail?.win)return" in text, 'retry coaching must stay hidden on successful runs')
    require("constreason=event?.detail?.reason||''" in text, 'retry action selection must use the result event failure reason')

if errors:
    print('RETRY ACTION BADGE QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('RETRY ACTION BADGE QUALITY GATE: PASSED')
print('jump=yes dash=yes combined=yes sentinel=yes accessible=yes event_reason=yes')
