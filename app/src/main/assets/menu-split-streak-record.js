'use strict';
// Replay-value polish: surface the persistent checkpoint best-split streak record before a run.
(()=>{
 const STORAGE_KEY='jr_best_split_streak';
 const style=document.createElement('style');
 style.textContent='.menu-streak-record{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:10px 0 2px;padding:8px 10px;border:1px solid #69edff2e;border-radius:12px;background:#0715228c;color:#dffbff;font:800 9px/1.2 system-ui;letter-spacing:.08em}.menu-streak-record span{opacity:.78}.menu-streak-record strong{color:#74f7c5;font-size:12px;white-space:nowrap}.menu-streak-record.is-empty strong{color:#ffd86b;font-size:9px}.menu-streak-record .goal{font-size:8px;opacity:.65;letter-spacing:.05em}@media(max-height:390px){.menu-streak-record{margin-top:6px;padding:6px 8px;font-size:8px}.menu-streak-record strong{font-size:10px}.menu-streak-record .goal{font-size:7px}}';
 document.head.appendChild(style);
 function readRecord(){return Math.max(0,Number(localStorage.getItem(STORAGE_KEY)||0)||0);}
 function decorateMenu(){
  if(typeof panel==='undefined'||!panel||typeof state==='undefined'||state!=='menu')return;
  const old=panel.querySelector('.menu-streak-record');if(old)old.remove();
  const record=readRecord();
  const card=document.createElement('div');card.className='menu-streak-record'+(record>=2?'':' is-empty');card.setAttribute('role','status');card.setAttribute('aria-live','polite');card.setAttribute('aria-atomic','true');
  if(record>=2){
   card.setAttribute('aria-label',`Personal checkpoint best-split streak record: ${record} in a row.`);
   const label=document.createElement('span');label.textContent='BEST SPLIT STREAK RECORD';
   const value=document.createElement('strong');value.textContent=`×${record}`;
   const goal=document.createElement('span');goal.className='goal';goal.textContent='BEAT IT THIS RUN';
   card.append(label,value,goal);
  }else{
   card.setAttribute('aria-label','Checkpoint best-split streak challenge: chain two best splits in a row.');
   const label=document.createElement('span');label.textContent='BEST SPLIT STREAK';
   const value=document.createElement('strong');value.textContent='SET A RECORD';
   const goal=document.createElement('span');goal.className='goal';goal.textContent='CHAIN 2+ BEST SPLITS';
   card.append(label,value,goal);
  }
  const actions=panel.querySelector('.actions');
  if(actions)actions.insertAdjacentElement('afterend',card);else panel.appendChild(card);
 }
 const baseShowMenu=window.showMenu;
 if(typeof baseShowMenu==='function')window.showMenu=function(){baseShowMenu();decorateMenu();};
 decorateMenu();
 window.addEventListener('jumprunnerresult',()=>setTimeout(()=>{},0));
})();
