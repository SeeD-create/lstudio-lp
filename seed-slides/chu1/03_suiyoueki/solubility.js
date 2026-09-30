(()=>{
const K=[[10,21],[20,32],[30,46],[40,64],[50,86],[60,110],[70,138]];
const Na=[[10,36],[20,36],[30,36],[40,36],[50,37],[60,37],[70,37]];
const X=t=>100+(t-10)*14.5,Y=g=>540-g*3.25;
const ink='#514c44',red='#b41920',blue='#346e89';
function draw(canvas,step,p=1){
 const cfg=JSON.parse(canvas.dataset.chart),c=canvas.getContext('2d');c.clearRect(0,0,1050,650);
 c.fillStyle='#fffdf8';c.fillRect(0,0,1050,650);c.font='26px "Noto Sans JP", sans-serif';c.fillStyle=ink;c.textAlign='left';c.fillText('水100 gに溶ける最大量（g）',20,36);
 c.lineWidth=1;
 for(let g=0;g<=140;g+=20){c.strokeStyle='#d8d2c8';c.beginPath();c.moveTo(100,Y(g));c.lineTo(970,Y(g));c.stroke();c.fillStyle=ink;c.textAlign='right';c.fillText(String(g),82,Y(g)+9);}
 for(let t=10;t<=70;t+=10){c.strokeStyle='#d8d2c8';c.beginPath();c.moveTo(X(t),85);c.lineTo(X(t),540);c.stroke();c.fillStyle=ink;c.textAlign='center';c.fillText(String(t),X(t),576);}
 c.strokeStyle=ink;c.lineWidth=3;c.beginPath();c.moveTo(100,85);c.lineTo(100,540);c.lineTo(970,540);c.stroke();c.fillStyle=ink;c.textAlign='right';c.fillText('温度（℃）',990,614);
 const line=(a,b,color,w=5)=>{c.strokeStyle=color;c.lineWidth=w;c.beginPath();c.moveTo(...a);c.lineTo(...b);c.stroke()};
 const dot=(t,g,col)=>{c.fillStyle=col;c.beginPath();c.arc(X(t),Y(g),7,0,Math.PI*2);c.fill()};
 // Shape-preserving cubic Hermite interpolation: passes through all supplied values.
 const curve=(data,color)=>{c.strokeStyle=color;c.lineWidth=5;c.beginPath();
  const slopes=data.slice(1).map((a,i)=>(a[1]-data[i][1])/(a[0]-data[i][0]));
  const m=data.map((_,i)=>i===0?slopes[0]:i===data.length-1?slopes.at(-1):slopes[i-1]*slopes[i]<=0?0:2/(1/slopes[i-1]+1/slopes[i]));
  data.slice(0,-1).forEach((a,i)=>{const b=data[i+1],h=b[0]-a[0];for(let j=0;j<=30;j++){const u=j/30,g=(2*u**3-3*u*u+1)*a[1]+(u**3-2*u*u+u)*h*m[i]+(-2*u**3+3*u*u)*b[1]+(u**3-u*u)*h*m[i+1];const x=X(a[0]+u*h),y=Y(g);if(i===0&&j===0)c.moveTo(x,y);else c.lineTo(x,y);}});c.stroke();};
 if(cfg.mode!=='intro'||step>=2)curve(K,red);
 if(cfg.mode==='intro'&&step>=1)[[20,32],[40,64],[60,110]].forEach(a=>dot(...a,red));
 if(cfg.compare){c.setLineDash([14,8]);curve(Na,blue);c.setLineDash([]);}
 function guide(t,g,at,color=red){if(step<at)return;let f=step===at?p:1;line([X(t),540],[X(t),540+(Y(g)-540)*f],color,4);if(f===1)dot(t,g,color);if(step>=at+1){f=step===at+1?p:1;line([X(t),Y(g)],[X(t)+(100-X(t))*f,Y(g)],color,4);}}
 if(cfg.mode==='read')guide(cfg.t,cfg.g,1);
 if(cfg.mode==='cool'){
  guide(60,110,1,red);guide(20,32,3,blue);
  if(step>=5){const x=X(60),y1=Y(110),y2=Y(32),f=step===5?p:1;c.fillStyle='#b419201b';c.fillRect(X(20),y1,x-X(20),(y2-y1)*f);line([x+20,y1],[x+20,y1+(y2-y1)*f],red,6);line([x+9,y1],[x+31,y1],red,4);if(f===1)line([x+9,y2],[x+31,y2],red,4);}
 }
}
let frame=0,last='';function update(){const s=document.querySelector('.slide:not([hidden])'),cv=s?.querySelector('canvas[data-chart]');if(!cv){cancelAnimationFrame(frame);last='';return;}const step=+s.dataset.step,key=s.dataset.title+':'+step;if(key===last)return;last=key;cancelAnimationFrame(frame);const start=performance.now(),reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;function tick(now){const p=reduce?1:Math.min(1,(now-start)/450);draw(cv,step,p);if(p<1)frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);}
new MutationObserver(update).observe(document.querySelector('.stage'),{subtree:true,attributes:true,attributeFilter:['hidden','data-step']});document.fonts.ready.then(()=>{last='';update()});update();
window.SolubilityChart={K,Na,X,Y,draw};
})();
