from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
START = ASSETS / 'start-countdown.js'
RESUME = ASSETS / 'resume-countdown.js'
CSS = ASSETS / 'start-countdown.css'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

def flat(path):
    return ''.join(path.read_text(encoding='utf-8').lower().split()) if path.is_file() else ''

require(START.is_file(), 'start-countdown.js is missing')
require(RESUME.is_file(), 'resume-countdown.js is missing')
require(CSS.is_file(), 'start-countdown.css is missing')

start = flat(START)
resume = flat(RESUME)
css = flat(CSS)

if start:
    require("functionpulsecue()" in start, 'start countdown must define a visual tick pulse')
    require("classlist.remove('countdown-tick-pop')" in start and "classlist.add('countdown-tick-pop')" in start, 'start countdown must retrigger the tick pulse per step')
    require("pulsecue();window.dispatchevent(newcustomevent('jumprunnercountdowntick'" in start, 'start visual pulse must stay synchronized with the shared tick event')

if resume:
    require("functionpulsecue(el)" in resume, 'resume countdown must define a visual tick pulse')
    require("pulsecue(el);announcetick(text)" in resume, 'resume visual pulse must stay synchronized with the shared tick event')
    require("classlist.remove('countdown-tick-pop')" in resume, 'resume countdown must clear stale pulse state')

if css:
    require('.start-countdown.countdown-tick-pop' in css, 'start countdown pulse styling is missing')
    require('#resumecountdown.countdown-tick-pop' in css, 'resume countdown pulse styling is missing')
    require('@keyframescountdowntickpop' in css and '@keyframesresumecountdowntickpop' in css, 'countdown pulse keyframes are missing')
    require('@media(prefers-reduced-motion:reduce)' in css and '#resumecountdown.countdown-tick-pop{transition:none;animation:none}' in css, 'countdown visual pulse must respect reduced motion')

if errors:
    print('COUNTDOWN TICK VISUAL SYNC QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('COUNTDOWN TICK VISUAL SYNC QUALITY GATE: PASSED')
print('start_tick_pulse=yes resume_tick_pulse=yes audio_visual_event_sync=yes reduced_motion=yes')
