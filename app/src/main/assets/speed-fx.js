'use strict';
// Lightweight momentum feedback: speed lines, dash bloom, landing ring and one-shot pace milestone accents.
// Visual only; physics, scoring and difficulty remain untouched.
let speedFxPhase=0,speedFxLand=0,lastGround=true,speedFxPacePulse=0,speedFxMaxPace=false;
const speedFxBaseUpdate=update,speedFxBaseDrawWorld=drawWorld;
function sentinelArenaPinned(){
 return typeof boss!=='undefined'&&typeof BOSS_ARENA_LIMIT!=='undefined'&&boss.active&&!boss.dead&&player.x>=BOSS_ARENA_LIMIT-1;
}
function speedFxReducedMotion(){return document.documentElement.hasAttribute('data-reduced-motion');}
addEventListener('jumprunnerpacemilestone',e=>{
 speedFxPacePulse=speedFxReducedMotion()?.18:(e.detail&&e.detail.max?.72:.46);
 speedFxMaxPace=Boolean(e.detail&&e.detail.max);
});
update=function(dt){
 speedFxBaseUpdate(dt);
 speedFxPacePulse=Math.max(0,speedFxPacePulse-dt);
 if(speedFxPacePulse<=0)speedFxMaxPace=false;
 if(state!=='play')return;
 const arenaPinned=sentinelArenaPinned();
 if(!arenaPinned)speedFxPhase=(speedFxPhase+dt*(2.2+Math.min(2.8,time*.06)+(player.dash>0?5:0)))%1;
 if(!lastGround&&player.onGround&&player.vy===0)speedFxLand=.18;
 speedFxLand=Math.max(0,speedFxLand-dt);lastGround=player.onGround;
};
function drawMomentumFx(){
 ctx.save();ctx.setTransform(1,0,0,1,0,0);
 const arenaPinned=sentinelArenaPinned();
 const intensity=Math.min(1,.18+time/26+(player.dash>0?.55:0));
 if(!arenaPinned){
  ctx.globalAlpha=.12*intensity;ctx.strokeStyle=player.dash>0?'#ffd86b':'#9eefff';ctx.lineWidth=2;
  for(let i=0;i<12;i++){
   const y=54+((i*41+speedFxPhase*520)%420),x=VW-((i*97+speedFxPhase*760)%VW),len=26+intensity*58;
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-len,y);ctx.stroke();
  }
 }
 if(speedFxPacePulse>0&&!arenaPinned){
  const maxDuration=speedFxMaxPace?.72:(speedFxReducedMotion()?.18:.46),p=Math.max(0,Math.min(1,speedFxPacePulse/maxDuration));
  ctx.globalAlpha=(speedFxReducedMotion()?.08:.17)*p;
  ctx.strokeStyle=speedFxMaxPace?'#ffd86b':'#69edff';
  ctx.lineWidth=speedFxMaxPace?3:2;
  const extra=speedFxReducedMotion()?4:10;
  for(let i=0;i<extra;i++){
   const y=70+((i*53+speedFxPhase*610)%380),x=VW-((i*131+speedFxPhase*910)%VW),len=64+(1-p)*42+(speedFxMaxPace?42:0);
   ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-len,y);ctx.stroke();
  }
  ctx.globalAlpha=(speedFxReducedMotion()?.035:.08)*p;
  ctx.fillStyle=speedFxMaxPace?'#ffd86b':'#69edff';
  ctx.fillRect(0,0,VW,VH);
 }
 // Keep the action-confirming Dash bloom even while the runner is pinned in the boss arena.
 if(player.dash>0){const g=ctx.createRadialGradient(VW*.25,VH*.55,12,VW*.25,VH*.55,180);g.addColorStop(0,'rgba(255,216,107,.16)');g.addColorStop(1,'rgba(255,216,107,0)');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);}
 if(speedFxLand>0){const p=1-speedFxLand/.18,r=18+p*78;ctx.globalAlpha=(1-p)*.28;ctx.strokeStyle='#9eefff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse((player.x-cam)+player.w/2,GROUND-3,r,r*.24,0,0,Math.PI*2);ctx.stroke();}
 ctx.restore();
}
drawWorld=function(){speedFxBaseDrawWorld();drawMomentumFx();};
