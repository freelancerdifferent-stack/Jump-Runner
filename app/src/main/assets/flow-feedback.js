'use strict';
// Flow feedback: communicates combo build-up without altering scoring or physics.
let flowBannerTimer=0,lastFlowShown=1;
const baseFlowUpdateHud=updateHud;
function announceFlow(level){
  if(level<=1)return;
  flowBannerTimer=.85;
  lastFlowShown=level;
}
updateHud=function(){
  baseFlowUpdateHud();
  if(flowEl){
    flowEl.classList.toggle('flow-hot',flow>=4);
    flowEl.classList.toggle('flow-max',flow>=8);
  }
  if(flow>lastFlowShown)announceFlow(flow);
  if(flow<=1)lastFlowShown=1;
};
const baseFlowDraw=draw;
draw=function(){
  baseFlowDraw();
  if(flowBannerTimer>0&&state==='play'){
    flowBannerTimer=Math.max(0,flowBannerTimer-1/60);
    const a=Math.min(1,flowBannerTimer*3);
    ctx.save();
    ctx.globalAlpha=a;
    ctx.textAlign='center';
    ctx.font='900 16px system-ui';
    ctx.fillStyle=flow>=8?'#ffd86b':'#9eefff';
    ctx.fillText(flow>=8?'MAX FLOW':'FLOW x'+lastFlowShown,VW/2,78);
    ctx.restore();
  }
};
