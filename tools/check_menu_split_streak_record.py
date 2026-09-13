from pathlib import Path
import sys

ASSETS = Path("app/src/main/assets")
HTML = ASSETS / "index.html"
MENU = ASSETS / "menu-split-streak-record.js"
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(MENU.is_file(), "menu-split-streak-record.js is missing")
require(HTML.is_file(), "index.html is missing")

if HTML.is_file():
    html = "".join(HTML.read_text(encoding="utf-8").lower().split())
    require('<scriptsrc="menu-split-streak-record.js"></script>' in html, "menu split-streak record polish must be packaged")

if MENU.is_file():
    flat = "".join(MENU.read_text(encoding="utf-8").lower().split())
    require("conststorage_key='jr_best_split_streak'" in flat, "menu record must reuse the persistent split-streak storage key")
    require("localstorage.getitem(storage_key)" in flat, "menu record must restore the persisted streak")
    require("bestsplitstreakrecord" in flat and "beatitthisrun" in flat, "existing records need a clear replay challenge")
    require("setarecord" in flat and "chain2+bestsplits" in flat, "players without a record need an achievable first goal")
    require("role','status'" in flat and "aria-live','polite'" in flat and "aria-atomic','true'" in flat, "menu record must remain explicit for assistive technology")
    require("constbaseshowmenu=window.showmenu" in flat and "window.showmenu=function()" in flat, "menu record must survive later HOME transitions")
    require("if(actions)actions.insertadjacentelement('afterend',card)" in flat, "record card must remain close to the primary start action")

if errors:
    print("MENU SPLIT STREAK RECORD QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)

print("MENU SPLIT STREAK RECORD QUALITY GATE: PASSED")
print("packaged=yes storage_key=yes restore=yes replay_goal=yes first_goal=yes accessibility=yes home_transition=yes start_proximity=yes")
