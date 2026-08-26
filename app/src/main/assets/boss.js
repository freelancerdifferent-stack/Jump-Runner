'use strict';
// Final chase boss: designed for the two-button auto-run control scheme.
// DASH OR STOMP TO BREAK ITS CORE remains the encounter contract; the core now opens on reachable passes.
const boss={active:false,dead:false,hp:5,maxHp:5,x:7040,y:238,t:0,shot:0,hitCd:0,intro:0,flash:0,victory:0,coreOpen:false,passSpent:false};
let bossShots=[];
const BOSS_ARENA_LIMIT=7680;
const BOSS_VICTORY_GRACE=1.4;
const baseBossReset=resetRun,baseBossUpdate=update,baseBossDraw=drawWorld,baseBossShowResult=showResult;
function bossRect(){return{x:boss.x-34,y:boss.y-28,w:68,h:56};}
function resetBoss(){boss.active=false;boss.dead=false;boss.hp=boss.maxHp;boss.t=0;boss.shot=.7;boss.hitCd=0;boss.intro=0;boss.flash=0;boss.victory=0;boss.coreOpen=false;boss.passSpent=false;bossShots=[];}
function activateBoss(){boss.active=true;boss.intro=1.75;boss.shot=1.25;boss.t=0;boss.passSpent=false;shake=Math.max(shake,5);burst(player.x+260,220,'#ff6d88',14,120);}
function hitBoss(stomp){if(boss.dead||boss.hitCd>0||boss.passSpent)return;boss.hp--;boss.hitCd=.48;boss.flash=.24;boss.coreOpen=false;boss.passSpent=true;score+=stomp?1250:1000;flow=Math.min(8,flow+2);flowTimer=3.2;shake=Math.max(shake,12);burst(boss.x,boss.y,'#ffd86b',28,260);if(stomp){player.vy=-610;player.onGround=false;}if(boss.hp<=0){boss.dead=true;boss.active=false;bossShots=[];boss.victory=1.6;player.inv=Math.max(player.inv,BOSS_VICTORY_GRACE);score+=5000;flow=8;flowTimer=4;shake=18;burst(boss.x,boss.y,'#74f7c5',54,320);}}
function updateBoss(dt){
 if(state!=='play')return;
 boss.flash=Math.max(0,boss.flash-dt);boss.victory=Math.max(0,boss.victory-dt);
 if(boss.dead)return;
 if(!boss.active&&player.x>=6350)activateBoss();
 if(!boss.active)return;
 player.x=Math.min(player.x,BOSS_ARENA_LIMIT);
 boss.t+=dt;boss.hitCd=Math.max(0,boss.hitCd-dt);boss.intro=Math.max(0,boss.intro-dt);
 const approach=(Math.sin(boss.t*1.45-Math.PI/2)+1)*.5;
 const lead=105+approach*185;
 boss.x=player.x+lead;
 const patrolY=285+Math.sin(boss.t*2.15)*70;
 const attackLaneY=340+Math.sin(boss.t*4.3)*18;
 const laneMix=Math.max(0,Math.min(1,(175-lead)/25));
 boss.y=patrolY+(attackLaneY-patrolY)*laneMix;
 if(lead>=165)boss.passSpent=false;
 boss.coreOpen=boss.intro<=0&&boss.hitCd<=0&&!boss.passSpent&&lead<150;
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
function drawBoss(){
 if(!boss.active&&!boss.dead&&boss.victory<=0)return;
 ctx.save();
 if(!boss.dead){const x=boss.x-cam,y=boss.y;ctx.translate(x,y);ctx.rotate(Math.sin(boss.t*3)*.08);ctx.shadowBlur=boss.coreOpen?38:(boss.flash>0?34:24);ctx.shadowColor=boss.coreOpen?'#74f7c5':(boss.flash>0?'#ffffff':'#ff6d88');ctx.fillStyle=boss.flash>0?'#fff3d4':'#1a2036';ctx.beginPath();ctx.arc(0,0,34,0,Math.PI*2);ctx.fill();ctx.strokeStyle=boss.coreOpen?'#74f7c5':'#ffd86b';ctx.lineWidth=boss.coreOpen?7:5;ctx.beginPath();ctx.arc(0,0,25,boss.t,boss.t+Math.PI*1.45);ctx.stroke();ctx.fillStyle=boss.coreOpen?'#74f7c5':'#ff6d88';ctx.beginPath();ctx.arc(0,0,boss.coreOpen?12:9,0,Math.PI*2);ctx.fill();ctx.setTransform(1,0,0,1,0,0);const bw=240,bx=VW/2-bw/2;ctx.globalAlpha=.95;ctx.fillStyle='#09111ecc';ctx.fillRect(bx,54,bw,24);ctx.fillStyle='#2c2031';ctx.fillRect(bx+4,58,bw-8,7);ctx.fillStyle='#ff6d88';ctx.fillRect(bx+4,58,(bw-8)*(boss.hp/boss.maxHp),7);ctx.fillStyle='#fff';ctx.font='800 10px system-ui';ctx.textAlign='center';ctx.fillText('SKY SENTINEL · '+boss.hp+'/'+boss.maxHp,VW/2,74);if(boss.coreOpen){ctx.fillStyle='#74f7c5';ctx.font='900 13px system-ui';ctx.fillText('CORE OPEN · DASH NOW',VW/2,96);}else if(boss.active&&boss.intro<=0&&!boss.passSpent){const approach=(Math.sin(boss.t*1.45-Math.PI/2)+1)*.5,readiness=Math.max(0,Math.min(1,(1-approach)*1.35));ctx.fillStyle='#0b1724dd';ctx.fillRect(VW/2-90,88,180,18);ctx.fillStyle='#ffd86b';ctx.fillRect(VW/2-86,92,172*readiness,5);ctx.fillStyle='#d9e5f2';ctx.font='800 9px system-ui';ctx.fillText(readiness>.58?'CORE CHARGING · GET READY':'CORE SHIELDED',VW/2,104);}}
 ctx.restore();ctx.save();ctx.fillStyle='#ffd86b';for(const s of bossShots){const px=s.x-cam,py=s.y;ctx.globalAlpha=.22;ctx.beginPath();ctx.arc(px-s.vx*.035,py-s.vy*.035,11,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fill();}ctx.restore();drawBossBanner();
}
resetRun=function(){resetBoss();baseBossReset();};
update=function(dt){baseBossUpdate(dt);updateBoss(dt);};
drawWorld=function(){baseBossDraw();drawBoss();};
showResult=function(win){if(win&&!boss.dead){state='play';overlay.classList.add('hidden');deathReason='';player.x=Math.min(player.x,BOSS_ARENA_LIMIT);player.inv=Math.max(player.inv,.6);last=performance.now();return;}baseBossShowResult(win);};