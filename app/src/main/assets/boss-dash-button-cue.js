'use strict';
// Connects the Sentinel's brief attack window to the two touch actions that can damage its core.
(()=>{
  const dashButton=document.getElementById('dashBtn');
  const jumpButton=document.getElementById('jumpBtn');
  if(!dashButton||!jumpButton)return;
  let previousOpen=false,previousReady=false,previousStompSetup=false;
  const style=document.createElement('style');
  style.textContent=`
    #dashBtn.sentinel-core-open{box-shadow:0 0 0 2px #ffd86b88,0 0 20px #ffd86b55}
    #dashBtn.sentinel-core-open::after{content:'CORE OPEN';position:absolute;left:50%;top:-24px;transform:translateX(-50%);padding:3px 8px;border-radius:999px;background:#07101ee8;border:1px solid #ffd86b;color:#fff1b9;font:900 9px system-ui;letter-spacing:1px;white-space:nowrap;pointer-events:none}
    #dashBtn.sentinel-strike-window{box-shadow:0 0 0 2px #74f7c5aa,0 0 24px #74f7c599,0 0 48px #74f7c544;transform:scale(1.06)}
    #dashBtn.sentinel-strike-window::after{content:'HIT NOW';border-color:#74f7c5;color:#dffff3}
    #dashBtn.sentinel-core-open:not(.sentinel-strike-window).is-cooling::after{content:'CORE OPEN · RECHARGING'}
    #dashBtn.sentinel-strike-pop{animation:sentinelDashStrikePop .34s ease-out}
    #jumpBtn.sentinel-stomp-setup{box-shadow:0 0 0 2px #69edffaa,0 0 24px #69edff77,0 0 44px #69edff33;transform:scale(1.05)}
    #jumpBtn.sentinel-stomp-setup::after{content:'JUMP → STOMP';position:absolute;left:50%;top:-24px;transform:translateX(-50%);padding:3px 8px;border-radius:999px;background:#07101ee8;border:1px solid #69edff;color:#dffaff;font:900 9px system-ui;letter-spacing:1px;white-space:nowrap;pointer-events:none}
    #jumpBtn.sentinel-stomp-pop{animation:sentinelStompSetupPop .34s ease-out}
    @keyframes sentinelDashStrikePop{0%{transform:scale(1)}45%{transform:scale(1.12)}100%{transform:scale(1.06)}}
    @keyframes sentinelStompSetupPop{0%{transform:scale(1)}45%{transform:scale(1.11)}100%{transform:scale(1.05)}}
    @media (prefers-reduced-motion:reduce){
      #dashBtn.sentinel-strike-window,#jumpBtn.sentinel-stomp-setup{transform:none}
      #dashBtn.sentinel-strike-pop,#jumpBtn.sentinel-stomp-pop{animation:none}
    }
  `;
  document.head.appendChild(style);
  const baseUpdate=window.update;
  if(typeof baseUpdate!=='function')return;
  window.update=function(dt){
    baseUpdate(dt);
    const coreOpen=state==='play'&&typeof boss!=='undefined'&&boss.active&&!boss.dead&&boss.coreOpen;
    const dashReady=coreOpen&&player.dashCd<=0.001;
    const stompSetup=coreOpen&&!dashReady&&player.onGround;
    dashButton.classList.toggle('sentinel-core-open',coreOpen);
    dashButton.classList.toggle('sentinel-strike-window',dashReady);
    jumpButton.classList.toggle('sentinel-stomp-setup',stompSetup);
    if(coreOpen){
      dashButton.setAttribute('aria-label',dashReady?'Dash now, Sentinel core open':'Dash recharging, Sentinel core open');
    }else if(previousOpen){
      dashButton.setAttribute('aria-label',player.dashCd<=0.001?'Dash ready':'Dash recharging');
    }
    if(stompSetup){
      jumpButton.setAttribute('aria-label','Jump to set up a stomp, Sentinel core open');
    }else if(previousStompSetup){
      jumpButton.setAttribute('aria-label','Jump');
    }
    if(dashReady&&!previousReady){
      dashButton.classList.remove('sentinel-strike-pop');
      void dashButton.offsetWidth;
      dashButton.classList.add('sentinel-strike-pop');
    }
    if(stompSetup&&!previousStompSetup){
      jumpButton.classList.remove('sentinel-stomp-pop');
      void jumpButton.offsetWidth;
      jumpButton.classList.add('sentinel-stomp-pop');
    }
    if(!dashReady)dashButton.classList.remove('sentinel-strike-pop');
    if(!stompSetup)jumpButton.classList.remove('sentinel-stomp-pop');
    previousOpen=coreOpen;
    previousReady=dashReady;
    previousStompSetup=stompSetup;
  };
  const clearCue=()=>{
    previousOpen=false;
    previousReady=false;
    previousStompSetup=false;
    dashButton.classList.remove('sentinel-strike-window','sentinel-strike-pop','sentinel-core-open');
    jumpButton.classList.remove('sentinel-stomp-setup','sentinel-stomp-pop');
    if(state!=='play'||typeof boss==='undefined'||!boss.coreOpen)dashButton.setAttribute('aria-label','Dash');
    jumpButton.setAttribute('aria-label','Jump');
  };
  const baseReset=window.resetRun;
  if(typeof baseReset==='function')window.resetRun=function(){clearCue();baseReset();};
  window.addEventListener('jumprunnerpause',clearCue);
})();
