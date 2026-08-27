'use strict';
// Lightweight procedural SFX + optional haptics. No external audio assets or network access.
function readAudioSetting(key,fallback=true){try{const value=localStorage.getItem(key);return value===null?fallback:value!=='0';}catch(_){return fallback;}}
function writeAudioSetting(key,enabled){try{localStorage.setItem(key,enabled?'1':'0');return true;}catch(_){return false;}}
let jrAudioEnabled=readAudioSetting('jr_audio',true),jrHapticsEnabled=readAudioSetting('jr_haptics',true);
let jrAudioCtx=null,jrAudioUnlocked=false;
function ensureAudio(){if(!jrAudioEnabled)return null;if(!jrAudioCtx){const C=window.AudioContext||window.webkitAudioContext;if(C)jrAudioCtx=new C();}if(jrAudioCtx&&jrAudioCtx.state==='suspended'&&document.visibilityState!=='hidden')jrAudioCtx.resume().catch(()=>{});return jrAudioCtx;}
function unlockAudio(){jrAudioUnlocked=true;ensureAudio();}
function suspendAudio(){if(jrAudioCtx&&jrAudioCtx.state==='running')jrAudioCtx.suspend().catch(()=>{});}
function resumeAudio(){if(!jrAudioEnabled||!jrAudioUnlocked||document.visibilityState==='hidden')return;if(jrAudioCtx&&jrAudioCtx.state==='suspended')jrAudioCtx.resume().catch(()=>{});}
function tone(freq=440,dur=.06,vol=.035,type='sine',slide=0){const a=ensureAudio();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime;o.type=type;o.frequency.setValueAtTime(freq,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,freq+slide),t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+dur+.01);}
function chord(notes,dur=.12,vol=.025,type='triangle'){notes.forEach((n,i)=>setTimeout(()=>tone(n,dur,vol,type),i*22));}
function haptic(pattern){if(!jrHapticsEnabled||!navigator.vibrate)return;try{navigator.vibrate(pattern);}catch(_){}}
function sfxJump(){tone(430,.07,.03,'triangle',180);haptic(10);}
function sfxDash(){tone(190,.09,.04,'sawtooth',520);haptic(18);}
function sfxCrystal(){tone(690,.055,.024,'sine',160);}
function sfxHit(){tone(150,.11,.045,'square',-70);haptic([35,20,30]);}
function sfxEnemy(){chord([310,440,620],.07,.028,'triangle');haptic(18);}
function sfxGate(){chord([440,554,659],.16,.026,'sine');haptic([12,25,18]);}
function sfxBossHit(){chord([220,330,494],.1,.035,'sawtooth');haptic(28);}
function sfxBossCoreOpen(){chord([523,659,784],.075,.022,'sine');haptic([10,28,16]);}
function sfxWin(){chord([392,523,659,784],.2,.035,'triangle');haptic([20,30,20,30,45]);}
const baseAudioJump=inputJump,baseAudioDash=inputDash,baseAudioDrone=defeatDrone,baseAudioShow=showResult;
inputJump=function(down){if(down&&state==='play'&&player.jumpBuffer<=0)sfxJump();baseAudioJump(down);};
inputDash=function(){const ready=state==='play'&&player.dashCd<=0;baseAudioDash();if(ready)sfxDash();};
defeatDrone=function(i,d,stomp){baseAudioDrone(i,d,stomp);sfxEnemy();};
showResult=function(win){baseAudioShow(win);if(win)sfxWin();};
if(typeof activateCheckpoint==='function'){const b=activateCheckpoint;activateCheckpoint=function(i){const prev=activeCheckpoint;b(i);if(activeCheckpoint>prev)sfxGate();};}
if(typeof applyDamage==='function'){const b=applyDamage;applyDamage=function(reason){const before=health;b(reason);if(health<before)sfxHit();};}
if(typeof hitBoss==='function'){const b=hitBoss;hitBoss=function(stomp){const before=boss.hp;b(stomp);if(boss.hp<before){sfxBossHit();if(boss.dead)chord([262,330,392,523,659],.22,.04,'triangle');}};}
// Crystal pickup feedback and a single non-visual cue when each Sentinel core window opens.
const baseAudioUpdate=update;let lastAudioCrystals=crystals,lastBossCoreOpen=false;
update=function(dt){
 const before=crystals;baseAudioUpdate(dt);if(crystals>before)sfxCrystal();lastAudioCrystals=crystals;
 const coreOpen=state==='play'&&typeof boss!=='undefined'&&boss.active&&!boss.dead&&boss.coreOpen;
 if(coreOpen&&!lastBossCoreOpen)sfxBossCoreOpen();
 lastBossCoreOpen=coreOpen;
};
function addAudioMenuControls(){const actions=panel&&panel.querySelector('.actions');if(!actions||document.getElementById('audioToggle'))return;const a=document.createElement('button');a.className='btn alt';a.id='audioToggle';a.textContent='SOUND '+(jrAudioEnabled?'ON':'OFF');a.setAttribute('aria-pressed',String(jrAudioEnabled));a.onclick=()=>{jrAudioEnabled=!jrAudioEnabled;writeAudioSetting('jr_audio',jrAudioEnabled);a.textContent='SOUND '+(jrAudioEnabled?'ON':'OFF');a.setAttribute('aria-pressed',String(jrAudioEnabled));if(jrAudioEnabled){unlockAudio();tone(520,.08,.03,'triangle',140);}else suspendAudio();};const h=document.createElement('button');h.className='btn alt';h.id='hapticToggle';h.textContent='HAPTICS '+(jrHapticsEnabled?'ON':'OFF');h.setAttribute('aria-pressed',String(jrHapticsEnabled));h.onclick=()=>{jrHapticsEnabled=!jrHapticsEnabled;writeAudioSetting('jr_haptics',jrHapticsEnabled);h.textContent='HAPTICS '+(jrHapticsEnabled?'ON':'OFF');h.setAttribute('aria-pressed',String(jrHapticsEnabled));if(jrHapticsEnabled)haptic(20);};actions.append(a,h);}
const baseAudioMenu=showMenu;showMenu=function(){baseAudioMenu();addAudioMenuControls();};
addEventListener('pointerdown',unlockAudio,{once:true,passive:true});addEventListener('keydown',unlockAudio,{once:true});
addEventListener('jumprunnerpause',suspendAudio);addEventListener('jumprunnerresume',resumeAudio);
addEventListener('pagehide',suspendAudio);addEventListener('pageshow',resumeAudio);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')suspendAudio();else resumeAudio();});
