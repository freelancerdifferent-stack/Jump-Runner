'use strict';
// Lightweight procedural SFX + optional haptics. No external audio assets or network access.
let jrAudioEnabled=localStorage.getItem('jr_audio')!=='0',jrHapticsEnabled=localStorage.getItem('jr_haptics')!=='0';
let jrAudioCtx=null;
function ensureAudio(){if(!jrAudioEnabled)return null;if(!jrAudioCtx){const C=window.AudioContext||window.webkitAudioContext;if(C)jrAudioCtx=new C();}if(jrAudioCtx&&jrAudioCtx.state==='suspended')jrAudioCtx.resume().catch(()=>{});return jrAudioCtx;}
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
function sfxWin(){chord([392,523,659,784],.2,.035,'triangle');haptic([20,30,20,30,45]);}
const baseAudioJump=inputJump,baseAudioDash=inputDash,baseAudioDrone=defeatDrone,baseAudioShow=showResult;
inputJump=function(down){if(down&&state==='play'&&player.jumpBuffer<=0)sfxJump();baseAudioJump(down);};
inputDash=function(){const ready=state==='play'&&player.dashCd<=0;baseAudioDash();if(ready)sfxDash();};
defeatDrone=function(i,d,stomp){baseAudioDrone(i,d,stomp);sfxEnemy();};
showResult=function(win){baseAudioShow(win);if(win)sfxWin();};
if(typeof activateCheckpoint==='function'){const b=activateCheckpoint;activateCheckpoint=function(i){const prev=activeCheckpoint;b(i);if(activeCheckpoint>prev)sfxGate();};}
if(typeof applyDamage==='function'){const b=applyDamage;applyDamage=function(reason){const before=health;b(reason);if(health<before)sfxHit();};}
if(typeof hitBoss==='function'){const b=hitBoss;hitBoss=function(stomp){const before=boss.hp;b(stomp);if(boss.hp<before){sfxBossHit();if(boss.dead)chord([262,330,392,523,659],.22,.04,'triangle');}};}
// Crystal pickup feedback by observing the count after each update.
const baseAudioUpdate=update;let lastAudioCrystals=crystals;
update=function(dt){const before=crystals;baseAudioUpdate(dt);if(crystals>before)sfxCrystal();lastAudioCrystals=crystals;};
function addAudioMenuControls(){const actions=panel&&panel.querySelector('.actions');if(!actions||document.getElementById('audioToggle'))return;const a=document.createElement('button');a.className='btn alt';a.id='audioToggle';a.textContent='SOUND '+(jrAudioEnabled?'ON':'OFF');a.onclick=()=>{jrAudioEnabled=!jrAudioEnabled;localStorage.setItem('jr_audio',jrAudioEnabled?'1':'0');a.textContent='SOUND '+(jrAudioEnabled?'ON':'OFF');if(jrAudioEnabled){ensureAudio();tone(520,.08,.03,'triangle',140);}};const h=document.createElement('button');h.className='btn alt';h.id='hapticToggle';h.textContent='HAPTICS '+(jrHapticsEnabled?'ON':'OFF');h.onclick=()=>{jrHapticsEnabled=!jrHapticsEnabled;localStorage.setItem('jr_haptics',jrHapticsEnabled?'1':'0');h.textContent='HAPTICS '+(jrHapticsEnabled?'ON':'OFF');if(jrHapticsEnabled)haptic(20);};actions.append(a,h);}
const baseAudioMenu=showMenu;showMenu=function(){baseAudioMenu();addAudioMenuControls();};
addEventListener('pointerdown',ensureAudio,{once:true,passive:true});addEventListener('keydown',ensureAudio,{once:true});
