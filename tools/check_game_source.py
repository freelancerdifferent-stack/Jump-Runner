from pathlib import Path
import re
import sys

ASSETS = Path("app/src/main/assets")
HTML = ASSETS / "index.html"
MANIFEST = Path("app/src/main/AndroidManifest.xml")
MAIN = Path("app/src/main/java/com/differentfreelancer/jumprunner/MainActivity.java")
STYLES = Path("app/src/main/res/values/styles.xml")
errors = []

def require(condition, message):
    if not condition:
        errors.append(message)

for path, label in ((HTML, "game asset index.html"), (MANIFEST, "AndroidManifest.xml"), (MAIN, "MainActivity.java"), (STYLES, "Android theme styles.xml")):
    require(path.is_file(), f"{label} is missing")

if HTML.is_file():
    html = HTML.read_text(encoding="utf-8")
    lower = html.lower()
    require(len(re.findall(r"<canvas\b", html, re.I)) == 1, "exactly one game canvas is required")
    require('id="game"' in lower or "id='game'" in lower, "game canvas must use id=game")
    require('viewport-fit=cover' in lower, "mobile viewport must support safe areas")
    require(not re.search(r'<script[^>]+src\s*=\s*["\']https?://', html, re.I), "remote script dependencies are forbidden")
    require(not re.search(r'<link[^>]+href\s*=\s*["\']https?://', html, re.I), "remote stylesheet dependencies are forbidden")
    scripts = re.findall(r'<script[^>]+src\s*=\s*["\']([^"\']+)["\']', html, re.I)
    styles = re.findall(r'<link[^>]+href\s*=\s*["\']([^"\']+)["\']', html, re.I)
    require(scripts, "at least one packaged JavaScript asset is required")
    require(styles, "at least one packaged stylesheet is required")
    combined = html
    for rel in scripts + styles:
        require('://' not in rel and not rel.startswith('//'), f"asset must be packaged locally: {rel}")
        path = (ASSETS / rel).resolve()
        require(path.is_file() and ASSETS.resolve() in path.parents, f"referenced packaged asset is missing: {rel}")
        if path.is_file():
            combined += "\n" + path.read_text(encoding="utf-8")
    flat = re.sub(r"\s+", "", combined.lower())
    for token, message in (
        ('touch-action:none', 'touch-action:none is required for reliable mobile controls'),
        ('jumprunnerpause', 'pause lifecycle bridge is required'),
        ('jumprunnerresume', 'resume lifecycle bridge is required'),
        ('finishlineunlocked', 'boss victory feedback is required'),
        ('control-feedback.js', 'touch control feedback is required'),
        ('danger-telegraphs.js', 'hazard telegraphs are required'),
        ('checkpoint-feedback.js', 'checkpoint feedback is required'),
        ('impact-feedback.js', 'impact feedback is required'),
        ('health-feedback.js', 'health feedback is required'),
        ('personal-best-feedback.js', 'personal-best feedback is required'),
        ('near-miss-feedback.js', 'near-miss feedback is required'),
        ('landing-feedback.js', 'landing feedback is required'),
        ('boss-phase-feedback.js', 'boss phase feedback is required'),
        ('boss-health-feedback.js', 'boss health feedback is required'),
        ('boss-shot-telegraph.js', 'boss shot telegraph is required'),
    ):
        require(token in flat or token in [s.lower() for s in scripts], message)
    require(("finishlocked" in flat and "level_end-520" in flat) or ("boss_arena_limit" in flat and "player.x=Math.min(player.x,boss_arena_limit)" in flat), "finish gate regression guard is required")
    for token in ('fetch(', 'xmlhttprequest', 'websocket', 'eventsource', 'admob', 'billingclient', 'play billing', 'rewarded ad'):
        require(token not in flat, f"forbidden token present: {token}")

if MANIFEST.is_file():
    manifest = MANIFEST.read_text(encoding="utf-8")
    for token, message in (
        ('android:usesCleartextTraffic="false"', 'cleartext network traffic must remain disabled'),
        ('android:screenOrientation="landscape"', 'game must stay landscape'),
        ('android:resizeableActivity="true"', 'activity must remain resizable'),
        ('android:maxAspectRatio="3.0"', 'wide aspect ratios must remain supported'),
    ):
        require(token in manifest, message)
    require('android.permission.INTERNET' not in manifest, 'offline game must not request INTERNET permission')

if MAIN.is_file():
    main = MAIN.read_text(encoding="utf-8")
    for token, message in (
        ('WebView.setWebContentsDebuggingEnabled(false)', 'WebView debugging must be disabled'),
        ('file:///android_asset/index.html', 'WebView must load packaged game asset'),
        ('setAllowContentAccess(false)', 'WebView content access must remain disabled'),
        ('ViewGroup.LayoutParams.MATCH_PARENT', 'WebView must fill the activity surface'),
        ('setFitsSystemWindows(false)', 'WebView must not shrink to system-bar insets'),
        ('showStartupFailure', 'Android host must recover visibly when WebView startup fails'),
        ('safeDispatchEvent', 'Android lifecycle bridge must be failure-tolerant'),
        ('disposeWebView', 'WebView teardown must be failure-tolerant'),
        ('SYSTEM_UI_FLAG_IMMERSIVE_STICKY', 'stable fullscreen fallback must remain enabled'),
    ):
        require(token in main, message)
    require('WindowInsetsController' not in main and 'setDecorFitsSystemWindows' not in main, 'startup host must not depend on API-30-only window APIs')

if errors:
    print('GAME SOURCE QUALITY GATE: FAILED')
    for i, error in enumerate(errors, 1):
        print(f'{i}. {error}')
    sys.exit(1)

print('GAME SOURCE QUALITY GATE: PASSED')
print('offline=yes crash_safe_host=yes stable_fullscreen=yes boss_readability=yes controls=yes accessibility=yes monetization=absent')