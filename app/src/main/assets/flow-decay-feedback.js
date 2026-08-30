'use strict';
// Flow decay warning: gives the player a restrained heads-up before an active combo expires.
// Presentation-only: it never changes scoring, timers, physics, or input.
(()=>{
  const WARNING_WINDOW=.72;
  const SAVE_CONFIRM_WINDOW=.95;
  let warningLatched=false;
  let pulseLatched=false;
  let savedTimer=0;
  const status=document.createElement('div');
  status.className='sr-only';
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  status.setAttribute('aria-atomic','true');
  document.body.appendChild(status);

  const baseUpdateHud=window.updateHud;
  if(typeof baseUpdateHud!=='function')return;

  window.updateHud=function(){
    baseUpdateHud();
    if(!flowEl)return;
    const active=state==='play'&&flow>1&&flowTimer>0;
    const expiring=active&&flowTimer<=WARNING_WINDOW;
    const wasExpiring=warningLatched;

    flowEl.classList.toggle('flow-expiring',expiring);
    if(expiring&&!warningLatched){
      warningLatched=true;
      pulseLatched=false;
      status.textContent='';
      setTimeout(()=>{if(warningLatched)status.textContent='Flow ending soon.';},20);
    }else if(!expiring){
      warningLatched=false;
      pulseLatched=false;
    }

    if(wasExpiring&&!expiring&&active&&flowTimer>=SAVE_CONFIRM_WINDOW){
      savedTimer=.72;
      status.textContent='';
      setTimeout(()=>{if(savedTimer>0)status.textContent='Flow saved.';},20);
    }

    if(expiring&&!pulseLatched){
      pulseLatched=true;
      flowEl.setAttribute('aria-label','Flow x'+flow+'. Ending soon.');
    }else if(!expiring){
      flowEl.removeAttribute('aria-label');
    }
  };

  const baseDraw=window.draw;
  if(typeof baseDraw==='function'){
    window.draw=function(){
      baseDraw();
      if(savedTimer<=0||state!=='play')return;
      savedTimer=Math.max(0,savedTimer-1/60);
      const a=Math.min(1,savedTimer*4);
      ctx.save();
      ctx.globalAlpha=a;
      ctx.setTransform(1,0,0,1,0,0);
      ctx.textAlign='center';
      ctx.font='900 12px system-ui';
      ctx.fillStyle='#74f7c5';
      ctx.shadowBlur=14;
      ctx.shadowColor='#74f7c5';
      ctx.fillText('FLOW SAVED',VW/2,98);
      ctx.restore();
    };
  }
})();
