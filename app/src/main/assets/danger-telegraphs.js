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
const gapStatus=document.createElement('div');
gapStatus.setAttribute('role','status');
gapStatus.setAttribute('aria-live','polite');
gapStatus.setAttribute('aria-atomic','true');
gapStatus.style.cssText='position:fixed;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';
document.body.appendChild(gapStatus);
let announcedGap=-1;
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
update=function(dt){
  dangerBaseUpdate(dt);
  if(state!=='play')return;
  const px=player.x+player.w;
  let next=null;
  for(const g of groundGaps){const dist=g.x-px;if(dist>0&&dist<500){next=g;break;}}
  if(next&&next.id!==announcedGap){announcedGap=next.id;gapStatus.textContent='Gap ahead. Jump.';}
  if(!next&&announcedGap>=0&&groundGaps[announcedGap]&&px>groundGaps[announcedGap].x+groundGaps[announcedGap].w){gapStatus.textContent='';}
};
drawWorld=function(){dangerBaseDrawWorld();drawDangerTelegraphs();};
const dangerBaseReset=resetRun;
resetRun=function(){announcedGap=-1;gapStatus.textContent='';dangerBaseReset();};
