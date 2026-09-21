'use strict';
(()=>{
  const cue=document.createElement('div');
  cue.className='sentinel-arena-control-cue';
  cue.setAttribute('role','status');
  cue.setAttribute('aria-live','polite');
  cue.setAttribute('aria-atomic','true');
  cue.setAttribute('aria-hidden','true');
  cue.innerHTML='<b>ARENA LOCK</b><span>AUTO-RUN PAUSED · JUMP + DASH</span>';
  document.body.appendChild(cue);
  const style=document.createElement('style');
  style.textContent='.sentinel-arena-control-cue{position:fixed;z-index:7;left:50%;bottom:max(20%,calc(env(safe-area-inset-bottom,0px) + 118px));transform:translate(-50%,8px);display:flex;align-items:center;gap:9px;padding:7px 12px;border:1px solid #ffd86b66;border-radius:999px;background:#07101ee8;backdrop-filter:blur(5px);box-shadow:0 8px 24px #0006,0 0 18px #ffd86b18;color:#d9e5f2;font:800 10px system-ui;letter-spacing:.09em;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .18s ease,transform .18s ease}.sentinel-arena-control-cue b{color:#ffd86b;font-weight:950;letter-spacing:.14em}.sentinel-arena-control-cue.show{opacity:1;transform:translate(-50%,0)}@media(max-width:620px){.sentinel-arena-control-cue{bottom:max(22%,calc(env(safe-area-inset-bottom,0px) + 108px));gap:7px;padding:6px 9px;font-size:9px;letter-spacing:.06em}}@media(prefers-reduced-motion:reduce){.sentinel-arena-control-cue{transition:opacity .12s linear}}[class~="high-contrast"] .sentinel-arena-control-cue{border-color:#fff;background:#000;color:#fff}[class~="high-contrast"] .sentinel-arena-control-cue b{color:#fff}';
  document.head.appendChild(style);
  let visible=false,hideTimer=0;
  function hide(){clearTimeout(hideTimer);hideTimer=0;visible=false;cue.classList.remove('show');cue.setAttribute('aria-hidden','true');}
  function show(){if(visible)return;visible=true;cue.setAttribute('aria-hidden','false');cue.classList.add('show');hideTimer=setTimeout(hide,2600);}
  function tick(){
    const b=window.__jrBoss,s=window.__jrGetState?.();
    if(b&&b.active&&!b.dead&&b.arenaPinned&&s==='play')show();
    if((!b||!b.active||b.dead||s!=='play')&&visible)hide();
    requestAnimationFrame(tick);
  }
  addEventListener('jumprunnerpause',hide);
  addEventListener('jumprunnerresult',hide);
  requestAnimationFrame(tick);
})();
