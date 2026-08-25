'use strict';
(()=>{
  let mode='touch';
  const labels={touch:{jump:'TAP / JUMP',dash:'DASH'},keyboard:{jump:'SPACE / ↑',dash:'X / SHIFT'},gamepad:{jump:'A / CROSS',dash:'X / SQUARE'}};
  function setMode(next){if(!labels[next]||next===mode)return;mode=next;window.dispatchEvent(new CustomEvent('jumprunnerinputmode',{detail:{mode,labels:labels[mode]}}))}
  function current(){return{mode,labels:labels[mode]}}
  addEventListener('pointerdown',()=>setMode('touch'),{passive:true});
  addEventListener('keydown',()=>setMode('keyboard'),{passive:true});
  addEventListener('gamepadconnected',()=>setMode('gamepad'));
  window.JumpRunnerInputHints={setMode,current};
})();
