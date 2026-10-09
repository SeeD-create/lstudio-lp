/* ==========================================================
   SeeD HTMLスライド 共通ナビゲーション
   - 1920×1080キャンバスを画面サイズにフィット
   - キーボード（→/Space/PageDown=次, ←/PageUp=前, Home/End）
   - タッチ／クリック（右半分=次, 左半分=前）
   - スワイプ（左→右=戻る, 右→左=進む）
   - 進捗ドット自動生成
   - 各スライドは SeedNav.init(stepCount, onStep) を呼ぶ
   ========================================================== */

(function () {
  'use strict';

  let step = 0;
  let maxStep = 0;
  let onStepCallback = null;

  // ---- 画面フィット（transform: scale）----
  function fit() {
    const stage = document.querySelector('.seed-stage');
    if (!stage) return;
    const sx = window.innerWidth / 1920;
    const sy = window.innerHeight / 1080;
    const s = Math.min(sx, sy);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  }

  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fit);
  } else {
    fit();
  }

  // ---- ステップ管理 ----
  function setStep(s) {
    s = Math.max(0, Math.min(maxStep, s));
    if (s === step) return;
    step = s;
    const slide = document.querySelector('.seed-slide');
    if (slide) slide.setAttribute('data-step', String(step));
    updateProgress();
    if (onStepCallback) onStepCallback(step);
    document.dispatchEvent(new CustomEvent('seed:step', { detail: { step, maxStep } }));
  }

  function updateProgress() {
    document.querySelectorAll('.seed-progress__dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === step);
    });
  }

  // ---- キーボード ----
  // index.html のビューア（iframe）で開いているときは、PageUp/PageDown を
  // 「スライド送り」として親に渡す（←→＝スライド内のステップ、PageUp/Down＝スライド切替）。
  // file:// では親から iframe のキーを直接拾えない（別オリジン扱い）ので postMessage で渡す。8/21
  const framed = window.parent && window.parent !== window;
  window.addEventListener('keydown', (e) => {
    if (framed && (e.key === 'PageDown' || e.key === 'PageUp')) {
      e.preventDefault();
      window.parent.postMessage({ seed: 'slide-nav', dir: e.key === 'PageDown' ? 'next' : 'prev' }, '*');
      return;
    }
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
      e.preventDefault();
      setStep(step + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
      e.preventDefault();
      setStep(step - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setStep(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setStep(maxStep);
    }
  });

  // ---- タップ／クリック ----
  // クリック対象が data-no-tap 属性を持つ要素（または子孫）の場合は無視
  function onTap(e) {
    if (e.target && e.target.closest('[data-no-tap]')) return;
    const w = window.innerWidth;
    const x = e.clientX !== undefined ? e.clientX : (e.changedTouches && e.changedTouches[0].clientX);
    if (x === undefined) return;
    if (x > w / 2) setStep(step + 1);
    else setStep(step - 1);
  }

  // ---- スワイプ（左←→右） ----
  let touchStartX = null;
  let touchStartY = null;
  let touchStartT = 0;

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) { touchStartX = null; return; }
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartT = Date.now();
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const dt = Date.now() - touchStartT;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    touchStartX = null;
    // スワイプ判定：横移動が縦より大きく、80px 以上、500ms以内
    if (absDx > absDy && absDx > 80 && dt < 500) {
      e.preventDefault();
      if (dx < 0) setStep(step + 1); // 右→左：進む
      else        setStep(step - 1); // 左→右：戻る
    } else if (absDx < 10 && absDy < 10 && dt < 300) {
      // タップ扱い
      onTap({ clientX: t.clientX, target: e.target });
    }
  });

  // タッチ非対応環境ではマウスクリックで進行
  window.addEventListener('click', (e) => {
    // touchend からの click は無視（dblclick防止のため click に2重発火するが、touchstart で touchStartX を設定 → touchend で消す → click はその後）
    // touch端末ではタッチで処理済みなので無視させたい
    if ('ontouchstart' in window && e.pointerType === 'touch') return;
    onTap(e);
  });

  // ---- 公開API ----
  window.SeedNav = {
    init(stepCount, onChange) {
      maxStep = Math.max(0, stepCount - 1);
      onStepCallback = onChange || null;
      const slide = document.querySelector('.seed-slide');
      if (!slide) return;
      // 進捗ドットを生成
      let prog = slide.querySelector('.seed-progress');
      if (!prog) {
        prog = document.createElement('div');
        prog.className = 'seed-progress';
        prog.setAttribute('data-no-tap', '');
        slide.appendChild(prog);
      }
      prog.innerHTML = '';
      for (let i = 0; i < stepCount; i++) {
        const d = document.createElement('span');
        d.className = 'seed-progress__dot' + (i === 0 ? ' is-active' : '');
        prog.appendChild(d);
      }
      slide.setAttribute('data-step', '0');
      // 初回コールバック
      if (onStepCallback) onStepCallback(0);
      fit();
    },
    get step() { return step; },
    get maxStep() { return maxStep; },
    setStep,
    next() { setStep(step + 1); },
    prev() { setStep(step - 1); },
  };
})();
