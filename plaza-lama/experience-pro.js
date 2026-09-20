/* Pro customer interactions layered on top of planner.js */
(function(){
  var STORE='plaza_lama_demo_v3', undoTimer=null;

  function safeSave(){
    try{
      localStorage.setItem(STORE,JSON.stringify({
        favorites:Array.from(S.favorites||[]),
        cart:S.cart||[],
        location:S.location,mode:S.mode
      }));
    }catch(e){}
  }
  function safeRestore(){
    try{
      var raw=localStorage.getItem(STORE); if(!raw)return;
      var d=JSON.parse(raw);
      if(Array.isArray(d.favorites))S.favorites=new Set(d.favorites);
      if(Array.isArray(d.cart))S.cart=d.cart;
      if(d.location)S.location=d.location;
      if(d.mode)S.mode=d.mode;
    }catch(e){}
  }
  safeRestore();

  var oldToggle=toggleFav;
  toggleFav=function(id){oldToggle(id);safeSave();};
  var oldAddCart=addCart;
  addCart=function(id,qty,btn){oldAddCart(id,qty,btn);safeSave();};

  function planObj(){if(!S.guide.plan)S.guide.plan={};return S.guide.plan}
  function planIdsPro(){return Object.keys(planObj())}
  function planTotalPro(){return planIdsPro().reduce(function(sum,id){var p=byId(id),q=planObj()[id]||0;return sum+(p&&p.price?p.price*q:0)},0)}
  function favCount(){return S.favorites?S.favorites.size:0}
  function favOn(id){return S.favorites&&S.favorites.has(id)}
  function currentSelectedRoomFor(p){
    var rooms=(p.rooms||[]).filter(function(r){return S.guide.spaces&&S.guide.spaces.has(r)});
    return rooms[0]||((p.rooms||[])[0])||S.guide.room||'Sala';
  }
  function needLabel(p){
    var m={tv:'televisores',aire:'climatización',nevera:'neveras',lavadora:'lavadoras',microondas:'microondas',almohada:'almohadas',cortina:'cortinas',cubiertos:'cubiertos',plato:'vajilla',bowl:'vajilla',sofa:'sofás',silla:'sillas',toallas:'toallas',jabon:'accesorios de baño'};
    return m[p.need]||((p.subcat||p.cat||'productos').toLowerCase());
  }
  function liveSearchUrl(p){
    var q=p.need==='tv'?'Televisor':p.need==='aire'?'Aire acondicionado':p.need==='nevera'?'Nevera':p.need==='lavadora'?'Lavadora':p.need==='sofa'?'Sofa':p.subcat||p.cat||p.name;
    return 'https://www.plazalama.com.do/search?name='+encodeURIComponent(q);
  }

  function addHeart(el,id){
    if(!el||el.querySelector('.room-heart'))return;
    var b=document.createElement('button');
    b.className='room-heart'+(favOn(id)?' active':'');
    b.innerHTML=ICONS.heart;b.setAttribute('aria-label','Guardar producto');
    b.onclick=function(e){e.stopPropagation();toggleFav(id);b.classList.toggle('active',favOn(id));enhanceFavoritesCounts();};
    el.appendChild(b);
  }
  function enhanceHearts(){
    document.querySelectorAll('.room-product[data-room-product]').forEach(function(el){addHeart(el,el.dataset.roomProduct)});
    document.querySelectorAll('.room-catalog-card').forEach(function(el){
      var b=el.querySelector('[data-room-detail]'); if(b)addHeart(el,b.dataset.roomDetail);
    });
  }
  function enhanceFavoritesCounts(){
    var val=String(favCount());
    document.querySelectorAll('[data-fav-tab-count]').forEach(function(x){if(x.textContent!==val)x.textContent=val});
  }

  function showUndo(id,qty){
    var old=document.getElementById('undoSnack');if(old)old.remove();
    var s=document.createElement('div');s.id='undoSnack';s.className='undo-snack';
    s.innerHTML='<span>Producto eliminado</span><button>Deshacer</button>';
    document.body.appendChild(s);requestAnimationFrame(function(){s.classList.add('show')});
    s.querySelector('button').onclick=function(){planObj()[id]=qty;s.remove();renderWholeHome()};
    clearTimeout(undoTimer);undoTimer=setTimeout(function(){if(s.isConnected){s.classList.remove('show');setTimeout(function(){s.remove()},220)}},4200);
  }
  function wrapSwipe(item){
    if(!item||item.closest('.swipe-wrap'))return;
    var rem=item.querySelector('[data-plan-remove]');if(!rem)return;
    var id=rem.dataset.planRemove, qty=planObj()[id]||1, p=byId(id);if(!p)return;
    rem.style.display='none';

    var tools=document.createElement('div');tools.className='plan-tools';
    tools.innerHTML='<div class="plan-qty"><button data-pro-minus>'+ICONS.minus+'</button><b>'+qty+'</b><button data-pro-plus>'+ICONS.plus+'</button></div>'+
      '<button class="plan-tool change">Ver opciones</button>'+
      '<button class="plan-tool heart '+(favOn(id)?'active':'')+'">'+ICONS.heart+' Guardar</button>';
    var first=item.firstElementChild; if(first) first.appendChild(tools);

    tools.querySelector('[data-pro-minus]').onclick=function(e){e.stopPropagation();var q=(planObj()[id]||1)-1;if(q<=0){delete planObj()[id];showUndo(id,qty)}else planObj()[id]=q;renderWholeHome()};
    tools.querySelector('[data-pro-plus]').onclick=function(e){e.stopPropagation();planObj()[id]=(planObj()[id]||0)+1;renderWholeHome()};
    tools.querySelector('.change').onclick=function(e){
      e.stopPropagation();S.guide.replacingId=id;S.guide.catalogRoom=currentSelectedRoomFor(p);S.guide.roomFilter=p.subcat||p.cat||'Todos';renderWholeHome();
    };
    tools.querySelector('.heart').onclick=function(e){e.stopPropagation();toggleFav(id);renderWholeHome()};

    var parent=item.parentNode, shell=document.createElement('div'), del=document.createElement('button'), front=document.createElement('div');
    shell.className='swipe-wrap';del.className='swipe-delete';del.textContent='Eliminar';front.className='swipe-front';
    parent.insertBefore(shell,item);shell.appendChild(del);shell.appendChild(front);front.appendChild(item);
    del.onclick=function(){delete planObj()[id];showUndo(id,qty);renderWholeHome()};

    var start=0,dx=0;
    front.addEventListener('touchstart',function(e){start=e.touches[0].clientX;dx=0},{passive:true});
    front.addEventListener('touchmove',function(e){
      dx=e.touches[0].clientX-start;
      if(dx<0)front.style.transform='translateX('+Math.max(-84,dx)+'px)';
      else if(front.classList.contains('open'))front.style.transform='translateX('+Math.min(0,-84+dx)+'px)';
    },{passive:true});
    front.addEventListener('touchend',function(){
      var open=dx<-42;front.classList.toggle('open',open);front.style.transform='';
    });
  }
  function enhancePlanItems(){
    document.querySelectorAll('.plan-item').forEach(wrapSwipe);
  }

  function budgetStats(){
    var summary=document.querySelector('.plan-summary');if(!summary||summary.querySelector('.customer-budget-card'))return;
    var total=planTotalPro(),budget=Number(S.guide.budget||0),left=budget-total;
    var card=document.createElement('div');card.className='customer-budget-card';
    card.innerHTML='<div class="budget-stat"><span>Presupuesto</span><strong>'+fmt(budget)+'</strong></div>'+
      '<div class="budget-stat"><span>Plan actual</span><strong>'+fmt(total)+'</strong></div>'+
      '<div class="budget-stat '+(left>=0?'remaining':'over')+'"><span>'+(left>=0?'Te quedan':'Exceso')+'</span><strong>'+fmt(Math.abs(left))+'</strong></div>';
    var actions=summary.querySelector('.summary-actions');summary.insertBefore(card,actions||summary.firstChild);
    var pill=document.querySelector('.mobile-plan-pill');
    if(pill){
      pill.innerHTML='<span>Mi plan · '+planIdsPro().length+' productos<small style="display:block;font-size:9px;opacity:.7;margin-top:2px">'+(left>=0?'Te quedan '+fmt(left):'Sobre presupuesto '+fmt(-left))+'</small></span><strong>'+fmt(total)+'</strong>';
    }
  }

  function completionChips(){
    var top=document.querySelector('.plan-top');if(!top||top.querySelector('.plan-completion'))return;
    var rooms=(typeof wholeRooms==='function'?wholeRooms():[]);
    var wrap=document.createElement('div');wrap.className='plan-completion';
    rooms.forEach(function(room){
      var total=(typeof wholeProducts==='function'?wholeProducts(room):[]).length;
      var selected=(typeof wholeProducts==='function'?wholeProducts(room):[]).filter(function(p){return planObj()[p.id]>0}).length;
      var c=document.createElement('div');c.className='completion-chip'+(total&&selected>=Math.min(total,3)?' done':'');
      c.innerHTML='<i></i>'+room+' · '+selected+' elegidos';wrap.appendChild(c);
    });
    top.appendChild(wrap);
  }

  function openFavDrawer(){
    var old=document.getElementById('favDrawer');if(old)old.remove();
    var wrap=document.createElement('div');wrap.id='favDrawer';wrap.className='fav-drawer show';
    var ids=Array.from(S.favorites||[]);
    var body=ids.length?ids.map(function(id){
      var p=byId(id);if(!p)return '';
      return '<div class="fav-card"><div class="fav-img">'+imageHTML(p)+'</div><div><b>'+p.name+'</b><small>'+p.brand+' · '+(p.priceVerified?fmt(p.price):'precio según tienda')+'</small></div><div class="fav-actions"><button class="fav-view" data-fav-view="'+id+'">Ver</button><button class="fav-add" data-fav-add="'+id+'">Agregar</button></div></div>';
    }).join(''):'<div class="plan-empty">Todavía no has guardado productos. Toca el corazón de cualquier opción.</div>';
    wrap.innerHTML='<div class="fav-panel"><div class="fav-head"><h3>Mis favoritos</h3><button class="plan-drawer-close" id="favClose">'+ICONS.close+'</button></div>'+body+'</div>';
    document.body.appendChild(wrap);
    document.getElementById('favClose').onclick=function(){wrap.remove()};
    wrap.onclick=function(e){if(e.target===wrap)wrap.remove()};
    wrap.querySelectorAll('[data-fav-view]').forEach(function(b){b.onclick=function(){openDetail(b.dataset.favView)}});
    wrap.querySelectorAll('[data-fav-add]').forEach(function(b){b.onclick=function(){var p=byId(b.dataset.favAdd),room=currentSelectedRoomFor(p),q=typeof wholeQty==='function'?wholeQty(p,room):1;planObj()[p.id]=(planObj()[p.id]||0)+q;wrap.remove();renderWholeHome()}});
  }
  function addFavoriteEntryPoints(){
    var railHead=document.querySelector('.plan-rail-head');
    if(railHead&&!railHead.querySelector('.plan-tabs')){
      var tabs=document.createElement('div');tabs.className='plan-tabs';
      tabs.innerHTML='<button class="plan-tab active">Mi plan</button><button class="plan-tab" data-open-favs>Favoritos <span class="fav-count" data-fav-tab-count>'+favCount()+'</span></button>';
      railHead.appendChild(tabs);
    }

    var drawerPanel=document.querySelector('#planDrawer .plan-drawer-panel');
    var drawerHead=document.querySelector('#planDrawer .plan-drawer-head');
    if(drawerPanel&&drawerHead&&!drawerPanel.querySelector('.drawer-plan-tabs')){
      var dt=document.createElement('div');
      dt.className='plan-tabs drawer-plan-tabs';
      dt.innerHTML='<button class="plan-tab active">Mi plan</button><button class="plan-tab" data-open-favs>Favoritos <span class="fav-count" data-fav-tab-count>'+favCount()+'</span></button>';
      drawerHead.insertAdjacentElement('afterend',dt);
    }

    var pill=document.querySelector('.mobile-plan-pill');
    if(pill&&!document.getElementById('mobileFavButton')){
      var b=document.createElement('button');b.id='mobileFavButton';b.className='plan-tab';b.style.margin='0 0 10px 0';b.innerHTML='♡ Mis favoritos <span class="fav-count" data-fav-tab-count>'+favCount()+'</span>';
      pill.insertAdjacentElement('afterend',b);
    }
    document.querySelectorAll('[data-open-favs],#mobileFavButton').forEach(function(b){b.onclick=openFavDrawer});
  }

  function alternativeBanner(){
    if(!S.guide.replacingId||!S.guide.catalogRoom)return;
    var main=document.querySelector('.room-main');if(!main||main.querySelector('.alternative-banner'))return;
    var p=byId(S.guide.replacingId);if(!p)return;
    var banner=document.createElement('div');banner.className='alternative-banner';
    banner.innerHTML='<div><b>Cambiar '+p.name+'</b><small>Elige otra opción de '+needLabel(p)+'. Tu cantidad se conserva.</small></div><a href="'+liveSearchUrl(p)+'" target="_blank" rel="noopener">Ver todos en Plaza Lama ↗</a>';
    main.insertBefore(banner,main.firstChild);
    var old=document.getElementById('backToPlan');if(old){var prev=old.onclick;old.onclick=function(){S.guide.replacingId=null;if(prev)prev()}};
    document.querySelectorAll('[data-plan-add]').forEach(function(b){
      var id=b.dataset.planAdd;if(id===S.guide.replacingId)return;
      var target=byId(id);if(!target)return;
      if(p.need&&target.need!==p.need){b.closest('.room-catalog-card')&& (b.closest('.room-catalog-card').style.display='none');return;}
      b.onclick=function(e){
        e.stopPropagation();
        var q=planObj()[S.guide.replacingId]||Number(b.dataset.defaultQty||1);
        delete planObj()[S.guide.replacingId];planObj()[id]=q;S.guide.replacingId=null;S.guide.catalogRoom=null;S.guide.roomFilter='Todos';renderWholeHome();toast('Producto cambiado');
      };
    });
  }

  function catalogSearch(){
    var head=document.querySelector('.room-catalog-head');if(!head||document.querySelector('.catalog-search-row'))return;
    var row=document.createElement('div');row.className='catalog-search-row';
    row.innerHTML='<input class="catalog-search" id="catalogSearch" placeholder="Buscar dentro de este espacio"><select class="catalog-sort" id="catalogSort"><option value="default">Relevancia</option><option value="low">Precio ↑</option><option value="high">Precio ↓</option></select>';
    head.insertAdjacentElement('afterend',row);
    var input=row.querySelector('#catalogSearch'),sort=row.querySelector('#catalogSort');
    function apply(){
      var q=input.value.trim().toLowerCase(),cards=Array.from(document.querySelectorAll('.room-catalog-card'));
      cards.forEach(function(c){
        var id=(c.querySelector('[data-room-detail]')||{}).dataset?.roomDetail,p=id&&byId(id);
        c.style.display=(!q||p&&(p.name+' '+p.brand+' '+(p.subcat||'')).toLowerCase().indexOf(q)>=0)?'':'none';
      });
      var grid=document.querySelector('.room-catalog-grid');if(!grid)return;
      if(sort.value!=='default'){
        cards.sort(function(a,b){
          var pa=byId(a.querySelector('[data-room-detail]').dataset.roomDetail),pb=byId(b.querySelector('[data-room-detail]').dataset.roomDetail);
          return sort.value==='low'?(pa.price||1e12)-(pb.price||1e12):(pb.price||0)-(pa.price||0);
        }).forEach(function(c){grid.appendChild(c)});
      }
    }
    input.oninput=apply;sort.onchange=apply;
  }

  function persistPlan(){
    safeSave();
  }

  var baseBind=bindWholeHome;
  bindWholeHome=function(){
    baseBind();
    enhanceHearts();enhancePlanItems();budgetStats();completionChips();addFavoriteEntryPoints();alternativeBanner();catalogSearch();enhanceFavoritesCounts();persistPlan();
  };

  var obs=new MutationObserver(function(mutations){
    var needs=false;
    mutations.forEach(function(m){
      Array.from(m.addedNodes||[]).forEach(function(n){
        if(n.nodeType===1 && (n.id==='planDrawer' || (n.matches&&n.matches('.plan-item')) || (n.querySelector&&n.querySelector('.plan-item')))) needs=true;
      });
    });
    if(needs){enhancePlanItems();addFavoriteEntryPoints();enhanceFavoritesCounts();}
  });
  obs.observe(document.body,{childList:true,subtree:true});

  window.addEventListener('beforeunload',safeSave);
})();