import * as THREE from 'three';

// Animate the original modeled fronts; the cabinet interiors remain in the house model.
export function createCabinetInteractions({canvas,camera,playerCamera,isActive,onChange}){
 const button=document.getElementById('cabinet-action'),hint=document.getElementById('cabinet-hint');
 const ray=new THREE.Raycaster(),pointer=new THREE.Vector2(),position=new THREE.Vector3(),direction=new THREE.Vector3(),toward=new THREE.Vector3();
 let doors=[],meshes=[],nearest=null,down=null,lastSearch=0,lastLabel='',attachedRoot=null;
 const labels={'closet-casal':'Closet do casal','closet-livia':'Closet da Lívia',livia:'Quarto da Lívia',hospedes:'Quarto de hóspedes'};
 const usable=()=>isActive()&&canvas.offsetParent!==null&&!document.querySelector('dialog[open]');
 function attach(root){
  if(root===attachedRoot)return;attachedRoot=root;
  doors=[];meshes=[];nearest=null;
  root.traverse(node=>{const spec=node.userData.cabinetDoor;if(!spec)return;const door={node,spec,localCenter:new THREE.Vector3(...spec.center).sub(node.position),open:false,animation:null};doors.push(door);node.traverse(child=>{if(child.isMesh){child.userData.interactiveCabinet=door;meshes.push(child)}})});
  lastSearch=0;onChange();
 }
 function show(){
  const active=usable();hint.hidden=!active||!doors.length;button.hidden=!active||!nearest;
  if(!active||!nearest)return;
  const label=`${nearest.open?'Fechar':'Abrir'} armário · E`;
  if(label!==lastLabel){button.textContent=label;lastLabel=label}
  button.setAttribute('aria-label',`${label} — ${labels[nearest.spec.room]||'Armário'}`);button.setAttribute('aria-pressed',String(nearest.open));
 }
 function toggle(door=nearest){
  if(!usable()||!door)return false;
  door.open=!door.open;door.animation={from:door.node.rotation.y,to:door.open?door.spec.angle:0,start:performance.now()};nearest=door;lastLabel='';show();onChange();return true;
 }
 function search(){
  playerCamera.getWorldDirection(direction);let best=null,bestScore=Infinity;
  for(const door of doors){position.copy(door.localCenter);door.node.localToWorld(position);toward.copy(position).sub(playerCamera.position);const distance=toward.length();if(distance>2.6||Math.abs(toward.y)>2.4)continue;const alignment=toward.normalize().dot(direction);if(alignment<.15)continue;const score=distance+(1-alignment)*1.1;if(score<bestScore){best=door;bestScore=score}}
  nearest=best;show();
 }
 function update(now){
  let changing=false;
  for(const door of doors){if(!door.animation)continue;const a=door.animation,t=Math.min(1,(now-a.start)/650),ease=t*t*(3-2*t);door.node.rotation.y=a.from+(a.to-a.from)*ease;door.node.updateMatrixWorld(true);if(t===1)door.animation=null;else changing=true}
  if(now-lastSearch>120){lastSearch=now;if(usable())search();else show()}
  return changing;
 }
 const keydown=e=>{if(e.code!=='KeyE'||e.repeat||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||!usable())return;e.preventDefault();search();toggle()};
 const pointerdown=e=>{down=e.button===0?{x:e.clientX,y:e.clientY,id:e.pointerId}:null};
 const pointerup=e=>{
  const start=down;down=null;if(!start||e.pointerId!==start.id||!usable()||Math.hypot(e.clientX-start.x,e.clientY-start.y)>5)return;
  const rect=canvas.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(pointer,camera);ray.near=camera.near;ray.far=8;
  for(const hit of ray.intersectObjects(meshes,false)){const door=hit.object.userData.interactiveCabinet;if(hit.point.distanceTo(playerCamera.position)<=2.6){toggle(door);break}}
 };
 const cancel=()=>{down=null};
 button.onclick=()=>{search();toggle();canvas.focus({preventScroll:true})};
 window.addEventListener('keydown',keydown);canvas.addEventListener('pointerdown',pointerdown);canvas.addEventListener('pointerup',pointerup);canvas.addEventListener('pointercancel',cancel);
 return{attach,update,refresh(){nearest=null;lastSearch=0;show()},get animating(){return doors.some(d=>d.animation)},dispose(){window.removeEventListener('keydown',keydown);canvas.removeEventListener('pointerdown',pointerdown);canvas.removeEventListener('pointerup',pointerup);canvas.removeEventListener('pointercancel',cancel);button.onclick=null}};
}
