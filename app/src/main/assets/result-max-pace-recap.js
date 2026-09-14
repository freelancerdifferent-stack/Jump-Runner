'use strict';
// Replay-value polish: recap the run's sustained automatic max-pace hold on the result panel.
(()=>{
 const style=document.createElement('style');
 style.textContent='.result-max-pace-recap{display:grid;grid-template-columns:1fr auto;gap:7px 10px;margin:8px 0 2px;padding:8px 10px;border:1px solid #ffd86b2e;border-radius:12px;background:#0715228c;color:#fff3cf;font:800 9px/1.2 system-ui;letter-spacing:.07em}.result-max-pace-recap strong{color:#ffd86b;font-size:12px;white-space:nowrap}.result-max-pace-recap.is-record{border-color:#74f7c54a}.result-max-pace-recap.is-record strong{color:#74f7c5}.result-max-pace-recap .result-max-pace-note{font-size:8px;opacity:.68;letter-spacing:.05em;white-space:nowrap;text-align:right}.result-max-pace-meter{grid-column:1/-1;height:4px;border-radius:99px;background:#ffffff14;overflow:hidden}.result-max-pace-meter>i{display:block;height:100%;width:var(--pace-progress,0%);border-radius:inherit;background:linear-gradient(90deg,#69edff,#ffd86b);transition:width .28s ease}.result-max-pace-recap.is-record .result-max-pace-meter>i{background:linear-gradient(90deg,#69edff,#74f7c5)}.result-max-pace-progress{grid-column:1/-1;font:700 7px/1 system-ui;letter-spacing:.08em;opacity:.58;text-align:right}@media(prefers-reduced-motion:reduce){.result-max-pace-meter>i{transition:none}}@media(max-height:390px){.result-max-pace-recap{margin-top:5px;padding:6px 8px;font-size:8px;gap:5px 8px}.result-max-pace-recap strong{font-size:10px}.result-max-pace-recap .result-max-pace-note{font-size:7px}.result-max-pace-progress{font-size:6px}}';
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
  const progressBase=Math.max(.05,best);
  const progress=Math.max(0,Math.min(1,held/progressBase));
  const progressPct=Math.round(progress*100);
  const card=document.createElement('div');card.className='result-max-pace-recap'+(record?' is-record':'');card.setAttribute('role','status');card.setAttribute('aria-live','polite');card.setAttribute('aria-atomic','true');
  const label=document.createElement('span');label.textContent='RUN MAX PACE HOLD';
  const value=document.createElement('strong');value.textContent=held.toFixed(1)+'s';
  const note=document.createElement('span');note.className='result-max-pace-note';note.textContent=record?'NEW RECORD':matched?'MATCHED BEST':gap.toFixed(1)+'s SHORT';
  const meter=document.createElement('span');meter.className='result-max-pace-meter';meter.setAttribute('aria-hidden','true');meter.style.setProperty('--pace-progress',progressPct+'%');meter.appendChild(document.createElement('i'));
  const progressText=document.createElement('span');progressText.className='result-max-pace-progress';progressText.textContent=(record||matched?'100':String(progressPct))+'% OF BEST';
  card.setAttribute('aria-label',record?`New maximum pace hold record: ${held.toFixed(1)} seconds.`:matched?`Maximum pace held for ${held.toFixed(1)} seconds this run, matching your personal best.`:`Maximum pace held for ${held.toFixed(1)} seconds this run. ${gap.toFixed(1)} seconds short of your ${best.toFixed(1)} second personal best. ${progressPct} percent of your best.`);
  card.append(label,value,note,meter,progressText);
  const actions=panel.querySelector('.actions');if(actions)actions.insertAdjacentElement('beforebegin',card);else panel.appendChild(card);
 }
 addEventListener('jumprunnerresult',decorateResult);
})();
