(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const hose=[[119,434],[220,448],[300,460],[390,463],[490,459],[590,451],[656,453]],inlet=[[656,453],[750,454],[750,408]],up=[[750,408],[750,104]],air=[[630,342],[730,342],[750,342],[750,104]];
 function line(c,pts,color,phase,progress=1,moving=false){
  const lengths=pts.slice(1).map((p,i)=>Math.hypot(p[0]-pts[i][0],p[1]-pts[i][1]));let left=lengths.reduce((a,b)=>a+b,0)*progress;
  c.beginPath();c.moveTo(...pts[0]);for(let i=0;i<lengths.length&&left>0;i++){const f=Math.min(1,left/lengths[i]);c.lineTo(pts[i][0]+(pts[i+1][0]-pts[i][0])*f,pts[i][1]+(pts[i+1][1]-pts[i][1])*f);left-=lengths[i]}
  c.lineCap='round';c.lineJoin='round';c.lineWidth=18;c.strokeStyle='#fff9';c.stroke();c.lineWidth=11;c.strokeStyle=color;c.stroke();
  if(moving){c.save();c.setLineDash([2,25]);c.lineDashOffset=-phase;c.lineWidth=5;c.strokeStyle='#fff';c.stroke();c.restore()}
 }
 const panelHTML='<div class="motion-focus"><p class="focus-heading"></p><div class="focus-mechanism"><span class="fixed-index">▼</span><div class="knob focus-knob"></div><span class="rotation-symbol">↶</span></div><p class="focus-action"></p><p class="focus-effect"></p></div><div class="flow-key"><span>● ガス</span><span>● 空気</span><span class="flow-status"></span></div><div class="valve-status main-status"></div><div class="valve-status cock-status"></div>';
 function init(e){e.insertAdjacentHTML('beforeend',panelHTML);e.querySelector('.burner-flame').innerHTML='<i class="flame-yellow"></i><i class="flame-blue"></i>';e.insertAdjacentHTML('beforeend','<img class="ignition-match" src="assets/match-lit-transparent.png" alt="筒の口へ斜め下から近づける、火のついたマッチ">');e.querySelector('.source-fire').textContent='火のついたマッチを\n筒の口へ近づける';}
 const controlAngle=(s,key)=>(s[key]?(['tap','cock'].includes(key)?-90:key==='gas'&&s.large?-155:-110):0);
 function controls(c,s,old,t){
  for(const [key,x,y] of [['tap',119,375],['cock',656,425]]){
   const v=(old[key]?1:0)+((s[key]?1:0)-(old[key]?1:0))*t;
   c.save();c.translate(x,y);c.rotate((1-v)*Math.PI/2);c.lineCap='round';c.strokeStyle='#fffdf0';c.lineWidth=12;c.beginPath();c.moveTo(-23,0);c.lineTo(23,0);c.stroke();c.strokeStyle='#b41920';c.lineWidth=6;c.stroke();c.restore();
  }
  for(const [key,y]of[['gas',409],['air',340]]){
   const a=controlAngle(old,key)+(controlAngle(s,key)-controlAngle(old,key))*t;
   const x=750+22*Math.sin(-a*Math.PI/180);
   c.strokeStyle='#fffdf0';c.lineWidth=8;c.beginPath();c.moveTo(x,y-10);c.lineTo(x,y+10);c.stroke();c.strokeStyle='#b41920';c.lineWidth=4;c.stroke();
  }
 }
 function update(e,s,old,scene,token){
  if(!e.querySelector('.motion-focus'))init(e);
  e.classList.toggle('restore-motion',scene.restore);
  const slide=e.closest('.slide'),title=slide.dataset.title,step=+slide.dataset.step||0;
  const parts=title==='ガスバーナーの各部';
  const preceding=scene.config.states[Math.max(0,step-1)]||{};
  let focus=parts?['','tap','cock','gas','air'][step]:['air','gas','cock','tap'].find(k=>!!s[k]!==!!preceding[k]);
  if(!focus&&s.large!==preceding.large)focus='gas';
  if(!focus&&s.ready&&!preceding.ready)focus='ready';
  if(!focus)focus=s.air?'air':s.gas?'gas':'';
  const names={tap:'元栓',cock:'コック',gas:'ガス調節ねじ',air:'空気調節ねじ',ready:'点火用の火'};
  const panel=e.querySelector('.motion-focus'),knob=panel.querySelector('.focus-knob');
  panel.dataset.kind=focus;panel.hidden=!focus||focus==='ready';
  panel.querySelector('.focus-heading').textContent=(names[focus]||'')+((focus==='air'||focus==='gas')?'（上から）':'');
  const on=!!s[focus];const angle=controlAngle(s,focus);
  knob.className='knob focus-knob '+(focus==='air'?'air-knob':'gas-knob');
  knob.style.transition='none';knob.style.transform=`rotate(${controlAngle(old,focus)}deg)`;void knob.offsetWidth;
  knob.style.transition=scene.restore||reduced?'none':'';knob.style.transform=`rotate(${angle}deg)`;
  panel.querySelector('.rotation-symbol').textContent=on?'↶':'↷';
  panel.querySelector('.focus-action').textContent=parts?'操作する場所を確認':focus==='gas'||focus==='air'?(on?'左回りに\n少しずつ開く':'右回りに\n閉じる'):(on?'回して開く':'回して閉じる');
  panel.querySelector('.focus-effect').textContent=focus==='air'?'下のガス調節ねじは押さえて固定':focus==='gas'?(s.flame?'ガスの量が変わり、炎の大きさが変わる':'ガスの量を調節する'):focus==='tap'?'供給元の開閉':focus==='cock'?'器具側の開閉':'';
  e.querySelector('.flow-status').textContent=s.air?'紫：ガスと空気が混ざって上へ':s.gas?'ガスが筒の口へ進む':s.cock?'ガス調節ねじで止まる':s.tap?'コックで止まる':'ガスの供給は閉じている';
  for(const [key,sel]of[['tap','.main-status'],['cock','.cock-status']]){const label=e.querySelector(sel);label.textContent=names[key]+' '+(s[key]?'開':'閉');label.classList.toggle('is-open',!!s[key]);label.classList.toggle('is-focus',focus===key)}
  const notes=[...slide.querySelectorAll('.instructions .paper')];notes.forEach((n,i)=>n.classList.toggle('current-operation',i===step-1));
  const flame=e.querySelector('.burner-flame');flame.className='burner-flame';
  flame.style.setProperty('--flame-height',s.large?'1':'.68');
  const source=e.querySelector('.source-fire'),match=e.querySelector('.ignition-match');source.classList.toggle('ready',!!s.ready&&!s.flame);match.classList.toggle('at-mouth',!!s.ready);
  const start=performance.now(),instant=reduced||scene.restore;
  function frame(now){if(scene.token!==token)return;const elapsed=now-start,turn=instant?1:Math.min(1,elapsed/800),p=instant?1:Math.max(0,Math.min(1,(elapsed-800)/900)),c=e.querySelector('canvas').getContext('2d');c.clearRect(0,0,960,640);
   for(const [key,pts]of[['tap',hose],['cock',inlet],['gas',s.air?[[750,408],[750,342]]:up]])if(s[key])line(c,pts,'#cc8505',elapsed/13,old[key]?1:p,!!s.gas&&!reduced);
   if(s.air){line(c,air.slice(0,3),'#087fae',elapsed/11,old.air?1:p,!reduced);line(c,[[750,342],[750,104]],'#74619e',elapsed/11,old.air?1:p,!reduced)}
   controls(c,s,old,turn);
   e.dataset.motionPhase=turn<1?'turning':p<1?'flowing':'settled';
   const loc={tap:[119,375,43,24],cock:[656,425,43,24],gas:[750,409,35,25],air:[750,340,35,25]}[focus];
   if(loc){c.save();c.strokeStyle='#bb2028';c.lineWidth=3;c.setLineDash([8,5]);c.beginPath();c.ellipse(...loc,0,0,Math.PI*2);c.stroke();c.restore()}
   const ready=instant||elapsed>=1700;flame.classList.toggle('on',!!s.flame&&(!!old.flame||ready));flame.classList.toggle('blue',s.flame==='blue'&&(old.flame==='blue'||ready));source.classList.toggle('ready',!!s.ready&&!s.flame);
   const showMatch=!!s.ready&&(!s.flame||(!instant&&!old.flame&&elapsed<2250));match.classList.toggle('visible',showMatch);
   if(!reduced)requestAnimationFrame(frame);
  }frame(start);
 }
 window.BurnerMotion={update};
})();

