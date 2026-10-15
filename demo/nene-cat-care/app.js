const notes = {
  food: '「最近、ごはんの様子がいつもと違うかも」。気づいたことを、そのまま聞かせてください。',
  mood: '「このごろ、遊び方や過ごす場所が変わったかも」。いつもの様子と比べて感じたことを聞かせてください。',
  age: '「年齢とともに、暮らし方を見直したい」。いま大切にしたいことから、一緒に整理しましょう。'
};
const concernNames = {food: 'ごはんのこと', mood: '過ごし方のこと', age: 'これからのこと'};
document.querySelectorAll('.feeling-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.feeling-card').forEach(other => {
      const active = other === card;
      other.classList.toggle('active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    const key = card.dataset.feeling;
    document.getElementById('feeling-message').textContent = notes[key];
    document.getElementById('concern').value = concernNames[key];
  });
});
const form = document.getElementById('consult-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('cat-name').value.trim();
  const concern = document.getElementById('concern').value;
  const detail = document.getElementById('note').value.trim();
  const lines = [name ? `お名前：${name}` : 'お名前：未入力', concern ? `気になること：${concern}` : '気になること：未選択', detail ? `メモ：${detail}` : 'メモ：未入力'];
  document.getElementById('preview-text').textContent = lines.join('\n');
  const preview = document.getElementById('form-preview');
  preview.hidden = false;
  preview.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'nearest'});
});
document.getElementById('copy-note').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText(document.getElementById('preview-text').textContent);
    status.textContent = 'コピーしました';
  } catch {
    status.textContent = 'コピーできませんでした。画面のメモを選択してください。';
  }
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold: .12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else { document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')); }
const paw = document.querySelector('.paw-cursor');
if (window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let pointerX = 0, pointerY = 0, pending = false;
  window.addEventListener('pointermove', event => {
    pointerX = event.clientX; pointerY = event.clientY;
    if (!pending) requestAnimationFrame(() => {
      paw.style.left = `${pointerX}px`; paw.style.top = `${pointerY}px`;
      paw.classList.add('visible'); pending = false;
    });
    pending = true;
  }, {passive:true});
  window.addEventListener('mouseout', event => { if (!event.relatedTarget) paw.classList.remove('visible'); });
  window.addEventListener('blur', () => paw.classList.remove('visible'));
}
const stickyCta = document.querySelector('.mobile-sticky-cta');
if ('IntersectionObserver' in window) {
  new IntersectionObserver(entries => stickyCta.classList.toggle('show', !entries[0].isIntersecting), {threshold:0}).observe(document.querySelector('.hero'));
} else {
  window.addEventListener('scroll', () => stickyCta.classList.toggle('show', window.scrollY > window.innerHeight), {passive:true});
}
