'use strict';
// First-run contextual onboarding. No gameplay slowdown, no network dependency.
// The first two lessons advance only after the player actually performs Jump and Dash,
// preventing distance-based tips from racing ahead of a new touch player.
// Tutorial completion is persisted only after a successful first guided run. Replaying
// the tutorial is a temporary practice mode and never erases the player's completion.
const onboardingKey='jr_onboarding_v1';
function readOnboardingDone(){try{return localStorage.getItem(onboardingKey)==='1';}catch(error){return false;}}
function saveOnboardingDone(done){try{if(done)localStorage.setItem(onboardingKey,'1');else localStorage.removeItem(onboardingKey);}catch(error){/* Storage may be unavailable in private/restricted WebViews. */}}
let onboardingDone=readOnboardingDone();
let replayTutorial=false;
let onboardingStage=0,shownStage=-1;
const tip=document.createElement('div');tip.className='coach-tip';tip.setAttribute('role','status');tip.setAttribute('aria-live','polite');tip.setAttribute('aria-atomic','true');document.body.appendChild(tip);
const tips=[
  {x:0,text:'TAP JUMP · short taps give low hops, hold a little longer for height',action:'jump'},
  {x:650,text:'TRY DASH · tap DASH for a burst, then use it to break energy barriers',action:'dash'},
  {x:1260,text:'STOMP DRONES FROM ABOVE · clean counters build Flow faster'},
  {x:2350,text:'COLLECT CRYSTALS TO BUILD FLOW · higher Flow multiplies score'},
  {x:4300,text:'CHECKPOINT GATES SAVE YOUR PROGRESS · recovery keeps the run alive'},
  {x:6200,text:'FINAL ARENA · WAIT FOR GREEN CORE OPEN, THEN DASH OR STOMP THE SKY SENTINEL'}
];
let tipAnnounceTimer=0;
function tutorialActive(){return !onboardingDone||replayTutorial;}
function showTip(text){
  clearTimeout(tipAnnounceTimer);clearTimeout(showTip.t);tip.classList.remove('show');tip.textContent='';
  tipAnnounceTimer=setTimeout(()=>{tip.textContent=text;tip.classList.add('show');showTip.t=setTimeout(()=>tip.classList.remove('show'),4200);},20);
}
function lessonComplete(current){
  if(current.action==='jump')return !player.onGround||player.vy<-120;
  if(current.action==='dash')return player.dash>0;
  return player.x>=current.x;
}
function completeOnboardingAfterWin(){
  if(onboardingDone||replayTutorial||onboardingStage<tips.length||state!=='win')return;
  onboardingDone=true;
  saveOnboardingDone(true);
  clearTimeout(tipAnnounceTimer);clearTimeout(showTip.t);
  tip.classList.remove('show');
}
function onboardingLoop(){
  if(tutorialActive()&&state==='play'){
    const current=tips[onboardingStage];
    if(current){
      if(player.x>=current.x&&shownStage!==onboardingStage){showTip(current.text);shownStage=onboardingStage;}
      if(player.x>=current.x&&lessonComplete(current)){
        onboardingStage++;
        shownStage=-1;
      }
    }
  }
  completeOnboardingAfterWin();
  requestAnimationFrame(onboardingLoop);
}
const onboardingReset=resetRun;
resetRun=function(){if(tutorialActive()){onboardingStage=0;shownStage=-1;}clearTimeout(tipAnnounceTimer);clearTimeout(showTip.t);tip.textContent='';tip.classList.remove('show');onboardingReset();};
const onboardingMenu=showMenu;
showMenu=function(){
  replayTutorial=false;
  onboardingMenu();
  if(!onboardingDone){
    const legend=panel.querySelector('.legend');
    if(legend){const badge=document.createElement('span');badge.textContent='GUIDED FIRST RUN';legend.appendChild(badge);}
  }else{
    const actions=panel.querySelector('.actions');
    if(actions){const replay=document.createElement('button');replay.className='btn alt';replay.textContent='REPLAY TUTORIAL';actions.appendChild(replay);replay.onclick=()=>{replayTutorial=true;onboardingStage=0;shownStage=-1;resetRun();};}
  }
};
onboardingLoop();showMenu();