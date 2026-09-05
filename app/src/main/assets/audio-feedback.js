'use strict';
(()=>{
  const AudioCtx=window.AudioContext||window.webkitAudioContext;
  const STORAGE_KEY='jr_audio_muted';
  let muted=localStorage.getItem(STORAGE_KEY)==='1';
  let ctx=null,master=null,unlocked=false,lastCrystals=0,lastState='',lastBossHp=null;

  function renderToggle(button){
    if(!button)return;
    button.textContent=muted?'SOUND OFF':'SOUND ON';
    button.setAttribute('aria-pressed',String(muted));
    button.setAttribute('aria-label',muted?'Enable sound effects':'Disable sound effects');
    button.classList.toggle('is-muted',muted);
  }

  function setMuted(next){
    muted=Boolean(next);
    try{localStorage.setItem(STORAGE_KEY,muted?'1':'0')}catch(_){/* preference persistence is optional */}
    if(master)master.gain.value=muted?0:.16;
    renderToggle(document.getElementById('audioToggle'));
  }

  function installToggle(){
    if(document.getElementById('audioToggle'))return;
    const button=document.createElement('button');
    button.id='audioToggle';
    button.className='audio-toggle';
    button.type='button';
    renderToggle(button);
    button.addEventListener('pointerdown',e=>e.stopPropagation(),{passive:true});
    button.addEventListener('click',()=>{
      ensureAudio();
      setMuted(!muted);
    });
    document.body.appendChild(button);
  }

  function ensureAudio(){
    if(!AudioCtx)return;
    try{
      if(!ctx){
        ctx=new AudioCtx();
        master=ctx.createGain();
        master.gain.value=muted?0:.16;
        master.connect(ctx.destination);
      }
      if(ctx.state==='suspended')ctx.resume().catch(()=>{});
      unlocked=true;
    }catch(_){unlocked=false;}
  }

  function tone(freq,duration=.08,type='sine',gain=.16,slide=0){
    if(muted||!unlocked||!ctx||!master)return;
    try{
      const now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();
      o.type=type;o.frequency.setValueAtTime(freq,now);
      if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(40,freq+slide),now+duration);
      g.gain.setValueAtTime(0.0001,now);
      g.gain.exponentialRampToValueAtTime(Math.max(.001,gain),now+.01);
      g.gain.exponentialRampToValueAtTime(.0001,now+duration);
      o.connect(g);g.connect(master);o.start(now);o.stop(now+duration+.02);
    }catch(_){/* audio polish must never affect gameplay */}
  }

  function chord(a,b,d=.12){tone(a,d,'triangle',.12,80);setTimeout(()=>tone(b,d,'sine',.09,120),28);}
  function jump(){tone(420,.09,'triangle',.11,180)}
  function dash(){tone(165,.07,'sawtooth',.08,260);setTimeout(()=>tone(520,.055,'square',.055,140),36)}
  function crystal(){chord(760,1040,.09)}
  function bossHit(){tone(120,.11,'square',.10,-35);setTimeout(()=>tone(680,.07,'triangle',.08,120),24)}
  function fail(){tone(210,.16,'sawtooth',.08,-90)}
  function win(){chord(520,780,.16);setTimeout(()=>tone(1040,.18,'triangle',.10,220),95)}

  installToggle();
  addEventListener('pointerdown',ensureAudio,{passive:true});
  addEventListener('keydown',ensureAudio,{passive:true});

  const jumpBtn=document.getElementById('jumpBtn'),dashBtn=document.getElementById('dashBtn');
  jumpBtn?.addEventListener('pointerdown',jump,{passive:true});
  dashBtn?.addEventListener('pointerdown',dash,{passive:true});
  addEventListener('keydown',e=>{
    if(e.repeat)return;
    if(e.code==='KeyM')setMuted(!muted);
    if(e.code==='Space'||e.code==='ArrowUp')jump();
    if(e.code==='KeyX'||e.code==='ShiftLeft')dash();
  });

  function monitor(){
    try{
      if(typeof crystals!=='undefined'&&crystals>lastCrystals)crystal();
      if(typeof crystals!=='undefined')lastCrystals=crystals;
      if(typeof boss!=='undefined'){
        if(lastBossHp!==null&&boss.hp<lastBossHp)bossHit();
        lastBossHp=boss.hp;
      }
      if(typeof state!=='undefined'){
        if(lastState==='play'&&(state==='dying'||state==='dead'))fail();
        if(lastState!=='win'&&state==='win')win();
        if((state==='menu'||state==='play')&&lastState==='win')lastBossHp=null;
        lastState=state;
      }
    }catch(_){/* optional audio monitor remains fail-safe */}
    requestAnimationFrame(monitor);
  }
  requestAnimationFrame(monitor);
})();
