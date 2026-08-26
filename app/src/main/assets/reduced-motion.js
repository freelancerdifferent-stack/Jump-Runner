'use strict';
// Honor the platform reduced-motion preference without changing gameplay timing.
(()=>{
  const media=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if(!media)return;

  let reduced=Boolean(media.matches);
  const applyPreference=()=>{
    reduced=Boolean(media.matches);
    document.documentElement.toggleAttribute('data-reduced-motion',reduced);
  };
  applyPreference();

  if(typeof media.addEventListener==='function')media.addEventListener('change',applyPreference);
  else if(typeof media.addListener==='function')media.addListener(applyPreference);

  const baseUpdate=update;
  update=function(dt){
    baseUpdate(dt);
    if(!reduced)return;
    // Screen shake and long motion trails are decorative. Suppress them after every
    // gameplay update so later combat/feedback systems cannot reintroduce motion.
    shake=0;
    if(player&&Array.isArray(player.trail))player.trail.length=0;
  };

  const baseBurst=burst;
  burst=function(x,y,color,n=12,power=180){
    if(!reduced)return baseBurst(x,y,color,n,power);
    // Keep a small impact cue for readability while substantially reducing motion.
    return baseBurst(x,y,color,Math.min(n,4),Math.min(power,90));
  };
})();
