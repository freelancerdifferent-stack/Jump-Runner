'use strict';
(()=>{
  const panel=document.getElementById('panel');
  if(!panel)return;

  const rules=[
    {pattern:/spikes/i,action:'JUMP',tip:'Jump a little earlier and use the platform edge as your timing marker.'},
    {pattern:/barrier/i,action:'DASH',tip:'Save DASH for the barrier and trigger it just before contact.'},
    {pattern:/drone/i,action:'JUMP / DASH',tip:'Stomp from above or DASH straight through the drone.'},
    {pattern:/pulse/i,action:'JUMP / DASH',tip:'Watch the incoming pulse cue and answer with a jump or DASH.'},
    {pattern:/sentinel/i,action:'DASH / STOMP',tip:'Wait for the core-open cue, then commit to a DASH or stomp.'},
    {pattern:/fell|skyline|gap/i,action:'JUMP',tip:'Hold the jump slightly longer to carry across wide gaps.'}
  ];

  function chooseCoach(reason){
    const text=String(reason||'');
    for(const rule of rules){if(rule.pattern.test(text))return rule;}
    return {action:'RESET TIMING',tip:'Reset your timing, keep your eyes ahead, and use one clean input at a time.'};
  }

  function showTip(reason){
    const previous=panel.querySelector('.retry-coach');
    if(previous)previous.remove();
    const coach=chooseCoach(reason);
    const tip=document.createElement('div');
    tip.className='retry-coach';
    tip.setAttribute('role','status');
    tip.setAttribute('aria-live','polite');
    tip.setAttribute('aria-atomic','true');
    tip.setAttribute('aria-label','Next try. '+coach.action+'. '+coach.tip);
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

    const heading=document.createElement('div');
    Object.assign(heading.style,{
      display:'flex',
      alignItems:'center',
      gap:'8px',
      marginBottom:'6px'
    });
    const label=document.createElement('span');
    label.textContent='NEXT TRY';
    Object.assign(label.style,{opacity:'.72',fontSize:'10px'});
    const action=document.createElement('span');
    action.className='retry-action';
    action.textContent=coach.action;
    Object.assign(action.style,{
      display:'inline-block',
      padding:'3px 7px',
      borderRadius:'999px',
      border:'1px solid rgba(255,216,107,.44)',
      background:'rgba(255,216,107,.1)',
      color:'#ffe6a1',
      fontSize:'10px',
      letterSpacing:'.08em'
    });
    const copy=document.createElement('div');
    copy.className='retry-copy';
    copy.textContent=coach.tip;
    heading.append(label,action);
    tip.append(heading,copy);
    panel.appendChild(tip);
  }

  window.addEventListener('jumprunnerresult',event=>{
    if(event?.detail?.win)return;
    const reason=event?.detail?.reason||'';
    requestAnimationFrame(()=>showTip(reason));
  });
})();
