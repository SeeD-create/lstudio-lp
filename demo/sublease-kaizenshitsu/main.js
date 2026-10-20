(() => {
  const toast = document.getElementById('preview-toast');
  let hideTimer;
  document.querySelectorAll('.js-line-cta').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      document.getElementById('line-diagnosis').scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast.textContent = 'LINE連携の画面イメージです。本番では運営者の公式アカウントに接続します。';
      toast.classList.add('visible');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => toast.classList.remove('visible'), 4000);
    });
  });

  const slider = document.querySelector('[data-poster-slider]');
  if (slider) {
    const posters = [...slider.querySelectorAll('[data-poster]')];
    const current = slider.querySelector('[data-poster-current]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const interval = 5000;
    let index = 0;
    let timer;
    let focusPaused = false;

    const shouldPause = () => focusPaused || document.hidden || reducedMotion.matches;
    const refreshTimer = () => {
      clearTimeout(timer);
      if (!shouldPause()) timer = setTimeout(() => show((index + 1) % posters.length), interval);
    };
    const show = (next) => {
      index = (next + posters.length) % posters.length;
      posters.forEach((poster, position) => {
        const active = position === index;
        poster.classList.toggle('is-active', active);
        poster.setAttribute('aria-hidden', String(!active));
        poster.inert = !active;
      });
      current.textContent = String(index + 1).padStart(2, '0');
      refreshTimer();
    };
    slider.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(index + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    slider.addEventListener('focusin', () => { focusPaused = true; refreshTimer(); });
    slider.addEventListener('focusout', (event) => {
      if (!slider.contains(event.relatedTarget)) {
        focusPaused = false;
        refreshTimer();
      }
    });
    document.addEventListener('visibilitychange', refreshTimer);
    reducedMotion.addEventListener('change', refreshTimer);
    refreshTimer();
  }

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealTargets = document.querySelectorAll('.stance-grid, .editorial-copy, .worries .container, .case-card, .why-grid, .experience-grid > div, .phone-demo, .movie-grid, .flow-grid li, .faq-grid');
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.09, rootMargin: '0px 0px -25px 0px' });
    revealTargets.forEach((element) => {
      element.classList.add('reveal-item');
      observer.observe(element);
    });
  }
})();
