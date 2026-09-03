'use strict';
// Finish approach cue: communicates the final stretch only after the Sentinel has been resolved.
(()=>{
 const cue=document.createElement('div');cue.className='finish-approach-cue';cue.textContent='FINAL STRETCH';cue.setAttribute('role','status');cue.setAttribute('aria-live','polite');cue.setAttribute('aria-atomic','true');cue.setAttribute('aria-hidden','true');document.body.appendChild(cue);
 const style=document.createElement('style');style.textContent='.finish-approach-cue{position:fixed;z-index:6;left:50%;top:max(15%,calc(env(safe-area-inset-top,0px) + 56px));transform:translate(-50%,8px);box-sizing:border-box;max-width:min(82vw,360px);padding:7px 14px 7px 16px;border:1px solid #ffd86b55;border-radius:999px;background:#07101ecc;backdrop-filter:blur(5px);font-size:clamp(10px,1.35vw,13px);line-height:1;font-weight:1000;letter-spacing:.2em;text-align:center;white-space:nowrap;color:#fff2b7;text-shadow:0 2px 14px #000,0 0 16px #ffd86b44;box-shadow:0 8px 24px #0005,0 0 18px #ffd86b1f;opacity:0;pointer-events:none}.finish-approach-cue.show{animation:finishApproach .72s ease-out forwards}@keyframes finishApproach{0%{opacity:0;transform:translate(-50%,8px)}22%{opacity:1;transform:translate(-50%,0)}72%{opacity:.94}100%{opacity:0;transform:translate(-50%,-8px)}}@media (max-width:520px){.finish-approach-cue{max-width:88vw;padding:7px 11px 7px 13px;letter-spacing:.14em}}@media (prefers-reduced-motion:reduce){.finish-approach-cue{transform:translate(-50%,0);backdrop-filter:none}.finish-approach-cue.show{animation:finishApproachReduced .72s ease-out forwards}@keyframes finishApproachReduced{0%{opacity:0}22%{opacity:1}72%{opacity:.94}100%{opacity:0}}}';document.head.appendChild(style);
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
