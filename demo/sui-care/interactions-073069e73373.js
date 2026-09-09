// Progressive enhancement for the static custom-domain export.
// Content and FAQ remain available without JavaScript; no data is transmitted.
(() => {
  const button = document.querySelector('button[aria-controls="purchase-info"]');
  button?.addEventListener('click', () => {
    const old = document.getElementById('purchase-info');
    const expanded = !old;
    button.setAttribute('aria-expanded', String(expanded));
    button.querySelector('span').textContent = expanded ? '−' : '＋';
    if (old) { old.remove(); return; }
    const info = document.createElement('div');
    info.id = 'purchase-info'; info.className = 'purchase-info';
    const title = document.createElement('h3'); title.textContent = 'ご購入前にご確認いただく内容';
    const copy = document.createElement('p'); copy.textContent = 'このページは提案用デモです。販売開始時は、成分・使用方法・税込総額・送料・返品条件・定期購入の有無を明記したうえで、注文画面へお進みいただく構成です。';
    const note = document.createElement('strong'); note.textContent = '現在は購入・決済できません。';
    info.append(title, copy, note); button.after(info);
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const nodes = [...document.querySelectorAll('.intro>div,.photo-panel,.philosophy-copy,.section-heading,.routine-card,.blue-statement h2,.blue-statement>p,.set-image,.set-copy,.details-grid>div,.faq>div,.last-cta>div')];
  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-visible'); observer.unobserve(e.target); }
  }), {threshold:.12});
  nodes.forEach((el, i) => { el.classList.add('reveal'); el.style.setProperty('--delay', `${el.classList.contains('routine-card') ? i % 3 * 110 : 0}ms`); observer.observe(el); });
  let busy = false;
  function update() {
    const h = document.documentElement;
    h.style.setProperty('--scroll-progress', `${scrollY / Math.max(1, h.scrollHeight-innerHeight)*100}%`);
    const img = document.querySelector('.hero-photo');
    if (img && scrollY < innerHeight) img.style.setProperty('--parallax', `${Math.min(scrollY*.14,90)}px`);
    busy = false;
  }
  addEventListener('scroll', () => { if (!busy) { requestAnimationFrame(update); busy = true; } }, {passive:true});
  update();
})();
