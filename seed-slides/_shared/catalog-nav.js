/* Shared lesson navigation. Keep outside the printable slide area. */
(() => {
  const script = document.currentScript;
  const home = new URL('../index.html', script.src).href;
  const install = () => {
    if (document.getElementById('seed-catalog-link')) return;
    const toolbar = document.querySelector('#toolbar, .toolbar');
    if (!toolbar) return;
    let link = [...toolbar.querySelectorAll('a')].find(a => /教材一覧/.test(a.textContent));
    if (!link) link = document.createElement('a');
    link.id = 'seed-catalog-link';
    link.href = home;
    link.textContent = '↩ 教材一覧へ戻る';
    link.setAttribute('data-no-tap', '');
    link.addEventListener('click', e => e.stopPropagation());
    link.addEventListener('keydown', e => e.stopPropagation());
    toolbar.prepend(link);
    toolbar.classList.add('seed-catalog-toolbar');
    const style = document.createElement('style');
    style.textContent = `
      .seed-catalog-toolbar { max-width:calc(100vw - 12px)!important; overflow-x:auto; justify-content:flex-start!important; }
      .seed-catalog-toolbar > * { flex-shrink:0; }
      #seed-catalog-link { display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;
        color:#fff4dc; background:#534b3e; border:1px solid #99856a; border-radius:5px;
        padding:5px 10px; font:600 13px/1.4 "Yu Gothic",sans-serif; white-space:nowrap;
        text-decoration:none; letter-spacing:0; }
      #seed-catalog-link:hover { background:#6b5d48; }
      #seed-catalog-link:focus-visible { outline:3px solid #f0c778; outline-offset:-3px; }
      @media print { #seed-catalog-link { display:none!important; } }
    `;
    document.head.append(style);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', install, {once:true});
  else install();
})();
