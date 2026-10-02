const menu=document.querySelector('.menu'),nav=document.querySelector('nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
const search=document.querySelector('#search');
if(search)search.addEventListener('click',()=>{let count=0;const role=document.querySelector('#role').value,style=document.querySelector('#style').value;document.querySelectorAll('[data-role]').forEach(card=>{card.hidden=!!((role&&role!==card.dataset.role)||(style&&style!==card.dataset.style));if(!card.hidden)count++});document.querySelector('#jobStatus').textContent=count+'件の架空求人';document.querySelector('#empty').hidden=count!==0});
const form=document.querySelector('#entry');
if(form){
 const query=new URLSearchParams(location.search),type=form.elements.type,facility=document.querySelector('#facilityName');
 const jobs={nurse:['みなと総合クリニック（架空）','看護師','常勤'],doctor:['青葉在宅ケア（架空）','医師','非常勤'],office:['ひかり訪問看護室（架空）','医療事務','常勤']};
 const job=jobs[query.get('job')];
 if(query.get('type')==='facility')type.value='facility';
 if(job){form.elements.role.value=job[1];form.elements.style.value=job[2]}
 function updateType(){const isFacility=type.value==='facility';facility.hidden=!isFacility;form.elements.facility.required=isFacility;document.querySelector('#roleLabel').textContent=isFacility?'募集職種':'希望職種';document.querySelector('#selectedJob').textContent=job&&!isFacility?'応募相談先：'+job[0]:''}
 type.addEventListener('change',updateType);updateType();
 function step(n){for(let i=1;i<=3;i++){const el=document.querySelector('#step'+i);el.removeAttribute('aria-current');if(i===n)el.setAttribute('aria-current','step')}}
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form),summary=document.querySelector('#summary');summary.replaceChildren();const rows=[['ご相談の種類',type.selectedOptions[0].text],...(job&&type.value==='worker'?[['応募相談先',job[0]]]:[]),['職種',data.get('role')],['働き方',data.get('style')],['お名前',data.get('name')],['メールアドレス',data.get('email')],...(type.value==='facility'?[['施設名',data.get('facility')]]:[]),['相談内容',data.get('message')],['入力情報の扱い','確認済み']];for(const [label,value]of rows){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;summary.append(dt,dd)}form.hidden=true;const confirm=document.querySelector('#confirm');confirm.hidden=false;step(2);confirm.focus();confirm.scrollIntoView({block:'start'})});
 document.querySelector('#edit').addEventListener('click',()=>{document.querySelector('#confirm').hidden=true;form.hidden=false;step(1);type.focus()});
 document.querySelector('#finish').addEventListener('click',()=>{document.querySelector('#confirm').hidden=true;document.querySelector('#summary').replaceChildren();form.reset();const done=document.querySelector('#done');done.hidden=false;step(3);done.focus()});
}
