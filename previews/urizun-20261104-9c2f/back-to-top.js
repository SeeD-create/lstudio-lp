(()=>{
 const style=document.createElement('style');
 style.textContent=`.back-to-top{position:fixed;right:20px;bottom:24px;z-index:90;width:46px;height:46px;border:1px solid #fff;border-radius:50%;background:#07516c;color:white;box-shadow:0 3px 12px #123b4a33;font:700 24px/1 system-ui;cursor:pointer;display:grid;place-items:center}.back-to-top[hidden]{display:none}.back-to-top:hover{background:#007fad}.back-to-top:focus-visible{outline:3px solid #ed533e;outline-offset:3px}@media(max-width:760px){.back-to-top{right:14px;bottom:calc(90px + env(safe-area-inset-bottom,0px))}}`;
 document.head.append(style);
 const button=document.createElement('button');button.type='button';button.className='back-to-top';button.setAttribute('aria-label','ページの先頭へ戻る');button.title='ページの先頭へ戻る';button.textContent='↑';button.hidden=true;document.body.append(button);
 const update=()=>{button.hidden=window.scrollY<400};
 window.addEventListener('scroll',update,{passive:true});update();
 button.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));
})();