# Adaptive Android viewport + finish regression fix

This branch fixes two production issues reproduced on a Galaxy S23 Ultra but generalized for Android devices rather than tied to one model.

## Viewport behavior
- Landscape gameplay keeps a stable 540-unit virtual height.
- Virtual width is derived from the real device viewport aspect ratio.
- No horizontal stretching is used.
- Wide phones reveal more horizontal world; narrower tablets/phones reveal less.
- `visualViewport`, resize, and orientation changes are handled.
- Existing CSS safe-area insets continue to protect HUD/touch controls around cutouts and system areas.

Representative ratios covered by regression checks: 4:3, 16:10, 16:9, 18:9, 19.5:9, 20:9, 21:9, and 22:9.

## Finish behavior
The final result transition is locked while Sky Sentinel is alive. Reaching `LEVEL_END` no longer causes a repeated finish/result loop. Once the boss is defeated, the normal result chain is allowed to complete.
