'use strict';
// Small polish slice: reassure the runner after a close hazard escape without changing gameplay.
(()=>{
  let lastCue=0;
  const cue=()=>{
    const now=performance.now();
    if(now-lastCue<1800)return;
    lastCue=now;
    const el=document.createElement('div');
    el.className='recovery-cue';
    el.textContent='CLOSE CALL · KEEP MOVING';
    el.setAttribute('role','status');
    el.setAttribute('aria-live','polite');
    el.setAttribute('aria-atomic','true');
    document.body.appendChild(el);
    requestAnimationFrame(()=>el.classList.add('show'));
    setTimeout(()=>{el.classList.remove('show');setTimeout(()=>el.remove(),220)},900);
  };
  window.addEventListener('jumprunnernearmiss',cue);
})();
