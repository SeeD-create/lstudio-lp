document.documentElement.classList.add('js');
const navButton = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeNav() { navButton.setAttribute('aria-expanded', 'false'); mobileNav.hidden = true; }
navButton.addEventListener('click', () => { const open = navButton.getAttribute('aria-expanded') === 'true'; navButton.setAttribute('aria-expanded', String(!open)); mobileNav.hidden = open; });
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !mobileNav.hidden) { closeNav(); navButton.focus(); } });
const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) {
  tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; document.getElementById(item.getAttribute('aria-controls')).hidden = !selected; });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', e => {
    let next;
    if(e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if(e.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if(e.key === 'Home') next = 0;
    if(e.key === 'End') next = tabs.length - 1;
    if(next !== undefined) { e.preventDefault(); selectTab(tabs[next]); tabs[next].focus(); }
  });
});
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.remove('pending'); observer.unobserve(entry.target); } }), { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(element => { element.classList.add('pending'); observer.observe(element); });
}
