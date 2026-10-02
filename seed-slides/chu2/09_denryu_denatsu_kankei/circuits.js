(()=>{
'use strict';
const source=new Image(),water=new Image(),kit=new Image(),wire=new Image();wire.src='assets/copper-wire.png';source.src='assets/resistor-source.png';water.src='assets/water-head-compare.png';kit.src='assets/apparatus.png';
let ctx,time=0,labels=[];const ink='#292b2c',red='#c4161c',blue='#347f9d',green='#16816b',muted='#706d66';
function line(points,color=ink,width=4){ctx.beginPath();ctx.moveTo(...points[0]);for(const v of points.slice(1))ctx.lineTo(...v);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke()}
function circle(x,y,r,fill,stroke){ctx.beginPath();ctx.arc(x,y,r,0,2*Math.PI);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=3;ctx.stroke()}}
function text(s,x,y,size=34,color=ink,align='center'){ctx.font=`700 ${size}px "Zen Kaku Gothic New",sans-serif`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(s,x,y);const w=ctx.measureText(s).width;labels.push({text:s,x:align==='center'?x-w/2:align==='right'?x-w:x,y:y-size*.55,w,h:size*1.1})}
function box(x,y,scale,fn){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);fn();ctx.restore()}
function crop(sx,sy,sw,sh,x,y,w,h){ctx.drawImage(source,sx,sy,sw,sh,x,y,w,h)}
function resistor(x,y,w=320){crop(30,320,840,440,x,y,w,w*440/840)}
function symbol(s,x,y,color){circle(x,y,30,'#fff',color);text(s,x,y,30,color)}
function bracket(x,t,b,c){line([[x-10,t],[x,t],[x,b],[x-10,b]],c,4)}
function waterScene(k){
 ctx.drawImage(water,60,0,940,627);
 if(k>=1){bracket(365,209,371,blue);text('小さい段差',265,565,36,blue);text('流れる量は少ない',265,604,26,green)}
 if(k>=2){bracket(831,163,371,red);text('大きい段差',795,565,36,red);text('流れる量が増える',795,604,26,green)}
 // Water markers circulate continuously; speed is qualitative, not a proportional measurement.
 const routes=[[[302,245],[365,245],[385,266],[385,431],[360,431],[140,431],[100,414],[100,168],[170,168]],[[770,245],[830,245],[850,266],[850,431],[825,431],[605,431],[565,414],[565,168],[635,168]]];
 routes.forEach((route,n)=>{if(k<n+1)return;const seg=route.slice(1).map((b,i)=>({a:route[i],b,l:Math.hypot(b[0]-route[i][0],b[1]-route[i][1])}));const total=seg.reduce((v,q)=>v+q.l,0);for(let j=0;j<12;j++){let d=(time*(n?55:30)+j*total/12)%total;for(const q of seg){if(d<=q.l){circle(q.a[0]+(q.b[0]-q.a[0])*d/q.l,q.a[1]+(q.b[1]-q.a[1])*d/q.l,3,'#d8ffff');break}d-=q.l}}});
}
function lab(d,k){
 // Real equipment, with electrically exact A and V circuit connections.
 crop(950,120,560,720,435,15,190,245);
 line([[487,226],[145,226],[145,331],[400,331]],red,4);
 line([[571,226],[915,226],[915,331],[660,331]],ink,4);
 resistor(370,310,320);
 symbol('A',145,280,blue);
 line([[400,331],[345,331],[345,517],[500,517]],red,3);
 line([[560,517],[730,517],[730,331],[660,331]],ink,3);symbol('V',530,517,red);
 circle(400,331,7,red);circle(660,331,7,ink);
 const hasR=d.R!==undefined;
 text(hasR?(d.unknown==='R'&&k<3?'？ Ω':`${d.R} Ω`):(d.label||'抵抗器A'),530,284,36,ink);
 let vv=d.V==null?'？ V':`${d.V.toFixed(1)} V`,ii=d.I==null?'？ A':`${d.I.toFixed(2)} A`;
 if(d.hideI&&k<2)ii='？ A';
 if(d.unknown==='I'&&k<3)ii='？ A';if(d.unknown==='V'&&k<3)vv='？ V';
 if(d.id==='milli')ii=k>=1?'0.20 A':'200 mA';if(d.mode==='milliAnswer')ii=k>=3?'200 mA':'？ mA';
 text(ii,145,427,46,blue);text(vv,530,581,48,red);
}
function miniCompare(k,d){
 for(const [j,x] of [[0,0],[1,530]]){box(x,20,.5,()=>lab({id:'compare',V:3,I:j?.15:.3,hideI:true,label:j?'抵抗器B':'抵抗器A'},d.allValues?2:k>=j+1?2:0));text(j?'抵抗器B':'抵抗器A',x+265,365,38,j?red:blue);if(d.allValues||k>=j+1)text(j?'0.15 A':'0.30 A',x+265,440,58,j?red:blue)}
 text('どちらも 3.0 V',530,555,44,ink);
}
function table(k,division=false,d={}){
 const xs=[200,530,860],ys=[180,310,440];
 text(division?'電圧 ÷ 電流':'電圧（V）',division?340:330,80,38,red);
 if(!division)text('電流（A）',730,80,38,blue);else text('計算結果',850,80,38,ink);
 line([[130,125],[930,125]],muted,2);
 for(let i=0;i<3;i++){if(k<i+1)continue;
 if(division){text(`${i+1}.0 ÷ 0.${i+1}0`,340,ys[i],46,ink);text('＝ 10',850,ys[i],48,red)}else{text(`${i+1}.0`,330,ys[i],52,red);text(d.mode==='Btable'?['0.05','0.10','0.15'][i]:`0.${i+1}0`,730,ys[i],52,blue)}
 line([[130,ys[i]+56],[930,ys[i]+56]],'#d9d7d1',2);
 }
}
function graph(k,mode){
 const ox=155,oy=485,w=680,h=340;const X=v=>ox+v/4*w,Y=i=>oy-i/.4*h;
 const two=['twoGraphs','graphR'].includes(mode);
 for(let j=0;j<=4;j++){line([[X(j),oy],[X(j),oy-h]],'#ddd',1);text(String(j),X(j),oy+32,27,ink)}
 for(let j=0;j<=4;j++){line([[ox,Y(j/10)],[ox+w,Y(j/10)]],'#ddd',1);text((j/10).toFixed(1),ox-27,Y(j/10),27,ink,'right')}
 line([[ox,oy-h-10],[ox,oy],[ox+w+15,oy]],ink,3);
 text('電流（A）',ox,58,36,blue);text('電圧（V）',ox+w/2,580,36,red);
 if(mode==='plot'){for(let i=1;i<=Math.min(k,3);i++)circle(X(i),Y(i/10),9,blue)}
 else if(two){line([[X(0),Y(0)],[X(4),Y(.4)]],blue,5);line([[X(0),Y(0)],[X(4),Y(.2)]],red,5);text('A',920,175,36,blue);text('B',920,235,36,red);
 if(k>=1){line([[X(3),oy],[X(3),Y(.3)]],green,2);circle(X(3),Y(.3),10,blue);circle(X(3),Y(.15),10,red)}
 }else if(k>=1){line([[X(0),Y(0)],[X(3),Y(.3)]],blue,5);for(let i=1;i<=3;i++)circle(X(i),Y(i/10),9,blue);if(k>=2)circle(ox,oy,11,'#fff',red)}
}
function ratios(k){
 text('電圧',170,75,34,red);text('電流',750,75,34,blue);
 const vs=['1.0 V','2.0 V','3.0 V'],is=['0.10 A','0.20 A','0.30 A'];
 for(let i=0;i<3;i++){if(i>k)continue;text(vs[i],230,180+i*150,52,red);text(is[i],770,180+i*150,52,blue);line([[400,180+i*150],[580,180+i*150]],muted,2);if(i>0)text(`${i+1}倍`,490,140+i*150,32,ink)}
}
function formula(d,k){
 const isR=d.id==='Rformula';text(isR?'抵抗（Ω）':'電流（A）',530,105,42,isR?ink:blue);
 text(isR?'電圧（V）':'電圧（V）',530,230,50,red);line([[260,285],[800,285]],ink,5);text(isR?'電流（A）':'抵抗（Ω）',530,348,50,isR?blue:ink);
 if(k>=2)text(isR?'R ＝ V ÷ I':'I ＝ V ÷ R',530,515,64,red);
}
function milliGraph(d,k){
 const ox=155,oy=470,w=680,h=320,max=d.R===10?400:200;const X=v=>ox+v/4*w,Y=i=>oy-i/max*h;
 for(let j=0;j<=8;j++)line([[X(j/2),oy],[X(j/2),oy-h]],'#e5e3df',1);
 for(let j=0;j<=4;j++)text(String(j),X(j),oy+32,28,ink);
 for(let j=0;j<=max;j+=50){line([[ox,Y(j)],[ox+w,Y(j)]],'#ddd',1);text(String(j),ox-26,Y(j),27,ink,'right')}
 line([[ox,oy-h-10],[ox,oy],[ox+w+15,oy]],ink,3);
 text('電流（mA）',180,55,36,blue);text('電圧（V）',495,585,36,red);text(`抵抗器${d.label}`,780,55,34,blue);
 line([[X(0),Y(0)],[X(4),Y(4000/d.R)]],blue,5);
 const voltage=d.I*d.R,current=d.I*1000,px=X(voltage),py=Y(current);
 if(d.mode==='reverseGraph'){
  circle(ox,py,9,green);
  if(k>=1){line([[ox,py],[px,py]],green,3);circle(px,py,10,green)}
  if(k>=2){line([[px,py],[px,oy]],red,3);circle(px,oy,9,red)}
  if(k>=3)text(`${voltage.toFixed(1)} V`,px,542,40,red);
 }else if(k>=1){line([[px,oy],[px,py],[ox,py]],green,3);circle(px,py,10,green)}
}
function wireScene(k){
 const w=960,h=w*wire.height/wire.width;ctx.drawImage(wire,50,35,w,h);
 if(k>=1)text('銅の芯',780,555,44,'#a35d00');
 if(k>=2)text('樹脂の被覆',280,555,44,blue);
}
function draw(c,k,d){ctx=c.getContext('2d');ctx.clearRect(0,0,1060,620);labels=[];
 if(d.mode==='water')waterScene(k);
 else if(['lab','predict','calc','milli','milliAnswer'].includes(d.mode))lab(d,k);
 else if(d.mode==='object'){resistor(130,175,800);text('抵抗器',530,565,46,ink)}
 else if(['table','division','Btable'].includes(d.mode))table(k,d.mode==='division',d);
 else if(['plot','line','twoGraphs','graphR'].includes(d.mode))graph(k,d.mode);
 else if(d.mode==='ratio')ratios(k);
 else if(d.mode==='compare')miniCompare(k,d);
 else if(d.mode==='formula')formula(d,k);
 else if(['reverseGraph','milliGraph'].includes(d.mode))milliGraph(d,k);
 else if(d.mode==='wire')wireScene(k);
 c.closest('.slide').dataset.diagramLabels=JSON.stringify(labels);
}
Promise.all([source.decode(),water.decode(),kit.decode(),wire.decode(),document.fonts.ready,fetch('slides.json').then(r=>r.json())]).then(v=>{const data=new Map(v[5].slides.map(s=>[s.id,s]));window.CircuitAssetsReady=true;let last=0;function run(now){if(now-last>32){last=now;time=matchMedia('(prefers-reduced-motion: reduce)').matches?0:now/1000;const s=document.querySelector('.slide:not([hidden])'),c=s?.querySelector('canvas');if(c)draw(c,Number(s.dataset.step||0),data.get(s.dataset.id))}requestAnimationFrame(run)}requestAnimationFrame(run)}).catch(e=>{window.CircuitAssetsError=String(e);console.error(e)});
})();
