'use strict';
// Makes the Sentinel damage window unmistakable on touch-only devices without altering combat physics.
// When Dash is unavailable, the cue follows the actual stomp setup state instead of giving a generic instruction.
// A shrinking meter mirrors the existing sinusoidal vulnerability window so players can read how much time remains.
(()=>{
  const cue=document.createElement('div');
  cue.className='boss-core-window-cue';
  cue.setAttribute('role','status');
  cue.setAttribute('aria-live','polite');
  cue.setAttribute('aria-atomic','true');
  cue.setAttribute('aria-hidden','true');
  cue.innerHTML='<strong>CORE OPEN</strong><span>DASH NOW</span><i class="boss-core-window-meter" aria-hidden="true"><b></b></i>';
  document.body.appendChild(cue);

  const style=document.createElement('style');
  style.textContent='.boss-core-window-cue{--core-window-progress:1;position:fixed;z-index:7;left:50%;bottom:max(88px,calc(env(safe-area-inset-bottom) + 72px));transform:translate(-50%,12px) scale(.94);min-width:132px;padding:8px 16px 9px;border:1px solid #74f7c577;border-radius:16px;background:#071712ed;box-shadow:0 12px 34px #0008,0 0 28px #74f7c52b;text-align:center;pointer-events:none;opacity:0;transition:opacity .12s ease,transform .14s ease,border-color .14s ease}.boss-core-window-cue.show{opacity:1;transform:translate(-50%,0) scale(1)}.boss-core-window-cue.closing{border-color:#ffd86b88;box-shadow:0 12px 34px #0008,0 0 24px #ffd86b26}.boss-core-window-cue.missed{border-color:#ffd86b66;background:#171307ed;box-shadow:0 12px 34px #0008,0 0 22px #ffd86b20}.boss-core-window-cue strong{display:block;color:#74f7c5;font-size:10px;font-weight:950;letter-spacing:.16em}.boss-core-window-cue.closing strong,.boss-core-window-cue.missed strong{color:#ffd86b}.boss-core-window-cue span{display:block;margin-top:2px;color:#fff;font-size:8px;font-weight:900;letter-spacing:.12em}.boss-core-window-meter{display:block;width:100%;height:3px;margin-top:6px;overflow:hidden;border-radius:99px;background:#ffffff1f}.boss-core-window-meter b{display:block;width:100%;height:100%;border-radius:inherit;background:#74f7c5;transform:scaleX(var(--core-window-progress));transform-origin:left center;transition:transform .05s linear,background .12s ease}.boss-core-window-cue.closing .boss-core-window-meter b{background:#ffd86b}.boss-core-window-cue.missed .boss-core-window-meter{visibility:hidden}@media(max-height:390px){.boss-core-window-cue{bottom:max(68px,calc(env(safe-area-inset-bottom) + 54px));padding:6px 13px 7px}.boss-core-window-cue strong{font-size:9px}.boss-core-window-cue span{font-size:7px}.boss-core-window-meter{margin-top:4px}}@media(prefers-reduced-motion:reduce){.boss-core-window-cue{transform:translate(-50%,0);transition:opacity .12s ease,border-color .14s ease}.boss-core-window-cue.show{transform:translate(-50%,0)}.boss-core-window-meter b{transition:none}}';
  document.head.appendChild(style);

  const CORE_OPEN_APPROACH=45/185;
  const CORE_OPEN_SIN=CORE_OPEN_APPROACH*2-1;
  const CORE_EDGE=Math.asin(-CORE_OPEN_SIN);
  const CORE_OPEN_PHASE=Math.PI+CORE_EDGE;
  const CORE_CLOSE_PHASE=Math.PI*2-CORE_EDGE;
  const CORE_PHASE_SPAN=CORE_CLOSE_PHASE-CORE_OPEN_PHASE;
  const TAU=Math.PI*2;

  let wasOpen=false,hpAtOpen=0,missedTimer=0,lastAction='',closingLabel=false;
  function currentAction(){
    if(player.dashCd<=.001)return'DASH NOW';
    if(player.onGround)return'JUMP → STOMP';
    if(player.vy<-80)return'RISE ABOVE CORE';
    return'LAND ON CORE';
  }
  function coreWindowProgress(){
    let phase=(boss.t*1.45-Math.PI/2)%TAU;
    if(phase<0)phase+=TAU;
    if(phase<=CORE_OPEN_PHASE)return 1;
    if(phase>=CORE_CLOSE_PHASE)return 0;
    return Math.max(0,Math.min(1,(CORE_CLOSE_PHASE-phase)/CORE_PHASE_SPAN));
  }
  function ensureMeter(){
    let meter=cue.querySelector('.boss-core-window-meter');
    if(!meter){
      meter=document.createElement('i');
      meter.className='boss-core-window-meter';
      meter.setAttribute('aria-hidden','true');
      meter.innerHTML='<b></b>';
      cue.appendChild(meter);
    }
  }
  function renderOpen(){
    cue.classList.remove('missed');
    const action=currentAction();
    const label=closingLabel?'CORE CLOSING':'CORE OPEN';
    if(lastAction!==action||cue.dataset.coreLabel!==label){
      cue.innerHTML='<strong>'+label+'</strong><span>'+action+'</span><i class="boss-core-window-meter" aria-hidden="true"><b></b></i>';
      cue.dataset.coreLabel=label;
      lastAction=action;
    }
    ensureMeter();
  }
  function updateMeter(){
    const progress=coreWindowProgress();
    const closing=progress<.34;
    cue.style.setProperty('--core-window-progress',progress.toFixed(3));
    if(closingLabel!==closing){closingLabel=closing;renderOpen();}
    cue.classList.toggle('closing',closing);
  }
  function renderMissed(){
    cue.classList.remove('closing');
    cue.classList.add('missed');
    cue.style.setProperty('--core-window-progress','0');
    cue.innerHTML='<strong>WINDOW MISSED</strong><span>NEXT PASS</span><i class="boss-core-window-meter" aria-hidden="true"><b></b></i>';
    cue.dataset.coreLabel='';
    closingLabel=false;
    lastAction='';
  }
  function refresh(dt){
    const open=state==='play'&&boss.active&&!boss.dead&&boss.coreOpen;
    missedTimer=Math.max(0,missedTimer-dt);
    if(open&&!wasOpen){hpAtOpen=boss.hp;missedTimer=0;closingLabel=false;cue.dataset.coreLabel='';renderOpen();}
    if(!open&&wasOpen&&state==='play'&&boss.active&&!boss.dead&&boss.hp===hpAtOpen){missedTimer=.62;renderMissed();}
    if(open){renderOpen();updateMeter();}
    else if(missedTimer<=0){closingLabel=false;cue.dataset.coreLabel='';cue.classList.remove('closing');cue.style.setProperty('--core-window-progress','1');}
    const visible=open||missedTimer>0;
    cue.classList.toggle('show',visible);
    cue.setAttribute('aria-hidden',String(!visible));
    wasOpen=open;
  }

  const base=updateBoss;
  updateBoss=function(dt){base(dt);refresh(dt);};
  const reset=resetBoss;
  resetBoss=function(){reset();wasOpen=false;hpAtOpen=0;missedTimer=0;lastAction='';closingLabel=false;cue.dataset.coreLabel='';cue.classList.remove('show','missed','closing');cue.style.setProperty('--core-window-progress','1');cue.setAttribute('aria-hidden','true');renderOpen();};
})();
