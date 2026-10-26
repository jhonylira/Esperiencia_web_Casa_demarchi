import * as THREE from 'three';
export const characters=[
 {id:'livia',name:'Lívia',role:'A exploradora',detail:'10 anos · curiosidade em cada descoberta',color:'#cb9c9b',scale:.87,eyeHeight:1.30},
 {id:'juli',name:'Juli',role:'Mãe · CEO da família e da AMVALI',detail:'Cuidado, presença e liderança',color:'#668477',scale:1.05,eyeHeight:1.58},
 {id:'ricardo',name:'Ricardo',role:'Paizão & CEO da família',detail:'Desbravador da WEG · novos caminhos',color:'#58748b',scale:1.13,eyeHeight:1.70},
 {id:'luna',name:'Luna',role:'A companheira da família',detail:'Lhasa Apso · sempre por perto',color:'#b0a58f',scale:1,eyeHeight:.28}
];
const material=(color)=>new THREE.MeshStandardMaterial({color,roughness:.85,metalness:0});
function mesh(geometry,mat,parent,position=[0,0,0],scale=null){const o=new THREE.Mesh(geometry,mat);o.position.set(...position);if(scale)o.scale.set(...scale);parent.add(o);return o}
const sphere=(r=.1)=>new THREE.SphereGeometry(r,16,12);
export function createAvatar(id){
 const c=characters.find(a=>a.id===id)||characters[1];const root=new THREE.Group();root.name='Avatar '+c.name;const limbs=[];
 if(id==='luna'){
  const cream=material('#e8e0ce'),gray=material('#aaa89e'),dark=material('#342e29'),rose=material('#d8aaa0');
  const body=mesh(new THREE.CapsuleGeometry(.11,.27,5,12),cream,root,[0,.2,0]);body.rotation.x=Math.PI/2;
  mesh(sphere(.135),cream,root,[0,.275,.23],[1,1.02,1]);
  for(const x of [-1,1]){mesh(new THREE.CapsuleGeometry(.055,.115,4,10),gray,root,[x*.115,.23,.24]);mesh(sphere(.014),dark,root,[x*.048,.295,.347]);}
  mesh(sphere(.072),cream,root,[0,.235,.332],[1,.8,1]);mesh(sphere(.023),dark,root,[0,.26,.393],[1,.7,.65]);mesh(sphere(.018),rose,root,[0,.209,.387],[.65,1,.3]);
  for(const x of [-.075,.075])for(const z of [-.145,.145]){const pivot=new THREE.Group();pivot.position.set(x,.16,z);root.add(pivot);mesh(new THREE.CapsuleGeometry(.035,.08,4,8),gray,pivot,[0,-.05,0]);mesh(sphere(.043),cream,pivot,[0,-.115,.015],[1,.65,1.3]);limbs.push(pivot)}
  for(let i=0;i<18;i++){const a=i*Math.PI*2/18;mesh(sphere(.05),i%3===0?gray:cream,root,[Math.sin(a)*.09,.2+Math.cos(a)*.07,(i%6-2.5)*.055],[1,1.2,1.2])}
  const tail=mesh(new THREE.TorusGeometry(.075,.032,7,18,Math.PI*1.65),cream,root,[0,.29,-.23]);tail.rotation.y=Math.PI/2;
 }else{
  const skin=material('#d8ac89'),hair=material(id==='livia'?'#74533e':'#43372e'),shirt=material(c.color),pants=material(id==='livia'?'#d7c8b8':'#37443f'),shoe=material('#d1c3a9'),white=material('#f1e8d9'),dark=material('#3b342c');
  mesh(new THREE.CapsuleGeometry(.115,.3,6,16),shirt,root,[0,1.04,0],[1.02,1,.70]);
  mesh(new THREE.CylinderGeometry(.038,.045,.13,12),skin,root,[0,1.33,0]);
  mesh(sphere(.122),skin,root,[0,1.49,0],[1,1.18,.91]);
  const cap=mesh(new THREE.SphereGeometry(.131,20,14,0,Math.PI*2,0,Math.PI*.53),hair,root,[0,1.51,-.007],[1,1.08,1]);
  for(const sign of [-1,1]){
   mesh(sphere(.02),skin,root,[sign*.118,1.49,0],[.5,1,.75]);
   mesh(sphere(.009),dark,root,[sign*.04,1.51,.112],[1,1.12,.45]);
   mesh(new THREE.BoxGeometry(.027,.004,.004),hair,root,[sign*.041,1.535,.11]);
   const leg=new THREE.Group();leg.position.set(sign*.068,.81,0);root.add(leg);mesh(new THREE.CapsuleGeometry(.042,.54,5,12),pants,leg,[0,-.34,0]);mesh(sphere(.054),shoe,leg,[0,-.715,.025],[1,.60,1.6]);limbs.push(leg);
   const arm=new THREE.Group();arm.position.set(sign*.14,1.18,0);arm.rotation.z=sign*.06;root.add(arm);mesh(new THREE.CapsuleGeometry(.031,.31,5,12),shirt,arm,[0,-.18,0]);mesh(sphere(.032),skin,arm,[0,-.37,0]);limbs.push(arm);
  }
  mesh(sphere(.012),skin,root,[0,1.48,.123],[.8,1,1.25]);const smile=mesh(new THREE.TorusGeometry(.023,.003,5,14,Math.PI),dark,root,[0,1.45,.113]);smile.rotation.z=Math.PI;
  if(id==='juli'){mesh(new THREE.CapsuleGeometry(.091,.2,5,14),hair,root,[0,1.43,-.072],[1.15,1,.65]);for(const x of [-.108,.108])mesh(new THREE.CapsuleGeometry(.039,.15,5,12),hair,root,[x,1.43,-.027]);mesh(new THREE.BoxGeometry(.043,.22,.008),white,root,[0,1.13,.082]);}
  if(id==='livia'){for(const x of [-.115,.115])mesh(sphere(.05),hair,root,[x,1.55,-.06]);mesh(new THREE.CylinderGeometry(.105,.155,.23,20),shirt,root,[0,.82,0]);}
  if(id==='ricardo'){mesh(new THREE.BoxGeometry(.05,.065,.006),white,root,[0,1.245,.083]);mesh(sphere(.059),hair,root,[0,1.405,.068],[1,.20,.50]);}
  root.scale.setScalar(c.scale);
 }
 root.userData={character:c,limbs};
 return{root,character:c,animate:(time,moving)=>{limbs.forEach((l,i)=>{l.rotation.x=moving?Math.sin(time*8+([0,1,1,0][i]||0)*Math.PI)*.28:0})}};
}
let portraitsPromise;
export function buildPortraits(){if(portraitsPromise)return portraitsPromise;portraitsPromise=Promise.resolve().then(()=>{
 const renderer=new THREE.WebGLRenderer({alpha:false,antialias:true,preserveDrawingBuffer:true});renderer.setSize(320,320);renderer.setPixelRatio(1);renderer.setClearColor(0xece9df);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;
 const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xffffff,0x8c9b7f,2.4));const key=new THREE.DirectionalLight(0xfff3dd,2.5);key.position.set(3,5,5);scene.add(key);const camera=new THREE.PerspectiveCamera(30,1,.01,20);const urls={};
 for(const c of characters){const {root}=createAvatar(c.id);scene.add(root);root.rotation.y=-.25;if(c.id==='luna'){camera.position.set(.6,.55,1.25);camera.lookAt(0,.2,.1)}else{camera.position.set(.35,1.35*c.scale,3.1);camera.lookAt(0,1.14*c.scale,0)}renderer.render(scene,camera);urls[c.id]=renderer.domElement.toDataURL('image/png');scene.remove(root);root.traverse(o=>{if(o.isMesh){o.geometry.dispose();o.material.dispose()}})}renderer.dispose();return urls;
});return portraitsPromise}
