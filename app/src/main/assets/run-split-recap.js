'use strict';
// Replay-value polish: preserve checkpoint split context on the result screen.
const runSplits=[];
const splitRecapStyle=document.createElement('style');
splitRecapStyle.textContent='.run-split-recap{display:grid;gap:6px;margin:14px 0 2px;padding:10px 12px;border:1px solid #69edff24;border-radius:14px;background:#07152299;text-align:left}.run-split-recap-title{color:#9eefff;font:900 9px/1.2 system-ui;letter-spacing:.14em}.run-split-recap-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:10px;align-items:center;color:#dffbff;font:800 10px/1.2 system-ui}.run-split-recap-row .time{font-variant-numeric:tabular-nums;color:#fff}.run-split-recap-row .pace{font-size:9px;color:#ffd86b}.run-split-recap-row .pace.ahead,.run-split-recap-row .pace.best{color:#74f7c5}@media(max-height:390px){.run-split-recap{margin-top:9px;padding:8px 10px;gap:4px}.run-split-recap-row{font-size:9px;gap:7px}.run-split-recap-row .pace{font-size:8px}}';
document.head.appendChild(splitRecapStyle);
function resetRunSplits(){runSplits.length=0;}
function rememberSplit(detail){
 if(!detail||!Number.isInteger(detail.index))return;
 runSplits[detail.index]={index:detail.index,label:String(detail.label||`GATE ${detail.index+1}`),current:Number(detail.current)||0,delta:Number(detail.delta)||0,isBest:Boolean(detail.isBest)};
}
function paceText(split){
 if(split.isBest)return 'BEST';
 if(split.delta<0)return `${Math.abs(split.delta).toFixed(1)}s AHEAD`;
 return `+${split.delta.toFixed(1)}s`;
}
function renderRunSplitRecap(){
 const rows=runSplits.filter(Boolean);
 if(!rows.length||!panel)return;
 const old=panel.querySelector('.run-split-recap');if(old)old.remove();
 const recap=document.createElement('div');recap.className='run-split-recap';recap.setAttribute('role','group');recap.setAttribute('aria-label','Checkpoint split recap');
 const title=document.createElement('div');title.className='run-split-recap-title';title.textContent='CHECKPOINT SPLITS';recap.appendChild(title);
 for(const split of rows){
  const row=document.createElement('div');row.className='run-split-recap-row';
  const label=document.createElement('span');label.textContent=split.label;
  const timeEl=document.createElement('span');timeEl.className='time';timeEl.textContent=`${split.current.toFixed(1)}s`;
  const pace=document.createElement('span');pace.className='pace'+(split.isBest?' best':split.delta<0?' ahead':'');pace.textContent=paceText(split);
  row.append(label,timeEl,pace);recap.appendChild(row);
 }
 const actions=panel.querySelector('.actions');if(actions)panel.insertBefore(recap,actions);else panel.appendChild(recap);
}
addEventListener('jumprunnercheckpointsplit',e=>rememberSplit(e.detail));
addEventListener('jumprunnerresult',()=>requestAnimationFrame(renderRunSplitRecap));
const splitRecapReset=resetRun;
resetRun=function(){resetRunSplits();splitRecapReset();};
