from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
FX = ASSETS / 'speed-fx.js'
READOUT = ASSETS / 'sentinel-arena-speed-readout.js'
PROGRESS_LOCK = ASSETS / 'sentinel-arena-progress-lock.js'
BOSS = ASSETS / 'boss.js'
INDEX = ASSETS / 'index.html'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(FX.is_file(), 'speed-fx.js is missing')
require(READOUT.is_file(), 'sentinel-arena-speed-readout.js is missing')
require(PROGRESS_LOCK.is_file(), 'sentinel-arena-progress-lock.js is missing')
require(BOSS.is_file(), 'boss.js is missing')
require(INDEX.is_file(), 'index.html is missing')

if FX.is_file():
    flat = ''.join(FX.read_text(encoding='utf-8').lower().split())
    require('functionsentinelarenapinned()' in flat, 'Sentinel arena pin detector is missing')
    require("boss.active&&!boss.dead" in flat, 'arena pin detector must only apply during the live Sentinel encounter')
    require('player.x>=boss_arena_limit-1' in flat, 'arena pin detector must anchor to the boss arena limit')
    require('if(!arenapinned)speedfxphase=' in flat, 'background momentum animation must pause while the runner is pinned')
    require('if(!arenapinned){' in flat, 'speed streak rendering must be suppressed while the runner is pinned')
    require("if(player.dash>0){constg=ctx.createradialgradient" in flat, 'Dash confirmation bloom must remain available in the arena')
    require('speedfxland>0' in flat, 'landing feedback must remain available')

if READOUT.is_file():
    readout = ''.join(READOUT.read_text(encoding='utf-8').lower().split())
    require('constsentinelarenaspeedbasedraw=draw' in readout, 'arena speed readout must preserve the existing draw pipeline')
    require("state==='play'" in readout and 'boss.active&&!boss.dead' in readout, 'arena speed readout must only replace the HUD during a live playable boss encounter')
    require('player.x>=boss_arena_limit-1' in readout, 'arena speed readout must use the same physical pin boundary')
    require("ctx.filltext('arenalock',16,vh-10)" in readout, 'pinned runner must show ARENA LOCK instead of a misleading forward-speed value')
    require("ctx.fillrect(0,vh-28,154,28)" in readout, 'arena readout must cover the original SPEED label before drawing its replacement')

if PROGRESS_LOCK.is_file():
    progress = ''.join(PROGRESS_LOCK.read_text(encoding='utf-8').lower().split())
    require('constsentinelarenaprogressbaseupdate=update' in progress, 'arena progress lock must preserve the existing update pipeline')
    require("state==='play'" in progress and 'boss.active&&!boss.dead' in progress, 'arena progress lock must only apply during a live playable boss encounter')
    require('player.x>=boss_arena_limit-1' in progress, 'arena progress lock must use the same physical pin boundary')
    require('boss_arena_limit/level_end*100' in progress, 'arena progress lock must derive the held HUD position from the arena boundary')
    require("progressel.style.width=heldprogress+'%'" in progress, 'arena progress lock must override the transient base-update progress value')

if BOSS.is_file():
    boss = ''.join(BOSS.read_text(encoding='utf-8').lower().split())
    require('arenapinned:false' in boss, 'Sentinel must track whether the final arena pin has latched')
    require('if(player.x>=boss_arena_limit-1)boss.arenapinned=true' in boss, 'arena pin must latch when the runner reaches the final boundary')
    require('if(boss.arenapinned){player.x=boss_arena_limit;cam=boss_arena_limit-210;}' in boss, 'pinned encounter must hold both runner and camera at deterministic coordinates')
    require('boss.arenapinned=false' in boss, 'arena pin state must reset for each run and encounter')

if INDEX.is_file():
    html = INDEX.read_text(encoding='utf-8').lower()
    speed_pos = html.find('src="speed-fx.js"')
    readout_pos = html.find('src="sentinel-arena-speed-readout.js"')
    progress_pos = html.find('src="sentinel-arena-progress-lock.js"')
    checkpoint_pos = html.find('src="checkpoint-feedback.js"')
    require(speed_pos >= 0 and readout_pos > speed_pos, 'arena speed readout must load after speed-fx.js')
    require(progress_pos > readout_pos, 'arena progress lock must load after the arena speed readout')
    require(checkpoint_pos < 0 or progress_pos < checkpoint_pos, 'arena progress lock should stay with the final-arena momentum polish layer')

if errors:
    print('SENTINEL ARENA MOMENTUM QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('SENTINEL ARENA MOMENTUM QUALITY GATE: PASSED')
print('arena_speed_streaks_suppressed=yes arena_speed_readout=locked arena_progress=stable arena_position=stable arena_camera=stable dash_bloom_preserved=yes landing_feedback_preserved=yes')
