'use strict';
// Anticipation cue for the Sentinel's reachable attack pass. Readability only; combat timing is unchanged.
(()=>{
  const cue=document.createElement('div');
  cue.className='boss-core-charge-cue';
  cue.setAttribute('role','status');
  cue.setAttribute('aria-live','polite');
  cue.setAttribute('aria-atomic','true');
  cue.setAttribute('aria-hidden','true');
  cue.textContent='CORE APPROACHING · GET READY';
  document.body.appendChild(cue);

  const style=document.createElement('style');
  style.textContent='.boss-core-charge-cue{position:fixed;z-index:6;left:50%;bottom:max(126px,calc(env(safe-area-inset-bottom) + 108px));transform:translate(-50%,8px);padding:6px 12px;border:1px solid #ffd86b55;border-radius:12px;background:#171307d9;box-shadow:0 10px 26px #0007,0 0 18px #ffd86b18;color:#ffe8a0;font-size:8px;font-weight:950;letter-spacing:.14em;text-align:center;pointer-events:none;opacity:0;transition:opacity .14s ease,transform .16s ease}.boss-core-charge-cue.show{opacity:1;transform:translate(-50%,0)}@media(max-height:390px){.boss-core-charge-cue{bottom:max(96px,calc(env(safe-area-inset-bottom) + 78px));padding:5px 10px;font-size:7px}}@media(prefers-reduced-motion:reduce){.boss-core-charge-cue{transform:translate(-50%,0);transition:opacity .14s ease}.boss-core-charge-cue.show{transform:translate(-50%,0)}}';
  document.head.appendChild(style);

  let announceLatch=false;
  function refresh(){
    const lead=(typeof boss==='object'&&typeof player==='object')?boss.x-(player.x+player.w):999;
    const charging=state==='play'&&boss.active&&!boss.dead&&boss.intro<=0&&!boss.coreOpen&&!boss.passSpent&&boss.hitCd<=0&&lead>=112&&lead<205;
    cue.classList.toggle('show',charging);
    cue.setAttribute('aria-hidden',String(!charging));
    if(charging&&!announceLatch){cue.textContent='';requestAnimationFrame(()=>{cue.textContent='CORE APPROACHING · GET READY';});announceLatch=true;}
    if(!charging)announceLatch=false;
  }

  const base=updateBoss;
  updateBoss=function(dt){base(dt);refresh();};
  const reset=resetBoss;
  resetBoss=function(){reset();announceLatch=false;cue.classList.remove('show');cue.setAttribute('aria-hidden','true');cue.textContent='CORE APPROACHING · GET READY';};
})();
