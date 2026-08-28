'use strict';
// Lightweight long-term progression: remember successful Skyline Trial clears beyond the 20-run telemetry window.
const CLEAR_COUNT_STORAGE_KEY='jr_lifetime_clears';
function lifetimeClears(){
  const value=Number(localStorage.getItem(CLEAR_COUNT_STORAGE_KEY)||0);
  return Number.isFinite(value)&&value>0?Math.floor(value):0;
}
function persistLifetimeClear(){
  const next=lifetimeClears()+1;
  localStorage.setItem(CLEAR_COUNT_STORAGE_KEY,String(next));
  return next;
}
function showLifetimeClearsOnMenu(){
  const clears=lifetimeClears();
  if(!clears)return;
  const actions=panel.querySelector('.actions');
  if(!actions||panel.querySelector('[data-lifetime-clears]'))return;
  const badge=document.createElement('div');
  badge.className='legend';
  badge.dataset.lifetimeClears=String(clears);
  badge.setAttribute('aria-label',`${clears} lifetime ${clears===1?'clear':'clears'}`);
  badge.innerHTML=`<span>TRIAL CLEARS · ${clears}</span>`;
  actions.before(badge);
}
const baseLifetimeClearShowMenu=showMenu;
showMenu=function(){baseLifetimeClearShowMenu();showLifetimeClearsOnMenu();};
const baseLifetimeClearShowResult=showResult;
showResult=function(win){
  baseLifetimeClearShowResult(win);
  if(!win)return;
  const clears=persistLifetimeClear();
  if(clears!==1&&clears%5!==0)return;
  const actions=panel.querySelector('.actions');
  if(!actions)return;
  const note=document.createElement('div');
  note.className='legend';
  note.setAttribute('role','status');
  note.setAttribute('aria-live','polite');
  note.setAttribute('aria-atomic','true');
  note.innerHTML=`<span>${clears===1?'FIRST TRIAL CLEAR':`${clears} TRIAL CLEARS`}</span>`;
  actions.before(note);
};
