from pathlib import Path
import sys

ASSET = Path('app/src/main/assets/run-split-recap.js')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(ASSET.is_file(), 'run-split-recap.js is missing')
if ASSET.is_file():
    text = ''.join(ASSET.read_text(encoding='utf-8').lower().split())
    require('functionlongestbestsplitstreak(rows)' in text, 'result recap must compute the longest consecutive best-split streak')
    require('if(split.isbest){current++;longest=math.max(longest,current);}elsecurrent=0;' in text, 'best-split streak must reset on a non-best checkpoint')
    require('beststreak>=2' in text, 'result streak summary should stay restrained until at least two best splits are chained')
    require('beststreak×${beststreak}' in text, 'result recap must surface the completed best-split streak count')
    require("setattribute('aria-label',beststreak>=2?`checkpointsplitrecap.bestsplitstreak${beststreak}.`:'checkpointsplitrecap')" in text, 'result streak summary must be represented in the recap accessible name')
    require("badge.setattribute('aria-hidden','true')" in text, 'visual streak badge must not duplicate the accessible recap announcement')
    require("resetrun=function(){resetrunsplits();splitrecapreset();};" in text, 'split history and streak summary must reset between runs')

if errors:
    print('RESULT BEST-SPLIT STREAK QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('RESULT BEST-SPLIT STREAK QUALITY GATE: PASSED')
print('longest_streak=yes result_badge=yes restrained=yes accessible=yes reset=yes')
