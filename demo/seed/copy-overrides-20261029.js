/* Shared by the local preview and the copy editor. No HTML is accepted as copy. */
window.SeedCopy = (() => {
  const originals = new Map();
  function apply(doc, entries, device) {
    for (const [element, original] of originals) {
      if (element.ownerDocument === doc && element.isConnected) element.innerHTML = original;
    }
    let sheet = doc.getElementById('seed-copy-overrides');
    if (!sheet) { sheet = doc.createElement('style'); sheet.id = 'seed-copy-overrides'; doc.head.append(sheet); }
    const rules = [];
    for (const entry of entries) {
      let element;
      try { element = doc.querySelector(entry.selector); } catch { continue; }
      if (!element) continue;
      if (!originals.has(element)) originals.set(element, element.innerHTML);
      const value = entry[device] || {};
      if (typeof value.text === 'string') {
        const icons = [...element.children].filter(e => e.tagName === 'SPAN' && /^[＋+→›]$/.test(e.textContent.trim())).map(e => e.cloneNode(true));
        element.replaceChildren();
        value.text.split('\n').forEach((line, i) => {
          if (i) element.append(doc.createElement('br'));
          element.append(doc.createTextNode(line));
        });
        element.append(...icons);
      }
      const styles = [];
      for (const [key, css, unit] of [['fontSize','font-size','px'],['lineHeight','line-height',''],['maxWidth','max-width','px']]) {
        if (Number.isFinite(value[key])) styles.push(`${css}:${value[key]}${unit}!important`);
      }
      if (['left','center','right'].includes(value.align)) styles.push(`text-align:${value.align}!important`);
      if (value.hidden) styles.push('display:none!important');
      if (styles.length) rules.push(`${entry.selector}{${styles.join(';')}}`);
    }
    sheet.textContent = rules.join('\n');
    const structured = doc.getElementById('seed-search-data');
    if (structured) {
      try {
        const data = JSON.parse(structured.textContent);
        const faq = data['@graph']?.find(x => x['@type'] === 'FAQPage');
        if (faq) faq.mainEntity = [...doc.querySelectorAll('#faq details:not(.faq-more)')].filter(e => !e.hidden && getComputedStyle(e).display !== 'none').map(e => ({'@type':'Question',name:e.querySelector('summary').textContent.replace('＋','').trim(),acceptedAnswer:{'@type':'Answer',text:e.querySelector('p')?.textContent || ''}}));
        structured.textContent = JSON.stringify(data);
      } catch {}
    }
  }
  return {apply};
})();
if (document.getElementById('main') && !new URLSearchParams(location.search).has('copy-editor')) {
  fetch('copy-overrides-20261029.json', {cache:'no-store'}).then(r => r.ok ? r.json() : {entries:[]}).then(data => {
    const screen = matchMedia('(max-width:760px)');
    const update = () => SeedCopy.apply(document, data.entries || [], screen.matches ? 'mobile' : 'desktop');
    update(); screen.addEventListener('change', update);
  }).catch(() => {});
}
