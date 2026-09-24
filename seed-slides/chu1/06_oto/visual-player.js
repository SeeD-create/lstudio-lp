(()=>{
 const slides=[...document.querySelectorAll('.slide')],notes=JSON.parse(document.querySelector('#note-data').textContent),select=document.querySelector('#slide-select');
 const maxSteps=slides.map(s=>Math.max(0,...[...s.querySelectorAll('[data-at],[data-fill]')].map(e=>Number(e.dataset.at??e.dataset.fill))));
 let index=Math.max(0,Math.min(slides.length-1,(parseInt(location.hash.slice(1),10)||1)-1)),step=0;
 function fit(){const h=Math.max(100,innerHeight-48);document.documentElement.style.setProperty('--scale',Math.min(innerWidth/1920,h/1080));document.querySelector('.stage').style.top=`${h/2}px`;}
 function apply(){const s=slides[index];s.dataset.step=String(step);s.dataset.sceneStep=(s.dataset.sceneTimeline?.split(',')[step]??String(step));s.querySelectorAll('[data-at]').forEach(e=>e.classList.toggle('is-in',step>=+e.dataset.at));s.querySelectorAll('[data-fill]').forEach(e=>{e.classList.toggle('is-filled',step>=+e.dataset.fill);e.classList.toggle('revealed',step>=+e.dataset.fill);});
  document.querySelector('#counter').textContent=`${index+1} / ${slides.length} · ${step+1}/${maxSteps[index]+1}`;
  document.querySelector('#prev').disabled=index===0&&step===0;document.querySelector('#next').disabled=index===slides.length-1&&step===maxSteps[index];select.value=String(index);document.querySelector('#note-text').textContent=notes[index];
 }
 function show(n,end=false){index=Math.max(0,Math.min(slides.length-1,n));step=end?maxSteps[index]:0;slides.forEach((s,i)=>{s.hidden=i!==index;if(i!==index){s.dataset.step='0';s.querySelectorAll('.is-in,.is-filled,.revealed').forEach(e=>e.classList.remove('is-in','is-filled','revealed'));}});apply();history.replaceState(null,'','#'+(index+1));}
 function next(){if(step<maxSteps[index]){step++;apply();}else if(index<slides.length-1)show(index+1);}
 function previous(){if(step>0){step--;apply();}else if(index>0)show(index-1,true);}
 document.addEventListener('click',e=>{if(e.target.closest('[data-no-tap],button,select,a,input,textarea'))return;next();});
 document.querySelector('.stage').addEventListener('contextmenu',e=>{e.preventDefault();previous();});
 document.querySelector('#next').onclick=next;document.querySelector('#prev').onclick=previous;select.onchange=()=>show(Number(select.value));
 document.addEventListener('keydown',e=>{if(e.target.matches('select,input,textarea')||e.target.isContentEditable)return;if(e.repeat&&!['ArrowLeft','ArrowRight'].includes(e.key))return;if(e.target.matches('button')&&[' ','Enter'].includes(e.key))return;
  if(['ArrowRight','ArrowDown',' ','Enter'].includes(e.key)){e.preventDefault();next();}else if(['ArrowLeft','ArrowUp','Backspace'].includes(e.key)){e.preventDefault();previous();}else if(e.key==='PageDown'){e.preventDefault();show(index+1);}else if(e.key==='PageUp'){e.preventDefault();show(index-1);}else if(e.key==='Home'){e.preventDefault();show(0);}else if(e.key==='End'){e.preventDefault();show(slides.length-1);}
 });
 const panel=document.querySelector('#notes'),toggle=document.querySelector('#toggle-notes');toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));};document.querySelector('#close-notes').onclick=()=>{panel.hidden=true;toggle.setAttribute('aria-expanded','false');};
 document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{}};
 addEventListener('resize',fit);addEventListener('hashchange',()=>show((parseInt(location.hash.slice(1),10)||1)-1));fit();show(index);
 window.SeedOriginal={show,next,previous,get index(){return index;},get step(){return step;},get maxStep(){return maxSteps[index];}};
})();

