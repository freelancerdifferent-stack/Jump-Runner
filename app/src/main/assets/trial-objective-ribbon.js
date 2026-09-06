'use strict';
// Briefly frames the run goals at launch without interrupting the auto-run flow.
(()=>{
  const ribbon=document.createElement('div');
  ribbon.className='trial-objective-ribbon';
  ribbon.setAttribute('role','status');
  ribbon.setAttribute('aria-live','polite');
  ribbon.setAttribute('aria-atomic','true');
  ribbon.setAttribute('aria-hidden','true');
  ribbon.innerHTML='<span>SKYLINE TRIAL</span><strong>RUN · COLLECT · DEFEAT SENTINEL</strong>';
  document.body.appendChild(ribbon);

  const style=document.createElement('style');
  style.textContent='.trial-objective-ribbon{position:fixed;z-index:8;left:50%;top:max(96px,calc(env(safe-area-inset-top) + 78px));transform:translate(-50%,-10px) scale(.97);min-width:270px;max-width:min(82vw,520px);padding:9px 18px 10px;border:1px solid #69edff55;border-radius:18px;background:#07111dea;box-shadow:0 14px 38px #0007,0 0 24px #69edff18;text-align:center;pointer-events:none;opacity:0;transition:opacity .18s ease,transform .22s ease}.trial-objective-ribbon.show{opacity:1;transform:translate(-50%,0) scale(1)}.trial-objective-ribbon span{display:block;color:#69edff;font-size:9px;font-weight:950;letter-spacing:.18em}.trial-objective-ribbon strong{display:block;margin-top:3px;color:#fff;font-size:11px;font-weight:900;letter-spacing:.08em}@media(max-height:390px){.trial-objective-ribbon{top:max(70px,calc(env(safe-area-inset-top) + 54px));padding:7px 14px 8px}.trial-objective-ribbon span{font-size:8px}.trial-objective-ribbon strong{font-size:9px}}@media(prefers-reduced-motion:reduce){.trial-objective-ribbon{transform:translate(-50%,0);transition:opacity .12s ease}.trial-objective-ribbon.show{transform:translate(-50%,0)}}';
  document.head.appendChild(style);

  let timer=0,shownForRun=false;
  function hide(){timer=0;ribbon.classList.remove('show');ribbon.setAttribute('aria-hidden','true');}
  function show(){timer=2.35;shownForRun=true;ribbon.classList.add('show');ribbon.setAttribute('aria-hidden','false');}
  function refresh(dt){
    if(state!=='play'){if(state==='menu'||state==='dead'||state==='win')shownForRun=false;hide();return;}
    if(!shownForRun&&time<1.1)show();
    if(timer>0){timer=Math.max(0,timer-dt);if(timer===0)hide();}
  }

  const baseUpdate=update;
  update=function(dt){baseUpdate(dt);refresh(dt);};
  const baseReset=resetRun;
  resetRun=function(){shownForRun=false;hide();baseReset();};
  addEventListener('jumprunnerpause',hide);
})();
