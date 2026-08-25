'use strict';
// Small input buffer for touch/keyboard dash presses that land just before cooldown ends.
(()=>{
  const BUFFER_WINDOW=.12;
  let dashBuffer=0;
  const baseInputDash=inputDash;
  const baseUpdate=update;
  const baseResetRun=resetRun;

  inputDash=function(){
    if(state!=='play')return;
    if(player.dashCd>0){
      dashBuffer=BUFFER_WINDOW;
      return;
    }
    dashBuffer=0;
    baseInputDash();
  };

  update=function(dt){
    if(dashBuffer>0){
      dashBuffer=Math.max(0,dashBuffer-dt);
      if(state==='play'&&player.dashCd<=0){
        dashBuffer=0;
        baseInputDash();
      }
    }
    baseUpdate(dt);
  };

  resetRun=function(){
    dashBuffer=0;
    baseResetRun();
  };
})();
