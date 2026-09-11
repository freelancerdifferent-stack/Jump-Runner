from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
FINISH = ASSETS / 'finish-guard.js'
RETRY = ASSETS / 'retry-coaching.js'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

def flat(path):
    return ''.join(path.read_text(encoding='utf-8').lower().split()) if path.is_file() else ''

require(FINISH.is_file(), 'finish-guard.js is missing')
require(RETRY.is_file(), 'retry-coaching.js is missing')
finish = flat(FINISH)
retry = flat(RETRY)

if finish:
    require("constresultreason=!didwin&&typeofdeathreason==='string'?deathreason:''" in finish,
            'result transition must capture the actual failure reason before rendering')
    require("detail:{win:didwin,reason:resultreason}" in finish,
            'jumprunnerresult must expose the captured failure reason')
if retry:
    require("event?.detail?.reason||''" in retry,
            'retry coaching must consume the failure reason from the result event')
    require('window.deathreason' not in retry,
            'retry coaching must not read top-level lexical state through window.deathReason')
    for token in ('/spikes/i', '/barrier/i', '/drone/i', '/pulse/i', '/sentinel/i', '/fell|skyline|gap/i'):
        require(token in retry, f'retry coaching rule missing: {token}')

if errors:
    print('RETRY REASON COACHING QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('RETRY REASON COACHING QUALITY GATE: PASSED')
print('result_reason_event=yes contextual_retry_tip=yes lexical_global_safe=yes')
