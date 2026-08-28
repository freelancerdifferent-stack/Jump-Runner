'use strict';
// Personal-best celebration: rewards improvement without changing scoring or run rules.
const basePersonalBestShowResult=showResult;
showResult=function(win){
  const previousBest=best;
  const previousTime=bestTime;
  basePersonalBestShowResult(win);
  if(!win)return;
  const finalScore=Math.floor(score);
  const newHighScore=finalScore>previousBest;
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
    const scoreDelta=previousBest>0?finalScore-previousBest:0;
    const scoreContext=scoreDelta>0?` · +${scoreDelta.toLocaleString('en-US')}`:' · FIRST RECORD';
    badges.push(`<span>NEW HIGH SCORE · ${String(finalScore).padStart(6,'0')}${scoreContext}</span>`);
    announcements.push(`New high score ${finalScore}${scoreDelta>0?`, improved by ${scoreDelta} points`:', first recorded score'}`);
  }
  if(newFastest){
    const timeDelta=previousTime>0?Math.max(0,previousTime-time):0;
    const timeContext=timeDelta>=.05?` · ${timeDelta.toFixed(1)}s FASTER`:' · FIRST CLEAR';
    badges.push(`<span>NEW FASTEST · ${time.toFixed(1)}s${timeContext}</span>`);
    announcements.push(`New fastest time ${time.toFixed(1)} seconds${timeDelta>=.05?`, ${timeDelta.toFixed(1)} seconds faster`:', first recorded clear'}`);
  }
  card.innerHTML=badges.join('');
  card.setAttribute('aria-label',announcements.join('. ')+'.');
  actions.before(card);
};
