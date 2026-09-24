(() => {
  const slides=[...document.querySelectorAll('.slide')];
  const memos=JSON.parse(document.querySelector('#note-data').textContent);
  const max=slides.map(s=>s.querySelectorAll('.note').length);
  const select=document.querySelector('#slide-select');
  let index=0,step=0;
  const poses=new WeakMap();
  document.querySelectorAll('[data-poses]').forEach(e=>poses.set(e,JSON.parse(e.dataset.poses)));
  function fit(){const h=Math.max(100,innerHeight-64);document.documentElement.style.setProperty('--scale',Math.min(innerWidth/1920,h/1080));document.querySelector('.stage').style.top=h/2+'px';}
  function apply(){
    const s=slides[index];s.dataset.step=step;
    s.querySelectorAll('.note').forEach((n,i)=>n.classList.toggle('is-in',i<step));
    s.querySelectorAll('[data-from]').forEach(e=>{
      const on=step>=Number(e.dataset.from)&&step<Number(e.dataset.until||999);
      e.classList.toggle('revealed',on);e.setAttribute('aria-hidden',String(!on));
    });
    s.querySelectorAll('[data-poses]').forEach(e=>{
      const frames=poses.get(e),p=frames[Math.min(step,frames.length-1)];
      e.style.transform=`translate(${p[0]}px, ${p[1]}px) scale(${p[2]??1})`;
      e.style.opacity=p[3]??1;e.dataset.pose=JSON.stringify(p);
    });
    s.querySelectorAll('[data-light-at]').forEach(e=>e.classList.toggle('lit',step>=+e.dataset.lightAt));
    s.querySelectorAll('[data-close-at]').forEach(e=>e.style.transform=`rotate(${step>=+e.dataset.closeAt?0:-29}deg)`);
    s.querySelectorAll('[data-grow-at]').forEach(e=>{const on=step>=+e.dataset.growAt;e.style.transform=`scaleY(${on?1:0})`;e.style.opacity=on?1:0;});
    s.querySelectorAll('[data-active-at]').forEach(e=>e.classList.toggle('active',step>=+e.dataset.activeAt));
    s.querySelectorAll('[data-drift-at]').forEach(e=>e.classList.toggle('drifting',step>=+e.dataset.driftAt&&step<+e.dataset.driftUntil));
    s.querySelectorAll('[data-highlight-at]').forEach(e=>e.classList.toggle('highlighted',step>=+e.dataset.highlightAt));
    s.querySelectorAll('[data-levels]').forEach(e=>{const levels=JSON.parse(e.dataset.levels),y=levels[Math.min(step,levels.length-1)];e.style.y=y+'px';e.style.height=(+e.dataset.floor-y)+'px';});
    document.querySelector('#counter').textContent=`${index+1} / ${slides.length}　·　${step} / ${max[index]}`;
    select.value=index;document.querySelector('#note-text').textContent=memos[index];
    document.querySelector('#prev').disabled=index===0&&step===0;
    document.querySelector('#next').disabled=index===slides.length-1&&step===max[index];
  }
  function show(i,end=false){
    index=Math.min(slides.length-1,Math.max(0,i));step=end?max[index]:0;
    slides.forEach((s,j)=>s.hidden=j!==index);
    const s=slides[index];s.classList.add('no-motion');apply();void s.offsetHeight;s.classList.remove('no-motion');
    history.replaceState(null,'','#'+(index+1));
  }
  function next(){if(step<max[index]){step++;apply();}else if(index<slides.length-1)show(index+1);}
  function previous(){if(step>0){step--;apply();}else if(index>0)show(index-1,true);}
  document.addEventListener('click',e=>{if(e.target instanceof Element&&!e.target.closest('[data-no-tap],button,select,input,textarea,a'))next();});
  document.querySelector('.stage').addEventListener('contextmenu',e=>{e.preventDefault();previous();});
  document.addEventListener('keydown',e=>{
    if(e.target instanceof Element&&(e.target.closest('select,input,textarea')||e.target.isContentEditable))return;
    if(e.repeat&&!['ArrowLeft','ArrowRight'].includes(e.key))return;
    if(e.target instanceof Element&&e.target.closest('button,a')&&['Enter',' '].includes(e.key))return;
    if(['ArrowRight','ArrowDown','Enter',' '].includes(e.key)){e.preventDefault();next();}
    else if(['ArrowLeft','ArrowUp','Backspace'].includes(e.key)){e.preventDefault();previous();}
    else if(e.key==='Home')show(0);else if(e.key==='End')show(slides.length-1);
  });
  document.querySelector('#prev').onclick=previous;document.querySelector('#next').onclick=next;select.onchange=()=>show(+select.value);
  const notes=document.querySelector('#notes'),toggle=document.querySelector('#toggle-notes');
  toggle.onclick=()=>{notes.hidden=!notes.hidden;toggle.setAttribute('aria-expanded',String(!notes.hidden));};
  document.querySelector('#close-notes').onclick=()=>{notes.hidden=true;toggle.setAttribute('aria-expanded','false');};
  document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}};
  addEventListener('resize',fit);addEventListener('hashchange',()=>show((parseInt(location.hash.slice(1))||1)-1));
  window.SeedOriginal={show,next,previous,get index(){return index},get step(){return step},get maxStep(){return max[index]}};
  fit();show((parseInt(location.hash.slice(1))||1)-1);
})();
