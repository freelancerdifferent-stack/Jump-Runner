'use strict';
// Final-arena HUD polish: the runner is intentionally held in place during the Sentinel fight,
// so replace the normal forward-speed readout with an explicit combat-state readout.
const sentinelArenaSpeedBaseDraw=draw;
function sentinelArenaSpeedPinned(){
  return state==='play'&&typeof boss!=='undefined'&&typeof BOSS_ARENA_LIMIT!=='undefined'&&boss.active&&!boss.dead&&player.x>=BOSS_ARENA_LIMIT-1;
}
function sentinelArenaCombatLabel(){
  if(typeof boss==='undefined')return 'ARENA LOCK';
  if(boss.coreOpen)return player.dashCd<=.001?'CORE OPEN · DASH':'CORE OPEN · STOMP';
  if(boss.passSpent)return 'HIT CONFIRMED · RESET';
  return 'ARENA LOCK · CORE '+boss.hp+'/'+boss.maxHp;
}
draw=function(){
  sentinelArenaSpeedBaseDraw();
  if(!sentinelArenaSpeedPinned())return;
  toGame();
  ctx.save();
  ctx.fillStyle='#020711';
  ctx.fillRect(0,VH-30,220,30);
  ctx.fillStyle=boss.coreOpen?'#ffd86b':'#74f7c5';
  ctx.font='800 11px system-ui';
  ctx.fillText(sentinelArenaCombatLabel(),16,VH-11);
  ctx.restore();
  fromGame();
};
