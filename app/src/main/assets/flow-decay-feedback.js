'use strict';
// Flow decay warning: gives the player a restrained heads-up before an active combo expires.
// This is presentation-only and does not alter scoring, timers, physics, or input.
(()=>{
  const WARNING_WINDOW=.72;
  let warningLatched=false;
  let pulseLatched=false;
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
    if(expiring&&!pulseLatched){
      pulseLatched=true;
      flowEl.setAttribute('aria-label','Flow x'+flow+'. Ending soon.');
    }else if(!expiring){
      flowEl.removeAttribute('aria-label');
    }
  };
})();
