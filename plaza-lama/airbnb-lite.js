/* Airbnb room-by-room resolver */
S.guide={step:0,mission:'airbnb',bedrooms:2,bathrooms:1,guests:4,spaces:new Set(ROOM_ORDER),owned:new Set(),budget:300000,room:'Dormitorios'};

function openGuide(){S.guide.step=0;renderWholeHome();document.getElementById('guideOverlay').classList.add('show')}

function optButton(value,label,sub,key){
  var on=S.guide[key]===value?' selected':'';
  return '<button class="choice-card'+on+'" data-one="'+value+'" data-key="'+key+'"><b>'+label+'</b><small>'+sub+'</small></button>';
}
function wholeHead(title,copy){
  return '<div class="grab"></div><div class="sheethead"><div class="resolver-hero"><div class="resolver-label">Resuelve con Plaza Lama · Paso '+(S.guide.step+1)+' de 6</div><h2 class="resolver-title">'+title+'</h2><p class="resolver-copy">'+copy+'</p></div><button class="close" data-close="guideOverlay">'+ICONS.close+'</button></div><div class="guideprog"><div style="width:'+((S.guide.step+1)/6*100)+'%"></div></div>';
}
function navButtons(){
  return '<div class="guidefooter"><button class="guideback" id="wholeBack">'+(S.guide.step?'Atrás':'Cancelar')+'</button><button class="guidenext" id="wholeNext">Continuar</button></div>';
}
function ownedButton(k,label){
  return '<button class="owned-item '+(S.guide.owned.has(k)?'selected':'')+'" data-owned="'+k+'">'+label+'</button>';
}
function spaceButton(r){
  return '<button class="owned-item '+(S.guide.spaces.has(r)?'selected':'')+'" data-space="'+r+'">'+r+'</button>';
}

