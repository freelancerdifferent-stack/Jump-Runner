from pathlib import Path
import sys

FX = Path('app/src/main/assets/speed-fx.js')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(FX.is_file(), 'speed-fx.js is missing')

if FX.is_file():
    flat = ''.join(FX.read_text(encoding='utf-8').lower().split())
    require('functionsentinelarenapinned()' in flat, 'Sentinel arena pin detector is missing')
    require("boss.active&&!boss.dead" in flat, 'arena pin detector must only apply during the live Sentinel encounter')
    require('player.x>=boss_arena_limit-1' in flat, 'arena pin detector must anchor to the boss arena limit')
    require('if(!arenapinned)speedfxphase=' in flat, 'background momentum animation must pause while the runner is pinned')
    require('if(!arenapinned){' in flat, 'speed streak rendering must be suppressed while the runner is pinned')
    require("if(player.dash>0){constg=ctx.createradialgradient" in flat, 'Dash confirmation bloom must remain available in the arena')
    require('speedfxland>0' in flat, 'landing feedback must remain available')

if errors:
    print('SENTINEL ARENA MOMENTUM QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('SENTINEL ARENA MOMENTUM QUALITY GATE: PASSED')
print('arena_speed_streaks_suppressed=yes dash_bloom_preserved=yes landing_feedback_preserved=yes')
