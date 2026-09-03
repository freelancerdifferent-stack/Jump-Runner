'use strict';
(()=>{
  const host=document.querySelector('.hud');
  if(!host)return;
  const badge=document.createElement('div');
  badge.className='auto-run-badge';
  badge.setAttribute('role','status');
  badge.setAttribute('aria-live','polite');
  badge.setAttribute('aria-atomic','true');
  badge.textContent='AUTO-RUN · JUMP + DASH';
  host.appendChild(badge);
  const style=document.createElement('style');
  style.textContent='.auto-run-badge{position:fixed;left:50%;top:12px;transform:translateX(-50%);padding:6px 12px;border:1px solid rgba(116,247,197,.35);border-radius:999px;background:rgba(5,14,28,.72);color:#b9ffe8;font:800 11px/1 system-ui;letter-spacing:.12em;pointer-events:none;z-index:8;opacity:.84}.auto-run-badge.is-boss{border-color:rgba(255,216,107,.55);color:#ffe39a}.auto-run-badge.is-hidden{opacity:0}';
  document.head.appendChild(style);
  let lastBoss=false;
  function sync(){
    const inBoss=Boolean(window.boss&&boss.active&&!boss.dead);
    if(inBoss!==lastBoss){
      lastBoss=inBoss;
      badge.classList.toggle('is-boss',inBoss);
      badge.textContent=inBoss?'AUTO-RUN · TIME YOUR DASH':'AUTO-RUN · JUMP + DASH';
      badge.setAttribute('aria-label',inBoss?'Boss arena: time your dash when the core opens':'Auto-run: use Jump and Dash to control the runner');
    }
    badge.classList.toggle('is-hidden',window.state==='menu'||window.state==='dead'||window.state==='win');
    requestAnimationFrame(sync);
  }
  sync();
})();
