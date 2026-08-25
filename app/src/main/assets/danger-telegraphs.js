'use strict';
// Fairness polish: subtle, world-space warnings for hazards entering the player's reaction window.
const dangerBaseDrawWorld=drawWorld;
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
drawWorld=function(){dangerBaseDrawWorld();drawDangerTelegraphs();};
