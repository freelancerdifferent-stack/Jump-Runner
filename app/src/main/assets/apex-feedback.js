'use strict';
// Small world-space cue at the top of a jump. It improves timing readability without
// changing jump physics, input windows, collision, score, or Flow.
(()=>{
  let pulse=0;
  let px=0;
  let py=0;
  let previousVy=0;
  const reduced=()=>matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
  const baseUpdate=update;
  const baseDraw=drawWorld;

  update=function(dt){
    const before=player.vy;
    baseUpdate(dt);
    if(state==='play'&&!player.onGround&&before<0&&player.vy>=0){
      pulse=reduced()?.12:.22;
      px=player.x+player.w*.5;
      py=player.y+player.h*.5;
    }
    previousVy=player.vy;
    pulse=Math.max(0,pulse-dt);
  };

  drawWorld=function(){
    baseDraw();
    if(pulse<=0)return;
    const life=Math.min(1,pulse/.22);
    const radius=18+(1-life)*18;
    ctx.save();
    ctx.globalAlpha=.55*life;
    ctx.strokeStyle='#9eefff';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(px-cam,py,radius,Math.PI*.1,Math.PI*.9);
    ctx.stroke();
    ctx.globalAlpha=.28*life;
    ctx.beginPath();
    ctx.moveTo(px-cam-24,py);
    ctx.lineTo(px-cam+24,py);
    ctx.stroke();
    ctx.restore();
  };
})();
