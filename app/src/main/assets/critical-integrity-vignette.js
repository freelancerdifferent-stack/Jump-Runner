'use strict';
// Small readability slice: make one-heart states immediately legible without changing gameplay.
(()=>{
  const health=document.getElementById('health');
  if(!health)return;
  const style=document.createElement('style');
  style.textContent=`
    body.jr-critical-integrity::after{content:'INTEGRITY CRITICAL';position:fixed;inset:0;pointer-events:none;border:3px solid #ff5f79;box-shadow:inset 0 0 34px rgba(255,95,121,.55);animation:jr-critical-pulse 1.05s ease-in-out infinite;z-index:20}
    @keyframes jr-critical-pulse{0%,100%{opacity:.28}50%{opacity:.7}}
    @media (prefers-reduced-motion:reduce){body.jr-critical-integrity::after{animation:none;opacity:.5}}
  `;
  document.head.appendChild(style);
  let last='';
  const sync=()=>{
    const value=(health.textContent||'').trim();
    if(value===last)return;
    last=value;
    const critical=value==='◆';
    document.body.classList.toggle('jr-critical-integrity',critical);
    health.setAttribute('aria-label',critical?'Integrity critical':'Integrity status');
  };
  new MutationObserver(sync).observe(health,{childList:true,characterData:true,subtree:true});
  sync();
  window.addEventListener('jumprunnerresult',()=>document.body.classList.remove('jr-critical-integrity'));
  window.addEventListener('jumprunnerpause',()=>document.body.classList.remove('jr-critical-integrity'));
  window.addEventListener('jumprunnerresume',sync);
})();
