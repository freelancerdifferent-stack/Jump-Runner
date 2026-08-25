'use strict';
(()=>{
  const KEY='jr_run_history_v1';
  const LIMIT=20;
  function read(){try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(v)?v:[]}catch(_){return[]}}
  function write(v){try{localStorage.setItem(KEY,JSON.stringify(v.slice(-LIMIT)))}catch(_){}}
  function record(result){const rows=read();rows.push({at:Date.now(),result:result.result||'unknown',time:Number(result.time||0),score:Math.max(0,Math.floor(result.score||0)),crystals:Math.max(0,Math.floor(result.crystals||0)),drones:Math.max(0,Math.floor(result.drones||0)),reason:String(result.reason||'').slice(0,96)});write(rows)}
  function summary(){const rows=read(),wins=rows.filter(r=>r.result==='win'),deaths=rows.filter(r=>r.result==='dead');const reasons={};for(const r of deaths)reasons[r.reason]=(reasons[r.reason]||0)+1;const top=Object.entries(reasons).sort((a,b)=>b[1]-a[1])[0];return{runs:rows.length,wins:wins.length,winRate:rows.length?Math.round(wins.length/rows.length*100):0,bestScore:rows.reduce((m,r)=>Math.max(m,r.score),0),bestTime:wins.length?Math.min(...wins.map(r=>r.time).filter(Boolean)):0,topDeath:top?top[0]:''}}
  function clear(){try{localStorage.removeItem(KEY)}catch(_){}}
  window.JumpRunnerTelemetry={record,summary,clear};
})();
