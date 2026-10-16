(()=>{
 const reduce=matchMedia('(prefers-reduced-motion:reduce)');
 document.querySelectorAll('.chef-film,.exterior-film').forEach(video=>{if(video.classList.contains('exterior-film')){video.defaultPlaybackRate=3;video.playbackRate=3;video.addEventListener('loadedmetadata',()=>{video.playbackRate=3;});}let loaded=false,visible=false;const sync=()=>{if(visible&&!document.hidden&&!reduce.matches&&!navigator.connection?.saveData){if(!loaded){const sources=[...video.querySelectorAll('source')];video.src=(sources.find(s=>s.media&&matchMedia(s.media).matches)||sources.find(s=>!s.media)).dataset.src;video.load();loaded=true;}video.play().catch(()=>{});}else video.pause();};new IntersectionObserver(es=>{visible=es[0].isIntersecting;sync();},{threshold:.12}).observe(video);document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);});
 const hero=document.querySelector('.hero-editorial'),plate=hero?.querySelector('.eating-plate');if(!plate)return;
 const frames=Array.from({length:6},(_,i)=>{const el=document.createElement('div');el.className='plate-frame';el.style.backgroundPosition=`${(i%3)*50}% ${Math.floor(i/3)*100}%`;plate.querySelector('.plate-frames').append(el);return el;});
 const note=plate.querySelector('.plate-whisper'),reset=plate.querySelector('.plate-reset');let stage=-1,queued=false;
 const track=document.createElement('div');track.className='tasting-track';hero.before(track);track.append(hero);
 function progress(){const span=track.offsetHeight-hero.offsetHeight;return span>0?Math.max(0,Math.min(1,-track.getBoundingClientRect().top/span)):0;}
 function render(){queued=false;const p=progress(),next=reduce.matches?0:Math.min(5,Math.floor(p/0.16));if(next===stage)return;stage=next;frames.forEach((el,i)=>el.style.opacity=i<=stage?'1':'0');plate.dataset.stage=String(stage);note.textContent=stage===5?'ごちそうさまでした。次のひと皿へ。':stage>0?'あと、もうひとくち。':'スクロールで、ひとくち。';reset.hidden=stage!==5;}
 function schedule(){if(!queued){queued=true;requestAnimationFrame(render);}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});reduce.addEventListener('change',schedule);new ResizeObserver(schedule).observe(hero);
 plate.addEventListener('keydown',e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();const top=scrollY+track.getBoundingClientRect().top,span=track.offsetHeight-hero.offsetHeight;scrollTo({top:top+Math.min(1,(stage+1)*.16+.01)*span,behavior:reduce.matches?'instant':'smooth'});}});
 reset.addEventListener('click',()=>scrollTo({top:scrollY+track.getBoundingClientRect().top,behavior:'instant'}));
 plate.setAttribute('aria-label','スクロールで食べ進むカレーライス。スペースキーでも進めます。');render();
})();
