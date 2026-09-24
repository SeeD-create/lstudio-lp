(()=>{'use strict';
const $=id=>document.getElementById(id),slides=JSON.parse($('slide-data').textContent),canvas=$('scene');
let index=0,step=0,from={},to={},state={},progress=1,paused=false,raf=0,start=0;
let duration=2200;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function mix(a,b,t){const out={...b};for(const k of Object.keys(b))if(typeof b[k]==='number')out[k]=(typeof a[k]==='number'?a[k]:b[k])+(b[k]-(typeof a[k]==='number'?a[k]:b[k]))*t;return out;}
function paint(){state=mix(from,to,progress);canvas.width=$('visual').clientWidth;canvas.height=$('visual').clientHeight;Astro.render(canvas,slides[index].scene,state);$('motion').value=Math.round(progress*1000);$('pause').textContent=paused?'再開':'一時停止';}
function tick(now){progress=Math.min(1,(now-start)/duration);paint();if(progress<1&&!paused)raf=requestAnimationFrame(tick);}
function animate(){cancelAnimationFrame(raf);paused=false;if(reduced){progress=1;paint();return;}start=performance.now()-progress*duration;raf=requestAnimationFrame(tick);}
function finish(){cancelAnimationFrame(raf);progress=1;paused=false;paint();}
function show(i,n=0,motion=false){cancelAnimationFrame(raf);index=Math.max(0,Math.min(slides.length-1,i));const s=slides[index];duration=s.scene==='learnAxis'&&n>=3?6500:2200;step=Math.max(0,Math.min(s.notes.length,n));
 $('stage').className=s.scene==='cover'?'cover':s.scene==='memory'?'memory':s.scene==='toc'?'toc':'';$('title').textContent=s.title;
 if(s.scene==='cover')$('title').innerHTML='天体の<br>一日の動き<small>地球が回ると、空はどう見える？</small>';
 $('kicker').textContent='中3 理科 ｜ '+s.chapter;$('caption').textContent=s.caption||'地球と空の関係を、動きで確かめる。';
 $('notes-grid').replaceChildren(...s.notes.map((n,j)=>{const e=document.createElement('div');e.className='sticky'+(typeof n==='object'&&n.red?' answer':'')+(j<step?' shown':'')+(motion&&j===step-1?' entering':'');const t=document.createElement('span');t.className='stamp';t.textContent=typeof n==='string'?n:n.text;e.append(t);return e;}));
 $('scene-html').innerHTML=s.scene==='toc'?'<div class="toc-grid">'+[['01','疑問から、天球へ','自分を中心に、空を表してみよう',2],['02','地球の自転と、見え方','地軸・回転・方位・昼と夜',8],['03','星の動きを確かめる','1時間の動き・四方向の空・練習',20]].map(a=>`<button class="toc-link" data-go="${a[3]}" data-no-tap><span class="num">${a[0]}</span><span><strong>${a[1]}</strong><small>${a[2]}</small></span></button>`).join('')+'</div>':'';
 for(const e of document.querySelectorAll('[data-go]'))e.onclick=()=>show(Number(e.dataset.go));
 $('teacher-text').textContent=s.teacher;$('counter').textContent=`${index+1} / ${slides.length}　段階 ${step}/${s.notes.length}`;$('select').value=index;
 from={...s.states[Math.min(Math.max(0,step-1),s.states.length-1)]};to={...s.states[Math.min(step,s.states.length-1)]};progress=motion&&JSON.stringify(from)!==JSON.stringify(to)?0:1;paused=false;
 history.replaceState(null,'','#'+(index+1));paint();if(progress<1)animate();
}
function next(){if(step<slides[index].notes.length)show(index,step+1,true);else if(index<slides.length-1)show(index+1);}
function previous(){if(step>0)show(index,step-1);else if(index>0)show(index-1,slides[index-1].notes.length);}
function scale(){document.documentElement.style.setProperty('--scale',Math.min(innerWidth/1920,(innerHeight-46)/1080));$('stage').style.top=(innerHeight-46)/2+'px';}
slides.forEach((s,i)=>{const e=document.createElement('option');e.value=i;e.textContent=`${i+1}　${s.title}`;$('select').append(e);});
document.addEventListener('click',e=>{if(!e.target.closest('[data-no-tap],button,input,select'))next();});
document.addEventListener('contextmenu',e=>{if(e.target.closest('[data-no-tap]'))return;e.preventDefault();previous();});
document.addEventListener('keydown',e=>{if(e.target.closest('input,select,textarea')||e.target.closest('#teacher'))return;if(['ArrowRight','ArrowLeft',' ','PageDown','PageUp'].includes(e.key)){e.preventDefault();(['ArrowLeft','PageUp'].includes(e.key)?previous:next)();}});
 $('next').onclick=next;$('prev').onclick=previous;$('toc').onclick=()=>show(0);$('select').onchange=e=>show(Number(e.target.value));
 $('teacher-toggle').onclick=()=>{$('teacher').hidden=!$('teacher').hidden;};$('teacher-close').onclick=()=>{$('teacher').hidden=true;};
 $('full').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen();};
 $('pause').onclick=()=>{if(progress>=1)return;paused=!paused;if(paused){cancelAnimationFrame(raf);paint();}else animate();};
 $('replay').onclick=()=>{progress=0;animate();};$('motion').oninput=e=>{cancelAnimationFrame(raf);paused=true;progress=Number(e.target.value)/1000;paint();};
 window.SeedAstro={show,next,previous,finishAnimation:finish,get index(){return index;},get step(){return step;},get progress(){return progress;},get state(){return {...state};},slides};
 addEventListener('resize',scale);scale();show((Number(location.hash.slice(1))||1)-1);document.fonts.ready.then(paint);
})();
