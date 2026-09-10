'use strict';
// Visual-only combat lane guidance for the two-button Sentinel encounter.
// The marker makes the vulnerable pass readable without changing boss timing or hitboxes.
(()=>{
  if(typeof boss==='undefined'||typeof player==='undefined'||typeof drawWorld!=='function')return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const base=drawWorld;
  drawWorld=function(){
    base();
    if(state!=='play')return;
    const vulnerable=boss.active&&!boss.dead&&boss.coreOpen;
    const charging=boss.active&&!boss.dead&&!boss.coreOpen&&boss.intro<=0&&!boss.passSpent&&boss.hitCd<=0&&boss.recoil<=0;
    if(!vulnerable&&!charging)return;
    const sx=boss.x-cam,feet=GROUND;
    if(sx<-120||sx>VW+120)return;
    const open=vulnerable;
    ctx.save();
    const pulse=reduced.matches?1:(.78+.22*Math.sin(boss.t*8));
    const alpha=open?.34:.12;
    ctx.globalAlpha=alpha*pulse;
    const grad=ctx.createLinearGradient(sx-120,feet-5,sx+55,feet-5);
    grad.addColorStop(0,'rgba(116,247,197,0)');
    grad.addColorStop(.58,open?'rgba(116,247,197,.9)':'rgba(255,216,107,.55)');
    grad.addColorStop(1,'rgba(116,247,197,0)');
    ctx.fillStyle=grad;
    ctx.fillRect(sx-120,feet-8,175,6);
    ctx.globalAlpha=(open?.95:.5)*pulse;
    ctx.strokeStyle=open?'#74f7c5':'#ffd86b';
    ctx.lineWidth=open?2.5:1.5;
    ctx.setLineDash(open?[]:[7,7]);
    ctx.beginPath();
    ctx.moveTo(sx-90,feet-14);
    ctx.lineTo(sx+24,feet-14);
    ctx.stroke();
    if(open){
      ctx.setLineDash([]);
      ctx.fillStyle='#74f7c5';
      ctx.beginPath();
      ctx.moveTo(sx+24,feet-20);
      ctx.lineTo(sx+40,feet-14);
      ctx.lineTo(sx+24,feet-8);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  };
})();
