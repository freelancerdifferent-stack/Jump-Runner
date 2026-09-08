'use strict';
// Sensory polish: add one restrained, tier-aware halo pulse to live focus milestones.
// This layer is visual-only and never changes streak logic, timing, scoring, physics, or input.
(()=>{
 const style=document.createElement('style');
 style.textContent=`
 .focus-live-milestone{--focus-pulse:#ffd86b88;--focus-pulse-scale:1.13;isolation:isolate}
 .focus-live-milestone[data-focus-tier="5"]{--focus-pulse:#ffbc6a99;--focus-pulse-scale:1.16}
 .focus-live-milestone[data-focus-tier="8"]{--focus-pulse:#74f7c5aa;--focus-pulse-scale:1.19}
 .focus-live-milestone::after{content:'';position:absolute;z-index:-1;inset:-8px -12px;border:1px solid var(--focus-pulse);border-radius:999px;opacity:0;pointer-events:none;box-shadow:0 0 18px color-mix(in srgb,var(--focus-pulse) 42%,transparent)}
 .focus-live-milestone.show::after{animation:focus-milestone-halo .72s cubic-bezier(.2,.72,.24,1) 1 both}
 @keyframes focus-milestone-halo{0%{opacity:.62;transform:scale(.94)}55%{opacity:.28}100%{opacity:0;transform:scale(var(--focus-pulse-scale))}}
 @media(prefers-reduced-motion:reduce){.focus-live-milestone::after,.focus-live-milestone.show::after{animation:none!important;opacity:0!important;transform:none!important}}
 `;
 document.head.appendChild(style);

 const tierFor=(label)=>label.includes('APEX FOCUS')?'8':(label.includes('ON FIRE')?'5':(label.includes('LOCKED IN')?'3':''));
 function tagMilestone(card){
  if(!(card instanceof HTMLElement)||!card.classList.contains('focus-live-milestone'))return;
  const tier=tierFor(String(card.textContent||''));
  if(tier)card.dataset.focusTier=tier;
 }
 const observer=new MutationObserver(records=>{
  for(const record of records){for(const node of record.addedNodes){if(node.nodeType===1){tagMilestone(node);node.querySelectorAll?.('.focus-live-milestone').forEach(tagMilestone);}}}
 });
 observer.observe(document.body,{childList:true,subtree:true});
 document.querySelectorAll('.focus-live-milestone').forEach(tagMilestone);
 addEventListener('pagehide',()=>observer.disconnect(),{once:true});
})();
