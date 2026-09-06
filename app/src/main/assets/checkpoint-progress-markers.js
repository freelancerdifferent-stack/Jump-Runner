'use strict';
(()=>{
  const bar=document.querySelector('.progress');
  if(!bar||typeof checkpointDefs==='undefined'||typeof LEVEL_END==='undefined')return;
  bar.setAttribute('role','progressbar');
  bar.setAttribute('aria-valuemin','0');
  bar.setAttribute('aria-valuemax','100');
  const markers=checkpointDefs.map((checkpoint,index)=>{
    const marker=document.createElement('span');
    marker.className='checkpoint-progress-marker';
    marker.dataset.index=String(index);
    marker.style.cssText=`position:absolute;z-index:2;top:0;bottom:0;left:${Math.min(100,checkpoint.x/LEVEL_END*100)}%;width:2px;transform:translateX(-1px);background:#fff;opacity:.32;box-shadow:0 0 5px #69edff;transition:opacity .18s ease,box-shadow .18s ease`;
    marker.setAttribute('aria-hidden','true');
    bar.appendChild(marker);
    return marker;
  });
  const baseUpdateHud=updateHud;
  updateHud=function(){
    baseUpdateHud();
    const percent=Math.max(0,Math.min(100,player.x/LEVEL_END*100));
    bar.setAttribute('aria-valuenow',String(Math.round(percent)));
    const reached=typeof activeCheckpoint==='number'?activeCheckpoint:-1;
    for(let i=0;i<markers.length;i++){
      const active=i<=reached;
      markers[i].style.opacity=active?'1':'.32';
      markers[i].style.boxShadow=active?'0 0 7px #74f7c5':'0 0 5px #69edff';
    }
    const next=reached+1<checkpointDefs.length?checkpointDefs[reached+1].label:'FINISH';
    bar.setAttribute('aria-label',`Run progress ${Math.round(percent)} percent. Next ${next}.`);
  };
  updateHud();
})();
