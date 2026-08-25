'use strict';
// Pause presentation: clearly separates suspended play from active play without changing pause behavior.
(()=>{
 const el=document.getElementById('pause');if(!el)return;
 const style=document.createElement('style');style.textContent='.pause{transition:opacity .16s ease,transform .16s ease,backdrop-filter .16s ease}.pause:not(.show){transform:translate(-50%,-50%) scale(.94)}.pause.show{transform:translate(-50%,-50%) scale(1);backdrop-filter:blur(5px)}.pause::after{content:"TAP OR PRESS P TO RESUME";display:block;margin-top:7px;font-size:7px;font-weight:800;letter-spacing:.16em;opacity:.68;white-space:nowrap}@media(max-height:390px){.pause::after{font-size:6px;margin-top:5px}}';document.head.appendChild(style);
 const observer=new MutationObserver(()=>{el.setAttribute('aria-live',el.classList.contains('show')?'polite':'off');el.setAttribute('aria-hidden',el.classList.contains('show')?'false':'true');});observer.observe(el,{attributes:true,attributeFilter:['class']});
 el.setAttribute('role','status');el.setAttribute('aria-hidden',el.classList.contains('show')?'false':'true');
})();
