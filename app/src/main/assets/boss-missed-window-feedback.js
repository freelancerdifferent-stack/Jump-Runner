'use strict';
(()=>{
  if(typeof boss==='undefined'||typeof update!=='function')return;
  const baseUpdate=update;
  const note=document.createElement('div');
  note.id='bossMissedWindowNote';
  note.setAttribute('role','status');
  note.setAttribute('aria-live','polite');
  note.setAttribute('aria-atomic','true');
  Object.assign(note.style,{
    position:'fixed',left:'50%',top:'118px',transform:'translateX(-50%) translateY(-8px)',
    zIndex:'30',padding:'8px 14px',border:'1px solid rgba(255,216,107,.55)',
    borderRadius:'999px',background:'rgba(7,16,30,.88)',color:'#ffd86b',
    font:'800 11px system-ui',letterSpacing:'.08em',pointerEvents:'none',opacity:'0',
    transition:'opacity .16s ease, transform .16s ease'
  });
  document.body.appendChild(note);
  let previousOpen=false,previousHp=boss.hp,timer=0;
  function hide(){note.style.opacity='0';note.style.transform='translateX(-50%) translateY(-8px)';}
  function show(text){
    clearTimeout(timer);note.textContent=text;note.style.opacity='1';
    note.style.transform='translateX(-50%) translateY(0)';
    timer=setTimeout(hide,1100);
  }
  update=function(dt){
    const hpBefore=boss.hp;
    baseUpdate(dt);
    const hitLanded=boss.hp<hpBefore||boss.hp<previousHp;
    if(previousOpen&&!boss.coreOpen&&!hitLanded&&boss.active&&!boss.dead&&boss.intro<=0){
      show('WINDOW MISSED · NEXT PASS INCOMING');
    }
    if(hitLanded)hide();
    previousOpen=Boolean(boss.coreOpen);
    previousHp=boss.hp;
  };
  const baseReset=resetRun;
  resetRun=function(){previousOpen=false;previousHp=boss.maxHp;hide();baseReset();};
})();
