'use strict';
// Final-arena HUD polish: the runner is intentionally held in place during the Sentinel fight,
// so replace the normal forward-speed readout with an explicit arena-lock state.
const sentinelArenaSpeedBaseDraw=draw;
function sentinelArenaSpeedPinned(){
  return state==='play'&&typeof boss!=='undefined'&&typeof BOSS_ARENA_LIMIT!=='undefined'&&boss.active&&!boss.dead&&player.x>=BOSS_ARENA_LIMIT-1;
}
draw=function(){
  sentinelArenaSpeedBaseDraw();
  if(!sentinelArenaSpeedPinned())return;
  toGame();
  ctx.save();
  ctx.fillStyle='#020711';
  ctx.fillRect(0,VH-28,154,28);
  ctx.fillStyle='#74f7c5';
  ctx.font='800 11px system-ui';
  ctx.fillText('ARENA LOCK',16,VH-10);
  ctx.restore();
  fromGame();
};
