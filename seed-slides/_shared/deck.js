/* ============================================================
   SeeD スライド v2 "COLLECTION" — 汎用ステップ制御
   nav.js の SeedNav に乗せて、宣言的にステップ演出を出す。

   使い方（各スライド末尾）:
     <script src="../../../_shared/nav.js"></script>
     <script src="../../../_shared/deck.js"></script>
     <script>SeedDeck.init(6);</script>   // ステップ数

   属性:
     [data-at="N"]      … step>=N で .is-in（登場）。[data-anim]で方向指定
     [data-until="M"]   … step>=M で .is-out（退場／差し替え）
     .blank[data-fill=N]… step>=N で .is-filled（穴が「ポン」と埋まる）
     [data-cap="N"]     … 任意。step==N のときだけ .is-now（キャプション強調）
   カスタム演出が要る時は SeedDeck.init(n, (step)=>{...}) で第2引数にコールバック。
   ============================================================ */
(function () {
  'use strict';
  window.SeedDeck = {
    init(steps, custom) {
      const slide = document.querySelector('.seed-slide');
      if (!slide) return;
      const atEls    = Array.from(slide.querySelectorAll('[data-at]'));
      const untilEls = Array.from(slide.querySelectorAll('[data-until]'));
      const blanks   = Array.from(slide.querySelectorAll('.blank[data-fill]'));
      const caps     = Array.from(slide.querySelectorAll('[data-cap]'));

      function apply(step) {
        atEls.forEach(el => el.classList.toggle('is-in', step >= +el.dataset.at));
        untilEls.forEach(el => el.classList.toggle('is-out', step >= +el.dataset.until));
        blanks.forEach(b => b.classList.toggle('is-filled', step >= +b.dataset.fill));
        caps.forEach(c => c.classList.toggle('is-now', step === +c.dataset.cap));
        if (typeof custom === 'function') custom(step);
      }

      // ステップ数未指定なら属性から自動算出
      if (!steps) {
        let mx = 0;
        [...atEls, ...untilEls, ...blanks].forEach(el => {
          const v = +(el.dataset.at || el.dataset.until || el.dataset.fill || 0);
          if (v > mx) mx = v;
        });
        steps = mx + 1;
      }
      SeedNav.init(steps, apply);
    }
  };
})();
