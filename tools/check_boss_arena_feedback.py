from pathlib import Path
import sys

ASSETS = Path('app/src/main/assets')
HTML = ASSETS / 'index.html'
SCRIPT = ASSETS / 'boss-arena-lock-feedback.js'
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(SCRIPT.is_file(), 'boss-arena-lock-feedback.js is missing')
require(HTML.is_file(), 'index.html is missing')

if HTML.is_file():
    html = ''.join(HTML.read_text(encoding='utf-8').lower().split())
    require('boss-arena-lock-feedback.js' in html, 'arena-lock feedback must be loaded by index.html')

if SCRIPT.is_file():
    flat = ''.join(SCRIPT.read_text(encoding='utf-8').lower().split())
    require("'sentinelarena·holdposition'" in flat, 'arena hold cue must explain why forward movement stops')
    require("boss.active&&!boss.dead" in flat, 'arena hold cue must only appear during the active boss encounter')
    require('boss_arena_limit-6' in flat or 'bossarenalimit-6' in flat, 'arena hold cue must key off the actual arena clamp')
    require("setattribute('role','status')" in flat, 'arena hold cue must expose role=status')
    require("setattribute('aria-live','polite')" in flat, 'arena hold cue must use polite live announcements')
    require("setattribute('aria-atomic','true')" in flat, 'arena hold cue must be atomic')
    require("pointerevents:'none'" in flat, 'arena hold cue must never block Jump/Dash input')
    require('env(safe-area-inset-top)' in flat, 'arena hold cue must respect Android display cutouts')

if errors:
    print('BOSS ARENA FEEDBACK QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('BOSS ARENA FEEDBACK QUALITY GATE: PASSED')
print('arena_hold_cue=yes accessible=yes touch_through=yes safe_area=yes')
