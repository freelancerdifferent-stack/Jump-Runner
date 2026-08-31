'use strict';
// Small world-space cue at the top of a jump. It improves timing readability without
// changing jump physics, input windows, collision, score, or Flow. During the guided
// first run it also reinforces the variable-jump lesson with a restrained SHORT HOP /
// FULL ARC label based on how long Jump was held on that takeoff.
(()=>{
  let pulse=0;
  let px=0;
  let py=0;
  let holdTime=0;
  let airborne=false;
  let shapeLabel='';
  const reduced=()=>matchMedia?.('(prefers-reduced-motion: reduce)')?.matches===true;
  const guideActive=()=>typeof tutorialActive==='function'&&tutorialActive();
  const baseUpdate=update;
  const baseDraw=drawWorld;

  update=function(dt){
    const beforeVy=player.vy;
    const wasGrounded=player.onGround;
    baseUpdate(dt);

    if(wasGrounded&&!player.onGround&&player.vy<0){
      airborne=true;
      holdTime=0;
      shapeLabel='';
    }
    if(airborne&&!player.onGround&&player.vy<0&&player.jumpHeld)holdTime+=dt;

    if(state==='play'&&airborne&&!player.onGround&&beforeVy<0&&player.vy>=0){
      pulse=reduced()?.12:.22;
      px=player.x+player.w*.5;
      py=player.y+player.h*.5;
      shapeLabel=holdTime>=.11?'FULL ARC':'SHORT HOP';
    }
    if(player.onGround&&airborne)airborne=false;
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
    if(guideActive()&&shapeLabel){
      ctx.globalAlpha=.72*life;
      ctx.fillStyle='#dff9ff';
      ctx.font='800 9px system-ui';
      ctx.textAlign='center';
      ctx.fillText(shapeLabel,px-cam,py-24);
    }
    ctx.restore();
  };
})();
