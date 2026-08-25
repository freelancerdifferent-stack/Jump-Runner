'use strict';
// Boss damage acknowledgement: reinforces successful attacks without altering encounter rules.
(()=>{
 const style=document.createElement('style');style.textContent='.boss-hit-note{position:fixed;z-index:7;left:50%;top:88px;transform:translateX(-50%);font-size:8px;font-weight:1000;letter-spacing:.18em;color:#ffe69b;text-shadow:0 2px 12px #000,0 0 14px #ffd86b66;opacity:0;pointer-events:none}.boss-hit-note.show{animation:bossHitNote .48s ease-out forwards}@keyframes bossHitNote{0%{opacity:0;transform:translate(-50%,5px) scale(.92)}22%{opacity:1;transform:translate(-50%,0) scale(1.04)}100%{opacity:0;transform:translate(-50%,-7px) scale(1)}}';document.head.appendChild(style);
 const note=document.createElement('div');note.className='boss-hit-note';document.body.appendChild(note);let previous=boss.hp;
 function refresh(){if(boss.hp<previous&&!boss.dead){note.textContent='CORE HIT · '+boss.hp+'/'+boss.maxHp;note.classList.remove('show');void note.offsetWidth;note.classList.add('show');}previous=boss.hp;}
 const base=updateBoss;updateBoss=function(dt){base(dt);refresh();};const reset=resetBoss;resetBoss=function(){reset();previous=boss.maxHp;note.classList.remove('show');};
})();
