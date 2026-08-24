'use strict';
// Optional offline contracts add replay goals without altering the standard run.
const contracts=[
  {id:'standard',name:'STANDARD',desc:'Pure Skyline Trial. Finish the course.',test:()=>state==='win'},
  {id:'velocity',name:'VELOCITY',desc:'Finish in under 37 seconds.',test:()=>state==='win'&&time<37},
  {id:'collector',name:'COLLECTOR',desc:'Finish with at least 26 crystals.',test:()=>state==='win'&&crystals>=26},
  {id:'hunter',name:'HUNTER',desc:'Finish after defeating every patrol drone.',test:()=>state==='win'&&defeated.size>=drones.length},
  {id:'untouched',name:'UNTOUCHED',desc:'Finish with full Integrity.',test:()=>state==='win'&&typeof health!=='undefined'&&health===maxHealth}
];
let activeContract=localStorage.getItem('jr_contract')||'standard';
let contractRecords={};try{contractRecords=JSON.parse(localStorage.getItem('jr_contract_records')||'{}')}catch(e){contractRecords={}}
const baseContractMenu=showMenu,baseContractResult=showResult;
function currentContract(){return contracts.find(c=>c.id===activeContract)||contracts[0]}
function persistContracts(){localStorage.setItem('jr_contract',activeContract);localStorage.setItem('jr_contract_records',JSON.stringify(contractRecords))}
function installContractPicker(){
  if(state!=='menu')return;
  const actions=panel.querySelector('.actions');if(!actions)return;
  let wrap=document.getElementById('contractPicker');if(wrap)return;
  wrap=document.createElement('div');wrap.id='contractPicker';wrap.className='legend';
  wrap.style.cssText='display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px';
  contracts.forEach(c=>{const b=document.createElement('button');b.className='btn alt';b.style.cssText='padding:8px 10px;font-size:11px;min-width:auto';b.textContent=(c.id===activeContract?'◆ ':'')+c.name+(contractRecords[c.id]?' ✓':'');b.title=c.desc;b.onclick=()=>{activeContract=c.id;persistContracts();showMenu()};wrap.appendChild(b)});
  actions.after(wrap);
  const c=currentContract(),hint=document.createElement('div');hint.className='sub';hint.style.cssText='font-size:12px;margin-top:8px';hint.textContent=`CONTRACT · ${c.name} — ${c.desc}`;wrap.after(hint);
}
showMenu=function(){baseContractMenu();installContractPicker();};
showResult=function(win){
  baseContractResult(win);
  if(!win)return;
  const c=currentContract(),passed=!!c.test();
  if(passed){contractRecords[c.id]=(contractRecords[c.id]||0)+1;persistContracts();}
  const sub=panel.querySelector('.sub');if(sub)sub.textContent+=passed?` · ${c.name} contract cleared.`:` · ${c.name} contract missed.`;
  const actions=panel.querySelector('.actions');if(actions){const change=document.createElement('button');change.className='btn alt';change.textContent='CONTRACTS';change.onclick=showMenu;actions.appendChild(change)}
};
