'use strict';
// Lightweight distance milestones make long runs easier to parse without changing gameplay.
(()=>{
 const bar=document.getElementById('progressBar');if(!bar)return;
 const wrap=bar.parentElement;
 const style=document.createElement('style');style.textContent='.progress{overflow:visible}.progress-marks{position:absolute;inset:-3px 0;pointer-events:none}.progress-marks i{position:absolute;top:0;width:2px;height:8px;background:#dffcff66;border-radius:2px;transform:translateX(-1px)}.progress-marks i.reached{background:#9ef5ff;box-shadow:0 0 8px #69edff}.progress-toast{position:fixed;z-index:6;left:50%;bottom:max(31px,calc(env(safe-area-inset-bottom) + 25px));transform:translateX(-50%);font-size:7px;font-weight:950;letter-spacing:.18em;color:#c9f9ff;text-shadow:0 2px 10px #000;opacity:0;pointer-events:none}.progress-toast.show{animation:progressToast .55s ease-out forwards}@keyframes progressToast{0%{opacity:0;transform:translate(-50%,5px)}22%{opacity:1}100%{opacity:0;transform:translate(-50%,-7px)}}';document.head.appendChild(style);
 const marks=document.createElement('span');marks.className='progress-marks';const nodes=[25,50,75].map(p=>{const n=document.createElement('i');n.style.left=p+'%';marks.appendChild(n);return n});wrap.appendChild(marks);
 const toast=document.createElement('div');toast.className='progress-toast';document.body.appendChild(toast);let reached=0;
 function refresh(){if(state!=='play')return;const pct=Math.min(100,player.x/LEVEL_END*100),next=pct>=75?3:pct>=50?2:pct>=25?1:0;if(next>reached){reached=next;nodes[reached-1].classList.add('reached');toast.textContent=[25,50,75][reached-1]+'% · SKYLINE';toast.classList.remove('show');void toast.offsetWidth;toast.classList.add('show');}}
 const hud=updateHud;updateHud=function(){hud();refresh();};const reset=resetRun;resetRun=function(){reached=0;nodes.forEach(n=>n.classList.remove('reached'));toast.classList.remove('show');reset();};
})();
