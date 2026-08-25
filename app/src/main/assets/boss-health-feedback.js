'use strict';
// Boss damage acknowledgement: reinforces successful attacks without altering encounter rules.
(()=>{
 const style=document.createElement('style');style.textContent='.boss-hit-note{position:fixed;z-index:7;left:50%;top:88px;transform:translateX(-50%);font-size:8px;font-weight:1000;letter-spacing:.18em;color:#ffe69b;text-shadow:0 2px 12px #000,0 0 14px #ffd86b66;opacity:0;pointer-events:none}.boss-hit-note.show{animation:bossHitNote .48s ease-out forwards}@keyframes bossHitNote{0%{opacity:0;transform:translate(-50%,5px) scale(.92)}22%{opacity:1;transform:translate(-50%,0) scale(1.04)}100%{opacity:0;transform:translate(-50%,-7px) scale(1)}}';document.head.appendChild(style);
 const note=document.createElement('div');note.className='boss-hit-note';document.body.appendChild(note);
 const status=document.createElement('div');status.className='sr-only';status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');document.body.appendChild(status);
 let previous=boss.hp,previousDead=boss.dead,announceTimer=0;
 function announce(message){clearTimeout(announceTimer);status.textContent='';announceTimer=setTimeout(()=>{status.textContent=message;},20);}
 function refresh(){
  if(!previousDead&&boss.dead)announce('Sky Sentinel defeated. Finish line unlocked.');
  else if(boss.hp<previous&&!boss.dead){note.textContent='CORE HIT · '+boss.hp+'/'+boss.maxHp;note.classList.remove('show');void note.offsetWidth;note.classList.add('show');announce('Sentinel core hit. '+boss.hp+' of '+boss.maxHp+' integrity remaining.');}
  previous=boss.hp;previousDead=boss.dead;
 }
 const base=updateBoss;updateBoss=function(dt){base(dt);refresh();};const reset=resetBoss;resetBoss=function(){reset();previous=boss.maxHp;previousDead=false;status.textContent='';clearTimeout(announceTimer);note.classList.remove('show');};
})();
