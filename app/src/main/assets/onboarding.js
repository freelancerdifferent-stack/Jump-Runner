'use strict';
// First-run contextual onboarding. No gameplay slowdown, no network dependency.
// Early lessons advance only after the player demonstrates the requested gameplay action,
// preventing distance-based tips from racing ahead or teaching mechanics without purpose.
// Tutorial completion is persisted only after a successful first guided run. Replaying
// the tutorial is a temporary practice mode and never erases the player's completion.
const onboardingKey='jr_onboarding_v1';
const ACTION_TIP_REPEAT_MS=6200;
const ACTION_TIP_VISIBLE_MS=4200;
const PASSIVE_TIP_VISIBLE_MS=2600;
function readOnboardingDone(){try{return localStorage.getItem(onboardingKey)==='1';}catch(error){return false;}}
function saveOnboardingDone(done){try{if(done)localStorage.setItem(onboardingKey,'1');else localStorage.removeItem(onboardingKey);}catch(error){/* Storage may be unavailable in private/restricted WebViews. */}}
let onboardingDone=readOnboardingDone();
let replayTutorial=false;
let onboardingStage=0,shownStage=-1,tipRepeatAt=0,guideCompleteShown=false,lessonCrystalBaseline=0;
const tip=document.createElement('div');tip.className='coach-tip';tip.setAttribute('role','status');tip.setAttribute('aria-live','polite');tip.setAttribute('aria-atomic','true');document.body.appendChild(tip);
const tips=[
  {x:0,text:'AUTO-RUN ACTIVE · RUNNER MOVES FORWARD ON ITS OWN · TAP JUMP FOR A LOW HOP, HOLD A LITTLE LONGER FOR HEIGHT',action:'jump'},
  {x:650,text:'TRY DASH · tap DASH as you reach the first energy barrier · BREAK IT TO COMPLETE THIS LESSON',action:'dash'},
  {x:1260,text:'COUNTER THE FIRST DRONE · STOMP FROM ABOVE OR DASH THROUGH IT · DEFEAT IT TO COMPLETE THIS LESSON',action:'counter'},
  {x:2350,text:'BUILD FLOW · COLLECT THE NEXT CRYSTAL · EACH PICKUP RAISES FLOW AND BOOSTS SCORE',action:'collect'},
  {x:3800,text:'SECURE GATE 2 · CROSS THE NEXT CHECKPOINT GATE · CHECKPOINTS SAVE YOUR RUN PROGRESS FOR RECOVERY',action:'checkpoint'},
  {x:6200,text:'BREAK THE CORE ONCE · WAIT FOR GREEN CORE OPEN · LAND ONE DASH OR STOMP HIT TO PROVE THE TIMING',action:'bossHit'},
  {x:6200,text:'FINISH THE SENTINEL · REPEAT THE GREEN-CORE DASH OR STOMP UNTIL ITS INTEGRITY REACHES ZERO · AUTO-RUN PAUSES HERE',action:'boss'}
];
let tipAnnounceTimer=0;
function tutorialActive(){return !onboardingDone||replayTutorial;}
function hideTip(){clearTimeout(tipAnnounceTimer);clearTimeout(showTip.t);tip.classList.remove('show');tip.textContent='';}
function guideProgressText(text){const step=Math.min(onboardingStage+1,tips.length);return 'GUIDE '+step+'/'+tips.length+' · '+text;}
function showTip(text,repeatable=false){
  hideTip();
  tipRepeatAt=repeatable?performance.now()+ACTION_TIP_REPEAT_MS:0;
  const visibleMs=repeatable?ACTION_TIP_VISIBLE_MS:PASSIVE_TIP_VISIBLE_MS;
  tipAnnounceTimer=setTimeout(()=>{tip.textContent=guideProgressText(text);tip.classList.add('show');showTip.t=setTimeout(()=>tip.classList.remove('show'),visibleMs);},20);
}
function showGuideComplete(){
  if(guideCompleteShown)return;
  guideCompleteShown=true;
  hideTip();
  tipAnnounceTimer=setTimeout(()=>{tip.textContent='GUIDE COMPLETE · FINISH THE RUN';tip.classList.add('show');showTip.t=setTimeout(()=>tip.classList.remove('show'),PASSIVE_TIP_VISIBLE_MS);},20);
}
function lessonComplete(current){
  if(current.action==='jump')return !player.onGround||player.vy<-120;
  if(current.action==='dash')return broken instanceof Set&&broken.has(0);
  if(current.action==='counter')return defeated instanceof Set&&defeated.has(0);
  if(current.action==='collect')return crystals>lessonCrystalBaseline;
  if(current.action==='checkpoint')return typeof activeCheckpoint!=='undefined'&&activeCheckpoint>=1;
  if(current.action==='bossHit')return typeof boss!=='undefined'&&boss.hp<boss.maxHp;
  if(current.action==='boss')return typeof boss!=='undefined'&&boss.dead;
  return player.x>=current.x;
}
function completeOnboardingAfterWin(){
  if(onboardingDone||replayTutorial||onboardingStage<tips.length||state!=='win')return;
  onboardingDone=true;
  saveOnboardingDone(true);
  hideTip();
  tipRepeatAt=0;
}
function skipFirstRunGuide(){
  if(onboardingDone)return;
  onboardingDone=true;
  replayTutorial=false;
  onboardingStage=0;
  shownStage=-1;
  tipRepeatAt=0;
  guideCompleteShown=false;
  lessonCrystalBaseline=0;
  hideTip();
  saveOnboardingDone(true);
  showMenu();
}
function onboardingLoop(){
  if(tutorialActive()&&state==='play'){
    const current=tips[onboardingStage];
    if(current){
      const reached=player.x>=current.x;
      const complete=reached&&lessonComplete(current);
      if(reached&&shownStage!==onboardingStage){
        if(current.action==='collect')lessonCrystalBaseline=crystals;
        showTip(current.text,Boolean(current.action));
        shownStage=onboardingStage;
      }else if(reached&&current.action&&shownStage===onboardingStage&&!complete&&tipRepeatAt>0&&performance.now()>=tipRepeatAt){
        // Action lessons remain useful after their first toast disappears. Repeat at a
        // restrained cadence until the player demonstrates the mechanic, then stop forever.
        showTip(current.text,true);
      }
      if(complete){
        // Action coaching has served its purpose the instant the requested gameplay
        // action lands. Remove stale coaching before the next lesson enters view.
        if(current.action)hideTip();
        onboardingStage++;
        shownStage=-1;
        tipRepeatAt=0;
        if(onboardingStage===tips.length)showGuideComplete();
      }
    }
  }
  completeOnboardingAfterWin();
  requestAnimationFrame(onboardingLoop);
}
const onboardingReset=resetRun;
resetRun=function(){if(tutorialActive()){onboardingStage=0;shownStage=-1;guideCompleteShown=false;lessonCrystalBaseline=0;}tipRepeatAt=0;hideTip();onboardingReset();};
const onboardingMenu=showMenu;
showMenu=function(){
  replayTutorial=false;
  onboardingMenu();
  if(!onboardingDone){
    const legend=panel.querySelector('.legend');
    if(legend){const badge=document.createElement('span');badge.textContent='GUIDED FIRST RUN · AUTO-RUN';legend.appendChild(badge);}
    const actions=panel.querySelector('.actions');
    if(actions){const skip=document.createElement('button');skip.className='btn alt';skip.textContent='SKIP GUIDE';skip.setAttribute('aria-label','Skip guided first run');actions.appendChild(skip);skip.onclick=skipFirstRunGuide;}
  }else{
    const actions=panel.querySelector('.actions');
    if(actions){const replay=document.createElement('button');replay.className='btn alt';replay.textContent='REPLAY TUTORIAL';actions.appendChild(replay);replay.onclick=()=>{replayTutorial=true;onboardingStage=0;shownStage=-1;tipRepeatAt=0;guideCompleteShown=false;lessonCrystalBaseline=0;resetRun();};}
  }
};
onboardingLoop();showMenu();