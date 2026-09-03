'use strict';
// Small mobile polish slice: make the two-button auto-run contract obvious and robust.
(()=>{
  const jump=document.getElementById('jumpBtn');
  const dash=document.getElementById('dashBtn');
  if(!jump||!dash)return;
  const set=(el,label,pressed)=>{
    el.setAttribute('aria-label',label);
    el.setAttribute('aria-pressed',pressed?'true':'false');
    el.classList.toggle('pressed',pressed);
  };
  set(jump,'Jump — the runner moves forward automatically',false);
  set(dash,'Dash — break barriers and strike the Sentinel core',false);
  const press=(el,label,fn)=>{
    el.addEventListener('pointerdown',()=>set(el,label,true),{passive:true});
    ['pointerup','pointercancel','pointerleave'].forEach(type=>el.addEventListener(type,()=>set(el,label,false),{passive:true}));
    el.addEventListener('keydown',e=>{if(e.code==='Space'||e.code==='Enter')set(el,label,true)});
    el.addEventListener('keyup',e=>{if(e.code==='Space'||e.code==='Enter')set(el,label,false)});
  };
  press(jump,'Jump — the runner moves forward automatically');
  press(dash,'Dash — break barriers and strike the Sentinel core');
  const hint=document.createElement('div');
  hint.className='control-contract-hint';
  hint.textContent='AUTO-RUN · JUMP TO CLEAR · DASH TO BREAK';
  hint.setAttribute('aria-live','polite');
  document.body.appendChild(hint);
})();
