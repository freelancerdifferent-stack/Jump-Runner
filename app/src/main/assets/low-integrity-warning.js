'use strict';
// Small readability slice: make the one-hit-left state obvious without changing gameplay.
(()=>{
 const healthEl=document.getElementById('health');
 if(!healthEl)return;
 const style=document.createElement('style');
 style.textContent=`#health.low-integrity{color:#ff7186;text-shadow:0 0 14px #ff4f6f;animation:lowIntegrityPulse .9s ease-in-out infinite alternate}@keyframes lowIntegrityPulse{from{transform:scale(1)}to{transform:scale(1.08)}}@media(prefers-reduced-motion:reduce){#health.low-integrity{animation:none}}`;
 document.head.appendChild(style);
 const base=renderHealth;
 renderHealth=function(){
   base();
   healthEl.classList.toggle('low-integrity',typeof health==='number'&&health===1);
 };
 const reset=resetRun;
 resetRun=function(){healthEl.classList.remove('low-integrity');reset();};
})();
