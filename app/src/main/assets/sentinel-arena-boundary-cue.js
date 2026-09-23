'use strict';
// World-space arena cue: makes the intentional auto-run hold read as a combat boundary,
// not as movement jitter or a broken runner. Purely visual; no physics/input changes.
(()=>{
  if(typeof window.drawWorld!=='function')return;
  const baseDraw=window.drawWorld;
  window.drawWorld=function(){
    baseDraw();
    if(typeof boss==='undefined'||typeof player==='undefined'||typeof BOSS_ARENA_LIMIT!=='number')return;
    const locked=state==='play'&&boss.active&&!boss.dead&&boss.arenaPinned;
    if(!locked)return;
    const x=BOSS_ARENA_LIMIT-cam-54;
    if(x<-40||x>VW+40)return;
    // Both motion controls are supported: the dedicated MOTION CALM toggle exposes
    // data-reduced-motion, while Player Comfort exposes the reduced-motion class.
    // Treat either as authoritative so this decorative pulse never ignores a comfort choice.
    const root=document.documentElement;
    const reducedMotion=root.hasAttribute('data-reduced-motion')||root.classList.contains('reduced-motion');
    const phase=reducedMotion?0:Math.sin(performance.now()/180);
    const pulse=reducedMotion ? .72 : .58+.22*phase;
    ctx.save();
    ctx.globalAlpha=pulse;
    ctx.strokeStyle='#74f7c5';
    ctx.lineWidth=2;
    ctx.setLineDash([8,8]);
    ctx.beginPath();ctx.moveTo(x,214);ctx.lineTo(x,392);ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalAlpha=reducedMotion ? .2 : .16+.08*phase;
    ctx.fillStyle='#74f7c5';ctx.fillRect(x-5,214,10,178);
    ctx.globalAlpha=.92;
    ctx.fillStyle='#07101edb';ctx.fillRect(x-48,226,96,22);
    ctx.strokeStyle='#74f7c5';ctx.strokeRect(x-48,226,96,22);
    ctx.fillStyle='#b9ffe8';ctx.font='900 9px system-ui';ctx.textAlign='center';
    ctx.fillText('COMBAT HOLD',x,241);
    ctx.restore();
  };
})();
