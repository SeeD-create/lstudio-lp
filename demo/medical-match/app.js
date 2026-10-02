(() => {
 'use strict';
 const menu=document.querySelector('.menu'),nav=document.querySelector('#nav');
 const closeMenu=()=>{if(nav.contains(document.activeElement))menu.focus();menu.setAttribute('aria-expanded','false');nav.classList.remove('open')};
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true')closeMenu()});
 document.addEventListener('click',e=>{if(menu.getAttribute('aria-expanded')==='true'&&!e.target.closest('.site-header'))closeMenu()});
 const pageName=document.body.dataset.page;
 nav.querySelectorAll('a').forEach(a=>{if(a.getAttribute('href')===pageName+'.html')a.setAttribute('aria-current','page')});
 const filterButton=document.querySelector('#search');
 if(filterButton){
  const role=document.querySelector('#role'),style=document.querySelector('#style');const initial=new URLSearchParams(location.search);
  if([...role.options].some(o=>o.value===initial.get('role')))role.value=initial.get('role');if([...style.options].some(o=>o.value===initial.get('style')))style.value=initial.get('style');
  const filter=()=>{let count=0;document.querySelectorAll('[data-role]').forEach(card=>{card.hidden=!!((role.value&&role.value!==card.dataset.role)||(style.value&&style.value!==card.dataset.style));if(!card.hidden)count++});document.querySelector('#jobStatus').textContent=count+'件の架空求人';document.querySelector('#empty').hidden=count!==0;const url=new URL(location.href);for(const [k,v]of [['role',role.value],['style',style.value]])v?url.searchParams.set(k,v):url.searchParams.delete(k);try{history.replaceState(null,'',url)}catch{}};
  filterButton.addEventListener('click',filter);role.addEventListener('change',filter);style.addEventListener('change',filter);filter();
 }
 const form=document.querySelector('#entry');if(!form)return;
 const controls=form.elements;form.reset();
 const query=new URLSearchParams(location.search),type=controls.type,facility=document.querySelector('#facilityName');
 const jobs={nurse:['みなと総合クリニック（架空）','看護師','常勤'],doctor:['青葉在宅ケア（架空）','医師','非常勤'],office:['ひかり訪問看護室（架空）','医療事務','常勤']};
 let job=jobs[query.get('job')]||null;
 const interests={life:'暮らしとのバランス',career:'これまでの経験',new:'新しい環境への一歩'};
 const interest=interests[query.get('interest')];
 if(query.get('type')==='facility')type.value='facility';
 if(job){controls.role.value=job[1];controls.style.value=job[2]}
 if(interest){const el=document.querySelector('#selectedInterest');el.hidden=false;el.textContent='大切にしたいこと：'+interest}
 const selected=document.querySelector('#selectedJob');selected.setAttribute('role','status');
 const clearJob=()=>{const restore=selected.contains(document.activeElement);job=null;const url=new URL(location.href);url.searchParams.delete('job');try{history.replaceState(null,'',url)}catch{}updateType();selected.textContent='求人の指定を解除しました。一般の働き方相談として確認します。';if(restore){selected.tabIndex=-1;selected.focus({preventScroll:true})}};
 function updateType(){const employer=type.value==='facility';facility.hidden=!employer;controls.facility.required=employer;document.querySelector('#roleLabel').textContent=employer?'募集職種':'希望職種';document.querySelector('#styleLabel').textContent=employer?'募集する勤務形態':'希望する働き方';selected.replaceChildren();if(job&&!employer){selected.append(document.createTextNode('応募相談先：'+job[0]+' '));const clear=document.createElement('button');clear.type='button';clear.className='clear-job';clear.textContent='求人の指定を解除';clear.addEventListener('click',clearJob);selected.append(clear)}}
 type.addEventListener('change',updateType);
 for(const el of [controls.role,controls.style])el.addEventListener('change',()=>{if(job&&(controls.role.value!==job[1]||controls.style.value!==job[2]))clearJob()});
 updateType();
 function step(n){for(let i=1;i<=3;i++){const el=document.querySelector('#step'+i);el.removeAttribute('aria-current');if(i===n)el.setAttribute('aria-current','step')}}
 function showStep(section,n){form.hidden=section!==form;document.querySelector('#confirm').hidden=section.id!=='confirm';document.querySelector('#done').hidden=section.id!=='done';step(n);section.focus({preventScroll:true});document.querySelector('.progress').scrollIntoView({block:'start',behavior:'instant'})}
 for(const el of [controls.name,controls.facility,controls.message])el.addEventListener('input',()=>el.setCustomValidity(''));
 form.addEventListener('submit',e=>{e.preventDefault();for(const el of [controls.name,controls.message,...(type.value==='facility'?[controls.facility]:[])])el.setCustomValidity(el.value.trim()?'':'空白以外の内容を入力してください。');if(!form.reportValidity())return;const data=new FormData(form),summary=document.querySelector('#summary');summary.replaceChildren();const rows=[['ご相談の種類',type.selectedOptions[0].text],...(job&&type.value==='worker'?[['応募相談先',job[0]]]:[]),...(interest?[['大切にしたいこと',interest]]:[]),['職種',data.get('role')],['勤務形態',data.get('style')],['お名前',data.get('name').trim()],['メールアドレス',data.get('email')],...(type.value==='facility'?[['施設名',data.get('facility').trim()]]:[]),['相談内容',data.get('message').trim()],['入力情報の扱い','確認済み']];for(const [label,value]of rows){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;summary.append(dt,dd)}showStep(document.querySelector('#confirm'),2)});
 document.querySelector('#edit').addEventListener('click',()=>{showStep(form,1);type.focus({preventScroll:true})});
 document.querySelector('#finish').addEventListener('click',()=>{document.querySelector('#summary').replaceChildren();form.reset();job=null;updateType();showStep(document.querySelector('#done'),3)});
 form.querySelector('button[type=submit]').disabled=false;
})();
