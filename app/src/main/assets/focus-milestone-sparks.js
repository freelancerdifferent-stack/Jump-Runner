'use strict';
// Sensory polish: one restrained spark burst accompanies live focus milestone celebrations.
// Visual-only, tier-aware, and fully disabled for reduced-motion users.
(()=>{
 const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const style=document.createElement('style');
 style.textContent=`
 .focus-live-milestone{position:relative}
 .focus-milestone-sparks{position:absolute;inset:50% auto auto 50%;width:1px;height:1px;pointer-events:none;z-index:2}
 .focus-milestone-spark{--spark-angle:0deg;--spark-distance:30px;--spark-size:3px;position:absolute;left:0;top:0;width:var(--spark-size);height:var(--spark-size);border-radius:999px;background:currentColor;box-shadow:0 0 7px currentColor;opacity:0;transform:rotate(var(--spark-angle)) translateX(7px) scale(.75);animation:focus-milestone-spark-out .58s cubic-bezier(.18,.72,.28,1) both}
 @keyframes focus-milestone-spark-out{0%{opacity:0;transform:rotate(var(--spark-angle)) translateX(5px) scale(.65)}16%{opacity:.9}100%{opacity:0;transform:rotate(var(--spark-angle)) translateX(var(--spark-distance)) scale(.15)}}
 @media(prefers-reduced-motion:reduce){.focus-milestone-sparks{display:none!important}.focus-milestone-spark{animation:none!important}}
 `;
 document.head.appendChild(style);

 function tierFor(label){return label.includes('APEX FOCUS')?8:(label.includes('ON FIRE')?5:(label.includes('LOCKED IN')?3:0));}
 function burst(card){
  if(reduceMotion.matches||!(card instanceof HTMLElement)||card.dataset.focusSparked==='1')return;
  const tier=tierFor(String(card.textContent||''));
  if(!tier)return;
  card.dataset.focusSparked='1';
  const wrap=document.createElement('span');
  wrap.className='focus-milestone-sparks';
  wrap.setAttribute('aria-hidden','true');
  const count=tier===8?7:(tier===5?6:5);
  const color=tier===8?'#74f7c5':(tier===5?'#ffbc6a':'#ffd86b');
  for(let i=0;i<count;i++){
   const spark=document.createElement('i');
   spark.className='focus-milestone-spark';
   spark.style.color=color;
   spark.style.setProperty('--spark-angle',`${Math.round((360/count)*i-90)}deg`);
   spark.style.setProperty('--spark-distance',`${tier===8?38:(tier===5?34:30)}px`);
   spark.style.setProperty('--spark-size',`${i%2===0?4:3}px`);
   spark.style.animationDelay=`${i*18}ms`;
   wrap.appendChild(spark);
  }
  card.appendChild(wrap);
  setTimeout(()=>wrap.remove(),760);
 }
 function inspect(node){
  if(!(node instanceof HTMLElement))return;
  if(node.classList.contains('focus-live-milestone'))burst(node);
  node.querySelectorAll?.('.focus-live-milestone').forEach(burst);
 }
 const observer=new MutationObserver(records=>{
  for(const record of records)for(const node of record.addedNodes)inspect(node);
 });
 observer.observe(document.body,{childList:true,subtree:true});
 document.querySelectorAll('.focus-live-milestone').forEach(burst);
})();
