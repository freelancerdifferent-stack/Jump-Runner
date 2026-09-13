'use strict';
// Replay-value polish: show progress toward the persistent best-split streak target during a run.
(()=>{
 const STORAGE_KEY='jr_best_split_streak';
 const chip=document.createElement('div');
 chip.className='split-streak-target';chip.hidden=true;
 chip.setAttribute('role','status');chip.setAttribute('aria-live','polite');chip.setAttribute('aria-atomic','true');
 const label=document.createElement('span'),value=document.createElement('strong');chip.append(label,value);document.body.appendChild(chip);
 const style=document.createElement('style');
 style.textContent='.split-streak-target{position:fixed;z-index:6;left:50%;top:max(138px,calc(env(safe-area-inset-top) + 120px));transform:translateX(-50%);display:flex;align-items:center;gap:8px;min-width:164px;justify-content:center;padding:5px 10px;border:1px solid #69edff2e;border-radius:12px;background:#06121ec7;box-shadow:0 7px 18px #0003;color:#bdefff;font:800 8px/1.15 system-ui;letter-spacing:.08em;pointer-events:none;white-space:nowrap}.split-streak-target strong{color:#74f7c5;font-size:10px}.split-streak-target.record strong{color:#ffd86b}.split-streak-target.pop{animation:split-target-pop .38s ease-out}@keyframes split-target-pop{0%{transform:translateX(-50%) scale(.96);filter:brightness(1)}45%{transform:translateX(-50%) scale(1.035);filter:brightness(1.18)}100%{transform:translateX(-50%) scale(1);filter:brightness(1)}}@media(max-height:390px){.split-streak-target{top:max(104px,calc(env(safe-area-inset-top) + 88px));min-width:148px;padding:4px 8px;font-size:7px}.split-streak-target strong{font-size:9px}}@media(prefers-reduced-motion:reduce){.split-streak-target.pop{animation:none}}';
 document.head.appendChild(style);
 let streak=0,hideTimer=0;
 function readRecord(){return Math.max(0,Number(localStorage.getItem(STORAGE_KEY)||0)||0);}
 function clear(){streak=0;if(hideTimer){clearTimeout(hideTimer);hideTimer=0;}chip.hidden=true;chip.classList.remove('record','pop');chip.removeAttribute('aria-label');}
 function show(detail){
  if(!detail||!detail.isBest){clear();return;}
  streak++;
  const record=readRecord(),target=Math.max(2,record+1),recordPace=streak>=target;
  label.textContent=recordPace?'STREAK RECORD PACE':'STREAK CHALLENGE';value.textContent=`${streak} / ${target}`;
  chip.classList.toggle('record',recordPace);chip.hidden=false;
  chip.setAttribute('aria-label',recordPace?`Checkpoint streak record pace. ${streak} consecutive best splits, target ${target}.`:`Checkpoint streak challenge. ${streak} of ${target} consecutive best splits.`);
  chip.classList.remove('pop');void chip.offsetWidth;chip.classList.add('pop');
  if(hideTimer)clearTimeout(hideTimer);hideTimer=setTimeout(()=>{chip.hidden=true;chip.classList.remove('pop');hideTimer=0;},1700);
 }
 addEventListener('jumprunnercheckpointsplit',e=>show(e.detail));
 addEventListener('jumprunnerresult',clear);
 const baseReset=window.resetRun;
 if(typeof baseReset==='function')window.resetRun=function(){clear();return baseReset.apply(this,arguments);};
})();