function renderWholeHome(){
  var sh=document.getElementById('guideSheet'), body='', title='', copy='';
  if(S.guide.step===0){
    title='¿Qué estás resolviendo?'; copy='La compra debe empezar por tu situación, no por una categoría.';
    body='<div class="big-choice">'+
      optButton('airbnb','Equipar un Airbnb','Habitaciones, sala, comedor, cocina, baños y más.','mission')+
      optButton('mude','Me mudé','Armar una casa desde cero o por etapas.','mission')+
      optButton('mami','Casa de mami','Comprar para un familiar sin duplicar cosas.','mission')+
      optButton('calor','Calor y apagones','Priorizar clima, energía y básicos.','mission')+'</div>';
  }
  if(S.guide.step===1){
    title='Cuéntanos el espacio'; copy='Así calculamos cantidades reales para el Airbnb.';
    body='<div class="options">'+
      counterBlock('Habitaciones','bedrooms',[1,2,3,4],S.guide.bedrooms)+
      counterBlock('Baños','bathrooms',[1,2,3],S.guide.bathrooms)+
      counterBlock('Huéspedes','guests',[2,4,6,8],S.guide.guests)+'</div>';
  }
  if(S.guide.step===2){
    title='¿Qué espacios quieres resolver?'; copy='Puedes equipar todo el Airbnb o sólo lo que te falta.';
    body='<div class="quick-select"><button class="primary-lite" id="allSpaces">Todo el Airbnb</button><button id="clearSpaces">Elegir manualmente</button></div><div class="owned-grid">'+ROOM_ORDER.map(spaceButton).join('')+'</div>';
  }
  if(S.guide.step===3){
    title='¿Qué ya tienes?'; copy='Marca todo. Y sí: ahora puedes decir “ya tengo todo”.';
    body='<div class="quick-select"><button class="primary-lite" id="ownNothing">No tengo nada</button><button id="ownEverything">Ya tengo todo</button></div><div class="owned-grid">'+
      ownedButton('camas','Camas / colchones')+ownedButton('ropaCama','Ropa de cama')+ownedButton('tv','TV')+ownedButton('aire','Aire acondicionado')+
      ownedButton('sofa','Sofá / sala')+ownedButton('comedor','Mesa / comedor')+ownedButton('nevera','Nevera')+ownedButton('microondas','Microondas')+
      ownedButton('utensilios','Utensilios de cocina')+ownedButton('lavadora','Lavadora')+ownedButton('toallas','Toallas')+ownedButton('cortinas','Cortinas')+'</div>';
  }
  if(S.guide.step===4){
    title='¿Cuánto quieres invertir ahora?'; copy='Puedes equipar por fases; el plan prioriza lo esencial.';
    body='<div class="budget"><strong id="budgetVal">'+fmt(S.guide.budget)+'</strong><input id="budgetRange" type="range" min="50000" max="1200000" step="10000" value="'+S.guide.budget+'"><div class="quick-select" style="margin-top:12px"><button data-budget="150000">RD$150k</button><button data-budget="300000">RD$300k</button><button data-budget="500000">RD$500k</button><button data-budget="800000">RD$800k</button></div></div>';
  }
  if(S.guide.step===5){
    title='Tu Airbnb, organizado por espacio.'; copy='No tres productos random. Un plan completo que puedes editar.';
    body=renderWholePlan();
  }
  sh.innerHTML=wholeHead(title,copy)+body+(S.guide.step===5?'':navButtons());
  sh.querySelector('[data-close]').onclick=function(){closeOverlay('guideOverlay')};
  bindWholeHome();
}
function counterBlock(label,key,values,current){
  return '<div class="option"><b>'+label+'</b><div class="quick-select" style="margin-top:10px">'+values.map(function(n){return '<button class="'+(current===n?'primary-lite':'')+'" data-count="'+key+'" data-value="'+n+'">'+n+(n===values[values.length-1]?'+':'')+'</button>'}).join('')+'</div></div>';
}
function bindWholeHome(){
  document.querySelectorAll('[data-one]').forEach(function(b){b.onclick=function(){S.guide[b.dataset.key]=b.dataset.one;renderWholeHome()}});
  document.querySelectorAll('[data-count]').forEach(function(b){b.onclick=function(){S.guide[b.dataset.count]=Number(b.dataset.value);renderWholeHome()}});
  document.querySelectorAll('[data-space]').forEach(function(b){b.onclick=function(){var r=b.dataset.space;S.guide.spaces.has(r)?S.guide.spaces.delete(r):S.guide.spaces.add(r);renderWholeHome()}});
  document.querySelectorAll('[data-owned]').forEach(function(b){b.onclick=function(){var k=b.dataset.owned;S.guide.owned.has(k)?S.guide.owned.delete(k):S.guide.owned.add(k);renderWholeHome()}});
  var x=document.getElementById('allSpaces'); if(x)x.onclick=function(){S.guide.spaces=new Set(ROOM_ORDER);renderWholeHome()};
  x=document.getElementById('clearSpaces'); if(x)x.onclick=function(){S.guide.spaces=new Set();renderWholeHome()};
  x=document.getElementById('ownNothing'); if(x)x.onclick=function(){S.guide.owned=new Set();renderWholeHome()};
  x=document.getElementById('ownEverything'); if(x)x.onclick=function(){S.guide.owned=new Set(['camas','ropaCama','tv','aire','sofa','comedor','nevera','microondas','utensilios','lavadora','toallas','cortinas']);renderWholeHome()};
  x=document.getElementById('budgetRange'); if(x)x.oninput=function(e){S.guide.budget=Number(e.target.value);document.getElementById('budgetVal').textContent=fmt(S.guide.budget)};
  document.querySelectorAll('[data-budget]').forEach(function(b){b.onclick=function(){S.guide.budget=Number(b.dataset.budget);renderWholeHome()}});
  x=document.getElementById('wholeBack'); if(x)x.onclick=function(){if(S.guide.step===0)closeOverlay('guideOverlay');else{S.guide.step--;renderWholeHome()}};
  x=document.getElementById('wholeNext'); if(x)x.onclick=function(){if(S.guide.step<5){S.guide.step++;if(S.guide.step===5)S.guide.room=Array.from(S.guide.spaces)[0]||'Dormitorios';renderWholeHome()}};
  document.querySelectorAll('[data-room]').forEach(function(b){b.onclick=function(){S.guide.room=b.dataset.room;renderWholeHome()}});
  document.querySelectorAll('[data-room-product]').forEach(function(r){r.onclick=function(e){if(e.target.closest('a')||e.target.closest('button'))return;openDetail(r.dataset.roomProduct)}});
  document.querySelectorAll('[data-room-detail]').forEach(function(b){b.onclick=function(e){e.stopPropagation();openDetail(b.dataset.roomDetail)}});
  x=document.getElementById('editOwned2'); if(x)x.onclick=function(){S.guide.step=3;renderWholeHome()};
  x=document.getElementById('editPlan2'); if(x)x.onclick=function(){S.guide.step=2;renderWholeHome()};
  x=document.getElementById('addPlan2'); if(x)x.onclick=function(){wholeRooms().forEach(function(r){wholeProducts(r).filter(function(p){return !p.unavailable}).forEach(function(p){addCart(p.id,wholeQty(p,r))})});closeOverlay('guideOverlay');openCart()};
}
function isOwnedNeed(need){
  var map={tv:'tv',aire:'aire',nevera:'nevera',lavadora:'lavadora',microondas:'microondas',utensilios:'utensilios',toallas:'toallas',cortina:'cortinas',cortinabano:'cortinas',sofa:'sofa'};
  return map[need]&&S.guide.owned.has(map[need]);
}
function wholeProducts(room){
  var list=PRODUCTS.filter(function(p){return (p.rooms||[]).indexOf(room)>=0&&!isOwnedNeed(p.need)});
  if(room==='Comedor'&&S.guide.owned.has('comedor'))list=list.filter(function(p){return ['silla','plato','cubiertos','bowl','servilleta'].indexOf(p.need)<0});
  if(room==='Dormitorios'&&S.guide.owned.has('ropaCama'))list=list.filter(function(p){return ['almohada','cortina','perchas'].indexOf(p.need)<0});
  return list;
}
function wholeQty(p,room){
  if(room==='Dormitorios'){if(p.need==='almohada')return Math.max(2,S.guide.guests);if(p.need==='cortina'||p.need==='gavetero'||p.need==='aire')return S.guide.bedrooms;if(p.need==='perchas')return S.guide.bedrooms*2}
  if(room==='Baños'&&['toallas','cortinabano','jabon'].indexOf(p.need)>=0)return Math.max(1,S.guide.bathrooms);
  if(room==='Comedor'){if(p.need==='silla')return Math.min(4,S.guide.guests);if(['plato','bowl','servilleta'].indexOf(p.need)>=0)return S.guide.guests}
  return 1;
}
function wholeRooms(){return ROOM_ORDER.filter(function(r){return S.guide.spaces.has(r)})}
function productSearchLink(p){return p.officialUrl||('https://www.plazalama.com.do/search?name='+encodeURIComponent(p.name))}
function priceText(p,q){return p.priceVerified?fmt(p.price*q):'Ver precio actual'}
function productRow(p,room){
  var q=wholeQty(p,room);
  return '<div class="room-product" data-room-product="'+p.id+'"><div class="room-thumb">'+imageHTML(p)+'</div><div class="room-copy"><div class="brand">'+p.brand+'</div><b>'+p.name+'</b><small>'+(p.priceVerified?'Precio público verificado':'Precio e inventario según tienda')+'</small><a class="live-link" target="_blank" rel="noopener" href="'+productSearchLink(p)+'" onclick="event.stopPropagation()">Plaza Lama ↗</a></div><div class="room-side"><strong>'+priceText(p,q)+'</strong><div class="qtylabel">x'+q+'</div><button data-room-detail="'+p.id+'">Ver</button></div></div>';
}
function renderWholePlan(){
  var rooms=wholeRooms();
  if(S.guide.owned.size>=12)return '<div class="plan-top"><h3>Perfecto. Ya tienes todo lo esencial.</h3><p>No te vamos a vender duplicados. Puedes editar lo que tienes o usar Plaza Lama para reposición y decoración.</p></div><div class="plan-summary"><div class="summary-actions"><button class="outline" id="editOwned2">Editar lo que tengo</button><button class="solid" onclick="closeOverlay(\'guideOverlay\');S.view=\'Hogar\';render()">Explorar Hogar</button></div></div>';
  var room=(rooms.indexOf(S.guide.room)>=0?S.guide.room:(rooms[0]||'Dormitorios')); S.guide.room=room;
  var list=wholeProducts(room),subtotal=0,live=0;
  rooms.forEach(function(r){wholeProducts(r).forEach(function(p){var q=wholeQty(p,r);if(p.priceVerified&&!p.unavailable)subtotal+=p.price*q;else live++})});
  return '<div class="room-plan"><div class="plan-top"><h3>Airbnb · '+S.guide.bedrooms+' hab · '+S.guide.guests+' huéspedes</h3><p>Revisa por espacio. Puedes marcar una categoría como resuelta, abrir cada producto o ir al catálogo real.</p></div><div class="room-tabs">'+rooms.map(function(r){return '<button class="room-tab '+(r===room?'active':'')+'" data-room="'+r+'">'+r+'</button>'}).join('')+'</div><div class="room-section"><div class="room-head"><div><b>'+room+'</b><small>'+list.length+' recomendaciones</small></div></div>'+(list.length?list.map(function(p){return productRow(p,room)}).join(''):'<div class="room-empty">Ya resolviste esta categoría.</div>')+'</div></div><div class="plan-summary"><div class="summary-line"><span>Subtotal con precios públicos confirmados<br>'+(live?live+' artículos consultan precio en vivo':'')+'</span><strong>'+fmt(subtotal)+'</strong></div><div class="summary-actions"><button class="outline" id="editPlan2">Editar plan</button><button class="solid" id="addPlan2">Agregar plan</button></div></div>';
}