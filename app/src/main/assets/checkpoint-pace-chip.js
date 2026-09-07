'use strict';
// Replay-value polish: keep the latest checkpoint pace delta visible between split toasts.
const paceChip=document.createElement('div');
paceChip.className='checkpoint-pace-chip';
paceChip.setAttribute('role','status');
paceChip.setAttribute('aria-live','polite');
paceChip.setAttribute('aria-atomic','true');
paceChip.hidden=true;
document.body.appendChild(paceChip);
const paceStyle=document.createElement('style');
paceStyle.textContent='.checkpoint-pace-chip{position:fixed;z-index:6;left:50%;top:max(104px,calc(env(safe-area-inset-top) + 86px));transform:translateX(-50%);padding:5px 11px;border:1px solid #69edff33;border-radius:999px;background:#06121ecc;box-shadow:0 8px 20px #0004;color:#bdefff;font:850 9px/1.2 system-ui;letter-spacing:.1em;pointer-events:none;white-space:nowrap}.checkpoint-pace-chip.ahead{border-color:#74f7c555;color:#74f7c5}.checkpoint-pace-chip.behind{border-color:#ffd86b55;color:#ffd86b}.checkpoint-pace-chip.best{border-color:#8fffe077;color:#8fffe0;box-shadow:0 8px 20px #0004,0 0 15px #74f7c51f}.checkpoint-pace-chip.boss{top:max(112px,calc(env(safe-area-inset-top) + 94px))}@media(max-height:390px){.checkpoint-pace-chip{top:max(78px,calc(env(safe-area-inset-top) + 66px));font-size:8px;padding:4px 9px}.checkpoint-pace-chip.boss{top:max(84px,calc(env(safe-area-inset-top) + 72px))}}';
document.head.appendChild(paceStyle);
let latestPace=null;
function clearPace(){latestPace=null;paceChip.hidden=true;paceChip.classList.remove('ahead','behind','best','boss');paceChip.removeAttribute('aria-label');}
function renderPace(detail){
 latestPace=detail;
 const delta=Number(detail.delta)||0,isBest=Boolean(detail.isBest),label=detail.label||'CHECKPOINT';
 const stateText=isBest?'BEST SPLIT':(delta<0?`${Math.abs(delta).toFixed(1)}s AHEAD OF BEST SPLIT`:`${delta.toFixed(1)}s BEHIND BEST SPLIT`);
 paceChip.textContent=`PACE · ${stateText}`;
 paceChip.hidden=false;
 paceChip.classList.toggle('ahead',!isBest&&delta<0);
 paceChip.classList.toggle('behind',!isBest&&delta>=0);
 paceChip.classList.toggle('best',isBest);
 paceChip.setAttribute('aria-label',isBest?`${label}. New best split.`:`${label}. ${Math.abs(delta).toFixed(1)} seconds ${delta<0?'ahead of':'behind'} best split.`);
}
addEventListener('jumprunnercheckpointsplit',e=>{if(e.detail)renderPace(e.detail);});
const paceUpdate=update;
update=function(dt){paceUpdate(dt);if(!paceChip.hidden)paceChip.classList.toggle('boss',typeof boss!=='undefined'&&boss.active&&!boss.dead);};
const paceReset=resetRun;
resetRun=function(){clearPace();paceReset();};
addEventListener('jumprunnerpause',()=>paceChip.hidden=true);
addEventListener('jumprunnerresume',()=>{if(latestPace&&state==='play')paceChip.hidden=false;});
