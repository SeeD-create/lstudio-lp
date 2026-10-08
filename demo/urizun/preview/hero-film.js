(()=>{
const frame=document.querySelector('.home-preview .hero-photo');if(!frame)return;
const first=frame.querySelector('img');const reduce=matchMedia('(prefers-reduced-motion: reduce)');
const scenes=[{src:first.src,alt:first.alt,label:'穏やかな日々へ'},{src:'_shared/assets/hero-selected-consult.webp',alt:'代表の写真をもとに生成した、親子と相談する場面のイメージ',label:'家族で相談する'},{src:'_shared/assets/hero-selected-walk.webp',alt:'緑の中を笑顔で歩く親子のイメージ',label:'これからの暮らしへ'}];
const imgs=[first];first.classList.add('hero-scene','is-current','is-moving');
for(let i=1;i<scenes.length;i++){const im=new Image();im.src=scenes[i].src;im.alt=scenes[i].alt;im.className='hero-scene scene-'+i;im.setAttribute('aria-hidden','true');frame.insertBefore(im,frame.querySelector('figcaption'));imgs.push(im)}
frame.querySelector('figcaption').textContent='写真は生成画像によるイメージです';
const controls=document.createElement('div');controls.className='hero-film-controls';controls.setAttribute('aria-label','ヒーロー写真の切り替え');controls.innerHTML='<button type="button" aria-label="前の写真">←</button><span class="hero-film-count">01 / 03</span><button type="button" aria-label="次の写真">→</button><button type="button" class="film-pause" aria-label="写真の自動切替を停止">一時停止</button>';document.querySelector('.hero').append(controls);
let index=0,timer,busy=false,paused=reduce.matches,inView=true;const [prev,next,pause]=controls.querySelectorAll('button');
function schedule(){clearTimeout(timer);imgs.forEach(im=>im.style.animationPlayState=paused||document.hidden||!inView?'paused':'running');if(!paused&&!document.hidden&&inView)timer=setTimeout(()=>show(index+1),3000)}
async function show(n){if(busy)return;busy=true;const target=(n+imgs.length)%imgs.length;try{await imgs[target].decode();const outgoing=imgs[index];outgoing.classList.add('is-outgoing');outgoing.classList.remove('is-current');outgoing.setAttribute('aria-hidden','true');index=target;imgs[index].classList.remove('is-outgoing');imgs[index].classList.add('is-current','is-moving');setTimeout(()=>{if(outgoing!==imgs[index])outgoing.classList.remove('is-outgoing','is-moving')},1100);imgs[index].removeAttribute('aria-hidden');controls.querySelector('span').textContent=String(index+1).padStart(2,'0')+' / 03'}catch{}finally{busy=false;schedule()}}
function sync(){pause.textContent=paused?'再生':'一時停止';pause.setAttribute('aria-label',paused?'写真の自動切替を再生':'写真の自動切替を停止');schedule()}
prev.onclick=()=>show(index-1);next.onclick=()=>show(index+1);pause.onclick=()=>{paused=!paused;sync()};document.addEventListener('visibilitychange',schedule);reduce.addEventListener('change',()=>{paused=reduce.matches;sync()});new IntersectionObserver(es=>{inView=es[0].isIntersecting;schedule()}).observe(frame);sync();
})();
