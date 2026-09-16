'use strict';
(() => {
  const root=document.documentElement;
  const preference=matchMedia('(prefers-reduced-motion: reduce)');
  const allowed=()=>!preference.matches&&!root.classList.contains('motion-off');
  const progress=document.createElement('div');progress.className='scroll-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
  const headings=[...document.querySelectorAll('main h1, main h2')];
  headings.forEach(heading=>{
    heading.setAttribute('aria-label',heading.textContent.trim());heading.classList.add('type-heading');
    const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    let index=0;nodes.forEach(node=>{const fragment=document.createDocumentFragment();for(const char of node.textContent){const span=document.createElement('span');span.className='char';span.textContent=char;span.setAttribute('aria-hidden','true');span.style.setProperty('--char-index',String(index++));fragment.append(span);}node.replaceWith(fragment);});
  });
  if('IntersectionObserver' in window){
    const letters=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('letters-in');letters.unobserve(entry.target);}}),{threshold:.15});
    headings.forEach(h=>letters.observe(h));
    const pictures=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('image-visible');pictures.unobserve(entry.target);}}),{threshold:.12});
    document.querySelectorAll('.course-art').forEach(el=>{el.classList.add('image-enter');pictures.observe(el);});
  }else headings.forEach(h=>h.classList.add('letters-in'));
  const hero=document.querySelector('.hero');
  [[8,12],[41,28],[32,78],[81,11],[92,67],[49,83]].forEach(([x,y],i)=>{const dot=document.createElement('i');dot.className='hero-light';dot.setAttribute('aria-hidden','true');dot.style.left=x+'%';dot.style.top=y+'%';dot.style.animationDelay=-(i*1.3)+'s';hero?.append(dot);});
  const band=document.querySelector('.study-band');let frame=0;
  function paintScroll(){frame=0;if(!allowed())return;const height=root.scrollHeight-innerHeight;root.style.setProperty('--read-progress',height>0?String(scrollY/height):'0');root.style.setProperty('--word-drift',Math.min(scrollY*.055,45)+'px');if(band){const r=band.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)band.style.setProperty('--photo-drift',Math.max(-25,Math.min(25,(innerHeight/2-r.top-r.height/2)*.07))+'px');}}
  addEventListener('scroll',()=>{if(!frame&&allowed())frame=requestAnimationFrame(paintScroll);},{passive:true});paintScroll();
  let transition;
  document.querySelectorAll('[data-course], [data-show-ai]').forEach(button=>button.addEventListener('click',()=>{if(!allowed())return;transition?.cancel();transition=document.querySelector('.course-detail').animate([{opacity:.25,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.2,.7,.2,1)'});}));
  const fine=matchMedia('(pointer:fine)');
  if(fine.matches){const cursor=document.createElement('div');cursor.className='cursor-glow';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);let last=0;
    document.addEventListener('pointermove',event=>{if(!allowed())return;cursor.classList.add('show');cursor.style.transform=`translate3d(${event.clientX}px,${event.clientY}px,0)`;const now=performance.now();if(now-last>100&&document.querySelectorAll('.light-speck').length<10){last=now;const speck=document.createElement('i');speck.className='light-speck';speck.setAttribute('aria-hidden','true');speck.style.left=event.clientX+'px';speck.style.top=event.clientY+'px';document.body.append(speck);setTimeout(()=>speck.remove(),950);}},{passive:true});document.documentElement.addEventListener('pointerleave',()=>cursor.classList.remove('show'));
  }
  function synchronize(){if(!allowed()){transition?.cancel();if(frame){cancelAnimationFrame(frame);frame=0;}document.querySelectorAll('.light-speck').forEach(el=>el.remove());}else paintScroll();}
  document.querySelector('#motion-toggle')?.addEventListener('click',synchronize);preference.addEventListener('change',synchronize);
})();
