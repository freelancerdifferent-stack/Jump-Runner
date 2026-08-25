'use strict';
// Touch-first control readiness feedback. Keeps input timing unchanged while making cooldown and buffered input state legible.
const controlDashButton=document.getElementById('dashBtn');
const controlJumpButton=document.getElementById('jumpBtn');
const baseControlFeedbackHud=updateHud;
let dashReadyLatched=true,dashReadyNoteTimer=0,jumpBufferLatched=false;
function announceDashReady(){
 if(!controlDashButton||state!=='play')return;
 const note=document.createElement('span');note.className='dash-ready-note';note.textContent='READY';controlDashButton.appendChild(note);
 clearTimeout(dashReadyNoteTimer);dashReadyNoteTimer=setTimeout(()=>note.remove(),520);
}
function updateControlFeedback(){
 if(!controlDashButton||!controlJumpButton)return;
 const ready=player.dashCd<=0.001&&state==='play';
 const active=player.dash>0;
 const buffered=state==='play'&&player.jumpBuffer>0&&player.coyote<=0;
 controlDashButton.classList.toggle('is-ready',ready);
 controlDashButton.classList.toggle('is-active',active);
 controlDashButton.classList.toggle('is-cooling',state==='play'&&!ready&&!active);
 controlDashButton.style.setProperty('--dash-charge',String(Math.max(0,Math.min(1,1-player.dashCd/.72))));
 controlDashButton.setAttribute('aria-label',ready?'Dash ready':'Dash recharging');
 controlJumpButton.classList.toggle('is-airborne',state==='play'&&!player.onGround);
 controlJumpButton.classList.toggle('is-buffered',buffered);
 controlJumpButton.setAttribute('aria-label',buffered?'Jump buffered':'Jump');
 if(buffered&&!jumpBufferLatched){controlJumpButton.classList.remove('buffer-pop');void controlJumpButton.offsetWidth;controlJumpButton.classList.add('buffer-pop');}
 if(ready&&!dashReadyLatched){controlDashButton.classList.remove('ready-pop');void controlDashButton.offsetWidth;controlDashButton.classList.add('ready-pop');announceDashReady();}
 jumpBufferLatched=buffered;dashReadyLatched=ready;
}
updateHud=function(){baseControlFeedbackHud();updateControlFeedback();};
const baseControlFeedbackReset=resetRun;
resetRun=function(){dashReadyLatched=true;jumpBufferLatched=false;clearTimeout(dashReadyNoteTimer);controlDashButton?.querySelectorAll('.dash-ready-note').forEach(n=>n.remove());controlJumpButton?.classList.remove('is-buffered','buffer-pop');baseControlFeedbackReset();updateControlFeedback();};
updateControlFeedback();
