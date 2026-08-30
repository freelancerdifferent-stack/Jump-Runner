'use strict';
// Fairness polish: subtle, world-space warnings for hazards entering the player's reaction window.
const dangerBaseDrawWorld=drawWorld;
const dangerBaseUpdate=update;
const groundRuns=platforms.filter(p=>p.y===GROUND).slice().sort((a,b)=>a.x-b.x);
const groundGaps=[];
for(let i=0;i<groundRuns.length-1;i++){
  const left=groundRuns[i],right=groundRuns[i+1],start=left.x+left.w,width=right.x-start;
  if(width>=56)groundGaps.push({x:start,w:width,id:i});
}
const hazardStatus=document.createElement('div');
hazardStatus.setAttribute('role','status');
hazardStatus.setAttribute('aria-live','polite');
hazardStatus.setAttribute('aria-atomic','true');
hazardStatus.style.cssText='position:fixed;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';
document.body.appendChild(hazardStatus);
let announcedHazards=new Set();
function dangerAlpha(distance,near=190,far=620){
  if(distance<=0||distance>=far)return 0;
  const t=1-(distance-near)/(far-near);
  return Math.max(0,Math.min(1,t));
}
function drawWarningMarker(x,y,label,color,alpha){
  if(alpha<=0)return;
  const pulse=.72+Math.sin(time*7+x*.01)*.18;
  ctx.save();ctx.globalAlpha=alpha*pulse;ctx.translate(x-cam,y);
  ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2;
  ctx.beginPath();ctx.arc(0,0,14,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-7,5);ctx.lineTo(0,-7);ctx.lineTo(7,5);ctx.closePath();ctx.fill();
  ctx.globalAlpha=alpha*.88;ctx.font='900 8px system-ui';ctx.textAlign='center';ctx.fillText(label,0,27);
  ctx.restore();
}
function drawDangerTelegraphs(){
  if(state!=='play')return;
  const px=player.x+player.w;
  for(let i=0;i<groundGaps.length;i++){
    const g=groundGaps[i],dist=g.x-px,a=dangerAlpha(dist,190,620);
    if(a>0)drawWarningMarker(g.x+Math.min(34,g.w*.35),GROUND-30,'GAP · JUMP','#69edff',a*.96);
  }
  for(let i=0;i<spikes.length;i++){
    const s=spikes[i],dist=s.x-px,a=dangerAlpha(dist,170,560);
    if(a>0)drawWarningMarker(s.x+s.w/2,s.y-22,'JUMP','#ff6f86',a);
  }
  for(let i=0;i<barriers.length;i++){
    if(broken.has(i))continue;
    const b=barriers[i],dist=b.x-px,a=dangerAlpha(dist,180,600);
    if(a>0)drawWarningMarker(b.x+b.w/2,b.y-24,'DASH','#ffd86b',a);
  }
  for(let i=0;i<drones.length;i++){
    if(defeated.has(i))continue;
    const d=droneRect(drones[i]),dist=d.x-px,a=dangerAlpha(dist,210,650);
    if(a>0)drawWarningMarker(d.x+d.w/2,d.y-22,'DASH / STOMP','#69edff',a*.92);
  }
}
function nextAccessibleHazard(px){
  let best=null;
  const consider=(key,x,message,limit=500)=>{
    const distance=x-px;
    if(distance<=0||distance>=limit||announcedHazards.has(key))return;
    if(!best||distance<best.distance)best={key,distance,message};
  };
  for(const g of groundGaps)consider('gap:'+g.id,g.x,'Gap ahead. Jump.');
  for(let i=0;i<spikes.length;i++)consider('spike:'+i,spikes[i].x,'Spikes ahead. Jump.');
  for(let i=0;i<barriers.length;i++)if(!broken.has(i))consider('barrier:'+i,barriers[i].x,'Barrier ahead. Dash.');
  for(let i=0;i<drones.length;i++)if(!defeated.has(i)){
    const d=droneRect(drones[i]);
    consider('drone:'+i,d.x,'Drone ahead. Dash or stomp.',540);
  }
  return best;
}
update=function(dt){
  dangerBaseUpdate(dt);
  if(state!=='play')return;
  const next=nextAccessibleHazard(player.x+player.w);
  if(next){
    announcedHazards.add(next.key);
    hazardStatus.textContent=next.message;
  }
};
drawWorld=function(){dangerBaseDrawWorld();drawDangerTelegraphs();};
const dangerBaseReset=resetRun;
resetRun=function(){announcedHazards=new Set();hazardStatus.textContent='';dangerBaseReset();};
