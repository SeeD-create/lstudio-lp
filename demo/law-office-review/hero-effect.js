(function () {
  var hero = document.querySelector('.hero');
  var spot = document.getElementById('spot');
  if (!hero || !spot || !window.matchMedia('(pointer:fine)').matches) return;
  var heroRect = hero.getBoundingClientRect();
  var heading = document.getElementById('heroH1');
  var headingRect = heading ? heading.getBoundingClientRect() : null;
  var x = 0, y = 0, frame = null;
  function refresh() {
    heroRect = hero.getBoundingClientRect();
    if (heading) headingRect = heading.getBoundingClientRect();
  }
  function paint() {
    spot.style.transform = 'translate(-50%,-50%) translate3d(' + x + 'px,' + y + 'px,0)';
    frame = null;
  }
  function clear() {
    spot.classList.remove('on');
    if (heading) heading.classList.remove('lit');
  }
  hero.addEventListener('mousemove', function (event) {
    spot.classList.add('on');
    x = event.clientX - heroRect.left;
    y = event.clientY - heroRect.top;
    if (heading && headingRect) {
      heading.style.setProperty('--mx', (event.clientX - headingRect.left) + 'px');
      heading.style.setProperty('--my', (event.clientY - headingRect.top) + 'px');
      heading.classList.add('lit');
    }
    if (!frame) frame = requestAnimationFrame(paint);
  }, { passive: true });
  hero.addEventListener('mouseleave', clear);
  document.addEventListener('mouseleave', clear);
  window.addEventListener('blur', clear);
  window.addEventListener('resize', refresh, { passive: true });
  window.addEventListener('scroll', refresh, { passive: true });
}());
