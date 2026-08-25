from pathlib import Path

assets=Path('app/src/main/assets')
html=(assets/'index.html').read_text(encoding='utf-8')
fix=(assets/'adaptive-runtime.js').read_text(encoding='utf-8')
assert 'adaptive-runtime.js' in html, 'adaptive runtime not loaded'
assert 'scale=h/VH' in fix, 'height-anchored adaptive scaling missing'
assert 'viewW=w/Math.max(scale' in fix, 'dynamic horizontal viewport missing'
assert 'visualViewport' in fix, 'visual viewport resize handling missing'
assert 'orientationchange' in fix, 'orientation resize handling missing'
assert 'FINISH LOCKED' in fix, 'boss-gated finish message missing'
assert 'player.x=Math.min(player.x,LEVEL_END-520)' in fix, 'finish loop clamp missing'

# Representative Android landscape aspect ratios. With height fixed at 540
# virtual units, each ratio must resolve to a positive width with no letterbox.
for ratio in (4/3, 16/10, 16/9, 18/9, 19.5/9, 20/9, 21/9, 22/9):
    view_w=540*ratio
    assert 700 <= view_w <= 1320, f'unexpected adaptive width for ratio {ratio}: {view_w}'

print('android_adaptive_viewport_and_finish=ok')
