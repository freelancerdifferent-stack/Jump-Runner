'use strict';
// Sensory polish: sweep one restrained tier-aware sheen across live focus milestone chips.
// Visual-only: no changes to streak logic, scoring, physics, timing, or input.
(()=>{
 const style=document.createElement('style');
 style.textContent=`
 .focus-live-milestone{--focus-sheen:rgba(255,255,255,.46);overflow:hidden}
 .focus-live-milestone[data-focus-tier="5"]{--focus-sheen:rgba(255,226,170,.52)}
 .focus-live-milestone[data-focus-tier="8"]{--focus-sheen:rgba(190,255,232,.58)}
 .focus-live-milestone::before{content:'';position:absolute;pointer-events:none;z-index:2;top:-45%;bottom:-45%;left:-34%;width:22%;opacity:0;transform:skewX(-18deg);background:linear-gradient(90deg,transparent,var(--focus-sheen),transparent)}
 .focus-live-milestone.show::before{animation:focus-milestone-sheen .62s cubic-bezier(.24,.66,.28,1) .05s 1 both}
 @keyframes focus-milestone-sheen{0%{left:-34%;opacity:0}16%{opacity:.78}76%{opacity:.46}100%{left:114%;opacity:0}}
 @media(prefers-reduced-motion:reduce){.focus-live-milestone::before,.focus-live-milestone.show::before{animation:none!important;opacity:0!important}}
 `;
 document.head.appendChild(style);

 const tierFor=(label)=>label.includes('APEX FOCUS')?'8':(label.includes('ON FIRE')?'5':(label.includes('LOCKED IN')?'3':''));
 function tag(card){
  if(!(card instanceof HTMLElement)||!card.classList.contains('focus-live-milestone'))return;
  const tier=tierFor(String(card.textContent||''));
  if(tier)card.dataset.focusTier=tier;
 }
 const observer=new MutationObserver(records=>{
  for(const record of records){
   for(const node of record.addedNodes){
    if(node.nodeType===1){tag(node);node.querySelectorAll?.('.focus-live-milestone').forEach(tag);}
   }
  }
 });
 observer.observe(document.body,{childList:true,subtree:true});
 document.querySelectorAll('.focus-live-milestone').forEach(tag);
})();
