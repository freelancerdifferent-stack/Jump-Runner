'use strict';
// Native Android bridge behavior kept isolated from the core gameplay loop.
addEventListener('jumprunnerback',()=>{
  if(state==='play'||state==='dying'){
    paused=true;
    pauseEl.classList.add('show');
    overlay.classList.remove('hidden');
    panel.innerHTML='<div class="eyebrow">RUN PAUSED</div><h1>TAKE A <em>BEAT</em></h1><div class="sub">Your current run is still active.</div><div class="actions"><button class="btn" id="resumeRun">RESUME</button><button class="btn alt" id="quitRun">QUIT TO HOME</button></div>';
    document.getElementById('resumeRun').onclick=()=>{overlay.classList.add('hidden');paused=false;last=performance.now();pauseEl.classList.remove('show');};
    document.getElementById('quitRun').onclick=()=>{paused=false;pauseEl.classList.remove('show');showMenu();};
    return;
  }
  if(state!=='menu')showMenu();
});
