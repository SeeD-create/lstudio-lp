(()=>{
'use strict';
const root=document.getElementById('urizun-comic-demo');if(!root)return;
const base=new URL('.',document.currentScript.src);
const titles=['相続人・財産の調査','戸籍収集代行','遺産分割協議書の作成','銀行・証券口座の手続き','各種名義変更サポート','遺言書の作成','年金関係の請求サポート'];
const pages=titles.map((title,i)=>{const image=new Image();image.src=new URL(`assets/service-comic-0${i+1}.webp`,base).href;return{title,image};});
const surface=root.querySelector('.uc-surface')||root;
surface.querySelectorAll('.uc-gallery,.uc-reader').forEach(e=>e.remove());
const reader=document.createElement('div');reader.className='uc-flipbook';
reader.innerHTML='<p class="uc-click-help">右側をクリック・タップで次へ、左側で前のページに戻ります。</p><div class="uc-single-book" tabindex="0" role="button" aria-label="漫画をめくる。右側で次へ、左側で前へ。左右キーでも操作できます"><img class="uc-single-page" width="620" height="876" alt="" draggable="false"><canvas class="uc-curl-canvas" aria-hidden="true" hidden></canvas><span class="uc-corner-hint" aria-hidden="true"></span></div><div class="uc-book-navigation"><button type="button" class="uc-nav uc-book-prev">← 前へ</button><div><span class="uc-book-count" role="status" aria-live="polite"></span><h3 class="uc-book-title"></h3></div><button type="button" class="uc-nav uc-book-next">次へ →</button></div>';
surface.append(reader);
const book=reader.querySelector('.uc-single-book'),img=reader.querySelector('.uc-single-page'),canvas=reader.querySelector('canvas'),ctx=canvas.getContext('2d'),prev=reader.querySelector('.uc-book-prev'),next=reader.querySelector('.uc-book-next'),counter=reader.querySelector('.uc-book-count'),heading=reader.querySelector('h3');
let index=0,busy=false,pending=0,frame=0;
function state(){img.alt=titles[index]+'の紹介漫画';counter.textContent=(index+1)+' / '+pages.length;heading.textContent=titles[index];prev.disabled=index===0&&!busy;next.disabled=index===pages.length-1&&!busy;book.dataset.page=String(index+1);book.setAttribute('aria-busy',String(busy));}
// Clip the rectangle against x-y=c. The top-right portion folds across that diagonal.
function polygon(w,h,c,folded){const input=[[0,0],[w,0],[w,h],[0,h]],out=[];const inside=p=>folded?p[0]-p[1]>=c:p[0]-p[1]<=c;for(let i=0;i<4;i++){const a=input[i],b=input[(i+1)%4],ia=inside(a),ib=inside(b);if(ia)out.push(a);if(ia!==ib){const t=(c-a[0]+a[1])/(b[0]-a[0]-b[1]+a[1]);out.push([a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])]);}}return out;}
function path(points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();}
function paint(progress,image){const w=620,h=876,c=w-(w+h)*progress;ctx.clearRect(0,0,w,h);const front=polygon(w,h,c,false),flap=polygon(w,h,c,true).map(([x,y])=>[y+c,x-c]);if(front.length){ctx.save();path(front);ctx.clip();ctx.drawImage(image,0,0,w,h);ctx.restore();}if(flap.length&&progress>0&&progress<1){ctx.save();path(flap);ctx.shadowColor='rgba(38,31,15,.32)';ctx.shadowBlur=24;ctx.shadowOffsetX=-8;ctx.shadowOffsetY=12;ctx.fillStyle='#f5f1e5';ctx.fill();ctx.restore();ctx.save();path(flap);ctx.clip();const g=ctx.createLinearGradient(c-45,45,c+45,-45);g.addColorStop(0,'#e0dacb');g.addColorStop(.48,'#fffdf5');g.addColorStop(1,'#c1baa9');ctx.fillStyle=g;ctx.fillRect(-w,-h,w*3,h*3);ctx.globalAlpha=.06;ctx.transform(0,1,1,0,c,-c);ctx.drawImage(image,0,0,w,h);ctx.restore();}}
async function turn(dir){if(busy){pending=dir;return;}const target=index+dir;if(target<0||target>=pages.length)return;busy=true;state();try{await Promise.all([pages[index].image.decode(),pages[target].image.decode()]);}catch{busy=false;pending=0;state();counter.textContent='画像を読み込めませんでした。もう一度お試しください。';return;}
const old=index,turnImage=dir>0?pages[old].image:pages[target].image;img.src=dir>0?pages[target].image.src:pages[old].image.src;
canvas.width=620;canvas.height=876;canvas.hidden=false;book.classList.add('is-turning');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const duration=reduced?0:560,start=performance.now();
await new Promise(resolve=>{function draw(now){const t=duration?Math.min(1,(now-start)/duration):1;const ease=t*t*(3-2*t);paint(dir>0?ease:1-ease,turnImage);if(t<1)frame=requestAnimationFrame(draw);else resolve();}frame=requestAnimationFrame(draw);});
index=target;img.src=pages[index].image.src;canvas.hidden=true;book.classList.remove('is-turning');busy=false;state();const queued=pending;pending=0;if(queued)turn(queued);}
prev.onclick=()=>turn(-1);next.onclick=()=>turn(1);
book.addEventListener('click',e=>{const bounds=book.getBoundingClientRect();turn(e.detail===0?1:e.clientX<bounds.left+bounds.width/2?-1:1);});
book.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();turn(1);}});
reader.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','PageDown','PageUp'].includes(e.key)){e.preventDefault();turn(['ArrowLeft','PageUp'].includes(e.key)?-1:1);}if(e.key==='Escape'){pending=0;book.blur();}});
img.src=pages[0].image.src;state();
})();
