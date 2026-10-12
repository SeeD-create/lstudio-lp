document.addEventListener('DOMContentLoaded',()=>{
 const dialog=document.querySelector('.zoom-dialog');
 if(dialog){dialog.setAttribute('aria-label','画像の拡大表示');const scroll=dialog.querySelector('.zoom-scroll');if(scroll){scroll.tabIndex=0;scroll.setAttribute('aria-label','拡大画像（矢印キーでスクロールできます）')}}
 const openDetails=()=>{if(location.hash==='#individual'){const details=document.getElementById('individual');if(details?.matches('details'))details.open=true}};
 document.querySelectorAll('[data-open-details]').forEach(a=>a.addEventListener('click',()=>{const details=document.getElementById(a.dataset.openDetails);if(details)details.open=true}));
 window.addEventListener('hashchange',openDetails);openDetails();
});
