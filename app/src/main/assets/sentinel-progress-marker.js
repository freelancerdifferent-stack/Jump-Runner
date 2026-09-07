'use strict';
(()=>{
  const bar=document.querySelector('.progress');
  if(!bar||typeof LEVEL_END==='undefined'||typeof boss==='undefined')return;
  const engageX=6350;
  const marker=document.createElement('span');
  marker.className='sentinel-progress-marker';
  marker.setAttribute('aria-hidden','true');
  marker.style.cssText=`position:absolute;z-index:3;top:-4px;left:${Math.min(100,engageX/LEVEL_END*100)}%;width:8px;height:8px;border-radius:50%;transform:translateX(-4px);background:#ff6d88;box-shadow:0 0 7px #ff6d88;opacity:.72;transition:opacity .18s ease,transform .18s ease,background .18s ease,box-shadow .18s ease`;
  bar.appendChild(marker);

  const baseUpdateHud=updateHud;
  updateHud=function(){
    baseUpdateHud();
    const engaged=boss.active&&!boss.dead;
    const cleared=boss.dead;
    marker.style.opacity=cleared?'1':(engaged?'1':'.72');
    marker.style.transform=engaged?'translateX(-4px) scale(1.35)':'translateX(-4px) scale(1)';
    marker.style.background=cleared?'#74f7c5':(engaged?'#ffd86b':'#ff6d88');
    marker.style.boxShadow=cleared?'0 0 9px #74f7c5':(engaged?'0 0 10px #ffd86b':'0 0 7px #ff6d88');
    const percent=Math.max(0,Math.min(100,player.x/LEVEL_END*100));
    if(!boss.dead&&player.x<engageX){
      bar.setAttribute('aria-label',`Run progress ${Math.round(percent)} percent. Next Sky Sentinel.`);
    }else if(boss.active&&!boss.dead){
      bar.setAttribute('aria-label',`Run progress ${Math.round(percent)} percent. Sky Sentinel engaged.`);
    }else if(boss.dead){
      bar.setAttribute('aria-label',`Run progress ${Math.round(percent)} percent. Sentinel defeated. Next finish.`);
    }
  };
  updateHud();
})();
