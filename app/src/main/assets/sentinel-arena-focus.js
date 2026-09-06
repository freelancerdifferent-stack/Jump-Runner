'use strict';
// Adds a restrained arena-focus vignette during the Sentinel encounter without touching combat physics.
(()=>{
  const focus=document.createElement('div');
  focus.className='sentinel-arena-focus';
  focus.setAttribute('aria-hidden','true');
  document.body.appendChild(focus);

  const style=document.createElement('style');
  style.textContent='.sentinel-arena-focus{position:fixed;inset:0;z-index:4;pointer-events:none;opacity:0;background:radial-gradient(circle at 54% 48%,transparent 0 34%,rgba(2,7,16,.08) 54%,rgba(2,7,16,.34) 100%);box-shadow:inset 0 0 90px rgba(255,109,136,.08);transition:opacity .28s ease,box-shadow .18s ease}.sentinel-arena-focus.active{opacity:1}.sentinel-arena-focus.core-open{box-shadow:inset 0 0 110px rgba(116,247,197,.14)}@media(prefers-reduced-motion:reduce){.sentinel-arena-focus{transition:none}}[class~="high-contrast"] .sentinel-arena-focus{background:transparent;box-shadow:none}';
  document.head.appendChild(style);

  function refresh(){
    const active=state==='play'&&boss.active&&!boss.dead;
    focus.classList.toggle('active',active);
    focus.classList.toggle('core-open',active&&boss.coreOpen);
  }

  const base=updateBoss;
  updateBoss=function(dt){base(dt);refresh();};
  const reset=resetBoss;
  resetBoss=function(){reset();focus.classList.remove('active','core-open');};
  addEventListener('jumprunnerpause',()=>focus.classList.remove('active','core-open'));
  addEventListener('jumprunnerresume',refresh);
})();
