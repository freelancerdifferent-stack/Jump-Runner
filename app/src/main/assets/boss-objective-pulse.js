'use strict';
(()=>{
  const el=document.getElementById('bossObjectiveHud');
  if(!el)return;
  let open=false;
  const style=document.createElement('style');
  style.textContent='#bossObjectiveHud.jr-core-open{box-shadow:0 0 0 2px rgba(116,247,197,.18),0 0 22px rgba(116,247,197,.32);transform:translateX(-50%) scale(1.03)}@media(prefers-reduced-motion:reduce){#bossObjectiveHud{transition:none!important}#bossObjectiveHud.jr-core-open{transform:translateX(-50%)}}';
  document.head.appendChild(style);
  function tick(){
    const b=window.__jrBoss;
    const next=Boolean(b&&b.active&&!b.dead&&b.coreOpen);
    if(next!==open){open=next;el.classList.toggle('jr-core-open',open);}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
