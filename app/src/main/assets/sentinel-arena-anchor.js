'use strict';
(()=>{
  const marker=document.createElement('div');
  marker.className='sentinel-arena-anchor';
  marker.setAttribute('role','status');
  marker.setAttribute('aria-live','polite');
  marker.setAttribute('aria-atomic','true');
  marker.innerHTML='<i></i><span>COMBAT HOLD</span><i></i>';
  document.body.appendChild(marker);
  const label=marker.querySelector('span');
  const style=document.createElement('style');
  style.textContent='.sentinel-arena-anchor{position:fixed;z-index:5;left:50%;bottom:max(12%,calc(env(safe-area-inset-bottom,0px) + 72px));transform:translate(-50%,5px);display:flex;align-items:center;gap:8px;color:#ffd86b99;font:900 8px system-ui;letter-spacing:.18em;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease,color .16s ease}.sentinel-arena-anchor i{display:block;width:24px;height:1px;background:linear-gradient(90deg,transparent,currentColor)}.sentinel-arena-anchor i:last-child{transform:scaleX(-1)}.sentinel-arena-anchor.show{opacity:.72;transform:translate(-50%,0)}.sentinel-arena-anchor.core-open{color:#74f7c5}.sentinel-arena-anchor.window-missed{color:#ffd86b}@media(max-width:620px){.sentinel-arena-anchor{bottom:max(14%,calc(env(safe-area-inset-bottom,0px) + 62px));font-size:7px}.sentinel-arena-anchor i{width:18px}}@media(prefers-reduced-motion:reduce){.sentinel-arena-anchor{transition:none}}.reduced-motion .sentinel-arena-anchor,[data-reduced-motion] .sentinel-arena-anchor{transition:none}[class~="high-contrast"] .sentinel-arena-anchor{color:#fff}';
  document.head.appendChild(style);
  let shown=false,lastMode='';
  function tick(){
    const b=window.__jrBoss,s=window.__jrGetState?.();
    const next=!!(b&&b.active&&!b.dead&&b.arenaPinned&&s==='play');
    if(next!==shown){shown=next;marker.classList.toggle('show',shown);}
    if(next){
      const mode=b.coreOpen?'open':(b.missCue>0?'miss':'hold');
      if(mode!==lastMode){
        lastMode=mode;
        marker.classList.toggle('core-open',mode==='open');
        marker.classList.toggle('window-missed',mode==='miss');
        label.textContent=mode==='open'?'CORE OPEN · STRIKE':(mode==='miss'?'WINDOW MISSED · HOLD':'COMBAT HOLD · WATCH CORE');
      }
    }else if(lastMode){lastMode='';marker.classList.remove('core-open','window-missed');label.textContent='COMBAT HOLD';}
    requestAnimationFrame(tick);
  }
  const hide=()=>{marker.classList.remove('show');shown=false;};
  addEventListener('jumprunnerpause',hide);
  addEventListener('jumprunnerresult',hide);
  requestAnimationFrame(tick);
})();