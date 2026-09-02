'use strict';
// Makes the Sentinel damage window unmistakable on touch-only devices without altering combat physics.
// A brief missed-window acknowledgement teaches the pass rhythm without punishing or interrupting play.
(()=>{
  const cue=document.createElement('div');
  cue.className='boss-core-window-cue';
  cue.setAttribute('role','status');
  cue.setAttribute('aria-live','polite');
  cue.setAttribute('aria-atomic','true');
  cue.setAttribute('aria-hidden','true');
  cue.innerHTML='<strong>CORE OPEN</strong><span>DASH NOW</span>';
  document.body.appendChild(cue);

  const style=document.createElement('style');
  style.textContent='.boss-core-window-cue{position:fixed;z-index:7;left:50%;bottom:max(88px,calc(env(safe-area-inset-bottom) + 72px));transform:translate(-50%,12px) scale(.94);min-width:132px;padding:8px 16px 9px;border:1px solid #74f7c577;border-radius:16px;background:#071712ed;box-shadow:0 12px 34px #0008,0 0 28px #74f7c52b;text-align:center;pointer-events:none;opacity:0;transition:opacity .12s ease,transform .14s ease,border-color .14s ease}.boss-core-window-cue.show{opacity:1;transform:translate(-50%,0) scale(1)}.boss-core-window-cue.missed{border-color:#ffd86b66;background:#171307ed;box-shadow:0 12px 34px #0008,0 0 22px #ffd86b20}.boss-core-window-cue strong{display:block;color:#74f7c5;font-size:10px;font-weight:950;letter-spacing:.16em}.boss-core-window-cue.missed strong{color:#ffd86b}.boss-core-window-cue span{display:block;margin-top:2px;color:#fff;font-size:8px;font-weight:900;letter-spacing:.12em}@media(max-height:390px){.boss-core-window-cue{bottom:max(68px,calc(env(safe-area-inset-bottom) + 54px));padding:6px 13px 7px}.boss-core-window-cue strong{font-size:9px}.boss-core-window-cue span{font-size:7px}}@media(prefers-reduced-motion:reduce){.boss-core-window-cue{transform:translate(-50%,0);transition:opacity .12s ease,border-color .14s ease}.boss-core-window-cue.show{transform:translate(-50%,0)}}';
  document.head.appendChild(style);

  let wasOpen=false,hpAtOpen=0,missedTimer=0;
  function renderOpen(){
    cue.classList.remove('missed');
    cue.innerHTML='<strong>CORE OPEN</strong><span>DASH NOW</span>';
  }
  function renderMissed(){
    cue.classList.add('missed');
    cue.innerHTML='<strong>WINDOW MISSED</strong><span>NEXT PASS</span>';
  }
  function refresh(dt){
    const open=state==='play'&&boss.active&&!boss.dead&&boss.coreOpen;
    missedTimer=Math.max(0,missedTimer-dt);
    if(open&&!wasOpen){hpAtOpen=boss.hp;missedTimer=0;renderOpen();}
    if(!open&&wasOpen&&state==='play'&&boss.active&&!boss.dead&&boss.hp===hpAtOpen){missedTimer=.62;renderMissed();}
    if(open)renderOpen();
    const visible=open||missedTimer>0;
    cue.classList.toggle('show',visible);
    cue.setAttribute('aria-hidden',String(!visible));
    wasOpen=open;
  }

  const base=updateBoss;
  updateBoss=function(dt){base(dt);refresh(dt);};
  const reset=resetBoss;
  resetBoss=function(){reset();wasOpen=false;hpAtOpen=0;missedTimer=0;cue.classList.remove('show','missed');cue.setAttribute('aria-hidden','true');renderOpen();};
})();
