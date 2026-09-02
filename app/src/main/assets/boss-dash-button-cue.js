'use strict';
// Connects the Sentinel's brief attack window to the only forward attack input on touch devices.
(()=>{
  const dashButton=document.getElementById('dashBtn');
  if(!dashButton)return;
  let previousOpen=false;
  const style=document.createElement('style');
  style.textContent=`
    #dashBtn.sentinel-strike-window{box-shadow:0 0 0 2px #74f7c5aa,0 0 24px #74f7c599,0 0 48px #74f7c544;transform:scale(1.06)}
    #dashBtn.sentinel-strike-window::after{content:'HIT NOW';position:absolute;left:50%;top:-24px;transform:translateX(-50%);padding:3px 8px;border-radius:999px;background:#07101ee8;border:1px solid #74f7c5;color:#dffff3;font:900 9px system-ui;letter-spacing:1px;white-space:nowrap;pointer-events:none}
    #dashBtn.sentinel-strike-pop{animation:sentinelDashStrikePop .34s ease-out}
    @keyframes sentinelDashStrikePop{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1.06)}}
    @media (prefers-reduced-motion:reduce){
      #dashBtn.sentinel-strike-window{transform:none}
      #dashBtn.sentinel-strike-pop{animation:none}
    }
  `;
  document.head.appendChild(style);
  const baseUpdate=window.update;
  if(typeof baseUpdate!=='function')return;
  window.update=function(dt){
    baseUpdate(dt);
    const open=state==='play'&&typeof boss!=='undefined'&&boss.active&&!boss.dead&&boss.coreOpen;
    const dashReady=open&&player.dashCd<=0.001;
    dashButton.classList.toggle('sentinel-strike-window',dashReady);
    if(dashReady&&!previousOpen){
      dashButton.classList.remove('sentinel-strike-pop');
      void dashButton.offsetWidth;
      dashButton.classList.add('sentinel-strike-pop');
    }
    if(!dashReady)dashButton.classList.remove('sentinel-strike-pop');
    previousOpen=dashReady;
  };
  const baseReset=window.resetRun;
  if(typeof baseReset==='function')window.resetRun=function(){previousOpen=false;dashButton.classList.remove('sentinel-strike-window','sentinel-strike-pop');baseReset();};
})();
