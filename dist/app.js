import {rooms,groundRooms,implantationRooms} from './data.js';
const $=id=>document.getElementById(id);
let assetRevision=0;
let characterId=null,characterModule=null,portraits={};
const imagePath=n=>`assets/scene-${String(n).padStart(2,'0')}.webp?v=${assetRevision}`;
const thumbPath=n=>`assets/thumb-${String(n).padStart(2,'0')}.webp?v=${assetRevision}`;
let selected=rooms[0],imageIndex=0,mode='2d',floor='superior',tab='conceito',planBase=false,visited=new Set(),threeAPI=null,threePromise=null;
const currentRooms=()=>floor==='superior'?rooms:floor==='terreo'?groundRooms:implantationRooms;
const allRooms=[...implantationRooms,...groundRooms,...rooms];
const nextRoom=()=>allRooms[(allRooms.indexOf(selected)+1)%allRooms.length];
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.remove('show'),3200)}
function renderPins(){
 $('plan-tags').replaceChildren();$('room-strip').replaceChildren();
 currentRooms().forEach(room=>{
  const pin=document.createElement('button');pin.className='room-pin';pin.dataset.room=room.id;pin.style.left=room.plan[0]+'%';pin.style.top=room.plan[1]+'%';pin.setAttribute('aria-label',`Explorar ${room.title}`);pin.innerHTML=`<span class="pin-dot">${room.number}</span><span class="pin-label">${room.title}</span>`;pin.onclick=()=>selectRoom(room.id,true);$('plan-tags').append(pin);
  const chip=document.createElement('button');chip.className='room-chip';chip.dataset.room=room.id;chip.innerHTML=`<span>${room.number}</span>${room.tag}`;chip.onclick=()=>selectRoom(room.id,true);$('room-strip').append(chip);
 });
 updateActive();threeAPI?.setRooms(currentRooms());
}
function updateActive(){document.querySelectorAll('[data-room]').forEach(el=>{el.classList.toggle('active',el.dataset.room===selected.id);el.classList.toggle('visited',visited.has(el.dataset.room));el.setAttribute('aria-pressed',String(el.dataset.room===selected.id))});$('visited-count').textContent=`${currentRooms().filter(r=>visited.has(r.id)).length} / ${currentRooms().length} ambientes`}
function selectRoom(id,focus=false){
 const room=allRooms.find(r=>r.id===id);if(!room)return;
 const newFloor=implantationRooms.includes(room)?'implantacao':groundRooms.includes(room)?'terreo':'superior';if(newFloor!==floor)setFloor(newFloor,false);
 selected=room;imageIndex=0;visited.add(room.id);
 $('room-title').textContent=room.title;$('room-category').textContent=`${room.number} / ${room.category}`;$('room-concept').textContent=room.concept;$('room-description').textContent=room.description;
 $('room-materials').innerHTML=room.materials.map(([name,color])=>`<div class="material-chip"><i style="background:${color}"></i><span>${name}</span></div>`).join('')+'<p class="material-note">Paleta e leitura visual do estudo. Especificações finais conforme detalhamento do projeto.</p>';
 $('room-thumbnails').innerHTML=room.images.map((n,i)=>`<button data-image="${i}" aria-label="Ver vista ${i+1} de ${room.title}"><img src="${thumbPath(n)}" alt="Vista ${i+1}" loading="lazy"></button>`).join('');
 $('room-thumbnails').querySelectorAll('button').forEach(b=>b.onclick=()=>setImage(Number(b.dataset.image)));
 setImage(0);updateActive();
 const next=nextRoom();$('next-room').innerHTML=`${next.title} <span>→</span>`;
 if(mode==='tour')threeAPI?.enterTour(room).catch(console.error);else if(focus&&mode==='3d')threeAPI?.focus(room);
 if(focus&&innerWidth<760&&mode==='2d')toast(`${room.number} · ${room.title} — detalhes abaixo da planta`);
 if(document.body.classList.contains('exploring'))history.replaceState(null,'',`#explorar/${room.id}`);
}
function setImage(index){
 const total=selected.images.length;imageIndex=total?(index+total)%total:0;
 $('room-image').src=total?imagePath(selected.images[imageIndex]):'assets/planta-terreo.webp';$('room-image').alt=total?`${selected.title} — vista ${imageIndex+1}`:'Planta humanizada do térreo — referência de layout';
 $('image-counter').textContent=total?`${String(imageIndex+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`:'PLANTA / CONTEXTO';
 $('prev-image').disabled=total<=1;$('next-image').disabled=total<=1;document.querySelector('.photo-arrows').hidden=total<=1;$('room-thumbnails').hidden=!total;
 $('room-thumbnails').querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===imageIndex));
 if($('lightbox').open)renderLightbox();
}
function setTab(value){tab=value;$('tab-conceito').classList.toggle('active',tab==='conceito');$('tab-materiais').classList.toggle('active',tab==='materiais');$('tab-conceito').setAttribute('aria-pressed',tab==='conceito');$('tab-materiais').setAttribute('aria-pressed',tab==='materiais');$('room-description').hidden=tab!=='conceito';$('room-materials').hidden=tab!=='materiais'}
function setFloor(value,selectDefault=true){floor=value;$('floor').value=value;const implantation=floor==='implantacao';$('mode-2d').disabled=implantation;document.getElementById("mode-tour").disabled=implantation;if(!implantation){$('plan-image').src=`assets/planta-${floor}${planBase?'-base':''}.webp`;$('plan-image').alt=`Planta ${planBase?'base':'humanizada'} do pavimento ${floor==='superior'?'superior':'térreo'}`;document.querySelector('.plan-frame').style.aspectRatio=floor==='superior'?'1651 / 1396':'775 / 1376'}$('viewer-label').textContent=implantation?'IMPLANTAÇÃO · VOLUMETRIA GERAL':floor==='superior'?'PAVIMENTO SUPERIOR':'PAVIMENTO TÉRREO';$('viewer-subtitle').textContent=implantation?'A casa completa, da chegada à área de lazer':floor==='superior'?'Selecione um ponto para conhecer o ambiente':'Explore os ambientes sociais e de lazer';$('front-view').hidden=!implantation;$('toggle-cut').hidden=mode!=='3d'||floor!=='superior';renderPins();threeAPI?.setFloor(floor).catch(err=>{console.error(err);toast('Use as plantas e renders para continuar a visita.')});if(implantation)setMode('3d');if(selectDefault)selectRoom(currentRooms()[0].id)}
async function setMode(value){
 if(floor==='implantacao'&&value!=='3d')return;
 if(value==='tour'&&!characterId){await openCharacterPicker();return;}
 mode=value;const is3d=value!=='2d',isTour=value==='tour';
 for(const [id,v] of [['mode-2d','2d'],['mode-3d','3d'],['mode-tour','tour']]){$(id).classList.toggle('active',value===v);$(id).setAttribute('aria-pressed',value===v)}
 $('plan-view').hidden=is3d;$('three-view').hidden=!is3d;$('toggle-cut').hidden=!is3d||isTour||floor!=='superior';$('top-view').hidden=!is3d||isTour;$('front-view').hidden=floor!=='implantacao'||!is3d;$('compare-plan').hidden=is3d;$('tour-controls').hidden=!isTour;$('viewer').classList.toggle('human-tour',isTour);
 $('view-hint').textContent=isTour?'Clique na cena · WASD / setas · arraste para olhar':is3d?'Arraste para girar · role para aproximar':'● Clique nos pontos para explorar';
 if(is3d){try{
  if(!threePromise)threePromise=import('./three-view.js').then(m=>m.createModelViewer({initialFloor:floor,container:$('three-view'),tagLayer:$('model-tags'),onSelect:id=>selectRoom(id,true),onLoading:value=>{$('model-loader').hidden=!value},onProgress:p=>{$('model-progress').value=p;$('load-status').textContent=`Carregando maquete · ${Math.round(p)}%`}})).then(api=>{threeAPI=api;$('model-loader').hidden=true;api.setRooms(currentRooms());api.setFloor(floor);api.setSelected(selected.id);updateActive();return api});
  await threePromise;threeAPI.resize();threeAPI.setActive(document.body.classList.contains('exploring'));if(characterId)threeAPI.setCharacter(characterId);await threeAPI.setTour(isTour,selected);
 }catch(err){console.error(err);$('model-loader').hidden=true;$('model-error').hidden=false;toast('A planta e os renders continuam disponíveis.')}}else{await threeAPI?.setTour(false,selected);threeAPI?.setActive(false)}
}
async function openCharacterPicker(){
 characterModule??=await import('./avatars.js');
 $('character-cards').innerHTML=characterModule.characters.map(c=>`<button class="character-card" data-avatar="${c.id}" aria-label="Escolher ${c.name}"><div class="character-portrait"><span>${c.name[0]}</span><img alt="Avatar estilizado de ${c.name}" hidden></div><h3>${c.name}</h3><p>${c.role}</p><small>${c.detail}</small><span>Explorar com ${c.name}<b>↗</b></span></button>`).join('');
 $('character-cards').querySelectorAll('button').forEach(b=>b.onclick=async()=>{characterId=b.dataset.avatar;$('character-picker').close();updateCharacterHud();threeAPI?.setCharacter(characterId);await setMode('tour')});
 $('character-picker').showModal();
 portraits=await characterModule.buildPortraits();
 $('character-cards').querySelectorAll('button').forEach(b=>{const img=b.querySelector('img');img.src=portraits[b.dataset.avatar];img.hidden=false;b.querySelector('.character-portrait>span').hidden=true});updateCharacterHud();
}
function updateCharacterHud(){document.getElementById("tour-jump").hidden=characterId!=='luna';if(!characterId||!characterModule)return;const c=characterModule.characters.find(c=>c.id===characterId);$('tour-avatar-name').textContent=c.name;$('tour-eye-height').textContent=`Olhar a ${c.eyeHeight.toFixed(2).replace('.',',')} m`;$('tour-avatar-picture').src=portraits[characterId]||'';$('tour-avatar-picture').alt=`Avatar de ${c.name}`}
function renderLightbox(){const total=selected.images.length;$('lightbox-image').src=$('room-image').src;$('lightbox-image').alt=$('room-image').alt;$('lightbox-caption').textContent=`${selected.title} ${total?' / '+String(imageIndex+1).padStart(2,'0')+' — '+String(total).padStart(2,'0'):' / Planta humanizada'}`;$('lightbox-dots').innerHTML=selected.images.map((n,i)=>`<button data-idx="${i}" class="${i===imageIndex?'active':''}" aria-label="Vista ${i+1}"></button>`).join('');$('lightbox-dots').querySelectorAll('button').forEach(b=>b.onclick=()=>setImage(Number(b.dataset.idx)));$('lightbox-prev').hidden=total<=1;$('lightbox-next').hidden=total<=1}
function route(){const hash=location.hash.slice(1);if(hash==='essencia')return;const exploring=hash.startsWith('explorar');$('concept-view').hidden=exploring;$('experience-view').hidden=!exploring;document.body.classList.toggle('exploring',exploring);document.querySelectorAll('[data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===(exploring?'explorar':'conceito')));if(exploring){selectRoom(hash.split('/')[1]||selected.id);threeAPI?.resize()}threeAPI?.setActive(exploring&&mode!=='2d');window.scrollTo({top:0,behavior:'instant'})}
$('floor').onchange=e=>setFloor(e.target.value);$('mode-2d').onclick=()=>setMode('2d');$('mode-3d').onclick=()=>setMode('3d');$('back-to-plan').onclick=()=>setMode('2d');$('prev-image').onclick=()=>setImage(imageIndex-1);$('next-image').onclick=()=>setImage(imageIndex+1);$('lightbox-prev').onclick=()=>setImage(imageIndex-1);$('lightbox-next').onclick=()=>setImage(imageIndex+1);$('tab-conceito').onclick=()=>setTab('conceito');$('tab-materiais').onclick=()=>setTab('materiais');$('next-room').onclick=()=>selectRoom(nextRoom().id,true);$('open-image').onclick=()=>{renderLightbox();$('lightbox').showModal()};$('close-lightbox').onclick=()=>$('lightbox').close();$('lightbox').onclick=e=>{if(e.target===$('lightbox'))$('lightbox').close()};document.addEventListener('keydown',e=>{if($('lightbox').open){if(e.key==='ArrowRight')setImage(imageIndex+1);if(e.key==='ArrowLeft')setImage(imageIndex-1)}});$('reset-view').onclick=()=>{if(mode==='3d')threeAPI?.reset();else document.querySelector('.plan-frame').style.transform='none'};$('toggle-cut').onclick=()=>{const open=threeAPI?.toggleCut();$('toggle-cut').title=open?'Mostrar volume do pavimento':'Abrir corte da maquete';toast(open?'Maquete aberta para leitura dos ambientes':'Volume do pavimento')};$('top-view').onclick=()=>threeAPI?.top();$('guided-tour').onclick=()=>{setFloor('terreo',false);selectRoom('social',true);toast('Visita guiada: siga pelo botão do próximo ambiente, do térreo às suítes.')};document.querySelector('.fullscreen').onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch{toast('Use F11 para apresentar em tela cheia.')}};
document.getElementById("tour-jump").onclick=()=>threeAPI?.jump();window.addEventListener('hashchange',route);window.addEventListener('resize',()=>threeAPI?.resize());
$('compare-plan').onclick=()=>{planBase=!planBase;$('plan-image').src=`assets/planta-${floor}${planBase?'-base':''}.webp`;$('compare-plan').setAttribute('aria-pressed',planBase);toast(planBase?'Planta base — mesma posição dos ambientes':'Planta humanizada · Olho Mágico')};
$('front-view').onclick=()=>threeAPI?.front();
$('guided-tour').onclick=()=>{selectRoom('implantacao',true);toast('Visita guiada: implantação, térreo e ambientes do superior.')};
$('mode-tour').onclick=()=>setMode('tour');$('change-character').onclick=()=>openCharacterPicker();$('close-character-picker').onclick=()=>$('character-picker').close();$('tour-perspective').onclick=()=>{const thirdPerson=threeAPI?.togglePerspective();$('tour-perspective').textContent=thirdPerson?'Olhar do personagem ◉':'Ver meu personagem ◇'};
$('reset-view').onclick=()=>{if(mode==='tour')threeAPI?.enterTour(selected);else if(mode==='3d')threeAPI?.reset();else document.querySelector('.plan-frame').style.transform='none'};
$('concept-room-details').innerHTML=rooms.filter(r=>!['casal','closet-casal','livia','hospedes'].includes(r.id)).map(r=>`<a class="detail-room-card" href="#explorar/${r.id}"><div><img src="${imagePath(r.images[0])}" alt="${r.title}" loading="lazy"><span>↗</span></div><p class="eyebrow">${r.number} / ${r.category}</p><h3>${r.title}</h3><p>${r.concept}</p></a>`).join('');
renderPins();route();
window.demarchi={get state(){return{room:selected.id,mode,floor,imageIndex,visited:[...visited]}},setMode,selectRoom,get model(){return threeAPI}};
async function refreshFinalRenders(){try{const response=await fetch('assets/render-versions.json',{cache:'no-store'});if(!response.ok)return;const manifest=await response.json();if(manifest.revision&&manifest.revision!==assetRevision){const first=assetRevision===0;assetRevision=manifest.revision;setImage(imageIndex);document.querySelectorAll('#concept-view img[src*="scene-"]').forEach(img=>{img.src=img.src.split('?')[0]+'?v='+assetRevision});$('room-thumbnails').querySelectorAll('img').forEach((img,i)=>img.src=thumbPath(selected.images[i]));if(!first)toast('Novas imagens finais disponíveis na apresentação.')}}catch{}}
refreshFinalRenders();setInterval(refreshFinalRenders,30000);
