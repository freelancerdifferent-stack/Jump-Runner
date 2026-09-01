'use strict';
// Guided-run polish: keep lesson progress, the current objective, and the required input visible after the transient coaching toast clears.
(()=>{
  const chip=document.createElement('div');
  chip.className='guide-progress-chip';
  chip.setAttribute('role','status');
  chip.setAttribute('aria-live','polite');
  chip.setAttribute('aria-atomic','true');
  const NORMAL_TOP='max(72px,calc(env(safe-area-inset-top) + 50px))';
  const BOSS_TOP='max(112px,calc(env(safe-area-inset-top) + 90px))';
  chip.style.cssText=`position:fixed;z-index:12;left:50%;top:${NORMAL_TOP};transform:translateX(-50%) scale(1);box-sizing:border-box;max-width:calc(100vw - 32px);overflow:hidden;text-overflow:ellipsis;padding:6px 12px;border:1px solid rgba(105,237,255,.22);border-radius:999px;background:rgba(4,12,22,.78);box-shadow:0 8px 24px rgba(0,0,0,.28);font:800 9px/1 system-ui;letter-spacing:.12em;color:#bfefff;pointer-events:none;opacity:0;transition:opacity .18s ease,transform .18s ease,background .18s ease,border-color .18s ease,color .18s ease,top .18s ease;white-space:nowrap`;
  document.body.appendChild(chip);
  const focusStyle=document.createElement('style');
  focusStyle.textContent='.control.guide-control-focus{outline:2px solid rgba(191,255,232,.92);outline-offset:5px;box-shadow:0 0 0 5px rgba(105,237,255,.14),0 0 28px rgba(105,237,255,.28);transform:scale(1.045)}@media(prefers-reduced-motion:reduce){.control.guide-control-focus{transform:none}}';
  document.head.appendChild(focusStyle);
  const jumpControl=document.getElementById('jumpBtn'),dashControl=document.getElementById('dashBtn');
  const objectiveLabels={jump:'JUMP',dash:'BREAK BARRIER',counter:'DEFEAT DRONE',collect:'COLLECT CRYSTAL',checkpoint:'SECURE GATE 2',bossHit:'HIT GREEN CORE',boss:'DEFEAT SENTINEL'};
  const inputLabels={jump:'JUMP',dash:'DASH',counter:'JUMP / DASH',bossHit:'JUMP / DASH',boss:'JUMP / DASH'};
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
  const COMPLETE_HOLD_MS=720;
  let lastText='',lastStage=null,completeUntil=0;
  function currentTip(){return Array.isArray(tips)?tips[onboardingStage]:null;}
  function currentObjective(){const current=currentTip();return current&&objectiveLabels[current.action]||'';}
  function currentInput(){const current=currentTip();return current&&inputLabels[current.action]||'';}
  function setControlFocus(input,active){
    const jumpNeeded=active&&(input==='JUMP'||input==='JUMP / DASH');
    const dashNeeded=active&&(input==='DASH'||input==='JUMP / DASH');
    jumpControl?.classList.toggle('guide-control-focus',jumpNeeded);
    dashControl?.classList.toggle('guide-control-focus',dashNeeded);
  }
  function setCompletionStyle(active){
    chip.style.background=active?'rgba(16,58,46,.9)':'rgba(4,12,22,.78)';
    chip.style.borderColor=active?'rgba(116,247,197,.62)':'rgba(105,237,255,.22)';
    chip.style.color=active?'#bfffe8':'#bfefff';
    chip.style.transform=`translateX(-50%) scale(${active&&!reducedMotion.matches?'1.045':'1'})`;
  }
  function setBossHudClearance(active){chip.style.top=active?BOSS_TOP:NORMAL_TOP;}
  function refresh(now=performance.now()){
    const active=typeof tutorialActive==='function'&&tutorialActive()&&state==='play';
    const bossHudActive=typeof boss!=='undefined'&&!boss.dead&&(boss.active||boss.intro>0);
    setBossHudClearance(active&&bossHudActive);
    if(!active){chip.style.opacity='0';setCompletionStyle(false);setControlFocus('',false);lastText='';lastStage=null;completeUntil=0;requestAnimationFrame(refresh);return;}
    const total=Array.isArray(tips)?tips.length:0;
    const stage=Math.min(onboardingStage,total);
    if(lastStage!==null&&stage>lastStage&&stage<=total)completeUntil=now+COMPLETE_HOLD_MS;
    lastStage=stage;
    const celebrating=now<completeUntil;
    const complete=total>0&&stage>=total;
    const objective=currentObjective(),input=currentInput();
    const objectiveText=objective+(input?' · INPUT '+input:'');
    const completionText=`✓ GUIDE · LESSON COMPLETE${objective&&!complete?' · NEXT: '+objectiveText:''}`;
    const text=celebrating?completionText:complete?'GUIDE · ALL LESSONS COMPLETE':`GUIDE · ${Math.min(stage+1,total)} / ${total}${objectiveText?' · '+objectiveText:''}`;
    if(text!==lastText){chip.textContent=text;chip.setAttribute('aria-label',text);lastText=text;}
    setCompletionStyle(celebrating);
    setControlFocus(input,!complete&&!celebrating);
    chip.style.opacity='1';
    requestAnimationFrame(refresh);
  }
  refresh();
})();
