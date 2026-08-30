'use strict';
// A checkpoint retry should restart the Sentinel encounter cleanly instead of inheriting
// damaged HP, live projectiles, recoil, or an already-spent core pass from the failed attempt.
(()=>{
  const originalRestore=window.restoreCheckpoint;
  if(typeof originalRestore!=='function'||typeof window.resetBoss!=='function')return;
  window.restoreCheckpoint=function(){
    const encounterDirty=typeof boss!=='undefined'&&(
      boss.active||boss.dead||boss.hp!==boss.maxHp||boss.hitCd>0||boss.recoil>0||boss.passSpent||
      (Array.isArray(bossShots)&&bossShots.length>0)
    );
    if(encounterDirty)window.resetBoss();
    originalRestore();
    window.dispatchEvent(new CustomEvent('jumprunnercheckpointrestore',{detail:{sentinelReset:encounterDirty}}));
  };
})();
