'use strict';
// Landing feedback adds a restrained squash/ring cue without changing movement or collision.
(()=>{
  let lastOnGround=player.onGround;
  const style=document.createElement('style');
  style.textContent='.landing-ring{position:fixed;z-index:3;width:44px;height:16px;border:2px solid #69edff99;border-radius:50%;pointer-events:none;opacity:0;transform:translate(-50%,-50%) scale(.35);transition:opacity .16s ease,transform .18s ease}.landing-ring.show{opacity:.8;transform:translate(-50%,-50%) scale(1)}';
  document.head.appendChild(style);
  const ring=document.createElement('div');ring.className='landing-ring';document.body.appendChild(ring);
  let timer=0;
  function pulse(){const rect=canvas.getBoundingClientRect(),x=rect.left+ox+(player.x-cam+player.w/2)*scale,y=rect.top+oy+(player.y+player.h)*scale;ring.style.left=x+'px';ring.style.top=y+'px';ring.classList.remove('show');void ring.offsetWidth;ring.classList.add('show');timer=.2;}
  const base=update;
  update=function(dt){const before=player.onGround;base(dt);if(state==='play'&&!before&&player.onGround&&player.land>0)pulse();if(timer>0){timer=Math.max(0,timer-dt);if(timer===0)ring.classList.remove('show')}lastOnGround=player.onGround;};
  const reset=resetRun;resetRun=function(){timer=0;ring.classList.remove('show');lastOnGround=true;reset();};
})();
