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

  function clearTransientInput(){
    releaseJump();
    dash.classList.remove('is-pressed');
    // Buffered jump input is an intent for the current moment. Clearing it on pause
    // prevents an old touch from becoming an automatic jump after the resume countdown.
    if(typeof player!=='undefined'){
      player.jumpBuffer=0;
      player.jumpHeld=false;
    }
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

  addEventListener('blur',clearTransientInput);
  addEventListener('jumprunnerpause',clearTransientInput);

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)clearTransientInput();
  });
})();
