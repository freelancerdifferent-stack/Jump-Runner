'use strict';
(()=>{
  const tiers=[
    {speed:380,label:'PACE UP · 380'},
    {speed:420,label:'PACE UP · 420'},
    {speed:455,label:'MAX PACE · 455'}
  ];
  let announced=new Set(),lastTime=0,hideTimer=0;
  const toast=document.createElement('div');
  toast.id='paceMilestone';
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  toast.setAttribute('aria-atomic','true');
  Object.assign(toast.style,{position:'fixed',left:'50%',top:'96px',transform:'translateX(-50%) translateY(-8px)',zIndex:'12',padding:'8px 14px',border:'1px solid rgba(105,237,255,.45)',borderRadius:'999px',background:'rgba(7,16,30,.88)',boxShadow:'0 8px 24px rgba(0,0,0,.2)',color:'#9eefff',font:'800 11px system-ui',letterSpacing:'1.2px',opacity:'0',pointerEvents:'none',transition:'opacity .18s ease,transform .18s ease'});
  document.body.appendChild(toast);
  function reset(){announced=new Set();lastTime=0;toast.style.opacity='0';toast.style.transform='translateX(-50%) translateY(-8px)';clearTimeout(hideTimer);}
  function show(label){
    toast.textContent=label;
    toast.style.opacity='1';
    toast.style.transform='translateX(-50%) translateY(0)';
    clearTimeout(hideTimer);
    hideTimer=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translateX(-50%) translateY(-8px)'},1100);
  }
  function tick(){
    if(typeof time==='number'&&time+0.05<lastTime)reset();
    lastTime=typeof time==='number'?time:lastTime;
    if(typeof state==='string'&&state==='play'&&typeof time==='number'){
      const baseSpeed=340+Math.min(115,time*3.2);
      for(const tier of tiers){
        if(baseSpeed>=tier.speed&&!announced.has(tier.speed)){
          announced.add(tier.speed);
          show(tier.label);
          break;
        }
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
