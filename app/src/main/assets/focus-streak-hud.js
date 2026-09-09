'use strict';
// Replay clarity: keep the active coached-focus streak visible and show progress toward the next mastery target.
(()=>{
 const KEY='jr_focus_recovery_streak',MILESTONES=[{value:3,label:'LOCKED IN'},{value:5,label:'ON FIRE'},{value:8,label:'APEX FOCUS'}];
 let chip=null;
 const style=document.createElement('style');
 style.textContent='.focus-streak-hud{position:fixed;z-index:18;left:50%;top:max(48px,calc(env(safe-area-inset-top) + 42px));transform:translateX(-50%);pointer-events:none;padding:4px 9px 7px;border:1px solid #74f7c538;border-radius:999px;background:#07120ea8;color:#9dffe0;font:900 8px/1.15 system-ui;letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 18px #0005;opacity:.86;white-space:nowrap}.focus-streak-hud.is-milestone{border-color:#ffd86b52;background:#171408b5;color:#ffe9a6}.focus-streak-hud .focus-next{margin-left:7px;padding-left:7px;border-left:1px solid currentColor;opacity:.62;font-size:.88em}.focus-streak-hud .focus-meter{position:absolute;left:10px;right:10px;bottom:3px;height:2px;border-radius:2px;background:#ffffff18;overflow:hidden}.focus-streak-hud .focus-meter-fill{display:block;height:100%;width:var(--focus-progress,0%);border-radius:inherit;background:currentColor;opacity:.75;transition:width .24s ease}.focus-streak-hud.is-complete{padding-bottom:4px}.focus-streak-hud.is-complete .focus-next,.focus-streak-hud.is-complete .focus-meter{display:none}.focus-streak-hud[hidden]{display:none}@media(max-height:390px){.focus-streak-hud{top:max(38px,calc(env(safe-area-inset-top) + 32px));font-size:7px;padding:3px 8px 6px}.focus-streak-hud .focus-next{margin-left:5px;padding-left:5px}.focus-streak-hud .focus-meter{left:9px;right:9px;bottom:2px}.focus-streak-hud.is-complete{padding-bottom:3px}}';
 document.head.appendChild(style);
 function read(){try{return Math.max(0,Math.floor(Number(localStorage.getItem(KEY))||0))}catch{return 0}}
 function milestone(v){let found=null;for(const item of MILESTONES){if(v>=item.value)found=item;}return found}
 function nextMilestone(v){for(const item of MILESTONES){if(v<item.value)return item;}return null}
 function previousTarget(v){let previous=0;for(const item of MILESTONES){if(v>=item.value)previous=item.value;else break;}return previous}
 function ensure(){if(chip)return chip;chip=document.createElement('div');chip.className='focus-streak-hud';chip.setAttribute('aria-hidden','true');document.body.appendChild(chip);return chip}
 function refresh(){const el=ensure(),value=read(),active=state==='play'&&!paused&&value>0;if(!active){el.hidden=true;return;}const mark=milestone(value),next=nextMilestone(value);el.hidden=false;el.className='focus-streak-hud'+(mark?' is-milestone':'')+(next?'':' is-complete');const lead=mark?`${mark.label} · FOCUS ×${value}`:`FOCUS ×${value}`;if(!next){el.textContent=lead;return;}const remaining=next.value-value,previous=previousTarget(value),span=Math.max(1,next.value-previous),progress=Math.max(0,Math.min(1,(value-previous)/span));el.style.setProperty('--focus-progress',`${Math.round(progress*100)}%`);el.innerHTML=`${lead}<span class="focus-next">${remaining} TO ${next.label}</span><span class="focus-meter"><span class="focus-meter-fill"></span></span>`;}
 addEventListener('jumprunnerfocusresolved',()=>setTimeout(refresh,0));
 addEventListener('jumprunnerpause',refresh);addEventListener('jumprunnerresume',refresh);addEventListener('jumprunnerresult',refresh);
 const baseReset=resetRun;resetRun=function(){baseReset();setTimeout(refresh,0);};
 const baseMenu=showMenu;showMenu=function(){baseMenu();refresh();};
 setTimeout(refresh,0);
})();
