'use strict';
(()=>{
  function stats(){return window.JumpRunnerTelemetry?.summary?.()||{runs:0,wins:0,winRate:0,bestScore:0,bestTime:0,topDeath:''}}
  function label(){const s=stats();if(!s.runs)return'No local runs recorded yet.';const pace=s.bestTime?` · best clear ${s.bestTime.toFixed(1)}s`:'';return`${s.runs} recent runs · ${s.winRate}% clear rate · best ${String(s.bestScore).padStart(6,'0')}${pace}`}
  function card(){const s=stats();return`<div class="legend"><span>RUN HISTORY</span><span>${label()}</span></div>${s.topDeath?`<div class="legend"><span>COMMON FAILURE</span><span>${s.topDeath}</span></div>`:''}`}
  window.JumpRunnerRunHistory={stats,label,card};
})();
