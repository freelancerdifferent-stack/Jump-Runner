'use strict';
// First-run contextual onboarding. No gameplay slowdown, no network dependency.
const onboardingKey='jr_onboarding_v1';
let onboardingDone=localStorage.getItem(onboardingKey)==='1';
let onboardingStage=0;
const tip=document.createElement('div');tip.className='coach-tip';tip.setAttribute('role','status');tip.setAttribute('aria-live','polite');document.body.appendChild(tip);
const tips=[
  {x:0,text:'TAP JUMP · short taps give low hops, hold a little longer for height'},
  {x:760,text:'DASH THROUGH ENERGY BARRIERS · Dash also defeats drones from the side'},
  {x:1260,text:'STOMP DRONES FROM ABOVE · clean counters build Flow faster'},
  {x:2350,text:'COLLECT CRYSTALS TO BUILD FLOW · higher Flow multiplies score'},
  {x:4300,text:'CHECKPOINT GATES SAVE YOUR PROGRESS · recovery keeps the run alive'},
  {x:6500,text:'SKY SENTINEL AHEAD · learn its pulse timing, then counter with stomp or Dash'}
];
function showTip(text){tip.textContent=text;tip.classList.add('show');clearTimeout(showTip.t);showTip.t=setTimeout(()=>tip.classList.remove('show'),3600);}
function onboardingLoop(){
  if(!onboardingDone&&state==='play'){
    const current=tips[onboardingStage];
    if(current&&player.x>=current.x){showTip(current.text);onboardingStage++;}
    if(onboardingStage>=tips.length&&player.x>7200){onboardingDone=true;localStorage.setItem(onboardingKey,'1');setTimeout(()=>tip.classList.remove('show'),1800);}
  }
  requestAnimationFrame(onboardingLoop);
}
const onboardingReset=resetRun;
resetRun=function(){if(!onboardingDone)onboardingStage=0;onboardingReset();};
const onboardingMenu=showMenu;
showMenu=function(){
  onboardingMenu();
  if(!onboardingDone){
    const legend=panel.querySelector('.legend');
    if(legend){const badge=document.createElement('span');badge.textContent='GUIDED FIRST RUN';legend.appendChild(badge);}
  }else{
    const actions=panel.querySelector('.actions');
    if(actions){const replay=document.createElement('button');replay.className='btn alt';replay.textContent='REPLAY TUTORIAL';actions.appendChild(replay);replay.onclick=()=>{onboardingDone=false;localStorage.removeItem(onboardingKey);onboardingStage=0;resetRun();};}
  }
};
onboardingLoop();showMenu();
