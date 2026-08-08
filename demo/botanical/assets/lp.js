/* =========================================================
   ボタニカルビューティデザイナー養成講座 LP  共通スクリプト
   Lスタジオ 2026-08
   ---------------------------------------------------------
   ★ LINE登録URLはここ1か所だけ直せば全ボタンに反映されます。
   ========================================================= */

var LINE_URL = "https://lin.ee/XXXXXXX"; // ←★講座用LINE公式の友だち追加URLに差し替え
var VIMEO_ID = "";                       // ←★Vimeoの動画ID（数字だけ。例: "123456789"）

(function () {
  "use strict";

  /* 1) LINE URL を「LINEへ行くボタン」だけに流し込む ---------------- */
  var btns = document.querySelectorAll('[data-act="line"]');
  for (var i = 0; i < btns.length; i++) {
    btns[i].setAttribute("href", LINE_URL);
  }

  /* 1-2) 動画：サムネをクリックしたらVimeoを読み込んで再生 ---------
     最初からiframeを置かないのは、ページの表示を重くしないため。 */
  var vf = document.querySelector(".vframe");
  if (vf) {
    vf.setAttribute("role", "button");
    vf.setAttribute("tabindex", "0");
    vf.setAttribute("aria-label", "30分の無料動画を再生する");
    var play = function () {
      if (!VIMEO_ID) {
        var n = vf.parentNode.querySelector(".vnote");
        if (!n) {
          n = document.createElement("p");
          n.className = "vnote";
          n.textContent = "※動画は準備中です（Vimeoの動画IDを設定すると、ここでそのまま再生されます）";
          vf.parentNode.insertBefore(n, vf.nextSibling);
        }
        return;
      }
      var f = document.createElement("iframe");
      f.src = "https://player.vimeo.com/video/" + VIMEO_ID +
              "?autoplay=1&title=0&byline=0&portrait=0&dnt=1";
      f.title = "30分の無料動画";
      f.allow = "autoplay; fullscreen; picture-in-picture";
      f.allowFullscreen = true;
      f.className = "vplayer";
      vf.innerHTML = "";
      vf.classList.add("playing");
      vf.appendChild(f);
      if (typeof window.fbq === "function") window.fbq("track", "ViewContent", { content_name: "movie-play" });
      if (typeof window.gtag === "function") window.gtag("event", "movie_play");
    };
    vf.addEventListener("click", play);
    vf.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); play(); }
    });
  }

  /* 2) CTAクリック計測（広告の最適化に使う） ----------------------- */
  document.addEventListener("click", function (e) {
    var a = e.target.closest ? e.target.closest("[data-cta]") : null;
    if (!a) return;
    var pos = a.getAttribute("data-cta") || "unknown";
    // Meta Pixel（<head>のタグを有効化したときだけ動く）
    if (typeof window.fbq === "function") {
      window.fbq("track", "Lead", { content_name: pos });
    }
    // GA4（gtag.jsを入れたときだけ動く）
    if (typeof window.gtag === "function") {
      window.gtag("event", "line_friend_add", { cta_position: pos });
    }
  });

  /* 3) スクロールで出現 -------------------------------------------- */
  var targets = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    for (var j = 0; j < targets.length; j++) io.observe(targets[j]);
  } else {
    for (var k = 0; k < targets.length; k++) targets[k].classList.add("in");
  }
  // 保険：何かの理由で監視が働かなくても、本文が消えたままにならないようにする
  setTimeout(function () {
    for (var n = 0; n < targets.length; n++) targets[n].classList.add("in");
  }, 2500);

  /* 4) 固定CTAバー（ファーストビューを抜けたら出す / フッター手前で引っ込める） */
  var sticky = document.querySelector(".sticky");
  var hero = document.querySelector(".hero");
  var lastCta = document.querySelector("#cta-last");
  if (sticky) {
    var onScroll = function () {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      var heroH = hero ? hero.offsetHeight - 120 : 400;
      var show = y > heroH;
      if (lastCta) {
        var r = lastCta.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) show = false;
      }
      sticky.classList.toggle("show", show);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  /* 5) FAQ：ひとつ開いたら他は閉じる ------------------------------- */
  var ds = document.querySelectorAll(".faq details");
  for (var m = 0; m < ds.length; m++) {
    ds[m].addEventListener("toggle", function () {
      if (!this.open) return;
      for (var n = 0; n < ds.length; n++) if (ds[n] !== this) ds[n].open = false;
    });
  }
})();
