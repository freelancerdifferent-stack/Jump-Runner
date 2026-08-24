'use strict';
const biomeDefs=[
  {start:0,end:2050,name:'DAWNLINE',tint:'rgba(255,196,112,.055)',accent:'#ffd878'},
  {start:2050,end:4100,name:'NEON HEIGHTS',tint:'rgba(74,240,255,.055)',accent:'#69edff'},
  {start:4100,end:6350,name:'STORMWORKS',tint:'rgba(112,116,255,.065)',accent:'#9ba7ff'},
  {start:6350,end:8200,name:'SKY CITADEL',tint:'rgba(255,94,152,.055)',accent:'#ff7fb4'}
];
let lastBiome=-1,biomeBanner=0;
function currentBiomeIndex(){const x=player.x;for(let i=0;i<biomeDefs.length;i++)if(x>=biomeDefs[i].start&&x<biomeDefs[i].end)return i;return biomeDefs.length-1;}
function updateBiomeAtmosphere(dt){
  if(state!=='play')return;
  const i=currentBiomeIndex();
  if(i!==lastBiome){lastBiome=i;biomeBanner=2.2;}
  biomeBanner=Math.max(0,biomeBanner-dt);
}
function drawBiomeAtmosphere(){
  const b=biomeDefs[Math.max(0,currentBiomeIndex())],x=player.x;
  ctx.save();
  ctx.fillStyle=b.tint;ctx.fillRect(0,0,VW,VH);
  if(x>=2050&&x<4100){
    ctx.globalAlpha=.16;ctx.strokeStyle=b.accent;ctx.lineWidth=1;
    for(let y=96;y<VH;y+=34){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(VW,y);ctx.stroke();}
  }else if(x>=4100&&x<6350){
    ctx.globalAlpha=.24;ctx.strokeStyle='#c8d1ff';ctx.lineWidth=1.4;
    const phase=(time*260)%70;for(let rx=-160;rx<VW+160;rx+=74){ctx.beginPath();ctx.moveTo(rx+phase,-10);ctx.lineTo(rx-70+phase,VH+10);ctx.stroke();}
  }else if(x>=6350){
    ctx.globalAlpha=.16;ctx.strokeStyle=b.accent;ctx.lineWidth=2;
    const phase=(time*120)%120;for(let sx=-120;sx<VW+120;sx+=120){ctx.beginPath();ctx.moveTo(VW/2,VH/2);ctx.lineTo(sx+phase,VH);ctx.stroke();}
  }
  const vignette=ctx.createRadialGradient(VW/2,VH/2,180,VW/2,VH/2,560);vignette.addColorStop(0,'rgba(0,0,0,0)');vignette.addColorStop(1,'rgba(0,0,0,.24)');ctx.fillStyle=vignette;ctx.fillRect(0,0,VW,VH);
  if(biomeBanner>0){const a=Math.min(1,biomeBanner*1.8,2.2-biomeBanner);ctx.globalAlpha=Math.max(0,a);ctx.fillStyle='rgba(4,10,22,.72)';ctx.fillRect(VW/2-150,70,300,48);ctx.fillStyle=b.accent;ctx.font='900 12px system-ui';ctx.textAlign='center';ctx.fillText('SECTOR',VW/2,88);ctx.fillStyle='#fff';ctx.font='900 19px system-ui';ctx.fillText(b.name,VW/2,111);}
  ctx.restore();
}
const biomeBaseUpdate=update;update=function(dt){biomeBaseUpdate(dt);updateBiomeAtmosphere(dt);};
const biomeBaseDrawWorld=typeof drawWorld==='function'?drawWorld:null;if(biomeBaseDrawWorld){drawWorld=function(){biomeBaseDrawWorld();drawBiomeAtmosphere();};}
