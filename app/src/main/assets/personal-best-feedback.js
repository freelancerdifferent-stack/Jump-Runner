'use strict';
// Personal-best celebration: rewards improvement without changing scoring or run rules.
const basePersonalBestShowResult=showResult;
showResult=function(win){
  const previousBest=best;
  const previousTime=bestTime;
  basePersonalBestShowResult(win);
  if(!win)return;
  const newHighScore=Math.floor(score)>previousBest;
  const newFastest=!previousTime||time<previousTime;
  if(!newHighScore&&!newFastest)return;
  const actions=panel.querySelector('.actions');
  if(!actions)return;
  const card=document.createElement('div');
  card.className='legend';
  card.setAttribute('aria-live','polite');
  const badges=[];
  if(newHighScore)badges.push(`<span>NEW HIGH SCORE · ${String(Math.floor(score)).padStart(6,'0')}</span>`);
  if(newFastest)badges.push(`<span>NEW FASTEST · ${time.toFixed(1)}s</span>`);
  card.innerHTML=badges.join('');
  actions.before(card);
};
