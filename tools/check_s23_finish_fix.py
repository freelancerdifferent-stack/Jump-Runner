from pathlib import Path

assets=Path('app/src/main/assets')
html=(assets/'index.html').read_text(encoding='utf-8')
fix=(assets/'s23-finish-fix.js').read_text(encoding='utf-8')
assert 's23-finish-fix.js' in html, 'runtime fix not loaded'
assert 'scale=h/VH' in fix, 'ultrawide viewport scaling missing'
assert 'FINISH LOCKED' in fix, 'boss-gated finish message missing'
assert 'player.x=Math.min(player.x,LEVEL_END-520)' in fix, 'finish loop clamp missing'
print('s23_finish_fix=ok')
