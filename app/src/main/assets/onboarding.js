'use strict';
// First-run contextual onboarding. No gameplay slowdown, no network dependency.
// The first two lessons advance only after the player actually performs Jump and Dash,
// preventing distance-based tips from racing ahead of a new touch player.
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
let onboardingStage=0,shownStage=-1,tipRepeatAt=0,guideCompleteShown=false;
const tip=document.createElement('div');tip.className='coach-tip';tip.setAttribute('role','status');tip.setAttribute('aria-live','polite');tip.setAttribute('aria-atomic','true');document.body.appendChild(tip);
const tips=[
  {x:0,text:'AUTO-RUN ACTIVE · RUNNER MOVES FORWARD ON ITS OWN · TAP JUMP FOR A LOW HOP, HOLD A LITTLE LONGER FOR HEIGHT',action:'jump'},
  {x:650,text:'TRY DASH · tap DASH for a burst, then use it to break energy barriers',action:'dash'},
  {x:1260,text:'STOMP DRONES FROM ABOVE · clean counters build Flow faster'},
  {x:2350,text:'COLLECT CRYSTALS TO BUILD FLOW · higher Flow multiplies score'},
  {x:4300,text:'CHECKPOINT GATES SAVE YOUR PROGRESS · recovery keeps the run alive'},
  {x:6200,text:'FINAL ARENA · WAIT FOR GREEN CORE OPEN, THEN DASH OR STOMP THE SKY SENTINEL · AUTO-RUN PAUSES HERE',action:'boss'}
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
  if(current.action==='dash')return player.dash>0;
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
        showTip(current.text,Boolean(current.action));
        shownStage=onboardingStage;
      }else if(reached&&current.action&&shownStage===onboardingStage&&!complete&&tipRepeatAt>0&&performance.now()>=tipRepeatAt){
        // Action lessons remain useful after their first toast disappears. Repeat at a
        // restrained cadence until the player demonstrates the input, then stop forever.
        showTip(current.text,true);
      }
      if(complete){
        // Action coaching has served its purpose the instant the requested input lands.
        // Remove the stale toast instead of obscuring the next few seconds of play.
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
resetRun=function(){if(tutorialActive()){onboardingStage=0;shownStage=-1;guideCompleteShown=false;}tipRepeatAt=0;hideTip();onboardingReset();};
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
    if(actions){const replay=document.createElement('button');replay.className='btn alt';replay.textContent='REPLAY TUTORIAL';actions.appendChild(replay);replay.onclick=()=>{replayTutorial=true;onboardingStage=0;shownStage=-1;tipRepeatAt=0;guideCompleteShown=false;resetRun();};}
  }
};
onboardingLoop();showMenu();