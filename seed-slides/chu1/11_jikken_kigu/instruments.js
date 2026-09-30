(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 document.querySelectorAll('.source-fire').forEach(e=>{const img=document.createElement('img');img.src='assets/match.png';img.alt='点火用のマッチの火';e.appendChild(img)});
 const scenes=[...document.querySelectorAll('[data-scene]')].map(e=>({e,config:JSON.parse(e.dataset.scene),last:-1,token:0}));
 const hose=[[119,434],[150,438],[220,448],[300,460],[390,463],[490,459],[590,451],[656,453]];
 const inlet=[[656,453],[750,454],[750,408]],barrel=[[750,408],[750,104]];
 function trace(c,points,progress,color){const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));let left=lengths.reduce((a,b)=>a+b,0)*progress;c.beginPath();c.moveTo(...points[0]);for(let i=0;i<lengths.length&&left>0;i++){let q=Math.min(1,left/lengths[i]);c.lineTo(points[i][0]+(points[i+1][0]-points[i][0])*q,points[i][1]+(points[i+1][1]-points[i][1])*q);left-=lengths[i];}c.strokeStyle=color;c.lineWidth=12;c.lineCap='round';c.lineJoin='round';c.stroke();}
 function valve(c,x,y,open){c.save();c.translate(x,y);c.rotate(open?0:Math.PI/2);c.strokeStyle='#b41920';c.lineWidth=8;c.lineCap='round';c.beginPath();c.moveTo(-20,0);c.lineTo(20,0);c.stroke();c.restore();}
 function paint(e,s,p=1,old={}){const c=e.querySelector('canvas').getContext('2d');c.clearRect(0,0,960,640);
  if(s.tap)trace(c,hose,old.tap?1:p,'#e59f21');if(s.cock)trace(c,inlet,old.cock?1:p,'#e59f21');if(s.gas)trace(c,barrel,old.gas?1:p,'#e59f21');
  if(s.air){trace(c,[[875,348],[795,348],[750,348]],old.air?1:p,'#2583a0');trace(c,[[750,348],[750,104]],old.air?1:p,'#56a9ad');}
  valve(c,119,375,!!s.tap);valve(c,656,425,!!s.cock);
  // Rotating witness marks follow the collars' horizontal cylindrical surface.
  for(const [y,on,was] of [[409,s.gas,old.gas],[340,s.air,old.air]]){const v=on?(was?1:p):(was?1-p:0),x=750+18*Math.sin(v*Math.PI*.85);c.strokeStyle='#b41920';c.lineWidth=4;c.beginPath();c.moveTo(x,y-8);c.lineTo(x,y+8);c.stroke();}
 }
 function update(){const slide=document.querySelector('.slide:not([hidden])');if(!slide)return;const step=+slide.dataset.step||0;
  for(const scene of scenes){const {e,config}=scene;if(!slide.contains(e)){scene.token++;scene.last=-1;continue;}if(scene.last===step)continue;const old=config.states[Math.max(0,scene.last)]||{},s=config.states[Math.min(step,config.states.length-1)]||{};scene.restore=scene.last<0||step<scene.last;scene.last=step;scene.token++;const token=scene.token;
   if(config.type!=='burner'){const cols=3,rows=config.type==='pipette'?1:2,cell=s.cell||0;e.querySelector('.scene-image').style.backgroundImage=`url(assets/${config.type}.png)`;e.querySelector('.scene-image').style.backgroundPosition=`${(cell%cols)/(cols-1)*100}% ${rows===1?0:Math.floor(cell/cols)*100}%`;const lcd=e.querySelector('.lcd');if(lcd)lcd.textContent=s.value+' g';}
   else{e.dataset.gasState=JSON.stringify(s);window.BurnerMotion.update(e,s,old,scene,token);}
  }
 }
 new MutationObserver(update).observe(document.querySelector('.stage'),{subtree:true,attributes:true,attributeFilter:['data-step','hidden']});update();window.InstrumentScenes={update,scenes};
})();
