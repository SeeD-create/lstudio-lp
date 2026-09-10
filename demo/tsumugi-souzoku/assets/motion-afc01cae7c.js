(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const animated = new Set();
  function play(element, frames, options) {
    if (preference.matches) return;
    const animation = element.animate(frames, options);
    animated.add(animation);
    animation.finished.catch(() => {}).finally(() => animated.delete(animation));
  }
  if (!preference.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view', 'heading-visible', 'picture-visible');
      observer.unobserve(entry.target);
    }), {threshold: .08});
    document.querySelectorAll('section h2').forEach(heading => {
      const lines = [[]];
      [...heading.childNodes].forEach(node => {
        if (node.nodeName === 'BR') lines.push([]);
        else lines[lines.length - 1].push(node);
      });
      heading.replaceChildren();
      lines.forEach((nodes, index) => {
        const outer = document.createElement('span');
        const inner = document.createElement('span');
        outer.className = 'motion-line';
        inner.style.setProperty('--line-delay', `${index * 110}ms`);
        inner.append(...nodes);outer.append(inner);heading.append(outer);
      });
      observer.observe(heading);
    });
    document.querySelectorAll('.concerns>a,.article,.service-rows details,.proposal-grid article,.operation li,.profile-note').forEach((item, index) => {
      item.classList.add('motion-item');
      item.style.setProperty('--item-delay', `${index % 3 * 85}ms`);
      observer.observe(item);
    });
    observer.observe(document.querySelector('.photo-band'));
  }
  document.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('.article:not([hidden])').forEach((article,index) => {
      article.classList.add('in-view');
      play(article,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:400,delay:index*55,easing:'ease-out',fill:'backwards'});
    });
  }));
  document.querySelectorAll('.service-rows details,.technical').forEach(details => details.addEventListener('toggle', () => {
    if(details.open) [...details.children].filter(child=>child.tagName!=='SUMMARY').forEach(child=>play(child,[{opacity:0,transform:'translateY(-7px)'},{opacity:1,transform:'none'}],{duration:320,easing:'ease-out'}));
  }));
  const menu=document.querySelector('.menu-button');
  menu.addEventListener('click',()=>{if(menu.getAttribute('aria-expanded')==='true')play(document.querySelector('#mobile-nav'),[{opacity:0,transform:'translateY(-10px)'},{opacity:1,transform:'none'}],{duration:250,easing:'ease-out'});});
  const band=document.querySelector('.photo-band');
  const photograph=band.querySelector('img');
  let scheduled=false;
  const update=()=>{
    scheduled=false;
    if(preference.matches){photograph.style.transform='';return;}
    const box=band.getBoundingClientRect();
    if(box.bottom>0&&box.top<innerHeight){const shift=Math.max(-24,Math.min(24,(innerHeight/2-box.top-box.height/2)*.065));photograph.style.transform=`translateY(${shift}px)`;}
  };
  addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
  preference.addEventListener('change',()=>{
    if(preference.matches){animated.forEach(animation=>animation.cancel());document.querySelectorAll('.motion-item,section h2,.photo-band').forEach(item=>item.classList.add('in-view','heading-visible','picture-visible'));photograph.style.transform='';}
  });
})();
