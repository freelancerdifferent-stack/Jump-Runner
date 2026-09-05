'use strict';
// Pre-shot telegraph: gives touch players a fair reaction cue before Sentinel projectiles spawn.
(()=>{
  const cue=document.createElement('div');
  cue.className='boss-shot-windup';
  cue.setAttribute('role','status');
  cue.setAttribute('aria-live','polite');
  cue.setAttribute('aria-atomic','true');
  cue.setAttribute('aria-hidden','true');
  cue.innerHTML='<strong>SENTINEL CHARGING</strong><span>PREPARE TO JUMP OR DASH</span><i></i>';
  document.body.appendChild(cue);

  const style=document.createElement('style');
  style.textContent='.boss-shot-windup{position:fixed;z-index:6;left:50%;top:max(92px,calc(env(safe-area-inset-top) + 74px));width:min(270px,58vw);transform:translate(-50%,-8px) scale(.97);padding:7px 12px 9px;border:1px solid #ff6d884d;border-radius:13px;background:#120c18e8;box-shadow:0 10px 30px #0007,0 0 22px #ff6d881c;text-align:center;pointer-events:none;opacity:0;transition:opacity .12s ease,transform .14s ease}.boss-shot-windup.show{opacity:1;transform:translate(-50%,0) scale(1)}.boss-shot-windup strong{display:block;color:#ff9cad;font-size:9px;font-weight:950;letter-spacing:.15em}.boss-shot-windup span{display:block;margin-top:2px;color:#fff;font-size:7px;font-weight:850;letter-spacing:.08em}.boss-shot-windup i{display:block;height:3px;margin-top:6px;border-radius:3px;background:linear-gradient(90deg,#ff6d88 var(--charge,0%),#ffffff1c var(--charge,0%));box-shadow:0 0 10px #ff6d8833}@media(max-height:390px){.boss-shot-windup{top:max(68px,calc(env(safe-area-inset-top) + 52px));padding:5px 10px 7px}.boss-shot-windup strong{font-size:8px}.boss-shot-windup span{font-size:6px}}@media(prefers-reduced-motion:reduce){.boss-shot-windup{transform:translate(-50%,0);transition:opacity .12s ease}.boss-shot-windup.show{transform:translate(-50%,0)}}';
  document.head.appendChild(style);

  let announced=false;
  const WINDOW=.46;
  function refresh(){
    const active=state==='play'&&boss.active&&!boss.dead&&boss.intro<=0&&boss.shot>0&&boss.shot<=WINDOW;
    if(active){
      const charge=Math.max(0,Math.min(100,(1-boss.shot/WINDOW)*100));
      cue.style.setProperty('--charge',charge.toFixed(1)+'%');
      cue.classList.add('show');
      cue.setAttribute('aria-hidden','false');
      if(!announced){cue.setAttribute('aria-label','Sky Sentinel charging. Prepare to jump or dash.');announced=true;}
    }else{
      cue.classList.remove('show');
      cue.setAttribute('aria-hidden','true');
      cue.style.setProperty('--charge','0%');
      if(!boss.active||boss.dead||boss.shot>WINDOW)announced=false;
    }
  }

  const baseUpdateBoss=updateBoss;
  updateBoss=function(dt){baseUpdateBoss(dt);refresh();};
  const baseResetBoss=resetBoss;
  resetBoss=function(){baseResetBoss();announced=false;cue.classList.remove('show');cue.setAttribute('aria-hidden','true');cue.style.setProperty('--charge','0%');};
})();
