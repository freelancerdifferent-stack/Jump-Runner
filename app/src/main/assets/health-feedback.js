'use strict';
// Integrity HUD feedback makes damage and checkpoint recovery immediately legible without altering health rules.
(()=>{
 const el=document.getElementById('health');if(!el)return;
 const style=document.createElement('style');style.textContent='#health.integrity-hit{animation:integrityHit .34s ease-out}#health.integrity-restore{animation:integrityRestore .55s ease-out}@keyframes integrityHit{0%{transform:scale(1)}32%{transform:scale(1.22);text-shadow:0 0 18px #ff6680}100%{transform:scale(1)}}@keyframes integrityRestore{0%{transform:scale(.94)}36%{transform:scale(1.18);text-shadow:0 0 18px #75f5d0}100%{transform:scale(1)}}';document.head.appendChild(style);
 const status=document.createElement('div');status.className='sr-only';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');document.body.appendChild(status);
 let previous=health,announceTimer=0;
 function pulse(kind){el.classList.remove('integrity-hit','integrity-restore');void el.offsetWidth;el.classList.add(kind);}
 function announceRecovery(){clearTimeout(announceTimer);status.textContent='';announceTimer=setTimeout(()=>{status.textContent='Integrity restored. '+health+' of '+maxHealth+' remaining.';},20);}
 const base=renderHealth;renderHealth=function(){const before=previous;base();if(health<before)pulse('integrity-hit');else if(health>before&&state==='play'){pulse('integrity-restore');announceRecovery();}previous=health;};
 const reset=resetRun;resetRun=function(){previous=maxHealth;status.textContent='';clearTimeout(announceTimer);reset();};
})();
