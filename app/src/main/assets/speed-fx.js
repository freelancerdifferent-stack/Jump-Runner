'use strict';
// Lightweight momentum feedback: speed lines, dash bloom, landing ring. Visual only; physics untouched.
let speedFxPhase=0,speedFxLand=0,lastGround=true;
const speedFxBaseUpdate=update,speedFxBaseDrawWorld=drawWorld;
update=function(dt){
 speedFxBaseUpdate(dt);
 if(state!=='play')return;
 speedFxPhase=(speedFxPhase+dt*(2.2+Math.min(2.8,time*.06)+(player.dash>0?5:0)))%1;
 if(!lastGround&&player.onGround&&player.vy===0)speedFxLand=.18;
 speedFxLand=Math.max(0,speedFxLand-dt);lastGround=player.onGround;
};
function drawMomentumFx(){
 ctx.save();ctx.setTransform(1,0,0,1,0,0);
 const intensity=Math.min(1,.18+time/26+(player.dash>0?.55:0));
 ctx.globalAlpha=.12*intensity;ctx.strokeStyle=player.dash>0?'#ffd86b':'#9eefff';ctx.lineWidth=2;
 for(let i=0;i<12;i++){
  const y=54+((i*41+speedFxPhase*520)%420),x=VW-((i*97+speedFxPhase*760)%VW),len=26+intensity*58;
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-len,y);ctx.stroke();
 }
 if(player.dash>0){const g=ctx.createRadialGradient(VW*.25,VH*.55,12,VW*.25,VH*.55,180);g.addColorStop(0,'rgba(255,216,107,.16)');g.addColorStop(1,'rgba(255,216,107,0)');ctx.globalAlpha=1;ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);}
 if(speedFxLand>0){const p=1-speedFxLand/.18,r=18+p*78;ctx.globalAlpha=(1-p)*.28;ctx.strokeStyle='#9eefff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse((player.x-cam)+player.w/2,GROUND-3,r,r*.24,0,0,Math.PI*2);ctx.stroke();}
 ctx.restore();
}
drawWorld=function(){speedFxBaseDrawWorld();drawMomentumFx();};
