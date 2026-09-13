'use strict';
// Replay-value polish: keep the latest checkpoint pace delta visible between split toasts.
const paceChip=document.createElement('div');
paceChip.className='checkpoint-pace-chip';
paceChip.setAttribute('role','status');
paceChip.setAttribute('aria-live','polite');
paceChip.setAttribute('aria-atomic','true');
paceChip.hidden=true;
paceChip.innerHTML='<span class="checkpoint-pace-text"></span><i class="checkpoint-pace-meter" aria-hidden="true"><b></b></i>';
document.body.appendChild(paceChip);
const paceText=paceChip.querySelector('.checkpoint-pace-text');
const paceStyle=document.createElement('style');
paceStyle.textContent='.checkpoint-pace-chip{--pace-meter:0;position:fixed;z-index:6;left:50%;top:max(104px,calc(env(safe-area-inset-top) + 86px));transform:translateX(-50%);min-width:176px;padding:5px 11px 7px;border:1px solid #69edff33;border-radius:14px;background:#06121ecc;box-shadow:0 8px 20px #0004;color:#bdefff;font:850 9px/1.2 system-ui;letter-spacing:.1em;text-align:center;pointer-events:none;white-space:nowrap}.checkpoint-pace-chip.ahead{border-color:#74f7c555;color:#74f7c5}.checkpoint-pace-chip.behind{border-color:#ffd86b55;color:#ffd86b}.checkpoint-pace-chip.best{border-color:#8fffe077;color:#8fffe0;box-shadow:0 8px 20px #0004,0 0 15px #74f7c51f}.checkpoint-pace-chip.recovered{animation:pace-recovered .42s ease-out;box-shadow:0 8px 20px #0004,0 0 18px #74f7c52e}.checkpoint-pace-chip.slipped{animation:pace-slipped .36s ease-out;box-shadow:0 8px 20px #0004,0 0 15px #ffd86b24}.checkpoint-pace-chip.boss{top:max(112px,calc(env(safe-area-inset-top) + 94px))}.checkpoint-pace-meter{display:block;position:relative;width:100%;height:3px;margin-top:5px;overflow:hidden;border-radius:99px;background:#ffffff17}.checkpoint-pace-meter::after{content:"";position:absolute;left:50%;top:0;width:1px;height:100%;background:#ffffff4d}.checkpoint-pace-meter b{display:block;width:50%;height:100%;border-radius:inherit;background:#bdefff;transform:scaleX(var(--pace-meter));transform-origin:right center;transition:transform .18s ease,background .18s ease}.checkpoint-pace-chip.ahead .checkpoint-pace-meter b{margin-left:0;background:#74f7c5;transform-origin:right center}.checkpoint-pace-chip.behind .checkpoint-pace-meter b{margin-left:50%;background:#ffd86b;transform-origin:left center}.checkpoint-pace-chip.best .checkpoint-pace-meter b{margin-left:0;width:100%;background:#8fffe0;transform:scaleX(1);transform-origin:center}.checkpoint-pace-chip.neutral .checkpoint-pace-meter b{margin-left:25%;width:50%;background:#bdefff;transform:scaleX(.08);transform-origin:center}@keyframes pace-recovered{0%{transform:translateX(-50%) scale(.96);filter:brightness(1)}45%{transform:translateX(-50%) scale(1.035);filter:brightness(1.2)}100%{transform:translateX(-50%) scale(1);filter:brightness(1)}}@keyframes pace-slipped{0%{transform:translateX(-50%);filter:brightness(1)}45%{transform:translateX(calc(-50% - 3px));filter:brightness(1.12)}100%{transform:translateX(-50%);filter:brightness(1)}}@media(max-height:390px){.checkpoint-pace-chip{top:max(78px,calc(env(safe-area-inset-top) + 66px));min-width:158px;font-size:8px;padding:4px 9px 6px}.checkpoint-pace-chip.boss{top:max(84px,calc(env(safe-area-inset-top) + 72px))}.checkpoint-pace-meter{margin-top:4px}}@media(prefers-reduced-motion:reduce){.checkpoint-pace-meter b{transition:none}.checkpoint-pace-chip.recovered,.checkpoint-pace-chip.slipped{animation:none}}';
document.head.appendChild(paceStyle);
let latestPace=null,previousPaceState=null,transitionTimer=0;
function clearTransitionCue(){if(transitionTimer){clearTimeout(transitionTimer);transitionTimer=0;}paceChip.classList.remove('recovered','slipped');}
function clearPace(){latestPace=null;previousPaceState=null;clearTransitionCue();paceChip.hidden=true;paceChip.classList.remove('ahead','behind','best','neutral','boss');paceChip.style.setProperty('--pace-meter','0');paceChip.removeAttribute('aria-label');if(paceText)paceText.textContent='';}
function renderPace(detail){
 latestPace=detail;
 const delta=Number(detail.delta)||0,isBest=Boolean(detail.isBest),label=detail.label||'CHECKPOINT';
 const currentPaceState=isBest?'best':(delta<-.05?'ahead':(delta>.05?'behind':'neutral'));
 const recovered=previousPaceState==='behind'&&(currentPaceState==='ahead'||currentPaceState==='best');
 const slipped=(previousPaceState==='ahead'||previousPaceState==='best')&&currentPaceState==='behind';
 const stateText=isBest?'BEST SPLIT':(delta<0?`${Math.abs(delta).toFixed(1)}s AHEAD OF BEST SPLIT`:`${delta.toFixed(1)}s BEHIND BEST SPLIT`);
 if(paceText)paceText.textContent=recovered?`PACE RECOVERED · ${stateText}`:(slipped?`PACE SLIPPED · ${stateText}`:`PACE · ${stateText}`);
 const magnitude=Math.min(1,Math.abs(delta)/3);
 paceChip.style.setProperty('--pace-meter',magnitude.toFixed(3));
 paceChip.hidden=false;
 paceChip.classList.toggle('ahead',currentPaceState==='ahead');
 paceChip.classList.toggle('behind',currentPaceState==='behind');
 paceChip.classList.toggle('neutral',currentPaceState==='neutral');
 paceChip.classList.toggle('best',currentPaceState==='best');
 clearTransitionCue();
 if(recovered||slipped){
  void paceChip.offsetWidth;
  paceChip.classList.add(recovered?'recovered':'slipped');
  transitionTimer=setTimeout(()=>{paceChip.classList.remove('recovered','slipped');transitionTimer=0;},520);
 }
 paceChip.setAttribute('aria-label',recovered?(isBest?`${label}. Pace recovered with a new best split.`:`${label}. Pace recovered. ${Math.abs(delta).toFixed(1)} seconds ahead of best split.`):(slipped?`${label}. Pace slipped. ${delta.toFixed(1)} seconds behind best split.`:(isBest?`${label}. New best split.`:`${label}. ${Math.abs(delta).toFixed(1)} seconds ${delta<0?'ahead of':'behind'} best split.`)));
 previousPaceState=currentPaceState;
}
addEventListener('jumprunnercheckpointsplit',e=>{if(e.detail)renderPace(e.detail);});
const paceUpdate=update;
update=function(dt){paceUpdate(dt);if(!paceChip.hidden)paceChip.classList.toggle('boss',typeof boss!=='undefined'&&boss.active&&!boss.dead);};
const paceReset=resetRun;
resetRun=function(){clearPace();paceReset();};
addEventListener('jumprunnerpause',()=>paceChip.hidden=true);
addEventListener('jumprunnerresume',()=>{if(latestPace&&state==='play')paceChip.hidden=false;});
