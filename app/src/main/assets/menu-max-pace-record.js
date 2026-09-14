'use strict';
// Replay-value polish: surface the persistent sustained max-pace record before each run.
(()=>{
 const STORAGE_KEY='jr_max_pace_best';
 const style=document.createElement('style');
 style.textContent='.menu-max-pace-record{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0 2px;padding:8px 10px;border:1px solid #ffd86b2e;border-radius:12px;background:#0715228c;color:#fff3cf;font:800 9px/1.2 system-ui;letter-spacing:.08em}.menu-max-pace-record span{opacity:.78}.menu-max-pace-record strong{color:#ffd86b;font-size:12px;white-space:nowrap}.menu-max-pace-record.is-empty strong{color:#74f7c5;font-size:9px}.menu-max-pace-record .goal{font-size:8px;opacity:.65;letter-spacing:.05em}@media(max-height:390px){.menu-max-pace-record{margin-top:5px;padding:6px 8px;font-size:8px}.menu-max-pace-record strong{font-size:10px}.menu-max-pace-record .goal{font-size:7px}}';
 document.head.appendChild(style);
 function readRecord(){
  try{const value=Number(localStorage.getItem(STORAGE_KEY)||0);return Number.isFinite(value)?Math.max(0,Math.min(99.9,value)):0;}catch(_){return 0;}
 }
 function decorateMenu(){
  if(typeof panel==='undefined'||!panel||typeof state==='undefined'||state!=='menu')return;
  const old=panel.querySelector('.menu-max-pace-record');if(old)old.remove();
  const record=readRecord();
  const card=document.createElement('div');card.className='menu-max-pace-record'+(record>.049?'':' is-empty');card.setAttribute('role','status');card.setAttribute('aria-live','polite');card.setAttribute('aria-atomic','true');
  const label=document.createElement('span');label.textContent='MAX PACE HOLD RECORD';
  const value=document.createElement('strong');
  const goal=document.createElement('span');goal.className='goal';
  if(record>.049){
   const shown=record.toFixed(1);
   card.setAttribute('aria-label',`Personal maximum pace hold record: ${shown} seconds. Beat it this run.`);
   value.textContent=shown+'s';goal.textContent='BEAT IT THIS RUN';
  }else{
   card.setAttribute('aria-label','Maximum pace hold challenge: reach maximum pace and hold it for one second.');
   value.textContent='SET A RECORD';goal.textContent='HOLD MAX PACE 1.0s+';
  }
  card.append(label,value,goal);
  const streak=panel.querySelector('.menu-streak-record');
  if(streak)streak.insertAdjacentElement('afterend',card);
  else{const actions=panel.querySelector('.actions');if(actions)actions.insertAdjacentElement('afterend',card);else panel.appendChild(card);}
 }
 const baseShowMenu=window.showMenu;
 if(typeof baseShowMenu==='function')window.showMenu=function(){baseShowMenu();decorateMenu();};
 decorateMenu();
})();
