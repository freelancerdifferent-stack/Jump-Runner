'use strict';
// Lightweight mastery loop: remember consecutive successful clears and the player's best clear streak.
const CLEAR_STREAK_STORAGE_KEY='jr_clear_streak';
const BEST_CLEAR_STREAK_STORAGE_KEY='jr_best_clear_streak';
function storedClearStreak(key){
  const value=Number(localStorage.getItem(key)||0);
  return Number.isFinite(value)&&value>0?Math.floor(value):0;
}
function currentClearStreak(){return storedClearStreak(CLEAR_STREAK_STORAGE_KEY);}
function bestClearStreak(){return storedClearStreak(BEST_CLEAR_STREAK_STORAGE_KEY);}
function recordClearStreakWin(){
  const streak=currentClearStreak()+1;
  const previousBest=bestClearStreak();
  const best=Math.max(previousBest,streak);
  localStorage.setItem(CLEAR_STREAK_STORAGE_KEY,String(streak));
  localStorage.setItem(BEST_CLEAR_STREAK_STORAGE_KEY,String(best));
  return{streak,best,isRecord:streak>previousBest};
}
function resetClearStreak(){
  if(currentClearStreak()>0)localStorage.setItem(CLEAR_STREAK_STORAGE_KEY,'0');
}
function showClearStreakOnMenu(){
  const streak=currentClearStreak(),best=bestClearStreak();
  if(!streak&&!best)return;
  const actions=panel.querySelector('.actions');
  if(!actions||panel.querySelector('[data-clear-streak]'))return;
  const badge=document.createElement('div');
  badge.className='legend';
  badge.dataset.clearStreak=String(streak);
  badge.setAttribute('aria-label',`${streak} current clear streak, ${best} best clear streak`);
  badge.innerHTML=`<span>CLEAR STREAK · ${streak}</span><span>BEST STREAK · ${best}</span>`;
  actions.before(badge);
}
const baseClearStreakShowMenu=showMenu;
showMenu=function(){baseClearStreakShowMenu();showClearStreakOnMenu();};
const baseClearStreakShowResult=showResult;
showResult=function(win){
  baseClearStreakShowResult(win);
  if(!win){resetClearStreak();return;}
  const progress=recordClearStreakWin();
  if(!progress.isRecord||progress.streak<2)return;
  const actions=panel.querySelector('.actions');
  if(!actions)return;
  const note=document.createElement('div');
  note.className='legend';
  note.setAttribute('role','status');
  note.setAttribute('aria-live','polite');
  note.setAttribute('aria-atomic','true');
  note.innerHTML=`<span>STREAK RECORD · ${progress.streak} CLEARS</span>`;
  actions.before(note);
};
