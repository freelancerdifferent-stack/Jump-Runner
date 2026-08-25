'use strict';
// Celebrates successful edge-grace jumps without changing coyote timing or physics.
(()=>{
  const jump=document.getElementById('jumpBtn');
  if(!jump)return;
  const style=document.createElement('style');
  style.textContent='.control.edge-grace:not(.dash){border-color:#9ff7ff99;box-shadow:0 12px 30px #0007,0 0 18px #69edff30,inset 0 0 26px #65e6ff12}.late-jump-note{position:absolute;left:50%;top:-19px;transform:translateX(-50%);font-size:7px;font-weight:950;letter-spacing:.16em;color:#b8fbff;text-shadow:0 2px 10px #000;white-space:nowrap;pointer-events:none;animation:lateJumpNote .52s ease-out forwards}@keyframes lateJumpNote{0%{opacity:0;transform:translate(-50%,5px)}22%{opacity:1}100%{opacity:0;transform:translate(-50%,-6px)}}';
  document.head.appendChild(style);
  let grace=false;
  function celebrate(){
    const note=document.createElement('span');note.className='late-jump-note';note.textContent='EDGE SAVE';jump.appendChild(note);setTimeout(()=>note.remove(),560);
  }
  function refresh(){
    const next=state==='play'&&!player.onGround&&player.coyote>0;
    jump.classList.toggle('edge-grace',next);
    if(grace&&!next&&state==='play'&&player.vy<0)celebrate();
    grace=next;
  }
  const baseHud=updateHud;
  updateHud=function(){baseHud();refresh();};
  const baseReset=resetRun;
  resetRun=function(){grace=false;jump.classList.remove('edge-grace');jump.querySelectorAll('.late-jump-note').forEach(n=>n.remove());baseReset();refresh();};
  refresh();
})();
