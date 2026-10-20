(() => {
  'use strict';
  const track = document.querySelector('.arrival-track');
  const stage = document.querySelector('.arrival');
  const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));
  const ramp = (p, a, b) => clamp((p - a) / (b - a));
  let queued = false;
  function draw() {
    queued = false;
    const span = Math.max(1, track.offsetHeight - innerHeight);
    const p = clamp(-track.getBoundingClientRect().top / span);
    stage.style.setProperty('--travel', p.toFixed(4));
    stage.style.setProperty('--door-ajar', (ramp(p, .09, .12) * (1 - ramp(p, .225, .25))).toFixed(4));
    stage.style.setProperty('--door-half', (ramp(p, .225, .25) * (1 - ramp(p, .35, .375))).toFixed(4));
    stage.style.setProperty('--door-open', ramp(p, .35, .375).toFixed(4));
    stage.style.setProperty('--open', ramp(p, .45, .73).toFixed(4));
    stage.style.setProperty('--people', ramp(p, .74, .94).toFixed(4));
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(draw); }
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  draw();

  const cards = [...document.querySelectorAll('.space-card')];
  const description = document.querySelector('#space-description');
  const lines = [
    '光の入るラウンジ。ひとりで本を読む午後にも、誰かと話す夜にも。',
    '同じキッチンから、違う一日がはじまる。作る時間も、食べる時間も。',
    '扉を閉めたら、自分だけの時間。シェアする暮らしにも、大切な余白がある。'
  ];
  cards.forEach((card, i) => card.addEventListener('click', () => {
    cards.forEach((item, j) => {
      const active = i === j;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    description.textContent = lines[i];
  }));

  const slider = document.querySelector('.life-slider');
  const strip = slider.querySelector('.life-slides');
  const slides = [...strip.querySelectorAll('.life-slide')];
  const count = slider.querySelector('.life-count');
  const progressBar = slider.querySelector('.life-progress span');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  firstClone.classList.remove('active');
  lastClone.classList.remove('active');
  firstClone.setAttribute('aria-hidden', 'true');
  lastClone.setAttribute('aria-hidden', 'true');
  strip.prepend(lastClone);
  strip.append(firstClone);
  strip.classList.add('is-jumping');
  strip.style.setProperty('--slide-index', '1');
  requestAnimationFrame(() => requestAnimationFrame(() => strip.classList.remove('is-jumping')));
  let current = 0;
  let physical = 1;
  let touchX = null;
  let visible = false;
  let timer = null;

  function scheduleAuto() {
    clearTimeout(timer);
    const keyboardFocus = slider.matches(':focus-visible') || Boolean(slider.querySelector(':focus-visible'));
    if (visible && !keyboardFocus && !document.hidden && !reduced.matches) {
      timer = setTimeout(() => advance(1), 4200);
    }
  }
  function show(index, position) {
    current = (index + slides.length) % slides.length;
    physical = position;
    strip.style.setProperty('--slide-index', String(physical));
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    count.innerHTML = `${String(current + 1).padStart(2, '0')} <i>/</i> ${String(slides.length).padStart(2, '0')}`;
    progressBar.style.transform = `translateX(${current * 100}%)`;
    scheduleAuto();
  }
  function settleLoop() {
    if (physical !== 0 && physical !== slides.length + 1) return;
    strip.classList.add('is-jumping');
    physical = current + 1;
    strip.style.setProperty('--slide-index', String(physical));
    requestAnimationFrame(() => requestAnimationFrame(() => strip.classList.remove('is-jumping')));
  }
  function advance(direction) {
    settleLoop();
    show(current + direction, physical + direction);
  }
  strip.addEventListener('transitionend', event => {
    if (event.target === slides[0] && event.propertyName === 'transform') settleLoop();
  });
  slider.querySelector('.life-prev').addEventListener('click', () => advance(-1));
  slider.querySelector('.life-next').addEventListener('click', () => advance(1));
  slider.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); advance(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); advance(-1); }
  });
  slider.addEventListener('touchstart', event => { touchX = event.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', event => {
    if (touchX === null) return;
    const delta = event.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 45) advance(delta < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });
  slider.addEventListener('focusin', scheduleAuto);
  slider.addEventListener('focusout', scheduleAuto);
  document.addEventListener('visibilitychange', scheduleAuto);
  reduced.addEventListener('change', scheduleAuto);
  new IntersectionObserver(entries => {
    visible = entries[0].intersectionRatio >= .45;
    scheduleAuto();
  }, { threshold: [0, .45] }).observe(slider);
})();
