'use strict';
(()=>{
  const hud=document.querySelector('.hud');
  if(!hud)return;
  const el=document.createElement('div');
  el.id='bossObjectiveHud';
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  el.setAttribute('aria-atomic','true');
  el.style.cssText='position:absolute;left:50%;top:92px;transform:translateX(-50%);padding:7px 14px;border:1px solid rgba(116,247,197,.55);border-radius:999px;background:rgba(7,16,30,.82);color:#dfffee;font:800 11px system-ui;letter-spacing:.08em;text-transform:uppercase;opacity:0;pointer-events:none;transition:opacity .18s ease';
  hud.appendChild(el);
  let last='';
  function objectiveText(b){
    const remaining=Math.max(0,Number(b.hp)||0);
    const hits=remaining===1?'1 HIT LEFT':remaining+' HITS LEFT';
    if(b.coreOpen)return 'CORE OPEN · DASH OR STOMP NOW · '+hits;
    if(b.passSpent)return 'CORE DISRUPTED · NEXT PASS · '+hits;
    return 'DEFEAT SKY SENTINEL · WAIT FOR CORE · '+hits;
  }
  function tick(){
    const b=window.__jrBoss,s=window.__jrGetState?.();
    const active=Boolean(b&&b.active&&!b.dead&&s==='play');
    if(active){
      const next=objectiveText(b);
      if(next!==last){el.textContent=next;el.setAttribute('aria-label',next);last=next;}
      el.style.opacity='1';
    }else{el.style.opacity='0';last='';}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
