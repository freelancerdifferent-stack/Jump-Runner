'use strict';
// Replay clarity: keep the active coached-focus streak visible without changing gameplay.
(()=>{
 const KEY='jr_focus_recovery_streak',MILESTONES=[{value:3,label:'LOCKED IN'},{value:5,label:'ON FIRE'},{value:8,label:'APEX FOCUS'}];
 let chip=null;
 const style=document.createElement('style');
 style.textContent='.focus-streak-hud{position:fixed;z-index:18;left:50%;top:max(48px,calc(env(safe-area-inset-top) + 42px));transform:translateX(-50%);pointer-events:none;padding:4px 9px;border:1px solid #74f7c538;border-radius:999px;background:#07120ea8;color:#9dffe0;font:900 8px/1.15 system-ui;letter-spacing:.1em;text-transform:uppercase;box-shadow:0 5px 18px #0005;opacity:.86}.focus-streak-hud.is-milestone{border-color:#ffd86b52;background:#171408b5;color:#ffe9a6}.focus-streak-hud[hidden]{display:none}@media(max-height:390px){.focus-streak-hud{top:max(38px,calc(env(safe-area-inset-top) + 32px));font-size:7px;padding:3px 8px}}';
 document.head.appendChild(style);
 function read(){try{return Math.max(0,Math.floor(Number(localStorage.getItem(KEY))||0))}catch{return 0}}
 function milestone(v){let found=null;for(const item of MILESTONES){if(v>=item.value)found=item;}return found}
 function ensure(){if(chip)return chip;chip=document.createElement('div');chip.className='focus-streak-hud';chip.setAttribute('aria-hidden','true');document.body.appendChild(chip);return chip}
 function refresh(){const el=ensure(),value=read(),active=state==='play'&&!paused&&value>0;if(!active){el.hidden=true;return;}const mark=milestone(value);el.hidden=false;el.className='focus-streak-hud'+(mark?' is-milestone':'');el.textContent=mark?`${mark.label} · FOCUS ×${value}`:`FOCUS ×${value}`;}
 addEventListener('jumprunnerfocusresolved',()=>setTimeout(refresh,0));
 addEventListener('jumprunnerpause',refresh);addEventListener('jumprunnerresume',refresh);addEventListener('jumprunnerresult',refresh);
 const baseReset=resetRun;resetRun=function(){baseReset();setTimeout(refresh,0);};
 const baseMenu=showMenu;showMenu=function(){baseMenu();refresh();};
 setTimeout(refresh,0);
})();
