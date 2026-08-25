'use strict';
// A short launch acknowledgement helps the first movement read cleanly on touch devices.
(()=>{
 const note=document.createElement('div');note.className='run-start-note';note.setAttribute('aria-live','polite');note.textContent='RUN';document.body.appendChild(note);
 const style=document.createElement('style');style.textContent='.run-start-note{position:fixed;z-index:7;left:50%;top:44%;transform:translate(-50%,-50%) scale(.88);font-size:clamp(22px,5vw,42px);font-weight:1000;letter-spacing:.28em;color:#eaffff;text-shadow:0 4px 24px #07111d,0 0 24px #69edff55;opacity:0;pointer-events:none}.run-start-note.go{animation:runStart .62s ease-out forwards}@keyframes runStart{0%{opacity:0;transform:translate(-50%,-50%) scale(.82)}20%{opacity:1;transform:translate(-50%,-50%) scale(1.04)}72%{opacity:.9}100%{opacity:0;transform:translate(-50%,-62%) scale(1)}}';document.head.appendChild(style);
 let previousState=state;
 const base=update;
 update=function(dt){const before=state;base(dt);if(state==='play'&&before!=='play'&&previousState!=='play'){note.classList.remove('go');void note.offsetWidth;note.classList.add('go');}previousState=state;};
 const reset=resetRun;resetRun=function(){previousState='ready';note.classList.remove('go');reset();};
})();
