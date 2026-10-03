'use strict';
(() => {
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const intro=document.getElementById('opening-screen');
  const replay=document.getElementById('replay-intro');
  let introTimer,previousFocus;
  const closeIntro=()=>{if(!intro)return;clearTimeout(introTimer);intro.hidden=true;intro.classList.remove('intro-active');document.body.style.overflow='';if(previousFocus&&previousFocus!==document.body)previousFocus.focus({preventScroll:true});else{const heading=document.querySelector('.hero h1');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}}};
  const playIntro=()=>{if(!intro||motionQuery.matches)return;previousFocus=document.activeElement;if(window.scrollTo)window.scrollTo({top:0,behavior:'instant'});intro.hidden=false;intro.classList.remove('intro-active');void intro.offsetWidth;intro.classList.add('intro-active');introTimer=setTimeout(closeIntro,2900);document.body.style.overflow='hidden';document.getElementById('intro-skip').focus({preventScroll:true});};
  if(intro){document.getElementById('intro-skip').addEventListener('click',closeIntro);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!intro.hidden)closeIntro();if(e.key==='Tab'&&!intro.hidden){e.preventDefault();document.getElementById('intro-skip').focus();}});if(replay)replay.addEventListener('click',playIntro);let seen=false;try{seen=sessionStorage.getItem('yohaku-intro-seen')==='1';sessionStorage.setItem('yohaku-intro-seen','1');}catch{}if(!seen)playIntro();}
  let paused = motionQuery.matches;
  const menu = document.querySelector('.menu-toggle');
  const mobile = document.querySelector('.mobile-nav');
  if(menu && mobile){
    const close=()=>{mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','メニューを開く');};
    menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';mobile.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く');});
    mobile.addEventListener('click',e=>{if(e.target.closest('a'))close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobile.hidden){close();menu.focus();}});
    matchMedia('(min-width: 901px)').addEventListener('change',e=>{if(e.matches)close();});
  }
  const film=document.getElementById('brand-film');
  const control=document.getElementById('motion-control');
  if(film){
    const small=matchMedia('(max-width:600px)').matches;
    film.poster=small?'assets/brand-film-v3-mobile-poster.jpg':'assets/brand-film-v3-poster.jpg';
    film.src=small?'assets/yohaku-brand-film-v3-mobile.mp4':'assets/yohaku-brand-film-v3.mp4';
  }
  const detailControl=document.getElementById('detail-toggle');
  const videos=[...document.querySelectorAll('video')];
  function syncMotion(){
    document.documentElement.classList.toggle('motion-paused',paused);
    document.documentElement.dataset.motion=paused?'paused':'running';
    if(paused)document.querySelectorAll('[data-scene]').forEach(el=>el.setAttribute('aria-hidden','false'));
    if(control){control.innerHTML=paused?'映像・動きを再生 <i aria-hidden="true">▷</i>':'映像・動きを停止 <i aria-hidden="true">Ⅱ</i>';control.setAttribute('aria-pressed',String(paused));}
    if(detailControl){detailControl.innerHTML=paused?'映像・動きを再生 <i aria-hidden="true">▷</i>':'映像・動きを停止 <i aria-hidden="true">Ⅱ</i>';detailControl.setAttribute('aria-pressed',String(paused));}
    videos.forEach(v=>{if(paused)v.pause();else v.play().catch(()=>{});});
  }
  if(control)control.addEventListener('click',()=>{paused=!paused;syncMotion();});
  if(detailControl)detailControl.addEventListener('click',()=>{paused=!paused;syncMotion();});
  motionQuery.addEventListener('change',e=>{paused=e.matches;if(e.matches)closeIntro();syncMotion();});
  syncMotion();
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('seen');observer.unobserve(entry.target);}}),{threshold:.06});
    document.querySelectorAll('.philosophy-body,.human-stories,.care-intro,.care-explorer,.space-copy,.first-copy,.faq,.opening-word').forEach(el=>{if(!paused){el.classList.add('reveal');observer.observe(el);}});
    const filmObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)entry.target.pause();else if(!paused)entry.target.play().catch(()=>{});}),{threshold:.05});videos.forEach(v=>filmObserver.observe(v));
  }
  let frame=false;
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  const updateScroll=()=>{
    frame=false;
    const doc=document.documentElement;
    doc.style.setProperty('--page-progress',String(scrollY/Math.max(1,doc.scrollHeight-innerHeight)));
    if(paused)return;
    const hero=document.querySelector('.hero-cinema');
    if(hero)hero.style.setProperty('--hero-exit',String(clamp(-hero.getBoundingClientRect().top/innerHeight,0,1)));
    const journey=document.querySelector('.journey');
    if(journey){
      const rect=journey.getBoundingClientRect();
      const progress=clamp(-rect.top/Math.max(1,rect.height-innerHeight),0,1);
      const sequence=progress*2.6;
      journey.style.setProperty('--journey-progress',String(progress));
      const active=Math.min(2,Math.round(sequence));
      const counter=document.querySelector('.journey-count');if(counter)counter.textContent=`0${active+1} / 03`;
      journey.querySelectorAll('[data-scene]').forEach((scene,i)=>{
        const shift=clamp(i-sequence,-1,1);
        const opacity=i===2&&sequence>2?1:clamp((.62-Math.abs(shift))/.24,0,1);
        scene.style.setProperty('--scene-shift',String(i===2&&sequence>2?0:shift));
        scene.style.setProperty('--scene-opacity',String(opacity));
        scene.setAttribute('aria-hidden',String(i!==active));
      });
    }
    document.querySelectorAll('.philosophy,.care-editorial,.space,.first,.reservation-banner').forEach(section=>{
      const rect=section.getBoundingClientRect();
      const shift=clamp((innerHeight*.5-rect.top)/Math.max(innerHeight,rect.height),-1,1);
      section.style.setProperty('--section-shift',String(shift));
    });
  };
  addEventListener('scroll',()=>{if(!frame){frame=true;requestAnimationFrame(updateScroll);}},{passive:true});
  addEventListener('resize',updateScroll);
  updateScroll();
  const marquee=document.querySelector('.word-marquee');
  const marqueeTrack=document.querySelector('.word-marquee-track');
  let motionFrame=0,scrollImpulse=0,skew=0,lastScroll=scrollY,lastMoment=performance.now();
  if(marquee&&marqueeTrack){
    addEventListener('scroll',()=>{const now=performance.now();const speed=(scrollY-lastScroll)/Math.max(16,now-lastMoment);scrollImpulse=clamp(speed,-5,5);lastScroll=scrollY;lastMoment=now;},{passive:true});
    const marqueeObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{marquee.classList.toggle('marquee-visible',entry.isIntersecting);}),{threshold:.22});marqueeObserver.observe(marquee);
    const animateMarquee=()=>{
      const animation=marqueeTrack.getAnimations()[0];
      if(!paused&&marquee.classList.contains('marquee-visible')){
        scrollImpulse*=.945;
        const target=clamp(-scrollImpulse*2,-7,7);
        skew+=(target-skew)*.08;
        marquee.style.setProperty('--marquee-skew',`${skew}deg`);
        if(animation)animation.playbackRate=1+Math.abs(scrollImpulse)*.8;
      }
      motionFrame=requestAnimationFrame(animateMarquee);
    };
    motionFrame=requestAnimationFrame(animateMarquee);
  }
  const tabs=[...document.querySelectorAll('[data-care]')];
  const careData=[
    {image:'assets/precision-tools.webp',alt:'歯科の器具を並べたAI生成イメージ',caption:'01 / TALK IT THROUGH',copy:'歯が気になる、歯ぐきが気になる。相談の流れを知るところから。'},
    {image:'assets/self-care.webp',alt:'歯ブラシを持つ手元のAI生成イメージ',caption:'02 / EVERYDAY CARE',copy:'毎日の歯みがきと、定期的な確認。お口のケアについて相談したい方へ。'},
    {image:'assets/entrance-detail.webp',alt:'架空の医院の入口のAI生成イメージ',caption:'03 / YOUR OWN SMILE',copy:'歯並びや見た目について。気になることや希望を伝えるところから。'}
  ];
  let selected=0,swapTimer;
  const selectCare=index=>{if(index===selected)return;selected=index;tabs.forEach((tab,i)=>{tab.classList.toggle('active',i===index);tab.setAttribute('aria-selected',String(i===index));});const panel=document.getElementById('care-detail');panel.setAttribute('aria-labelledby',tabs[index].id);const data=careData[index],visual=document.querySelector('.care-visual');document.getElementById('care-description').textContent=data.copy;visual.classList.add('changing');clearTimeout(swapTimer);swapTimer=setTimeout(()=>{const img=document.getElementById('care-image');img.src=data.image;img.alt=data.alt;document.querySelector('.care-image-caption').textContent=data.caption;visual.classList.remove('changing');},paused?0:180);};
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectCare(i));tab.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')selectCare(i);});tab.addEventListener('focus',()=>selectCare(i));tab.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();tabs[(i+1)%tabs.length].focus();}if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();tabs[(i+tabs.length-1)%tabs.length].focus();}});});
})();
