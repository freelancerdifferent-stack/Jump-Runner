'use strict';
// Compact pause actions for touch-first play. Keeps pause/resume on the existing lifecycle path
// while making restart and exit-to-menu discoverable without forcing an app restart.
(()=>{
 const card=document.getElementById('pause');
 if(!card)return;
 const snapshot=document.createElement('div');
 snapshot.className='pause-run-snapshot';
 snapshot.setAttribute('role','status');
 snapshot.setAttribute('aria-live','polite');
 snapshot.setAttribute('aria-atomic','true');
 card.appendChild(snapshot);
 const actions=document.createElement('div');
 actions.className='pause-actions';
 actions.setAttribute('role','group');
 actions.setAttribute('aria-label','Paused run actions');
 actions.innerHTML='<button type="button" data-pause-action="resume">RESUME</button><button type="button" data-pause-action="restart">RESTART</button><button type="button" data-pause-action="home">HOME</button>';
 card.appendChild(actions);
 const style=document.createElement('style');
 style.textContent=`.pause-run-snapshot{display:flex;flex-wrap:wrap;justify-content:center;gap:6px 14px;margin-top:10px;color:#b9d7e8;font:800 8px/1.2 system-ui;letter-spacing:.1em;text-transform:uppercase}.pause-run-snapshot span strong{color:#fff;font-size:10px}.pause-actions{display:flex;gap:8px;justify-content:center;margin-top:12px}.pause-actions button{min-width:76px;min-height:36px;padding:0 12px;border:1px solid #9eefff55;border-radius:999px;background:#091727e8;color:#eaf8ff;font:800 9px/1 system-ui;letter-spacing:.12em;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.pause-actions button:first-child{border-color:#74f7c588;color:#74f7c5}.pause-actions button[data-confirming="true"]{border-color:#ffd86baa;color:#ffd86b;background:#2a210fe8}.pause-actions button:active{transform:scale(.96)}@media(max-height:390px){.pause-run-snapshot{margin-top:6px;gap:4px 10px;font-size:7px}.pause-run-snapshot span strong{font-size:9px}.pause-actions{margin-top:8px;gap:6px}.pause-actions button{min-width:66px;min-height:32px;padding:0 9px;font-size:8px}}`;
 document.head.appendChild(style);
 let confirming=null,confirmTimer=0;
 function value(name,fallback){try{return typeof window[name]!=='undefined'?window[name]:eval(`typeof ${name}!=='undefined'?${name}:fallback`)}catch(_){return fallback}}
 function updateSnapshot(){
  const runTime=Math.max(0,Number(value('time',0))||0);
  const runCrystals=Math.max(0,Number(value('crystals',0))||0);
  const crystalTotal=Math.max(0,Number(value('totalCrystals',0))||0);
  const runner=value('player',null);
  const end=Math.max(1,Number(value('LEVEL_END',7900))||7900);
  const progress=runner&&Number.isFinite(runner.x)?Math.max(0,Math.min(100,Math.round(runner.x/end*100))):0;
  const hp=Math.max(0,Number(value('health',3))||0);
  snapshot.innerHTML=`<span>TIME <strong>${runTime.toFixed(1)}s</strong></span><span>CRYSTALS <strong>${runCrystals}/${crystalTotal}</strong></span><span>PROGRESS <strong>${progress}%</strong></span><span>INTEGRITY <strong>${hp}</strong></span>`;
  snapshot.setAttribute('aria-label',`Run paused. Time ${runTime.toFixed(1)} seconds. ${runCrystals} of ${crystalTotal} crystals. ${progress} percent complete. Integrity ${hp}.`);
 }
 function clearConfirm(){
  if(confirmTimer){clearTimeout(confirmTimer);confirmTimer=0;}
  if(confirming){confirming.removeAttribute('data-confirming');confirming.textContent=confirming.dataset.pauseAction==='restart'?'RESTART':'HOME';confirming.removeAttribute('aria-label');}
  confirming=null;
 }
 function armConfirm(button){
  clearConfirm();confirming=button;button.dataset.confirming='true';
  const action=button.dataset.pauseAction;
  button.textContent=action==='restart'?'CONFIRM RESTART':'CONFIRM HOME';
  button.setAttribute('aria-label',`Confirm ${action}. Tap again to continue.`);
  snapshot.setAttribute('aria-label',`${action==='restart'?'Restart':'Home'} selected. Tap the highlighted button again to confirm.`);
  confirmTimer=setTimeout(clearConfirm,2200);
 }
 function resume(){
  clearConfirm();
  if(typeof paused!=='undefined'&&paused)window.dispatchEvent(new Event('jumprunnerresume'));
 }
 window.addEventListener('jumprunnerpause',()=>{clearConfirm();setTimeout(updateSnapshot,0)});
 window.addEventListener('jumprunnerresume',clearConfirm);
 actions.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();});
 actions.addEventListener('click',e=>{
  const button=e.target.closest('button[data-pause-action]');
  if(!button)return;
  e.preventDefault();e.stopPropagation();
  const action=button.dataset.pauseAction;
  if(action==='resume'){resume();return;}
  if(confirming!==button){armConfirm(button);return;}
  clearConfirm();
  resume();
  if(action==='restart'&&typeof resetRun==='function')resetRun();
  if(action==='home'&&typeof showMenu==='function')showMenu();
 });
 updateSnapshot();
})();
