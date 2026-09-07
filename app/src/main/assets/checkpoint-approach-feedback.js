'use strict';
// Checkpoint approach cue: gives the runner a brief, readable heads-up before each recovery gate.
// When the previous result identified a pace target, the matching gate becomes a one-shot focus cue.
// Reaching that gate now closes the loop with a restrained pace-resolution acknowledgement.
(()=>{
  if(!Array.isArray(checkpointDefs))return;
  const FOCUS_STORAGE_KEY='jr_retry_focus';
  const cue=document.createElement('div');
  cue.className='checkpoint-approach-cue';
  cue.setAttribute('role','status');
  cue.setAttribute('aria-live','polite');
  cue.setAttribute('aria-atomic','true');
  document.body.appendChild(cue);

  const style=document.createElement('style');
  style.textContent='.checkpoint-approach-cue{position:fixed;z-index:6;left:50%;top:23%;transform:translate(-50%,8px);font-size:9px;font-weight:1000;letter-spacing:.18em;color:#cffff0;text-shadow:0 2px 14px #000,0 0 16px #74f7c555;opacity:0;pointer-events:none;white-space:nowrap}.checkpoint-approach-cue.focus{color:#ffe69a;text-shadow:0 2px 14px #000,0 0 20px #ffd86b77}.checkpoint-approach-cue.cleared{color:#8dffd0;text-shadow:0 2px 14px #000,0 0 22px #74f7c588}.checkpoint-approach-cue.show{animation:checkpointApproach .8s ease-out forwards}@keyframes checkpointApproach{0%{opacity:0;transform:translate(-50%,8px)}20%{opacity:1;transform:translate(-50%,0)}72%{opacity:.94}100%{opacity:0;transform:translate(-50%,-8px)}}@media (prefers-reduced-motion:reduce){.checkpoint-approach-cue.show{animation:none;opacity:1;transform:translate(-50%,0)}}';
  document.head.appendChild(style);

  const warned=new Set();
  const APPROACH_DISTANCE=260;
  let focusTarget=null,focusResolved=false,cueTimer=0;
  function readFocusTarget(){
    try{
      const raw=localStorage.getItem(FOCUS_STORAGE_KEY);
      if(!raw)return null;
      const value=JSON.parse(raw);
      return value&&Number.isInteger(value.index)&&Number(value.delta)>.15?value:null;
    }catch{return null}
  }
  function hideCue(){
    if(cueTimer){clearTimeout(cueTimer);cueTimer=0;}
    cue.classList.remove('show','focus','cleared');
    cue.textContent='';
    cue.removeAttribute('aria-label');
  }
  function presentCue(text,label,{focus=false,cleared=false,duration=950}={}){
    if(cueTimer)clearTimeout(cueTimer);
    cue.classList.toggle('focus',Boolean(focus));
    cue.classList.toggle('cleared',Boolean(cleared));
    cue.textContent=text;
    cue.setAttribute('aria-label',label);
    cue.classList.remove('show');
    void cue.offsetWidth;
    cue.classList.add('show');
    cueTimer=setTimeout(hideCue,duration);
  }
  function refresh(){
    if(state!=='play')return;
    for(let i=Math.max(0,activeCheckpoint+1);i<checkpointDefs.length;i++){
      if(warned.has(i))continue;
      const gate=checkpointDefs[i];
      const distance=gate.x-player.x;
      if(distance>=0&&distance<=APPROACH_DISTANCE){
        warned.add(i);
        const isFocus=focusTarget&&focusTarget.index===i;
        if(isFocus){
          const delta=Number(focusTarget.delta)||0;
          presentCue(`FOCUS GATE · ${gate.label} · RECOVER ${delta.toFixed(1)}s`,`${gate.label}. Focus gate ahead. Recover ${delta.toFixed(1)} seconds.`,{focus:true});
        }else{
          presentCue(`${gate.label} · RECOVERY GATE AHEAD`,`${gate.label}. Recovery gate ahead.`);
        }
        break;
      }
    }
  }
  function resolveFocus(event){
    const detail=event&&event.detail;
    if(!focusTarget||focusResolved||!detail||detail.index!==focusTarget.index)return;
    focusResolved=true;
    const delta=Number(detail.delta)||0;
    const cleared=Boolean(detail.isBest)||delta<=.15;
    if(cleared){
      presentCue(`FOCUS CLEARED · ${detail.label}`,`${detail.label}. Focus cleared. Pace target met.`,{cleared:true,duration:1150});
    }else{
      presentCue(`FOCUS GAP · ${detail.label} · +${Math.max(0,delta).toFixed(1)}s`,`${detail.label}. Focus gate reached. ${Math.max(0,delta).toFixed(1)} seconds behind best pace.`,{focus:true,duration:1150});
    }
  }

  const baseUpdateHud=updateHud;
  updateHud=function(){baseUpdateHud();refresh();};
  const baseResetRun=resetRun;
  resetRun=function(){warned.clear();focusTarget=readFocusTarget();focusResolved=false;hideCue();baseResetRun();};
  addEventListener('jumprunnercheckpointsplit',resolveFocus);
  addEventListener('jumprunnerpause',hideCue);
})();
