'use strict';
// Celebrate meaningful consistency milestones without changing scoring or gameplay.
const PERFECT_STREAK_MILESTONES=new Set([3,5,10,20]);
const basePerfectMilestoneShowResult=showResult;
showResult=function(win){
  basePerfectMilestoneShowResult(win);
  if(!win)return;
  const streak=storedPerfectStreak();
  if(!PERFECT_STREAK_MILESTONES.has(streak))return;
  const actions=panel.querySelector('.actions');
  if(!actions||panel.querySelector('[data-perfect-streak-milestone]'))return;
  const note=document.createElement('div');
  note.className='legend';
  note.dataset.perfectStreakMilestone=String(streak);
  note.setAttribute('role','status');
  note.setAttribute('aria-live','polite');
  note.setAttribute('aria-atomic','true');
  const title=streak>=20?'SKYLINE LEGEND':streak>=10?'APEX CONSISTENCY':streak>=5?'PERFECT RHYTHM':'PERFECT MOMENTUM';
  note.innerHTML=`<span>${title}</span><span>${streak} PERFECT CLEARS IN A ROW</span>`;
  actions.before(note);
};
