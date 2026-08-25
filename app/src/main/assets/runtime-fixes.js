'use strict';
(()=>{
  let viewW=VW;

  const baseResize=resize;
  resize=function(){
    const d=Math.min(devicePixelRatio||1,2),w=innerWidth,h=innerHeight;
    canvas.width=Math.round(w*d);
    canvas.height=Math.round(h*d);
    canvas.style.width=w+'px';
    canvas.style.height=h+'px';
    ctx.setTransform(d,0,0,d,0,0);
    const baseAspect=VW/VH;
    const aspect=w/Math.max(1,h);
    if(aspect>=baseAspect){
      scale=h/VH;
      ox=0;
      oy=0;
      viewW=w/Math.max(scale,.0001);
    }else{
      scale=w/VW;
      ox=0;
      oy=(h-VH*scale)/2;
      viewW=VW;
    }
    window.__JR_VIEW_W=viewW;
  };

  drawSky=function(){
    const g=ctx.createLinearGradient(0,0,0,VH);
    g.addColorStop(0,'#0d1f3f');g.addColorStop(.56,'#173f63');g.addColorStop(1,'#08111e');
    ctx.fillStyle=g;ctx.fillRect(0,0,viewW,VH);
    const sunX=viewW*.78-cam*.025;
    ctx.fillStyle='#ffd87822';ctx.beginPath();ctx.arc(sunX,116,78,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffd87855';ctx.beginPath();ctx.arc(sunX,116,39,0,Math.PI*2);ctx.fill();
    for(let layer=0;layer<3;layer++){
      ctx.fillStyle=['#0d1b2d','#10243a','#15324b'][layer];
      const par=.08+layer*.07;
      const count=Math.ceil(viewW/180)+3;
      for(let i=0;i<count;i++){
        const x=i*180-(cam*par%180)-90,w=70+(i%4)*25,h=50+((i*41)%110)+layer*35;
        ctx.fillRect(x,VH-74-h,w,h);
        ctx.fillStyle='#6de8ff0b';
        for(let k=0;k<3;k++)ctx.fillRect(x+12+k*18,VH-62-h,8,14);
        ctx.fillStyle=['#0d1b2d','#10243a','#15324b'][layer];
      }
    }
  };

  draw=function(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    toGame();
    const sx=shake?(Math.random()-.5)*shake:0,sy=shake?(Math.random()-.5)*shake:0;
    ctx.translate(sx,sy);shake*=.86;
    drawSky();drawWorld();
    ctx.fillStyle='#02071188';ctx.fillRect(0,VH-28,viewW,28);
    if(state==='play'){
      ctx.fillStyle='#ffffff6b';ctx.font='700 11px system-ui';ctx.fillText(`SPEED ${Math.round(340+Math.min(115,time*3.2))}`,16,VH-10);
      if(player.dashCd>0){ctx.fillStyle='#ffd86b55';ctx.fillRect(viewW-150,VH-17,120*(1-player.dashCd/.72),4);}
    }
    fromGame();
  };

  const previousFinish=showResult;
  let finishing=false;
  showResult=function(win){
    if(!win)return previousFinish(false);
    if(finishing||state==='win')return;
    finishing=true;
    try{
      previousFinish(true);
    }catch(err){
      console.error('Stable finish fallback',err);
      state='win';paused=false;
      try{
        overlay.classList.remove('hidden');
        const rank=crystals>=26&&time<34?'S':crystals>=22?'A':crystals>=16?'B':'C';
        panel.innerHTML=`<div class="eyebrow">TRIAL COMPLETE</div><h1>RANK <em>${rank}</em></h1><div class="sub">${time.toFixed(1)} seconds · ${crystals}/${totalCrystals} crystals · score ${Math.floor(score)}</div><div class="actions"><button class="btn" id="stableRetry">RUN AGAIN</button><button class="btn alt" id="stableHome">HOME</button></div>`;
        const retry=document.getElementById('stableRetry'),home=document.getElementById('stableHome');
        if(retry)retry.onclick=()=>{finishing=false;resetRun();};
        if(home)home.onclick=()=>{finishing=false;showMenu();};
        updateHud();
      }catch(fallbackError){console.error('Finish fallback render failed',fallbackError);}
    }
    setTimeout(()=>{finishing=false;},900);
  };

  addEventListener('resize',resize);
  addEventListener('orientationchange',()=>setTimeout(resize,80));
  resize();
})();
