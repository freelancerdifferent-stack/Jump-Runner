'use strict';
// Brief post-defeat guidance so the repaired auto-run encounter resolves clearly.
(()=>{
  let previousDead=false,card=null,timer=0;
  function ensureCard(){
    if(card)return card;
    card=document.createElement('div');
    card.id='bossDefeatFollowthrough';
    card.setAttribute('role','status');
    card.setAttribute('aria-live','polite');
    card.setAttribute('aria-atomic','true');
    Object.assign(card.style,{position:'fixed',left:'50%',top:'28%',transform:'translate(-50%,-50%)',zIndex:'24',padding:'10px 18px',border:'1px solid #74f7c5',borderRadius:'999px',background:'#07101ee8',color:'#dffff3',font:'900 13px system-ui',letterSpacing:'1.2px',pointerEvents:'none',opacity:'0',transition:'opacity .18s ease'});
    document.body.appendChild(card);
    return card;
  }
  function showCue(){
    const el=ensureCard();
    clearTimeout(timer);
    el.textContent='SENTINEL DOWN · AUTO-RUN RESUMED · FINISH AHEAD →';
    el.style.opacity='1';
    timer=setTimeout(()=>{el.style.opacity='0';},1800);
  }
  const baseUpdate=window.update;
  if(typeof baseUpdate!=='function')return;
  window.update=function(dt){
    baseUpdate(dt);
    const dead=typeof boss!=='undefined'&&boss.dead;
    if(dead&&!previousDead)showCue();
    previousDead=dead;
  };
  const baseReset=window.resetRun;
  if(typeof baseReset==='function')window.resetRun=function(){previousDead=false;if(card)card.style.opacity='0';baseReset();};
})();
