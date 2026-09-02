'use strict';
// Finish approach cue: communicates the final stretch only after the Sentinel has been resolved.
(()=>{
 const cue=document.createElement('div');cue.className='finish-approach-cue';cue.textContent='FINAL STRETCH';cue.setAttribute('role','status');cue.setAttribute('aria-live','polite');cue.setAttribute('aria-atomic','true');cue.setAttribute('aria-hidden','true');document.body.appendChild(cue);
 const style=document.createElement('style');style.textContent='.finish-approach-cue{position:fixed;z-index:6;left:50%;top:18%;transform:translate(-50%,8px);font-size:8px;font-weight:1000;letter-spacing:.24em;color:#fff2b7;text-shadow:0 2px 14px #000,0 0 16px #ffd86b44;opacity:0;pointer-events:none}.finish-approach-cue.show{animation:finishApproach .72s ease-out forwards}@keyframes finishApproach{0%{opacity:0;transform:translate(-50%,8px)}22%{opacity:1;transform:translate(-50%,0)}72%{opacity:.9}100%{opacity:0;transform:translate(-50%,-8px)}}@media (prefers-reduced-motion:reduce){.finish-approach-cue{transform:translate(-50%,0)}.finish-approach-cue.show{animation:finishApproachReduced .72s ease-out forwards}@keyframes finishApproachReduced{0%{opacity:0}22%{opacity:1}72%{opacity:.9}100%{opacity:0}}}';document.head.appendChild(style);
 let announced=false,hideTimer=0,pendingAfterPause=false;
 function sentinelResolved(){return typeof boss==='undefined'||boss.dead;}
 function hideCue(){cue.classList.remove('show');cue.setAttribute('aria-hidden','true');}
 function showCue(){clearTimeout(hideTimer);hideCue();void cue.offsetWidth;cue.setAttribute('aria-hidden','false');cue.classList.add('show');hideTimer=setTimeout(()=>{hideTimer=0;hideCue();},760);}
 function check(){
   if(state!=='play'||announced||!sentinelResolved())return;
   const pct=player.x/LEVEL_END;
   if(pct>=.88){announced=true;showCue();}
 }
 addEventListener('jumprunnerpause',()=>{if(cue.classList.contains('show')){pendingAfterPause=true;clearTimeout(hideTimer);hideTimer=0;hideCue();}});
 addEventListener('jumprunnerresume',()=>{if(pendingAfterPause&&state==='play'){pendingAfterPause=false;showCue();}});
 const hud=updateHud;updateHud=function(){hud();check();};
 const reset=resetRun;resetRun=function(){announced=false;pendingAfterPause=false;clearTimeout(hideTimer);hideTimer=0;hideCue();reset();};
})();
