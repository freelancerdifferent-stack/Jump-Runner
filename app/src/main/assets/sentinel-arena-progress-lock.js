'use strict';
// Final-arena HUD polish: base gameplay advances the runner briefly before the boss layer
// restores the arena pin, so keep the top progress bar anchored to the true held position.
const sentinelArenaProgressBaseUpdate=update;
function sentinelArenaProgressPinned(){
  return state==='play'&&typeof boss!=='undefined'&&typeof BOSS_ARENA_LIMIT!=='undefined'&&boss.active&&!boss.dead&&player.x>=BOSS_ARENA_LIMIT-1;
}
update=function(dt){
  sentinelArenaProgressBaseUpdate(dt);
  if(!sentinelArenaProgressPinned())return;
  const heldProgress=Math.min(100,BOSS_ARENA_LIMIT/LEVEL_END*100);
  progressEl.style.width=heldProgress+'%';
};
