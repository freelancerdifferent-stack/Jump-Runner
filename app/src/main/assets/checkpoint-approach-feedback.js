'use strict';
// Checkpoint approach cue: gives the runner a brief, readable heads-up before each recovery gate.
(()=>{
  if(!Array.isArray(checkpointDefs))return;
  const cue=document.createElement('div');
  cue.className='checkpoint-approach-cue';
  cue.setAttribute('role','status');
  cue.setAttribute('aria-live','polite');
  cue.setAttribute('aria-atomic','true');
  document.body.appendChild(cue);

  const style=document.createElement('style');
  style.textContent='.checkpoint-approach-cue{position:fixed;z-index:6;left:50%;top:23%;transform:translate(-50%,8px);font-size:9px;font-weight:1000;letter-spacing:.18em;color:#cffff0;text-shadow:0 2px 14px #000,0 0 16px #74f7c555;opacity:0;pointer-events:none;white-space:nowrap}.checkpoint-approach-cue.show{animation:checkpointApproach .8s ease-out forwards}@keyframes checkpointApproach{0%{opacity:0;transform:translate(-50%,8px)}20%{opacity:1;transform:translate(-50%,0)}72%{opacity:.94}100%{opacity:0;transform:translate(-50%,-8px)}}@media (prefers-reduced-motion:reduce){.checkpoint-approach-cue.show{animation:none;opacity:1;transform:translate(-50%,0)}}';
  document.head.appendChild(style);

  const warned=new Set();
  const APPROACH_DISTANCE=260;
  function refresh(){
    if(state!=='play')return;
    for(let i=Math.max(0,activeCheckpoint+1);i<checkpointDefs.length;i++){
      if(warned.has(i))continue;
      const gate=checkpointDefs[i];
      const distance=gate.x-player.x;
      if(distance>=0&&distance<=APPROACH_DISTANCE){
        warned.add(i);
        cue.textContent=`${gate.label} · RECOVERY GATE AHEAD`;
        cue.setAttribute('aria-label',`${gate.label}. Recovery gate ahead.`);
        cue.classList.remove('show');
        void cue.offsetWidth;
        cue.classList.add('show');
        break;
      }
    }
  }

  const baseUpdateHud=updateHud;
  updateHud=function(){baseUpdateHud();refresh();};
  const baseResetRun=resetRun;
  resetRun=function(){warned.clear();cue.classList.remove('show');cue.textContent='';baseResetRun();};
})();
