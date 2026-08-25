'use strict';
(()=>{
  let jump=false,dash=false,lastPad=false;
  function key(type,code){window.dispatchEvent(new KeyboardEvent(type,{code,bubbles:true,cancelable:true}))}
  function poll(){const pads=navigator.getGamepads?navigator.getGamepads():[];const p=Array.from(pads||[]).find(Boolean);if(p){const j=!!(p.buttons[0]?.pressed||p.buttons[1]?.pressed||p.buttons[12]?.pressed);const d=!!(p.buttons[2]?.pressed||p.buttons[3]?.pressed||p.buttons[5]?.pressed);if(j&&!jump)key('keydown','Space');if(!j&&jump)key('keyup','Space');if(d&&!dash)key('keydown','KeyX');jump=j;dash=d;if(!lastPad)window.dispatchEvent(new CustomEvent('jumprunnergamepad',{detail:{connected:true,id:String(p.id||'controller')}}));lastPad=true}else if(lastPad){if(jump)key('keyup','Space');jump=dash=false;lastPad=false;window.dispatchEvent(new CustomEvent('jumprunnergamepad',{detail:{connected:false}}))}requestAnimationFrame(poll)}
  addEventListener('gamepadconnected',()=>{lastPad=false});
  addEventListener('gamepaddisconnected',()=>{lastPad=true});
  requestAnimationFrame(poll);
})();
