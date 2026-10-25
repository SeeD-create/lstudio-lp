// Keep mobile browser toolbar changes from resizing the opening scene on scroll.
let heroViewportWidth=0;
function lockHeroViewport(){if(Math.abs(innerWidth-heroViewportWidth)>8){heroViewportWidth=innerWidth;document.documentElement.style.setProperty('--stable-screen-height',innerHeight+'px');}}
lockHeroViewport();addEventListener('resize',lockHeroViewport,{passive:true});
const $=s=>document.querySelector(s);document.body.classList.add('js');
const mq=matchMedia('(prefers-reduced-motion: reduce)');let stopped=mq.matches;
function motion(){document.body.classList.toggle('motion-off',stopped);$('.motion').setAttribute('aria-pressed',String(stopped));$('.motion').textContent=stopped?'▶ 動きを再開':'Ⅱ 動きを止める';}
$('.motion').addEventListener('click',()=>{stopped=!stopped;motion();});mq.addEventListener('change',e=>{stopped=e.matches;motion();});motion();
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
function closeMenu(){$('#nav').classList.remove('open');$('.menu').setAttribute('aria-expanded','false');$('.menu').setAttribute('aria-label','メニューを開く');$('.menu').textContent='☰';}
$('.menu').addEventListener('click',()=>{const isOpen=$('#nav').classList.toggle('open');$('.menu').setAttribute('aria-expanded',String(isOpen));$('.menu').setAttribute('aria-label',isOpen?'メニューを閉じる':'メニューを開く');$('.menu').textContent=isOpen?'×':'☰';});$('#nav').addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const changes=[['次の「やってみたい」を育てる。','growth-start-20261025.png','迷っていた女子生徒が、自分からノートに取りかかるAI生成イメージ'],['わかった実感が、次の一歩に。','growth-understand-20261025.png','作業のように勉強していた女子生徒が、理解できた手応えを感じるAI生成イメージ'],['一歩ずつが、自信になる。','growth-independent-20261025.png','答えを覚えていた男子生徒が、自分の力で問題を解くAI生成イメージ']];document.querySelectorAll('[data-growth]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-growth]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});const c=changes[+b.dataset.growth];$('#growth-message').textContent=c[0];$('#growth-photo').src='assets/'+c[1];$('#growth-photo').alt=c[2];}));
const courses={'1':['学びの土台を、\n一歩ずつ。','中学校の勉強に向き合う習慣から。自分に合う学び方を見つけよう。'],'2':['自分の力で、\nできることを増やす。','苦手なところを見つけ、分かるまで。日々の積み重ねを、自信につなげよう。'],'3':['その先の未来へ、\n今できる一歩を。','目標に向かって、今の自分と向き合う。高校受験を見据えた学びを考えよう。']};if($('#course-title')){$('#course-title').style.whiteSpace='pre-line';document.querySelectorAll('[data-grade]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-grade]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const c=courses[b.dataset.grade];$('#course-title').textContent=c[0];$('#course-text').textContent=c[1];}));

}
/* Full-page motion: light, leaves, section rhythm and tactile controls. */
const motionSections=[...document.querySelectorAll('main section,footer')];
motionSections.forEach((section,index)=>{section.classList.add('motion-section');section.style.setProperty('--section-order',index);});
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('in-view',entry.isIntersecting)),{rootMargin:'70px'});
motionSections.forEach(section=>sectionObserver.observe(section));
document.querySelectorAll('.worry-grid,.strength-grid,.lesson-grid,.closing-grid').forEach(grid=>[...grid.children].forEach((card,index)=>{card.style.setProperty('--stagger',`${index*110}ms`);card.classList.add('motion-card');if(!card.classList.contains('reveal')){card.classList.add('reveal');io.observe(card);}}));
document.querySelectorAll('.growth-choices,.growth-visual,.footer-brand,.movie-link').forEach(el=>{el.classList.add('reveal');io.observe(el);});
const lightRain=document.createElement('div');lightRain.className='light-rain';lightRain.setAttribute('aria-hidden','true');
const orbX=[7,22,39,56,73,89,15,31,48,65,82,95,11,27,44,60,78,91];
for(let i=0;i<orbX.length;i++){const orb=document.createElement('i');orb.style.cssText=`--x:${orbX[i]}%;--delay:${4.65+i*.22}s;--duration:${8+(i%5)*1.2}s;--size:${5+(i%4)*2}px;--drift:${[-18,13,22,-14,17,-20][i%6]}px`;lightRain.append(orb);}document.querySelector('.hero').append(lightRain);
const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
const parallax=[...document.querySelectorAll('.philosophy>img,.growth-visual>img,footer>img')];
let motionFrame=0;
function updateScrollMotion(){motionFrame=0;const height=innerHeight;progress.style.transform=`scaleX(${scrollY/Math.max(1,document.documentElement.scrollHeight-height)})`;parallax.forEach(image=>{const r=image.parentElement.getBoundingClientRect();const offset=stopped?0:Math.max(-1,Math.min(1,(height/2-r.top-r.height/2)/height))*(innerWidth<761?10:22);image.style.setProperty('--parallax-y',`${offset}px`);});}
function requestScrollMotion(){if(!motionFrame)motionFrame=requestAnimationFrame(updateScrollMotion);}
addEventListener('scroll',requestScrollMotion,{passive:true});addEventListener('resize',requestScrollMotion,{passive:true});
$('.motion').addEventListener('click',()=>{document.getAnimations().filter(a=>a.id==='seed-interaction').forEach(a=>a.cancel());requestScrollMotion();});mq.addEventListener('change',requestScrollMotion);requestScrollMotion();
function animateChange(el){if(stopped)return;const animation=el.animate([{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,easing:'cubic-bezier(.2,.7,.2,1)'});animation.id='seed-interaction';}
document.querySelectorAll('[data-grade]').forEach(b=>b.addEventListener('click',()=>animateChange($('.course-body'))));
document.querySelectorAll('[data-growth]').forEach(b=>b.addEventListener('click',()=>animateChange($('.growth-visual'))));
document.querySelectorAll('.faq details').forEach(details=>details.addEventListener('toggle',()=>{if(details.open)animateChange(details.querySelector('p'));}));
// Decorative slide reels: muted, automatic, looped, with no player controls.
const slideReels=[...document.querySelectorAll('.slide-loop')];
function syncSlideReels(){slideReels.forEach(v=>{v.muted=true;if(stopped||document.hidden||v.dataset.onscreen!=='true'){v.pause();}else{v.play().catch(()=>{});}});}
const reelObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{e.target.dataset.onscreen=String(e.isIntersecting);});syncSlideReels();},{threshold:0.05});
slideReels.forEach(v=>reelObserver.observe(v));
$('.motion').addEventListener('click',syncSlideReels);mq.addEventListener('change',syncSlideReels);document.addEventListener('visibilitychange',syncSlideReels);

