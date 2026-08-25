'use strict';
// Boss projectile warning improves reaction readability without changing projectile physics or collision.
(()=>{
  const warning=document.createElement('div');
  warning.className='boss-shot-warning';
  warning.setAttribute('aria-live','polite');
  warning.innerHTML='<strong>PULSE INCOMING</strong><span>DODGE OR DASH</span>';
  document.body.appendChild(warning);
  const style=document.createElement('style');
  style.textContent='.boss-shot-warning{position:fixed;z-index:6;left:50%;top:max(104px,calc(env(safe-area-inset-top) + 84px));transform:translate(-50%,-8px) scale(.96);padding:6px 14px 7px;border:1px solid #ff6d8866;border-radius:12px;background:#160f1de8;box-shadow:0 10px 30px #0007,0 0 24px #ff6d8822;text-align:center;pointer-events:none;opacity:0;transition:opacity .12s ease,transform .15s ease}.boss-shot-warning.show{opacity:1;transform:translate(-50%,0) scale(1)}.boss-shot-warning strong{display:block;color:#ff9cad;font-size:9px;font-weight:950;letter-spacing:.17em}.boss-shot-warning span{display:block;margin-top:1px;color:#ffd86b;font-size:7px;font-weight:850;letter-spacing:.11em}@media(max-height:390px){.boss-shot-warning{top:max(74px,calc(env(safe-area-inset-top) + 58px));padding:5px 11px}.boss-shot-warning strong{font-size:8px}}';
  document.head.appendChild(style);
  let timer=0,cooldown=0;
  function imminent(){
    if(state!=='play'||!boss.active||!Array.isArray(bossShots)||!bossShots.length)return false;
    const px=player.x+player.w/2,py=player.y+player.h/2;
    for(const s of bossShots){
      const dx=px-s.x,dy=py-s.y,dist=Math.hypot(dx,dy),speed=Math.hypot(s.vx,s.vy)||1;
      if(dist>260)continue;
      const closing=(dx*s.vx+dy*s.vy)/(dist*speed||1);
      const t=dist/speed;
      if(closing>.72&&t<.62)return true;
    }
    return false;
  }
  function alertShot(){warning.classList.remove('show');void warning.offsetWidth;warning.classList.add('show');timer=.5;cooldown=.75;}
  const base=update;
  update=function(dt){base(dt);cooldown=Math.max(0,cooldown-dt);timer=Math.max(0,timer-dt);if(timer===0)warning.classList.remove('show');if(cooldown===0&&imminent())alertShot();};
  const reset=resetRun;resetRun=function(){timer=cooldown=0;warning.classList.remove('show');reset();};
})();
