'use strict';
// Progression polish: persist the highest earned rank and surface it on the home screen.
const RANK_ORDER={C:1,B:2,A:3,S:4};
const RANK_STORAGE_KEY='jr_best_rank';
function earnedRank(){return crystals>=26&&time<34?'S':crystals>=22?'A':crystals>=16?'B':'C';}
function bestStoredRank(){const value=localStorage.getItem(RANK_STORAGE_KEY)||'';return RANK_ORDER[value]?value:'';}
function persistBestRank(rank){const current=bestStoredRank();if(!current||RANK_ORDER[rank]>RANK_ORDER[current]){localStorage.setItem(RANK_STORAGE_KEY,rank);return rank;}return current;}
function showBestRankOnMenu(){
  const rank=bestStoredRank();
  if(!rank)return;
  const actions=panel.querySelector('.actions');
  if(!actions||panel.querySelector('[data-best-rank]'))return;
  const badge=document.createElement('div');
  badge.className='legend';
  badge.dataset.bestRank=rank;
  badge.setAttribute('aria-label',`Best rank ${rank}`);
  badge.innerHTML=`<span>BEST RANK · ${rank}</span>`;
  actions.before(badge);
}
const baseBestRankShowMenu=showMenu;
showMenu=function(){baseBestRankShowMenu();showBestRankOnMenu();};
const baseBestRankShowResult=showResult;
showResult=function(win){
  baseBestRankShowResult(win);
  if(!win)return;
  const rank=earnedRank();
  const previous=bestStoredRank();
  const best=persistBestRank(rank);
  if(previous===best||previous===rank)return;
  const actions=panel.querySelector('.actions');
  if(!actions)return;
  const note=document.createElement('div');
  note.className='legend';
  note.setAttribute('role','status');
  note.setAttribute('aria-live','polite');
  note.setAttribute('aria-atomic','true');
  note.innerHTML=`<span>NEW BEST RANK · ${best}</span>`;
  actions.before(note);
};
