(()=>{
'use strict';
const kit=new Image(),pump=new Image();kit.src='assets/apparatus.png';
const ready=Promise.all([kit.decode(),document.fonts.ready]);
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
function meter(kind,k,range=false,reading=false){
 // The raster image supplies the physical instrument; the separately drawn scale is exact.
 pic('meter',245,68,570,510);
 const cx=530,cy=319,r=190;const n=kind==='A'?50:30;
 ctx.fillStyle='#fafbf9';ctx.beginPath();ctx.ellipse(cx,cy-37,217,141,0,Math.PI,Math.PI*2);ctx.lineTo(cx+217,cy+3);ctx.lineTo(cx-217,cy+3);ctx.closePath();ctx.fill();
 for(let i=0;i<=n;i++){const a=Math.PI+(i/n)*Math.PI;const major=i%(kind==='A'?10:5)===0;line([[cx+Math.cos(a)*(r-(major?18:8)),cy+Math.sin(a)*(r-(major?18:8))],[cx+Math.cos(a)*r,cy+Math.sin(a)*r]],ink,major?3:1.5);if(major){const value=kind==='A'?i/10:i/10;text(String(value),cx+Math.cos(a)*(r-39),cy+Math.sin(a)*(r-39),22);if(kind==='V')text(String(i/2),cx+Math.cos(a)*(r-70),cy+Math.sin(a)*(r-70),18,muted);}}
 const frac=reading?.4:range?(k<2?.004:kind==='A'?.04:.08):.2,angle=Math.PI+frac*Math.PI;line([[cx,cy],[cx+Math.cos(angle)*(r-6),cy+Math.sin(angle)*(r-6)]],red,4);circle(cx,cy,8,ink);text(kind,cx,cy-50,34);text(kind==='V'?'上の目盛：0〜3 ／ 内側：0〜15':'0〜5 の目盛',530,34,27,muted);
 const vals=kind==='A'?['＋','5 A','500 mA','50 mA']:['＋','300 V','15 V','3 V'];const xx=[323,456,589,723];
 vals.forEach((v,i)=>text(v,xx[i],593,24,i===0?red:ink));
 if(range){const idx=k<2?1:2;circle(xx[idx],416,37,null,red);}
 if(reading&&k){const numbers=kind==='A'?['2.00 A','200 mA','20.0 mA']:['1.20 V','6.00 V','120 V'];text(numbers[Math.min(k-1,2)],902,279,30,red);}
}
function symbols(k){const things=[['battery','電池'],['lamp','豆電球'],['switch','スイッチ'],['A','電流計'],['V','電圧計']];things.forEach(([t,n],i)=>{const x=190+(i%3)*335,y=i<3?173:402;line([[x-70,y],[x+70,y]],ink,4);symbol(t,x,y,1.15,t==='switch');text(n,x,y+91,30);});}
const deck=JSON.parse(document.querySelector('#deck-data').textContent);
function cutMark(x,y,cut){
 if(cut){line([[x-22,y],[x+22,y]],'#fff',13);line([[x-20,y-17],[x-10,y+17]],red,3);line([[x+10,y-17],[x+20,y+17]],red,3);}
 else {ctx.save();ctx.setLineDash([7,7]);circle(x,y,25,null,red);ctx.restore();}
}
function topology(d,k,style){
 const m=d.mode,parallel=['parallel','nodes','variant-parallel','cut-branch','cut-common'].includes(m)||d.kind==='parallel';
 const series=['series','trace-series','variant-series','cut-series'].includes(m)||d.kind==='series';
 const variant=m.startsWith('variant');
 const cutting=m.startsWith('cut'),cut=cutting&&k>=2;
 const on=!(m==='switch'&&k<2)&&!(cut&&m!=='cut-branch');
 if(!variant){
  circuit({parallel,two:series||parallel,on,upperOff:cut&&m==='cut-branch',switchOpen:!series&&!parallel?(m==='switch'?k<2:false):null,style});
 }else{
  line([[415,120],[145,120],[145,470],[915,470],[915,120],[645,120]]);battery(530,120,style);if(style==='symbol'){line([[415,120],[518,120]]);line([[543,120],[645,120]]);}
  if(parallel){line([[145,280],[915,280]]);lamp(390,280,true,style);lamp(680,470,true,style);circle(145,280,7,ink);circle(915,280,7,ink);}
  else{
   line([[145,120],[145,470]],'#fff',10);
   line([[155,120],[145,120],[145,270],[465,270],[465,375],[145,375],[145,470],[155,470]]);
   lamp(315,270,true,style);lamp(690,470,true,style);
  }
 }
 if(m==='nodes'&&k>=2){circle(145,270,19,null,'#b48b27');circle(915,270,19,null,'#b48b27');}
 if(m==='trace-series'&&k>=2){line([[310,120],[145,120],[145,430],[240,430]],'#ba902d',9);}
 if(cutting){const point=m==='cut-branch'?[265,270]:[260,120];cutMark(...point,cut);}
}
function part(d,k,style){
 const t=d.part;
 if(t==='A'||t==='V'){
  if(style==='symbol'){line([[320,300],[487,300]]);line([[573,300],[740,300]]);symbol(t,530,300,1.35);}
  else{pic('meter',320,70,420,400);text(t,530,210,54,t==='A'?blue:red);line([[530,265],[440,190]],red,3);circle(530,265,6,ink);}
 }else if(t==='wire'){
  if(style==='real'){line([[245,300],[375,225],[645,225],[815,300]],'#54524e',17);line([[245,296],[375,221],[645,221],[815,296]],'#d5b079',5);}
  else line([[245,270],[815,270]],ink,5);
 }else if(style==='symbol'){
  line([[305,300],[440,300]]);line([[620,300],[755,300]]);
  ctx.save();ctx.translate(530,300);ctx.scale(1.65,1.65);line([[-55,0],[55,0]]);symbol(t,0,0,1,t==='switch'&&k<3);ctx.restore();
 }else{
  ctx.save();ctx.translate(530,290);ctx.scale(2,2);
  if(t==='battery')battery(0,0);if(t==='lamp')lamp(0,0,true);if(t==='switch')switchAt(0,0,k<3);ctx.restore();
 }
}
function drawExercise(d,k,style){
 if(style==='real'){topology(d,k,style);return;}
 if(k<2){text('まず、ノートに描いてみよう',530,290,35,muted);return;}
 if(k>=4){topology(d,k,style);return;}
 battery(530,120,'symbol');
 if(k>=3){
  if(d.kind==='parallel'){lamp(530,270,true,'symbol');lamp(530,430,true,'symbol');}
  else if(d.kind==='series'){lamp(365,430,true,'symbol');lamp(685,430,true,'symbol');}
  else {lamp(530,430,true,'symbol');switchAt(270,430,false,'symbol');}
 }
}
function render(canvas,k,d){
 ctx=canvas.getContext('2d');labels=[];ctx.clearRect(0,0,1060,620);ctx.fillStyle='#fff';ctx.fillRect(0,0,1060,620);
 const style=canvas.dataset.side==='symbol'?'symbol':'real';
 if(style==='symbol'&&k===0){text(d.mode==='draw'?'どんな回路図になる？':'記号で表すと？',530,300,37,muted);return;}
 if(d.mode==='part')part(d,k,style);else if(d.mode==='draw')drawExercise(d,k,style);else topology(d,k,style);
}
ready.then(()=>{
 window.CircuitAssetsReady=true;
 const paint=()=>{const s=document.querySelector('.slide:not([hidden])');if(!s)return;const d=deck[+s.dataset.index];for(const c of s.querySelectorAll('canvas'))render(c,+s.dataset.step||0,d);};
 new MutationObserver(paint).observe(document.querySelector('.stage'),{subtree:true,attributes:true,attributeFilter:['hidden','data-step']});paint();
}).catch(console.error);
})();

