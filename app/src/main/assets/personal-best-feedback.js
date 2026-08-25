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
  card.setAttribute('role','status');
  card.setAttribute('aria-live','polite');
  card.setAttribute('aria-atomic','true');
  const badges=[];
  const announcements=[];
  if(newHighScore){
    badges.push(`<span>NEW HIGH SCORE · ${String(Math.floor(score)).padStart(6,'0')}</span>`);
    announcements.push(`New high score ${Math.floor(score)}`);
  }
  if(newFastest){
    badges.push(`<span>NEW FASTEST · ${time.toFixed(1)}s</span>`);
    announcements.push(`New fastest time ${time.toFixed(1)} seconds`);
  }
  card.innerHTML=badges.join('');
  card.setAttribute('aria-label',announcements.join('. ')+'.');
  actions.before(card);
};
