from pathlib import Path
import sys

ASSET=Path('app/src/main/assets/result-max-pace-recap.js')
errors=[]
def require(condition,message):
    if not condition: errors.append(message)

require(ASSET.is_file(),'result-max-pace-recap.js is missing')
if ASSET.is_file():
    src=''.join(ASSET.read_text(encoding='utf-8').lower().split())
    require('result-max-pace-meter' in src,'result recap must include a progress meter')
    require('progresspct=math.round(progress*100)' in src,'progress percentage must be derived from bounded run/best ratio')
    require('math.max(0,math.min(1,held/progressbase))' in src,'progress ratio must be clamped to 0..1')
    require("meter.setattribute('aria-hidden','true')" in src,'decorative meter must stay hidden from assistive technology')
    require("'%ofbest'" in src or "+'%ofbest'" in src,'result recap must expose a compact percent-of-best label')
    require('prefers-reduced-motion:reduce' in src and 'transition:none' in src,'meter animation must respect reduced motion')
    require('percentofyourbest.' in src,'non-record accessibility copy must include percent-of-best progress')

if errors:
    print('RESULT MAX PACE PROGRESS QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1): print(f'{i}. {error}')
    sys.exit(1)
print('RESULT MAX PACE PROGRESS QUALITY GATE: PASSED')
print('bounded_ratio=yes progress_meter=yes reduced_motion=yes decorative_meter_hidden=yes accessible_progress=yes')
