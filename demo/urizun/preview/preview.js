'use strict';
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#global-nav');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open');menu.focus();}});
// Only event names and fixed classifications are collected locally. No personal input.
window.urizunPreviewEvents=[];
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href')||'';const channel=href.startsWith('tel:')?'telephone':href.includes('line.me')?'line':/contact\/index.html/.test(href)?'contact':null;if(channel)window.urizunPreviewEvents.push({event:'consultation_click',channel});});
const search=document.querySelector('.column-search');
if(search){
  const input=search.querySelector('input'),results=document.querySelector('#search-results'),defaults=document.querySelector('#default-results'),status=document.querySelector('#search-status'),initial=status.textContent;
  let dataPromise,revision=0;
  const reset=()=>{revision++;input.value='';results.replaceChildren();results.hidden=true;defaults.hidden=false;status.textContent=initial;const u=new URL(location.href);u.searchParams.delete('q');history.replaceState(null,'',u);};
  async function run(){const ticket=++revision;const q=input.value.trim();if(!q){reset();return;}status.textContent='記事を検索しています…';try{dataPromise??=fetch(search.dataset.index).then(r=>{if(!r.ok)throw Error('index');return r.json();}).catch(e=>{dataPromise=undefined;throw e;});const data=await dataPromise;if(ticket!==revision)return;const words=q.normalize('NFKC').toLocaleLowerCase('ja').split(/\s+/);const hits=data.filter(p=>words.every(w=>(p.title+' '+p.text+' '+p.categories.join(' ')).normalize('NFKC').toLocaleLowerCase('ja').includes(w)));results.replaceChildren();for(const p of hits){const row=document.createElement('article');row.className='search-hit';const a=document.createElement('a');a.href=search.dataset.root+p.path.replace(/^\//,'')+'index.html';const h=document.createElement('h2');h.textContent=p.title;const meta=document.createElement('span');meta.className='category-label';meta.textContent=p.categories.join(' ／ ');const text=document.createElement('p');text.textContent=p.text.slice(0,150);a.append(meta,h,text);row.append(a);results.append(row);}if(!hits.length){const p=document.createElement('p');p.textContent='該当する記事がありません。短い言葉や別のキーワードでお試しください。';results.append(p);}results.hidden=false;defaults.hidden=true;status.textContent=`「${q}」の検索結果 ${hits.length}件`;const u=new URL(location.href);u.searchParams.set('q',q);history.replaceState(null,'',u);}catch(e){if(ticket!==revision)return;status.textContent='検索を読み込めませんでした。テーマ別一覧をご利用いただくか、もう一度検索してください。';defaults.hidden=false;results.hidden=true;}}
  search.addEventListener('submit',e=>{e.preventDefault();run();});document.querySelector('#clear-search').addEventListener('click',reset);input.addEventListener('search',()=>{if(!input.value)reset();});const q=new URL(location.href).searchParams.get('q');if(q){input.value=q;run();}
}
const form=document.querySelector('#inquiry-form');
if(form){
  const today=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  form.querySelectorAll('[type=date]').forEach(i=>i.min=today);
  const review=document.querySelector('#form-review'),values=document.querySelector('#review-values'),error=document.querySelector('#date-error');
  form.addEventListener('submit',e=>{e.preventDefault();error.textContent='';if(!form.reportValidity())return;const data=new FormData(form),slots=[];for(let i=1;i<=3;i++){const d=data.get('date'+i),t=data.get('time'+i);if(Boolean(d)!==Boolean(t)){error.textContent=`第${i}希望の日付と時間を両方選択してください。`;document.querySelector(d?'#time'+i:'#date'+i).focus();return;}if(d){const slot=d+' '+t;if(slots.includes(slot)){error.textContent='候補日時が重複しています。別の日時をご指定ください。';document.querySelector('#date'+i).focus();return;}slots.push(slot);}}
    values.replaceChildren();for(const [label,value] of [['お名前',data.get('name')],['お電話番号',data.get('phone')],['メール',data.get('email')||'未記入'],['地域',data.get('area')||'未記入'],['ご相談内容',data.get('topic')],['候補日時',slots.join('\n')||'日時未定'],['詳細',data.get('message')||'未記入']]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;values.append(dt,dd);}review.hidden=false;review.focus();review.scrollIntoView({block:'center'});window.urizunPreviewEvents.push({event:'consultation_form_review'});
  });
  document.querySelector('#edit-form').addEventListener('click',()=>{review.hidden=true;form.querySelector('input').focus();});
}
