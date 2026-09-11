'use strict';
(()=>{
  const original=window.showResult;
  if(typeof original!=='function')return;
  let finishing=false;
  window.showResult=function(win){
    if(finishing)return;
    finishing=true;
    const didWin=Boolean(win);
    const resultReason=!didWin&&typeof deathReason==='string'?deathReason:'';
    try{
      original(didWin);
      window.dispatchEvent(new CustomEvent('jumprunnerresult',{detail:{win:didWin,reason:resultReason}}));
    }catch(err){
      console.error('JumpRunner finish transition failed',err);
      try{
        const o=document.getElementById('overlay'),p=document.getElementById('panel');
        if(o)o.classList.remove('hidden');
        if(p)p.innerHTML='<div class="eyebrow">TRIAL COMPLETE</div><h1>RUN <em>COMPLETE</em></h1><div class="sub">The run finished successfully. Result details could not be rendered.</div><div class="actions"><button class="btn" id="safeRetry">RUN AGAIN</button></div>';
        const b=document.getElementById('safeRetry');
        if(b)b.onclick=()=>{finishing=false;window.resetRun?.()};
      }catch(fallbackError){console.error('JumpRunner finish fallback failed',fallbackError)}
    }
    setTimeout(()=>{finishing=false},700);
  };
  window.addEventListener('error',e=>console.error('JumpRunner runtime error',e.error||e.message));
  window.addEventListener('unhandledrejection',e=>console.error('JumpRunner unhandled rejection',e.reason));
})();
