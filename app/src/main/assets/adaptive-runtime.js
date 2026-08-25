'use strict';
(()=>{
  // Adaptive landscape viewport for Android phones, tablets and foldables.
  // Physics keep the same 540-unit vertical world; horizontal visibility follows
  // the full WebView surface. Safe-area insets are reserved for HUD/controls only.
  let viewW=VW;
  let surfaceW=innerWidth;
  let surfaceH=innerHeight;
  let resizeFrame=0;
  let lastSurfaceKey='';

  function readSurface(){
    const root=document.documentElement;
    const vv=window.visualViewport;
    const widths=[innerWidth||0,root?.clientWidth||0,vv?.width||0].filter(v=>v>0);
    const heights=[innerHeight||0,root?.clientHeight||0,vv?.height||0].filter(v=>v>0);
    return {w:Math.max(1,...widths),h:Math.max(1,...heights)};
  }

  function adaptiveResize(force=false){
    const d=Math.min(devicePixelRatio||1,2);
    const surface=readSurface();
    const key=`${Math.round(surface.w)}x${Math.round(surface.h)}@${d}`;
    if(!force&&key===lastSurfaceKey)return;
    lastSurfaceKey=key;
    surfaceW=surface.w;surfaceH=surface.h;
    canvas.width=Math.round(surfaceW*d);canvas.height=Math.round(surfaceH*d);
    canvas.style.width=surfaceW+'px';canvas.style.height=surfaceH+'px';
    canvas.style.left='0';canvas.style.top='0';
    ctx.setTransform(d,0,0,d,0,0);
    scale=surfaceH/VH;
    viewW=surfaceW/Math.max(scale,.0001);
    ox=0;oy=0;
    window.__JR_VIEW_W=viewW;
    window.__JR_ASPECT=surfaceW/surfaceH;
    window.__JR_SURFACE={width:surfaceW,height:surfaceH,visualWidth:window.visualViewport?.width||0,innerWidth:innerWidth||0};
  }
  function queueResize(force=false){cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(()=>adaptiveResize(force));}
  resize=()=>queueResize(true);

  drawSky=function(){
    const g=ctx.createLinearGradient(0,0,0,VH);
    g.addColorStop(0,'#0d1f3f');g.addColorStop(.56,'#173f63');g.addColorStop(1,'#08111e');
    ctx.fillStyle=g;ctx.fillRect(0,0,viewW,VH);
    const sunX=Math.max(120,Math.min(viewW-120,viewW*.76-cam*.025));
    ctx.fillStyle='#ffd87822';ctx.beginPath();ctx.arc(sunX,116,78,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffd87855';ctx.beginPath();ctx.arc(sunX,116,39,0,Math.PI*2);ctx.fill();
    for(let layer=0;layer<3;layer++){
      const base=['#0d1b2d','#10243a','#15324b'][layer],par=.08+layer*.07;
      ctx.fillStyle=base;
      const count=Math.ceil(viewW/180)+5;
      for(let i=0;i<count;i++){
        const x=i*180-(cam*par%180)-180,w=70+(i%4)*25,h=50+((i*41)%110)+layer*35;
        ctx.fillRect(x,VH-74-h,w,h);
        ctx.fillStyle='#6de8ff0b';
        for(let k=0;k<3;k++)ctx.fillRect(x+12+k*18,VH-62-h,8,14);
        ctx.fillStyle=base;
      }
    }
  };

  draw=function(){
    ctx.clearRect(0,0,surfaceW,surfaceH);toGame();
    const sx=shake?(Math.random()-.5)*shake:0,sy=shake?(Math.random()-.5)*shake:0;
    ctx.translate(sx,sy);shake*=.86;drawSky();drawWorld();
    ctx.fillStyle='#02071188';ctx.fillRect(0,VH-28,viewW,28);
    if(state==='play'){
      ctx.fillStyle='#ffffff6b';ctx.font='700 11px system-ui';ctx.fillText(`SPEED ${Math.round(340+Math.min(115,time*3.2))}`,16,VH-10);
      if(player.dashCd>0){ctx.fillStyle='#ffd86b55';ctx.fillRect(Math.max(12,viewW-150),VH-17,120*(1-player.dashCd/.72),4);}
    }
    fromGame();
  };

  // Prevent the core LEVEL_END condition from repeatedly entering the result
  // transition while the final boss is still alive.
  const chainedShowResult=showResult;
  let finishGateCooldown=0;
  showResult=function(win){
    if(win&&typeof boss!=='undefined'&&!boss.dead){
      state='play';paused=false;deathReason='';
      player.x=Math.min(player.x,LEVEL_END-520);
      player.inv=Math.max(player.inv,1.0);player.dash=0;
      cam=Math.max(0,player.x-Math.min(210,viewW*.28));
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
  update=function(dt){finishGateCooldown=Math.max(0,finishGateCooldown-dt);chainedUpdate(dt);};

  addEventListener('resize',()=>queueResize());
  addEventListener('orientationchange',()=>setTimeout(()=>queueResize(true),120));
  window.visualViewport?.addEventListener('resize',()=>queueResize());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(()=>queueResize(true),60);});
  addEventListener('pageshow',()=>queueResize(true));
  adaptiveResize(true);
})();
