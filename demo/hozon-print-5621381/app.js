const menu=document.querySelector('.menu'),mobileMenu=document.querySelector('.mobile-menu'),header=document.querySelector('.header');addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>30),{passive:true});menu.addEventListener('click',()=>{let open=mobileMenu.classList.toggle('open');menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く')});mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mobileMenu.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','メニューを開く')}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll('.rise').forEach(el=>observer.observe(el));
const seasons=[{title:'今年の写真を、<br><em>来年も好きでいたい。</em>',copy:'年末の振り返り、年始の贈りもの、キャンペーン最終日の後押し。季節ごとに表情を変えるヘッダー案です。',image:'assets/winter.webp'},{title:'会えない日にも、<br><em>笑顔を届けよう。</em>',copy:'新年のご挨拶に、思い出を一枚。写真を贈る喜びに焦点を当てたヘッダー案です。',image:'assets/newyear.webp'},{title:'まだ、残せる。<br><em>あの瞬間のぬくもり。</em>',copy:'検討していた一枚を選ぶきっかけに。実際の終了日や特典内容は正式情報に差し替えます。',image:'assets/banner.webp'}];
const season=document.querySelector('.season'),seasonImage=document.querySelector('.season-image'),seasonTitle=document.querySelector('.season-title'),seasonCopy=document.querySelector('.season-copy'),seasonCurrent=document.querySelector('.season-current'),seasonTabs=[...document.querySelectorAll('.season-tabs button')];let current=0;function showSeason(index){current=index;season.classList.add('changing');setTimeout(()=>{seasonImage.style.backgroundImage=`url('${seasons[index].image}')`;seasonTitle.innerHTML=seasons[index].title;seasonCopy.textContent=seasons[index].copy;seasonCurrent.textContent=`0${index+1} / 03`;seasonTabs.forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-selected',i===index)});season.classList.remove('changing')},270)}seasonTabs.forEach((b,i)=>b.addEventListener('click',()=>showSeason(i)));let timer=setInterval(()=>showSeason((current+1)%3),5100);season.addEventListener('mouseenter',()=>clearInterval(timer));season.addEventListener('mouseleave',()=>timer=setInterval(()=>showSeason((current+1)%3),5100));document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInterval(timer);else{clearInterval(timer);timer=setInterval(()=>showSeason((current+1)%3),5100)}});

(() => {
  const track = document.querySelector('.moments-track');
  const prev = document.querySelector('.moment-prev');
  const next = document.querySelector('.moment-next');
  if (track && prev && next) {
    const stride = () => track.querySelector('figure').getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
    const update = () => { prev.disabled = track.scrollLeft <= 4; next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4; };
    prev.addEventListener('click', () => track.scrollBy({left:-stride(),behavior:'smooth'}));
    next.addEventListener('click', () => track.scrollBy({left:stride(),behavior:'smooth'}));
    track.addEventListener('scroll', update, {passive:true});
    addEventListener('resize', update);
    track.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      track.scrollBy({left:(event.key === 'ArrowRight' ? 1 : -1)*stride(),behavior:'smooth'});
    });
    let startX = 0, startScroll = 0, dragging = false;
    track.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') return;
      dragging = true; startX = event.clientX; startScroll = track.scrollLeft;
      track.classList.add('is-dragging'); track.setPointerCapture(event.pointerId);
    });
    track.addEventListener('pointermove', event => { if (dragging) track.scrollLeft = startScroll - (event.clientX - startX); });
    const endDrag = () => { dragging = false; track.classList.remove('is-dragging'); update(); };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    update();
  }

  const slides = [...document.querySelectorAll('.hero-slide')];
  const heroMain = document.querySelector('.hero-main');
  const stories = [
    {first:'今日のしあわせを、',second:'いつもの場所に。',copy:'スマホの中で眠る写真を、何度でも見返したくなる一枚へ。<br>家族の時間が、暮らしの景色になる。',caption:'思い出を、しまわない。'},
    {first:'選ぶ時間から、',second:'思い出は動き出す。',copy:'何気なく撮った一枚を見つける。<br>残したい気持ちが、かたちになる。',caption:'写真を、もう一度選ぶ。'},
    {first:'手に取るたび、',second:'あの日が近くなる。',copy:'画面の中にあった笑顔が、暮らしの中へ。<br>一枚の写真から、会話がはじまる。',caption:'笑顔を、手のひらに。'},
    {first:'一緒に見返す、',second:'かけがえのない時間。',copy:'贈った人も、受け取った人も笑顔に。<br>思い出は、これからも続いていく。',caption:'記憶を、分かち合う。'}
  ];
  if (slides.length === stories.length && heroMain && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let current = 0;
    const title = heroMain.querySelector('h1');
    const copy = heroMain.querySelector('.hero-copy');
    const caption = heroMain.querySelector('.hero-caption');
    setInterval(() => {
      const old = slides[current];
      const nextIndex = (current + 1) % slides.length;
      const upcoming = slides[nextIndex];
      heroMain.classList.add('story-changing');
      old.classList.remove('active'); old.classList.add('was-active');
      upcoming.classList.add('active');
      current = nextIndex;
      setTimeout(() => {
        const story = stories[current];
        title.innerHTML = story.first + '<br><em>' + story.second + '</em>';
        copy.innerHTML = story.copy;
        caption.querySelector('span:first-child').textContent = '0' + (current + 1) + ' / MEMORY';
        caption.querySelector('span:last-child').textContent = story.caption;
        heroMain.classList.remove('story-changing');
      }, 360);
      setTimeout(() => old.classList.remove('was-active'), 1000);
    }, 5400);
  }
})();
