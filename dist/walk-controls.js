import * as THREE from 'three';
const poses={
 casal:{position:[19.25,4.45,-8.8],look:[21.2,4.05,-8.8]},
 'closet-casal':{position:[22.0,4.45,-11.95],look:[22.0,4.2,-13.5]},
 'banho-casal':{position:[23.7,4.45,-11.2],look:[25.05,4.05,-12.9]},
 livia:{position:[24.5,4.45,-5.7],look:[23.6,4.0,-7.5]},
 'closet-livia':{position:[21.0,4.45,-5.4],look:[21.0,4.1,-6.9]},
 'banho-livia':{position:[22.8,4.45,-9.65],look:[24.8,4.0,-9.8]},
 hospedes:{position:[20.2,4.45,-2.0],look:[22.5,4.05,-3.15]},
 'banho-hospedes':{position:[24.5,4.45,-2.0],look:[25.1,4.0,-3.65]},
 circulacao:{position:[18.8,4.45,-2.4],look:[18.8,4.4,-6.5]},
 social:{position:[14.2,1.6,-1.5],look:[16.25,1.3,-4.1]},
 jantar:{position:[17.6,1.6,-7.7],look:[15.7,1.3,-9.6]},
 living:{position:[17.6,1.6,-5.5],look:[14.5,1.4,-2.5]},
 gourmet:{position:[21.7,1.6,-15.5],look:[24.4,1.3,-19.8]},
 lazer:{position:[19.8,1.6,-24.4],look:[15.5,1.0,-21.0]}
};
export function createWalkControls({camera,canvas,getModel,onChange}){
 let enabled=false,drag=null,yaw=0,pitch=0,eyeHeight=4.45;
 const velocity=new THREE.Vector3();let fast=false,canJump=false,jumpOffset=0,jumpVelocity=0;
 const keys=new Set(),virtual=new Set(),euler=new THREE.Euler(0,0,0,'YXZ'),forward=new THREE.Vector3(),right=new THREE.Vector3(),direction=new THREE.Vector3(),origin=new THREE.Vector3(),next=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),ray=new THREE.Raycaster();
 const usable=()=>enabled&&canvas.offsetParent!==null&&!document.querySelector('dialog[open]');
 canvas.tabIndex=0;canvas.setAttribute('aria-label','Tour em escala humana. Arraste para olhar e use WASD ou setas para caminhar.');
 function enter(room,floor,characterEye=1.6,allowJump=false){enabled=true;keys.clear();virtual.clear();velocity.set(0,0,0);canJump=allowJump;jumpOffset=0;jumpVelocity=0;const pose=poses[room.id];eyeHeight=(floor==='superior'?2.85:0)+characterEye;camera.fov=68;camera.near=.07;camera.updateProjectionMatrix();if(pose){camera.position.set(pose.position[0],eyeHeight,pose.position[2]);camera.lookAt(new THREE.Vector3(pose.look[0],eyeHeight-.15,pose.look[2]))}else{camera.position.set(room.point[0],eyeHeight,room.point[2]);camera.lookAt(room.point[0],eyeHeight,room.point[2]-2)}euler.setFromQuaternion(camera.quaternion,'YXZ');yaw=euler.y;pitch=euler.x;canvas.focus({preventScroll:true});onChange()}
 function exit(){enabled=false;drag=null;keys.clear();virtual.clear();velocity.set(0,0,0);camera.fov=38;camera.near=.15;camera.updateProjectionMatrix();onChange()}
 const allowed=new Set(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright']);
 function jump(){if(!usable()||!canJump||jumpOffset>0||jumpVelocity>0)return;jumpVelocity=3.5;jumpOffset=.001;onChange()}
 const keydown=e=>{if(!usable()||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;const k=e.key.toLowerCase();if(e.code==='Space'&&canJump){e.preventDefault();if(!e.repeat)jump();return}if(k==='shift'){fast=true;return}if(allowed.has(k)){e.preventDefault();keys.add(k);onChange()}};
 const keyup=e=>{keys.delete(e.key.toLowerCase());if(e.key==='Shift')fast=false};window.addEventListener('keydown',keydown);window.addEventListener('keyup',keyup);window.addEventListener('blur',()=>{keys.clear();virtual.clear();velocity.set(0,0,0);fast=false;drag=null});
 canvas.addEventListener('pointerdown',e=>{if(!usable()||e.button!==0)return;canvas.focus({preventScroll:true});drag={x:e.clientX,y:e.clientY,id:e.pointerId};canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!usable()||!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.x=e.clientX;drag.y=e.clientY;yaw-=dx*.0035;pitch=Math.max(-1.25,Math.min(1.25,pitch-dy*.003));camera.quaternion.setFromEuler(euler.set(pitch,yaw,0,'YXZ'));onChange()});
 const release=()=>{drag=null};canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
 for(const button of document.querySelectorAll('[data-walk]')){button.addEventListener('pointerdown',e=>{if(!usable())return;e.preventDefault();virtual.add(button.dataset.walk);button.setPointerCapture(e.pointerId);onChange()});const stop=()=>virtual.delete(button.dataset.walk);button.addEventListener('pointerup',stop);button.addEventListener('pointercancel',stop);button.addEventListener('lostpointercapture',stop)}
 function update(dt){if(!usable())return false;let x=0,z=0;if(keys.has('w')||keys.has('arrowup')||virtual.has('forward'))z++;if(keys.has('s')||keys.has('arrowdown')||virtual.has('backward'))z--;if(keys.has('a')||keys.has('arrowleft')||virtual.has('left'))x--;if(keys.has('d')||keys.has('arrowright')||virtual.has('right'))x++;camera.getWorldDirection(forward);forward.y=0;forward.normalize();right.crossVectors(forward,up).normalize();direction.copy(forward).multiplyScalar(z).addScaledVector(right,x);if(direction.lengthSq())direction.normalize().multiplyScalar(fast?3.2:1.8);const delta=Math.min(dt,.045);velocity.lerp(direction,1-Math.exp(-16*delta));let jumping=jumpOffset>0||jumpVelocity>0;if(jumping){jumpVelocity-=9.8*delta;jumpOffset=Math.max(0,jumpOffset+jumpVelocity*delta);if(jumpOffset===0)jumpVelocity=0}if(velocity.lengthSq()<.0001){velocity.set(0,0,0);if(!jumping)return false}camera.position.addScaledVector(velocity,delta);camera.position.y=eyeHeight+jumpOffset;onChange();return true}
 return{enter,exit,update,jump,get enabled(){return enabled},get hasInput(){return keys.size>0||virtual.size>0||velocity.lengthSq()>.0001||drag!==null||jumpOffset>0||jumpVelocity>0},get yaw(){return yaw},dispose(){window.removeEventListener('keydown',keydown);window.removeEventListener('keyup',keyup)}};
}
