const header=document.querySelector('#header');const toggle=document.querySelector('.menu-toggle');const mobileNav=document.querySelector('.mobile-nav');
addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});
toggle.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);toggle.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く')});
mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','メニューを開く')}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
