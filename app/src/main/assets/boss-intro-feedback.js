'use strict';
// Announces and visibly teaches the boss encounter once when the Sky Sentinel becomes active.
(()=>{
 const status=document.createElement('div');status.className='sr-only';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');document.body.appendChild(status);
 const cue=document.createElement('div');cue.className='boss-onboarding-cue';cue.setAttribute('aria-hidden','true');cue.innerHTML='<b>SKY SENTINEL</b><span>AUTO-RUN LOCKED · WAIT FOR THE GREEN CORE</span><strong>DASH THROUGH IT OR STOMP FROM ABOVE</strong>';document.body.appendChild(cue);
 let previousActive=boss.active,announceTimer=0,cueTimer=0;
 function announce(){clearTimeout(announceTimer);status.textContent='';announceTimer=setTimeout(()=>{status.textContent='Sky Sentinel engaged. Auto-run is locked in the arena. Wait for the green core, then Dash through it or stomp from above.';},20);}
 function showCue(){clearTimeout(cueTimer);cue.classList.remove('show');void cue.offsetWidth;cue.classList.add('show');cueTimer=setTimeout(()=>cue.classList.remove('show'),5200);}
 function refresh(){if(!previousActive&&boss.active&&!boss.dead){announce();showCue();}if(boss.dead)cue.classList.remove('show');previousActive=boss.active;}
 const base=updateBoss;updateBoss=function(dt){base(dt);refresh();};
 const reset=resetBoss;resetBoss=function(){reset();previousActive=false;status.textContent='';cue.classList.remove('show');clearTimeout(announceTimer);clearTimeout(cueTimer);};
})();
