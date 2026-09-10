'use strict';
// Final chase boss: designed for the two-button auto-run control scheme.
// DASH OR STOMP TO BREAK ITS CORE remains the encounter contract; the core now opens on reachable passes.
const boss={active:false,dead:false,hp:5,maxHp:5,x:7040,y:238,t:0,shot:0,hitCd:0,intro:0,flash:0,victory:0,coreOpen:false,passSpent:false,recoil:0,arenaPinned:false,missCue:0};
let bossShots=[];
const BOSS_ARENA_LIMIT=7680;
const BOSS_VICTORY_GRACE=1.4;
const BOSS_HIT_GRACE=.42;
const BOSS_HIT_RECOIL=96;
const BOSS_FLOW_HOLD=.22;
const baseBossReset=resetRun,baseBossUpdate=update,baseBossDraw=drawWorld,baseBossShowResult=showResult;
function bossRect(){return{x:boss.x-34,y:boss.y-28,w:68,h:56};}
function resetBoss(){boss.active=false;boss.dead=false;boss.hp=boss.maxHp;boss.t=0;boss.shot=.7;boss.hitCd=0;boss.intro=0;boss.flash=0;boss.victory=0;boss.coreOpen=false;boss.passSpent=false;boss.recoil=0;boss.arenaPinned=false;boss.missCue=0;bossShots=[];}
function activateBoss(){boss.active=true;boss.intro=1.75;boss.shot=1.25;boss.t=0;boss.passSpent=false;boss.recoil=0;boss.arenaPinned=false;boss.missCue=0;shake=Math.max(shake,5);burst(player.x+260,220,'#ff6d88',14,120);}
function hitBoss(stomp){if(boss.dead||boss.hitCd>0||boss.passSpent)return;boss.hp--;boss.hitCd=.48;boss.flash=.24;boss.coreOpen=false;boss.passSpent=true;boss.recoil=BOSS_HIT_RECOIL;boss.missCue=0;player.inv=Math.max(player.inv,BOSS_HIT_GRACE);score+=stomp?1250:1000;flow=Math.min(8,flow+2);flowTimer=3.2;shake=Math.max(shake,12);burst(boss.x,boss.y,'#ffd86b',28,260);if(stomp){player.vy=-610;player.onGround=false;}if(boss.hp<=0){boss.dead=true;boss.active=false;bossShots=[];boss.victory=1.6;player.inv=Math.max(player.inv,BOSS_VICTORY_GRACE);score+=5000;flow=8;flowTimer=4;shake=18;burst(boss.x,boss.y,'#74f7c5',54,320);}}
function updateBoss(dt){
 if(state!=='play')return;
 boss.flash=Math.max(0,boss.flash-dt);boss.victory=Math.max(0,boss.victory-dt);boss.missCue=Math.max(0,boss.missCue-dt);
 if(boss.dead)return;
 if(!boss.active&&player.x>=6350)activateBoss();
 if(!boss.active)return;
 if(player.x>=BOSS_ARENA_LIMIT-1)boss.arenaPinned=true;
 if(boss.arenaPinned){
  player.x=BOSS_ARENA_LIMIT;cam=BOSS_ARENA_LIMIT-210;
  // Base auto-run updates just before the arena clamp. Drop only those forward ghost samples
  // so the stationary combat phase never looks like the runner is still sliding ahead.
  player.trail=player.trail.filter(t=>t.x<=BOSS_ARENA_LIMIT+1);
 }
 else player.x=Math.min(player.x,BOSS_ARENA_LIMIT);
 boss.t+=dt;boss.hitCd=Math.max(0,boss.hitCd-dt);boss.intro=Math.max(0,boss.intro-dt);boss.recoil=Math.max(0,boss.recoil-dt*220);
 const approach=(Math.sin(boss.t*1.45-Math.PI/2)+1)*.5;
 const baseLead=105+approach*185;
 const lead=baseLead+boss.recoil;
 boss.x=player.x+lead;
 const patrolY=285+Math.sin(boss.t*2.15)*70;
 const attackLaneY=340+Math.sin(boss.t*4.3)*18;
 const laneMix=Math.max(0,Math.min(1,(175-baseLead)/25));
 boss.y=patrolY+(attackLaneY-patrolY)*laneMix;
 if(baseLead>=165)boss.passSpent=false;
 const wasCoreOpen=boss.coreOpen;
 boss.coreOpen=boss.intro<=0&&boss.hitCd<=0&&!boss.passSpent&&baseLead<150&&boss.recoil<=0;
 if(wasCoreOpen&&!boss.coreOpen&&!boss.passSpent&&boss.hitCd<=0){boss.missCue=.8;}
 if(boss.intro<=0&&!boss.coreOpen){boss.shot-=dt;if(boss.shot<=0){boss.shot=Math.max(.62,1.35-(boss.maxHp-boss.hp)*.11);const sx=boss.x-30,sy=boss.y,dx=player.x+player.w/2-sx,dy=player.y+player.h/2-sy,l=Math.hypot(dx,dy)||1;bossShots.push({x:sx,y:sy,vx:dx/l*390,vy:dy/l*390,life:3.2,maxLife:3.2});}}
 else if(boss.coreOpen){boss.shot=Math.max(boss.shot,.42);}
 for(const s of bossShots){s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;const pr={x:player.x+6,y:player.y+5,w:player.w-12,h:player.h-7};if(s.life>0&&overlap(pr,{x:s.x-7,y:s.y-7,w:14,h:14})){s.life=0;kill('The Sky Sentinel pulse hit your Integrity.');}}
 bossShots=bossShots.filter(s=>s.life>0);
 const br=bossRect(),pr={x:player.x+6,y:player.y+5,w:player.w-12,h:player.h-7};
 const dx=boss.x-(player.x+player.w),dy=Math.abs((boss.y)-(player.y+player.h*.5));
 const dashStrike=boss.coreOpen&&player.dash>0&&dx<155&&dy<135;
 const stompStrike=boss.coreOpen&&player.vy>120&&dx<120&&dy<120;
 if(dashStrike||stompStrike){hitBoss(stompStrike);}
 else if(overlap(pr,br)){const stomp=player.vy>120&&player.y+player.h-8<br.y+14;if(boss.coreOpen&&(player.dash>0||stomp))hitBoss(stomp);else kill(boss.coreOpen?'The Sky Sentinel intercepted your run.':'The Sentinel core is shielded. Wait for the green opening.');}
}
function drawBossBanner(){
 if(boss.intro<=0&&boss.victory<=0)return;
 ctx.save();ctx.setTransform(1,0,0,1,0,0);
 const intro=boss.intro>0,life=intro?boss.intro:boss.victory,max=intro?1.75:1.6,fade=Math.min(1,life/.28,(max-life)/.22+0.08);
 ctx.globalAlpha=Math.max(0,Math.min(1,fade));ctx.textAlign='center';ctx.fillStyle='#07101edb';ctx.fillRect(VW/2-210,118,420,72);ctx.strokeStyle=intro?'#ff6d88':'#74f7c5';ctx.lineWidth=2;ctx.strokeRect(VW/2-210,118,420,72);ctx.fillStyle='#fff';ctx.font='900 22px system-ui';ctx.fillText(intro?'SKY SENTINEL':'SENTINEL DEFEATED',VW/2,149);ctx.fillStyle=intro?'#ffd86b':'#74f7c5';ctx.font='800 10px system-ui';ctx.fillText(intro?'WAIT FOR CORE GLOW · DASH OR STOMP':'FINISH LINE UNLOCKED',VW/2,171);ctx.restore();
}
function drawBossHealthSegments(bx,bw){
 const gap=5,pad=4,inner=bw-pad*2,segW=(inner-gap*(boss.maxHp-1))/boss.maxHp,y=58,h=7;
 for(let i=0;i<boss.maxHp;i++){
  const x=bx+pad+i*(segW+gap),alive=i<boss.hp;
  ctx.fillStyle=alive?'#ff6d88':'#332033';
  ctx.fillRect(x,y,segW,h);
  if(alive&&boss.flash>0&&i===boss.hp-1){ctx.fillStyle='#fff3d4';ctx.globalAlpha=Math.min(1,boss.flash/.24);ctx.fillRect(x,y,segW,h);ctx.globalAlpha=.95;}
 }
}
function drawBoss(){
 if(!boss.active&&!boss.dead&&boss.victory<=0)return;
 ctx.save();
 if(!boss.dead){const x=boss.x-cam,y=boss.y,phase=boss.t*1.45-Math.PI/2,approach=(Math.sin(phase)+1)*.5,readiness=Math.max(0,Math.min(1,(1-approach)*1.35)),charging=boss.active&&boss.intro<=0&&!boss.coreOpen&&!boss.passSpent&&boss.hitCd<=0&&boss.recoil<=0&&readiness>.58,dashReady=player.dashCd<=.001,windowClosing=boss.coreOpen&&Math.cos(phase)>0&&approach>.12;ctx.translate(x,y);ctx.rotate(Math.sin(boss.t*3)*.08);if(charging){ctx.globalAlpha=.18+.25*readiness;ctx.strokeStyle='#ffd86b';ctx.lineWidth=2.5+readiness*1.5;ctx.beginPath();ctx.arc(0,0,38+readiness*12,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}ctx.shadowBlur=boss.coreOpen?38:(charging?28+readiness*9:(boss.flash>0?34:24));ctx.shadowColor=boss.coreOpen?'#74f7c5':(charging?'#ffd86b':(boss.flash>0?'#ffffff':'#ff6d88'));ctx.fillStyle=boss.flash>0?'#fff3d4':'#1a2036';ctx.beginPath();ctx.arc(0,0,34,0,Math.PI*2);ctx.fill();ctx.strokeStyle=boss.coreOpen?'#74f7c5':'#ffd86b';ctx.lineWidth=boss.coreOpen?7:(charging?6:5);ctx.beginPath();ctx.arc(0,0,25,boss.t,boss.t+Math.PI*1.45);ctx.stroke();ctx.fillStyle=boss.coreOpen?'#74f7c5':(charging?'#ffd86b':'#ff6d88');ctx.beginPath();ctx.arc(0,0,boss.coreOpen?12:(charging?9+readiness*2:9),0,Math.PI*2);ctx.fill();ctx.setTransform(1,0,0,1,0,0);const bw=240,bx=VW/2-bw/2;ctx.globalAlpha=.95;ctx.fillStyle='#09111ecc';ctx.fillRect(bx,54,bw,24);drawBossHealthSegments(bx,bw);ctx.fillStyle='#fff';ctx.font='800 10px system-ui';ctx.textAlign='center';ctx.fillText('SKY SENTINEL · '+boss.hp+'/'+boss.maxHp,VW/2,74);if(boss.coreOpen){ctx.fillStyle=windowClosing?'#ffd86b':'#74f7c5';ctx.font=dashReady?'900 13px system-ui':'900 10px system-ui';ctx.fillText(windowClosing?(dashReady?'CORE CLOSING · DASH NOW':'CORE CLOSING · STOMP NOW'):(dashReady?'CORE OPEN · DASH NOW':'CORE OPEN · STOMP · DASH RECHARGING'),VW/2,96);}else if(boss.missCue>0){ctx.globalAlpha=Math.min(1,boss.missCue/.18);ctx.fillStyle='#0b1724e8';ctx.fillRect(VW/2-112,87,224,22);ctx.fillStyle='#ffd86b';ctx.font='900 10px system-ui';ctx.fillText('WINDOW MISSED · NEXT OPENING',VW/2,102);ctx.globalAlpha=.95;}else if(boss.active&&boss.intro<=0&&!boss.passSpent){ctx.fillStyle='#0b1724dd';ctx.fillRect(VW/2-90,88,180,18);ctx.fillStyle='#ffd86b';ctx.fillRect(VW/2-86,92,172*readiness,5);ctx.fillStyle='#d9e5f2';ctx.font='800 9px system-ui';ctx.fillText(readiness>.58?'CORE CHARGING · GET READY':'CORE SHIELDED',VW/2,104);}}
 ctx.restore();ctx.save();ctx.fillStyle='#ffd86b';for(const s of bossShots){const px=s.x-cam,py=s.y;ctx.globalAlpha=.22;ctx.beginPath();ctx.arc(px-s.vx*.035,py-s.vy*.035,11,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fill();}ctx.restore();drawBossBanner();
}
function holdBossFlowBeforeBaseUpdate(dt){
 if(state==='play'&&boss.active&&!boss.dead&&flow>1&&(boss.arenaPinned||player.x>=BOSS_ARENA_LIMIT-1)){
  // The player cannot advance while the arena is intentionally pinned, so forced waiting
  // for the next vulnerable pass must not erase a Flow streak they earned on the run-in.
  flowTimer=Math.max(flowTimer,dt+BOSS_FLOW_HOLD);
 }
}
resetRun=function(){resetBoss();baseBossReset();};
update=function(dt){holdBossFlowBeforeBaseUpdate(dt);baseBossUpdate(dt);updateBoss(dt);};
drawWorld=function(){baseBossDraw();drawBoss();};
showResult=function(win){if(win&&!boss.dead){state='play';overlay.classList.add('hidden');deathReason='';player.x=Math.min(player.x,BOSS_ARENA_LIMIT);player.inv=Math.max(player.inv,.6);last=performance.now();return;}baseBossShowResult(win);};
window.__jrBoss=boss;
window.__jrGetState=()=>state;
