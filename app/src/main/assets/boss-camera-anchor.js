'use strict';
(()=>{
  if(typeof boss==='undefined'||typeof player==='undefined'||typeof BOSS_ARENA_LIMIT!=='number')return;
  const CAMERA_LEAD=210;
  const arenaCameraMax=Math.max(0,BOSS_ARENA_LIMIT-CAMERA_LEAD);
  function stabilize(){
    if(state==='play'&&boss.active&&!boss.dead&&player.x>=BOSS_ARENA_LIMIT-1){
      // game.js advances the auto-runner and camera before boss.js clamps the runner
      // at the arena edge. Cap the camera here as well so the final encounter does
      // not visually twitch forward and snap back on every frame.
      cam=Math.min(cam,arenaCameraMax);
    }
    requestAnimationFrame(stabilize);
  }
  requestAnimationFrame(stabilize);
})();
