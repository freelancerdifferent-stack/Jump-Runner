from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
INDEX = ASSETS / 'index.html'
COACH = ASSETS / 'result-focus-coach.js'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

def flat(path):
    return ''.join(path.read_text(encoding='utf-8').lower().split()) if path.is_file() else ''

require(INDEX.is_file(), 'index.html is missing')
require(COACH.is_file(), 'result-focus-coach.js is missing')

index = flat(INDEX)
coach = flat(COACH)
if index:
    require('result-focus-coach.js' in index, 'result focus coach must be loaded')
    require(index.find('run-split-recap.js') < index.find('result-focus-coach.js'), 'focus coach must load after split recap')
if coach:
    require("addeventlistener('jumprunnercheckpointsplit'" in coach, 'focus coach must consume checkpoint split events')
    require("addeventlistener('jumprunnerresult'" in coach, 'focus coach must render on result transitions')
    require("split.delta>.15" in coach, 'focus coach must ignore insignificant pace noise')
    require("sort((a,b)=>b.delta-a.delta)" in coach, 'focus coach must choose the largest time-loss checkpoint')
    require("setattribute('role','status')" in coach, 'focus coach must expose role=status')
    require("setattribute('aria-live','polite')" in coach, 'focus coach must use polite live announcements')
    require("setattribute('aria-atomic','true')" in coach, 'focus coach announcement must be atomic')
    require('resetfocuscoach()' in coach and 'resetrun=function()' in coach, 'focus coach state must reset with each run')

if errors:
    print('RESULT FOCUS COACH QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('RESULT FOCUS COACH QUALITY GATE: PASSED')
print('largest_loss_target=yes insignificant_noise_filtered=yes accessible_status=yes run_reset=yes')
