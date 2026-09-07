'use strict';
// Lightweight replay-value polish: checkpoint split times without changing checkpoint rules.
const splitToast=document.createElement('div');
splitToast.className='checkpoint-split-toast';
splitToast.setAttribute('role','status');
splitToast.setAttribute('aria-live','polite');
splitToast.setAttribute('aria-atomic','true');
document.body.appendChild(splitToast);
const splitStyle=document.createElement('style');
splitStyle.textContent='.checkpoint-split-toast{position:fixed;z-index:7;left:50%;top:max(145px,calc(env(safe-area-inset-top) + 126px));transform:translate(-50%,-8px);padding:6px 13px;border:1px solid #69edff44;border-radius:999px;background:#071522dd;box-shadow:0 10px 24px #0005;color:#dffbff;font:850 10px/1.2 system-ui;letter-spacing:.08em;pointer-events:none;opacity:0;transition:opacity .16s ease,transform .2s ease}.checkpoint-split-toast.show{opacity:1;transform:translate(-50%,0)}.checkpoint-split-toast.best{border-color:#74f7c577;color:#74f7c5;box-shadow:0 10px 24px #0005,0 0 18px #74f7c522}@media(max-height:390px){.checkpoint-split-toast{top:max(108px,calc(env(safe-area-inset-top) + 92px));font-size:9px;padding:5px 11px}}@media(prefers-reduced-motion:reduce){.checkpoint-split-toast{transition:opacity .01s linear;transform:translate(-50%,0)}}';
document.head.appendChild(splitStyle);
let splitTimer=0,lastSplitCheckpoint=activeCheckpoint;
function splitKey(index){return 'jr_checkpoint_split_'+index;}
function readBestSplit(index){const value=Number(localStorage.getItem(splitKey(index))||0);return Number.isFinite(value)&&value>0?value:0;}
function writeBestSplit(index,value){try{localStorage.setItem(splitKey(index),String(value));}catch(_){}}
function showSplit(index){
 const current=Math.max(0,time),previous=readBestSplit(index),isBest=!previous||current<previous;
 if(isBest)writeBestSplit(index,current);
 const delta=previous?current-previous:0;
 const verdict=isBest?'NEW BEST SPLIT':(delta>=0?`+${delta.toFixed(1)}s`:`${delta.toFixed(1)}s`);
 splitToast.textContent=`${checkpointDefs[index].label} · ${current.toFixed(1)}s · ${verdict}`;
 splitToast.classList.toggle('best',isBest);
 splitToast.setAttribute('aria-label',isBest?`${checkpointDefs[index].label}. ${current.toFixed(1)} seconds. New best split.`:`${checkpointDefs[index].label}. ${current.toFixed(1)} seconds. ${Math.abs(delta).toFixed(1)} seconds ${delta>=0?'behind':'ahead of'} best split.`);
 splitToast.classList.remove('show');void splitToast.offsetWidth;splitToast.classList.add('show');splitTimer=1.85;
}
const splitUpdate=update;
update=function(dt){
 splitUpdate(dt);
 if(activeCheckpoint!==lastSplitCheckpoint){
   lastSplitCheckpoint=activeCheckpoint;
   if(activeCheckpoint>=0&&state==='play')showSplit(activeCheckpoint);
 }
 if(splitTimer>0){splitTimer=Math.max(0,splitTimer-dt);if(splitTimer===0)splitToast.classList.remove('show');}
};
const splitReset=resetRun;
resetRun=function(){lastSplitCheckpoint=-1;splitTimer=0;splitToast.classList.remove('show','best');splitToast.removeAttribute('aria-label');splitReset();};
addEventListener('jumprunnerpause',()=>splitToast.classList.remove('show'));
