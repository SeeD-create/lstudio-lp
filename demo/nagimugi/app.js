(() => {
  const root=document.documentElement;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const motion=document.querySelector('.motion');
  let manualStop=false;
  function syncMotion(){const off=manualStop||reduced.matches;root.classList.toggle('motion-off',off);motion.setAttribute('aria-pressed',String(off));motion.textContent=off?'動き：停止中':'動きを停止';motion.setAttribute('aria-label',off?'動きを再開':'動きを停止');if(reduced.matches){motion.textContent='動き：端末設定で停止';motion.setAttribute('aria-label','端末の動きを減らす設定で停止中');}}
  motion.addEventListener('click',()=>{manualStop=!manualStop;syncMotion()});reduced.addEventListener('change',syncMotion);syncMotion();
  const nav=document.querySelector('.nav'),toggle=document.querySelector('.nav-toggle');
  function closeNav(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}
  toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open))});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeNav()}});nav.addEventListener('click',e=>{if(e.target.closest('a'))closeNav()});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.06});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));root.classList.add('js')}
  const filters=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('[data-category]')];
  function filter(cat){if(!['all','bread','coffee','pair'].includes(cat))cat='all';filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===cat)));let count=0;cards.forEach(c=>{c.hidden=cat!=='all'&&c.dataset.category!==cat;if(!c.hidden){count++;c.classList.add('visible')}});const label=document.getElementById('result-count');if(label)label.textContent=`${count}件のメニュー`;}
  filters.forEach(b=>b.addEventListener('click',()=>{filter(b.dataset.filter);const u=new URL(location.href);u.searchParams.set('category',b.dataset.filter);history.replaceState(null,'',u)}));if(filters.length)filter(new URLSearchParams(location.search).get('category')||'all');
  const dialog=document.querySelector('.product-dialog');
  if(dialog){let products;let opener;
    const load=fetch('products.json').then(r=>{if(!r.ok)throw Error('menu load');return r.json()}).then(data=>products=data).catch(()=>null);
    document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',async()=>{await load;if(!products){document.querySelector('.menu-note').textContent='メニュー詳細を読み込めませんでした。ページを再読み込みしてください。';return}const p=products.find(p=>p.id===button.dataset.product);if(!p)return;opener=button;document.getElementById('product-title').textContent=p.name;document.getElementById('product-english').textContent=p.english;document.getElementById('product-description').textContent=p.description;document.getElementById('product-image').src=`assets/${p.image}.jpg`;document.getElementById('product-image').alt=`${p.name}（AI生成イメージ）`;document.getElementById('product-photo').className=`photo ${p.crop}`;dialog.showModal();document.body.style.overflow='hidden';}));
    dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus()});
  }
  const form=document.getElementById('visit-check'),result=document.getElementById('check-result');
  if(form){form.addEventListener('submit',e=>{e.preventDefault();const chosen=[...form.querySelectorAll('input:checked')].map(i=>i.value);const list=result.querySelector('ul');list.replaceChildren();(chosen.length?chosen:['営業時間・定休日・所在地を、正式な店舗情報で確認する']).forEach(value=>{const li=document.createElement('li');li.textContent=value;list.append(li)});result.hidden=false;form.hidden=true;result.querySelector('h3').focus();});document.getElementById('edit-check').addEventListener('click',()=>{form.hidden=false;result.hidden=true;form.querySelector('input').focus()})}
})();
