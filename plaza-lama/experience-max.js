/* Cart alternatives, product-level similar options, and swipe delete */
(function(){
  function favOn(id){return S.favorites&&S.favorites.has(id)}
  function currentRoomFor(p){return ((p.rooms||[]).find(r=>S.guide.spaces&&S.guide.spaces.has(r)))||((p.rooms||[])[0])||'Sala'}
  function externalSearch(p){
    var q=p.need==='tv'?'Televisor':p.need==='aire'?'Aire acondicionado':p.need==='nevera'?'Nevera':p.need==='lavadora'?'Lavadora':p.need==='microondas'?'Microondas':p.need==='sofa'?'Sofa':p.subcat||p.cat||p.name;
    return 'https://www.plazalama.com.do/search?name='+encodeURIComponent(q)
  }
  function sameNeedProducts(p){
    if(!p)return[];
    var list=PRODUCTS.filter(function(x){return x.id!==p.id&&!x.unavailable&&((p.need&&x.need===p.need)||(p.subcat&&x.subcat===p.subcat)||(p.cat&&x.cat===p.cat))});
    var seen={};return list.filter(function(x){if(seen[x.id])return false;seen[x.id]=1;return true});
  }
  function ensureAltModal(){
    var m=document.getElementById('altModal');if(m)return m;
    m=document.createElement('div');m.id='altModal';m.className='alt-modal';document.body.appendChild(m);return m;
  }
  function openAlternatives(id,context){
    var p=byId(id);if(!p)return;
    var m=ensureAltModal(),list=sameNeedProducts(p),ctx=context||{};
    var cards=[p].concat(list).map(function(x){
      var current=x.id===p.id;
      return '<article class="alt-card"><div class="alt-photo">'+imageHTML(x)+'</div><div class="alt-body"><div class="brand">'+x.brand+'</div><b>'+x.name+'</b><div class="alt-price">'+(x.priceVerified?fmt(x.price):'Ver precio actual')+'</div>'+(current?'<span class="alt-current">Actual</span>':'')+'<div class="alt-actions"><button class="alt-view" data-alt-view="'+x.id+'">Ver</button><button class="alt-select" data-alt-select="'+x.id+'" '+(current?'disabled style="opacity:.45"':'')+'>'+(ctx.mode==='replace'?'Cambiar':'Agregar')+'</button></div></div></article>'
    }).join('');
    m.innerHTML='<div class="alt-head"><button class="back" id="closeAlt">'+ICONS.back+'</button><div><h2>Opciones de '+((p.need==='tv')?'televisor':(p.subcat||p.cat||'producto').toLowerCase())+'</h2><p>Compara alternativas sin perder tu plan.</p></div></div><div class="alt-live"><div><b>Catálogo completo de Plaza Lama</b><small>El prototipo muestra opciones verificadas; el catálogo real puede tener más por tienda.</small></div><a href="'+externalSearch(p)+'" target="_blank" rel="noopener">Ver todos ↗</a></div><div class="alt-grid">'+cards+'</div>';
    m.classList.add('show');
    document.getElementById('closeAlt').onclick=function(){m.classList.remove('show')};
    m.querySelectorAll('[data-alt-view]').forEach(function(b){b.onclick=function(){openDetail(b.dataset.altView)}});
    m.querySelectorAll('[data-alt-select]').forEach(function(b){b.onclick=function(){
      var newId=b.dataset.altSelect;if(newId===id)return;
      if(ctx.source==='cart'){
        var item=S.cart.find(x=>x.id===id),q=item?item.qty:1;
        S.cart=S.cart.filter(x=>x.id!==id);var existing=S.cart.find(x=>x.id===newId);if(existing)existing.qty+=q;else S.cart.push({id:newId,qty:q});
        updateCartBadge();m.classList.remove('show');openCart();toast('Producto cambiado');
      }else if(ctx.source==='plan'){
        if(!S.guide.plan)S.guide.plan={};var q=S.guide.plan[id]||ctx.qty||1;delete S.guide.plan[id];S.guide.plan[newId]=q;m.classList.remove('show');renderWholeHome();toast('Producto cambiado');
      }else{
        var room=currentRoomFor(byId(newId)),q=typeof wholeQty==='function'?wholeQty(byId(newId),room):1;if(!S.guide.plan)S.guide.plan={};S.guide.plan[newId]=(S.guide.plan[newId]||0)+q;m.classList.remove('show');renderWholeHome();toast('Agregado a tu plan');
      }
    }});
  }

  var baseOpenDetail=openDetail;
  openDetail=function(id){
    baseOpenDetail(id);
    var p=byId(id),sh=document.getElementById('detailSheet');if(!p||!sh||sh.querySelector('.inline-actions'))return;
    var box=document.createElement('div');box.className='inline-actions';
    box.innerHTML='<button class="save-detail '+(favOn(id)?'active':'')+'" id="detailFav">'+ICONS.heart+' '+(favOn(id)?'Guardado':'Guardar')+'</button><button class="similar-btn" id="detailSimilar">Ver opciones similares</button>';
    var buy=sh.querySelector('.buyrow');sh.insertBefore(box,buy||null);
    document.getElementById('detailFav').onclick=function(){toggleFav(id);openDetail(id)};
    document.getElementById('detailSimilar').onclick=function(){openAlternatives(id,{mode:(S.guide.plan&&S.guide.plan[id])?'replace':'add',source:(S.guide.plan&&S.guide.plan[id])?'plan':'browse'})};
  };

  function enhanceCart(){
    var rows=Array.from(document.querySelectorAll('#cartSheet .cartitem'));
    rows.forEach(function(row,i){
      var item=S.cart[i];if(!item||row.dataset.maxed)return;row.dataset.maxed='1';
      var p=byId(item.id);if(!p)return;
      var middle=row.children[1];
      var extra=document.createElement('div');extra.className='cart-extra';
      extra.innerHTML='<button class="cart-options">Ver opciones</button><button class="cart-save '+(favOn(p.id)?'active':'')+'">'+(favOn(p.id)?'♥ Guardado':'♡ Guardar')+'</button>';
      middle.appendChild(extra);
      extra.querySelector('.cart-options').onclick=function(){openAlternatives(p.id,{mode:'replace',source:'cart'})};
      extra.querySelector('.cart-save').onclick=function(){toggleFav(p.id);openCart()};

      var parent=row.parentNode,shell=document.createElement('div'),del=document.createElement('button');
      shell.className='cart-swipe-wrap';del.className='cart-swipe-delete';del.textContent='Eliminar';
      parent.insertBefore(shell,row);shell.appendChild(del);shell.appendChild(row);
      var start=0,dx=0;
      row.addEventListener('touchstart',function(e){start=e.touches[0].clientX;dx=0},{passive:true});
      row.addEventListener('touchmove',function(e){dx=e.touches[0].clientX-start;if(dx<0)row.style.transform='translateX('+Math.max(-86,dx)+'px)'},{passive:true});
      row.addEventListener('touchend',function(){var open=dx<-42;row.classList.toggle('open',open);row.style.transform=''});
      del.onclick=function(){var old={id:item.id,qty:item.qty};S.cart=S.cart.filter(x=>x.id!==old.id);updateCartBadge();openCart();showCartUndo(old)};
    });
  }
  function showCartUndo(old){
    var prev=document.getElementById('cartUndo');if(prev)prev.remove();
    var s=document.createElement('div');s.id='cartUndo';s.className='undo-snack show';s.innerHTML='<span>Producto eliminado</span><button>Deshacer</button>';document.body.appendChild(s);
    s.querySelector('button').onclick=function(){var x=S.cart.find(a=>a.id===old.id);if(x)x.qty+=old.qty;else S.cart.push(old);updateCartBadge();s.remove();openCart()};
    setTimeout(function(){if(s.isConnected){s.classList.remove('show');setTimeout(()=>s.remove(),220)}},4200)
  }

  var baseOpenCart=openCart;
  openCart=function(){baseOpenCart();setTimeout(enhanceCart,0)};

  document.addEventListener('click',function(e){
    var b=e.target.closest('.plan-tool.change');if(!b)return;
  });
})();