'use strict';
// Final-arena HUD polish: the runner is intentionally held in place during the Sentinel fight,
// so replace the normal forward-speed readout with an explicit combat-state readout.
const sentinelArenaSpeedBaseDraw=draw;
const sentinelArenaStatus=document.createElement('div');
sentinelArenaStatus.id='sentinelArenaStatus';
sentinelArenaStatus.setAttribute('role','status');
sentinelArenaStatus.setAttribute('aria-live','polite');
sentinelArenaStatus.setAttribute('aria-atomic','true');
Object.assign(sentinelArenaStatus.style,{position:'fixed',width:'1px',height:'1px',overflow:'hidden',clip:'rect(0 0 0 0)',clipPath:'inset(50%)',whiteSpace:'nowrap'});
document.body.appendChild(sentinelArenaStatus);
let sentinelArenaLastAnnouncement='';
function sentinelArenaSpeedPinned(){
  return state==='play'&&typeof boss!=='undefined'&&typeof BOSS_ARENA_LIMIT!=='undefined'&&boss.active&&!boss.dead&&player.x>=BOSS_ARENA_LIMIT-1;
}
function sentinelArenaCombatLabel(){
  if(typeof boss==='undefined')return 'ARENA LOCK';
  if(boss.intro>0)return 'SENTINEL ENGAGED';
  if(boss.hitCd>0)return 'HIT CONFIRMED · RESET';
  if(boss.coreOpen)return player.dashCd<=.001?'CORE OPEN · DASH':'CORE OPEN · STOMP';
  return 'TRACK CORE · '+boss.hp+'/'+boss.maxHp;
}
function sentinelArenaCombatColor(){
  if(typeof boss==='undefined')return '#74f7c5';
  if(boss.hitCd>0)return '#ffffff';
  return boss.coreOpen?'#ffd86b':'#74f7c5';
}
function sentinelArenaAccessibleLabel(label){
  if(label==='SENTINEL ENGAGED')return 'Sky Sentinel engaged. Track the core.';
  if(label==='HIT CONFIRMED · RESET')return 'Sentinel hit confirmed. Prepare for the next opening.';
  if(label==='CORE OPEN · DASH')return 'Sentinel core open. Dash now.';
  if(label==='CORE OPEN · STOMP')return 'Sentinel core open. Dash recharging. Stomp now.';
  if(label.startsWith('TRACK CORE · '))return 'Track Sentinel core. '+label.slice(13)+' integrity remaining.';
  return 'Sentinel arena active.';
}
function announceSentinelArenaState(label){
  const message=sentinelArenaAccessibleLabel(label);
  if(message===sentinelArenaLastAnnouncement)return;
  sentinelArenaLastAnnouncement=message;
  sentinelArenaStatus.textContent=message;
}
draw=function(){
  sentinelArenaSpeedBaseDraw();
  if(!sentinelArenaSpeedPinned()){
    sentinelArenaLastAnnouncement='';
    sentinelArenaStatus.textContent='';
    return;
  }
  const label=sentinelArenaCombatLabel();
  announceSentinelArenaState(label);
  toGame();
  ctx.save();
  ctx.fillStyle='#020711';
  ctx.fillRect(0,VH-30,248,30);
  ctx.fillStyle=sentinelArenaCombatColor();
  ctx.font='800 11px system-ui';
  ctx.fillText(label,16,VH-11);
  ctx.restore();
  fromGame();
};
