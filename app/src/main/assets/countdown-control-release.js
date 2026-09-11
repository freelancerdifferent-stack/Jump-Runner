'use strict';
// Presentation polish: make the exact moment controls become live unmistakable after start/resume countdowns.
(()=>{
  const controls=[document.getElementById('jumpBtn'),document.getElementById('dashBtn')].filter(Boolean);
  let releaseTimer=0;

  function clearReleasePulse(){
    if(releaseTimer){clearTimeout(releaseTimer);releaseTimer=0;}
    for(const control of controls)control.classList.remove('countdown-ready-pulse');
  }

  function pulseReleasedControls(){
    if(typeof state==='undefined'||state!=='play')return;
    clearReleasePulse();
    for(const control of controls){
      control.classList.remove('countdown-ready-pulse');
      void control.offsetWidth;
      control.classList.add('countdown-ready-pulse');
    }
    releaseTimer=setTimeout(()=>{
      releaseTimer=0;
      for(const control of controls)control.classList.remove('countdown-ready-pulse');
    },520);
  }

  addEventListener('jumprunnercountdowncomplete',pulseReleasedControls);
  addEventListener('jumprunnerresumeready',pulseReleasedControls);
  addEventListener('jumprunnerpause',clearReleasePulse);
  addEventListener('jumprunnerresult',clearReleasePulse);
})();
