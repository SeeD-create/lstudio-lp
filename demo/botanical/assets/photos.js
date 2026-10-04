 

var PHOTO_DIR = "img/photo/";    

var PHOTOS = {
   
  "01_counseling"       : "01_counseling.jpg",         
  "01_counseling_wide"  : "01_counseling_wide.jpg",    
  "01_counseling_mob"   : "01_counseling_mob.jpg",     
  "02_ai_analysis"      : "02_ai_analysis.jpg",        
  "03_extracts"         : "03_extracts.jpg",           
  "03_extracts_wide"    : "03_extracts_wide.jpg",      
  "04_blending"         : "04_blending.jpg",           
  "05_hirao_labo"       : "05_hirao_labo.jpg",         
   
  "05_hirao_labo_learn" : "05_hirao_labo_learn.jpg",   
  "06_products"         : "06_products.jpg",           
  "07_club"             : "07_club.jpg",               
  "08_teatime"          : "08_teatime.jpg",            
  "08_teatime_wide"     : "08_teatime_wide.jpg",       
  "09_hadaiku_lesson"   : "09_hadaiku_lesson.jpg",     
  "10_kouza"            : "10_kouza.jpg",              
  "10_kouza_wide"       : "10_kouza_wide.jpg",         

   
  "01_counseling_hero"  : "01_counseling_hero.jpg",    
  "10_kouza_hero"       : "10_kouza_hero.jpg",         
  "11_lab_research"     : "11_lab_research.jpg",       
  "12_lab_equipment"    : "12_lab_equipment.jpg",      

   
  "video_thumb"         : "video_thumb.jpg",

   
  "c_hero"              : "c6_hero.jpg",           
  "c_worry"             : "c8_worry.jpg",          
  "c_lesson"            : "c9_lesson.jpg",         
  "c_ai"                : "c10_ai.jpg",            
  "c_blend"             : "c7_blend_hands.jpg",    
  "c_product"           : "c1_bottle_serum.jpg",   
  "c_learn"             : "c11_learn.jpg",         
  "c_cta"               : "c12_cta.jpg",           
  "c_band"              : "c13_band.jpg",          
  "c_movie"             : "c14_movie.jpg",         
  "c_voice_a"           : "c15_voice_a.jpg",
  "c_voice_b"           : "c15_voice_b.jpg",
  "c_voice_c"           : "c15_voice_c.jpg"
};

 
(function () {
  "use strict";
  var me = document.currentScript;
  var base = (me && me.src ? me.src.replace(/[?#].*$/, "").replace(/photos\.js$/, "") : "assets/");

   
  function applyPc() {
    var els = document.querySelectorAll("[data-photo-slot-pc]");
    var css = "";
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var file = PHOTOS[el.getAttribute("data-photo-slot-pc")];
      if (!file) continue;
      if (!el.id) el.id = "lp-pcphoto-" + i;
      var url = /^(https?:)?\/\//.test(file) ? file : base + PHOTO_DIR + file;
      css += "@media(min-width:900px){#" + el.id + "{background-image:url('" + url + "')}}\n";
    }
    if (!css) return;
    var probeAll = document.querySelectorAll("[data-photo-slot-pc]");
    var first = PHOTOS[probeAll[0].getAttribute("data-photo-slot-pc")];
    var probe = new Image();
    probe.onload = function () {
      var st = document.createElement("style");
      st.appendChild(document.createTextNode(css));
      document.head.appendChild(st);
    };
    probe.onerror = function () {   };
    probe.src = /^(https?:)?\/\//.test(first) ? first : base + PHOTO_DIR + first;
  }

  function apply() {
    applyPc();
    var els = document.querySelectorAll("[data-photo-slot]");
    for (var i = 0; i < els.length; i++) {
      (function (el) {
        var key = el.getAttribute("data-photo-slot");
        var file = PHOTOS[key];
        if (!file) return;
        var url = /^(https?:)?\/\//.test(file) ? file : base + PHOTO_DIR + file;
        var probe = new Image();
        probe.onload = function () {
          el.style.backgroundImage = "url('" + url + "')";
          el.classList.add("has-img");
        };
        probe.onerror = function () {   };
        probe.src = url;
      })(els[i]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
