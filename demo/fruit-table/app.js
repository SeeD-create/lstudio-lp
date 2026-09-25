const menu=document.querySelector('#menu');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('#navigation').classList.toggle('open',open)});
const motion=document.querySelector('#motion');
let stopped=matchMedia('(prefers-reduced-motion: reduce)').matches;
function applyMotion(){document.body.classList.toggle('stop-motion',stopped);motion.setAttribute('aria-pressed',String(stopped));motion.textContent=stopped?'動きを再開する':'動きを止める'}
applyMotion();motion.addEventListener('click',()=>{stopped=!stopped;applyMotion()});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;document.querySelectorAll('[data-category]').forEach(article=>{article.hidden=button.dataset.filter!=='all'&&article.dataset.category!==button.dataset.filter;if(!article.hidden)count++});document.querySelector('#filter-status').textContent=`${count}件の使い方`}));
const form=document.querySelector('#choice');
if(form){form.addEventListener('submit',event=>{event.preventDefault();document.querySelector('#selected-use').textContent=new FormData(form).get('use');form.hidden=true;document.querySelector('#preview').hidden=false;document.querySelector('#preview-title').focus()});document.querySelector('#edit').addEventListener('click',()=>{form.hidden=false;document.querySelector('#preview').hidden=true;form.querySelector('input:checked').focus()})}
