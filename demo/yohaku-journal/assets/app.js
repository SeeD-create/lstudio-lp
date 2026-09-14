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
// Motion leaves document flow, text wrapping and native pointer behavior intact.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let stopMotion = () => {};
function configureMotion() {
  stopMotion();
  if (reducedMotion.matches) return;
  const animations = new Set();
  const play = (el, frames, options) => {
    const animation = el.animate(frames, options);
    animations.add(animation);
    animation.finished.then(() => animations.delete(animation)).catch(() => {});
  };
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const siblings = el.parentElement.matches('.cards,.story-rows') ? [...el.parentElement.children] : [];
    const delay = Math.max(0, siblings.indexOf(el) % 3) * 90;
    play(el, [{opacity:0.15,transform:'translateY(25px)'},{opacity:1,transform:'translateY(0)'}], {duration:850,delay,easing:'cubic-bezier(.2,.7,.2,1)'});
    if (el.matches('.feature-photo,.article-cover')) {
      play(el.querySelector('img'), [{clipPath:'inset(0 12% 0 0)',transform:'scale(1.06)'},{clipPath:'inset(0)',transform:'scale(1)'}], {duration:1200,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
    observer.unobserve(el);
  }), {threshold:0.12});
  document.querySelectorAll('.masthead h1,.hero-copy>*,.section-head,.article-card,.feature-photo,.feature-copy,.story-rows>a,.about-strip,.article-heading h1,.article-cover,.prose section,.about-body').forEach(el => observer.observe(el));
  const stopFire = finePointer.matches ? createCursorFire() : () => {};
  stopMotion = () => { observer.disconnect(); animations.forEach(a => a.cancel()); stopFire(); };
}

function createCursorFire() {
  const canvas = document.createElement('canvas');
  canvas.className = 'cursor-fire';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return () => {}; }
  let dpr, frame = 0, lastTime = 0, active = false, initialized = false;
  let x = 0, y = 0, targetX = 0, targetY = 0, heat = 1;
  const sparks = [];
  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(innerWidth * dpr);
    canvas.height = Math.round(innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function glow(px, py, radius, alpha) {
    const g = ctx.createRadialGradient(px, py, 0, px, py, radius);
    g.addColorStop(0, `rgba(255,245,173,${alpha})`);
    g.addColorStop(.22, `rgba(255,164,45,${alpha})`);
    g.addColorStop(.48, `rgba(255,91,18,${alpha * .9})`);
    g.addColorStop(1, 'rgba(255,76,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(px, py, radius, 0, Math.PI * 2); ctx.fill();
  }
  function draw(time) {
    frame = 0;
    const dt = Math.min((time - (lastTime || time - 16)) / 16.67, 3);
    lastTime = time;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const dx = targetX - x, dy = targetY - y;
    x += dx * (1 - Math.pow(.72, dt)); y += dy * (1 - Math.pow(.72, dt));
    const speed = Math.hypot(dx, dy);
    if (active && speed > 1 && sparks.length < 40) {
      sparks.push({x,y,vx:(Math.random()-.5)*.7,vy:-.5-Math.random()*.8,life:1,r:2+Math.random()*3});
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.x += s.vx*dt; s.y += s.vy*dt; s.life -= .045*dt;
      if (s.life <= 0) { sparks.splice(i,1); continue; }
      glow(s.x,s.y,s.r*s.life+1,s.life*.55);
    }
    if (active) {
      const pulse = 1 + Math.sin(time * .009) * .08;
      glow(x,y,12*heat*pulse,.88);
      glow(x-1,y-4,7*heat,.38);
    }
    if (active || sparks.length) frame = requestAnimationFrame(draw);
  }
  function move(e) {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    targetX = e.clientX + 10; targetY = e.clientY + 12;
    if (!initialized) { x = targetX; y = targetY; initialized = true; }
    heat = e.target instanceof Element && e.target.closest('a,button') ? 1.2 : 1;
    active = true;
    if (!frame) { lastTime = 0; frame = requestAnimationFrame(draw); }
  }
  function leave() { active = false; initialized = false; }
  function visibility() {
    if (document.hidden) { leave(); cancelAnimationFrame(frame); frame = 0; sparks.length = 0; ctx.clearRect(0,0,innerWidth,innerHeight); }
  }
  resize();
  addEventListener('resize', resize);
  addEventListener('pointermove', move, {passive:true});
  document.documentElement.addEventListener('pointerleave', leave);
  addEventListener('blur', leave);
  document.addEventListener('visibilitychange', visibility);
  return () => {
    cancelAnimationFrame(frame); canvas.remove();
    removeEventListener('resize', resize); removeEventListener('pointermove', move);
    document.documentElement.removeEventListener('pointerleave', leave);
    removeEventListener('blur', leave); document.removeEventListener('visibilitychange', visibility);
  };
}
reducedMotion.addEventListener('change', configureMotion);
finePointer.addEventListener('change', configureMotion);
configureMotion();
