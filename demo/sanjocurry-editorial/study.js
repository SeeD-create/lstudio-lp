(()=>{
const params=new URLSearchParams(location.search),allowed=['editorial'];
function select(name){if(!allowed.includes(name))name='classic';document.body.dataset.style=name;document.querySelectorAll('.hero').forEach(s=>{s.hidden=!s.classList.contains('hero-'+name)});document.querySelectorAll('.style-picker button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.style===name)));const u=new URL(location.href);u.searchParams.set('style',name);history.replaceState(null,'',u);scrollTo({top:0,behavior:'instant'});}
select(params.get('style')||'editorial');document.querySelectorAll('.style-picker button').forEach(b=>b.addEventListener('click',()=>select(b.dataset.style)));
if(params.has('compare'))document.body.classList.add('compare-mode');
if(params.has('embed'))document.body.classList.add('embedded');
if(location.hash){requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant'}));}
const detail={beef:'欧風ビーフカレー — コクのあるソースとビーフを楽しむひと皿。',cheese:'チーズカレー — カレーとチーズのまろやかな組み合わせ。',vegetable:'彩り野菜カレー — 野菜の色と食感を楽しむひと皿。'};
document.querySelectorAll('[data-menu]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-menu]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));document.querySelector('.menu-detail').textContent=detail[b.dataset.menu];}));
})();
