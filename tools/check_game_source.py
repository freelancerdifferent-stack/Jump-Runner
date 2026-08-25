from pathlib import Path
import re
import sys

ASSETS = Path("app/src/main/assets")
HTML = ASSETS / "index.html"
MANIFEST = Path("app/src/main/AndroidManifest.xml")
MAIN = Path("app/src/main/java/com/differentfreelancer/jumprunner/MainActivity.java")
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

require(HTML.is_file(), "game asset index.html is missing")
require(MANIFEST.is_file(), "AndroidManifest.xml is missing")
require(MAIN.is_file(), "MainActivity.java is missing")

if HTML.is_file():
    html = HTML.read_text(encoding="utf-8")
    lower = html.lower()
    require(len(re.findall(r'<canvas\b', html, re.I)) == 1, "exactly one game canvas is required")
    require('id="game"' in lower or "id='game'" in lower, "game canvas must use id=game")
    require('viewport-fit=cover' in lower, "mobile viewport must support safe areas")
    require(not re.search(r'<script[^>]+src\s*=\s*["\']https?://', html, re.I), "remote script dependencies are forbidden")
    require(not re.search(r'<link[^>]+href\s*=\s*["\']https?://', html, re.I), "remote stylesheet dependencies are forbidden")

    local_scripts = re.findall(r'<script[^>]+src\s*=\s*["\']([^"\']+)["\']', html, re.I)
    local_styles = re.findall(r'<link[^>]+href\s*=\s*["\']([^"\']+)["\']', html, re.I)
    require(local_scripts, "at least one packaged JavaScript asset is required")
    require(local_styles, "at least one packaged stylesheet is required")

    combined = html
    for rel in local_scripts + local_styles:
        require('://' not in rel and not rel.startswith('//'), f"asset must be packaged locally: {rel}")
        path = (ASSETS / rel).resolve()
        require(path.is_file() and ASSETS.resolve() in path.parents, f"referenced packaged asset is missing: {rel}")
        if path.is_file():
            combined += "\n" + path.read_text(encoding="utf-8")

    flat = re.sub(r'\s+', '', combined.lower())
    require('touch-action:none' in flat, "touch-action:none is required for reliable mobile controls")
    require('jumprunnerpause' in combined and 'jumprunnerresume' in combined, "pause/resume lifecycle bridge is required")
    require(len(combined) >= 9000, "combined game source is unexpectedly small")
    require('adaptive-runtime.js' in local_scripts, "adaptive Android viewport runtime must be loaded")
    require('visualviewport' in flat and 'orientationchange' in flat, "adaptive viewport must react to device viewport/orientation changes")
    require('scale=h/vh' in flat, "gameplay scaling must anchor to virtual height to avoid landscape letterboxing")
    require('vieww=w/math.max(scale' in flat, "horizontal virtual viewport must follow the actual device aspect ratio")
    require('finishlocked' in flat and 'level_end-520' in flat, "finish gate regression guard is required")
    for token in ('fetch(', 'xmlhttprequest', 'websocket', 'eventsource'):
        require(token not in flat, f"offline baseline forbids network API: {token}")
    for token in ("admob", "billingclient", "play billing", "rewarded ad"):
        require(token not in combined.lower(), f"monetization is out of current scope: {token}")

if MANIFEST.is_file():
    manifest = MANIFEST.read_text(encoding="utf-8")
    require('android:usesCleartextTraffic="false"' in manifest, "cleartext network traffic must remain disabled")
    require('android.permission.INTERNET' not in manifest, "offline game must not request INTERNET permission")
    require('android:screenOrientation="landscape"' in manifest, "game must stay landscape during current production phase")

if MAIN.is_file():
    main = MAIN.read_text(encoding="utf-8")
    require('WebView.setWebContentsDebuggingEnabled(false)' in main, "WebView debugging must be disabled")
    require('file:///android_asset/index.html' in main, "WebView must load packaged game asset")
    require('setAllowContentAccess(false)' in main, "WebView content access must remain disabled")

if errors:
    print("GAME SOURCE QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1):
        print(f"{i}. {error}")
    sys.exit(1)
print("GAME SOURCE QUALITY GATE: PASSED")
print("offline=yes lifecycle_bridge=yes canvas=1 packaged_assets=yes adaptive_android_viewport=yes finish_guard=yes monetization=absent")
