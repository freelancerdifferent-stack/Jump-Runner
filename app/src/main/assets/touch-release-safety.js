'use strict';
(()=>{
  const jump=document.getElementById('jumpBtn');
  if(!jump)return;
  const release=()=>{ try{ if(typeof inputJump==='function') inputJump(false); }catch(e){ console.warn('JumpRunner touch release recovery failed',e); } };
  ['pointercancel','pointerout','pointerleave'].forEach(type=>jump.addEventListener(type,release,{passive:true}));
  addEventListener('blur',release);
  addEventListener('visibilitychange',()=>{ if(document.hidden) release(); });
  addEventListener('jumprunnerpause',release);
  addEventListener('jumprunnerresume',release);
})();
