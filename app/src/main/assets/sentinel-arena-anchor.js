'use strict';
(()=>{
  const marker=document.createElement('div');
  marker.className='sentinel-arena-anchor';
  marker.setAttribute('aria-hidden','true');
  marker.innerHTML='<i></i><span>COMBAT HOLD</span><i></i>';
  document.body.appendChild(marker);
  const style=document.createElement('style');
  style.textContent='.sentinel-arena-anchor{position:fixed;z-index:5;left:50%;bottom:max(12%,calc(env(safe-area-inset-bottom,0px) + 72px));transform:translate(-50%,5px);display:flex;align-items:center;gap:8px;color:#ffd86b99;font:900 8px system-ui;letter-spacing:.18em;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease}.sentinel-arena-anchor i{display:block;width:24px;height:1px;background:linear-gradient(90deg,transparent,#ffd86b88)}.sentinel-arena-anchor i:last-child{transform:scaleX(-1)}.sentinel-arena-anchor.show{opacity:.72;transform:translate(-50%,0)}@media(max-width:620px){.sentinel-arena-anchor{bottom:max(14%,calc(env(safe-area-inset-bottom,0px) + 62px));font-size:7px}.sentinel-arena-anchor i{width:18px}}@media(prefers-reduced-motion:reduce){.sentinel-arena-anchor{transition:none}}[class~="high-contrast"] .sentinel-arena-anchor{color:#fff}[class~="high-contrast"] .sentinel-arena-anchor i{background:#fff}';
  document.head.appendChild(style);
  let shown=false;
  function tick(){
    const b=window.__jrBoss,s=window.__jrGetState?.();
    const next=!!(b&&b.active&&!b.dead&&b.arenaPinned&&s==='play');
    if(next!==shown){shown=next;marker.classList.toggle('show',shown);}
    requestAnimationFrame(tick);
  }
  addEventListener('jumprunnerpause',()=>marker.classList.remove('show'));
  addEventListener('jumprunnerresult',()=>marker.classList.remove('show'));
  requestAnimationFrame(tick);
})();