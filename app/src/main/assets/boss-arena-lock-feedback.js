'use strict';
(()=>{
  if(typeof boss==='undefined'||typeof player==='undefined')return;
  const cue=document.createElement('div');
  cue.id='bossArenaLockCue';
  cue.setAttribute('role','status');
  cue.setAttribute('aria-live','polite');
  cue.setAttribute('aria-atomic','true');
  cue.textContent='ARENA MODE · AUTO-RUN PAUSED · JUMP / DASH TO FIGHT';
  Object.assign(cue.style,{
    position:'fixed',left:'50%',top:'max(104px, calc(env(safe-area-inset-top) + 86px))',
    transform:'translate(-50%,-8px)',padding:'8px 14px',borderRadius:'999px',
    border:'1px solid rgba(116,247,197,.55)',background:'rgba(7,16,30,.82)',
    color:'#b9ffe8',font:'800 11px system-ui',letterSpacing:'.1em',pointerEvents:'none',
    opacity:'0',transition:'opacity .18s ease, transform .18s ease',zIndex:'18',
    whiteSpace:'nowrap',maxWidth:'calc(100vw - 32px)',overflow:'hidden',textOverflow:'ellipsis'
  });
  document.body.appendChild(cue);
  let shown=false;
  let announced=false;
  function refresh(){
    const locked=state==='play'&&boss.active&&!boss.dead&&typeof BOSS_ARENA_LIMIT==='number'&&player.x>=BOSS_ARENA_LIMIT-6;
    if(locked!==shown){
      shown=locked;
      cue.style.opacity=locked?'1':'0';
      cue.style.transform=locked?'translate(-50%,0)':'translate(-50%,-8px)';
    }
    if(locked&&!announced){
      cue.textContent='ARENA MODE · AUTO-RUN PAUSED · JUMP / DASH TO FIGHT';
      cue.setAttribute('aria-label','Sentinel arena mode. Auto-run paused. Use Jump and Dash to fight.');
      announced=true;
    }else if(!locked&&announced){
      announced=false;
      cue.textContent='ARENA MODE · AUTO-RUN PAUSED · JUMP / DASH TO FIGHT';
      cue.removeAttribute('aria-label');
    }
    requestAnimationFrame(refresh);
  }
  requestAnimationFrame(refresh);
})();
