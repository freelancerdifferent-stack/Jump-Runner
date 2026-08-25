'use strict';
// Crystal pickup feedback: compact HUD pulse and accessible acknowledgement without changing scoring.
(()=>{
  const target=document.getElementById('crystals');
  if(!target)return;
  const style=document.createElement('style');
  style.textContent='#crystals.crystal-pulse{animation:crystalPulse .28s ease-out}@keyframes crystalPulse{0%{transform:scale(1)}38%{transform:scale(1.18);text-shadow:0 0 16px #69edff}100%{transform:scale(1)}}.crystal-float{position:fixed;z-index:6;pointer-events:none;color:#bff8ff;font-size:9px;font-weight:950;letter-spacing:.12em;text-shadow:0 2px 12px #06111e;animation:crystalFloat .52s ease-out forwards}@keyframes crystalFloat{0%{opacity:0;transform:translate(-50%,6px) scale(.9)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-18px) scale(1.04)}}';
  document.head.appendChild(style);
  const status=document.createElement('div');
  status.className='sr-only';
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  status.setAttribute('aria-atomic','true');
  document.body.appendChild(status);
  let previous=crystals,announceTimer=0;
  function announce(){
    clearTimeout(announceTimer);status.textContent='';
    announceTimer=setTimeout(()=>{status.textContent='Crystal collected. '+crystals+' of '+totalCrystals+'.'+(flow>=4?' Flow streak active.':'');},20);
  }
  function pulse(){
    target.classList.remove('crystal-pulse');void target.offsetWidth;target.classList.add('crystal-pulse');
    const r=target.getBoundingClientRect(),note=document.createElement('div');note.className='crystal-float';note.textContent=flow>=4?'FLOW + CRYSTAL':'+ CRYSTAL';note.style.left=(r.left+r.width/2)+'px';note.style.top=(r.bottom+4)+'px';document.body.appendChild(note);setTimeout(()=>note.remove(),560);announce();
  }
  const base=updateHud;
  updateHud=function(){base();if(state==='play'&&crystals>previous)pulse();previous=crystals;};
  const reset=resetRun;resetRun=function(){previous=0;status.textContent='';clearTimeout(announceTimer);reset();};
})();
