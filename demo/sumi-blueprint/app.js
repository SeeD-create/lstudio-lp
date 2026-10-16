(() => {
  'use strict';
  const track = document.querySelector('.hero-track');
  const hero = document.querySelector('.hero');
  const phase = document.querySelector('.hero-phase');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = n => Math.max(0, Math.min(1, n));
  const ramp = (p, start, end) => clamp((p - start) / (end - start));
  const phases = ['01 / 敷地を読む', '02 / 骨格を描く', '03 / 細部を決める', '04 / 現場でつくる', '05 / 暮らしへ'];
  let queued = false;
  function paint() {
    queued = false;
    if (reduced.matches) { phase.textContent = phases[4]; return; }
    const span = Math.max(1, track.offsetHeight - innerHeight);
    const progress = clamp(-track.getBoundingClientRect().top / span);
    const values = {
      site: Math.max(.06, ramp(progress, 0, .17)),
      mass: ramp(progress, .12, .36),
      detail: ramp(progress, .29, .52),
      notes: ramp(progress, .42, .59),
      build: ramp(progress, .58, .75),
      finish: ramp(progress, .79, .98)
    };
    Object.entries(values).forEach(([name, value]) => hero.style.setProperty(`--${name}`, value.toFixed(3)));
    hero.classList.toggle('is-photo', values.build > .5);
    const index = progress < .16 ? 0 : progress < .35 ? 1 : progress < .59 ? 2 : progress < .80 ? 3 : 4;
    if (phase.textContent !== phases[index]) phase.textContent = phases[index];
  }
  function schedule() {
    if (!queued) { queued = true; requestAnimationFrame(paint); }
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  reduced.addEventListener('change', schedule);
  paint();

  const choices = [
    { key: 'kitchen', alt: '木と自然光を生かしたキッチンの構想イメージ', caption: '手を伸ばす場所に、木の温度を。' },
    { key: 'lounge', alt: '光が奥まで届く居間の構想イメージ', caption: '午後の光まで、居場所にする。' },
    { key: 'atrium', alt: '街とつながる空間の構想イメージ', caption: '人と街の、ちょうどいい距離。' }
  ];
  const buttons = [...document.querySelectorAll('[data-space]')];
  const frame = document.querySelector('.material-image');
  const source = frame.querySelector('source');
  const image = frame.querySelector('img');
  const caption = frame.querySelector('.material-caption');
  const index = frame.querySelector('.material-index');
  let changeTimer = null;
  buttons.forEach((button, i) => button.addEventListener('click', () => {
    buttons.forEach((item, j) => {
      item.classList.toggle('selected', i === j);
      item.setAttribute('aria-pressed', String(i === j));
    });
    clearTimeout(changeTimer);
    frame.classList.add('changing');
    changeTimer = setTimeout(() => {
      const item = choices[i];
      source.srcset = `assets/${item.key}-mobile.webp`;
      image.src = `assets/${item.key}-desktop.webp`;
      image.alt = item.alt;
      caption.textContent = item.caption;
      index.textContent = `${String(i + 1).padStart(2, '0')} / 03`;
      frame.classList.remove('changing');
    }, reduced.matches ? 0 : 160);
  }));

  const slider = document.querySelector('.build-slider');
  const strip = slider.querySelector('.build-slides');
  const slides = [...strip.children];
  const slideCount = slides.length;
  const counter = slider.querySelector('.build-count');
  const marker = slider.querySelector('.build-line i');
  const clone = slides[0].cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  strip.append(clone);
  let active = 0;
  let timer;
  let visible = false;
  let touchX = null;
  function renderSlide(animate = true) {
    strip.style.transition = animate && !reduced.matches ? '' : 'none';
    strip.style.transform = `translate3d(-${active * 100}%,0,0)`;
    const display = active % slideCount;
    counter.textContent = `${String(display + 1).padStart(2, '0')} / ${String(slideCount).padStart(2, '0')}`;
    marker.style.transform = `translateX(${display * 100}%)`;
    [...strip.children].forEach((slide, i) => {
      slide.classList.toggle('is-current', i === active);
      if (i < slideCount) slide.setAttribute('aria-hidden', String(i !== display));
    });
  }
  function stopSlider() { clearInterval(timer); timer = null; }
  function startSlider() {
    stopSlider();
    if (visible && !reduced.matches && !document.hidden) timer = setInterval(() => { active += 1; renderSlide(); }, 3700);
  }
  function step(direction) {
    if (active === slideCount) active = 0;
    active = (active + direction + slideCount) % slideCount;
    renderSlide();
    startSlider();
  }
  strip.addEventListener('transitionend', e => {
    if (e.propertyName === 'transform' && active === slideCount) {
      active = 0;
      renderSlide(false);
    }
  });
  slider.querySelector('.build-prev').addEventListener('click', () => step(-1));
  slider.querySelector('.build-next').addEventListener('click', () => step(1));
  slider.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    if (touchX === null) return;
    const delta = e.changedTouches[0].clientX - touchX;
    if (Math.abs(delta) > 45) step(delta < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; startSlider(); }, { threshold: .2 }).observe(slider);
  document.addEventListener('visibilitychange', startSlider);
  reduced.addEventListener('change', startSlider);
  renderSlide(false);

  const futureTrack = document.querySelector('.future-track');
  const futureStage = futureTrack.querySelector('.future-stage');
  const futureLabel = futureTrack.querySelector('.future-label');
  let futureQueued = false;
  function paintFuture() {
    futureQueued = false;
    if (reduced.matches) { futureLabel.textContent = '03 / 暮らす'; return; }
    const span = Math.max(1, futureTrack.offsetHeight - innerHeight);
    const p = clamp(-futureTrack.getBoundingClientRect().top / span);
    futureStage.style.setProperty('--empty', ramp(p, .14, .48).toFixed(3));
    futureStage.style.setProperty('--lived', ramp(p, .58, .92).toFixed(3));
    const label = p < .4 ? '01 / つくる' : p < .75 ? '02 / 完成する' : '03 / 暮らす';
    if (futureLabel.textContent !== label) futureLabel.textContent = label;
  }
  function scheduleFuture() {
    if (!futureQueued) { futureQueued = true; requestAnimationFrame(paintFuture); }
  }
  addEventListener('scroll', scheduleFuture, { passive: true });
  addEventListener('resize', scheduleFuture);
  reduced.addEventListener('change', scheduleFuture);
  paintFuture();
})();
