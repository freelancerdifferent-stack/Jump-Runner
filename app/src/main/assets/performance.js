'use strict';
(()=>{
  let frames=0,elapsed=0,quality='high';
  function tick(dt){if(!Number.isFinite(dt)||dt<=0)return quality;frames++;elapsed+=dt;if(elapsed>=4){const fps=frames/elapsed;if(fps<42)quality='low';else if(fps>55)quality='high';frames=0;elapsed=0;}return quality}
  function profile(){return quality==='low'?{quality,particles:.45,decorations:.6,screenShake:.75}:{quality,particles:1,decorations:1,screenShake:1}}
  function reset(){frames=0;elapsed=0;quality='high'}
  window.JumpRunnerPerformance={tick,profile,reset};
})();
