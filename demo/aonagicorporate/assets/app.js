const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('#main-nav');
function closeMenu(){menuButton?.setAttribute('aria-expanded','false');menu?.classList.remove('open');}
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menu.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();menuButton?.focus();}});
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>{e.classList.add('will-reveal');observer.observe(e);});}
const form=document.querySelector('#contact-form');
const confirmation=document.querySelector('#confirmation');
form?.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);document.querySelector('#chosen-topic').textContent=data.get('topic');document.querySelector('#chosen-phase').textContent=data.get('phase');form.hidden=true;confirmation.hidden=false;confirmation.focus();});
document.querySelector('#back-to-form')?.addEventListener('click',()=>{confirmation.hidden=true;form.hidden=false;form.querySelector('input:checked')?.focus();});
const focus=new URLSearchParams(location.search).get('focus');
if(['strategy','operations','growth'].includes(focus)){document.getElementById(focus)?.scrollIntoView();}
