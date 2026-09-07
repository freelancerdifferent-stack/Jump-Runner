from pathlib import Path
import sys

ASSETS=Path('app/src/main/assets')
HTML=ASSETS/'index.html'
SCRIPT=ASSETS/'retry-focus-reminder.js'
errors=[]

def require(condition,message):
    if not condition:
        errors.append(message)

require(HTML.is_file(),'index.html is missing')
require(SCRIPT.is_file(),'retry-focus-reminder.js is missing')
html=HTML.read_text(encoding='utf-8').lower() if HTML.is_file() else ''
script=''.join(SCRIPT.read_text(encoding='utf-8').lower().split()) if SCRIPT.is_file() else ''
require('retry-focus-reminder.js' in html,'retry focus reminder must be packaged in index.html')
require("addEventListener('jumprunnercheckpointsplit'".lower().replace(' ','') in script,'retry focus reminder must consume checkpoint split events')
require("addEventListener('jumprunnerresult'".lower().replace(' ','') in script,'retry focus reminder must commit a target on result')
require("localstorage.setitem(storage_key" in script and "localstorage.removeitem(storage_key" in script,'retry focus reminder must persist and clear the next-run target')
require("target.delta>.15" in script,'retry focus reminder must ignore insignificant pace noise')
require("recover${target.delta.tofixed(1)}s" in script,'retry focus reminder must communicate a concrete recovery target')
require("setattribute('role','status')" in script and "setattribute('aria-live','polite')" in script and "setattribute('aria-atomic','true')" in script,'retry focus reminder must remain an accessible polite atomic status')
require("prefers-reduced-motion:reduce" in script,'retry focus reminder must respect reduced-motion preferences')
require("addEventListener('jumprunnerpause',hidereminder)" in script,'retry focus reminder must clear on pause')
require("settimeout(showreminder,700)" in script,'retry focus reminder must wait until the run is visible before appearing')

if errors:
    print('RETRY FOCUS REMINDER QUALITY GATE: FAILED')
    for i,error in enumerate(errors,1):
        print(f'{i}. {error}')
    sys.exit(1)
print('RETRY FOCUS REMINDER QUALITY GATE: PASSED')
print('packaged=yes split_driven=yes result_driven=yes persistent=yes noise_floor=yes accessible=yes reduced_motion=yes pause_safe=yes')
