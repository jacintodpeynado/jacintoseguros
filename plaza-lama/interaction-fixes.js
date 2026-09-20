/* Interaction fixes discovered through customer-path review */
(function(){
  function guideScroll(){var s=document.getElementById('guideSheet');return s?s.scrollTop:0}
  function restoreGuideScroll(y){requestAnimationFrame(function(){var s=document.getElementById('guideSheet');if(s)s.scrollTop=y})}
  function reopenPlanDrawer(){
    requestAnimationFrame(function(){var b=document.getElementById('openPlanDrawer');if(b)b.click()})
  }
  function mutatePlan(id,qty,opts){
    if(!S.guide.plan)S.guide.plan={};
    if(qty<=0)delete S.guide.plan[id];else S.guide.plan[id]=qty;
    var y=guideScroll(),drawer=document.getElementById('planDrawer'),wasDrawer=!!(opts&&opts.drawer);
    if(drawer)drawer.remove();
    renderWholeHome();restoreGuideScroll(y);
    if(wasDrawer)reopenPlanDrawer();
  }
  function undoSnack(id,qty,wasDrawer){
    var old=document.getElementById('undoSnack');if(old)old.remove();
    var s=document.createElement('div');s.id='undoSnack';s.className='undo-snack show';s.innerHTML='<span>Producto eliminado</span><button>Deshacer</button>';document.body.appendChild(s);
    s.querySelector('button').onclick=function(){mutatePlan(id,qty,{drawer:wasDrawer});s.remove()};
    setTimeout(function(){if(s.isConnected){s.classList.remove('show');setTimeout(function(){s.remove()},220)}},4200);
  }
  function rebindPlanControls(){
    document.querySelectorAll('[data-plan-add]').forEach(function(b){
      if(S.guide.replacingId)return; // replacement flow is owned by experience-pro.js
      var id=b.dataset.planAdd,q=Number(b.dataset.defaultQty||1);
      b.onclick=function(e){
        e.stopPropagation();
        var y=guideScroll(),has=S.guide.plan&&S.guide.plan[id]>0;
        if(!S.guide.plan)S.guide.plan={};
        if(has)delete S.guide.plan[id];else S.guide.plan[id]=q;
        renderWholeHome();restoreGuideScroll(y);
        toast(has?'Quitado del plan':'Agregado a tu plan');
      };
    });
    document.querySelectorAll('.plan-item').forEach(function(item){
      var rem=item.querySelector('[data-plan-remove]');if(!rem)return;
      var id=rem.dataset.planRemove,wasDrawer=!!item.closest('#planDrawer');
      var minus=item.querySelector('[data-pro-minus]'),plus=item.querySelector('[data-pro-plus]');
      if(minus)minus.onclick=function(e){e.stopPropagation();var old=S.guide.plan[id]||1,next=old-1;if(next<=0){mutatePlan(id,0,{drawer:wasDrawer});undoSnack(id,old,wasDrawer)}else mutatePlan(id,next,{drawer:wasDrawer})};
      if(plus)plus.onclick=function(e){e.stopPropagation();mutatePlan(id,(S.guide.plan[id]||0)+1,{drawer:wasDrawer})};
      var shell=item.closest('.swipe-wrap'),del=shell&&shell.querySelector('.swipe-delete');
      if(del)del.onclick=function(){var old=S.guide.plan[id]||1;mutatePlan(id,0,{drawer:wasDrawer});undoSnack(id,old,wasDrawer)};
    });
  }
  var baseBind=bindWholeHome;
  bindWholeHome=function(){baseBind();rebindPlanControls()};

  var mo=new MutationObserver(function(muts){
    var useful=false;
    muts.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1&&(n.id==='planDrawer'||n.querySelector&&n.querySelector('.plan-item')))useful=true})});
    if(useful)setTimeout(rebindPlanControls,0);
  });
  mo.observe(document.body,{childList:true,subtree:true});
})();