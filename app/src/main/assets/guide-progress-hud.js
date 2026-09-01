'use strict';
// Guided-run polish: keep lesson progress and the current objective visible after the transient coaching toast clears.
(()=>{
  const chip=document.createElement('div');
  chip.className='guide-progress-chip';
  chip.setAttribute('role','status');
  chip.setAttribute('aria-live','polite');
  chip.setAttribute('aria-atomic','true');
  chip.style.cssText='position:fixed;z-index:12;left:50%;top:max(72px,calc(env(safe-area-inset-top) + 50px));transform:translateX(-50%);padding:6px 12px;border:1px solid rgba(105,237,255,.22);border-radius:999px;background:rgba(4,12,22,.78);box-shadow:0 8px 24px rgba(0,0,0,.28);font:800 9px/1 system-ui;letter-spacing:.12em;color:#bfefff;pointer-events:none;opacity:0;transition:opacity .18s ease;white-space:nowrap';
  document.body.appendChild(chip);
  const objectiveLabels={
    jump:'JUMP',
    dash:'BREAK BARRIER',
    counter:'DEFEAT DRONE',
    collect:'COLLECT CRYSTAL',
    checkpoint:'SECURE GATE 2',
    bossHit:'HIT GREEN CORE',
    boss:'DEFEAT SENTINEL'
  };
  let lastText='';
  function currentObjective(){
    const current=Array.isArray(tips)?tips[onboardingStage]:null;
    return current&&objectiveLabels[current.action]||'';
  }
  function refresh(){
    const active=typeof tutorialActive==='function'&&tutorialActive()&&state==='play';
    if(!active){chip.style.opacity='0';lastText='';requestAnimationFrame(refresh);return;}
    const total=Array.isArray(tips)?tips.length:0;
    const complete=total>0&&onboardingStage>=total;
    const objective=currentObjective();
    const text=complete?'GUIDE · ALL LESSONS COMPLETE':`GUIDE · ${Math.min(onboardingStage+1,total)} / ${total}${objective?' · '+objective:''}`;
    if(text!==lastText){chip.textContent=text;lastText=text;}
    chip.style.opacity='1';
    requestAnimationFrame(refresh);
  }
  refresh();
})();
