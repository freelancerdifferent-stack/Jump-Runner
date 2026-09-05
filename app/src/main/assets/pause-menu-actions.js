'use strict';
// Compact pause actions for touch-first play. Keeps pause/resume on the existing lifecycle path
// while making restart and exit-to-menu discoverable without forcing an app restart.
(()=>{
 const card=document.getElementById('pause');
 if(!card)return;
 const actions=document.createElement('div');
 actions.className='pause-actions';
 actions.setAttribute('role','group');
 actions.setAttribute('aria-label','Paused run actions');
 actions.innerHTML='<button type="button" data-pause-action="resume">RESUME</button><button type="button" data-pause-action="restart">RESTART</button><button type="button" data-pause-action="home">HOME</button>';
 card.appendChild(actions);
 const style=document.createElement('style');
 style.textContent=`.pause-actions{display:flex;gap:8px;justify-content:center;margin-top:12px}.pause-actions button{min-width:76px;min-height:36px;padding:0 12px;border:1px solid #9eefff55;border-radius:999px;background:#091727e8;color:#eaf8ff;font:800 9px/1 system-ui;letter-spacing:.12em;touch-action:manipulation;-webkit-tap-highlight-color:transparent}.pause-actions button:first-child{border-color:#74f7c588;color:#74f7c5}.pause-actions button:active{transform:scale(.96)}@media(max-height:390px){.pause-actions{margin-top:8px;gap:6px}.pause-actions button{min-width:66px;min-height:32px;padding:0 9px;font-size:8px}}`;
 document.head.appendChild(style);
 function resume(){
  if(typeof paused!=='undefined'&&paused)window.dispatchEvent(new Event('jumprunnerresume'));
 }
 actions.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();});
 actions.addEventListener('click',e=>{
  const button=e.target.closest('button[data-pause-action]');
  if(!button)return;
  e.preventDefault();e.stopPropagation();
  const action=button.dataset.pauseAction;
  if(action==='resume'){resume();return;}
  resume();
  if(action==='restart'&&typeof resetRun==='function')resetRun();
  if(action==='home'&&typeof showMenu==='function')showMenu();
 });
})();
