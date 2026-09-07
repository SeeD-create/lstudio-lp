/* このファイルが読めたことを印にする。CSS側の保険（html:not(.mo)）を外すため */
document.documentElement.classList.add('mo');

/* ---- 幕を上げる ---- */
const lift=()=>document.body.classList.add('loaded');
if(document.readyState==='complete') lift(); else addEventListener('load',lift);
setTimeout(lift,2200);            // 画像が重いときの保険

/* ---- ナビ：下で隠れ、上で戻る ---- */
const nav=document.getElementById('nav');
let lastY=0;
const navTick=()=>{
  const y=window.scrollY;
  nav.classList.toggle('solid', y>window.innerHeight*.62);
  nav.classList.toggle('hide', y>lastY+6 && y>window.innerHeight);
  if(Math.abs(y-lastY)>6) lastY=y;
};
addEventListener('scroll',navTick,{passive:true}); navTick();

/* ---- 出現：.rv / .stagger / .band / .divider ---- */
const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){e.target.classList.add('in'); io.unobserve(e.target);}
}),{rootMargin:'0px 0px -10% 0px',threshold:.05});
document.querySelectorAll('.rv,.stagger,.band,.divider').forEach(el=>io.observe(el));

/* ---- 画像の幕開け ----
   注意：clip-path をかけた要素そのものを IntersectionObserver で見ると、
   完全にクリップされているせいで永久に isIntersecting=false になり発火しない。
   必ず「親」を観測して、クラスは .ib 側に付ける。 */
document.querySelectorAll('.ib').forEach(ib=>{
  const host=ib.parentElement||ib;
  const o=new IntersectionObserver(es=>es.forEach(e=>{
    if(e.isIntersecting){ ib.classList.add('in'); o.disconnect(); }
  }),{rootMargin:'0px 0px -8% 0px',threshold:.02});
  o.observe(host);
});

/* ---- 帯の視差（rAFで間引き） ---- */
const bands=[...document.querySelectorAll('.band')];
let raf=0;
const parallax=()=>{
  raf=0;
  const vh=innerHeight;
  for(const b of bands){
    const r=b.getBoundingClientRect();
    if(r.bottom<-120||r.top>vh+120) continue;
    const p=(r.top+r.height/2-vh/2)/vh;
    const img=b.querySelector('img');
    if(img) img.style.transform='translate3d(0,'+(p*-7).toFixed(2)+'%,0) scale(1.14)';
  }
};
const onPar=()=>{ if(!raf) raf=requestAnimationFrame(parallax); };
if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
  addEventListener('scroll',onPar,{passive:true});
  addEventListener('resize',onPar);
  onPar();
}
