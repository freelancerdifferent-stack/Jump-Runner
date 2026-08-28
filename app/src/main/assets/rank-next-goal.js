'use strict';
// Results coaching: turn rank grades into one concise, actionable replay target.
const baseRankGoalShowResult=showResult;
showResult=function(win){
  baseRankGoalShowResult(win);
  if(!win)return;
  const actions=panel.querySelector('.actions');
  if(!actions)return;
  const currentRank=crystals>=26&&time<34?'S':crystals>=22?'A':crystals>=16?'B':'C';
  const target=document.createElement('div');
  target.className='legend';
  target.setAttribute('aria-label','Rank progression target');
  let copy='';
  if(currentRank==='C')copy=`NEXT RANK · COLLECT ${Math.max(0,16-crystals)} MORE CRYSTALS`;
  else if(currentRank==='B')copy=`NEXT RANK · COLLECT ${Math.max(0,22-crystals)} MORE CRYSTALS`;
  else if(currentRank==='A'){
    const crystalGap=Math.max(0,26-crystals);
    const timeGap=Math.max(0,time-33.9);
    if(crystalGap>0&&timeGap>0)copy=`S RANK · +${crystalGap} CRYSTALS · ${timeGap.toFixed(1)}s FASTER`;
    else if(crystalGap>0)copy=`S RANK · COLLECT ${crystalGap} MORE CRYSTALS`;
    else copy=`S RANK · FINISH ${timeGap.toFixed(1)}s FASTER`;
  } else copy='MAX RANK · SKYLINE MASTERED';
  target.innerHTML=`<span>${copy}</span>`;
  actions.before(target);
};
