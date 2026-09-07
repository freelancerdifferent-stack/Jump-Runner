'use strict';
// Lightweight live pace readout for replay value. Does not alter run timing or scoring.
const liveTimer=document.createElement('div');
liveTimer.className='live-run-timer';
liveTimer.setAttribute('role','timer');
liveTimer.setAttribute('aria-label','Elapsed run time');
liveTimer.textContent='0.0s';
document.body.appendChild(liveTimer);
const liveTimerStyle=document.createElement('style');
liveTimerStyle.textContent='.live-run-timer{position:fixed;z-index:5;left:max(18px,calc(env(safe-area-inset-left) + 18px));top:max(92px,calc(env(safe-area-inset-top) + 82px));min-width:66px;padding:5px 10px;border:1px solid #69edff2f;border-radius:999px;background:#071522b8;box-shadow:0 8px 20px #0004;color:#dffbff;font:850 11px/1.2 system-ui;letter-spacing:.08em;text-align:center;pointer-events:none;opacity:.82}.live-run-timer.paused{opacity:.42}.live-run-timer.boss{border-color:#ff6d8855;color:#ffd8df}.live-run-timer.finish{border-color:#74f7c566;color:#74f7c5}@media(max-height:390px){.live-run-timer{top:max(72px,calc(env(safe-area-inset-top) + 62px));left:max(12px,calc(env(safe-area-inset-left) + 12px));font-size:9px;padding:4px 8px;min-width:58px}}@media(prefers-reduced-motion:reduce){.live-run-timer{transition:none}}';
document.head.appendChild(liveTimerStyle);
let timerAccumulator=0,lastAnnouncedSecond=-1;
function refreshLiveTimer(force=false){
 if(!force&&timerAccumulator<.08)return;
 timerAccumulator=0;
 const elapsed=Math.max(0,Number(time)||0);
 liveTimer.textContent=elapsed.toFixed(1)+'s';
 liveTimer.classList.toggle('boss',typeof boss!=='undefined'&&boss.active&&!boss.dead);
 liveTimer.classList.toggle('finish',typeof boss!=='undefined'&&boss.dead);
 const whole=Math.floor(elapsed);
 if(force||whole!==lastAnnouncedSecond){
   lastAnnouncedSecond=whole;
   liveTimer.setAttribute('aria-valuetext',elapsed.toFixed(1)+' seconds elapsed');
 }
}
const liveTimerUpdate=update;
update=function(dt){
 liveTimerUpdate(dt);
 if(state==='play'){timerAccumulator+=dt;refreshLiveTimer(false);}
};
const liveTimerReset=resetRun;
resetRun=function(){timerAccumulator=0;lastAnnouncedSecond=-1;liveTimer.classList.remove('paused','boss','finish');liveTimer.textContent='0.0s';liveTimerReset();refreshLiveTimer(true);};
addEventListener('jumprunnerpause',()=>liveTimer.classList.add('paused'));
addEventListener('jumprunnerresume',()=>{liveTimer.classList.remove('paused');refreshLiveTimer(true);});
refreshLiveTimer(true);
