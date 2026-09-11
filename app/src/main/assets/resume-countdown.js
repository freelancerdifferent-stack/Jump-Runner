'use strict';
// Mobile fairness layer: give players a short reaction window after returning from Android background.
(()=>{
  let intervalId=0;
  let releaseId=0;
  let cue=null;
  let resumeInputLocked=false;
  const jumpControl=document.getElementById('jumpBtn');
  const dashControl=document.getElementById('dashBtn');
  const baseInputJump=inputJump;
  const baseInputDash=inputDash;

  // Keep touch/keyboard input from being buffered while gameplay is intentionally frozen.
  inputJump=function(down){
    if(resumeInputLocked)return;
    baseInputJump(down);
  };
  inputDash=function(){
    if(resumeInputLocked)return;
    baseInputDash();
  };

  function setControlsLocked(locked){
    resumeInputLocked=locked;
    for(const control of [jumpControl,dashControl]){
      if(!control)continue;
      control.classList.toggle('countdown-locked',locked);
      control.setAttribute('aria-disabled',locked?'true':'false');
    }
  }

  function ensureCue(){
    if(cue)return cue;
    cue=document.createElement('div');
    cue.id='resumeCountdown';
    cue.setAttribute('role','status');
    cue.setAttribute('aria-live','assertive');
    cue.setAttribute('aria-atomic','true');
    cue.style.cssText='position:fixed;left:50%;top:42%;transform:translate(-50%,-50%);z-index:45;min-width:104px;padding:14px 22px;border:1px solid #69edff88;border-radius:18px;background:#07101ee8;color:#fff;text-align:center;font:900 28px/1 system-ui,sans-serif;letter-spacing:.08em;box-shadow:0 0 28px #69edff33;pointer-events:none;opacity:0;transition:opacity .12s ease;';
    document.body.appendChild(cue);
    return cue;
  }

  function clearCountdown(){
    if(intervalId){clearInterval(intervalId);intervalId=0;}
    if(releaseId){clearTimeout(releaseId);releaseId=0;}
    if(cue){cue.style.opacity='0';cue.textContent='';}
    setControlsLocked(false);
  }

  function showStep(text){
    const el=ensureCue();
    el.textContent=text;
    el.style.opacity='1';
  }

  function startResumeCountdown(){
    if(typeof state==='undefined'||state!=='play')return;
    clearCountdown();
    paused=true;
    setControlsLocked(true);
    if(typeof pauseEl!=='undefined'&&pauseEl)pauseEl.classList.remove('show');
    let step=3;
    showStep(String(step));
    intervalId=setInterval(()=>{
      step--;
      if(step>0){showStep(String(step));return;}
      if(step===0){showStep('GO');clearInterval(intervalId);intervalId=0;}
    },420);
    releaseId=setTimeout(()=>{
      releaseId=0;
      if(typeof state!=='undefined'&&state==='play'){
        paused=false;
        setControlsLocked(false);
        if(typeof last!=='undefined')last=performance.now();
        window.dispatchEvent(new Event('jumprunnerresumeready'));
      }
      if(cue)cue.style.opacity='0';
    },1500);
  }

  addEventListener('jumprunnerresume',startResumeCountdown);
  addEventListener('jumprunnerpause',()=>{
    clearCountdown();
    if(typeof paused!=='undefined')paused=true;
  });
  addEventListener('jumprunnerresult',clearCountdown);
})();
