(() => {
 'use strict';
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const body=document.body,header=document.querySelector('.site-header');
 const get=k=>{try{return sessionStorage.getItem(k)}catch{return null}},put=(k,v)=>{try{sessionStorage.setItem(k,v)}catch{}};
 let paused=get('medinowa-motion')==='paused',introTimer,exitTimer,returnFocus;
 const still=()=>reduced.matches||paused;
 const toggle=document.querySelector('#motion-toggle');
 function applyMotion(){const replay=document.querySelector('#replay-intro');replay.disabled=still();replay.textContent=still()?'動きを止めて閲覧中':'ロゴ演出をもう一度';body.classList.toggle('motion-paused',still());toggle.setAttribute('aria-pressed',String(still()));toggle.textContent=still()?'動きを再開する':'動きを止める';toggle.disabled=reduced.matches;if(reduced.matches)toggle.textContent='動きを減らす設定を適用中';}
 applyMotion();
 toggle.addEventListener('click',()=>{paused=!paused;put('medinowa-motion',paused?'paused':'playing');applyMotion();if(still())finishIntro(true)});
 let intro=document.querySelector('#brand-intro');
 function unlock(){document.querySelectorAll('[data-intro-inert]').forEach(el=>{el.inert=false;el.removeAttribute('data-intro-inert')});body.classList.remove('intro-running');}
 function finishIntro(immediate=false){
  if(!intro||intro.hidden)return;
  clearTimeout(introTimer);clearTimeout(exitTimer);put('medinowa-intro-v2','seen');
  unlock();body.classList.add('hero-enter');
  if(immediate||still()){intro.hidden=true;intro.classList.remove('leaving')}else{intro.classList.add('leaving');exitTimer=setTimeout(()=>{intro.hidden=true;intro.classList.remove('leaving')},720)}
  if(intro.contains(document.activeElement)){(returnFocus||(immediate?document.querySelector('.hero-copy a'):document.querySelector('main'))||document.querySelector('main')).focus({preventScroll:true})}
 }
 function startIntro(replay=false){
  if(!intro||still())return;
  returnFocus=replay?document.querySelector('#replay-intro'):null;
  if(replay){window.scrollTo({top:0,behavior:'instant'});body.classList.remove('hero-enter')}
  intro.classList.remove('leaving');intro.hidden=false;body.classList.add('intro-running');
  body.append(intro);
  for(const el of [header,document.querySelector('main'),document.querySelector('footer')]){el.inert=true;el.setAttribute('data-intro-inert','')}
  // The dialog is inside main in source; move it out before marking main inert.
  document.querySelector('#intro-skip').focus({preventScroll:true});
  const cleanURL=new URL(location.href);if(cleanURL.searchParams.has('intro')){cleanURL.searchParams.delete('intro');try{history.replaceState(null,'',cleanURL)}catch{}}
  introTimer=setTimeout(()=>finishIntro(),2100);
 }
 if(intro){intro.querySelector('#intro-skip').addEventListener('click',()=>finishIntro(true));document.addEventListener('keydown',e=>{if(intro.hidden)return;if(e.key==='Escape'){e.preventDefault();finishIntro(true)}if(e.key==='Tab'){e.preventDefault();document.querySelector('#intro-skip').focus()}});
  if(!still()&&(get('medinowa-intro-v2')!=='seen'||new URLSearchParams(location.search).get('intro')==='1'))startIntro();
 }
 document.querySelector('#replay-intro').addEventListener('click',()=>{if(intro)startIntro(true);else location.href='index.html?intro=1'});
 reduced.addEventListener('change',()=>{applyMotion();if(reduced.matches){finishIntro(true);body.classList.remove('page-leaving')}});
 window.addEventListener('pageshow',()=>{body.classList.remove('page-leaving');if(intro?.hidden)unlock()});
 window.addEventListener('pagehide',()=>{body.classList.remove('page-leaving');finishIntro(true)});
 // Reveal once, with a fail-open fallback. The page remains readable without JS.
 const reveals=[...document.querySelectorAll('[data-reveal]')];
 if(!still()&&'IntersectionObserver'in window){body.classList.add('js-motion');const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('reveal-pending');observer.unobserve(e.target)}})},{threshold:.1});reveals.forEach(el=>{el.classList.add('reveal-pending');observer.observe(el)});}
 let frame=0;
 const hero=document.querySelector('.hero');
 function paint(){frame=0;document.documentElement.style.setProperty('--notice-height',document.querySelector('.notice').offsetHeight+'px');const y=window.scrollY;header.classList.toggle('scrolled',y>180);if(hero&&!still()){const amount=Math.min(y*.14,85);hero.querySelectorAll('.hero-image').forEach(img=>img.style.transform=`translate3d(0,${amount}px,0)`)}else if(hero){hero.querySelectorAll('.hero-image').forEach(img=>img.style.transform='')}}
 window.addEventListener('resize',paint);
 window.addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(paint)},{passive:true});paint();
 document.querySelectorAll('[data-hero-scene]').forEach(button=>button.addEventListener('click',()=>{const selected=Number(button.dataset.heroScene);document.querySelectorAll('.hero-image').forEach((img,i)=>img.classList.toggle('is-active',i===selected));document.querySelectorAll('[data-hero-scene]').forEach((b,i)=>{b.classList.toggle('active',i===selected);b.setAttribute('aria-pressed',String(i===selected))})}));
 const priorities={life:['仕事も、暮らしも、あなたのペースで。','勤務日や時間、通勤のこと。無理なく続けられる条件から、一緒に整理します。','care.webp','01 / YOUR LIFE','希望を話す架空の医療従事者。AI生成仮素材'],career:['積み重ねてきた経験を、次の場所へ。','専門性や得意なこと。あなたの経験をどのように活かしたいか、聞かせてください。','hero.webp','02 / YOUR CAREER','対話する架空の医療スタッフ。AI生成仮素材'],new:['環境が変わる。その一歩に、安心を。','新しい職場への期待も不安も。大切にしたいことを確認しながら進めます。','clinic.webp','03 / YOUR NEXT','架空の医療施設内観。AI生成仮素材']};
 let imageTimer;
 document.querySelectorAll('[data-priority]').forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.priority,d=priorities[key];document.querySelectorAll('[data-priority]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});const picture=document.querySelector('.chapter-photo'),img=document.querySelector('#chapter-image');clearTimeout(imageTimer);const change=()=>{img.src=d[2];img.alt=d[4];const chosen=d[2];const ready=()=>{if(img.getAttribute('src')===chosen)picture.classList.remove('switching')};if(img.decode)img.decode().catch(()=>{}).then(ready);else ready()};if(still())change();else{picture.classList.add('switching');imageTimer=setTimeout(change,220)}document.querySelector('#chapter-number').textContent=d[3];document.querySelector('#priority-title').textContent=d[0];document.querySelector('#priority-description').textContent=d[1];document.querySelector('#priority-link').href='contact.html?interest='+key;const response=document.querySelector('.priority-response');response.classList.remove('changing');void response.offsetWidth;if(!still())response.classList.add('changing')}));
 // Enhance normal local navigation, never intercept external or modified clicks.
 document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey||a.target||a.hasAttribute('download')||still())return;const url=new URL(a.href,location.href);if(url.origin!==location.origin||!url.pathname.endsWith('.html')||(url.pathname===location.pathname&&url.search===location.search))return;e.preventDefault();body.classList.add('page-leaving');setTimeout(()=>body.classList.remove('page-leaving'),2000);setTimeout(()=>location.href=url.href,380)});
})();
