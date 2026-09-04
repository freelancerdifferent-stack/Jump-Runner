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

require(HTML.is_file(), "game asset index.html is missing")
require(MANIFEST.is_file(), "AndroidManifest.xml is missing")
require(MAIN.is_file(), "MainActivity.java is missing")
require(STYLES.is_file(), "Android theme styles.xml is missing")

if HTML.is_file():
    html = HTML.read_text(encoding="utf-8")
    lower = html.lower()
    require(len(re.findall(r'<canvas\\b', html, re.I)) == 1, "exactly one game canvas is required")
    require('id="game"' in lower or "id='game'" in lower, "game canvas must use id=game")
    require('viewport-fit=cover' in lower, "mobile viewport must support safe areas")
    require(not re.search(r'<script[^>]+src\\s*=\\s*["\\']https?://', html, re.I), "remote script dependencies are forbidden")
    require(not re.search(r'<link[^>]+href\\s*=\\s*["\\']https?://', html, re.I), "remote stylesheet dependencies are forbidden")
    local_scripts = re.findall(r'<script[^>]+src\\s*=\\s*["\\']([^"\\']+)["\\']', html, re.I)
    local_styles = re.findall(r'<link[^>]+href\\s*=\\s*["\\']([^"\\']+)["\\']', html, re.I)
    require(local_scripts, "at least one packaged JavaScript asset is required")
    require(local_styles, "at least one packaged stylesheet is required")
    combined = html
    for rel in local_scripts + local_styles:
        require('://' not in rel and not rel.startswith('//'), f"asset must be packaged locally: {rel}")
        path = (ASSETS / rel).resolve()
        require(path.is_file() and ASSETS.resolve() in path.parents, f"referenced packaged asset is missing: {rel}")
        if path.is_file(): combined += "\\n" + path.read_text(encoding="utf-8")
    flat = re.sub(r'\\s+', '', combined.lower())
    require('touch-action:none' in flat, "touch-action:none is required for reliable mobile controls")
    require('jumprunnerpause' in combined and 'jumprunnerresume' in combined, "pause/resume lifecycle bridge is required")
    require(len(combined) >= 9000, "combined game source is unexpectedly small")
    require('finishlocked' in flat and 'level_end-520' in flat, "finish gate regression guard is required")
    require('dashorstomptobreakitscore' in flat and 'finishlineunlocked' in flat and 'boss.intro<=0' in flat, "boss encounter must preserve readable attack telegraph and victory feedback")
    require('control-feedback.js' in local_scripts and '--dash-charge' in combined and 'is-cooling' in combined and 'is-ready' in combined, "touch controls must expose dash readiness and cooldown feedback")
    require('danger-telegraphs.js' in local_scripts and 'drawwarningmarker' in flat and "'jump'" in combined.lower() and "'dash / stomp'" in combined.lower(), "hazards must expose readable reaction-window telegraphs")
    require('checkpoint-feedback.js' in local_scripts and 'progresssecured' in flat and 'recoveryonline' in flat and 'aria-live' in flat, "checkpoint milestones must expose visible and accessible recovery feedback")
    require('impact-feedback.js' in local_scripts and 'integrityhit' in flat and 'impactpulse' in flat and 'createradialgradient' in flat, "damage must expose short readable impact feedback")
    require("setattribute('role','status')" in flat and "setattribute('aria-live','polite')" in flat and 'integritydepleted.' in flat and "'integrityhit.'+health+'remaining.'" in flat, "integrity damage must remain available as a polite assistive status announcement")
    require('flow-feedback.js' in local_scripts and 'maxflow' in flat and 'flow-hot' in flat and 'flow-max' in flat, "flow streaks must expose readable escalation feedback")
    require('health-feedback.js' in local_scripts and "status.setattribute('role','status')" in flat and "status.setattribute('aria-live','polite')" in flat and "status.setattribute('aria-atomic','true')" in flat and "'integrityrestored.'+health+'of'+maxhealth+'remaining.'" in flat and "'criticalintegrity.'+health+'of'+maxhealth+'remaining.'" in flat and 'health===1&&!criticalannounced' in flat, "integrity recovery and critical state must remain restrained accessible announcements")
    require('personal-best-feedback.js' in local_scripts and 'newhighscore' in flat and 'newfastest' in flat and 'aria-live' in flat, "successful runs must expose personal-best celebration feedback")
    require('near-miss-feedback.js' in local_scripts and 'closecall' in flat and 'wasthreatened' in flat, "close hazard escapes must expose restrained near-miss feedback")
    require('landing-feedback.js' in local_scripts and 'landing-ring' in combined and 'player.land>0' in flat, "landings must expose restrained grounded feedback")
    require('boss-phase-feedback.js' in local_scripts and 'sentineloverdrive' in flat and 'sentinelcoreexposed' in flat and 'aria-live' in flat, "boss damage phases must expose readable escalation feedback")
    require('boss-health-feedback.js' in local_scripts and "status.setattribute('role','status')" in flat and "status.setattribute('aria-live','polite')" in flat and "status.setattribute('aria-atomic','true')" in flat and "'sentinelcorehit.'+boss.hp+'of'+boss.maxhp+'integrityremaining.'" in flat, "boss core hits must remain explicit atomic assistive integrity announcements")
    require('boss-shot-telegraph.js' in local_scripts and 'pulseincoming' in flat and 'dodgeordash' in flat and 'closing>.72' in flat, "boss projectiles must expose an imminent-hit warning without changing projectile behavior")
    for token in ('fetch(', 'xmlhttprequest', 'websocket', 'eventsource'): require(token not in flat, f"offline baseline forbids network API: {token}")
    for token in ("admob", "billingclient", "play billing", "rewarded ad"): require(token not in combined.lower(), f"monetization is out of current scope: {token}")

if MANIFEST.is_file():
    manifest = MANIFEST.read_text(encoding="utf-8")
    require('android:usesCleartextTraffic="false"' in manifest, "cleartext network traffic must remain disabled")
    require('android.permission.INTERNET' not in manifest, "offline game must not request INTERNET permission")
    require('android:screenOrientation="landscape"' in manifest, "game must stay landscape during current production phase")
    require('android:resizeableActivity="true"' in manifest, "activity must remain resizable across Android display shapes")
    require('android:maxAspectRatio="3.0"' in manifest, "wide Android aspect ratios must not be artificially capped")
if MAIN.is_file():
    main = MAIN.read_text(encoding="utf-8")
    require('WebView.setWebContentsDebuggingEnabled(false)' in main, "WebView debugging must be disabled")
    require('file:///android_asset/index.html' in main, "WebView must load packaged game asset")
    require('setAllowContentAccess(false)' in main, "WebView content access must remain disabled")
    require('ViewGroup.LayoutParams.MATCH_PARENT' in main, "WebView must fill the complete activity surface")
    require('setFitsSystemWindows(false)' in main, "WebView must not shrink itself to system-bar insets")
    require('showStartupFailure' in main and 'catch (Throwable error)' in main, "Android host must recover visibly when WebView startup fails")
    require('safeDispatchEvent' in main and 'disposeWebView' in main, "Android lifecycle bridge must tolerate WebView teardown/failure")
    require('SYSTEM_UI_FLAG_IMMERSIVE_STICKY' in main and 'SYSTEM_UI_FLAG_FULLSCREEN' in main, "stable API-24 fullscreen fallback must remain enabled")
    require('WindowInsetsController' not in main and 'setDecorFitsSystemWindows' not in main, "startup host must not depend on API-30-only window APIs")
if errors:
    print("GAME SOURCE QUALITY GATE: FAILED")
    for i, error in enumerate(errors, 1): print(f"{i}. {error}")
    sys.exit(1)
print("GAME SOURCE QUALITY GATE: PASSED")
print("offline=yes lifecycle_bridge=yes canvas=1 stable_source_contracts=yes crash_safe_host=yes finish_guard=yes boss_readability=yes control_feedback=yes damage_accessibility=yes flow_feedback=yes health_accessibility=yes personal_best_accessibility=yes near_miss_feedback=yes landing_feedback=yes boss_phase_feedback=yes boss_hit_accessibility=yes boss_shot_telegraph=yes monetization=absent")
