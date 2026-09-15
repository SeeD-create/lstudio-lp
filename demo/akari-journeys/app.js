const menu=document.querySelector('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.querySelector('.site-header').classList.toggle('menu-open',open);});
document.querySelectorAll('.site-header nav a').forEach(a=>a.addEventListener('click',()=>{menu?.setAttribute('aria-expanded','false');document.querySelector('.site-header').classList.remove('menu-open');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');document.querySelector('.site-header').classList.remove('menu-open');menu.focus();}});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if(!reduced.matches&&'IntersectionObserver' in window){document.documentElement.classList.add('js-motion');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));reduced.addEventListener('change',e=>{if(e.matches){document.documentElement.classList.remove('js-motion');observer.disconnect();}});}
const form=document.querySelector('#planner');
if(form){
 const msg=JSON.parse(document.querySelector('#form-messages').textContent);
 const result=document.querySelector('#result');
 const arrival=form.elements.arrival,departure=form.elements.departure;
 const error=document.querySelector('#form-error');
 const choice=new URLSearchParams(location.search).get('interest');
 if(['0','1','2'].includes(choice)) form.querySelector(`input[name="interest"][value="${choice}"]`).checked=true;
 // Language changes retain only the selected public idea, never entered form data.
 if(['0','1','2'].includes(choice)) document.querySelectorAll('.languages a').forEach(a=>{a.href+='?interest='+choice;});
 arrival.addEventListener('change',()=>{if(arrival.value){const next=new Date(arrival.value+'T00:00:00Z');next.setUTCDate(next.getUTCDate()+1);departure.min=next.toISOString().slice(0,10);}else departure.removeAttribute('min');});
 form.addEventListener('submit',e=>{
  e.preventDefault();error.textContent='';
  if(!form.reportValidity()) return;
  if(arrival.value&&departure.value&&departure.value<=arrival.value){error.textContent=msg.date_error;departure.focus();return;}
  const interests=[...form.querySelectorAll('[name=interest]:checked')].map(el=>msg.interest_options[Number(el.value)]);
  if(!interests.length){error.textContent=msg.interest_error;form.querySelector('[name=interest]').focus();return;}
  const fmt=v=>v?new Intl.DateTimeFormat(document.documentElement.lang,{dateStyle:'long',timeZone:'UTC'}).format(new Date(v+'T12:00:00Z')):msg.open_date;
  document.querySelector('#summary-text').textContent=[`${msg.when}: ${fmt(arrival.value)}`,`${msg.until}: ${fmt(departure.value)}`,`${msg.guests}: ${form.elements.guests.value}`,`${msg.pace}: ${form.elements.pace.value}`,`${msg.interests}: ${interests.join(', ')}`].join('\n');
  form.hidden=true;result.hidden=false;document.querySelector('#copy-status').textContent='';document.querySelector('#result-title').focus();
 });
 document.querySelector('#edit').addEventListener('click',()=>{result.hidden=true;form.hidden=false;arrival.focus();});
 document.querySelector('#copy').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(msg.summary+'\n\n'+document.querySelector('#summary-text').textContent+'\n\n'+msg.summary_note);document.querySelector('#copy-status').textContent=msg.copied;}catch{document.querySelector('#copy-status').textContent=msg.copy_fail;}});
 document.querySelector('#planner-controls').disabled=false;
}
