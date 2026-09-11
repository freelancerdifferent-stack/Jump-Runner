'use strict';
(()=>{
  const baseResetRun=resetRun;
  let sequence=0;
  let timer=0;
  const jumpControl=document.getElementById('jumpBtn');
  const dashControl=document.getElementById('dashBtn');

  const cue=document.createElement('div');
  cue.id='startCountdown';
  cue.className='start-countdown';
  cue.setAttribute('role','status');
  cue.setAttribute('aria-live','polite');
  cue.setAttribute('aria-atomic','true');
  cue.hidden=true;
  document.body.appendChild(cue);

  function setControlsLocked(locked){
    for(const control of [jumpControl,dashControl]){
      if(!control)continue;
      control.classList.toggle('countdown-locked',locked);
      control.setAttribute('aria-disabled',locked?'true':'false');
    }
  }

  function clearTimer(){
    if(timer){clearTimeout(timer);timer=0;}
  }

  function hideCue(){
    cue.hidden=true;
    cue.textContent='';
    cue.dataset.note='';
    cue.classList.remove('is-go','countdown-tick-pop');
  }

  function pulseCue(){
    cue.classList.remove('countdown-tick-pop');
    void cue.offsetWidth;
    cue.classList.add('countdown-tick-pop');
  }

  function announceTick(label){
    pulseCue();
    window.dispatchEvent(new CustomEvent('jumprunnercountdowntick',{detail:{label:String(label),source:'start'}}));
  }

  function schedule(id,step){
    if(id!==sequence)return;
    if(paused){timer=setTimeout(()=>schedule(id,step),120);return;}

    const labels=['3','2','1','GO'];
    cue.hidden=false;
    cue.textContent=labels[step];
    cue.dataset.note=step===3?'JUMP + DASH':'AUTO-RUN STARTS ON GO';
    cue.classList.toggle('is-go',step===3);
    announceTick(labels[step]);

    if(step<3){
      timer=setTimeout(()=>schedule(id,step+1),520);
      return;
    }

    timer=setTimeout(()=>{
      if(id!==sequence)return;
      hideCue();
      state='play';
      setControlsLocked(false);
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
    setControlsLocked(true);
    last=performance.now();
    cue.hidden=false;
    cue.textContent='READY';
    cue.dataset.note='AUTO-RUN STARTS ON GO';
    cue.classList.remove('is-go');
    announceTick('READY');
    timer=setTimeout(()=>schedule(id,0),260);
  }

  resetRun=countdownResetRun;

  // game.js renders the first START button before this late polish layer loads,
  // so refresh that one handler. Later retry/home renders resolve resetRun normally.
  const initialStart=document.getElementById('start');
  if(initialStart)initialStart.onclick=countdownResetRun;

  addEventListener('jumprunnerpause',()=>{last=performance.now();});
  addEventListener('jumprunnerresume',()=>{last=performance.now();});
  addEventListener('jumprunnerresult',()=>{sequence++;clearTimer();hideCue();setControlsLocked(false);});
})();
