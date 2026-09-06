'use strict';
// Crystal milestone feedback: celebrates meaningful collection progress without changing scoring or difficulty.
(()=>{
  const style=document.createElement('style');
  style.textContent='.crystal-milestone{position:fixed;left:50%;top:104px;z-index:7;pointer-events:none;transform:translateX(-50%);padding:8px 13px;border:1px solid #69edff88;border-radius:999px;background:#07101ed9;color:#d9fbff;font:900 10px/1 system-ui;letter-spacing:.12em;text-transform:uppercase;box-shadow:0 0 22px #69edff22;opacity:0;animation:crystalMilestone .9s ease-out forwards}@keyframes crystalMilestone{0%{opacity:0;transform:translate(-50%,-6px) scale(.96)}18%,72%{opacity:1;transform:translate(-50%,0) scale(1)}100%{opacity:0;transform:translate(-50%,-5px) scale(1.02)}}@media(prefers-reduced-motion:reduce){.crystal-milestone{animation:none;opacity:1}}';
  document.head.appendChild(style);
  const status=document.createElement('div');
  status.className='sr-only';
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  status.setAttribute('aria-atomic','true');
  document.body.appendChild(status);
  let seen=new Set(),last=crystals,removeTimer=0,announceTimer=0;
  function milestoneFor(value){
    if(value>=totalCrystals)return{key:'all',label:'ALL CRYSTALS SECURED',speech:'All crystals secured.'};
    if(value>=20)return{key:'20',label:'20 CRYSTALS · FINAL STRETCH',speech:'20 crystals collected. Final crystal stretch.'};
    if(value>=10)return{key:'10',label:'10 CRYSTALS · ROUTE LOCKED',speech:'10 crystals collected. Route progress locked in.'};
    return null;
  }
  function show(m){
    if(!m||seen.has(m.key))return;
    seen.add(m.key);
    document.querySelector('.crystal-milestone')?.remove();
    clearTimeout(removeTimer);clearTimeout(announceTimer);
    const note=document.createElement('div');note.className='crystal-milestone';note.textContent=m.label;document.body.appendChild(note);
    removeTimer=setTimeout(()=>note.remove(),950);
    status.textContent='';announceTimer=setTimeout(()=>{status.textContent=m.speech;},20);
  }
  const base=updateHud;
  updateHud=function(){base();if(state==='play'&&crystals>last)show(milestoneFor(crystals));last=crystals;};
  const reset=resetRun;
  resetRun=function(){seen.clear();last=0;status.textContent='';clearTimeout(removeTimer);clearTimeout(announceTimer);document.querySelector('.crystal-milestone')?.remove();reset();};
})();
