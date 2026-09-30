(() => {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const glow = document.createElement('div');
  glow.className = 'warm-cursor';
  glow.setAttribute('aria-hidden', 'true');
  document.body.append(glow);
  let x = 0, y = 0, targetX = 0, targetY = 0, frame = 0, active = false;
  function hide() {
    active = false;
    glow.classList.remove('is-visible');
    cancelAnimationFrame(frame);
    frame = 0;
  }
  function paint() {
    x += (targetX - x) * .24;
    y += (targetY - y) * .24;
    glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .2
      ? requestAnimationFrame(paint) : 0;
  }
  document.addEventListener('pointermove', event => {
    if (!fine.matches || reduced.matches || event.pointerType === 'touch') return hide();
    targetX = event.clientX;
    targetY = event.clientY;
    if (!active) {
      x = targetX;
      y = targetY;
      active = true;
      glow.classList.add('is-visible');
    }
    if (!frame) paint();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  fine.addEventListener('change', hide);
  reduced.addEventListener('change', hide);
})();
