(()=>{
const blue='#2676a3',red='#b62a31',ink='#37322d';
const text=(c,t,x,y,size=27,color=ink,align='center')=>{c.font=`700 ${size}px "Noto Sans JP","Yu Gothic",sans-serif`;c.fillStyle=color;c.textAlign=align;c.fillText(t,x,y)};
const line=(c,x1,y1,x2,y2,color=ink,width=3)=>{c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke()};
function draw(canvas){const c=canvas.getContext('2d'),kind=canvas.dataset.chart,step=+canvas.closest('.slide').dataset.step||0;c.clearRect(0,0,1600,650);
 if(kind==='graph'){
  const L=180,R=1430,T=110,B=525,X=t=>L+t/50*(R-L),Y=d=>B-d/160*(B-T);
  text(c,'震源距離（km）',L,T-60,32,ink,'left');text(c,'地震発生からの時間（秒）',(L+R)/2,625,32);
  for(let t=0;t<=50;t+=8){line(c,X(t),T,X(t),B,'#e4dfd6',2);text(c,t,X(t),B+42)}
  for(let d=0;d<=144;d+=48){line(c,L,Y(d),R,Y(d),'#e4dfd6',2);text(c,d,L-35,Y(d)+9,27,ink,'right')}
  line(c,L,T,L,B);line(c,L,B,R,B);line(c,L,B,X(160/6),T,blue,5);line(c,L,B,X(50),Y(150),red,5);
  for(const d of [48,96,144])for(const [v,color] of [[6,blue],[3,red]]){c.fillStyle=color;c.beginPath();c.arc(X(d/v),Y(d),9,0,Math.PI*2);c.fill()}
  text(c,'● P波',1120,45,34,blue);text(c,'● S波',1350,45,34,red);
 }else if(kind==='warning'){
  const x=t=>185+t/16*1250;const y=285;
  text(c,'地震発生後の時間',800,70,34);line(c,x(0),y,x(16),y,'#b7aa92',6);
  [[0,'地震発生',ink],[2,'近くでP波検知',blue],[5,'速報を受信',ink],[16,'遠くでS波到着',red]].forEach(([t,label,color])=>{c.fillStyle=color;c.beginPath();c.arc(x(t),y,12,0,Math.PI*2);c.fill();text(c,label,x(t),t===2?220:370,30,color)});
  line(c,x(5),455,x(16),455,blue,6);text(c,'強い揺れに備える時間',(x(5)+x(16))/2,520,35,blue);text(c,'配置は仕組みを示す例。実際の通知時刻は一定ではない。',800,610,28);
 }else{
  const three=kind==='three',L=245,R=1480,X=t=>L+t/64*(R-L),points=three?[[48,8,16],[96,16,32],[144,24,48]]:[[48,8,16]],ys=three?[170,330,490]:[310];
  text(c,'地面の揺れ（模式的）',L,43,29,ink,'left');text(c,'地震発生からの時間（秒）',(L+R)/2,635,30);
  for(let t=0;t<=64;t+=8){line(c,X(t),85,X(t),545,'#ded8cd',2);text(c,t,X(t),583)}
  points.forEach(([d,p,s],i)=>{const y=ys[i],scale=three?1:1.55;
   if(step>=1){c.fillStyle='#2676a31b';c.fillRect(X(p),y-51*scale,X(s)-X(p),102*scale)}
   if(step>=2){c.fillStyle='#b62a3116';c.fillRect(X(s),y-51*scale,R-X(s),102*scale)}
   text(c,`${'ABC'[i]}：${d} km`,L-30,y+9,30,ink,'right');line(c,L,y,R,y,'#aaa296',2);c.strokeStyle=ink;c.lineWidth=3;c.beginPath();
   for(let j=0;j<=1250;j++){const t=j/1250*64;let amplitude=t<p?0:t<s?10:43;amplitude*=scale;const v=Math.sin(t*9)*Math.cos(t*1.7)*amplitude;const x=X(t),yy=y-v;j?c.lineTo(x,yy):c.moveTo(x,yy)}c.stroke();
   if(step>=1)line(c,X(p),y-51*scale,X(p),y+51*scale,blue,3);
   if(step>=2)line(c,X(s),y-51*scale,X(s),y+51*scale,red,3);
   if(step>=3){const by=three?y-64:y-130;line(c,X(p),by,X(s),by,blue,4);line(c,X(p),by-8,X(p),by+8,blue,4);line(c,X(s),by-8,X(s),by+8,blue,4);text(c,`${s-p}秒`,(X(p)+X(s))/2,by-15,three?25:34,blue)}
  });
 }
}
function all(){document.querySelectorAll('canvas[data-chart]').forEach(draw)}
new MutationObserver(all).observe(document.querySelector('.stage'),{subtree:true,attributes:true,attributeFilter:['data-step','hidden']});document.fonts.ready.then(all);all();
})();
