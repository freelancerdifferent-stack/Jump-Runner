'use strict';
// Small input buffer for touch/keyboard dash presses that land just before cooldown ends.
(()=>{
  const BUFFER_WINDOW=.12;
  let dashBuffer=0;
  const baseInputDash=inputDash;
  const baseUpdate=update;
  const baseResetRun=resetRun;
  const dashButton=document.getElementById('dashBtn');

  const style=document.createElement('style');
  style.textContent='.control.dash.is-buffered{transform:scale(.96);box-shadow:0 0 0 2px #ffe69b88,0 0 18px #ffd86b55 inset}.control.dash.is-buffered::after{content:"QUEUED";position:absolute;left:50%;bottom:5px;transform:translateX(-50%);font-size:6px;font-weight:1000;letter-spacing:.14em;color:#fff4b8;text-shadow:0 1px 6px #000}';
  document.head.appendChild(style);

  function setQueued(on){
    dashButton?.classList.toggle('is-buffered',on);
    dashButton?.setAttribute('aria-label',on?'Dash queued':'Dash');
  }

  inputDash=function(){
    if(state!=='play')return;
    if(player.dashCd>0){
      dashBuffer=BUFFER_WINDOW;
      setQueued(true);
      return;
    }
    dashBuffer=0;
    setQueued(false);
    baseInputDash();
  };

  update=function(dt){
    if(dashBuffer>0){
      dashBuffer=Math.max(0,dashBuffer-dt);
      if(state==='play'&&player.dashCd<=0){
        dashBuffer=0;
        setQueued(false);
        baseInputDash();
      }else if(dashBuffer<=0){
        setQueued(false);
      }
    }
    baseUpdate(dt);
  };

  resetRun=function(){
    dashBuffer=0;
    setQueued(false);
    baseResetRun();
  };
})();
