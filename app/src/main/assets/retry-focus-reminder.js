'use strict';
// Replay-value polish: carry the clearest result-screen pace target into the next run.
// After the opening reminder fades, a restrained HUD chip keeps the coached gate visible
// until that exact split resolves so players do not have to remember the target mid-run.
(()=>{
 const STORAGE_KEY='jr_retry_focus';
 const splits=[];
 let reminder=null,focusChip=null,hideTimer=0,activeTarget=null;
 const style=document.createElement('style');
 style.textContent='.retry-focus-reminder{position:fixed;z-index:34;left:50%;top:calc(env(safe-area-inset-top,0px) + 92px);transform:translate(-50%,-8px);min-width:220px;max-width:min(420px,72vw);padding:9px 14px;border:1px solid #ffd86b55;border-radius:999px;background:#09111ee8;box-shadow:0 10px 28px #0007;text-align:center;pointer-events:none;opacity:0;transition:opacity .18s ease,transform .18s ease}.retry-focus-reminder.show{opacity:1;transform:translate(-50%,0)}.retry-focus-reminder .kicker{color:#ffd86b;font:900 8px/1.1 system-ui;letter-spacing:.16em}.retry-focus-reminder .copy{margin-top:3px;color:#fff;font:850 10px/1.25 system-ui;letter-spacing:.02em}.retry-focus-chip{position:fixed;z-index:7;left:50%;top:calc(env(safe-area-inset-top,0px) + 78px);transform:translateX(-50%);max-width:min(360px,64vw);padding:5px 11px;border:1px solid #ffd86b38;border-radius:999px;background:#09111eb8;box-shadow:0 6px 18px #0005;color:#ffe69a;font:900 8px/1 system-ui;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;pointer-events:none;opacity:.86}.retry-focus-chip strong{color:#fff;letter-spacing:.04em}@media(max-height:390px){.retry-focus-reminder{top:calc(env(safe-area-inset-top,0px) + 66px);padding:7px 12px}.retry-focus-reminder .copy{font-size:9px}.retry-focus-chip{top:calc(env(safe-area-inset-top,0px) + 55px);font-size:7px;padding:4px 9px}}@media(prefers-reduced-motion:reduce){.retry-focus-reminder{transition:none}}';
 document.head.appendChild(style);
 function readTarget(){try{const raw=localStorage.getItem(STORAGE_KEY);if(!raw)return null;const value=JSON.parse(raw);return value&&Number.isInteger(value.index)&&value.delta>.15?value:null}catch{return null}}
 function writeTarget(target){try{if(target)localStorage.setItem(STORAGE_KEY,JSON.stringify(target));else localStorage.removeItem(STORAGE_KEY)}catch{}}
 function removeFocusChip(){if(focusChip){focusChip.remove();focusChip=null}}
 function showFocusChip(target){removeFocusChip();if(!target||state!=='play')return;focusChip=document.createElement('div');focusChip.className='retry-focus-chip';focusChip.setAttribute('aria-hidden','true');focusChip.innerHTML=`FOCUS · <strong>${target.label}</strong> · −${target.delta.toFixed(1)}s`;document.body.appendChild(focusChip)}
 function hideReminder({keepChip=true}={}){if(hideTimer){clearTimeout(hideTimer);hideTimer=0}if(reminder){reminder.classList.remove('show');setTimeout(()=>{reminder?.remove();reminder=null},220)}if(!keepChip)removeFocusChip()}
 function showReminder(){
  hideReminder({keepChip:false});activeTarget=readTarget();if(!activeTarget||state!=='play')return;
  reminder=document.createElement('div');reminder.className='retry-focus-reminder';reminder.setAttribute('role','status');reminder.setAttribute('aria-live','polite');reminder.setAttribute('aria-atomic','true');
  const kicker=document.createElement('div');kicker.className='kicker';kicker.textContent='NEXT RUN FOCUS';
  const copy=document.createElement('div');copy.className='copy';copy.textContent=`${activeTarget.label} · recover ${activeTarget.delta.toFixed(1)}s`;
  reminder.append(kicker,copy);document.body.appendChild(reminder);requestAnimationFrame(()=>reminder?.classList.add('show'));hideTimer=setTimeout(()=>{hideReminder();showFocusChip(activeTarget)},3200);
 }
 function rememberSplit(detail){
  if(!detail||!Number.isInteger(detail.index))return;
  splits[detail.index]={index:detail.index,label:String(detail.label||`GATE ${detail.index+1}`),delta:Number(detail.delta)||0,isBest:Boolean(detail.isBest)};
  if(activeTarget&&detail.index===activeTarget.index){hideReminder({keepChip:false});activeTarget=null;}
 }
 function commitTarget(){const rows=splits.filter(Boolean);if(!rows.length)return;const slower=rows.filter(row=>!row.isBest&&row.delta>.15).sort((a,b)=>b.delta-a.delta);writeTarget(slower.length?{index:slower[0].index,label:slower[0].label,delta:slower[0].delta}:null)}
 addEventListener('jumprunnercheckpointsplit',e=>rememberSplit(e.detail));
 addEventListener('jumprunnerresult',e=>{hideReminder({keepChip:false});activeTarget=null;if(e.detail?.win)commitTarget()});
 addEventListener('jumprunnerpause',()=>hideReminder({keepChip:false}));
 addEventListener('jumprunnerresume',()=>{if(activeTarget&&state==='play')showFocusChip(activeTarget)});
 const baseReset=resetRun;
 resetRun=function(){hideReminder({keepChip:false});activeTarget=null;splits.length=0;baseReset();setTimeout(showReminder,700)};
})();
