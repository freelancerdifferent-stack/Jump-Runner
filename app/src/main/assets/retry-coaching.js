'use strict';
(()=>{
  const panel=document.getElementById('panel');
  if(!panel)return;

  const rules=[
    [/spikes/i,'Jump a little earlier and use the platform edge as your timing marker.'],
    [/barrier/i,'Save DASH for the barrier and trigger it just before contact.'],
    [/drone/i,'Stomp from above or DASH straight through the drone.'],
    [/pulse/i,'Watch the incoming pulse cue and answer with a jump or DASH.'],
    [/sentinel/i,'Wait for the core-open cue, then commit to a DASH or stomp.'],
    [/fell|skyline|gap/i,'Hold the jump slightly longer to carry across wide gaps.']
  ];

  function chooseTip(reason){
    const text=String(reason||'');
    for(const [pattern,tip] of rules){if(pattern.test(text))return tip;}
    return 'Reset your timing, keep your eyes ahead, and use one clean input at a time.';
  }

  function showTip(){
    const previous=panel.querySelector('.retry-coach');
    if(previous)previous.remove();
    const tip=document.createElement('div');
    tip.className='retry-coach';
    tip.setAttribute('role','status');
    tip.setAttribute('aria-live','polite');
    tip.setAttribute('aria-atomic','true');
    tip.textContent='NEXT TRY · '+chooseTip(window.deathReason);
    Object.assign(tip.style,{
      marginTop:'14px',
      padding:'10px 12px',
      border:'1px solid rgba(105,237,255,.28)',
      borderRadius:'12px',
      background:'rgba(7,16,30,.72)',
      color:'#dffaff',
      fontSize:'12px',
      fontWeight:'800',
      letterSpacing:'.035em',
      lineHeight:'1.35'
    });
    panel.appendChild(tip);
  }

  window.addEventListener('jumprunnerresult',event=>{
    if(event?.detail?.win)return;
    requestAnimationFrame(showTip);
  });
})();
