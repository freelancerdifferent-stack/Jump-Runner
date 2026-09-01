'use strict';
// Guided-run polish: keep lesson progress and the current objective visible after the transient coaching toast clears.
(()=>{
  const chip=document.createElement('div');
  chip.className='guide-progress-chip';
  chip.setAttribute('role','status');
  chip.setAttribute('aria-live','polite');
  chip.setAttribute('aria-atomic','true');
  chip.style.cssText='position:fixed;z-index:12;left:50%;top:max(72px,calc(env(safe-area-inset-top) + 50px));transform:translateX(-50%) scale(1);padding:6px 12px;border:1px solid rgba(105,237,255,.22);border-radius:999px;background:rgba(4,12,22,.78);box-shadow:0 8px 24px rgba(0,0,0,.28);font:800 9px/1 system-ui;letter-spacing:.12em;color:#bfefff;pointer-events:none;opacity:0;transition:opacity .18s ease,transform .18s ease,background .18s ease,border-color .18s ease,color .18s ease;white-space:nowrap';
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
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const COMPLETE_HOLD_MS=720;
  let lastText='',lastStage=null,completeUntil=0;
  function currentObjective(){
    const current=Array.isArray(tips)?tips[onboardingStage]:null;
    return current&&objectiveLabels[current.action]||'';
  }
  function setCompletionStyle(active){
    chip.style.background=active?'rgba(16,58,46,.9)':'rgba(4,12,22,.78)';
    chip.style.borderColor=active?'rgba(116,247,197,.62)':'rgba(105,237,255,.22)';
    chip.style.color=active?'#bfffe8':'#bfefff';
    chip.style.transform=`translateX(-50%) scale(${active&&!reducedMotion.matches?'1.045':'1'})`;
  }
  function refresh(now=performance.now()){
    const active=typeof tutorialActive==='function'&&tutorialActive()&&state==='play';
    if(!active){
      chip.style.opacity='0';
      setCompletionStyle(false);
      lastText='';lastStage=null;completeUntil=0;
      requestAnimationFrame(refresh);return;
    }
    const total=Array.isArray(tips)?tips.length:0;
    const stage=Math.min(onboardingStage,total);
    if(lastStage!==null&&stage>lastStage&&stage<=total)completeUntil=now+COMPLETE_HOLD_MS;
    lastStage=stage;
    const celebrating=now<completeUntil;
    const complete=total>0&&stage>=total;
    const objective=currentObjective();
    const completionText=`✓ GUIDE · LESSON COMPLETE${objective&&!complete?' · NEXT: '+objective:''}`;
    const text=celebrating?completionText:complete?'GUIDE · ALL LESSONS COMPLETE':`GUIDE · ${Math.min(stage+1,total)} / ${total}${objective?' · '+objective:''}`;
    if(text!==lastText){chip.textContent=text;lastText=text;}
    setCompletionStyle(celebrating);
    chip.style.opacity='1';
    requestAnimationFrame(refresh);
  }
  refresh();
})();
