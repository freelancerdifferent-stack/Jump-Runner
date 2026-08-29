'use strict';
// Apex mastery: persist clears that combine completion, survival, and S-rank pace.
const PERFECT_TRIAL_STORAGE_KEY='jr_perfect_trial_clears';
function storedPerfectTrials(){
  const value=Number(localStorage.getItem(PERFECT_TRIAL_STORAGE_KEY)||0);
  return Number.isFinite(value)&&value>0?Math.floor(value):0;
}
function recordPerfectTrial(){
  const total=storedPerfectTrials()+1;
  localStorage.setItem(PERFECT_TRIAL_STORAGE_KEY,String(total));
  return total;
}
function showPerfectTrialsOnMenu(){
  const total=storedPerfectTrials();
  if(!total)return;
  const actions=panel.querySelector('.actions');
  if(!actions||panel.querySelector('[data-perfect-trials]'))return;
  const badge=document.createElement('div');
  badge.className='legend';
  badge.dataset.perfectTrials=String(total);
  badge.setAttribute('aria-label',`${total} perfect Skyline Trial clears`);
  badge.innerHTML=`<span>PERFECT TRIALS · ${total}</span><span>S RANK · FLAWLESS · CLEAN SWEEP</span>`;
  actions.before(badge);
}
const basePerfectTrialShowMenu=showMenu;
showMenu=function(){basePerfectTrialShowMenu();showPerfectTrialsOnMenu();};
const basePerfectTrialShowResult=showResult;
showResult=function(win){
  const perfect=Boolean(win)&&health===maxHealth&&crystals===totalCrystals&&defeated.size===drones.length&&time<34;
  basePerfectTrialShowResult(win);
  if(!perfect)return;
  const total=recordPerfectTrial();
  const actions=panel.querySelector('.actions');
  if(!actions)return;
  const note=document.createElement('div');
  note.className='legend';
  note.setAttribute('role','status');
  note.setAttribute('aria-live','polite');
  note.setAttribute('aria-atomic','true');
  note.innerHTML=`<span>PERFECT TRIAL · S RANK · ${time.toFixed(1)}s</span><span>FLAWLESS · CLEAN SWEEP · TOTAL ${total}</span>`;
  actions.before(note);
};
