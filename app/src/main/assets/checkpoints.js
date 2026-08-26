'use strict';
// Checkpoint layer: keeps the core runner deterministic while making long runs fairer.
const checkpointDefs=[
  {x:2050,label:'GATE 1'},{x:4100,label:'GATE 2'},{x:6350,label:'GATE 3'}
];
let activeCheckpoint=-1,checkpointSnapshot=null;
const baseResetRun=resetRun,baseUpdate=update,baseShowResult=showResult;

function checkpointCopySet(s){return new Set(Array.from(s));}
function activateCheckpoint(index){
  if(index<=activeCheckpoint)return;
  activeCheckpoint=index;
  // Award the gate before capturing the snapshot so recovery never erases a reward
  // the player already earned. Capture run time too so repeated checkpoint attempts
  // restart from the exact same competitive state instead of accumulating death time.
  score+=500;flow=Math.min(8,flow+1);flowTimer=3;
  checkpointSnapshot={
    x:checkpointDefs[index].x+70,
    time,
    score:Math.floor(score),crystals,flow,
    collected:checkpointCopySet(collected),
    broken:checkpointCopySet(broken),
    defeated:checkpointCopySet(defeated)
  };
  shake=Math.max(shake,6);burst(checkpointDefs[index].x,GROUND-70,'#74f7c5',22,180);
}
function restoreCheckpoint(){
  if(!checkpointSnapshot){baseResetRun();return;}
  state='play';paused=false;deathReason='';particles=[];
  time=checkpointSnapshot.time;
  score=checkpointSnapshot.score;crystals=checkpointSnapshot.crystals;flow=checkpointSnapshot.flow;flowTimer=2;
  collected=new Set(checkpointSnapshot.collected);broken=new Set(checkpointSnapshot.broken);defeated=new Set(checkpointSnapshot.defeated);
  Object.assign(player,{x:checkpointSnapshot.x,y:GROUND-52,vy:0,onGround:true,coyote:.12,jumpBuffer:0,jumpHeld:false,dash:0,dashCd:0,inv:1.1,land:0,trail:[]});
  cam=Math.max(0,player.x-210);overlay.classList.add('hidden');pauseEl.classList.remove('show');
  burst(player.x+player.w/2,player.y+player.h/2,'#74f7c5',26,210);updateHud();last=performance.now();
}
resetRun=function(){activeCheckpoint=-1;checkpointSnapshot=null;baseResetRun();};
update=function(dt){
  baseUpdate(dt);
  if(state==='play')for(let i=activeCheckpoint+1;i<checkpointDefs.length;i++)if(player.x>=checkpointDefs[i].x){activateCheckpoint(i);break;}
};
showResult=function(win){
  baseShowResult(win);
  if(!win&&checkpointSnapshot){
    const actions=panel.querySelector('.actions');
    if(actions){
      const recover=document.createElement('button');recover.className='btn';recover.id='recover';recover.textContent=`RECOVER · ${checkpointDefs[activeCheckpoint].label}`;
      recover.onclick=restoreCheckpoint;actions.prepend(recover);
      const hint=document.createElement('div');hint.className='legend';hint.innerHTML='<span>Checkpoint recovery preserves progress up to the last gate.</span>';actions.after(hint);
    }
  }
};

// Draw gates after the base scene without touching collision geometry.
const baseDrawWorld=typeof drawWorld==='function'?drawWorld:null;
if(baseDrawWorld){drawWorld=function(){baseDrawWorld();for(let i=0;i<checkpointDefs.length;i++){const c=checkpointDefs[i],x=c.x-cam;if(x<-80||x>VW+80)continue;ctx.save();ctx.globalAlpha=i<=activeCheckpoint?1:.72;ctx.fillStyle=i<=activeCheckpoint?'#74f7c5':'#69edff';ctx.fillRect(x-4,GROUND-116,8,116);ctx.fillRect(x-26,GROUND-116,52,7);ctx.font='800 11px system-ui';ctx.textAlign='center';ctx.fillText(c.label,x,GROUND-128);ctx.restore();}};}
