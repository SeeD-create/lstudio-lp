const menuButton=document.querySelector('.menu-button');
const mobileNav=document.querySelector('#mobile-nav');
menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));mobileNav.hidden=open;});
mobileNav.addEventListener('click',e=>{if(e.target.closest('a')){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){mobileNav.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.focus();}});
new IntersectionObserver(([entry])=>document.querySelector('.mobile-bottom').classList.toggle('visible',!entry.isIntersecting),{threshold:.1}).observe(document.querySelector('.hero'));
const filterButtons=[...document.querySelectorAll('[data-category]')];
const articles=[...document.querySelectorAll('.article')];
const articleDialog=document.querySelector('#article-preview');
document.querySelectorAll('[data-preview]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector('#preview-title').textContent=a.querySelector('h3').textContent;articleDialog.showModal();}));
document.querySelectorAll('.dialog-close,.dialog-back').forEach(b=>b.addEventListener('click',()=>articleDialog.close()));
articleDialog.addEventListener('click',e=>{if(e.target===articleDialog){const r=articleDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)articleDialog.close();}});
function filterArticles(category){
  filterButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.category===category)));
  let count=0;articles.forEach(a=>{a.hidden=category!=='all'&&a.dataset.kind!==category;if(!a.hidden)count++;});
  document.querySelector('#article-count').textContent=`${count}件の記事をご紹介`;
}
filterButtons.forEach(b=>b.addEventListener('click',()=>filterArticles(b.dataset.category)));
document.querySelectorAll('[data-filter]').forEach(a=>a.addEventListener('click',()=>filterArticles(a.dataset.filter)));
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.body.classList.add('motion-ready');
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('shown');revealObserver.unobserve(e.target);}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach(e=>revealObserver.observe(e));
}
