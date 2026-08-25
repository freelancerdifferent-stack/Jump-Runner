'use strict';
(()=>{
  function advise(){
    const s=window.JumpRunnerTelemetry?.summary?.()||{runs:0,wins:0,winRate:0,topDeath:''};
    if(s.runs<3)return{tone:'new',title:'BUILD YOUR RHYTHM',body:'Finish a few runs to unlock personalized practice guidance.'};
    if(s.winRate>=70)return{tone:'mastery',title:'PUSH FOR MASTERY',body:'Your clears are consistent. Chase cleaner lines, faster clears, and higher flow.'};
    if(s.winRate<=25)return{tone:'practice',title:'STABILIZE THE RUN',body:s.topDeath?`Most failures: ${s.topDeath}. Prioritize survival and checkpoint consistency.`:'Prioritize survival, clean jumps, and checkpoint consistency.'};
    return{tone:'progress',title:'KEEP THE MOMENTUM',body:'Your consistency is rising. Convert more mid-run progress into complete clears.'};
  }
  window.JumpRunnerSessionQuality={advise};
})();
