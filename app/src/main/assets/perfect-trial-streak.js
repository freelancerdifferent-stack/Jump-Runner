'use strict';
// Apex consistency: track consecutive perfect clears without changing gameplay or scoring.
const PERFECT_STREAK_STORAGE_KEY='jr_perfect_trial_streak';
const PERFECT_STREAK_BEST_STORAGE_KEY='jr_perfect_trial_best_streak';
function storedPerfectStreak(){
  const value=Number(localStorage.getItem(PERFECT_STREAK_STORAGE_KEY)||0);
  return Number.isFinite(value)&&value>0?Math.floor(value):0;
}
function storedBestPerfectStreak(){
  const value=Number(localStorage.getItem(PERFECT_STREAK_BEST_STORAGE_KEY)||0);
  return Number.isFinite(value)&&value>0?Math.floor(value):0;
}
function savePerfectStreak(current,best){
  localStorage.setItem(PERFECT_STREAK_STORAGE_KEY,String(Math.max(0,current)));
  localStorage.setItem(PERFECT_STREAK_BEST_STORAGE_KEY,String(Math.max(0,best)));
}
function showPerfectStreakOnMenu(){
  const current=storedPerfectStreak(),best=storedBestPerfectStreak();
  if(!current&&!best)return;
  const actions=panel.querySelector('.actions');
  if(!actions||panel.querySelector('[data-perfect-streak]'))return;
  const badge=document.createElement('div');
  badge.className='legend';
  badge.dataset.perfectStreak=String(current);
  badge.setAttribute('aria-label',`Perfect trial streak ${current}. Best perfect trial streak ${best}.`);
  badge.innerHTML=`<span>PERFECT STREAK · ${current}</span><span>BEST · ${best}</span>`;
  actions.before(badge);
}
const basePerfectStreakShowMenu=showMenu;
showMenu=function(){basePerfectStreakShowMenu();showPerfectStreakOnMenu();};
const basePerfectStreakShowResult=showResult;
showResult=function(win){
  const perfect=Boolean(win)&&health===maxHealth&&crystals===totalCrystals&&defeated.size===drones.length&&time<34;
  const previousBest=storedBestPerfectStreak();
  let current=perfect?storedPerfectStreak()+1:0;
  const best=Math.max(previousBest,current);
  savePerfectStreak(current,best);
  basePerfectStreakShowResult(win);
  if(!perfect||current<2)return;
  const actions=panel.querySelector('.actions');
  if(!actions)return;
  const note=document.createElement('div');
  note.className='legend';
  note.setAttribute('role','status');
  note.setAttribute('aria-live','polite');
  note.setAttribute('aria-atomic','true');
  const record=current>previousBest;
  note.innerHTML=`<span>PERFECT STREAK · ${current}</span><span>${record?'NEW STREAK RECORD':'BEST '+best}</span>`;
  actions.before(note);
};
