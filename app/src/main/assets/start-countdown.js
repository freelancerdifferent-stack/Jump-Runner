'use strict';
(()=>{
  const baseResetRun=resetRun;
  let sequence=0;
  let timer=0;

  const cue=document.createElement('div');
  cue.id='startCountdown';
  cue.className='start-countdown';
  cue.setAttribute('role','status');
  cue.setAttribute('aria-live','polite');
  cue.setAttribute('aria-atomic','true');
  cue.hidden=true;
  document.body.appendChild(cue);

  function clearTimer(){
    if(timer){clearTimeout(timer);timer=0;}
  }

  function hideCue(){
    cue.hidden=true;
    cue.textContent='';
    cue.classList.remove('is-go');
  }

  function schedule(id,step){
    if(id!==sequence)return;
    if(paused){timer=setTimeout(()=>schedule(id,step),120);return;}

    const labels=['3','2','1','GO'];
    cue.hidden=false;
    cue.textContent=labels[step];
    cue.classList.toggle('is-go',step===3);

    if(step<3){
      timer=setTimeout(()=>schedule(id,step+1),520);
      return;
    }

    timer=setTimeout(()=>{
      if(id!==sequence)return;
      hideCue();
      state='play';
      last=performance.now();
      window.dispatchEvent(new CustomEvent('jumprunnercountdowncomplete'));
    },360);
  }

  function countdownResetRun(){
    sequence++;
    clearTimer();
    const id=sequence;
    baseResetRun();
    state='countdown';
    last=performance.now();
    cue.hidden=false;
    cue.textContent='READY';
    cue.classList.remove('is-go');
    timer=setTimeout(()=>schedule(id,0),260);
  }

  resetRun=countdownResetRun;

  // game.js renders the first START button before this late polish layer loads,
  // so refresh that one handler. Later retry/home renders resolve resetRun normally.
  const initialStart=document.getElementById('start');
  if(initialStart)initialStart.onclick=countdownResetRun;

  addEventListener('jumprunnerpause',()=>{last=performance.now();});
  addEventListener('jumprunnerresume',()=>{last=performance.now();});
  addEventListener('jumprunnerresult',()=>{sequence++;clearTimer();hideCue();});
})();
