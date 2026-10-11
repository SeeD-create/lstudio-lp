const routes=[...document.querySelectorAll('[data-route]')];
const views=[...document.querySelectorAll('[data-view]')];
function showView(name){
  views.forEach(v=>v.classList.toggle('active',v.dataset.view===name));
  document.querySelectorAll('.sidebar [data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===name));
  history.replaceState(null,'','#'+name);
  window.scrollTo({top:0,behavior:'smooth'});
}
routes.forEach(el=>el.addEventListener('click',e=>{e.preventDefault();showView(el.dataset.route)}));
const drawer=document.querySelector('.drawer');
const overlay=document.querySelector('.overlay');
function openDrawer(){drawer.classList.add('open');overlay.classList.add('open');drawer.setAttribute('aria-hidden','false')}
function closeDrawer(){drawer.classList.remove('open');overlay.classList.remove('open');drawer.setAttribute('aria-hidden','true')}
document.querySelectorAll('[data-customer="aoba"],.approval-card .wide').forEach(el=>el.addEventListener('click',openDrawer));
document.querySelectorAll('.drawer-close').forEach(el=>el.addEventListener('click',closeDrawer));
overlay.addEventListener('click',closeDrawer);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
document.querySelector('.approve').addEventListener('click',()=>{closeDrawer();const toast=document.querySelector('.toast');toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)});
document.querySelectorAll('.task input').forEach(input=>input.addEventListener('change',()=>input.closest('.task').classList.toggle('completed',input.checked)));
const initial=location.hash.slice(1);if(views.some(v=>v.dataset.view===initial))showView(initial);
