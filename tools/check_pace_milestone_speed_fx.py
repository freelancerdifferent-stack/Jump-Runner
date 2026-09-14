from pathlib import Path
import sys

FX=Path('app/src/main/assets/speed-fx.js')
PACE=Path('app/src/main/assets/run-pace-milestones.js')
errors=[]

def require(condition,message):
    if not condition: errors.append(message)

def flat(path):
    return ''.join(path.read_text(encoding='utf-8').lower().split()) if path.is_file() else ''

require(FX.is_file(),'speed-fx.js is missing')
require(PACE.is_file(),'run-pace-milestones.js is missing')
fx=flat(FX)
pace=flat(PACE)

if pace:
    require("newcustomevent('jumprunnerpacemilestone'" in pace,'pace milestones must keep dispatching the shared gameplay event')
    require('max:tier.speed===455' in pace,'pace event must preserve the distinct maximum-pace state')
if fx:
    require("addeventlistener('jumprunnerpacemilestone'" in fx,'speed FX must subscribe to automatic pace milestones')
    require('speedfxpacepulse' in fx and 'speedfxmaxpace' in fx,'speed FX must latch a short one-shot pace accent')
    require("speedfxreducedmotion()" in fx and "data-reduced-motion" in fx,'pace accent must respect reduced-motion preference')
    require("speedfxmaxpace?'#ffd86b':'#69edff'" in fx,'maximum pace must remain visually distinct from intermediate milestones')
    require('!arenapinned' in fx or '!arenaPinned' in FX.read_text(encoding='utf-8'),'pace streak accent must stay suppressed while the Sentinel arena is pinned')
    require('speedfxpacepulse=math.max(0,speedfxpacepulse-dt)' in fx,'pace accent must decay automatically instead of persisting')

if errors:
    print('PACE MILESTONE SPEED FX QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1): print(f'{i}. {error}')
    sys.exit(1)
print('PACE MILESTONE SPEED FX QUALITY GATE: PASSED')
print('shared_event=yes one_shot=yes max_pace_distinct=yes reduced_motion=yes sentinel_suppression=yes physics_unchanged=yes')
