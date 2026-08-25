'use strict';
// Touch-first control readiness feedback. Keeps input timing unchanged while making cooldown state legible.
const controlDashButton=document.getElementById('dashBtn');
const controlJumpButton=document.getElementById('jumpBtn');
const baseControlFeedbackHud=updateHud;
let dashReadyLatched=true;
function updateControlFeedback(){
 if(!controlDashButton||!controlJumpButton)return;
 const ready=player.dashCd<=0.001&&state==='play';
 const active=player.dash>0;
 controlDashButton.classList.toggle('is-ready',ready);
 controlDashButton.classList.toggle('is-active',active);
 controlDashButton.classList.toggle('is-cooling',state==='play'&&!ready&&!active);
 controlDashButton.style.setProperty('--dash-charge',String(Math.max(0,Math.min(1,1-player.dashCd/.72))));
 controlDashButton.setAttribute('aria-label',ready?'Dash ready':'Dash recharging');
 controlJumpButton.classList.toggle('is-airborne',state==='play'&&!player.onGround);
 if(ready&&!dashReadyLatched){controlDashButton.classList.remove('ready-pop');void controlDashButton.offsetWidth;controlDashButton.classList.add('ready-pop');}
 dashReadyLatched=ready;
}
updateHud=function(){baseControlFeedbackHud();updateControlFeedback();};
const baseControlFeedbackReset=resetRun;
resetRun=function(){dashReadyLatched=true;baseControlFeedbackReset();updateControlFeedback();};
updateControlFeedback();
