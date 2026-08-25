'use strict';
// Near-miss feedback rewards close calls without changing collision, scoring, or physics.
(()=>{
  const toast=document.createElement('div');
  toast.className='near-miss-toast';toast.setAttribute('aria-live','polite');toast.textContent='CLOSE CALL';document.body.appendChild(toast);
  const style=document.createElement('style');
  style.textContent='.near-miss-toast{position:fixed;z-index:6;left:50%;top:max(116px,calc(env(safe-area-inset-top) + 96px));transform:translate(-50%,-8px) scale(.96);padding:6px 14px;border:1px solid #ffd86b55;border-radius:999px;background:#111d2be6;box-shadow:0 10px 28px #0006,0 0 22px #ffd86b1f;color:#ffe9a7;font-size:9px;font-weight:950;letter-spacing:.18em;pointer-events:none;opacity:0;transition:opacity .14s ease,transform .18s ease}.near-miss-toast.show{opacity:1;transform:translate(-50%,0) scale(1)}@media(max-height:390px){.near-miss-toast{top:max(82px,calc(env(safe-area-inset-top) + 66px));font-size:8px;padding:5px 12px}}';
  document.head.appendChild(style);
  let cooldown=0,timer=0,wasThreatened=false;
  function threatened(){
    if(state!=='play'||player.inv>0)return false;
    const px=player.x+player.w/2,feet=player.y+player.h;
    for(const s of spikes){const dx=s.x+s.w/2-px;if(dx>-18&&dx<92&&feet>s.y-72)return true;}
    for(let i=0;i<drones.length;i++){if(defeated.has(i))continue;const d=droneRect(drones[i]),dx=d.x+d.w/2-px,dy=d.y+d.h/2-(player.y+player.h/2);if(dx>-12&&dx<84&&Math.abs(dy)<62)return true;}
    return false;
  }
  function celebrate(){toast.classList.remove('show');void toast.offsetWidth;toast.classList.add('show');timer=.72;cooldown=2.2;}
  const base=update;
  update=function(dt){
    const before=threatened();base(dt);cooldown=Math.max(0,cooldown-dt);timer=Math.max(0,timer-dt);if(timer===0)toast.classList.remove('show');
    const after=threatened();if(wasThreatened&&!after&&state==='play'&&cooldown===0)celebrate();wasThreatened=before||after;
  };
  const reset=resetRun;resetRun=function(){cooldown=timer=0;wasThreatened=false;toast.classList.remove('show');reset();};
})();
