'use strict';
(()=>{
  const jump=document.getElementById('jumpBtn');
  const dash=document.getElementById('dashBtn');
  if(!jump||!dash||typeof window.inputJump!=='function')return;

  let jumpPointer=null;

  function capture(button,e){
    try{button.setPointerCapture?.(e.pointerId);}catch(_){/* best effort */}
  }

  function releaseJump(pointerId){
    if(jumpPointer===null)return;
    if(pointerId!==undefined&&pointerId!==jumpPointer)return;
    jumpPointer=null;
    window.inputJump(false);
    jump.classList.remove('is-pressed');
  }

  jump.addEventListener('pointerdown',e=>{
    if(jumpPointer!==null)return;
    jumpPointer=e.pointerId;
    capture(jump,e);
    jump.classList.add('is-pressed');
  });

  dash.addEventListener('pointerdown',e=>{
    capture(dash,e);
    dash.classList.add('is-pressed');
  });

  addEventListener('pointerup',e=>{
    releaseJump(e.pointerId);
    if(e.pointerId!==jumpPointer)dash.classList.remove('is-pressed');
  },true);

  addEventListener('pointercancel',e=>{
    releaseJump(e.pointerId);
    dash.classList.remove('is-pressed');
  },true);

  jump.addEventListener('lostpointercapture',e=>releaseJump(e.pointerId));
  dash.addEventListener('lostpointercapture',()=>dash.classList.remove('is-pressed'));

  addEventListener('blur',()=>{
    releaseJump();
    dash.classList.remove('is-pressed');
  });

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      releaseJump();
      dash.classList.remove('is-pressed');
    }
  });
})();
