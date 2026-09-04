'use strict';
(()=>{
  let last=-1;
  const names=['RUN STARTED','CITY EDGE CLEARED','SKYLINE MIDPOINT','SENTINEL APPROACH'];
  const points=[0,.25,.5,.78];
  const box=document.createElement('div');
  box.id='runPhaseToast';
  box.className='run-phase-toast';
  box.setAttribute('role','status');
  box.setAttribute('aria-live','polite');
  box.setAttribute('aria-atomic','true');
  document.body.appendChild(box);
  function show(text){box.textContent=text;box.classList.add('show');setTimeout(()=>box.classList.remove('show'),2200)}
  function reset(){last=-1;box.classList.remove('show')}
  function check(){
    if(typeof state==='undefined'||typeof player==='undefined')return;
    if(state!=='play'){if(state==='menu'||state==='dead'||state==='win')reset();return}
    const ratio=Math.max(0,Math.min(1,player.x/(typeof LEVEL_END==='number'?LEVEL_END:1)));
    let next=0;
    for(let i=points.length-1;i>=0;i--){if(ratio>=points[i]){next=i;break}}
    if(next!==last){last=next;show(names[next])}
  }
  addEventListener('jumprunnerpause',()=>box.classList.remove('show'));
  addEventListener('jumprunnerresume',()=>{if(typeof state!=='undefined'&&state==='play')show('RUN RESUMED')});
  setInterval(check,80);
})();
