(()=>{
'use strict';
const kit=new Image(),pump=new Image();kit.src='assets/apparatus.png';pump.src='assets/pump.png';
const waterImages=Object.fromEntries(['series','parallel'].map(key=>{const image=new Image();image.src=`assets/water-${key}.png`;return [key,image]}));
const levelViews=new Image();levelViews.src='assets/water-level-views.png';
const levelSeries=new Image();levelSeries.src='assets/water-level-series-v2.png';
const ready=Promise.all([levelSeries.decode(),levelViews.decode(),kit.decode(),pump.decode(),...Object.values(waterImages).map(i=>i.decode()),document.fonts.ready]);
let ctx,labels=[],time=0;const ink='#292b2c',red='#c4161c',blue='#347f9d',muted='#706d66';
const atlas={battery:[15,175,490,205],off:[570,55,395,380],on:[1080,55,395,380],open:[30,535,470,360],closed:[540,645,450,250],meter:[1060,527,445,422]};
function pic(name,x,y,w,h){const a=atlas[name];ctx.drawImage(kit,a[0]*kit.width/1536,a[1]*kit.height/1024,a[2]*kit.width/1536,a[3]*kit.height/1024,x,y,w,h);}
function line(points,color=ink,width=5){ctx.beginPath();ctx.moveTo(...points[0]);for(const v of points.slice(1))ctx.lineTo(...v);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();}
function circle(x,y,r,fill,stroke){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=3;ctx.stroke();}}
function text(s,x,y,size=28,color=ink,align='center'){ctx.font=`700 ${size}px "Zen Kaku Gothic New",sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(s,x,y);const w=ctx.measureText(s).width;labels.push({text:s,x:align==='center'?x-w/2:x,y:y-size*.55,w,h:size*1.1});}
function arrow(x,y,angle=0,color=blue,size=14){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(size,0);ctx.lineTo(-size,-size*.6);ctx.lineTo(-size,size*.6);ctx.closePath();ctx.fill();ctx.restore();}
function symbol(type,x,y,scale=1,open=false){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);if(type==='battery'){ctx.clearRect(-20,-44,40,88);line([[-12,-40],[-12,40]]);line([[13,-23],[13,23]]);text('＋',-38,-48,23,red);text('−',40,-48,23,ink);}else if(type==='lamp'){circle(0,0,31,'#fff',ink);line([[-20,-20],[20,20]],ink,3);line([[-20,20],[20,-20]],ink,3);}else if(type==='switch'){ctx.clearRect(-40,-38,80,76);circle(-30,0,5,'#fff',ink);circle(30,0,5,'#fff',ink);line([[-30,0],[29,open?-30:0]],ink,4);}else{circle(0,0,32,'#fff',type==='V'?red:blue);text(type,0,1,30,type==='V'?red:blue);}ctx.restore();}
function lamp(x,y,on=true,style='real',dim=false){if(style==='symbol'){symbol('lamp',x,y);return;}ctx.save();if(dim){pic('off',x-83,y-106,166,160);ctx.globalAlpha=.32;}pic(on?'on':'off',x-83,y-106,166,160);ctx.restore();line([[x-84,y],[x-63,y]],ink,4);line([[x+63,y],[x+84,y]],ink,4);}
function battery(x,y,style='real'){if(style==='symbol')symbol('battery',x,y);else{pic('battery',x-115,y-54,230,98);line([[x-116,y],[x-102,y]],ink,4);line([[x+102,y],[x+116,y]],ink,4);}}
function switchAt(x,y,open,style='real',scale=1){if(style==='symbol'){symbol('switch',x,y,1,open);return;}ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);pic(open?'open':'closed',-66,open?-82:-33,132,open?101:74);line([[-67,0],[-43,0]],ink,4);line([[43,0],[67,0]],ink,4);ctx.restore();}
function lightOrb(x,y){
 ctx.save();
 const halo=ctx.createRadialGradient(x,y,3,x,y,30);
 halo.addColorStop(0,'rgba(255,255,235,1)');halo.addColorStop(.38,'rgba(255,223,100,.95)');halo.addColorStop(.65,'rgba(255,191,43,.38)');halo.addColorStop(1,'rgba(255,181,30,0)');
 circle(x,y,30,halo);circle(x,y,14,'#ffe189');circle(x,y,9,'#fffef1');
 ctx.restore();
}
function pathDots(points,speed=1,count=16,color=blue,glow=false){let lengths=[],total=0;for(let i=1;i<points.length;i++){const l=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);lengths.push(l);total+=l;}for(let j=0;j<count;j++){let d=(j*total/count+time*speed*65)%total;let i=0;while(d>lengths[i]&&i<lengths.length-1){d-=lengths[i++];}const a=points[i],b=points[i+1],f=d/lengths[i];const x=a[0]+(b[0]-a[0])*f,y=a[1]+(b[1]-a[1])*f;if(glow)lightOrb(x,y);else arrow(x,y,Math.atan2(b[1]-a[1],b[0]-a[0]),color,9);}}
function circuit({parallel=false,two=true,on=true,upperOff=false,switchOpen=null,style='real',flow=false,glow=false,points=false,lower=430,upper=270,measurement=null,voltage=null}={}){
 const l=145,r=915,top=120;
 line([[415,top],[l,top],[l,lower],[r,lower],[r,top],[645,top]]);
 if(parallel){line([[l,upper],[r,upper]]);circle(l,upper,7,ink);circle(r,upper,7,ink);}
 if(flow&&on){pathDots([[415,top],[l,top],[l,lower],[r,lower],[r,top],[645,top]],1,15,blue,glow);if(parallel&&!upperOff)pathDots([[l,upper],[r,upper]],.6,5,blue,glow);}
 if(style==='symbol'){line([[415,top],[518,top]]);line([[543,top],[645,top]]);}
 battery(530,top,style);
 if(parallel){lamp(530,upper,on&&!upperOff,style);lamp(530,lower,on,style);}else if(two){lamp(365,lower,on,style);lamp(685,lower,on,style);}else lamp(530,lower,on,style);
 if(switchOpen!==null)switchAt(parallel?300:two?220:270,parallel?upper:lower,switchOpen,style,two&&!parallel?.8:1);
 if(points){if(parallel){text('A',88,195,29,blue);text('B',310,upper-48,29,blue);text('C',310,lower+66,29,blue);text('D',974,195,29,blue);}else{text('A',230,lower-52,29,blue);text('B',530,lower-52,29,blue);text('C',810,lower-52,29,blue);}}
 if(measurement){const pos=parallel?{A:[145,195],B:[310,upper],C:[310,lower],D:[915,195]}:{A:[230,lower],B:[530,lower],C:[810,lower]};symbol('A',...pos[measurement]);}
 if(voltage){let a,b,y,mid;
  if(voltage==='source'){a=[400,top];b=[660,top];y=36;mid=530;}
  else if(parallel){const yy=voltage==='one'?upper:lower;a=[405,yy];b=[655,yy];y=yy+83;mid=530;}
  else{const x=!two?530:voltage==='one'?365:685;a=[x-115,lower];b=[x+115,lower];y=lower+100;mid=x;}
  line([a,[a[0],y],[mid-33,y]],red,3);line([[mid+33,y],[b[0],y],b],ink,3);circle(...a,6,red);circle(...b,6,ink);symbol('V',mid,y,.8);
 }
 return {l,r,top,lower,upper};
}
function inBox(x,y,s,fn){ctx.save();ctx.translate(x,y);ctx.scale(s,s);fn();ctx.restore();}
function heading(s){text(s,530,43,29,muted);}
function pumpScene(k,mode,reverse=false){ctx.drawImage(pump,24,0,1012,620);const moving=mode==='pump'?k>0:true;const fast=mode==='pressure'?k>=1:mode==='flow'?k>=2:false;const speed=fast?2.1:.8;
 if(moving){ctx.save();ctx.beginPath();ctx.arc(159,303,43,0,Math.PI*2);ctx.clip();ctx.translate(159,303);ctx.rotate(time*speed*1.2*(reverse?-1:1));ctx.drawImage(pump,24-159,-303,1012,620);ctx.restore();const pts=[[159,250],[159,151],[180,123],[217,113],[850,113],[901,149],[901,443],[860,480],[212,480],[159,446],[159,361]];pathDots(reverse?pts.reverse():pts,speed,20,'#fcffff');}
 if(mode==='flow'){line([[522,91],[522,137]],red,4);text('ここを通る量',525,194,28,red);text(k>=2?'同じ時間に、たくさん通る':'同じ時間に通る量を比べる',540,320,30);}
 if(mode==='pressure'){text(k>=1?'ポンプのはたらき：大':'ポンプのはたらき：小',540,263,32,blue);text('管は同じ',540,330,29,muted);}
}
function connectedLeads(negativeX){
 // Reuse the instrument image; draw plugs seated in its sockets and flexible leads.
 function lead(x,color,left){
  ctx.save();ctx.lineCap='round';
  const drawCable=(width,stroke)=>{ctx.beginPath();ctx.moveTo(x,448);ctx.bezierCurveTo(x,510,left?170:875,510,left?35:1025,510);ctx.lineWidth=width;ctx.strokeStyle=stroke;ctx.stroke();};
  drawCable(18,'#00000026');drawCable(12,color);drawCable(3,left?'#f76b69':'#73777b');
  circle(x,416,16,'#202225','#92918c');
  const shine=ctx.createLinearGradient(x-16,0,x+16,0);shine.addColorStop(0,left?'#7a1117':'#141619');shine.addColorStop(.35,left?'#ed494b':'#5a5e63');shine.addColorStop(.7,color);shine.addColorStop(1,left?'#760c12':'#111315');
  ctx.fillStyle=shine;ctx.beginPath();ctx.roundRect(x-15,408,30,48,10);ctx.fill();
  ctx.strokeStyle=left?'#8f1118':'#17191c';ctx.lineWidth=2;for(let y=434;y<=446;y+=5){ctx.beginPath();ctx.moveTo(x-12,y);ctx.lineTo(x+12,y);ctx.stroke();}
  ctx.restore();
 }
 lead(323,'#bb1e28',true);lead(negativeX,'#272a2e',false);
}
function meter(kind,k,range=false,reading=false,override=null,terminal=null){
 const selected=kind==='A'?(terminal??(range?(k<2?1:k>=3?3:2):reading&&k?Math.min(k,3):null)):null;
 const activeRow=({1:0,2:2,3:1})[selected];
 // The raster image supplies the physical instrument; the separately drawn scale is exact.
 pic('meter',245,68,570,510);
 const cx=530,cy=319,r=190;const n=kind==='A'?50:30;
 ctx.fillStyle='#fafbf9';ctx.beginPath();ctx.ellipse(cx,cy-37,217,141,0,Math.PI,Math.PI*2);ctx.lineTo(cx+217,cy+3);ctx.lineTo(cx-217,cy+3);ctx.closePath();ctx.fill();
 for(let i=0;i<=n;i++){
  const a=Math.PI+(i/n)*Math.PI,major=i%(kind==='A'?10:5)===0,half=kind==='A'&&i%5===0;
  line([[cx+Math.cos(a)*(r-(major?20:half?14:8)),cy+Math.sin(a)*(r-(major?20:half?14:8))],[cx+Math.cos(a)*r,cy+Math.sin(a)*r]],ink,major?3:half?2:1.5);
  if(major){
   if(kind==='A'){
    [[i/10,r-39,22],[i,r-72,21],[i*10,r-105,20]].forEach(([v,rad,size],row)=>text(String(v),cx+Math.cos(a)*rad,cy+Math.sin(a)*rad,size,row===activeRow?red:ink));
   }else{
    text(String(i/10),cx+Math.cos(a)*(r-39),cy+Math.sin(a)*(r-39),22);
    text(String(i/2),cx+Math.cos(a)*(r-70),cy+Math.sin(a)*(r-70),18,muted);
   }
  }
 }
 const frac=override??(reading?.4:range?(k<2?.004:k>=3?.4:kind==='A'?.04:.08):.2),angle=Math.PI+frac*Math.PI;line([[cx,cy],[cx+Math.cos(angle)*(r-6),cy+Math.sin(angle)*(r-6)]],red,4);circle(cx,cy,8,ink);text(kind,cx,cy-28,30);text(kind==='V'?'上の目盛：0〜3 ／ 内側：0〜15':'外側から 0〜5 ／ 0〜50 ／ 0〜500',530,34,25,muted);
 const vals=kind==='A'?['＋','5 A','500 mA','50 mA']:['＋','300 V','15 V','3 V'];const xx=[323,456,589,723];
 vals.forEach((v,i)=>text(v,xx[i],593,24,i===0||i===selected?red:ink));
 if(kind==='A'&&reading&&selected)connectedLeads(xx[selected]);
 if(range){const idx=k<2?1:k>=3?3:2;connectedLeads(xx[idx]);}
 if(reading&&k){const numbers=kind==='A'?['2.00 A','200 mA','20.0 mA']:['1.20 V','6.00 V','120 V'];text(numbers[Math.min(k-1,2)],902,279,30,red);}
}
function symbols(k){const things=[['battery','電池'],['lamp','豆電球'],['switch','スイッチ'],['A','電流計'],['V','電圧計']];things.forEach(([t,n],i)=>{const x=190+(i%3)*335,y=i<3?173:402;line([[x-70,y],[x+70,y]],ink,4);symbol(t,x,y,1.15,t==='switch');text(n,x,y+91,30);});}
function realAmmeter(power=false){
 line([[145,250],[145,430],[380,430]],'#fff',10);
 inBox(40,260,.36,()=>meter('A',0,false,false,power?.06:0,1));
 line([[145,250],[75,250],[75,410],[156,410]],red,4);
 line([[204,410],[204,490],[385,490],[385,430]],ink,4);
}
function quantityCompare(k){
 const xs=170,xe=890,gate=530;
 for(let row=0;row<2;row++){
  const y=210+row*240;line([[xs,y],[xe,y]],ink,6);
  const count=row===0?5:10,spacing=(xe-xs)/count;
  for(let j=0;j<count;j++){const x=xs+(j*spacing+time*85)%(xe-xs);lightOrb(x,y);}
  line([[gate,y-53],[gate,y+53]],red,4);
  text(row===0?'通る量が少ない':'通る量が多い',530,y-98,31,muted);
 }
}
const pointColors=['#217fa1','#a35d00','#c41645'];
function currentPoint(name,value,x,y,tx,ty,color){
 circle(x,y,19,'#fff');circle(x,y,13,color);circle(x,y,19,null,color);
 text(`${name}：${value}`,tx,ty,30,color);
}
function currentProblem(parallel,values){
 circuit({parallel});
 const positions=parallel?[[145,195,145,45],[775,270,775,210],[775,430,775,525]]:[[230,430,230,530],[530,430,530,530],[810,430,810,530]];
 values.forEach((v,i)=>currentPoint(['A','B','C'][i],v,...positions[i],pointColors[i]));
}
function waterCircuit(parallel,k){
 const key=parallel?'parallel':'series',img=waterImages[key];
 const routes=[0,1].map(branch=>{
  const p=[[300,190]],to=(x,y)=>p.push([x,y]);
  const bend=(cx,cy,x,y)=>{const [ax,ay]=p.at(-1);for(let j=1;j<=20;j++){const t=j/20,u=1-t;to(u*u*ax+2*u*t*cx+t*t*x,u*u*ay+2*u*t*cy+t*t*y)}};
  to(1240,190);bend(1340,190,1340,285);
  if(parallel){to(1340,300);const bx=branch?1400:1260;bend(1340,322,bx,365);to(bx,650);bend(bx,692,1340,730)}else to(1340,700);
  bend(1340,790,1240,790);to(300,790);bend(205,790,205,700);to(205,285);bend(205,190,300,190);
  const seg=p.slice(1).map((b,i)=>({a:p[i],b,l:Math.hypot(b[0]-p[i][0],b[1]-p[i][1])})),len=seg.reduce((a,s)=>a+s.l,0);
  return {len,at(d){d=((d%len)+len)%len;for(const s of seg){if(d<=s.l)return [s.a[0]+(s.b[0]-s.a[0])*d/s.l,s.a[1]+(s.b[1]-s.a[1])*d/s.l];d-=s.l}return p[0]}};
 });
 // Each marker keeps its chosen branch for the entire closed loop. Equal symmetric branches here.
 const dots=Array.from({length:28},(_,i)=>routes[parallel?i%2:0].at(-time*170+i*routes[0].len/28));
 function panel(sx,sy,sw,sh,x,y,w,h){
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);
  for(const [px,py] of dots){if(px<sx||px>sx+sw||py<sy||py>sy+sh)continue;const dx=x+(px-sx)*w/sw,dy=y+(py-sy)*h/sh;ctx.save();ctx.translate(dx,dy);ctx.scale(parallel?.65:.8,parallel?.65:.8);lightOrb(0,0);ctx.restore()}
  ctx.restore();
 }
 text(parallel?'二つの枝に分かれて、また合流':'枝分かれせず、順番に通る',530,37,32);
 if(parallel)panel(70,120,1400,750,15,140,675,390);else panel(70,120,1400,750,25,80,1010,510);
 if(parallel){
  line([[720,120],[720,555]],'#e3dfd8',2);
  panel(1185,275,290,475,775,180,220,350);
  text('枝分かれ部分を拡大',875,105,25,muted);
  text('合流する',875,151,25,k>=2?red:muted);
  text('二つに分かれる',875,560,25,k>=1?red:muted);
  text('全体の水の流れ',340,105,25,muted);
  if(k>=1)circle(627,457,18,null,red);
  if(k>=2)circle(627,234,18,null,red);
 }else{
  text('水は途中でなくならない',530,285,30,blue);
  if(k>=1)text('同じ時間に通る量は、どこでも同じ',530,344,28,red);
 }
}
function voltageMeter(terminal=null,fraction=.0,compact=false){
 pic('meter',245,68,570,510);
 const cx=530,cy=319,r=190;
 ctx.fillStyle='#fafbf9';ctx.beginPath();ctx.ellipse(cx,cy-37,217,141,0,Math.PI,Math.PI*2);ctx.lineTo(cx+217,cy+3);ctx.lineTo(cx-217,cy+3);ctx.closePath();ctx.fill();
 const active={1:2,2:1,3:0}[terminal];
 for(let i=0;i<=30;i++){
  const a=Math.PI+i/30*Math.PI,major=i%5===0;
  line([[cx+Math.cos(a)*(r-(major?18:8)),cy+Math.sin(a)*(r-(major?18:8))],[cx+Math.cos(a)*r,cy+Math.sin(a)*r]],ink,major?2.5:1.4);
  if(major)[[i/10,151],[i/2,116],[i*10,80]].forEach(([v,rad],row)=>text(String(v),cx+Math.cos(a)*rad,cy+Math.sin(a)*rad,22,row===active?red:ink));
 }
 const angle=Math.PI+fraction*Math.PI;
 line([[cx,cy],[cx+Math.cos(angle)*(r-6),cy+Math.sin(angle)*(r-6)]],red,4);circle(cx,cy,8,ink);text('V',cx,cy-28,30);
 if(!compact)text('外側から 0〜3 ／ 0〜15 ／ 0〜300',530,34,25,muted);
 ['＋','300 V','15 V','3 V'].forEach((s,i)=>text(s,[323,456,589,723][i],593,30,i===0||i===terminal?red:ink));
 if(terminal)connectedLeads([0,456,589,723][terminal]);
}
function voltageSpan(a,b,y,label,colour,tx=(a[0]+b[0])/2,ty=y+30,size=36){
 line([a,[a[0],y],[b[0],y],b],colour,3);
 for(const [x,yy] of [a,b]){circle(x,yy,12,'#fff',colour);circle(x,yy,7,colour)}
 text(label,tx,ty,size,colour);
}
function voltageDiagram(parallel,values){
 circuit({parallel,lower:parallel?480:390,upper:250});
 const size=v=>v==='測定前'?34:52;
 voltageSpan([400,120],[660,120],62,values[0],pointColors[0],530,30,size(values[0]));
 if(parallel){
  voltageSpan([405,250],[655,250],324,values[1],pointColors[1],530,360,size(values[1]));
  voltageSpan([405,480],[655,480],550,values[2],pointColors[2],530,585,size(values[2]));
 }else{
  voltageSpan([250,390],[480,390],483,values[1],pointColors[1],365,535,size(values[1]));
  voltageSpan([570,390],[800,390],483,values[2],pointColors[2],685,535,size(values[2]));
 }
}
function voltageAttach(k){
 circuit({two:false,lower:250});
 heading('豆電球の両端へ、並列につなぐ');
 if(k>=1){circle(430,250,13,'#fff',red);circle(630,250,13,'#fff',red)}
 if(k===2){line([[430,250],[300,250],[300,450],[498,450]],red,4);line([[562,450],[815,450],[815,250],[630,250]],ink,4);symbol('V',530,450)}
 if(k>=3){
  inBox(295,265,.46,()=>voltageMeter(3,.5,true));
  // Leads join the same two lamp terminals; the original circuit stays closed.
  line([[430,250],[275,250],[275,499.6],[311.1,499.6]],red,4);
  line([[766.5,499.6],[840,499.6],[840,250],[630,250]],ink,4);
 }
}
function waterPressure(parallel,k){
 const key=parallel?'parallel':'series';
 const map=([x,y])=>[25+(x-70)/1400*1010,120+(y-120)/750*430];
 ctx.drawImage(waterImages[key],70,120,1400,750,25,120,1010,430);
 const routes=[0,1].map(branch=>{
  const p=[[300,190]],to=(x,y)=>p.push([x,y]);
  const bend=(cx,cy,x,y)=>{const [ax,ay]=p.at(-1);for(let j=1;j<=16;j++){const t=j/16,u=1-t;to(u*u*ax+2*u*t*cx+t*t*x,u*u*ay+2*u*t*cy+t*t*y)}};
  to(1240,190);bend(1340,190,1340,285);
  if(parallel){to(1340,300);const bx=branch?1400:1260;bend(1340,322,bx,365);to(bx,650);bend(bx,692,1340,730)}else to(1340,700);
  bend(1340,790,1240,790);to(300,790);bend(205,790,205,700);to(205,285);bend(205,190,300,190);
  const seg=p.slice(1).map((b,i)=>({a:p[i],b,l:Math.hypot(b[0]-p[i][0],b[1]-p[i][1])})),len=seg.reduce((v,q)=>v+q.l,0);
  return {len,at(d){d=((d%len)+len)%len;for(const q of seg){if(d<=q.l)return[q.a[0]+(q.b[0]-q.a[0])*d/q.l,q.a[1]+(q.b[1]-q.a[1])*d/q.l];d-=q.l}return p[0]}};
 });
 for(let i=0;i<28;i++){const route=routes[parallel?i%2:0],[x,y]=map(route.at(-time*150+i*routes[0].len/28));ctx.save();ctx.translate(x,y);ctx.scale(.55,.55);lightOrb(0,0);ctx.restore()}
 function gauge(x,y,value,label,colour,point){
  if(point[1]>y+44)line([point,[x+150,y+65],[x+150,y],[x+44,y]],colour,2);else line([point,[x,y-49]],colour,2);
  circle(...point,8,'#fff',colour);
  circle(x,y,44,'#f9faf8','#8b9295');
  for(let j=0;j<=3;j++){const a=Math.PI+j*Math.PI/3;line([[x+Math.cos(a)*30,y+Math.sin(a)*30],[x+Math.cos(a)*36,y+Math.sin(a)*36]],muted,2)}
  if(value!==null){const a=Math.PI+value*Math.PI/3;line([[x,y],[x+Math.cos(a)*31,y+Math.sin(a)*31]],colour,4)}
  circle(x,y,5,ink);text(value===null?'？':String(value),x,y+25,25,colour);
  text(label,x,y+75,24,colour);
 }
 if(!parallel){
  gauge(320,280,k>=1?0:null,'ポンプへ戻る',blue,map([590,190]));
  gauge(650,280,k>=2?2:null,'一つ目の後', '#a35d00',map([1340,350]));
  gauge(490,380,k>=1?3:null,'ポンプから出る',red,map([720,790]));
  if(k>=3)text('下がる分：3−2＝1　　2−0＝2',530,578,29,red);
 }else{
  const split=map([1340,730]),merge=map([1340,300]);
  gauge(650,390,k>=1?3:null,'分岐点',red,split);
  gauge(650,230,k>=2?0:null,'合流点',blue,merge);
  text('二つの枝に共通',420,325,26,muted);
  if(k>=3)text('どちらの枝も：3−0＝3',530,588,31,red);
 }
 text(parallel?'両端が同じだから、差も同じ':'水圧の変化を、流れに沿って見る',530,39,30);
}
function newLevelScene(mode,k){
 const x=110,y=90,w=900,h=900*levelSeries.height/levelSeries.width;
 ctx.drawImage(levelSeries,x,y,w,h);
 const map=([px,py])=>[x+px/levelSeries.width*w,y+py/levelSeries.height*h];
 const high=map([380,205])[1],middle=map([850,327])[1],low=map([1400,575])[1];
 const path=[[280,205],[640,205],[695,230],[735,327],[1050,327],[1110,350],[1195,575],[1450,575],[1500,660],[1510,765],[400,765],[240,750],[145,740],[110,680],[110,160],[140,110],[215,110],[260,205],[280,205]].map(map);
 const segments=path.slice(1).map((b,i)=>({a:path[i],b,length:Math.hypot(b[0]-path[i][0],b[1]-path[i][1])}));
 const total=segments.reduce((sum,v)=>sum+v.length,0);
 for(let j=0;j<18;j++){
  let d=(time*63+j*total/18)%total;
  for(const s of segments){if(d<=s.length){const f=d/s.length;circle(s.a[0]+(s.b[0]-s.a[0])*f,s.a[1]+(s.b[1]-s.a[1])*f,3.5,'#eaffff');break}d-=s.length}
 }
 function tick(px,py,colour){line([[px-10,py],[px+10,py]],colour,3)}
 function bracket(px,top,bottom,colour){line([[px-10,top],[px,top],[px,bottom],[px-10,bottom]],colour,4)}
 const difference=mode==='vlevel_difference',series=mode==='vlevel_series';
 if(mode==='vlevel_pump'){
  if(k>=1){text('高い水面',355,high-40,32,blue);text('低い水面',860,low-43,32,blue)}
  if(k>=2){line([[76,low],[76,high]],blue,6);arrow(76,high,-Math.PI/2,blue,14);text('高い場所へ戻す',530,565,40,blue)}
 }else if(difference){
  if(k>=1){text('水位3',355,high-40,32,blue);text('水位0',860,low-43,32,blue);tick(76,high,blue);tick(76,low,blue)}
  if(k>=2){bracket(76,high,low,blue);text('高さの差 3',530,565,44,blue)}
 }else if(series){
  if(k>=1){bracket(522,high,middle,'#a35d00');text('段差1',325,565,48,'#a35d00')}
  if(k>=2){bracket(785,middle,low,red);text('段差2',760,565,48,red)}
  if(k>=3)bracket(76,high,low,blue);
 }
}

function flowHeight(k,compact=false){
 newLevelScene('vflow_height',0);
 const green='#16816b';
 if(k>=1){circle(379,200,16,'#ffffffbb',green);circle(379,200,5,green)}
 if(k>=2){circle(605,266,16,'#ffffffbb',green);circle(605,266,5,green)}
 if(k>=2&&!compact)text('1秒間に通る量は同じ',530,35,42,green);
 if(k>=3){
  line([[512,200],[522,200],[522,266],[512,266]],'#a35d00',4);
  line([[775,266],[785,266],[785,400],[775,400]],red,4);
  text('段差1',325,565,compact?48:34,'#a35d00');
  text('段差2',760,565,compact?48:34,red);
 }
}
function flowCircuit(k){
 inBox(0,95,.5,()=>flowHeight(k>=2?3:k>=1?2:0,true));
 inBox(530,95,.5,()=>{if(k>=2)voltageDiagram(false,['3.0 V','1.0 V','2.0 V']);else circuit({lower:390})});
 text('水の模型',265,55,36,blue);text('実際の回路',795,55,36,blue);
 if(k>=1){
  for(const x of [602.5,987.5]){circle(x,250,11,'#fff','#16816b');circle(x,250,5,'#16816b')}
  text('同じ量が通る',265,455,34,'#16816b');
  text('0.30 A',670,455,36,'#16816b');text('0.30 A',930,455,36,'#16816b');
 }
}
function drawVoltage(mode,k){
 if(mode==='vflow_height'){flowHeight(k);return true}
 if(mode==='vflow_circuit'){flowCircuit(k);return true}
 if(['vlevel_pump','vlevel_difference','vlevel_series'].includes(mode)){newLevelScene(mode,k);return true}
 if(mode==='vcharge_loop'){
  circuit({lower:430});
  text('光の玉を追って、回路を一周',530,39,30,muted);
  const segments=[[[415,120],[145,120]],[[145,120],[145,430]],[[145,430],[915,430]],[[915,430],[915,120]],[[915,120],[645,120]],[[645,120],[415,120]]];
  const total=segments.reduce((sum,[a,b])=>sum+Math.hypot(b[0]-a[0],b[1]-a[1]),0);
  let distance=(time*175)%total,x=415,y=120;
  for(const [a,b] of segments){const length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(distance<=length){const ratio=distance/length;x=a[0]+(b[0]-a[0])*ratio;y=a[1]+(b[1]-a[1])*ratio;break}distance-=length}
  ctx.save();ctx.translate(x,y);ctx.scale(1.35,1.35);lightOrb(0,0);ctx.restore();
  function place(px,py,label,tx,ty,color,from){circle(px,py,16,'#fff',color);circle(px,py,10,color);line([from,[px,py]],color,2);text(label,tx,ty,28,color)}
  if(k>=1)place(145,260,'電池のあと：5 V',302,220,blue,[210,240]);
  if(k>=2)place(530,430,'左のあと：3 V',530,295,'#a35d00',[530,325]);
  if(k>=3)place(915,260,'右のあと：0 V',758,220,red,[850,240]);
  if(k>=2)text('左の前後で2 V下がる',365,548,24,'#a35d00');
  if(k>=3)text('右の前後で3 V下がる',685,548,24,red);
  if(k>=4)text('0 Vでも惰性ではない。回路全体で電流が続く',530,591,24,muted);
  return true;
 }
 if(mode==='vstairs_parallel_why'){
  text('同じ上の水そうから、同じ下の水そうへ',530,43,30);
  ctx.drawImage(levelViews,780,530,745,340,75,90,910,405);
  if(k>=1)text('左の道：3 − 0 ＝ 3',275,548,30,'#a35d00');
  if(k>=2)text('右の道：3 − 0 ＝ 3',785,548,30,red);
  if(k>=3)text('二本あっても、1.5ずつにはならない',530,600,27,red);
  return true;
 }
 if(mode==='vstairs_series'||mode==='vstairs_parallel'){
  const parallel=mode==='vstairs_parallel';
  text('上から見た水路',265,85,32,blue);
  text(k?'横から見ると…':'横から見ると？',795,85,32,k?red:muted);
  line([[530,130],[530,430]],'#ddd9d2',2);
  const crop=parallel?[28,620,710,295]:[28,190,720,300];
  ctx.drawImage(levelViews,...crop,20,155,490,220);
  if(k>=1){const side=parallel?[780,530,745,340]:[780,105,745,330];ctx.drawImage(levelViews,...side,550,145,495,235)}
  else text('クリックして確かめる',795,265,27,muted);
  text(parallel?'Aから分かれて、どちらもCへ':'A → B → C の順に通る',265,432,25,blue);
  if(k>=1)text(parallel?'同じ水面から、同じ水面まで':'1段下りて、さらに2段下りる',795,432,25,red);
  if(k>=2)text(parallel?'どちらの道も 3 − 0 ＝ 3':'全部で下がる高さは 1 ＋ 2 ＝ 3',530,530,35,red);
  return true;
 }
 if(mode==='vwater_series'||mode==='vwater_parallel'){waterPressure(mode==='vwater_parallel',k);return true}
 if(mode==='vpump'){pumpScene(1,'pump',true);text('水を押し流す',530,280,38,blue);return true}
 if(mode==='vbridge'){inBox(225,5,.58,()=>pumpScene(1,'pump',true));inBox(220,300,.58,()=>circuit({two:false,flow:true,glow:true}));return true}
 if(mode==='vends'){circuit({two:false,lower:390});voltageSpan([400,120],[660,120],52,'電池の両端',blue,530,23);if(k>=2)voltageSpan([405,390],[655,390],493,'豆電球の両端',red,530,535);return true}
 if(mode==='vintro'){voltageMeter();return true}
 if(mode==='vattach'||mode==='vpolarity'){voltageAttach(mode==='vpolarity'?3:k);return true}
 if(mode==='vrange'){const terminal=k<2?1:k<3?2:3;voltageMeter(terminal,2.4/[0,300,15,3][terminal]);return true}
 const readings={vscale:[3,.8],vquiz3:[3,.6],vquiz15:[2,.4],vquiz300:[1,.4]};
 if(readings[mode]){voltageMeter(...readings[mode]);return true}
 const cases={
  vsmeasure:[false,[k>=1?'3.0 V':'測定前',k>=2?'1.0 V':'測定前',k>=3?'2.0 V':'測定前']],
  vssum:[false,['3.0 V','1.0 V','2.0 V']],
  vsquiz1:[false,['4.5 V','1.5 V',k>=2?'3.0 V':'？ V']],
  vsquiz2:[false,[k>=2?'6.0 V':'？ V','2.0 V','4.0 V']],
  vpmeasure:[true,[k>=1?'3.0 V':'測定前',k>=2?'3.0 V':'測定前',k>=3?'3.0 V':'測定前']],
  vpsame:[true,['3.0 V','3.0 V','3.0 V']],
  vpquiz1:[true,['6.0 V',k>=1?'6.0 V':'？ V',k>=2?'6.0 V':'？ V']],
  vpquiz2:[true,[k>=1?'4.5 V':'？ V',k>=2?'4.5 V':'？ V','4.5 V']]
 };
 if(cases[mode]){voltageDiagram(...cases[mode]);return true}
 if(mode==='vcompare'){inBox(0,110,.5,()=>voltageDiagram(false,['3.0 V','1.0 V','2.0 V']));inBox(530,110,.5,()=>voltageDiagram(true,['3.0 V','3.0 V','3.0 V']));text('直列',265,520,38);text('並列',795,520,38);return true}
 return false;
}

function render(canvas,k){ctx=canvas.getContext('2d');labels=[];ctx.clearRect(0,0,canvas.width,canvas.height);const mode=canvas.dataset.mode;
 if(mode==='cover'){inBox(60,190,.93,()=>{circuit({two:false,on:true});});return;}
 ctx.fillStyle='#fff';ctx.fillRect(0,0,1060,620);
 if(drawVoltage(mode,k)){}
 else if(mode==='water_series_current'||mode==='water_parallel_current'){waterCircuit(mode==='water_parallel_current',k);}
 else if(mode==='current_gate'){circuit({two:false,flow:true,glow:true});circle(230,430,30,null,red);text('ここを通る量',250,540,35,red);heading('同じ場所を、同じ1秒間で比べる');}
 else if(mode==='amount_compare'){quantityCompare(k);}
 else if(mode==='insert_meter'){circuit({two:false,on:k===0||k>=3});if(k===1){line([[170,430],[300,430]],'#fff',12);circle(235,430,78,null,red);}if(k>=2)realAmmeter(k>=3);}
 else if(mode==='polarity_meter'){circuit({two:false,on:false});realAmmeter();heading('電源の＋極側を、電流計の＋端子へ');}
 else if(mode==='scale_read'){meter('A',k>=2?1:0,false,true,null,1);circle(456,416,37,null,red);}
 else if(mode==='estimate_read'){text('5 A端子の目盛りを拡大',530,115,35,muted);line([[170,325],[890,325]],ink,4);for(let j=0;j<4;j++){const x=170+j*240;line([[x,295],[x,355]],ink,4);text((2.2+j*.1).toFixed(1),x,405,37);}line([[554,170],[554,303]],red,6);arrow(554,309,Math.PI/2,red,13);text('2.3と2.4の間を、目分量で読む',530,515,31,muted);}
 else if(mode==='read_check'){meter('A',0,false,false,.6,2);connectedLeads(589);}
 else if(mode.startsWith('quiz_')){const q={quiz_5a:[.68,456],quiz_500:[.36,589],quiz_50:[.64,723]}[mode];meter('A',0,false,false,q[0],{456:1,589:2,723:3}[q[1]]);connectedLeads(q[1]);}
 else if(mode==='unit_check'){text(k>=1?'450 mA = 0.45 A':'450 mA = ？ A',530,235,55,k>=1?red:ink);text(k>=2?'0.08 A = 80 mA':'0.08 A = ？ mA',530,400,55,k>=2?red:ink);}
 else if(mode==='series_first'){circuit({points:true,measurement:k?'A':null});heading(k?'Aで測ると 0.30 A':'Aに電流計を入れてみる');}
 else if(mode==='series_predict'){circuit({points:true,measurement:k>=3?'C':k>=2?'B':'A'});heading(k>=3?'Cでも 0.30 A':k>=2?'Bでも 0.30 A':'Aでは 0.30 A。Bでは？');}
 else if(mode==='series_check'){currentProblem(false,['0.45 A',k?'0.45 A':'？ A',k?'0.45 A':'？ A']);}
 else if(mode==='practice_series_middle'){currentProblem(false,[k>=1?'0.24 A':'？ A','0.24 A',k>=2?'0.24 A':'？ A']);}
 else if(mode==='practice_series_units'){currentProblem(false,[k>=1?'0.18 A':'？ A',k>=2?'0.18 A':'？ A','180 mA']);}
 else if(mode==='practice_parallel_total'){currentProblem(true,[k>=1?'0.40 A':'？ A','0.15 A','0.25 A']);}
 else if(mode==='practice_parallel_upper'){currentProblem(true,['0.90 A',k>=1?'0.55 A':'？ A','0.35 A']);}
 else if(['pump','flow','pressure'].includes(mode)){pumpScene(k,mode);}
 else if(mode==='bridge'){inBox(225,5,.58,()=>{pumpScene(1,'pump',true)});inBox(220,300,.58,()=>circuit({two:false,on:true,style:'real',flow:true,glow:true}));}
 else if(mode==='light'||mode==='break'){const on=mode==='light'?k>=1:k===0;circuit({two:false,on,switchOpen:!on});heading(on?'スイッチを閉じた回路':'スイッチを開いた回路');}
 else if(mode==='direction'){circuit({two:false,on:true,flow:k>=1,glow:true});heading('＋極から出て、−極へ戻る');}
 else if(mode==='current'){circuit({two:false,measurement:k===3?'A':null});if(k<3)circle(230,430,12,blue);if(k>=4){line([[145,250],[145,430],[380,430]],'#fff',10);inBox(40,260,.36,()=>meter('A',0,false,false,power?.06:0,1));line([[145,250],[75,250],[75,410],[156,410]],red,4);line([[204,410],[204,490],[380,490],[380,430]],ink,4);}text('この場所を通る量',250,550,31,blue);}
 else if(mode==='voltage'){circuit({two:false,voltage:k===3?'source':null});if(k>=4){inBox(500,180,.4,()=>meter('V',0));line([[400,120],[400,185],[575,185],[575,346],[629,346]],red,4);line([[660,120],[1020,120],[1020,470],[682,470],[682,346]],ink,4);circle(400,120,6,red);circle(660,120,6,ink);}if(k<3){circle(400,120,8,red);circle(660,120,8,ink);}text('電池の両端',k>=4?410:530,235,34,red);}
 else if(mode==='symbols'){symbols(k);}
 else if(mode==='diagram'){inBox(233,0,.56,()=>circuit({two:false}));inBox(233,310,.56,()=>circuit({two:false,style:'symbol'}));}
 else if(mode==='series'||mode==='parallel'){circuit({parallel:mode==='parallel',flow:k>0,glow:true});heading(mode==='parallel'?'2つの道に枝分かれ':'枝分かれのない、一本道');}
 else if(['compare_paths','summary','meters'].includes(mode)){const y=140;inBox(0,y,.5,()=>circuit({style:'symbol',measurement:mode==='meters'?'A':null,two:mode!=='meters'}));inBox(530,y,.5,()=>circuit({parallel:mode!=='meters',style:'symbol',two:mode!=='meters',voltage:mode==='meters'?'one':null}));text(mode==='meters'?'電流を測る':'枝分かれなし',265,495,31);text(mode==='meters'?'電圧を測る':'枝分かれあり',795,495,31);}
 else if(['ammeter','a_range','a_read','voltmeter','v_range','v_read'].includes(mode)){meter(mode.startsWith('v')?'V':'A',k,mode.endsWith('range'),mode.endsWith('read'));}
 else if(mode==='a_connect'){circuit({two:false,style:'symbol',measurement:k>=1?'A':null,flow:k>=2,glow:true});text('電源＋極側',340,300,27,red);if(k>=1){text('＋',183,480,27,red);text('−',277,480,27);}}
 else if(mode==='v_connect'){circuit({two:true,style:'symbol',voltage:k>=1?'one':null});if(k>=3){text('＋',315,575,27,red);text('−',415,575,27);}}
 else if(mode==='units'){text('1 A',280,235,81,red);text('1000 mA',780,235,69,red);line([[450,235],[543,235]],muted,3);arrow(552,235,0,muted);if(k>=2)text('200 mA = 0.20 A',530,376,43);if(k>=3)text('0.35 A = 350 mA',530,465,43);}
 else if(mode==='series_i'){circuit({points:true,measurement:k?['A','B','C','C'][Math.min(k-1,3)]:null});heading(k>0?'電流計を移して、同じ回路を測る':'A・B・Cで電流を比べる');}
 else if(mode==='not_used'){circuit({points:true});text('0.30 A',230,520,34,blue);text('0.30 A',810,520,34,blue);}
 else if(mode==='i_question'){currentProblem(true,['0.80 A','0.30 A',k>=2?'0.50 A':'？ A']);}
 else if(['parallel_i','merge'].includes(mode)){let measurement=mode==='parallel_i'&&k?['A','B','C','C'][Math.min(k-1,3)]:mode==='merge'&&k>=2?'D':null;circuit({parallel:true,points:true,measurement});}
 else if(mode==='series_v'||mode==='parallel_v'){circuit({parallel:mode==='parallel_v',lower:mode==='parallel_v'?500:430,voltage:k?['source','one','two','two'][Math.min(k-1,3)]:null});if(mode==='series_v'){text('①',365,294,30);text('②',685,294,30);}else{ text('上の枝',780,210,26);text('下の枝',780,565,26);}}
 else if(mode==='v_question'){circuit({style:'symbol'});text('6.0 V',530,216,36,red);text('① 2.0 V',365,515,34);text(k>=2?'② 4.0 V':'② ？ V',685,515,34,red);}
 else if(mode==='series_off'){circuit({on:k===0,switchOpen:k>=1});heading(k===0?'スイッチは閉じている':'スイッチを開いた');}
 else if(mode==='parallel_off'){circuit({parallel:true,upperOff:k>=1,switchOpen:k>=1});heading(k===0?'上下とも、道がつながっている':'上の枝だけを切った');}
 else if(mode==='brightness'){inBox(0,140,.33,()=>circuit({two:false}));inBox(354,140,.33,()=>{circuit({two:true,on:false});lamp(365,430,true,'real',true);lamp(685,430,true,'real',true);});inBox(708,140,.33,()=>circuit({parallel:true}));text('1個',177,390,31);text('直列',531,390,31);text('並列',885,390,31);if(k>=1)text('暗くなる',531,460,31,red);if(k>=2)text('ほぼ同じ',885,460,31,red);}
 // The text bounds record covers labels in the untransformed main diagrams.
 canvas.closest('.slide').dataset.diagramLabels=JSON.stringify(labels);
 canvas.closest('.slide').dataset.motion=JSON.stringify({mode,step:k,flow:mode==='pump'?k>0:['flow','pressure'].includes(mode),on:['light','break'].includes(mode)?(mode==='light'?k>=1:k===0):null,upperOn:mode==='parallel_off'?k===0:null});
}
let last=0;ready.then(()=>{window.CircuitAssetsReady=true;const animate=(now)=>{if(now-last>32){last=now;time=matchMedia('(prefers-reduced-motion: reduce)').matches?0:now/1000;const s=document.querySelector('.slide:not([hidden])'),c=s?.querySelector('canvas');if(c)render(c,Number(s.dataset.step||0));}requestAnimationFrame(animate)};requestAnimationFrame(animate)}).catch(e=>{console.error(e);window.CircuitAssetsError=String(e)});
})();
