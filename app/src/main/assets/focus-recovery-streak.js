'use strict';
// Replay-value polish: reward consecutive coached-gate recoveries without changing gameplay.
(()=>{
 const STORAGE_KEY='jr_focus_recovery_streak',BEST_STORAGE_KEY='jr_focus_recovery_best';
 const MILESTONES=[{value:3,label:'LOCKED IN'},{value:5,label:'ON FIRE'},{value:8,label:'APEX FOCUS'}];
 let streak=readNumber(STORAGE_KEY),best=readNumber(BEST_STORAGE_KEY),attempted=false,lastCleared=false,lastLabel='',newBest=false,introTimer=0;
 const style=document.createElement('style');
 style.textContent='.focus-recovery-streak{margin:8px 0 2px;padding:9px 12px;border:1px solid #74f7c530;border-radius:14px;background:#08150f99;text-align:left}.focus-recovery-streak.is-reset{border-color:#ff8b9a30;background:#17090d88}.focus-recovery-streak.is-best{box-shadow:0 0 0 1px #ffd86b30 inset}.focus-recovery-streak.is-milestone{border-color:#ffd86b55;background:#17140899;box-shadow:0 0 20px #ffd86b12}.focus-recovery-streak .kicker{color:#74f7c5;font:900 9px/1.2 system-ui;letter-spacing:.14em}.focus-recovery-streak.is-reset .kicker{color:#ff9aab}.focus-recovery-streak.is-best .kicker,.focus-recovery-streak.is-milestone .kicker{color:#ffd86b}.focus-recovery-streak .target{margin-top:4px;color:#fff;font:900 12px/1.3 system-ui}.focus-recovery-streak .detail{margin-top:3px;color:#bcd7df;font:700 9px/1.35 system-ui}.focus-best-menu{margin:8px auto 2px;width:max-content;max-width:100%;padding:6px 11px;border:1px solid #ffd86b2c;border-radius:999px;background:#17140899;color:#ffe9a6;font:900 9px/1.2 system-ui;letter-spacing:.11em;text-transform:uppercase}.focus-best-menu.is-active{border-color:#74f7c542;background:#08150fb3;color:#9dffe0;box-shadow:0 0 18px #74f7c512}.focus-best-menu.is-milestone{border-color:#ffd86b55;color:#ffe9a6;box-shadow:0 0 20px #ffd86b14}.focus-run-momentum{position:fixed;z-index:22;left:50%;top:max(84px,calc(env(safe-area-inset-top) + 72px));transform:translate(-50%,-8px);opacity:0;pointer-events:none;min-width:220px;max-width:min(72vw,360px);padding:8px 13px;border:1px solid #74f7c542;border-radius:999px;background:#07120ebd;color:#9dffe0;text-align:center;font:900 10px/1.25 system-ui;letter-spacing:.1em;text-transform:uppercase;box-shadow:0 8px 26px #0007;transition:opacity .18s ease,transform .18s ease}.focus-run-momentum.show{opacity:1;transform:translate(-50%,0)}.focus-run-momentum.is-milestone{border-color:#ffd86b66;background:#171408d9;color:#ffe9a6}.focus-run-momentum .sub{display:block;margin-top:2px;color:#bcd7df;font:700 8px/1.2 system-ui;letter-spacing:.04em;text-transform:none}@media(max-height:390px){.focus-recovery-streak{margin-top:6px;padding:7px 10px}.focus-recovery-streak .target{font-size:10px}.focus-recovery-streak .detail{font-size:8px}.focus-best-menu{margin-top:5px;padding:5px 9px;font-size:8px}.focus-run-momentum{top:max(58px,calc(env(safe-area-inset-top) + 48px));padding:6px 10px;font-size:9px}}@media(prefers-reduced-motion:reduce){.focus-run-momentum{transition:none;transform:translate(-50%,0)}}';
 document.head.appendChild(style);
 function readNumber(key){try{return Math.max(0,Math.floor(Number(localStorage.getItem(key))||0))}catch{return 0}}
 function writeNumber(key,value){try{localStorage.setItem(key,String(Math.max(0,value)))}catch{}}
 function milestoneAt(value){return MILESTONES.find(item=>item.value===value)||null}
 function nextMilestone(value){return MILESTONES.find(item=>item.value>value)||null}
 function clearRunMomentum(){
  if(introTimer){clearTimeout(introTimer);introTimer=0;}
  const card=document.querySelector('.focus-run-momentum');if(card)card.remove();
 }
 function showRunMomentum(){
  clearRunMomentum();streak=readNumber(STORAGE_KEY);best=readNumber(BEST_STORAGE_KEY);
  if(streak<=0||state!=='play')return;
  const milestone=milestoneAt(streak),next=nextMilestone(streak),card=document.createElement('div');
  card.className='focus-run-momentum'+(milestone?' is-milestone':'');card.setAttribute('role','status');card.setAttribute('aria-live','polite');card.setAttribute('aria-atomic','true');
  const headline=milestone?`${milestone.label} · STREAK ×${streak}`:`FOCUS MOMENTUM ×${streak}`;
  const sub=next?`Keep it alive · next milestone ×${next.value}`:`Best ×${best} · keep the streak alive`;
  card.innerHTML=`${headline}<span class="sub">${sub}</span>`;document.body.appendChild(card);requestAnimationFrame(()=>card.classList.add('show'));
  introTimer=setTimeout(()=>{card.classList.remove('show');introTimer=setTimeout(()=>{card.remove();introTimer=0;},220);},1900);
 }
 function onFocusResolved(event){
  const detail=event&&event.detail;if(!detail)return;
  attempted=true;lastCleared=Boolean(detail.cleared);lastLabel=String(detail.label||'FOCUS GATE');newBest=false;
  streak=lastCleared?streak+1:0;writeNumber(STORAGE_KEY,streak);
  if(lastCleared&&streak>best){best=streak;newBest=true;writeNumber(BEST_STORAGE_KEY,best);}
 }
 function renderResult(){
  if(!attempted||!panel)return;
  panel.querySelector('.focus-recovery-streak')?.remove();
  const milestone=lastCleared?milestoneAt(streak):null,next=lastCleared?nextMilestone(streak):null;
  const card=document.createElement('div');card.className='focus-recovery-streak'+(lastCleared?'':' is-reset')+(newBest?' is-best':'')+(milestone?' is-milestone':'');card.setAttribute('role','status');card.setAttribute('aria-live','polite');card.setAttribute('aria-atomic','true');
  const kicker=document.createElement('div');kicker.className='kicker';kicker.textContent=milestone?`FOCUS MILESTONE · ${milestone.label}`:(newBest?'NEW BEST MOMENTUM':(lastCleared?'COACHING MOMENTUM':'COACHING RESET'));
  const title=document.createElement('div');title.className='target';title.textContent=lastCleared?`FOCUS STREAK ×${streak}`:'Focus streak reset.';
  const detail=document.createElement('div');detail.className='detail';
  detail.textContent=lastCleared?(milestone?`${milestone.label} reached at ×${streak}. ${next?`Next milestone ×${next.value}.`:'Top coaching milestone secured.'}`:(newBest?`Personal best focus streak. ${lastLabel} converted cleanly.`:(streak>1?`${streak} coached gates cleared in a row · best ×${best}. ${next?`Next milestone ×${next.value}.`:'Keep the streak alive.'}`:`${lastLabel} recovered · best ×${best}. Clear the next coached gate to build a streak.`))):`${lastLabel} stayed outside the pace target · best ×${best}. Recover it next run to start a new streak.`;
  card.append(kicker,title,detail);const actions=panel.querySelector('.actions');if(actions)panel.insertBefore(card,actions);else panel.appendChild(card);
 }
 function renderMenuBest(){
  if(!panel)return;
  panel.querySelector('.focus-best-menu')?.remove();
  streak=readNumber(STORAGE_KEY);best=readNumber(BEST_STORAGE_KEY);if(best<=0&&streak<=0)return;
  const milestone=streak>0?milestoneAt(streak):null,next=streak>0?nextMilestone(streak):null;
  const badge=document.createElement('div');badge.className='focus-best-menu'+(streak>0?' is-active':'')+(milestone?' is-milestone':'');
  if(streak>0){
   badge.textContent=milestone?`${milestone.label} ×${streak} · BEST ×${best}`:`FOCUS MOMENTUM ×${streak} · ${next?`NEXT ×${next.value}`:`BEST ×${best}`}`;
   badge.setAttribute('aria-label',milestone?`${milestone.label} focus milestone at streak ${streak}. Best ${best}.`:`Current focus recovery streak ${streak}. ${next?`Next milestone ${next.value}. `:''}Best ${best}.`);
  }else{
   badge.textContent=`COACHING BEST ×${best}`;
   badge.setAttribute('aria-label',`Best focus recovery streak ${best}`);
  }
  const actions=panel.querySelector('.actions');if(actions)panel.insertBefore(badge,actions);else panel.appendChild(badge);
 }
 addEventListener('jumprunnerfocusresolved',onFocusResolved);
 addEventListener('jumprunnerresult',()=>{clearRunMomentum();requestAnimationFrame(renderResult);});
 addEventListener('jumprunnerpause',clearRunMomentum);
 const baseShowMenu=showMenu;showMenu=function(){clearRunMomentum();baseShowMenu();requestAnimationFrame(renderMenuBest);};
 const baseReset=resetRun;resetRun=function(){clearRunMomentum();attempted=false;lastCleared=false;lastLabel='';newBest=false;streak=readNumber(STORAGE_KEY);best=readNumber(BEST_STORAGE_KEY);baseReset();setTimeout(showRunMomentum,260);};
})();
