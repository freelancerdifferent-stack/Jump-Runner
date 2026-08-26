'use strict';
// Accessibility + performance layer. Preferences stay fully offline and must never block launch.
const a11yKey='jr_accessibility_v1';
const a11yDefaults={reducedMotion:false,highContrast:false,largeControls:false,lowEffects:false};
function normalizeA11y(value){
  if(!value||typeof value!=='object'||Array.isArray(value))return Object.assign({},a11yDefaults);
  return {
    reducedMotion:!!value.reducedMotion,
    highContrast:!!value.highContrast,
    largeControls:!!value.largeControls,
    lowEffects:!!value.lowEffects
  };
}
function readStoredA11y(){
  try{
    const raw=localStorage.getItem(a11yKey);
    if(raw===null)return{found:false,value:Object.assign({},a11yDefaults)};
    return{found:true,value:normalizeA11y(JSON.parse(raw))};
  }catch(_){
    return{found:false,value:Object.assign({},a11yDefaults)};
  }
}
function writeStoredA11y(value){
  try{localStorage.setItem(a11yKey,JSON.stringify(normalizeA11y(value)));return true;}
  catch(_){return false;}
}
const a11yStored=readStoredA11y();
const a11y=a11yStored.value;
function applyA11y(){
  document.documentElement.classList.toggle('reduced-motion',!!a11y.reducedMotion);
  document.documentElement.classList.toggle('high-contrast',!!a11y.highContrast);
  document.documentElement.classList.toggle('large-controls',!!a11y.largeControls);
  document.documentElement.classList.toggle('low-effects',!!a11y.lowEffects);
}
function saveA11y(){writeStoredA11y(a11y);applyA11y();}
applyA11y();

const baseA11yBurst=burst;
burst=function(x,y,color,n=12,power=180){
  if(a11y.lowEffects)n=Math.min(n,6);
  if(a11y.reducedMotion)power*=.55;
  baseA11yBurst(x,y,color,n,power);
};

const baseA11yShowMenu=showMenu;
showMenu=function(){
  baseA11yShowMenu();
  const actions=panel.querySelector('.actions');
  if(!actions)return;
  const settings=document.createElement('button');settings.className='btn alt';settings.id='accessibilityBtn';settings.textContent='ACCESSIBILITY';actions.appendChild(settings);
  settings.onclick=()=>{
    panel.innerHTML=`<div class="eyebrow">PLAYER COMFORT</div><h1>ACCESS <em>OPTIONS</em></h1><div class="sub">Tune visual intensity and controls. All settings are stored only on this device.</div><div class="settings-grid"><button class="btn alt" data-a11y="reducedMotion">REDUCED MOTION · ${a11y.reducedMotion?'ON':'OFF'}</button><button class="btn alt" data-a11y="highContrast">HIGH CONTRAST · ${a11y.highContrast?'ON':'OFF'}</button><button class="btn alt" data-a11y="largeControls">LARGE CONTROLS · ${a11y.largeControls?'ON':'OFF'}</button><button class="btn alt" data-a11y="lowEffects">LOW EFFECTS · ${a11y.lowEffects?'ON':'OFF'}</button></div><div class="actions"><button class="btn" id="accessBack">BACK</button></div>`;
    panel.querySelectorAll('[data-a11y]').forEach(btn=>{const k=btn.dataset.a11y;btn.setAttribute('aria-pressed',String(!!a11y[k]));btn.onclick=()=>{a11y[k]=!a11y[k];saveA11y();showMenu();document.getElementById('accessibilityBtn').click();};});
    document.getElementById('accessBack').onclick=showMenu;
  };
};

// Respect OS reduced-motion preference on first launch without overriding an explicit valid saved choice.
if(!a11yStored.found&&typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches){a11y.reducedMotion=true;a11y.lowEffects=true;saveA11y();}
showMenu();
