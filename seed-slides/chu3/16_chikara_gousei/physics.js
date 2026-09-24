/* SeeD: SVG masses, generated cart, and exact Canvas force geometry. */
(()=>{'use strict';
const INK='#242422',RED='#c4161c',BLUE='#276781',GREEN='#4d7957',GRAY='#aaa69b',PAPER='#fbfaf6';
const rad=d=>d*Math.PI/180, mix=(a,b,t)=>a+(b-a)*t, clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const images={};for(const n of ['cart']){const im=new Image();im.src=`assets/${n}.png`;images[n]=im;}
const svgMass=new Image();svgMass.src='assets/mass-simple.svg';images.massSimple=svgMass;
function line(c,x,y,X,Y,col=INK,w=3,dash=false){c.save();c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';if(dash)c.setLineDash([9,8]);c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.stroke();c.restore();}
function arrow(c,x,y,dx,dy,col=RED,w=7,q=1){dx*=q;dy*=q;const len=Math.hypot(dx,dy);if(len<.5)return;const a=Math.atan2(dy,dx),head=Math.min(19,len*.4);c.save();line(c,x,y,x+dx,y+dy,PAPER,w+5);line(c,x,y,x+dx-Math.cos(a)*head*.6,y+dy-Math.sin(a)*head*.6,col,w);c.translate(x+dx,y+dy);c.rotate(a);c.fillStyle=col;c.beginPath();c.moveTo(0,0);c.lineTo(-head,-head*.5);c.lineTo(-head,head*.5);c.closePath();c.fill();c.restore();}
function dot(c,x,y,col=INK,r=6){c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill();}
function text(c,s,x,y,size=23,col=INK,align='center'){c.font=`700 ${size}px "Zen Kaku Gothic New",sans-serif`;c.textAlign=align;c.fillStyle=col;c.fillText(s,x,y);}
function mass(c,x,ringY,w=130){if(!svgMass.complete||!svgMass.naturalWidth)return;const scale=w/230;c.drawImage(svgMass,x-w/2,ringY-4*scale,w,226*scale);}
function cart(c,x,y,angle=0,w=125){const im=images.cart;if(!im.complete||!im.naturalWidth)return;c.save();c.translate(x,y);c.rotate(rad(angle));const h=w*525/1750;c.drawImage(im,10,175,1750,525,-w/2,-h+2,w,h);c.restore();}
function beam(c,x,X,y){line(c,x,y,X,y,'#827c70',9);for(let a=x+10;a<X;a+=23)line(c,a,y-2,a+12,y-16,'#bdb7ab',2);}
function strings(c,x,y,theta=40,half=155,w=145){const spread=half*Math.tan(rad(theta));beam(c,x-spread-27,x+spread+27,y-half);line(c,x-spread,y-half,x,y,'#827c70',4);line(c,x+spread,y-half,x,y,'#827c70',4);mass(c,x,y,w);}
function divider(c){line(c,500,30,500,520,'#ddd8cd',2);}
function forceStrings(c,x,y,theta,{gravity=true,parts=true,result=true,guide=true,W=200}={}){const dx=W/2*Math.tan(rad(theta)),dy=-W/2;
 if(guide&&parts){line(c,x-dx,y+dy,x,y-W,GRAY,2,true);line(c,x+dx,y+dy,x,y-W,GRAY,2,true);}
 if(gravity)arrow(c,x,y,0,W,INK,7);
 if(parts){arrow(c,x,y,-dx,dy,BLUE,7);arrow(c,x,y,dx,dy,BLUE,7);}
 if(result)arrow(c,x,y,0,-W,RED,8);dot(c,x,y);
}
function polygon(c,o,a,b,parts=true,guides=true,result=true,progress=1){const [x,y]=o;if(guides){line(c,x+a[0],y+a[1],x+a[0]+b[0]*progress,y+a[1]+b[1]*progress,GRAY,3,true);line(c,x+b[0],y+b[1],x+b[0]+a[0]*progress,y+b[1]+a[1]*progress,GRAY,3,true);}if(parts){arrow(c,x,y,...a,BLUE);arrow(c,x,y,...b,BLUE);}if(result)arrow(c,x,y,a[0]+b[0],a[1]+b[1],RED,8);dot(c,x,y);}
function track(c,x,y,theta,L=650){const a=rad(theta);line(c,x-50*Math.cos(a),y-50*Math.sin(a),x+L*Math.cos(a),y+L*Math.sin(a),'#938a78',7);line(c,x-50*Math.cos(a),y-50*Math.sin(a)+8,x+L*Math.cos(a),y+L*Math.sin(a)+8,'#dbd4c5',5);}
function slopeVectors(c,x,y,theta,{gravity=true,parts=true,guides=true,normal=false,W=235}={}){const t=rad(theta),px=W*Math.sin(t)*Math.cos(t),py=W*Math.sin(t)**2,nx=-px,ny=W*Math.cos(t)**2;
 if(guides&&parts){line(c,x+px,y+py,x,y+W,GRAY,2,true);line(c,x+nx,y+ny,x,y+W,GRAY,2,true);}
 if(gravity)arrow(c,x,y,0,W,INK,8);
 if(parts){arrow(c,x,y,nx,ny,BLUE,6);arrow(c,x,y,px,py,RED,7);}
 if(normal)arrow(c,x,y,-nx,-ny,GREEN,7);dot(c,x,y);
 return {parallel:W*Math.sin(t),perpendicular:W*Math.cos(t),px,py,nx,ny};
}
function slopeImage(c,theta=25,x=100,y=140,L=340,pos=110,w=125){track(c,x,y,theta,L);const a=rad(theta);cart(c,x+pos*Math.cos(a),y+pos*Math.sin(a),theta,w);}
function motion(theta,t){const a=9.8*Math.sin(rad(theta));return {a,s:.5*a*t*t,v:a*t};}
const list=[...document.querySelectorAll('canvas[data-mode]')].map(canvas=>({canvas,slide:canvas.closest('.slide'),mode:canvas.dataset.mode,k:0,previous:0,changed:performance.now(),active:false,time:0,running:false,last:null,theta:25}));
for(const it of list){
 const control=it.slide.querySelector('.sim-controls');
 if(control){
  control.querySelector('.play').onclick=()=>{if(it.time>=1)it.time=0;it.running=!it.running;it.last=performance.now();};
  control.querySelector('.reset').onclick=()=>{it.time=0;it.running=false;it.last=null;};
  const input=control.querySelector('.angle');if(input)input.oninput=()=>{it.theta=+input.value;it.time=0;it.running=false;it.last=null;control.querySelector('.angle-value').value=`${it.theta}°`;};
  control.addEventListener('contextmenu',e=>e.stopPropagation());
 }
}
function update(it,now){const k=+it.slide.dataset.step||0;
 if(!it.active){it.active=true;it.k=k;it.previous=k;it.changed=now;it.time=k>0?1:0;it.running=false;it.last=now;}
 if(k!==it.k){const old=it.k;it.previous=old;it.k=k;it.changed=now;
  if(['race','lab'].includes(it.mode)){
   if(k<old){it.running=false;it.time=k===0?0:1;}
   else if(k===1&&old===0){it.time=0;it.running=true;it.last=now;}
  }
 }
 if(it.running){it.time=Math.min(1,it.time+Math.max(0,now-(it.last??now))/4000);if(it.time>=1)it.running=false;}it.last=now;
 const control=it.slide.querySelector('.sim-controls');if(control){control.querySelector('.play').textContent=it.running?'一時停止':it.time>=1?'もう一度':'再生';control.querySelector('.clock').value=`経過 ${it.time.toFixed(2)} 秒`;}
}
function race(c,it,k,ready=false){const t=ready?0:it.time,angles=[15,30],origins=[65,305];
 angles.forEach((theta,j)=>{const x=130,y=origins[j],a=rad(theta),data=motion(theta,t);track(c,x,y,theta,420);if(k>=2&&!ready)for(let z=0;z<=4;z++){const tz=z/4;if(tz>t+.0001)continue;const p=motion(theta,tz).s*150;dot(c,x+p*Math.cos(a),y+p*Math.sin(a)+14,j===0?BLUE:RED,5);}
 cart(c,x+data.s*150*Math.cos(a),y+data.s*150*Math.sin(a),theta,100);
 const bx=730,by=j?400:140;text(c,j?'急な坂　30°':'緩い坂　15°',bx+80,by-49,24,j?RED:BLUE);text(c,'速さ',bx-14,by+8,20,GRAY,'right');line(c,bx,by,bx+180,by,'#dedad1',14);if(t>0)line(c,bx,by,bx+data.v*32,by,j?RED:BLUE,14);
 });line(c,40,265,960,265,'#ddd8cd',2);line(c,675,35,675,520,'#ddd8cd',2);
 it.slide.dataset.motion=JSON.stringify({time:t,slow:motion(15,t),fast:motion(30,t),running:it.running});
}
function draw(it,now){update(it,now);const c=it.canvas.getContext('2d'),m=it.mode,k=it.k;
 c.clearRect(0,0,it.canvas.width,it.canvas.height);if(m!=='cover'){c.fillStyle=PAPER;c.fillRect(0,0,1000,550);}
 const q=clamp((now-it.changed)/650,0,1),ease=q*q*(3-2*q);
 if(m==='cover'){strings(c,475,470,42,360,305);return;}
 if(m==='single'){beam(c,240,760,90);line(c,500,90,500,260,'#827c70',4);mass(c,500,260,230);}
 else if(m==='arrows'){dot(c,200,180);dot(c,200,390);if(k>=2){arrow(c,200,180,220,0,BLUE,9);arrow(c,200,390,k>=3?440:220,0,BLUE,9);}if(k>=3){for(let j=0;j<=4;j++){line(c,200+j*110,450,200+j*110,464,GRAY,2);}line(c,200,456,640,456,GRAY,2);}text(c,'別の例を、同じ縮尺で比較',500,70,25,GRAY);}
 else if(m==='rest'){divider(c);beam(c,120,400,75);line(c,260,75,260,245,'#827c70',4);mass(c,260,245,155);const x=750,y=290;if(k>=1)arrow(c,x,y,0,190,INK,8);if(k>=2)arrow(c,x,y,0,-190,BLUE,8);dot(c,x,y);}
 else if(['same','opposite','zero'].includes(m)){const same=m==='same',zero=m==='zero',unit=63,o=zero?500:360;line(c,80,280,920,280,'#ddd8cd',2);text(c,'元の２力',160,65,25,GRAY);text(c,'置き換えた合力',180,335,25,GRAY);if(k>=1||zero){if(same){arrow(c,190,145,unit*2,0,BLUE);arrow(c,490,145,unit*3,0,BLUE);text(c,'2 N',250,225,28,BLUE);text(c,'3 N',580,225,28,BLUE);}else{arrow(c,o,165,-unit*(zero?3:2),0,BLUE);arrow(c,o,165,unit*(zero?3:5),0,BLUE);dot(c,o,165);text(c,zero?'3 N':'2 N',o-130,230,28,BLUE);text(c,zero?'3 N':'5 N',o+180,230,28,BLUE);}}
 if(k>=2){if(!zero)arrow(c,260,420,unit*(same?5:3),0,RED,9);dot(c,260,420);text(c,zero?'合力 0 N':same?'5 N':'3 N',700,433,32,RED);}}
 else if(m==='strings'){strings(c,500,290,40,190,190);}
 else if(m==='strings-balance'||m==='strings-split'||m==='wide'){divider(c);let theta=40;if(m==='wide'){const ts=[20,20,40,60],target=ts[k]??60,from=ts[it.previous]??target;theta=k<it.previous?target:mix(from,target,ease);}
 strings(c,250,300,theta,115,150);
 if(m==='strings-balance')forceStrings(c,750,300,40,{gravity:k>=1,parts:k>=2,result:k>=3,guide:k>=3,W:180});
 else if(m==='strings-split')forceStrings(c,750,300,40,{gravity:false,parts:k>=2,result:k>=1,guide:k>=2,W:180});
 else forceStrings(c,750,300,theta,{gravity:k>=1,parts:true,result:k>=1,W:180});
 it.slide.dataset.motion=JSON.stringify({angle:theta,weight:180,resultant:180,tension:180/(2*Math.cos(rad(theta)))});
 }
 else if(m==='wide-check'){strings(c,230,320,20,145,140);strings(c,750,320,60,145,140);if(k>=1){arrow(c,230,382,0,130,INK);arrow(c,750,382,0,130,INK);}if(k>=2){forceStrings(c,230,320,20,{gravity:false,result:false,guide:false,W:140});forceStrings(c,750,320,60,{gravity:false,result:false,guide:false,W:140});}}
 else if(['parallelogram','practice','split','split-draw'].includes(m)){
 const practice=m==='practice',split=m.startsWith('split'),o=practice?[250,300]:[280,430],a=practice?[250,-170]:[280,-50],b=practice?[240,110]:[100,-270];
 if(!split){polygon(c,o,a,b,k>=1||practice,k>=2,k>=3,k===2?ease:1);}
 else{polygon(c,o,a,b,k>=3,k>=2,k>=1||m==='split-draw',k===2?ease:1);if(k>=1&&k<3){line(c,o[0],o[1],o[0]+a[0]*1.5,o[1]+a[1]*1.5,GRAY,2,true);line(c,o[0],o[1],o[0]+b[0]*1.4,o[1]+b[1]*1.4,GRAY,2,true);}}
 }
 else if(m==='race-ready'||m==='race'){race(c,it,k,m==='race-ready');}
 else if(m==='gravity-slope'){[15,35].forEach((t,j)=>{const x=85+j*500,y=175;slopeImage(c,t,x,y,330,125,130);if(k>=1)arrow(c,x+125*Math.cos(rad(t)),y+125*Math.sin(rad(t))-15,0,215,INK,8);});divider(c);}
 else if(m==='slope-split'||m==='normal'){divider(c);slopeImage(c,30,85,160,350,115,140);const x=760,y=m==='normal'?260:180;line(c,x-140,y-80,x+150,y+87,'#dfd8ca',4);if(m==='slope-split'){
  if(k>=2){const t=rad(30);line(c,x-80*Math.cos(t),y-80*Math.sin(t),x+230*Math.cos(t),y+230*Math.sin(t),GRAY,2,true);line(c,x+110*Math.sin(t),y-110*Math.cos(t),x-265*Math.sin(t),y+265*Math.cos(t),GRAY,2,true);}
  slopeVectors(c,x,y,30,{gravity:k>=1,parts:k>=3,guides:k>=3});
 }else{const theta=rad(30),W=220,dx=-W*Math.cos(theta)*Math.sin(theta),dy=W*Math.cos(theta)**2;if(k>=1)arrow(c,x,y,dx,dy,BLUE,8);if(k>=2)arrow(c,x,y,-dx,-dy,GREEN,8);dot(c,x,y);}}
 else if(m==='steeper'){[15,30].forEach((theta,j)=>{const x=250+j*500,y=190;line(c,x-140,y-140*Math.tan(rad(theta)),x+160,y+160*Math.tan(rad(theta)),'#d8d0c1',6);slopeVectors(c,x,y,theta,{gravity:k>=1,parts:k>=2,guides:k>=2});});divider(c);}
 else if(m==='lab'){divider(c);const t=rad(it.theta),mo=motion(it.theta,it.time),x=82,y=90,L=390;track(c,x,y,it.theta,L);for(let j=0;j<=4;j++){let tt=j/4;if(tt>it.time+.0001)continue;let s=motion(it.theta,tt).s*95;dot(c,x+s*Math.cos(t),y+s*Math.sin(t)+12,GRAY,4);}cart(c,x+mo.s*95*Math.cos(t),y+mo.s*95*Math.sin(t),it.theta,92);slopeVectors(c,760,210,it.theta,{W:240});line(c,600,52,900,52,'#dedad1',12);line(c,600,52,600+Math.sin(t)*300,52,RED,12);text(c,'斜面に平行な分力の大きさ',750,100,22,RED);it.slide.dataset.motion=JSON.stringify({time:it.time,angle:it.theta,...mo,parallelRatio:Math.sin(t),perpendicularRatio:Math.cos(t),running:it.running});}
 else if(m==='horizontal'){track(c,160,310,0,680);cart(c,500,310,0,190);if(k>=1){arrow(c,500,280,0,185,INK,8);arrow(c,500,280,0,-185,GREEN,8);dot(c,500,280);}}
 else if(m==='quiz'){line(c,40,275,960,275,'#ddd8cd',2);strings(c,255,140,20,85,95);strings(c,740,140,60,85,95);slopeImage(c,15,100,365,320,120,100);slopeImage(c,30,595,330,315,120,100);}
}
function frame(now){for(const it of list){if(it.slide.hidden){if(it.active){it.active=false;it.running=false;it.time=0;}continue;}draw(it,now);}requestAnimationFrame(frame);}requestAnimationFrame(frame);
window.SeedPhysics={motion,slopeComponents:(theta,W=1)=>({parallel:W*Math.sin(rad(theta)),perpendicular:W*Math.cos(rad(theta))}),tension:(theta,W=1)=>W/(2*Math.cos(rad(theta))),images};
})();
