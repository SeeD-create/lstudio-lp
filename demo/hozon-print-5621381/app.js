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
  const heroStage = document.querySelector('.hero-stage');
  const album = document.querySelector('.memory-album');
  const leaves = [...document.querySelectorAll('.album-leaf')];
  const albumCount = album?.querySelector('.album-caption span');
  const stories = [
    {first:'今日のしあわせを、',second:'いつもの場所に。',copy:'スマホの中で眠る写真を、何度でも見返したくなる一枚へ。<br>家族の時間が、暮らしの景色になる。',caption:'思い出を、しまわない。'},
    {first:'選ぶ時間から、',second:'思い出は動き出す。',copy:'何気なく撮った一枚を見つける。<br>残したい気持ちが、かたちになる。',caption:'写真を、もう一度選ぶ。'},
    {first:'手に取るたび、',second:'あの日が近くなる。',copy:'画面の中にあった笑顔が、暮らしの中へ。<br>一枚の写真から、会話がはじまる。',caption:'笑顔を、手のひらに。'},
    {first:'一緒に見返す、',second:'かけがえのない時間。',copy:'贈った人も、受け取った人も笑顔に。<br>思い出は、これからも続いていく。',caption:'記憶を、分かち合う。'}
  ];
  if (slides.length === stories.length && heroMain && heroStage && album) {
    const title = heroMain.querySelector('h1');
    const copy = heroMain.querySelector('.hero-copy');
    const caption = heroMain.querySelector('.hero-caption');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let currentStory = 0;
    let queued = false;
    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
    function renderAlbumJourney() {
      queued = false;
      if (reducedMotion.matches) return;
      const travel = Math.max(1, heroStage.offsetHeight - innerHeight);
      const progress = clamp((scrollY - heroStage.offsetTop) / travel * (stories.length - 1), 0, stories.length - 1);
      const page = Math.min(stories.length - 2, Math.floor(progress));
      const turn = clamp(progress - page, 0, 1);
      const nextOpacity = clamp((turn - .36) / .54, 0, 1);
      slides.forEach((slide, index) => {
        slide.style.opacity = index === page ? (1 - nextOpacity) : index === page + 1 ? nextOpacity : 0;
        slide.style.transform = `scale(${(1.03 + (index === page ? turn : 0) * .09).toFixed(3)})`;
      });
      leaves.forEach((leaf, index) => {
        const amount = clamp(progress - index, 0, 1);
        leaf.style.transform = `rotateY(${-178 * amount}deg)`;
      });
      album.style.setProperty('--album-lift', (Math.sin(turn * Math.PI) * .8).toFixed(3));
      const visibleStory = clamp(Math.round(progress), 0, stories.length - 1);
      if (visibleStory !== currentStory) {
        currentStory = visibleStory;
        const story = stories[visibleStory];
        title.innerHTML = story.first + '<br><em>' + story.second + '</em>';
        copy.innerHTML = story.copy;
        caption.querySelector('span:first-child').textContent = '0' + (visibleStory + 1) + ' / MEMORY';
        caption.querySelector('span:last-child').textContent = story.caption;
        albumCount.textContent = '0' + (visibleStory + 1) + ' / 04';
        heroMain.classList.remove('album-story-enter');
        void heroMain.offsetWidth;
        heroMain.classList.add('album-story-enter');
      }
    }
    function queueJourney() {
      if (!queued) { queued = true; requestAnimationFrame(renderAlbumJourney); }
    }
    addEventListener('scroll', queueJourney, {passive:true});
    addEventListener('resize', queueJourney, {passive:true});
    reducedMotion.addEventListener('change', queueJourney);
    queueJourney();
  }

  const captureButton = document.querySelector('.capture-trigger');
  const hero = document.querySelector('.hero');
  const flash = document.querySelector('.shutter-flash');
  let capturing = false;
  function captureMemory(event) {
    if (capturing || !hero || !flash || !album || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    capturing = true;
    const frame = [...slides].sort((a,b) => Number(getComputedStyle(b).opacity) - Number(getComputedStyle(a).opacity))[0];
    const photo = document.createElement('div');
    photo.className = 'capture-print';
    const image = document.createElement('div');
    image.className = 'capture-photo';
    image.style.backgroundImage = getComputedStyle(frame).backgroundImage;
    photo.append(image);
    const fromX = Math.min(innerWidth - 80, Math.max(80, event.clientX || innerWidth / 2));
    const fromY = Math.min(innerHeight - 80, Math.max(80, event.clientY || innerHeight / 2));
    photo.style.left = fromX - 77 + 'px';
    photo.style.top = fromY - 68 + 'px';
    document.body.append(photo);
    flash.classList.remove('is-firing');
    void flash.offsetWidth;
    flash.classList.add('is-firing');
    const target = album.getBoundingClientRect();
    const toX = target.left + target.width * .55 - fromX;
    const toY = target.top + target.height * .48 - fromY;
    const motion = photo.animate([
      {opacity:0,transform:'scale(.55) rotate(-9deg)',offset:0},
      {opacity:1,transform:'scale(1.04) rotate(3deg)',offset:.25},
      {opacity:1,transform:'scale(1) rotate(-4deg)',offset:.53},
      {opacity:0,transform:`translate(${toX}px, ${toY}px) scale(.18) rotate(-24deg)`,offset:1}
    ],{duration:1050,easing:'cubic-bezier(.2,.7,.28,1)',fill:'forwards'});
    motion.onfinish = () => {photo.remove();capturing = false;};
  }
  captureButton?.addEventListener('click', event => {event.stopPropagation();captureMemory(event);});
  hero?.addEventListener('click', event => {
    if (event.target.closest('a,button,nav')) return;
    captureMemory(event);
  });
})();
