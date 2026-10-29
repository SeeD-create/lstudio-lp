(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Section links and reduced-motion visits should stay immediately usable.
  if (!hero || reduced.matches || (location.hash && location.hash !== '#main') || scrollY > 10) {
    root.dataset.heroIntro = 'skipped';
    return;
  }
  let finished = false;
  let watchdog;
  root.classList.add('hero-intro-lock');
  root.dataset.heroIntro = 'running';
  function blockScroll(event) { event.preventDefault(); }
  function blockKeys(event) {
    if (event.key === 'Escape') { finish(); return; }
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName) || event.target.isContentEditable) return;
    if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)) event.preventDefault();
  }
  function finish() {
    if (finished) return;
    finished = true;
    clearTimeout(watchdog);
    root.classList.remove('hero-intro-lock');
    root.dataset.heroIntro = 'complete';
    document.removeEventListener('wheel', blockScroll);
    document.removeEventListener('touchmove', blockScroll);
    document.removeEventListener('keydown', blockKeys);
    document.removeEventListener('click', pauseIntro, true);
    reduced.removeEventListener('change', finish);
  }
  function pauseIntro(event) {
    if (event.target.closest('.motion')) finish();
  }
  document.addEventListener('wheel', blockScroll, {passive:false});
  document.addEventListener('touchmove', blockScroll, {passive:false});
  document.addEventListener('keydown', blockKeys);
  document.addEventListener('click', pauseIntro, true);
  reduced.addEventListener('change', finish);
  // Fail open if an animation is cancelled or the browser cannot report completion.
  watchdog = setTimeout(finish, 3800);
  requestAnimationFrame(() => {
    if (finished) return;
    const opening = hero.getAnimations({subtree:true}).filter(animation => {
      const target = animation.effect?.target;
      return target instanceof Element && target.matches('.headline-letter,.mobile-hero-title,.headline-flash,.hero-people,.natural-portraits,.sparkles,.hero-copy>.cta') && animation.effect.getTiming().iterations !== Infinity;
    });
    if (opening.length) Promise.allSettled(opening.map(animation => animation.finished)).then(finish);
    else finish();
  });
})();
