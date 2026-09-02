from pathlib import Path
import sys

PATH = Path('app/src/main/assets/finish-approach-feedback.js')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(PATH.is_file(), 'finish-approach-feedback.js is missing')
if PATH.is_file():
    flat = ''.join(PATH.read_text(encoding='utf-8').lower().split())
    require("functionsentinelresolved(){returntypeofboss==='undefined'||boss.dead;}" in flat,
            'finish approach cue must wait until the Sentinel is resolved')
    require("state!=='play'||announced||!sentinelresolved()" in flat,
            'finish approach cue must suppress itself during the boss encounter')
    require('player.x/level_end' in flat and 'pct>=.88' in flat,
            'finish approach cue must retain the final-stretch distance threshold')
    require("announced=false" in flat and "cue.classlist.remove('show')" in flat,
            'finish approach cue must reset cleanly for a new run')

if errors:
    print('FINISH APPROACH AFTER BOSS GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('FINISH APPROACH AFTER BOSS GATE: PASSED')
print('boss_resolved_gate=yes final_stretch_threshold=yes reset=yes')
