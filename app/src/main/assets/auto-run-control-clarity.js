'use strict';
(()=>{
  const cue=document.createElement('div');
  cue.className='auto-run-control-cue';
  cue.textContent='AUTO-RUN · JUMP + DASH';
  cue.setAttribute('role','status');
  cue.setAttribute('aria-live','polite');
  cue.setAttribute('aria-atomic','true');
  cue.setAttribute('aria-hidden','true');
  document.body.appendChild(cue);
  const style=document.createElement('style');
  style.textContent='.auto-run-control-cue{position:fixed;z-index:6;left:50%;bottom:max(13%,calc(env(safe-area-inset-bottom,0px) + 92px));transform:translate(-50%,8px);padding:7px 13px;border:1px solid #69e8ff55;border-radius:999px;background:#07101ecc;backdrop-filter:blur(5px);font-size:clamp(10px,1.25vw,13px);line-height:1;font-weight:900;letter-spacing:.16em;text-align:center;white-space:nowrap;color:#dffaff;text-shadow:0 2px 12px #000;box-shadow:0 8px 22px #0005,0 0 18px #69e8ff1f;opacity:0;pointer-events:none}.auto-run-control-cue.show{animation:autoRunCue .9s ease-out forwards}@keyframes autoRunCue{0%{opacity:0;transform:translate(-50%,8px)}18%{opacity:1;transform:translate(-50%,0)}76%{opacity:.96}100%{opacity:0;transform:translate(-50%,-6px)}}@media(max-width:520px){.auto-run-control-cue{bottom:max(15%,calc(env(safe-area-inset-bottom,0px) + 88px));padding:7px 10px;letter-spacing:.1em}}@media(prefers-reduced-motion:reduce){.auto-run-control-cue.show{animation:autoRunCueReduced .9s ease-out forwards}@keyframes autoRunCueReduced{0%{opacity:0}18%{opacity:1}76%{opacity:.96}100%{opacity:0}}}[class~="high-contrast"] .auto-run-control-cue{border-color:#fff;color:#fff;background:#000}',
  let shown=false,timer=0;
  function show(){if(shown)return;shown=true;clearTimeout(timer);cue.classList.remove('show');void cue.offsetWidth;cue.setAttribute('aria-hidden','false');cue.classList.add('show');timer=setTimeout(()=>{cue.classList.remove('show');cue.setAttribute('aria-hidden','true')},980)}
  function reset(){shown=false;clearTimeout(timer);cue.classList.remove('show');cue.setAttribute('aria-hidden','true')}
  addEventListener('jumprunnerpause',()=>{if(cue.classList.contains('show'))cue.classList.remove('show')});
  addEventListener('jumprunnerresume',()=>{if(state==='play'&&!shown)show()});
  addEventListener('jumprunnerresult',reset);
  const start=document.getElementById('start');
  if(start)start.addEventListener('click',()=>setTimeout(show,180));
})();
