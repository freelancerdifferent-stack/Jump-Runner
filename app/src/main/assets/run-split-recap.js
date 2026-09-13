'use strict';
// Replay-value polish: preserve checkpoint split context on the result screen.
const runSplits=[];
const BEST_SPLIT_STREAK_KEY='jr_best_split_streak';
let currentBestSplitStreak=0,peakBestSplitStreak=0;
let bestSplitStreakRecord=Math.max(0,Number(localStorage.getItem(BEST_SPLIT_STREAK_KEY)||0)||0);
const splitRecapStyle=document.createElement('style');
splitRecapStyle.textContent='.run-split-recap{display:grid;gap:6px;margin:14px 0 2px;padding:10px 12px;border:1px solid #69edff24;border-radius:14px;background:#07152299;text-align:left}.run-split-recap-title{color:#9eefff;font:900 9px/1.2 system-ui;letter-spacing:.14em}.run-split-recap-achievement{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 8px;border:1px solid #74f7c536;border-radius:10px;background:#74f7c50b;color:#bfffe8;font:900 9px/1.2 system-ui;letter-spacing:.08em}.run-split-recap-achievement.is-record{border-color:#ffd86b55;background:#ffd86b0d;color:#fff0b8}.run-split-recap-achievement strong{color:#74f7c5;font-size:11px;white-space:nowrap}.run-split-recap-achievement.is-record strong{color:#ffd86b}.run-split-recap-record{opacity:.78;font-size:8px;letter-spacing:.05em;white-space:nowrap}.run-split-recap-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:10px;align-items:center;color:#dffbff;font:800 10px/1.2 system-ui}.run-split-recap-row .time{font-variant-numeric:tabular-nums;color:#fff}.run-split-recap-row .pace{font-size:9px;color:#ffd86b}.run-split-recap-row .pace.ahead,.run-split-recap-row .pace.best{color:#74f7c5}@media(max-height:390px){.run-split-recap{margin-top:9px;padding:8px 10px;gap:4px}.run-split-recap-achievement{padding:5px 7px;font-size:8px}.run-split-recap-achievement strong{font-size:10px}.run-split-recap-record{font-size:7px}.run-split-recap-row{font-size:9px;gap:7px}.run-split-recap-row .pace{font-size:8px}}';
document.head.appendChild(splitRecapStyle);
function resetRunSplits(){runSplits.length=0;currentBestSplitStreak=0;peakBestSplitStreak=0;}
function rememberSplit(detail){
 if(!detail||!Number.isInteger(detail.index))return;
 const isBest=Boolean(detail.isBest);
 currentBestSplitStreak=isBest?currentBestSplitStreak+1:0;
 peakBestSplitStreak=Math.max(peakBestSplitStreak,currentBestSplitStreak);
 runSplits[detail.index]={index:detail.index,label:String(detail.label||`GATE ${detail.index+1}`),current:Number(detail.current)||0,delta:Number(detail.delta)||0,isBest};
}
function paceText(split){
 if(split.isBest)return 'BEST';
 if(split.delta<0)return `${Math.abs(split.delta).toFixed(1)}s AHEAD`;
 return `+${split.delta.toFixed(1)}s`;
}
function commitBestSplitStreakRecord(){
 if(peakBestSplitStreak<2||peakBestSplitStreak<=bestSplitStreakRecord)return false;
 bestSplitStreakRecord=peakBestSplitStreak;
 localStorage.setItem(BEST_SPLIT_STREAK_KEY,String(bestSplitStreakRecord));
 return true;
}
function renderRunSplitRecap(){
 const rows=runSplits.filter(Boolean);
 if(!rows.length||!panel)return;
 const old=panel.querySelector('.run-split-recap');if(old)old.remove();
 const previousRecord=bestSplitStreakRecord;
 const isNewRecord=commitBestSplitStreakRecord();
 const recap=document.createElement('div');recap.className='run-split-recap';recap.setAttribute('role','group');recap.setAttribute('aria-label',peakBestSplitStreak>=2?(isNewRecord?`Checkpoint split recap. New personal best split streak record: ${peakBestSplitStreak} in a row.`:`Checkpoint split recap. Best split streak ${peakBestSplitStreak} in a row. Personal record ${bestSplitStreakRecord}.`):'Checkpoint split recap');
 const title=document.createElement('div');title.className='run-split-recap-title';title.textContent='CHECKPOINT SPLITS';recap.appendChild(title);
 if(peakBestSplitStreak>=2){
  const achievement=document.createElement('div');achievement.className='run-split-recap-achievement'+(isNewRecord?' is-record':'');achievement.setAttribute('role','status');achievement.setAttribute('aria-label',isNewRecord?`New personal checkpoint split streak record: ${peakBestSplitStreak} in a row.`:`Best checkpoint split streak: ${peakBestSplitStreak} in a row. Personal record: ${bestSplitStreakRecord}.`);
  const achievementLabel=document.createElement('span');achievementLabel.textContent=isNewRecord?'NEW STREAK RECORD':'BEST SPLIT STREAK';
  const achievementValue=document.createElement('strong');achievementValue.textContent=`×${peakBestSplitStreak}`;
  achievement.append(achievementLabel,achievementValue);
  if(!isNewRecord&&bestSplitStreakRecord>peakBestSplitStreak){const record=document.createElement('span');record.className='run-split-recap-record';record.textContent=`RECORD ×${bestSplitStreakRecord}`;achievement.appendChild(record);}
  else if(isNewRecord&&previousRecord>=2){const record=document.createElement('span');record.className='run-split-recap-record';record.textContent=`PREV ×${previousRecord}`;achievement.appendChild(record);}
  recap.appendChild(achievement);
 }
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
