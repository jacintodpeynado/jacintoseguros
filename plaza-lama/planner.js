
/* Live plan + room catalog navigation. Loaded after airbnb-lite.js. */
(function(){
  function ensurePlan(){
    if(!S.guide.plan) S.guide.plan={};
    if(!S.guide.catalogRoom) S.guide.catalogRoom=null;
    if(!S.guide.roomFilter) S.guide.roomFilter='Todos';
  }
  function planQty(id){ ensurePlan(); return Number(S.guide.plan[id]||0); }
  function setPlan(id,qty){
    ensurePlan();
    if(qty<=0) delete S.guide.plan[id]; else S.guide.plan[id]=qty;
    renderWholeHome();
  }
  function addPlan(id,qty){
    ensurePlan();
    S.guide.plan[id]=(S.guide.plan[id]||0)+Number(qty||1);
    renderWholeHome();
  }
  function planIds(){ ensurePlan(); return Object.keys(S.guide.plan); }
  function planTotal(){
    ensurePlan();
    return planIds().reduce(function(sum,id){
      var p=byId(id), q=S.guide.plan[id]||0;
      return sum+(p&&p.price?p.price*q:0);
    },0);
  }
  function planLiveCount(){
    ensurePlan();
    return planIds().filter(function(id){var p=byId(id);return p&&!p.priceVerified}).length;
  }
  function seedPlan(){
    ensurePlan();
    if(S.guide.planSeeded) return;
    var seed=[];
    wholeRooms().forEach(function(room){
      var list=wholeProducts(room).filter(function(p){return !p.unavailable});
      if(room==='Dormitorios'){
        var pillow=list.find(function(p){return p.need==='almohada'});
        var curtain=list.find(function(p){return p.need==='cortina'});
        var ac=list.find(function(p){return p.need==='aire'});
        if(pillow) seed.push([pillow.id,Math.max(2,S.guide.guests)]);
        if(curtain) seed.push([curtain.id,S.guide.bedrooms]);
        if(ac) seed.push([ac.id,S.guide.bedrooms]);
      } else if(room==='Sala'){
        ['tv','cojin','decoracion'].forEach(function(need){
          var p=list.find(function(x){return x.need===need}); if(p)seed.push([p.id,need==='cojin'?2:1]);
        });
      } else if(room==='Comedor'){
        ['cubiertos','plato','bowl','individual','servilleta'].forEach(function(need){
          var p=list.find(function(x){return x.need===need});
          if(p) seed.push([p.id,['plato','bowl','individual','servilleta'].indexOf(need)>=0?S.guide.guests:1]);
        });
      } else if(room==='Cocina'){
        ['nevera','microondas','utensilios','greca'].forEach(function(need){
          var p=list.find(function(x){return x.need===need}); if(p)seed.push([p.id,1]);
        });
      } else if(room==='Baños'){
        ['toallas','cortinabano','jabon'].forEach(function(need){
          var p=list.find(function(x){return x.need===need}); if(p)seed.push([p.id,Math.max(1,S.guide.bathrooms)]);
        });
      } else if(room==='Lavado'){
        var p=list.find(function(x){return x.need==='lavadora'}); if(p)seed.push([p.id,1]);
      } else if(room==='Clima'){
        var p=list.find(function(x){return x.need==='aire'}); if(p)seed.push([p.id,1]);
      }
    });
    seed.forEach(function(pair){
      if(!S.guide.plan[pair[0]]) S.guide.plan[pair[0]]=pair[1];
    });
    S.guide.planSeeded=true;
  }
  function resetPlanSeed(){
    S.guide.plan={}; S.guide.planSeeded=false; S.guide.catalogRoom=null; S.guide.roomFilter='Todos';
  }
  var originalOpenGuide=openGuide;
  openGuide=function(){ resetPlanSeed(); originalOpenGuide(); };

  function planListHtml(){
    ensurePlan();
    var ids=planIds();
    if(!ids.length) return '<div class="plan-empty">Tu plan está vacío. Agrega productos desde cualquier espacio y aparecerán aquí.</div>';
    return ids.map(function(id){
      var p=byId(id),q=S.guide.plan[id]||1;
      if(!p)return '';
      return '<div class="plan-item"><div><b>'+p.name+'</b><small>x'+q+' · '+(p.priceVerified?'precio público':'precio según tienda')+'</small></div><div class="plan-item-side"><strong>'+fmt((p.price||0)*q)+'</strong><button data-plan-remove="'+id+'">Quitar</button></div></div>';
    }).join('');
  }
  function budgetHtml(){
    var total=planTotal(), budget=Number(S.guide.budget||0), pct=budget?Math.min(100,total/budget*100):0, over=total>budget;
    return '<div class="plan-budget-row"><span>Total del plan</span><strong>'+fmt(total)+'</strong></div>'+
      '<div class="budget-meter '+(over?'over':'')+'"><div style="width:'+pct+'%"></div></div>'+
      '<div class="budget-note">'+(over?'Sobre presupuesto por '+fmt(total-budget):'Disponible '+fmt(Math.max(0,budget-total)))+
      (planLiveCount()?' · '+planLiveCount()+' productos validan precio por tienda':'')+'</div>';
  }
  function railHtml(){
    return '<aside class="plan-rail"><div class="plan-rail-head"><b>Mi plan</b><small>Se arma mientras eliges</small></div><div class="plan-items">'+planListHtml()+'</div><div class="plan-rail-foot">'+budgetHtml()+'</div></aside>';
  }
  function mobilePillHtml(){
    return '<button class="mobile-plan-pill" id="openPlanDrawer"><span>Mi plan · '+planIds().length+' productos</span><strong>'+fmt(planTotal())+'</strong></button>';
  }
  function roomToolbarHtml(room,count){
    return '<div class="room-toolbar"><div><b style="font-size:15px">'+room+'</b><div style="font-size:11px;color:var(--muted);margin-top:2px">'+count+' productos relevantes</div></div><button class="text-btn" id="viewAllRoom">Ver todo</button></div>';
  }
  function roomPreviewRow(p,room){
    var q=wholeQty(p,room), inplan=planQty(p.id)>0;
    return '<div class="room-product '+(inplan?'selected':'')+'" data-room-product="'+p.id+'"><div class="room-thumb">'+imageHTML(p)+'</div><div class="room-copy"><div class="brand">'+p.brand+'</div><b>'+p.name+'</b><small>'+(p.priceVerified?'Precio público verificado':'Precio e inventario según tienda')+'</small><a class="live-link" target="_blank" rel="noopener" href="'+productSearchLink(p)+'" onclick="event.stopPropagation()">Plaza Lama ↗</a></div><div class="room-side"><strong>'+priceText(p,q)+'</strong><div class="qtylabel">x'+q+'</div><button class="room-add '+(inplan?'inplan':'')+'" data-plan-add="'+p.id+'" data-default-qty="'+q+'">'+(inplan?'En mi plan':'Agregar')+'</button></div></div>';
  }
  function renderPlanView(){
    ensurePlan(); seedPlan();
    var rooms=wholeRooms();
    if(!rooms.length) return '<div class="plan-top"><h3>Elige al menos un espacio.</h3><p>Vuelve a editar el plan para seleccionar dormitorios, sala, comedor, cocina, baños u otros espacios.</p></div><div class="plan-summary"><div class="summary-actions"><button class="outline" id="editPlan2">Editar plan</button></div></div>';
    var room=(rooms.indexOf(S.guide.room)>=0?S.guide.room:rooms[0]); S.guide.room=room;
    var list=wholeProducts(room);
    var preview=list.slice(0,5);
    return '<div class="plan-top"><h3>'+(S.guide.mission==='airbnb'?'Airbnb · '+S.guide.bedrooms+' hab · '+S.guide.guests+' huéspedes':'Tu plan de compra')+'</h3><p>Tu carrito se arma a la izquierda. En móvil toca “Mi plan”. Puedes entrar a cada espacio y ver todo su catálogo.</p></div>'+
      mobilePillHtml()+
      '<div class="plan-layout">'+railHtml()+'<main class="room-main"><div class="room-tabs">'+rooms.map(function(r){return '<button class="room-tab '+(r===room?'active':'')+'" data-room="'+r+'">'+r+'</button>';}).join('')+'</div>'+
      '<div class="room-section">'+roomToolbarHtml(room,list.length)+(preview.length?preview.map(function(p){return roomPreviewRow(p,room)}).join(''):'<div class="room-empty">No te falta nada de este espacio según lo que marcaste.</div>')+'</div></main></div>'+
      '<div class="plan-summary"><div class="summary-line"><span>Presupuesto</span><strong>'+fmt(S.guide.budget)+'</strong></div><div class="summary-actions"><button class="outline" id="editPlan2">Editar respuestas</button><button class="solid" id="addPlan2">Pasar plan al carrito</button></div></div>';
  }
  function roomCatalogProducts(room){
    var list=wholeProducts(room);
    var f=S.guide.roomFilter||'Todos';
    if(f!=='Todos') list=list.filter(function(p){return (p.subcat||p.cat||'Otros')===f;});
    return list;
  }
  function roomCatalogCard(p,room){
    var inplan=planQty(p.id)>0, q=wholeQty(p,room);
    return '<article class="room-catalog-card"><div class="room-catalog-photo">'+imageHTML(p)+'</div><div class="room-catalog-body"><div class="brand">'+p.brand+'</div><b>'+p.name+'</b><div class="room-catalog-price">'+(p.priceVerified?fmt(p.price):'Ver precio actual')+'</div><div class="room-catalog-actions"><button class="view-product" data-room-detail="'+p.id+'">Ver</button><button class="add-plan '+(inplan?'inplan':'')+'" data-plan-add="'+p.id+'" data-default-qty="'+q+'">'+(inplan?'En plan':'Agregar')+'</button></div></div></article>';
  }
  function renderRoomCatalog(){
    ensurePlan(); seedPlan();
    var room=S.guide.catalogRoom||S.guide.room||'Comedor';
    var all=wholeProducts(room), filters=['Todos'].concat(Array.from(new Set(all.map(function(p){return p.subcat||p.cat||'Otros';}))));
    var list=roomCatalogProducts(room);
    return mobilePillHtml()+'<div class="plan-layout">'+railHtml()+'<main class="room-main"><div class="room-catalog-head"><button class="back" id="backToPlan">'+ICONS.back+'</button><div><h3>'+room+'</h3><p>'+all.length+' productos relacionados · selecciona lo que quieras</p></div></div><div class="room-catalog-controls">'+filters.map(function(f){return '<button class="room-filter '+((S.guide.roomFilter||'Todos')===f?'active':'')+'" data-room-filter="'+f+'">'+f+'</button>';}).join('')+'</div><div class="room-catalog-grid">'+(list.length?list.map(function(p){return roomCatalogCard(p,room)}).join(''):'<div class="room-empty">No hay productos en este filtro.</div>')+'</div></main></div>';
  }
  var baseRenderWholePlan=renderWholePlan;
  renderWholePlan=function(){
    ensurePlan();
    if(S.guide.catalogRoom) return renderRoomCatalog();
    return renderPlanView();
  };

  function drawPlanDrawer(){
    var old=document.getElementById('planDrawer');
    if(old) old.remove();
    var wrap=document.createElement('div');
    wrap.id='planDrawer'; wrap.className='plan-drawer';
    wrap.innerHTML='<div class="plan-drawer-panel"><div class="plan-drawer-head"><h3>Mi plan</h3><button class="plan-drawer-close" id="closePlanDrawer">'+ICONS.close+'</button></div><div class="plan-items">'+planListHtml()+'</div><div class="plan-rail-foot">'+budgetHtml()+'</div></div>';
    document.body.appendChild(wrap);
    document.getElementById('closePlanDrawer').onclick=function(){wrap.classList.remove('show')};
    wrap.onclick=function(e){if(e.target===wrap)wrap.classList.remove('show')};
    bindPlanRemovers(wrap);
    return wrap;
  }
  function bindPlanRemovers(scope){
    (scope||document).querySelectorAll('[data-plan-remove]').forEach(function(b){
      b.onclick=function(){setPlan(b.dataset.planRemove,0);var d=document.getElementById('planDrawer');if(d)d.remove();};
    });
  }
  var baseBindWholeHome=bindWholeHome;
  bindWholeHome=function(){
    baseBindWholeHome();
    ensurePlan();
    var x=document.getElementById('openPlanDrawer');
    if(x)x.onclick=function(){drawPlanDrawer().classList.add('show')};
    bindPlanRemovers(document);
    document.querySelectorAll('[data-plan-add]').forEach(function(b){
      b.onclick=function(e){e.stopPropagation();var id=b.dataset.planAdd, q=Number(b.dataset.defaultQty||1); if(planQty(id)>0)setPlan(id,0); else addPlan(id,q);};
    });
    x=document.getElementById('viewAllRoom');
    if(x)x.onclick=function(){S.guide.catalogRoom=S.guide.room;S.guide.roomFilter='Todos';renderWholeHome()};
    x=document.getElementById('backToPlan');
    if(x)x.onclick=function(){S.guide.catalogRoom=null;renderWholeHome()};
    document.querySelectorAll('[data-room-filter]').forEach(function(b){b.onclick=function(){S.guide.roomFilter=b.dataset.roomFilter;renderWholeHome()}});
    document.querySelectorAll('[data-room]').forEach(function(b){b.onclick=function(){S.guide.room=b.dataset.room;S.guide.catalogRoom=null;renderWholeHome()}});
    x=document.getElementById('addPlan2');
    if(x)x.onclick=function(){
      planIds().forEach(function(id){var p=byId(id);if(p&&!p.unavailable)addCart(id,S.guide.plan[id]);});
      closeOverlay('guideOverlay');openCart();
    };
    x=document.getElementById('editPlan2');
    if(x)x.onclick=function(){S.guide.catalogRoom=null;S.guide.step=2;renderWholeHome()};
  };
})();
