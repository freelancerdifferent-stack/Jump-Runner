'use strict';
// Completionist mastery: persist clears that collect every crystal and defeat every patrol drone.
const CLEAN_SWEEP_STORAGE_KEY='jr_clean_sweep_clears';
function storedCleanSweeps(){
  const value=Number(localStorage.getItem(CLEAN_SWEEP_STORAGE_KEY)||0);
  return Number.isFinite(value)&&value>0?Math.floor(value):0;
}
function recordCleanSweep(){
  const total=storedCleanSweeps()+1;
  localStorage.setItem(CLEAN_SWEEP_STORAGE_KEY,String(total));
  return total;
}
function showCleanSweepsOnMenu(){
  const total=storedCleanSweeps();
  if(!total)return;
  const actions=panel.querySelector('.actions');
  if(!actions||panel.querySelector('[data-clean-sweeps]'))return;
  const badge=document.createElement('div');
  badge.className='legend';
  badge.setAttribute('data-clean-sweeps',String(total));
  badge.setAttribute('aria-label',`${total} clean sweep Skyline Trial clears`);
  badge.innerHTML=`<span>CLEAN SWEEPS · ${total}</span><span>ALL CRYSTALS · ALL DRONES</span>`;
  actions.before(badge);
}
const baseCleanSweepShowMenu=showMenu;
showMenu=function(){baseCleanSweepShowMenu();showCleanSweepsOnMenu();};
const baseCleanSweepShowResult=showResult;
showResult=function(win){
  const cleanSweep=Boolean(win)&&crystals===totalCrystals&&defeated.size===drones.length;
  baseCleanSweepShowResult(win);
  if(!cleanSweep)return;
  const total=recordCleanSweep();
  const actions=panel.querySelector('.actions');
  if(!actions)return;
  const note=document.createElement('div');
  note.className='legend';
  note.setAttribute('role','status');
  note.setAttribute('aria-live','polite');
  note.setAttribute('aria-atomic','true');
  note.innerHTML=`<span>CLEAN SWEEP · ${crystals}/${totalCrystals} CRYSTALS</span><span>${defeated.size}/${drones.length} DRONES · TOTAL ${total}</span>`;
  actions.before(note);
};
