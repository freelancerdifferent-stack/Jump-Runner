'use strict';
// Announces the boss encounter once when the Sky Sentinel becomes active.
(()=>{
 const status=document.createElement('div');status.className='sr-only';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');document.body.appendChild(status);
 let previousActive=boss.active,announceTimer=0;
 function announce(){clearTimeout(announceTimer);status.textContent='';announceTimer=setTimeout(()=>{status.textContent='Sky Sentinel engaged. Dash or stomp to break its core.';},20);}
 function refresh(){if(!previousActive&&boss.active&&!boss.dead)announce();previousActive=boss.active;}
 const base=updateBoss;updateBoss=function(dt){base(dt);refresh();};
 const reset=resetBoss;resetBoss=function(){reset();previousActive=false;status.textContent='';clearTimeout(announceTimer);};
})();
