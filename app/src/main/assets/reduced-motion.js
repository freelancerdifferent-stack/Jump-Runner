'use strict';
// Honor the platform reduced-motion preference and allow an explicit local override
// without changing gameplay timing or physics.
(()=>{
  const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const STORAGE_KEY='jr_motion_reduced';
  let override=null;
  let reduced=false;

  try{
    const saved=localStorage.getItem(STORAGE_KEY);
    if(saved==='1')override=true;
    else if(saved==='0')override=false;
  }catch(_){/* preference persistence is optional */}

  function resolvedPreference(){
    return override===null?Boolean(media?.matches):override;
  }

  function renderToggle(button){
    if(!button)return;
    button.textContent=reduced?'MOTION CALM':'MOTION FULL';
    button.setAttribute('aria-pressed',String(reduced));
    button.setAttribute('aria-label',reduced?'Enable full motion effects':'Reduce motion effects');
    button.classList.toggle('is-calm',reduced);
  }

  function applyPreference(){
    reduced=resolvedPreference();
    document.documentElement.toggleAttribute('data-reduced-motion',reduced);
    renderToggle(document.getElementById('motionToggle'));
    window.dispatchEvent(new CustomEvent('jumprunnermotionchange',{detail:{reduced}}));
  }

  function setOverride(next){
    override=Boolean(next);
    try{localStorage.setItem(STORAGE_KEY,override?'1':'0')}catch(_){/* optional */}
    applyPreference();
  }

  function installToggle(){
    if(document.getElementById('motionToggle'))return;
    const button=document.createElement('button');
    button.id='motionToggle';
    button.className='motion-toggle';
    button.type='button';
    renderToggle(button);
    button.addEventListener('pointerdown',e=>e.stopPropagation(),{passive:true});
    button.addEventListener('click',()=>setOverride(!reduced));
    document.body.appendChild(button);
  }

  applyPreference();
  installToggle();

  if(media){
    const onSystemChange=()=>{if(override===null)applyPreference()};
    if(typeof media.addEventListener==='function')media.addEventListener('change',onSystemChange);
    else if(typeof media.addListener==='function')media.addListener(onSystemChange);
  }

  addEventListener('keydown',e=>{
    if(e.repeat)return;
    if(e.code==='KeyR')setOverride(!reduced);
  });

  const baseUpdate=update;
  update=function(dt){
    baseUpdate(dt);
    if(!reduced)return;
    // Screen shake and long motion trails are decorative. Suppress them after every
    // gameplay update so later combat/feedback systems cannot reintroduce motion.
    shake=0;
    if(player&&Array.isArray(player.trail))player.trail.length=0;
  };

  const baseBurst=burst;
  burst=function(x,y,color,n=12,power=180){
    if(!reduced)return baseBurst(x,y,color,n,power);
    // Keep a small impact cue for readability while substantially reducing motion.
    return baseBurst(x,y,color,Math.min(n,4),Math.min(power,90));
  };
})();
