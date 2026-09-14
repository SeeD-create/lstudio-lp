const searchForm = document.querySelector('#search');
if (searchForm) {
  const input = document.querySelector('#query');
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('#results .article-card')];
  const params = new URLSearchParams(location.search);
  let category = buttons.some(b => b.dataset.filter === params.get('category')) ? params.get('category') : 'すべて';
  input.value = params.get('q') || '';
  function render(updateURL = true) {
    const query = input.value.normalize('NFKC').trim().toLocaleLowerCase('ja');
    let count = 0;
    cards.forEach(card => {
      const match = (category === 'すべて' || card.dataset.cat === category) && card.dataset.text.normalize('NFKC').toLocaleLowerCase('ja').includes(query);
      card.hidden = !match;
      if (match) count++;
    });
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === category)));
    document.querySelector('#result-count').textContent = `${count}件の記事${category !== 'すべて' ? ` / ${category}` : ''}`;
    document.querySelector('#empty').hidden = count !== 0;
    if (updateURL) {
      const url = new URL(location.href);
      url.search = '';
      if (category !== 'すべて') url.searchParams.set('category', category);
      if (input.value.trim()) url.searchParams.set('q', input.value.trim());
      history.replaceState(null, '', url);
    }
  }
  searchForm.addEventListener('submit', e => { e.preventDefault(); render(); });
  input.addEventListener('input', () => render());
  buttons.forEach(b => b.addEventListener('click', () => { category = b.dataset.filter; render(); }));
  document.querySelector('#reset').addEventListener('click', () => { category = 'すべて'; input.value = ''; render(); input.focus(); });
  render(false);
}
const progress = document.querySelector('.reading-progress');
if (progress) {
  const update = () => { const max = document.documentElement.scrollHeight - innerHeight; progress.style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 100}%`; };
  addEventListener('scroll', update, {passive:true});
  addEventListener('resize', update); update();
}
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('reveal'); observer.unobserve(e.target); } }), {threshold:0.08});
  document.querySelectorAll('.section-head,.feature-copy,.about-strip').forEach(el => observer.observe(el));
}
