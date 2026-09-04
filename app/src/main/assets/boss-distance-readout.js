'use strict';
(()=>{
  const style=document.createElement('style');
  style.textContent='.boss-distance-readout{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 118px);transform:translateX(-50%);padding:8px 14px;border:1px solid rgba(116,247,197,.45);border-radius:999px;background:rgba(7,16,30,.82);color:#dffef1;font:800 11px/1.1 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;pointer-events:none;opacity:0;transition:opacity .16s ease,transform .16s ease;z-index:8;white-space:nowrap}.boss-distance-readout.show{opacity:1;transform:translateX(-50%) translateY(4px)}.boss-distance-readout.ready{border-color:rgba(255,216,107,.72);color:#fff0b0}.boss-distance-readout.warn{border-color:rgba(255,109,136,.7);color:#ffd2dc}';
  document.head.appendChild(style);
  const el=document.createElement('div');
  el.className='boss-distance-readout';
  el.setAttribute('role','status');
  el.setAttribute('aria-live','polite');
  el.setAttribute('aria-atomic','true');
  document.body.appendChild(el);
  let lastText='',lastState='',lastAnnounce=0;
  function tick(){
    if(typeof boss==='undefined'||!boss.active||boss.dead||typeof player==='undefined'||typeof state==='undefined'||state!=='play'){
      el.classList.remove('show','ready','warn');
      requestAnimationFrame(tick);return;
    }
    const distance=Math.max(0,Math.round(boss.x-(player.x+player.w)));
    const ready=Boolean(boss.coreOpen);
    const danger=distance<70&&!ready;
    const text=ready?'CORE OPEN · DASH NOW':danger?'TOO CLOSE · JUMP OR DASH':`SENTINEL ${distance}M AHEAD`;
    const stateKey=ready?'ready':danger?'warn':'normal';
    el.textContent=text;
    el.classList.add('show');
    el.classList.toggle('ready',ready);
    el.classList.toggle('warn',danger);
    const now=performance.now();
    if((text!==lastText||stateKey!==lastState)&&now-lastAnnounce>450){
      el.setAttribute('aria-label',text);
      lastText=text;lastState=stateKey;lastAnnounce=now;
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
