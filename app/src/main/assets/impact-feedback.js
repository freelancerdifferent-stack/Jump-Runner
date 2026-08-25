'use strict';
// Impact feedback adds a short, readable hit reaction without altering physics, damage, or timing.
let impactPulse=0;
let impactReason='';
const baseImpactDamage=applyDamage;
applyDamage=function(reason){
  const before=health;
  baseImpactDamage(reason);
  if(health<before){
    impactPulse=.34;
    impactReason=String(reason||'');
  }
};
const baseImpactUpdate=update;
update=function(dt){
  baseImpactUpdate(dt);
  impactPulse=Math.max(0,impactPulse-dt);
};
const baseImpactReset=resetRun;
resetRun=function(){impactPulse=0;impactReason='';baseImpactReset();};
const baseImpactDrawWorld=typeof drawWorld==='function'?drawWorld:null;
if(baseImpactDrawWorld){
  drawWorld=function(){
    baseImpactDrawWorld();
    if(impactPulse<=0)return;
    const t=impactPulse/.34;
    const px=player.x-cam+player.w/2,py=player.y+player.h/2;
    ctx.save();
    ctx.globalAlpha=Math.min(.8,t*1.2);
    ctx.strokeStyle='#ff7b91';
    ctx.lineWidth=2+5*t;
    ctx.beginPath();ctx.arc(px,py,28+(1-t)*54,0,Math.PI*2);ctx.stroke();
    const edge=ctx.createRadialGradient(VW/2,VH/2,150,VW/2,VH/2,Math.max(VW,VH)*.72);
    edge.addColorStop(.45,'rgba(255,70,100,0)');
    edge.addColorStop(1,'rgba(255,70,100,'+(.22*t)+')');
    ctx.fillStyle=edge;ctx.fillRect(0,0,VW,VH);
    ctx.globalAlpha=Math.min(1,t*1.8);
    ctx.fillStyle='#ffd7de';ctx.font='900 11px system-ui';ctx.textAlign='center';
    ctx.fillText(health>0?'INTEGRITY HIT':'INTEGRITY DEPLETED',px,py-44);
    ctx.restore();
  };
}
