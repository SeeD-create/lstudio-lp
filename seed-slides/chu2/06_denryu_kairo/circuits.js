(()=>{
'use strict';
const kit=new Image(),pump=new Image();kit.src='assets/apparatus.png';pump.src='assets/pump.png';
const ready=Promise.all([kit.decode(),pump.decode(),document.fonts.ready]);
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
function pathDots(points,speed=1,count=16,color=blue){let lengths=[],total=0;for(let i=1;i<points.length;i++){const l=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);lengths.push(l);total+=l;}for(let j=0;j<count;j++){let d=(j*total/count+time*speed*65)%total;let i=0;while(d>lengths[i]&&i<lengths.length-1){d-=lengths[i++];}const a=points[i],b=points[i+1],f=d/lengths[i];arrow(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f,Math.atan2(b[1]-a[1],b[0]-a[0]),color,9);}}
function circuit({parallel=false,two=true,on=true,upperOff=false,switchOpen=null,style='real',flow=false,points=false,lower=430,upper=270,measurement=null,voltage=null}={}){
 const l=145,r=915,top=120;
 line([[415,top],[l,top],[l,lower],[r,lower],[r,top],[645,top]]);
 if(parallel){line([[l,upper],[r,upper]]);circle(l,upper,7,ink);circle(r,upper,7,ink);}
 if(flow&&on){pathDots([[415,top],[l,top],[l,lower],[r,lower],[r,top],[645,top]],1,15);if(parallel&&!upperOff)pathDots([[l,upper],[r,upper]],.6,5);}
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
function pumpScene(k,mode){ctx.drawImage(pump,24,0,1012,620);const moving=mode==='pump'?k>0:true;const fast=mode==='pressure'?k>=1:mode==='flow'?k>=2:false;const speed=fast?2.1:.8;
 if(moving){ctx.save();ctx.beginPath();ctx.arc(159,303,43,0,Math.PI*2);ctx.clip();ctx.translate(159,303);ctx.rotate(time*speed*1.2);ctx.drawImage(pump,24-159,-303,1012,620);ctx.restore();const pts=[[159,250],[159,151],[180,123],[217,113],[850,113],[901,149],[901,443],[860,480],[212,480],[159,446],[159,361]];pathDots(pts,speed,20,'#fcffff');}
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
function render(canvas,k){ctx=canvas.getContext('2d');labels=[];ctx.clearRect(0,0,canvas.width,canvas.height);const mode=canvas.dataset.mode;
 if(mode==='cover'){inBox(60,190,.93,()=>{circuit({two:false,on:true});});return;}
 ctx.fillStyle='#fff';ctx.fillRect(0,0,1060,620);
 if(['pump','flow','pressure'].includes(mode)){pumpScene(k,mode);}
 else if(mode==='bridge'){inBox(225,5,.58,()=>{pumpScene(1,'pump')});inBox(220,300,.58,()=>circuit({two:false,on:true,style:'real'}));}
 else if(mode==='light'||mode==='break'){const on=mode==='light'?k>=1:k===0;circuit({two:false,on,switchOpen:!on});heading(on?'スイッチを閉じた回路':'スイッチを開いた回路');}
 else if(mode==='direction'){circuit({two:false,on:true,flow:k>=1});heading('＋極から出て、−極へ戻る');}
 else if(mode==='current'){circuit({two:false,measurement:k>=3?'A':null});if(k<3)circle(230,430,12,blue);text('この場所を通る量',250,520,31,blue);}
 else if(mode==='voltage'){circuit({two:false,voltage:k>=3?'source':null});if(k<3){circle(400,120,8,red);circle(660,120,8,ink);}text('電池の両端',530,235,34,red);}
 else if(mode==='symbols'){symbols(k);}
 else if(mode==='diagram'){inBox(233,0,.56,()=>circuit({two:false}));inBox(233,310,.56,()=>circuit({two:false,style:'symbol'}));}
 else if(mode==='series'||mode==='parallel'){circuit({parallel:mode==='parallel',flow:k>0});heading(mode==='parallel'?'2つの道に枝分かれ':'枝分かれのない、一本道');}
 else if(['compare_paths','summary','meters'].includes(mode)){const y=140;inBox(0,y,.5,()=>circuit({style:'symbol',measurement:mode==='meters'?'A':null,two:mode!=='meters'}));inBox(530,y,.5,()=>circuit({parallel:mode!=='meters',style:'symbol',two:mode!=='meters',voltage:mode==='meters'?'one':null}));text(mode==='meters'?'電流を測る':'枝分かれなし',265,495,31);text(mode==='meters'?'電圧を測る':'枝分かれあり',795,495,31);}
 else if(['ammeter','a_range','a_read','voltmeter','v_range','v_read'].includes(mode)){meter(mode.startsWith('v')?'V':'A',k,mode.endsWith('range'),mode.endsWith('read'));}
 else if(mode==='a_connect'){circuit({two:false,style:'symbol',measurement:k>=1?'A':null,flow:k>=2});text('電源＋極側',340,300,27,red);if(k>=1){text('＋',183,480,27,red);text('−',277,480,27);}}
 else if(mode==='v_connect'){circuit({two:true,style:'symbol',voltage:k>=1?'one':null});if(k>=3){text('＋',315,575,27,red);text('−',415,575,27);}}
 else if(mode==='units'){text('1 A',280,235,81,red);text('1000 mA',780,235,69,red);line([[450,235],[543,235]],muted,3);arrow(552,235,0,muted);if(k>=2)text('200 mA = 0.20 A',530,376,43);if(k>=3)text('0.35 A = 350 mA',530,465,43);}
 else if(mode==='series_i'){circuit({points:true,measurement:k?['A','B','C','C'][Math.min(k-1,3)]:null});heading(k>0?'電流計を移して、同じ回路を測る':'A・B・Cで電流を比べる');}
 else if(mode==='not_used'){circuit({points:true});text('0.30 A',230,520,34,blue);text('0.30 A',810,520,34,blue);}
 else if(['parallel_i','merge','i_question'].includes(mode)){let measurement=mode==='parallel_i'&&k?['A','B','C','C'][Math.min(k-1,3)]:mode==='merge'&&k>=2?'D':null;circuit({parallel:true,points:true,measurement});if(mode==='i_question'){text('0.80 A',145,45,31,blue);text('0.30 A',775,220,31,blue);text(k>=2?'0.50 A':'？ A',775,520,33,red);}}
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
