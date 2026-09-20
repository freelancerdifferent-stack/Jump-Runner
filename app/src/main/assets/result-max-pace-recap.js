'use strict';
// Replay-value polish: recap the run's sustained automatic max-pace hold on the result panel.
(()=>{
 const style=document.createElement('style');
 style.textContent='.result-max-pace-recap{display:grid;grid-template-columns:1fr auto;gap:7px 10px;margin:8px 0 2px;padding:8px 10px;border:1px solid #ffd86b2e;border-radius:12px;background:#0715228c;color:#fff3cf;font:800 9px/1.2 system-ui;letter-spacing:.07em}.result-max-pace-recap strong{color:#ffd86b;font-size:12px;white-space:nowrap}.result-max-pace-recap.is-record{border-color:#74f7c54a}.result-max-pace-recap.is-record strong{color:#74f7c5}.result-max-pace-recap .result-max-pace-note{font-size:8px;opacity:.68;letter-spacing:.05em;white-space:nowrap;text-align:right}.result-max-pace-meta{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:8px;font:700 7px/1 system-ui;letter-spacing:.08em;opacity:.62}.result-max-pace-best{color:#fff3cf;white-space:nowrap}.result-max-pace-meter{grid-column:1/-1;position:relative;height:4px;margin-top:7px;border-radius:99px;background:#ffffff14;overflow:visible}.result-max-pace-meter>i{display:block;height:100%;width:var(--pace-progress,0%);border-radius:inherit;background:linear-gradient(90deg,#69edff,#ffd86b);transition:width .28s ease}.result-max-pace-marker{position:absolute;left:var(--pace-next-target,100%);top:-2px;width:2px;height:8px;border-radius:2px;background:#fff3cf;box-shadow:0 0 5px #ffd86b99;transform:translateX(-1px);opacity:.82}.result-max-pace-marker::after{content:attr(data-grade);position:absolute;right:0;bottom:10px;transform:translateX(50%);font:900 6px/1 system-ui;letter-spacing:.08em;color:#fff3cf;white-space:nowrap;text-shadow:0 1px 4px #07101e}.result-max-pace-recap.is-record .result-max-pace-meter>i{background:linear-gradient(90deg,#69edff,#74f7c5)}.result-max-pace-progress{white-space:nowrap;text-align:right}.result-max-pace-grade{grid-column:1/-1;display:flex;justify-content:flex-end;gap:8px;font:900 7px/1 system-ui;letter-spacing:.12em;color:#9eb4c8}.result-max-pace-grade.close{color:#ffd86b}.result-max-pace-grade.elite{color:#74f7c5}.result-max-pace-next{opacity:.68;color:#d8e4ef;white-space:nowrap}@media(prefers-reduced-motion:reduce){.result-max-pace-meter>i{transition:none}}@media(max-height:390px){.result-max-pace-recap{margin-top:5px;padding:6px 8px;font-size:8px;gap:5px 8px}.result-max-pace-recap strong{font-size:10px}.result-max-pace-recap .result-max-pace-note{font-size:7px}.result-max-pace-meta,.result-max-pace-grade{font-size:6px}.result-max-pace-meter{margin-top:6px}.result-max-pace-marker::after{font-size:5px}}';
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
  const grade=record||matched||progressPct>=100?'ELITE':progressPct>=90?'CLOSE':'BUILDING';
  const nextTarget=grade==='BUILDING'?best*.9:grade==='CLOSE'?best:held;
  const nextGap=Math.max(0,nextTarget-held);
  const nextTargetPct=grade==='BUILDING'?90:100;
  const nextTargetGrade=grade==='BUILDING'?'CLOSE':'ELITE';
  const nextGrade=grade==='BUILDING'?'NEXT · CLOSE +'+nextGap.toFixed(1)+'s':grade==='CLOSE'?'NEXT · ELITE +'+nextGap.toFixed(1)+'s':'TOP PACE GRADE';
  const card=document.createElement('div');card.className='result-max-pace-recap'+(record?' is-record':'');card.setAttribute('role','status');card.setAttribute('aria-live','polite');card.setAttribute('aria-atomic','true');
  const label=document.createElement('span');label.textContent='RUN MAX PACE HOLD';
  const value=document.createElement('strong');value.textContent=held.toFixed(1)+'s';
  const note=document.createElement('span');note.className='result-max-pace-note';note.textContent=record?'NEW RECORD':matched?'MATCHED BEST':gap.toFixed(1)+'s SHORT';
  const meter=document.createElement('span');meter.className='result-max-pace-meter';meter.setAttribute('aria-hidden','true');meter.style.setProperty('--pace-progress',progressPct+'%');meter.style.setProperty('--pace-next-target',nextTargetPct+'%');meter.appendChild(document.createElement('i'));if(grade!=='ELITE'){const marker=document.createElement('b');marker.className='result-max-pace-marker';marker.dataset.grade=nextTargetGrade;meter.appendChild(marker);}
  const meta=document.createElement('span');meta.className='result-max-pace-meta';
  const bestText=document.createElement('span');bestText.className='result-max-pace-best';bestText.textContent='BEST '+best.toFixed(1)+'s';
  const progressText=document.createElement('span');progressText.className='result-max-pace-progress';progressText.textContent=(record||matched?'100':String(progressPct))+'% OF BEST';
  const gradeText=document.createElement('span');gradeText.className='result-max-pace-grade '+grade.toLowerCase();
  const gradeLabel=document.createElement('span');gradeLabel.textContent='PACE GRADE · '+grade;
  const nextLabel=document.createElement('span');nextLabel.className='result-max-pace-next';nextLabel.textContent=nextGrade;
  gradeText.append(gradeLabel,nextLabel);meta.append(bestText,progressText);
  const coaching=grade==='BUILDING'?` Next pace grade: Close, ${nextGap.toFixed(1)} seconds more.`:grade==='CLOSE'?` Next pace grade: Elite, ${nextGap.toFixed(1)} seconds more.`:' Top pace grade achieved.';
  card.setAttribute('aria-label',(record?`New maximum pace hold record: ${held.toFixed(1)} seconds. Personal best ${best.toFixed(1)} seconds. Pace grade ${grade}.`:matched?`Maximum pace held for ${held.toFixed(1)} seconds this run, matching your ${best.toFixed(1)} second personal best. Pace grade ${grade}.`:`Maximum pace held for ${held.toFixed(1)} seconds this run. ${gap.toFixed(1)} seconds short of your ${best.toFixed(1)} second personal best. ${progressPct} percent of your best. Pace grade ${grade}.`)+coaching);
  card.append(label,value,note,meter,meta,gradeText);
  const actions=panel.querySelector('.actions');if(actions)actions.insertAdjacentElement('beforebegin',card);else panel.appendChild(card);
 }
 addEventListener('jumprunnerresult',decorateResult);
})();
