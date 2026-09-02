'use strict';
// Finish approach cue: communicates the final stretch only after the Sentinel has been resolved.
(()=>{
 const cue=document.createElement('div');cue.className='finish-approach-cue';cue.textContent='FINAL STRETCH';document.body.appendChild(cue);
 const style=document.createElement('style');style.textContent='.finish-approach-cue{position:fixed;z-index:6;left:50%;top:18%;transform:translate(-50%,8px);font-size:8px;font-weight:1000;letter-spacing:.24em;color:#fff2b7;text-shadow:0 2px 14px #000,0 0 16px #ffd86b44;opacity:0;pointer-events:none}.finish-approach-cue.show{animation:finishApproach .72s ease-out forwards}@keyframes finishApproach{0%{opacity:0;transform:translate(-50%,8px)}22%{opacity:1;transform:translate(-50%,0)}72%{opacity:.9}100%{opacity:0;transform:translate(-50%,-8px)}}';document.head.appendChild(style);
 let announced=false;
 function sentinelResolved(){return typeof boss==='undefined'||boss.dead;}
 function check(){
   if(state!=='play'||announced||!sentinelResolved())return;
   const pct=player.x/LEVEL_END;
   if(pct>=.88){announced=true;cue.classList.remove('show');void cue.offsetWidth;cue.classList.add('show');}
 }
 const hud=updateHud;updateHud=function(){hud();check();};
 const reset=resetRun;resetRun=function(){announced=false;cue.classList.remove('show');reset();};
})();
