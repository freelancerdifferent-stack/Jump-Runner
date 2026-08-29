'use strict';
// Mastery polish: celebrate and persist damage-free successful clears without changing score or rank rules.
const FLAWLESS_CLEARS_STORAGE_KEY='jr_flawless_clears';
function storedFlawlessClears(){
  const value=Number(localStorage.getItem(FLAWLESS_CLEARS_STORAGE_KEY)||0);
  return Number.isFinite(value)&&value>0?Math.floor(value):0;
}
function recordFlawlessClear(){
  const total=storedFlawlessClears()+1;
  localStorage.setItem(FLAWLESS_CLEARS_STORAGE_KEY,String(total));
  return total;
}
function showFlawlessClearsOnMenu(){
  const total=storedFlawlessClears();
  if(!total)return;
  const actions=panel.querySelector('.actions');
  if(!actions||panel.querySelector('[data-flawless-clears]'))return;
  const badge=document.createElement('div');
  badge.className='legend';
  badge.dataset.flawlessClears=String(total);
  badge.setAttribute('aria-label',`${total} flawless Skyline Trial clears`);
  badge.innerHTML=`<span>FLAWLESS CLEARS · ${total}</span><span>NO INTEGRITY LOST</span>`;
  actions.before(badge);
}
const baseFlawlessShowMenu=showMenu;
showMenu=function(){baseFlawlessShowMenu();showFlawlessClearsOnMenu();};
const baseFlawlessShowResult=showResult;
showResult=function(win){
  const flawless=Boolean(win)&&health===maxHealth;
  baseFlawlessShowResult(win);
  if(!flawless)return;
  const total=recordFlawlessClear();
  const actions=panel.querySelector('.actions');
  if(!actions)return;
  const note=document.createElement('div');
  note.className='legend';
  note.setAttribute('role','status');
  note.setAttribute('aria-live','polite');
  note.setAttribute('aria-atomic','true');
  note.innerHTML=`<span>FLAWLESS CLEAR · INTEGRITY ${maxHealth}/${maxHealth}</span><span>TOTAL · ${total}</span>`;
  actions.before(note);
};
