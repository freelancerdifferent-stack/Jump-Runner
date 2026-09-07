'use strict';
// Replay-value polish: turn checkpoint pace data into one clear next-run target.
const focusCoachSplits=[];
const focusCoachStyle=document.createElement('style');
focusCoachStyle.textContent='.result-focus-coach{margin:10px 0 2px;padding:10px 12px;border:1px solid #ffd86b30;border-radius:14px;background:#130f0899;text-align:left}.result-focus-coach .kicker{color:#ffd86b;font:900 9px/1.2 system-ui;letter-spacing:.14em}.result-focus-coach .target{margin-top:4px;color:#fff;font:900 12px/1.3 system-ui}.result-focus-coach .detail{margin-top:3px;color:#bcd7df;font:700 9px/1.35 system-ui}.result-focus-coach.is-clean{border-color:#74f7c530;background:#08150f99}.result-focus-coach.is-clean .kicker{color:#74f7c5}@media(max-height:390px){.result-focus-coach{margin-top:7px;padding:8px 10px}.result-focus-coach .target{font-size:10px}.result-focus-coach .detail{font-size:8px}}';
document.head.appendChild(focusCoachStyle);
function resetFocusCoach(){focusCoachSplits.length=0;}
function rememberFocusSplit(detail){
 if(!detail||!Number.isInteger(detail.index))return;
 focusCoachSplits[detail.index]={index:detail.index,label:String(detail.label||`GATE ${detail.index+1}`),delta:Number(detail.delta)||0,isBest:Boolean(detail.isBest)};
}
function pickFocusTarget(){
 const rows=focusCoachSplits.filter(Boolean);
 if(!rows.length)return null;
 const slower=rows.filter(split=>!split.isBest&&split.delta>.15).sort((a,b)=>b.delta-a.delta);
 if(slower.length)return{clean:false,split:slower[0]};
 const bestAhead=rows.filter(split=>split.isBest||split.delta<0).length;
 return{clean:true,count:bestAhead,total:rows.length};
}
function renderFocusCoach(){
 if(!panel)return;
 const old=panel.querySelector('.result-focus-coach');if(old)old.remove();
 const target=pickFocusTarget();if(!target)return;
 const card=document.createElement('div');card.className='result-focus-coach'+(target.clean?' is-clean':'');card.setAttribute('role','status');card.setAttribute('aria-live','polite');card.setAttribute('aria-atomic','true');
 const kicker=document.createElement('div');kicker.className='kicker';kicker.textContent=target.clean?'PACE LOCKED':'NEXT RUN FOCUS';
 const title=document.createElement('div');title.className='target';
 const detail=document.createElement('div');detail.className='detail';
 if(target.clean){
  title.textContent='Keep this checkpoint rhythm.';
  detail.textContent=`${target.count}/${target.total} recorded gates matched or beat your stored pace.`;
 }else{
  title.textContent=`Clean up ${target.split.label}.`;
  detail.textContent=`Largest time loss: +${target.split.delta.toFixed(1)}s versus your stored checkpoint pace. One target, one cleaner retry.`;
 }
 card.append(kicker,title,detail);
 const actions=panel.querySelector('.actions');if(actions)panel.insertBefore(card,actions);else panel.appendChild(card);
}
addEventListener('jumprunnercheckpointsplit',e=>rememberFocusSplit(e.detail));
addEventListener('jumprunnerresult',()=>requestAnimationFrame(renderFocusCoach));
const focusCoachReset=resetRun;
resetRun=function(){resetFocusCoach();focusCoachReset();};
