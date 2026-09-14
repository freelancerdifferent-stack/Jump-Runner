'use strict';
// Replay-value polish: recap the run's sustained automatic max-pace hold on the result panel.
(()=>{
 const style=document.createElement('style');
 style.textContent='.result-max-pace-recap{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 0 2px;padding:8px 10px;border:1px solid #ffd86b2e;border-radius:12px;background:#0715228c;color:#fff3cf;font:800 9px/1.2 system-ui;letter-spacing:.07em}.result-max-pace-recap strong{color:#ffd86b;font-size:12px;white-space:nowrap}.result-max-pace-recap.is-record{border-color:#74f7c54a}.result-max-pace-recap.is-record strong{color:#74f7c5}.result-max-pace-recap .result-max-pace-note{font-size:8px;opacity:.68;letter-spacing:.05em;white-space:nowrap}@media(max-height:390px){.result-max-pace-recap{margin-top:5px;padding:6px 8px;font-size:8px}.result-max-pace-recap strong{font-size:10px}.result-max-pace-recap .result-max-pace-note{font-size:7px}}';
 document.head.appendChild(style);
 function boundedRunHold(){
  if(typeof speedFxMaxHeld==='undefined')return 0;
  const value=Number(speedFxMaxHeld);
  return Number.isFinite(value)?Math.max(0,Math.min(99.9,value)):0;
 }
 function decorateResult(){
  if(typeof panel==='undefined'||!panel)return;
  const old=panel.querySelector('.result-max-pace-recap');if(old)old.remove();
  const held=boundedRunHold();
  if(held<.05)return;
  const record=typeof speedFxRecordCelebrated!=='undefined'&&Boolean(speedFxRecordCelebrated);
  const best=typeof speedFxBestHeld!=='undefined'&&Number.isFinite(Number(speedFxBestHeld))?Math.max(0,Math.min(99.9,Number(speedFxBestHeld))):held;
  const gap=Math.max(0,best-held);
  const matched=!record&&gap<.05;
  const card=document.createElement('div');card.className='result-max-pace-recap'+(record?' is-record':'');card.setAttribute('role','status');card.setAttribute('aria-live','polite');card.setAttribute('aria-atomic','true');
  const label=document.createElement('span');label.textContent='RUN MAX PACE HOLD';
  const value=document.createElement('strong');value.textContent=held.toFixed(1)+'s';
  const note=document.createElement('span');note.className='result-max-pace-note';note.textContent=record?'NEW RECORD':matched?'MATCHED BEST':gap.toFixed(1)+'s SHORT';
  card.setAttribute('aria-label',record?`New maximum pace hold record: ${held.toFixed(1)} seconds.`:matched?`Maximum pace held for ${held.toFixed(1)} seconds this run, matching your personal best.`:`Maximum pace held for ${held.toFixed(1)} seconds this run. ${gap.toFixed(1)} seconds short of your ${best.toFixed(1)} second personal best.`);
  card.append(label,value,note);
  const actions=panel.querySelector('.actions');if(actions)actions.insertAdjacentElement('beforebegin',card);else panel.appendChild(card);
 }
 addEventListener('jumprunnerresult',decorateResult);
})();
