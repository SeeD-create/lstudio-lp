(()=>{
const RED='#c4161c',GOLD='#ad7108',INK='#272622',BLUE='#427b92',rad=Math.PI/180;
function line(c,a,b,color,width=4,dash=false){c.save();c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';if(dash)c.setLineDash([10,8]);c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke();c.restore()}
function ray(c,a,b,color,width=5,dash=false){line(c,a,b,color,width,dash);if(dash)return;const t=.57,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t,r=Math.atan2(b[1]-a[1],b[0]-a[0]);c.save();c.translate(x,y);c.rotate(r);c.fillStyle=color;c.beginPath();c.moveTo(13,0);c.lineTo(-9,-7);c.lineTo(-9,7);c.fill();c.restore()}
function label(c,t,x,y,color=INK,size=23){c.fillStyle=color;c.font=`700 ${size}px "Noto Sans JP",sans-serif`;c.textAlign='center';c.fillText(t,x,y)}
const reflections=[...document.querySelectorAll('.reflection-canvas')].map(canvas=>({canvas,slide:canvas.closest('.slide'),deg:30,from:30,to:30,start:0}));
function reflection(r,now){const step=+r.slide.dataset.step||0,c=r.canvas.getContext('2d'),id=r.slide.dataset.id;c.clearRect(0,0,920,580);const t=Math.min(1,(now-r.start)/700);r.deg=r.from+(r.to-r.from)*t*t*(3-2*t);const d=r.deg*rad,p=[460,450],len=360,inc=[460-Math.sin(d)*len,450-Math.cos(d)*len],out=[460+Math.sin(d)*len,450-Math.cos(d)*len];const gradient=c.createLinearGradient(0,450,0,480);gradient.addColorStop(0,'#a8c3cc');gradient.addColorStop(.4,'#edf5f5');gradient.addColorStop(1,'#70848b');c.fillStyle=gradient;c.fillRect(90,450,740,28);line(c,[90,450],[830,450],INK,3);
 const showIncident=id!=='reflect_name'||step>=1,showReflected=id!=='reflect_name'||step>=2,normal=id==='reflect_law'||id==='reflect_measure'&&step>=1;
 if(normal){line(c,[460,58],p,INK,3,true);label(c,'法線（鏡の面に垂直）',460,35);line(c,[460,426],[484,426],INK,2);line(c,[484,426],[484,450],INK,2)}
 if(showIncident)ray(c,inc,p,GOLD,7);if(showReflected)ray(c,p,out,RED,7);
 const ia=id==='reflect_measure'&&step>=2||id==='reflect_law'&&step>=1,ra=id==='reflect_measure'&&step>=3||id==='reflect_law'&&step>=1;
 if(ia){c.strokeStyle=GOLD;c.lineWidth=5;c.beginPath();c.arc(...p,105,-Math.PI/2-d,-Math.PI/2);c.stroke();label(c,`入射角 ${Math.round(r.deg)}°`,200,75,GOLD,28)}
 if(ra){c.strokeStyle=RED;c.lineWidth=5;c.beginPath();c.arc(...p,132,-Math.PI/2,-Math.PI/2+d);c.stroke();label(c,`反射角 ${Math.round(r.deg)}°`,720,75,RED,28)}
 // Labels occupy the bottom band, outside the ray field.
 if(showIncident)label(c,'黄：入射光 → 鏡へ',235,548,GOLD,26);if(showReflected)label(c,'赤：反射光 → 鏡から',685,548,RED,26);
}
for(const r of reflections)new MutationObserver(()=>{r.from=r.deg;r.to=r.slide.dataset.id==='reflect_law'&&+r.slide.dataset.step>=2?60:30;r.start=performance.now()}).observe(r.slide,{attributes:true,attributeFilter:['data-step']});
const sprite=new Image();sprite.src='assets/red-arrow-clean.png';let crop=null;
sprite.onload=()=>{crop={left:290,top:86,width:444,height:1355}};
function arrow(c,x,axis,height,opacity=1){if(!crop)return;c.save();c.globalAlpha=opacity;c.translate(x,axis);if(height<0)c.scale(1,-1);const h=Math.abs(height),w=h*crop.width/crop.height;c.drawImage(sprite,crop.left,crop.top,crop.width,crop.height,-w/2,-h,w,h);c.restore()}
const eye=new Image();eye.src='assets/eye-left.png';
const F=170,H=90,positions=[340,510,255,200,180,170];
const captions=[['2f','レンズの反対側','倒立・同じ大きさの実像'],['3f（遠ざける）','近くにできる','小さい実像'],['1.5f（近づける）','遠くにできる','大きい実像'],['約1.18f（まだ外側）','さらに遠くにできる','さらに大きい実像'],['約1.06f（まだ外側）','もっと遠くにできる','実像はまだできる'],['焦点上（1f）','光は平行に進む','有限の位置に交点なし'],['焦点の内側','レンズの右側からのぞく','正立・拡大の虚像']];
const models=[...document.querySelectorAll('.revised-lens')].map(slide=>({slide,canvas:slide.querySelector('.model-canvas'),front:slide.querySelector('.projection-canvas'),virtual:slide.dataset.id==='lens_virtual',u:slide.dataset.id==='lens_virtual'?110:340,from:340,to:340,start:0}));
function setModel(m){const k=+m.slide.dataset.step||0;m.from=m.u;m.to=m.virtual?110:positions[k];m.start=performance.now();if(m.virtual||m.to===F||m.from===F){m.u=m.to;m.from=m.to}const v=m.virtual?[['焦点の内側','レンズを通った光','右へ広がって進む'],['焦点の内側','光の道を逆へ延ばす','左側にあるように見える'],['焦点の内側','レンズの右側からのぞく','正立・拡大の虚像']][k]:captions[k];['object-position','screen-direction','image-result'].forEach((cls,i)=>m.slide.querySelector('.'+cls).textContent=v[i]);}
for(const m of models){new MutationObserver(()=>setModel(m)).observe(m.slide,{attributes:true,attributeFilter:['data-step']});setModel(m)}
function screenGroup(c,ix,axis,h){
 // One affine transform for screen and image. The local arrow tip (0,1)
 // maps exactly to (ix,axis+h), preserving the calculated ray intersection.
 c.save();c.transform(.75*h,.16*h,0,h,ix,axis);
 c.fillStyle='#e4eae9';c.strokeStyle='#71817f';c.lineWidth=2/h;
 c.fillRect(-.43,-.14,.86,1.28);c.strokeRect(-.43,-.14,.86,1.28);
 arrow(c,0,0,-1);c.restore();
}
function paintModel(m,now){const k=+m.slide.dataset.step||0,t=Math.min(1,(now-m.start)/1100),e=t*t*(3-2*t);m.u=m.from+(m.to-m.from)*e;
 const u=m.u,focus=u===F,v=focus?Infinity:F*u/(u-F),real=v>0,mag=focus?0:Math.abs(v/u),c=m.canvas.getContext('2d');c.clearRect(0,0,1220,560);
 const lo=Math.min(-u-80,real||focus?-u-80:v-100),hi=focus?650:real?v+Math.max(150,H*mag*.6):500;
 const scale=Math.min(1,1080/(hi-lo),real&&!focus?320/(H+H*mag*1.2):350/Math.max(240,H*mag+45));
 const X=x=>65+(x-lo)*scale,Y=y=>(real||focus?120:85)+Math.max(H,real?H:H*mag)*scale+y*scale,axis=Y(0),tip=Y(-H),lx=X(0),ox=X(-u),ix=focus?null:X(v),iy=focus?null:Y(real?H*mag:-H*mag);
 c.fillStyle='#fbfaf6';c.fillRect(0,0,1220,560);c.save();c.beginPath();c.rect(0,0,1220,465);c.clip();line(c,[35,axis],[1185,axis],'#858078',2,true);
 c.fillStyle='#b9dce688';c.strokeStyle=BLUE;c.lineWidth=3;c.beginPath();c.ellipse(lx,axis,Math.max(7,16*scale),120*scale,0,0,Math.PI*2);c.fill();c.stroke();
 for(const x of [-F,F]){c.fillStyle=RED;c.beginPath();c.arc(X(x),axis,5,0,7);c.fill();line(c,[X(x),axis+8],[X(x),470],'#b7aaa0',1,true)}
 ray(c,[ox,tip],[lx,tip],RED,4);ray(c,[ox,tip],[lx,axis],GOLD,4);
 const end=real&&!focus?v:focus?hi-25:70;
 ray(c,[lx,tip],[X(end),Y(-H+end*H/F)],RED,4);ray(c,[lx,axis],[X(end),Y(end*H/u)],GOLD,4);
 const virtualShown=!real&&!focus&&(!m.virtual||k>=1),showVirtualImage=virtualShown&&(!m.virtual||k>=2);
 if(virtualShown){ray(c,[lx,tip],[ix,iy],RED,3,true);ray(c,[lx,axis],[ix,iy],GOLD,3,true)}
 arrow(c,ox,axis,H*scale);
 if(real&&!focus){screenGroup(c,ix,axis,H*mag*scale);line(c,[lx,tip],[ix,iy],RED,3);line(c,[lx,axis],[ix,iy],GOLD,3);c.fillStyle="white";c.beginPath();c.arc(ix,iy,3,0,7);c.fill()}
 if(showVirtualImage){arrow(c,ix,axis,H*mag*scale,.55);c.strokeStyle=RED;c.setLineDash([6,5]);c.strokeRect(ix-H*mag*scale*cropRatio()/2-5,iy-5,H*mag*scale*cropRatio()+10,H*mag*scale+10);c.setLineDash([])}
 const eyeX=X(70),eyeY=Y(70*H/u);
 if(showVirtualImage&&eye.complete&&eye.naturalWidth)c.drawImage(eye,520,205,500,580,eyeX-8,eyeY-55,95,110);
 c.restore();label(c,'物体',ox,515,INK,22);label(c,'凸レンズ',lx,545,BLUE,22);label(c,'F',X(-F),490,RED,20);label(c,'F',X(F),490,RED,20);
 if(!focus&&(real||showVirtualImage))label(c,real?'スクリーンと実像':'虚像の見かけの位置',ix,515,real?INK:RED,22);
 if(showVirtualImage)label(c,'目：右側からのぞく',eyeX+65,515,BLUE,22);
 m.slide.querySelector('.view-note').textContent=focus?'焦点上：出た光は平行':u>F&&u<210?`全体を縮小表示 ／ 焦点まであと ${((u-F)/F).toFixed(2)}f`:'図の縮尺は位置に合わせて変わります';
 const fc=m.front.getContext('2d');fc.clearRect(0,0,360,390);m.slide.querySelector('.projection-panel h2').textContent=real&&!focus?'スクリーンと像':focus||!showVirtualImage?'光の進み方':'見る位置';let caption;
 if(real&&!focus){const h=Math.min(235,90*mag);screenGroup(fc,180,65,h);caption=captions[k][2]}
 else if(focus){ray(fc,[45,95],[310,235],RED,4);ray(fc,[45,190],[310,330],GOLD,4);caption='光が平行に進む'}
 else if(showVirtualImage){if(eye.complete&&eye.naturalWidth)fc.drawImage(eye,520,205,500,580,105,30,160,186);ray(fc,[255,260],[70,260],BLUE,6);label(fc,'左の物体を見る',180,318,BLUE,25);caption='物体 → レンズ → 目'}
 else{ray(fc,[45,155],[310,230],RED,4);ray(fc,[45,210],[310,335],GOLD,4);caption=k===0?'レンズを通った光は右へ進む':'光の道を逆へ延ばす'}
 m.slide.querySelector('.projection-caption').textContent=caption;
 m.slide.dataset.geometry=JSON.stringify({u,v:focus?null:v,scale,objectTip:[ox,tip],imageTip:focus?null:[ix,iy],imageBase:axis,imageHeight:focus?null:H*mag*scale,real,focus,screenShown:real&&!focus,projected:real&&!focus,groupScale:real&&!focus?H*mag*scale:null,eyeShown:showVirtualImage,virtualImageShown:showVirtualImage});
}
function cropRatio(){return crop?crop.width/crop.height:.3}
function tick(now){for(const r of reflections)if(!r.slide.hidden)reflection(r,now);for(const m of models)if(!m.slide.hidden)paintModel(m,now);requestAnimationFrame(tick)}requestAnimationFrame(tick);
})();









