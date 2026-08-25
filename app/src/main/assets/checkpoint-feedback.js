'use strict';
// Celebration layer for checkpoint milestones and recovery. Keeps checkpoint rules untouched.
const checkpointToast=document.createElement('div');
checkpointToast.className='checkpoint-toast';
checkpointToast.setAttribute('role','status');
checkpointToast.setAttribute('aria-live','polite');
checkpointToast.setAttribute('aria-atomic','true');
checkpointToast.innerHTML='<span class="checkpoint-kicker">CHECKPOINT</span><strong></strong><small>PROGRESS SECURED</small>';
document.body.appendChild(checkpointToast);
const checkpointStyle=document.createElement('style');
checkpointStyle.textContent='.checkpoint-toast{position:fixed;z-index:7;left:50%;top:max(72px,calc(env(safe-area-inset-top) + 54px));transform:translate(-50%,-12px) scale(.96);min-width:190px;padding:9px 22px 10px;border:1px solid #74f7c566;border-radius:14px;background:linear-gradient(180deg,#0c2631e8,#071522e8);box-shadow:0 14px 38px #0007,0 0 24px #74f7c522;text-align:center;pointer-events:none;opacity:0;transition:opacity .18s ease,transform .22s ease}.checkpoint-toast.show{opacity:1;transform:translate(-50%,0) scale(1)}.checkpoint-toast .checkpoint-kicker{display:block;font-size:8px;font-weight:950;letter-spacing:.24em;color:#74f7c5}.checkpoint-toast strong{display:block;margin-top:2px;font-size:18px;letter-spacing:.08em}.checkpoint-toast small{display:block;margin-top:1px;font-size:8px;font-weight:850;letter-spacing:.12em;color:#b8d9dc}.checkpoint-toast.recover{border-color:#69edff66;box-shadow:0 14px 38px #0007,0 0 24px #69edff22}.checkpoint-toast.recover .checkpoint-kicker{color:#69edff}@media(max-height:390px){.checkpoint-toast{top:max(50px,calc(env(safe-area-inset-top) + 38px));padding:6px 18px}.checkpoint-toast strong{font-size:14px}}';
document.head.appendChild(checkpointStyle);
let checkpointToastTimer=0,lastCheckpointSeen=activeCheckpoint;
function showCheckpointToast(label,recovering){
 checkpointToast.classList.toggle('recover',!!recovering);
 checkpointToast.querySelector('.checkpoint-kicker').textContent=recovering?'RECOVERY ONLINE':'CHECKPOINT';
 checkpointToast.querySelector('strong').textContent=label;
 checkpointToast.querySelector('small').textContent=recovering?'RUN RESUMED':'PROGRESS SECURED';
 checkpointToast.setAttribute('aria-label',recovering?'Recovery online. '+label+'. Run resumed.':'Checkpoint. '+label+'. Progress secured.');
 checkpointToast.classList.remove('show');void checkpointToast.offsetWidth;checkpointToast.classList.add('show');checkpointToastTimer=1.65;
}
const checkpointFeedbackUpdate=update;
update=function(dt){
 checkpointFeedbackUpdate(dt);
 if(activeCheckpoint!==lastCheckpointSeen){lastCheckpointSeen=activeCheckpoint;if(activeCheckpoint>=0)showCheckpointToast(checkpointDefs[activeCheckpoint].label,false);}
 if(checkpointToastTimer>0){checkpointToastTimer=Math.max(0,checkpointToastTimer-dt);if(checkpointToastTimer===0)checkpointToast.classList.remove('show');}
};
const checkpointFeedbackRestore=restoreCheckpoint;
restoreCheckpoint=function(){checkpointFeedbackRestore();if(activeCheckpoint>=0)showCheckpointToast(checkpointDefs[activeCheckpoint].label,true);};
const checkpointFeedbackReset=resetRun;
resetRun=function(){lastCheckpointSeen=-1;checkpointToastTimer=0;checkpointToast.classList.remove('show');checkpointToast.removeAttribute('aria-label');checkpointFeedbackReset();};
