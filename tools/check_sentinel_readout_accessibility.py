from pathlib import Path
import sys

READOUT = Path('app/src/main/assets/sentinel-arena-speed-readout.js')
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(READOUT.is_file(), 'sentinel-arena-speed-readout.js is missing')
text = ''.join(READOUT.read_text(encoding='utf-8').lower().split()) if READOUT.is_file() else ''
if text:
    require("sentinelarenastatus.setattribute('role','status')" in text, 'Sentinel combat readout must expose role=status')
    require("sentinelarenastatus.setattribute('aria-live','polite')" in text, 'Sentinel combat readout must use polite announcements')
    require("sentinelarenastatus.setattribute('aria-atomic','true')" in text, 'Sentinel combat readout announcements must be atomic')
    require("if(message===sentinelarenalastannouncement)return" in text, 'Sentinel readout must suppress duplicate announcements')
    require("'sentinelcoreopen.dashnow.'" in text, 'Dash-ready core opening must be announced')
    require("'sentinelcoreopen.dashrecharging.stompnow.'" in text, 'Dash-cooldown core opening must offer the stomp alternative')
    require("'sentinelhitconfirmed.prepareforthenextopening.'" in text, 'Confirmed boss hits must expose recovery guidance')
    require("sentinelarenastatus.textcontent=''" in text, 'Sentinel live status must clear when the arena readout is inactive')

if errors:
    print('SENTINEL READOUT ACCESSIBILITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('SENTINEL READOUT ACCESSIBILITY GATE: PASSED')
print('role_status=yes polite=yes atomic=yes deduplicated=yes core_open_guidance=yes hit_confirmation=yes clear_on_exit=yes')
