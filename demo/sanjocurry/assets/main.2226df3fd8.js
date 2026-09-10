const toggle=document.querySelector('.nav-toggle'),mobile=document.querySelector('#mobile-nav');
function closeNav(){toggle.setAttribute('aria-expanded','false');mobile.hidden=true;toggle.querySelector('span').textContent='＋'}
toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));mobile.hidden=expanded;toggle.querySelector('span').textContent=expanded?'＋':'−'});
mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav()});
const tabs=[...document.querySelectorAll('[role=tab]')];
function activateTab(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active})}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>activateTab(tab));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%tabs.length;if(e.key==='ArrowLeft')next=(i-1+tabs.length)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();activateTab(tabs[next]);tabs[next].focus()}})});
const notice=document.querySelector('#notice'),noticeText=document.querySelector('#notice-text');
function showNotice(text){noticeText.textContent=text;notice.showModal()}
document.querySelectorAll('[data-notice]').forEach(b=>b.addEventListener('click',()=>showNotice(b.dataset.notice)));
document.querySelectorAll('.dialog-close,.dialog-done').forEach(b=>b.addEventListener('click',()=>notice.close()));
notice.addEventListener('click',e=>{if(e.target===notice){const r=notice.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)notice.close()}});
document.querySelector('#contact-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);showNotice('入力内容の確認（デモ・未送信）\n\nお名前：'+data.get('name')+'\nメール：'+data.get('email')+'\nお問い合わせ：'+data.get('message')+'\n\n内容は送信・保存されません。本公開時に受信先と迷惑メール対策を設定します。')});
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pending');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pending');observer.observe(el)}})}
