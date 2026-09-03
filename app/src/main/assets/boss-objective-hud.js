'use strict';
(()=>{
  const hud=document.querySelector('.hud');
  if(!hud||typeof window.boss==='undefined')return;
  const el=document.createElement('div');
  el.id='bossObjectiveHud';
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  el.setAttribute('aria-atomic','true');
  el.style.cssText='position:absolute;left:50%;top:92px;transform:translateX(-50%);padding:7px 14px;border:1px solid rgba(116,247,197,.55);border-radius:999px;background:rgba(7,16,30,.82);color:#dfffee;font:800 11px system-ui;letter-spacing:.08em;text-transform:uppercase;opacity:0;pointer-events:none;transition:opacity .18s ease';
  hud.appendChild(el);
  let last='';
  function tick(){
    if(!window.boss||!window.state){requestAnimationFrame(tick);return;}
    const active=window.boss.active&&!window.boss.dead&&window.state==='play';
    if(active){
      const next=window.boss.coreOpen?'CORE OPEN · DASH OR STOMP NOW':'DEFEAT SKY SENTINEL · WAIT FOR CORE';
      if(next!==last){el.textContent=next;el.setAttribute('aria-label',next);last=next;}
      el.style.opacity='1';
    }else{el.style.opacity='0';last='';}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
