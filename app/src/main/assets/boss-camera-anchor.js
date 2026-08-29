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

      // The base update also records a trail sample before boss.js restores the
      // runner to the arena boundary. Without normalizing those samples, the cyan
      // speed trail can briefly appear in front of the player while they are held
      // at the Sentinel arena edge. Keep every live trail point at or behind the
      // same physical boundary so the hold reads as intentional rather than jitter.
      if(Array.isArray(player.trail)){
        for(const point of player.trail){
          if(point&&Number.isFinite(point.x))point.x=Math.min(point.x,BOSS_ARENA_LIMIT);
        }
      }
    }
    requestAnimationFrame(stabilize);
  }
  requestAnimationFrame(stabilize);
})();
