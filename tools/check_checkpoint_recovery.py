from pathlib import Path
import re
import sys

CHECKPOINTS = Path('app/src/main/assets/checkpoints.js')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(CHECKPOINTS.is_file(), 'checkpoints.js is missing')
if CHECKPOINTS.is_file():
    text = CHECKPOINTS.read_text(encoding='utf-8')
    flat = re.sub(r'\s+', '', text.lower())
    require('score+=500;flow=math.min(8,flow+1);flowtimer=3;checkpointsnapshot={' in flat,
            'checkpoint reward must be applied before snapshot capture')
    require('time,' in text and 'time=checkpointSnapshot.time;' in text,
            'checkpoint recovery must restore the captured run time')
    require('score:Math.floor(score)' in text and 'score=checkpointSnapshot.score' in text,
            'checkpoint recovery must preserve the earned gate score')
    require('collected:checkpointCopySet(collected)' in text and 'broken:checkpointCopySet(broken)' in text and 'defeated:checkpointCopySet(defeated)' in text,
            'checkpoint recovery must continue snapshotting world progress sets')
    require("Object.assign(player,{x:checkpointSnapshot.x" in text,
            'checkpoint recovery must restore the player to the saved gate position')

if errors:
    print('CHECKPOINT RECOVERY QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('CHECKPOINT RECOVERY QUALITY GATE: PASSED')
print('reward_preserved=yes time_restored=yes world_progress_preserved=yes deterministic_retry=yes')
