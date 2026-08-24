'use strict';
// Final chase boss: layered after core gameplay, checkpoints, health and biome visuals.
const boss={active:false,dead:false,hp:5,maxHp:5,x:7040,y:238,t:0,shot:0,hitCd:0};
let bossShots=[];
const baseBossReset=resetRun,baseBossUpdate=update,baseBossDraw=drawWorld,baseBossShowResult=showResult;
function bossRect(){return{x:boss.x-34,y:boss.y-28,w:68,h:56};}
function resetBoss(){boss.active=false;boss.dead=false;boss.hp=boss.maxHp;boss.t=0;boss.shot=.7;boss.hitCd=0;bossShots=[];}
function hitBoss(stomp){if(boss.dead||boss.hitCd>0)return;boss.hp--;boss.hitCd=.38;score+=stomp?1250:1000;flow=Math.min(8,flow+2);flowTimer=3.2;shake=Math.max(shake,12);burst(boss.x,boss.y,'#ffd86b',28,260);if(stomp){player.vy=-610;player.onGround=false;}if(boss.hp<=0){boss.dead=true;boss.active=false;bossShots=[];score+=5000;flow=8;flowTimer=4;shake=18;burst(boss.x,boss.y,'#74f7c5',54,320);}}
function updateBoss(dt){
 if(state!=='play'||boss.dead)return;
 if(!boss.active&&player.x>=6350)boss.active=true;
 if(!boss.active)return;
 boss.t+=dt;boss.hitCd=Math.max(0,boss.hitCd-dt);
 boss.x=Math.max(player.x+235,7040);boss.y=225+Math.sin(boss.t*2.3)*82;
 boss.shot-=dt;if(boss.shot<=0){boss.shot=Math.max(.55,1.25-(boss.maxHp-boss.hp)*.12);const sx=boss.x-30,sy=boss.y,dx=player.x+player.w/2-sx,dy=player.y+player.h/2-sy,l=Math.hypot(dx,dy)||1;bossShots.push({x:sx,y:sy,vx:dx/l*420,vy:dy/l*420,life:3.2});}
 for(const s of bossShots){s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;const pr={x:player.x+6,y:player.y+5,w:player.w-12,h:player.h-7};if(s.life>0&&overlap(pr,{x:s.x-7,y:s.y-7,w:14,h:14})){s.life=0;kill('The Sky Sentinel pulse hit your Integrity.');}}
 bossShots=bossShots.filter(s=>s.life>0);
 const br=bossRect(),pr={x:player.x+6,y:player.y+5,w:player.w-12,h:player.h-7};if(overlap(pr,br)){const stomp=player.vy>120&&player.y+player.h-8<br.y+14;if(player.dash>0||stomp)hitBoss(stomp);else kill('The Sky Sentinel intercepted your run.');}
}
function drawBoss(){if(!boss.active&&!boss.dead)return;ctx.save();if(!boss.dead){const x=boss.x-cam,y=boss.y;ctx.translate(x,y);ctx.rotate(Math.sin(boss.t*3)*.08);ctx.shadowBlur=24;ctx.shadowColor='#ff6d88';ctx.fillStyle='#1a2036';ctx.beginPath();ctx.arc(0,0,34,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ffd86b';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,25,boss.t,boss.t+Math.PI*1.45);ctx.stroke();ctx.fillStyle='#ff6d88';ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fill();ctx.setTransform(1,0,0,1,0,0);const bw=240,bx=VW/2-bw/2;ctx.globalAlpha=.95;ctx.fillStyle='#09111ecc';ctx.fillRect(bx,54,bw,24);ctx.fillStyle='#ff6d88';ctx.fillRect(bx+4,58,(bw-8)*(boss.hp/boss.maxHp),7);ctx.fillStyle='#fff';ctx.font='800 10px system-ui';ctx.textAlign='center';ctx.fillText('SKY SENTINEL · '+boss.hp+'/'+boss.maxHp,VW/2,74);}ctx.restore();ctx.save();ctx.fillStyle='#ffd86b';for(const s of bossShots){ctx.beginPath();ctx.arc(s.x-cam,s.y,7,0,Math.PI*2);ctx.fill();}ctx.restore();}
resetRun=function(){resetBoss();baseBossReset();};
update=function(dt){baseBossUpdate(dt);updateBoss(dt);};
drawWorld=function(){baseBossDraw();drawBoss();};
showResult=function(win){if(win&&!boss.dead){state='play';overlay.classList.add('hidden');deathReason='';player.x=Math.min(player.x,7700);player.inv=Math.max(player.inv,.6);last=performance.now();return;}baseBossShowResult(win);};