// A gentle light trails the mouse. Touch, reduced motion and the motion toggle disable it.
if(matchMedia('(hover:hover) and (pointer:fine)').matches){
  const hopeLight=document.createElement('div');hopeLight.className='hope-light';hopeLight.setAttribute('aria-hidden','true');document.body.append(hopeLight);
  let lightX=0,lightY=0,targetX=0,targetY=0,lightFrame=0,lightReady=false;
  function drawHopeLight(){
    lightFrame=0;
    if(stopped||mq.matches||document.hidden)return;
    lightX+=(targetX-lightX)*.19;lightY+=(targetY-lightY)*.19;
    hopeLight.style.transform=`translate3d(${lightX}px,${lightY}px,0) translate(-50%,-50%)`;
    if(Math.abs(targetX-lightX)+Math.abs(targetY-lightY)>.35)lightFrame=requestAnimationFrame(drawHopeLight);
  }
  function queueHopeLight(){if(!lightFrame)lightFrame=requestAnimationFrame(drawHopeLight);}
  document.addEventListener('pointermove',event=>{
    if(event.pointerType!=='mouse'||stopped||mq.matches)return;
    targetX=event.clientX;targetY=event.clientY;
    if(!lightReady){lightX=targetX;lightY=targetY;lightReady=true;}
    hopeLight.classList.add('is-visible');queueHopeLight();
  },{passive:true});
  document.addEventListener('pointerout',event=>{if(!event.relatedTarget)hopeLight.classList.remove('is-visible');});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)hopeLight.classList.remove('is-visible');});
  $('.motion').addEventListener('click',()=>{hopeLight.classList.remove('is-visible');if(!stopped)queueHopeLight();});
  mq.addEventListener('change',()=>{hopeLight.classList.remove('is-visible');});
  document.addEventListener('pointerdown',event=>{
    if(event.pointerType!=='mouse'||event.button!==0||stopped||mq.matches)return;
    const burst=document.createElement('div');burst.className='hope-burst';burst.setAttribute('aria-hidden','true');
    burst.style.setProperty('--x',`${event.clientX}px`);burst.style.setProperty('--y',`${event.clientY}px`);
    for(let i=0;i<8;i++){
      const angle=i*Math.PI/4,particle=document.createElement('i');
      particle.style.setProperty('--dx',`${Math.round(Math.cos(angle)*36)}px`);
      particle.style.setProperty('--dy',`${Math.round(Math.sin(angle)*36)}px`);
      burst.append(particle);
    }
    document.body.append(burst);hopeLight.classList.add('is-bursting');
    setTimeout(()=>{burst.remove();hopeLight.classList.remove('is-bursting');},650);
  },{passive:true});
}
