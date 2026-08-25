'use strict';
(()=>{
  // S23 Ultra / ultrawide landscape support. Keep the 540-unit gameplay height,
  // but expose more horizontal world instead of letterboxing a fixed 16:9 view.
  let viewW=VW;
  resize=function(){
    const d=Math.min(devicePixelRatio||1,2),w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);
    canvas.width=Math.round(w*d);canvas.height=Math.round(h*d);
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(d,0,0,d,0,0);
    scale=h/VH;
    viewW=w/scale;
    ox=0;oy=0;
  };

  drawSky=function(){
    const g=ctx.createLinearGradient(0,0,0,VH);
    g.addColorStop(0,'#0d1f3f');g.addColorStop(.56,'#173f63');g.addColorStop(1,'#08111e');
    ctx.fillStyle=g;ctx.fillRect(0,0,viewW,VH);
    const sunX=Math.min(viewW-150,760)-cam*.025;
    ctx.fillStyle='#ffd87822';ctx.beginPath();ctx.arc(sunX,116,78,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffd87855';ctx.beginPath();ctx.arc(sunX,116,39,0,Math.PI*2);ctx.fill();
    const count=Math.ceil(viewW/180)+3;
    for(let layer=0;layer<3;layer++){
      const base=['#0d1b2d','#10243a','#15324b'][layer],par=.08+layer*.07;
      ctx.fillStyle=base;
      for(let i=0;i<count;i++){
        const x=i*180-(cam*par%180)-90,w=70+(i%4)*25,h=50+((i*41)%110)+layer*35;
        ctx.fillRect(x,VH-74-h,w,h);
        ctx.fillStyle='#6de8ff0b';
        for(let k=0;k<3;k++)ctx.fillRect(x+12+k*18,VH-62-h,8,14);
        ctx.fillStyle=base;
      }
    }
  };

  // The old boss wrapper sent the runner back from LEVEL_END every time the
  // Sentinel was still alive, producing the visible finish-loop. Turn that
  // into an explicit locked finish gate instead of repeatedly entering result.
  const chainedShowResult=showResult;
  let finishGateCooldown=0;
  showResult=function(win){
    if(win&&typeof boss!=='undefined'&&!boss.dead){
      state='play';paused=false;deathReason='';
      player.x=Math.min(player.x,LEVEL_END-520);
      player.inv=Math.max(player.inv,1.0);player.dash=0;
      cam=Math.max(0,player.x-210);
      overlay.classList.add('hidden');pauseEl.classList.remove('show');
      last=performance.now();
      if(finishGateCooldown<=0){
        finishGateCooldown=2.5;
        if(typeof showTip==='function')showTip('FINISH LOCKED · DEFEAT THE SKY SENTINEL FIRST');
      }
      return;
    }
    return chainedShowResult(win);
  };

  const chainedUpdate=update;
  update=function(dt){
    finishGateCooldown=Math.max(0,finishGateCooldown-dt);
    chainedUpdate(dt);
  };

  addEventListener('resize',resize);
  resize();
})();
