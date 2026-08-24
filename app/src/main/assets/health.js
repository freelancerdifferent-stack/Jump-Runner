'use strict';
// Health layer: non-lethal hazards cost integrity first, while falls remain lethal.
let health=3,maxHealth=3;
const healthEl=document.getElementById('health');
const baseHealthReset=resetRun,baseHealthKill=kill,baseHealthShowResult=showResult;
const baseActivateCheckpoint=typeof activateCheckpoint==='function'?activateCheckpoint:null;
const baseRestoreCheckpoint=typeof restoreCheckpoint==='function'?restoreCheckpoint:null;

function renderHealth(){if(healthEl)healthEl.textContent='◆'.repeat(Math.max(0,health))+'◇'.repeat(Math.max(0,maxHealth-health));}
function applyDamage(reason){
  if(state!=='play'||player.inv>0)return;
  health=Math.max(0,health-1);flow=1;flowTimer=0;score=Math.max(0,score-220);shake=Math.max(shake,13);
  flash.classList.remove('on');void flash.offsetWidth;flash.classList.add('on');
  burst(player.x+player.w/2,player.y+player.h/2,'#ff7b91',22,220);
  player.inv=1.05;player.vy=Math.min(player.vy,-390);player.dash=0;
  renderHealth();
  if(health<=0)baseHealthKill(reason);
}
kill=function(reason){
  if(String(reason).includes('fell below the skyline')){health=0;renderHealth();baseHealthKill(reason);return;}
  applyDamage(reason);
};
resetRun=function(){health=maxHealth;renderHealth();baseHealthReset();};
showResult=function(win){baseHealthShowResult(win);if(!win){const sub=panel.querySelector('.sub');if(sub&&health<=0)sub.textContent+=' · Integrity depleted.';}renderHealth();};

if(baseActivateCheckpoint){activateCheckpoint=function(index){baseActivateCheckpoint(index);if(checkpointSnapshot)checkpointSnapshot.health=health;};}
if(baseRestoreCheckpoint){restoreCheckpoint=function(){baseRestoreCheckpoint();health=Math.max(2,checkpointSnapshot&&checkpointSnapshot.health||2);player.inv=Math.max(player.inv,1.35);renderHealth();};}

renderHealth();
