'use strict';
// Player-controlled pause for touch-first Android play. Reuses the native pause/resume lifecycle
// so the simulation, pause presentation and fair resume countdown all stay on one code path.
(()=>{
 const pauseCard=document.getElementById('pause');
 if(!pauseCard)return;
 const button=document.createElement('button');
 button.type='button';
 button.id='pauseBtn';
 button.className='pause-control';
 button.setAttribute('aria-label','Pause run');
 button.setAttribute('aria-pressed','false');
 button.textContent='Ⅱ';
 document.body.appendChild(button);
 const style=document.createElement('style');
 style.textContent=`.pause-control{position:fixed;z-index:18;right:max(14px,env(safe-area-inset-right));top:max(104px,calc(env(safe-area-inset-top) + 88px));width:46px;height:46px;border:1px solid #9eefff66;border-radius:50%;background:#07101ec7;color:#eaf8ff;font:900 20px/1 system-ui;letter-spacing:-.12em;display:grid;place-items:center;touch-action:manipulation;-webkit-tap-highlight-color:transparent;box-shadow:0 8px 28px #0007,0 0 18px #69edff18}.pause-control:active{transform:scale(.94)}.pause-control[aria-pressed="true"]{border-color:#ffd86b99;color:#ffd86b}.pause-control[hidden]{display:none}@media(max-height:390px){.pause-control{top:max(80px,calc(env(safe-area-inset-top) + 64px));width:40px;height:40px;font-size:17px}}`;
 document.head.appendChild(style);
 function sync(){
  const playing=typeof state!=='undefined'&&state==='play';
  const isPaused=typeof paused!=='undefined'&&paused;
  button.hidden=!playing&&!isPaused;
  button.setAttribute('aria-pressed',isPaused?'true':'false');
  button.setAttribute('aria-label',isPaused?'Resume run':'Pause run');
  button.textContent=isPaused?'▶':'Ⅱ';
 }
 function setManualPause(next){
  if(typeof state==='undefined'||state!=='play')return;
  if(next){
   if(typeof paused!=='undefined'&&paused)return;
   window.dispatchEvent(new Event('jumprunnerpause'));
  }else{
   if(typeof paused!=='undefined'&&!paused)return;
   window.dispatchEvent(new Event('jumprunnerresume'));
  }
  sync();
 }
 button.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();});
 button.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setManualPause(!(typeof paused!=='undefined'&&paused));});
 pauseCard.addEventListener('pointerdown',e=>{
  if(e.target!==pauseCard)return;
  if(typeof paused!=='undefined'&&paused){e.preventDefault();setManualPause(false);}
 });
 addEventListener('keydown',e=>{
  if(e.repeat)return;
  if((e.code==='KeyP'||e.code==='Escape')&&typeof state!=='undefined'&&state==='play'){
   e.preventDefault();setManualPause(!(typeof paused!=='undefined'&&paused));
  }
 });
 // MainActivity converts Android system Back into this event. During a run it behaves
 // like a familiar pause/back gesture instead of silently doing nothing or exiting.
 addEventListener('jumprunnerback',()=>{
  if(typeof state==='undefined'||state!=='play')return;
  setManualPause(!(typeof paused!=='undefined'&&paused));
 });
 addEventListener('jumprunnerpause',()=>queueMicrotask(sync));
 addEventListener('jumprunnerresume',()=>queueMicrotask(sync));
 const observer=new MutationObserver(sync);observer.observe(document.getElementById('overlay'),{attributes:true,attributeFilter:['class']});
 sync();
})();
