'use strict';
// Boss phase feedback improves readability only; combat values and timing remain untouched.
(()=>{
  const toast=document.createElement('div');toast.className='boss-phase-toast';toast.setAttribute('aria-live','polite');document.body.appendChild(toast);
  const style=document.createElement('style');
  style.textContent='.boss-phase-toast{position:fixed;z-index:7;left:50%;top:max(96px,calc(env(safe-area-inset-top) + 76px));transform:translate(-50%,-10px) scale(.96);min-width:210px;padding:8px 18px;border:1px solid #ff6d8866;border-radius:12px;background:linear-gradient(180deg,#26121ee8,#120b18e8);box-shadow:0 14px 36px #0007,0 0 26px #ff6d8822;color:#fff;text-align:center;font-size:9px;font-weight:950;letter-spacing:.16em;pointer-events:none;opacity:0;transition:opacity .16s ease,transform .2s ease}.boss-phase-toast.show{opacity:1;transform:translate(-50%,0) scale(1)}.boss-phase-toast.final{border-color:#ffd86b88;box-shadow:0 14px 36px #0007,0 0 28px #ffd86b26;color:#ffe9a7}@media(max-height:390px){.boss-phase-toast{top:max(68px,calc(env(safe-area-inset-top) + 54px));padding:6px 14px;font-size:8px}}';
  document.head.appendChild(style);
  let seen=0,timer=0,lastHp=boss.hp;
  function show(text,final){toast.textContent=text;toast.classList.toggle('final',!!final);toast.classList.remove('show');void toast.offsetWidth;toast.classList.add('show');timer=1.25;}
  const base=update;
  update=function(dt){
    base(dt);
    if(state==='play'&&boss.active&&boss.hp<lastHp){if(boss.hp<=1&&seen<2){seen=2;show('SENTINEL CORE EXPOSED',true);}else if(boss.hp<=3&&seen<1){seen=1;show('SENTINEL OVERDRIVE',false);}lastHp=boss.hp;}
    if(timer>0){timer=Math.max(0,timer-dt);if(timer===0)toast.classList.remove('show');}
  };
  const reset=resetRun;resetRun=function(){seen=0;timer=0;lastHp=boss.maxHp;toast.classList.remove('show');reset();};
})();
