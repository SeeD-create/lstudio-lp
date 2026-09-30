
(()=>{
const root=document.getElementById('urizun-comic-demo');
const data=[{"title": "相続人・財産の調査", "image": "assets/service-comic-01.webp"}, {"title": "戸籍収集代行", "image": "assets/service-comic-02.webp"}, {"title": "遺産分割協議書の作成", "image": "assets/service-comic-03.webp"}, {"title": "銀行・証券口座の手続き", "image": "assets/service-comic-04.webp"}, {"title": "各種名義変更サポート", "image": "assets/service-comic-05.webp"}, {"title": "遺言書の作成", "image": "assets/service-comic-06.webp"}, {"title": "年金関係の請求サポート", "image": "assets/service-comic-07.webp"}];
const track=root.querySelector('.uc-track'),win=root.querySelector('.uc-window'),gallery=root.querySelector('.uc-gallery'),reader=root.querySelector('.uc-reader'),prev=root.querySelector('.uc-prev'),next=root.querySelector('.uc-next'),count=root.querySelector('.uc-count');
let index=0,opened=null,startX=0,startY=0,swiped=false;
data.forEach((d,i)=>{const b=document.createElement('button');b.type='button';b.className='uc-card cursor-interaction';b.setAttribute('aria-label',d.title+'の漫画を拡大');const img=document.createElement('img');img.src=d.image;img.alt=d.title+'の紹介漫画';img.draggable=false;const cap=document.createElement('span');cap.className='uc-caption';const no=document.createElement('small');no.textContent='SERVICE '+String(i+1).padStart(2,'0');const title=document.createElement('strong');title.textContent=d.title;const hint=document.createElement('em');hint.textContent='漫画を大きく読む';cap.append(no,title,hint);b.append(img,cap);b.onclick=()=>{if(swiped){swiped=false;return}open(i);save()};track.append(b)});
function save(){}
function draw(){const cards=[...track.children],step=cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:0;const max=Math.max(0,track.scrollWidth-win.clientWidth);track.style.transform='translateX(-'+Math.min(index*step,max)+'px)';prev.disabled=index===0;next.disabled=index===data.length-1;count.textContent=(index+1)+' / '+data.length;cards.forEach((b,i)=>b.setAttribute('aria-current',String(i===index)))}
function move(n){index=Math.max(0,Math.min(data.length-1,index+n));draw();save()}
function open(i){opened=i;gallery.hidden=true;reader.hidden=false;reader.querySelector('h3').textContent=data[i].title;reader.querySelector('img').src=data[i].image;reader.querySelector('img').alt=data[i].title+'の紹介漫画（拡大）';reader.querySelector('button').focus()}
function back(){reader.hidden=true;gallery.hidden=false;const old=opened;opened=null;draw();if(old!==null)track.children[old].focus({preventScroll:true});save()}
prev.onclick=()=>move(-1);next.onclick=()=>move(1);root.querySelectorAll('.uc-back').forEach(b=>b.onclick=back);
root.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened!==null)back();if(opened===null&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowLeft'?-1:1)}});
win.addEventListener('pointerdown',e=>{startX=e.clientX;startY=e.clientY;swiped=false});win.addEventListener('pointerup',e=>{const dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){swiped=true;move(dx<0?1:-1)}});
new ResizeObserver(draw).observe(win);
draw();
})();
