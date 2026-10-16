/* Explanatory figures for the twelve Kawai lessons. Text and equations remain editable HTML. */
(() => {
  const unit = document.currentScript?.dataset.unit;
  const slides = [...document.querySelectorAll('#stage .slide')];
  const graphic = (type, body) => `<div class="db-graphic db-${type}" aria-hidden="true">${body}</div>`;
  const point = (value, step = 0) => `<b class="db-point" ${step ? `data-at="${step}"` : ''}>${value}</b>`;
  const addToDiagram = (diagram, type, body) => {
    diagram.classList.add('db-enhanced');
    const hint = diagram.querySelector('.hint');
    (hint || diagram).insertAdjacentHTML(hint ? 'beforebegin' : 'beforeend', graphic(type, body));
  };
  const math = {
    'sugaku-01': (diagram) => addToDiagram(diagram, 'induct',
      `<div class="db-domino">${[1,2,3,4,5].map((n,i)=>`<i style="--i:${i}">${n}</i>`).join('')}</div><div class="db-under">${point('最初',1)}<span class="db-arrow">→</span>${point('次へ',2)}</div>`),
    'sugaku-02': (diagram) => {
      const formula = diagram.querySelector('.bigformula')?.textContent || '';
      const labels = formula.includes('30000') ? ['10⁴','3×10⁴','10⁵'] : formula.includes('1000') ? ['10²','10³','10⁴'] : formula.includes('0.003') ? ['10⁻³','3×10⁻³','10⁻²'] : ['10ᵏ','N','10ᵏ⁺¹'];
      addToDiagram(diagram, 'log', `<div class="db-scale"><span></span><span></span><span></span></div><div class="db-scale-labels">${labels.map((label,i)=>`<b class="${i===1?'db-focus':''}" ${i===1?'data-at="1"':''}>${label}</b>`).join('')}</div><div class="db-bracket" data-at="2">10倍の幅</div>`);
    },
    'sugaku-03': (diagram) => {
      const formula = diagram.querySelector('.bigformula')?.textContent || '';
      const limit = /15\/2|7\.5/.test(formula);
      addToDiagram(diagram, limit ? 'limit' : 'sum', limit
        ? `<div class="db-converge"><span>10</span><span>25/3</span><span>70/9</span><b data-at="1">15/2</b></div><div class="db-under">項が近づく先</div>`
        : `<div class="db-sum-bars"><i>a₁</i><i>a₂</i><i>a₃</i><i>···</i><i>aₙ</i></div><div class="db-under">${point('Sₙ',1)}<span class="db-arrow">＝</span>${point('ここまでの和',2)}</div>`);
    },
    'sugaku-04': (diagram) => {
      const formula = diagram.querySelector('.bigformula')?.textContent || '';
      addToDiagram(diagram, formula.includes('a₁') ? 'triple' : 'polar', formula.includes('a₁')
        ? `<div class="db-three"><i>a₁</i><i>a₂</i><i>a₃</i><span data-at="1">→ 次の3項も同じ倍率</span></div>`
        : `<div class="db-polar-ring"><i class="db-polar-ray"></i><b class="db-polar-dot"></b></div><div class="db-polar-labels"><span>長さ × 1/√2</span><span data-at="1">角度 + π/3</span></div>`);
    },
    'sugaku-05': (diagram) => addToDiagram(diagram, 'series',
      `<div class="db-fractions"><span>1/n</span><b>−</b><span>1/(n+m)</span></div><div class="db-cancel-flow"><i>残る</i><em data-at="1">中間項を消す</em><i data-at="2">端だけ</i></div>`),
    'sugaku-06': (diagram) => addToDiagram(diagram, 'recurrence',
      `<div class="db-rec"><i>aₙ</i><strong>＋</strong><i>aₙ₊₁</i><strong>→</strong><b data-at="1">aₙ₊₂</b></div><div class="db-under">前の2項から次を作る</div>`),
    'sugaku-07': (diagram) => {
      const formula = diagram.querySelector('.bigformula')?.textContent || '';
      const altitude = /PH|H =|S =/.test(formula);
      addToDiagram(diagram, 'vector',
        `<div class="db-vector-fig"><i class="db-edge db-ab"></i><i class="db-edge db-ap"></i><i class="db-edge db-bp"></i>${altitude?'<i class="db-edge db-height" data-at="1"></i>':''}<b class="db-a">A</b><b class="db-b">B</b><b class="db-p">P</b>${altitude?'<b class="db-h" data-at="2">H</b>':''}</div>`);
    },
  };
  if (math[unit]) {
    for (const slide of slides) {
      const diagram = slide.querySelector('.diagram:has(.bigformula)');
      if (diagram) math[unit](diagram);
    }
  }
  if (unit === 'sugaku-04') {
    for (const plane of document.querySelectorAll('.complex-plane')) {
      plane.insertAdjacentHTML('beforeend', '<i class="db-orbit-line db-line-1"></i><i class="db-orbit-line db-line-2"></i><i class="db-orbit-line db-line-3"></i><i class="db-orbit-line db-line-4"></i><i class="db-orbit-line db-line-5"></i>');
    }
  }
  if (unit === 'sugaku-05') {
    for (const equation of document.querySelectorAll('.cancel-equation')) {
      equation.insertAdjacentHTML('beforeend','<i class="db-strike db-strike-one" data-at="1"></i><i class="db-strike db-strike-two" data-at="2"></i>');
    }
  }
  if (unit === 'sugaku-07') {
    for (const figure of document.querySelectorAll('.triangle-drawing')) figure.insertAdjacentHTML('beforeend','<i class="db-altitude-glow" data-at="1"></i>');
  }
  if (unit === 'rika-01') {
    for (const slide of slides) {
      if (slide.classList.contains('cover')) continue;
      const image = slide.querySelector('.visual img[src*="turntable"]');
      if (image) slide.querySelector('.visual').insertAdjacentHTML('beforeend','<div class="db-turntable" aria-hidden="true"><i class="db-turn-ring"></i><i class="db-turn-arm"></i><b class="db-turn-dot"></b><i class="db-force-arrow" data-at="1"></i></div>');
      const pendulum = slide.querySelector('.visual img[src*="conical-pendulum"]');
      if (pendulum) slide.querySelector('.visual').insertAdjacentHTML('beforeend','<div class="db-pendulum" aria-hidden="true"><i></i><b></b><span data-at="1">L sinθ</span></div>');
    }
  }
  if (unit === 'rika-02') {
    for (const concept of document.querySelectorAll('.concept')) {
      const terms = document.createElement('div'); terms.className='db-wave-terms';
      while (concept.firstChild) terms.append(concept.firstChild);
      concept.append(terms);
      concept.insertAdjacentHTML('beforeend','<div class="db-wave-diagram" aria-hidden="true"><i class="db-wave-source"></i><i class="db-wavefront db-w1"></i><i class="db-wavefront db-w2"></i><i class="db-wavefront db-w3"></i><b class="db-listener"></b><span class="db-wave-arrow" data-at="1">→</span></div>');
    }
  }
  if (unit === 'rika-03') {
    for (const box of document.querySelectorAll('.chem-box')) {
      const descriptor = box.querySelector('b')?.textContent || '';
      box.classList.add('db-chem-enhanced');
      box.insertAdjacentHTML('beforeend',descriptor.includes('電子')
        ? '<div class="db-electron-track" aria-hidden="true"><i class="db-atom"></i><span class="db-electron">e⁻</span><i class="db-atom db-accept"></i></div>'
        : '<div class="db-oxidation-scale" aria-hidden="true"><i>−</i><b>0</b><i>＋</i><span class="db-oxidation-marker"></span></div>');
    }
  }
  if (unit === 'rika-04') {
    for (const slide of slides) {
      const visual = slide.querySelector('.visual');
      if (visual.querySelector('img[src*="titration"]') && !slide.classList.contains('cover')) visual.insertAdjacentHTML('beforeend','<div class="db-titration-drop" aria-hidden="true"><i></i><i></i><i></i></div>');
      const box = visual.querySelector('.chem-box');
      if (box) {box.classList.add('db-chem-enhanced');box.insertAdjacentHTML('beforeend','<div class="db-stoichiometry" aria-hidden="true"><span>Cu²⁺</span><i>→</i><span>I₂</span><i>→</i><span>S₂O₃²⁻</span><b data-at="1">2 : 1 : 2</b></div>');}
    }
  }
  if (unit === 'rika-05') {
    for (const box of document.querySelectorAll('.chem-box')) {
      box.classList.add('db-chem-enhanced');
      box.insertAdjacentHTML('beforeend','<div class="db-metal-scale" aria-hidden="true"><span>イオンになりやすい</span><i></i><span>なりにくい</span><b data-at="1"></b></div>');
    }
  }
  for (const slide of slides) {
    const max = slide.querySelectorAll('.reveal').length;
    for (const el of slide.querySelectorAll('.db-graphic [data-at],.db-turntable [data-at],.db-pendulum [data-at],.db-wave-diagram [data-at],.db-stoichiometry [data-at],.db-metal-scale [data-at],.db-strike[data-at],.db-altitude-glow[data-at]')) {
      if (Number(el.dataset.at) > max) el.removeAttribute('data-at');
    }
  }
  window.SeedOriginal.show(window.SeedOriginal.index, window.SeedOriginal.step);
})();
