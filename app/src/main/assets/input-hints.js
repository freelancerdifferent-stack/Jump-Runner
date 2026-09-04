'use strict';
(()=>{
  let mode='touch';
  const labels={touch:{jump:'TAP / JUMP',dash:'DASH'},keyboard:{jump:'SPACE / UP',dash:'X / SHIFT'},gamepad:{jump:'A / CROSS',dash:'X / SQUARE'}};
  function apply(next){
    if(!labels[next])return;
    mode=next;
    const l=labels[mode];
    const jump=document.getElementById('jumpBtn');
    const dash=document.getElementById('dashBtn');
    if(jump)jump.dataset.hint=l.jump;
    if(dash)dash.dataset.hint=l.dash;
    window.dispatchEvent(new CustomEvent('jumprunnerinputmode',{detail:{mode,labels:l}}));
  }
  function setMode(next){if(next!==mode)apply(next)}
  function current(){return{mode,labels:labels[mode]}}
  addEventListener('pointerdown',()=>setMode('touch'),{passive:true});
  addEventListener('keydown',()=>setMode('keyboard'),{passive:true});
  addEventListener('gamepadconnected',()=>setMode('gamepad'));
  addEventListener('DOMContentLoaded',()=>apply(mode),{once:true});
  window.JumpRunnerInputHints={setMode,current};
})();
