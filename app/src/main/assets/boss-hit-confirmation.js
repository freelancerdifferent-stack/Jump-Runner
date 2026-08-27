'use strict';
// Brief visual confirmation for successful Sentinel damage. Pure presentation: no combat timing or collision changes.
(()=>{
  const cue=document.createElement('div');
  cue.className='boss-hit-confirmation';
  cue.setAttribute('aria-hidden','true');
  document.body.appendChild(cue);

  const style=document.createElement('style');
  style.textContent='.boss-hit-confirmation{position:fixed;z-index:7;left:50%;top:104px;transform:translate(-50%,-6px) scale(.9);padding:5px 10px 6px;border-radius:12px;border:1px solid #ffd86b66;background:#171307e8;box-shadow:0 8px 24px #0007,0 0 18px #ffd86b22;color:#ffd86b;font:950 10px/1 system-ui;letter-spacing:.14em;pointer-events:none;opacity:0;transition:opacity .1s ease,transform .16s cubic-bezier(.2,.8,.2,1)}.boss-hit-confirmation.show{opacity:1;transform:translate(-50%,0) scale(1)}@media(max-height:390px){.boss-hit-confirmation{top:82px;font-size:9px;padding:4px 9px 5px}}';
  document.head.appendChild(style);

  let previousHp=typeof boss!=='undefined'?boss.hp:0,timer=0;
  function refresh(dt){
    timer=Math.max(0,timer-dt);
    if(typeof boss!=='undefined'&&boss.hp<previousHp){
      cue.textContent=boss.dead?'CORE SHATTERED':'CORE HIT · '+boss.hp+'/'+boss.maxHp;
      timer=.48;
      cue.classList.remove('show');
      void cue.offsetWidth;
      cue.classList.add('show');
    }
    if(timer<=0)cue.classList.remove('show');
    previousHp=typeof boss!=='undefined'?boss.hp:previousHp;
  }

  const base=updateBoss;
  updateBoss=function(dt){base(dt);refresh(dt);};
  const reset=resetBoss;
  resetBoss=function(){reset();previousHp=boss.hp;timer=0;cue.classList.remove('show');};
})();
