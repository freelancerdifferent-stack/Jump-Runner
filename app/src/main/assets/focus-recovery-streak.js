'use strict';
// Replay-value polish: reward consecutive coached-gate recoveries without changing gameplay.
(()=>{
 const STORAGE_KEY='jr_focus_recovery_streak';
 let streak=readStreak(),attempted=false,lastCleared=false,lastLabel='';
 const style=document.createElement('style');
 style.textContent='.focus-recovery-streak{margin:8px 0 2px;padding:9px 12px;border:1px solid #74f7c530;border-radius:14px;background:#08150f99;text-align:left}.focus-recovery-streak.is-reset{border-color:#ff8b9a30;background:#17090d88}.focus-recovery-streak .kicker{color:#74f7c5;font:900 9px/1.2 system-ui;letter-spacing:.14em}.focus-recovery-streak.is-reset .kicker{color:#ff9aab}.focus-recovery-streak .target{margin-top:4px;color:#fff;font:900 12px/1.3 system-ui}.focus-recovery-streak .detail{margin-top:3px;color:#bcd7df;font:700 9px/1.35 system-ui}@media(max-height:390px){.focus-recovery-streak{margin-top:6px;padding:7px 10px}.focus-recovery-streak .target{font-size:10px}.focus-recovery-streak .detail{font-size:8px}}';
 document.head.appendChild(style);
 function readStreak(){try{return Math.max(0,Math.floor(Number(localStorage.getItem(STORAGE_KEY))||0))}catch{return 0}}
 function writeStreak(value){try{localStorage.setItem(STORAGE_KEY,String(Math.max(0,value)))}catch{}}
 function onFocusResolved(event){
  const detail=event&&event.detail;if(!detail)return;
  attempted=true;lastCleared=Boolean(detail.cleared);lastLabel=String(detail.label||'FOCUS GATE');
  streak=lastCleared?streak+1:0;writeStreak(streak);
 }
 function renderResult(){
  if(!attempted||!panel)return;
  panel.querySelector('.focus-recovery-streak')?.remove();
  const card=document.createElement('div');card.className='focus-recovery-streak'+(lastCleared?'':' is-reset');card.setAttribute('role','status');card.setAttribute('aria-live','polite');card.setAttribute('aria-atomic','true');
  const kicker=document.createElement('div');kicker.className='kicker';kicker.textContent=lastCleared?'COACHING MOMENTUM':'COACHING RESET';
  const title=document.createElement('div');title.className='target';title.textContent=lastCleared?`FOCUS STREAK ×${streak}`:'Focus streak reset.';
  const detail=document.createElement('div');detail.className='detail';
  detail.textContent=lastCleared?(streak>1?`${streak} coached gates cleared in a row. Keep converting the next-run target.`:`${lastLabel} recovered. Clear the next coached gate to build a streak.`):`${lastLabel} stayed outside the pace target. Recover it next run to start a new streak.`;
  card.append(kicker,title,detail);const actions=panel.querySelector('.actions');if(actions)panel.insertBefore(card,actions);else panel.appendChild(card);
 }
 addEventListener('jumprunnerfocusresolved',onFocusResolved);
 addEventListener('jumprunnerresult',()=>requestAnimationFrame(renderResult));
 const baseReset=resetRun;resetRun=function(){attempted=false;lastCleared=false;lastLabel='';baseReset();};
})();
