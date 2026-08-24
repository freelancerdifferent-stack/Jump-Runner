'use strict';
// Persistent mastery layer: gives every successful run long-term meaning without affecting monetization.
const MASTERY_KEY='jr_mastery_v1';
let mastery=(()=>{try{return JSON.parse(localStorage.getItem(MASTERY_KEY)||'null')||{wins:0,totalCrystals:0,bossClears:0,sRanks:0,bestScore:0,bestTime:0,medals:{}}}catch{return{wins:0,totalCrystals:0,bossClears:0,sRanks:0,bestScore:0,bestTime:0,medals:{}}}})();
function saveMastery(){localStorage.setItem(MASTERY_KEY,JSON.stringify(mastery));}
function masteryLevel(){return Math.min(99,1+Math.floor((mastery.wins*120+mastery.totalCrystals*5+mastery.bossClears*180+mastery.sRanks*250)/350));}
function medalCount(){return Object.values(mastery.medals).filter(Boolean).length;}
function updateMedals(rank){
  mastery.medals.firstClear=mastery.wins>=1;
  mastery.medals.crystalHunter=mastery.totalCrystals>=100;
  mastery.medals.droneBreaker=(mastery.medals.droneBreaker||0)+defeated.size;
  mastery.medals.droneAce=mastery.medals.droneBreaker>=30;
  mastery.medals.sentinel=mastery.bossClears>=1;
  mastery.medals.speed=time>0&&time<30||mastery.medals.speed;
  mastery.medals.perfectCrystals=crystals===totalCrystals||mastery.medals.perfectCrystals;
  mastery.medals.sRank=rank==='S'||mastery.medals.sRank;
}
const baseMasteryShowMenu=showMenu,baseMasteryShowResult=showResult;
showMenu=function(){
  baseMasteryShowMenu();
  const actions=panel.querySelector('.actions');
  if(!actions)return;
  const card=document.createElement('div');card.className='legend';
  card.innerHTML=`<span>MASTERY LV ${masteryLevel()}</span><span>${mastery.wins} CLEARS</span><span>${medalCount()}/6 MEDALS</span>`;
  actions.after(card);
};
showResult=function(win){
  let rank='—';
  if(win)rank=crystals>=26&&time<34?'S':crystals>=22?'A':crystals>=16?'B':'C';
  baseMasteryShowResult(win);
  if(!win)return;
  mastery.wins++;
  mastery.totalCrystals+=crystals;
  mastery.bossClears+=typeof bossDefeated!=='undefined'&&bossDefeated?1:0;
  mastery.sRanks+=rank==='S'?1:0;
  mastery.bestScore=Math.max(mastery.bestScore,Math.floor(score));
  mastery.bestTime=!mastery.bestTime?time:Math.min(mastery.bestTime,time);
  updateMedals(rank);saveMastery();
  const actions=panel.querySelector('.actions');
  if(actions){const card=document.createElement('div');card.className='legend';card.innerHTML=`<span>MASTERY LV ${masteryLevel()}</span><span>${medalCount()}/6 MEDALS</span><span>${mastery.wins} TOTAL CLEARS</span>`;actions.after(card);}
};
