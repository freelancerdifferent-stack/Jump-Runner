'use strict';
// Boss projectile warning improves reaction readability without changing projectile physics or collision.
(()=>{
  const warning=document.createElement('div');
  warning.className='boss-shot-warning';
  warning.setAttribute('aria-live','polite');
  warning.innerHTML='<strong>PULSE INCOMING</strong><span>DODGE OR DASH</span><i aria-hidden="true"><b></b></i>';
  const action=warning.querySelector('span'),meter=warning.querySelector('i b');
  document.body.appendChild(warning);
  const style=document.createElement('style');
  style.textContent='.boss-shot-warning{position:fixed;z-index:6;left:50%;top:max(104px,calc(env(safe-area-inset-top) + 84px));transform:translate(-50%,-8px) scale(.96);padding:6px 14px 7px;border:1px solid #ff6d8866;border-radius:12px;background:#160f1de8;box-shadow:0 10px 30px #0007,0 0 24px #ff6d8822;text-align:center;pointer-events:none;opacity:0;transition:opacity .12s ease,transform .15s ease}.boss-shot-warning.show{opacity:1;transform:translate(-50%,0) scale(1)}.boss-shot-warning strong{display:block;color:#ff9cad;font-size:9px;font-weight:950;letter-spacing:.17em}.boss-shot-warning span{display:block;margin-top:1px;color:#ffd86b;font-size:7px;font-weight:850;letter-spacing:.11em}.boss-shot-warning.dash-cooling span{color:#d9e5f2}.boss-shot-warning i{display:block;width:100%;height:2px;margin-top:5px;border-radius:999px;overflow:hidden;background:#ffffff18}.boss-shot-warning i b{display:block;height:100%;width:0%;border-radius:inherit;background:#ff6d88;box-shadow:0 0 8px #ff6d88;transition:width .05s linear}@media(max-height:390px){.boss-shot-warning{top:max(74px,calc(env(safe-area-inset-top) + 58px));padding:5px 11px}.boss-shot-warning strong{font-size:8px}}';
  document.head.appendChild(style);
  let timer=0,cooldown=0,threat=0;
  function imminent(){
    if(state!=='play'||!boss.active||!Array.isArray(bossShots)||!bossShots.length)return 0;
    const px=player.x+player.w/2,py=player.y+player.h/2;
    let urgency=0;
    for(const s of bossShots){
      const dx=px-s.x,dy=py-s.y,dist=Math.hypot(dx,dy),speed=Math.hypot(s.vx,s.vy)||1;
      if(dist>260)continue;
      const closing=(dx*s.vx+dy*s.vy)/(dist*speed||1);
      const t=dist/speed;
      if(closing>.72&&t<.62)urgency=Math.max(urgency,1-Math.min(1,t/.62));
    }
    return urgency;
  }
  function syncAction(){
    const dashReady=player.dashCd<=.001;
    action.textContent=dashReady?'JUMP OR DASH':'JUMP · DASH RECHARGING';
    warning.classList.toggle('dash-cooling',!dashReady);
    meter.style.width=Math.round(Math.max(0,Math.min(1,threat))*100)+'%';
  }
  function alertShot(){syncAction();warning.classList.remove('show');void warning.offsetWidth;warning.classList.add('show');timer=.5;cooldown=.75;}
  const base=update;
  update=function(dt){base(dt);cooldown=Math.max(0,cooldown-dt);timer=Math.max(0,timer-dt);threat=imminent();if(timer===0)warning.classList.remove('show');else syncAction();if(cooldown===0&&threat>0)alertShot();};
  const reset=resetRun;resetRun=function(){timer=cooldown=threat=0;warning.classList.remove('show','dash-cooling');action.textContent='DODGE OR DASH';meter.style.width='0%';reset();};
})();
