(()=>{'use strict';
const img=new Image();img.src='assets/apparatus.png';let c,labels=[],regions=[],phase=0;
const waterImages=Object.fromEntries(['base','narrow','series','series3','parallel'].map(key=>{const image=new Image();image.src=`assets/water-${key}.png`;return[key,image]}));
const waterClocks=new Map();
function waterScene(mode,k){
 const kind={water_resistance:'narrow',water_series:'series',water_parallel:'parallel'}[mode];
 const seriesMode=mode==='water_series';
 const rightKind=seriesMode?(k>=2?'series3':'series'):(k>=1?kind:'base');
 const periods=seriesMode?[9,k>=2?27:18]:[23,23];
 const clockStates=[];
 const titles={narrow:['もとの管','もっと通りにくい管'],series:['通りにくい部分：1か所','通りにくい部分：2か所'],parallel:['通り道：1本','通り道：2本']};
 txt(titles[kind][0],270,61,29,blue);txt(seriesMode?`通りにくい部分：${k>=2?3:2}か所`:k>=1?titles[kind][1]:titles[kind][0],790,61,29,seriesMode||k>=1?red:blue);
 line([[530,105],[530,578]],'#e2ded7',2);
 function panel(key,x,panelIndex){
  const clockKey=mode+panelIndex;const clock=waterClocks.get(clockKey)||{cycles:0,last:phase};
  clock.cycles+=Math.max(0,Math.min(.1,phase-clock.last))/periods[panelIndex];clock.last=phase;waterClocks.set(clockKey,clock);clockStates.push(clock.cycles);
  const y=125,w=480,h=300,sx=70,sy=120,sw=1400,sh=750;
  c.drawImage(waterImages[key],sx,sy,sw,sh,x,y,w,h);regions.push({x,y,w,h,name:'water-'+key});
  const map=([px,py])=>[x+(px-sx)/sw*w,y+(py-sy)/sh*h];
  // A closed route carries each marker around the whole loop, including the pump.
  // Parallel markers alternate branches and continue through the common return pipe.
  const makeRoute=(branch=0)=>{
   const points=[[300,190]];
   const to=(px,py)=>points.push([px,py]);
   const bend=(cx,cy,ex,ey)=>{const [ax,ay]=points.at(-1);for(let n=1;n<=16;n++){const t=n/16,u=1-t;to(u*u*ax+2*u*t*cx+t*t*ex,u*u*ay+2*u*t*cy+t*t*ey);}};
   to(1240,190);bend(1340,190,1340,285);
   if(key==='parallel'){
    to(1340,300);const bx=branch?1400:1260;
    bend(1340,322,bx,365);to(bx,650);bend(bx,692,1340,730);
   }else to(1340,700);
   bend(1340,790,1240,790);to(300,790);bend(205,790,205,700);
   to(205,285);bend(205,190,300,190);
   const segments=points.slice(1).map((b,i)=>{const a=points[i];return{a,b,length:Math.hypot(b[0]-a[0],b[1]-a[1])}});
   const length=segments.reduce((sum,v)=>sum+v.length,0);
   return{length,at(distance){let d=((distance%length)+length)%length;for(const seg of segments){if(d<=seg.length){const t=d/seg.length;return[seg.a[0]+(seg.b[0]-seg.a[0])*t,seg.a[1]+(seg.b[1]-seg.a[1])*t]}d-=seg.length}return points[0]}};
  };
  const routes=[makeRoute(0),makeRoute(1)],count=18;
  for(let i=0;i<count;i++){
   const route=routes[key==='parallel'?i%2:0];
   const distance=(clock.cycles+i/count)*route.length;
   const a=map(route.at(distance-10)),b=map(route.at(distance)),tail=map(route.at(distance-38));
   line([tail,a,b],'rgba(237,255,255,.9)',4);
   c.save();c.translate(...b);c.rotate(Math.atan2(b[1]-a[1],b[0]-a[0]));
   line([[-6,-4],[0,0],[-6,4]],'#147c9b',2.4);c.restore();
  }
 }
 panel('base',30,0);panel(rightKind,550,1);
 txt('ポンプがつくる圧力差は同じ',530,461,26);
 if(k>=(seriesMode?1:2)){
  const widths=seriesMode?[300,k>=2?100:150]:[180,kind==='parallel'?290:100];
  [30,550].forEach((x,i)=>{txt('同じ時間に通る水の量',x+240,508,25);c.fillStyle='#e8f0f3';c.fillRect(x+55,539,370,23);c.fillStyle=i?red:blue;c.fillRect(x+55,539,widths[i],23);});
  txt(seriesMode&&k>=2?'さらに、ゆっくり流れる':kind==='parallel'?'全体では、増える':'全体では、減る',790,592,25,red);
 }
 return{rightKind,flowCompare:k>=(seriesMode?1:2)?(kind==='parallel'?'more':'less'):'hidden',directionOnly:!seriesMode,periods,clockStates};
}
const ink='#292b2c',red='#c4161c',blue='#347f9d',gray='#706d66';
function line(p,col=ink,w=4,dash=[]){c.beginPath();c.moveTo(...p[0]);for(const a of p.slice(1))c.lineTo(...a);c.strokeStyle=col;c.lineWidth=w;c.setLineDash(dash);c.lineCap='round';c.lineJoin='round';c.stroke();c.setLineDash([]);}
function txt(s,x,y,size=28,col=ink,align='center'){c.font=`700 ${size}px "Zen Kaku Gothic New",sans-serif`;c.fillStyle=col;c.textAlign=align;c.textBaseline='middle';c.fillText(s,x,y);const w=c.measureText(s).width;labels.push({text:s,x:align==='center'?x-w/2:x,y:y-size*.55,w,h:size*1.1});}
function circle(x,y,r,fill,col){c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(col){c.strokeStyle=col;c.lineWidth=3;c.stroke();}}
function asset(name,x,y,w,h){const r=name==='resistor'?[25,320,855,420]:[940,125,550,720];c.drawImage(img,r[0]/1536*img.width,r[1]/1024*img.height,r[2]/1536*img.width,r[3]/1024*img.height,x,y,w,h);regions.push({x,y,w,h,name});}
function resistor(x,y,real=false){if(real){asset('resistor',x-100,y-42,200,98);line([[x-101,y],[x-82,y]]);line([[x+82,y],[x+101,y]]);}else{c.fillStyle='white';c.fillRect(x-50,y-22,100,44);c.strokeStyle=ink;c.lineWidth=4;c.strokeRect(x-50,y-22,100,44);}}
function meter(type,x,y){circle(x,y,29,'white',type==='A'?blue:red);txt(type,x,y,27,type==='A'?blue:red);}
function source(x,y){c.fillStyle='white';c.fillRect(x-22,y-46,44,92);line([[x-12,y-36],[x-12,y+36]]);line([[x+12,y-22],[x+12,y+22]]);txt('＋',x-48,y-47,23,red);txt('−',x+47,y-47,23);}
function readouts(items,y=60){const n=items.length;items.forEach(([s,col],i)=>txt(s,(i+.5)*1060/n,y,30,col||ink));}
function circuit({parallel=false,two=false,real=false,a=false,v=false,r1=10,r2=20,volts=null,showLabels=true,highlight=0}={}){
 const l=155,r=905,top=185,bottom=450,upper=305;
 line([[530,top],[l,top],[l,bottom],[r,bottom],[r,top],[530,top]]);source(530,top);
 if(parallel){line([[l,upper],[r,upper]]);circle(l,upper,6,ink);circle(r,upper,6,ink);resistor(530,upper,real);resistor(530,bottom,real);if(showLabels){txt(`① ${r1} Ω`,720,upper-47,28);txt(`② ${r2} Ω`,720,bottom+66,28);}}
 else if(two){resistor(370,bottom,real);resistor(700,bottom,real);if(showLabels){txt(`① ${r1} Ω`,370,bottom-90,29);txt(`② ${r2} Ω`,700,bottom-90,29);}}
 else{resistor(530,bottom,real);if(showLabels)txt(`${r1} Ω`,530,bottom-90,31);}
 if(a)meter('A',l,320);
 if(v){line([[390,bottom],[390,550],[501,550]],red,3);line([[559,550],[670,550],[670,bottom]],ink,3);circle(390,bottom,5,red);circle(670,bottom,5,ink);meter('V',530,550);}
 if(volts!==null)txt(`電源 ${volts} V`,530,87,34,red);
 if(highlight){c.strokeStyle=highlight===1?blue:red;c.lineWidth=3;c.setLineDash([10,7]);if(highlight===1)c.strokeRect(100,125,860,410);else c.strokeRect(280,345,180,180);c.setLineDash([]);}
}
function graph({n=3,lineA=true,b=false,bpoints=false,reverse=false,guide=0}={}){
 const x0=155,y0=488,w=740,h=340;
 const xmax=reverse?.3:3,ymax=reverse?3:.3;
 txt(reverse?'電圧〔V〕':'電流〔A〕',145,52,31);txt(reverse?'電流〔A〕':'電圧〔V〕',780,565,31);
 for(let i=0;i<=6;i++){const x=x0+i*w/6,y=y0-i*h/6;line([[x,y0],[x,y0-h]],'#e3e1dc',1.2);line([[x0,y],[x0+w,y]],'#e3e1dc',1.2);const fmt=(v)=>reverse?v.toFixed(2):v.toFixed(1);txt(reverse?(i*xmax/6).toFixed(2):(i*xmax/6).toFixed(1),x,y0+30,23,gray);if(i)txt(reverse?(i*ymax/6).toFixed(1):(i*ymax/6).toFixed(2),x0-51,y,23,gray);}
 line([[x0,y0-h-10],[x0,y0],[x0+w+15,y0]],ink,3);
 const point=(v,i)=>[x0+(reverse?i:v)/xmax*w,y0-(reverse?v:i)/ymax*h];
 if(lineA)line([point(0,0),point(3,.3)],blue,5);
 if(b)line([point(0,0),point(3,.15)],red,5);
 for(let j=1;j<=n;j++){circle(...point(j,j/10),8,blue,'white');if(bpoints)circle(...point(j,j/20),8,red,'white');}
 if(guide){const v=reverse?1:2.5,i=reverse?.1:.25;const [x,y]=point(v,i);line([[x,y0],[x,y]],gray,3,[9,7]);if(guide>=2)line([[x,y],[x0,y]],gray,3,[9,7]);circle(x,y,9,red,'white');}
 if(b){txt('A',460,99,28,blue);txt('B',605,99,28,red);}
 regions.push({x:x0,y:y0-h,w,h,name:'plot'});
}
function resultTable(k){const x=[200,535,850],y=[132,260,385,510];txt('電圧〔V〕',345,69,31);txt('電流〔A〕',740,69,31);for(let j=0;j<4;j++)line([[125,y[j]+40],[935,y[j]+40]],'#d4d2cc',2);for(let i=0;i<3;i++){txt(['1.0','2.0','3.0'][i],345,y[i+1]-47,47,blue);txt(['0.10','0.20','0.30'][i],740,y[i+1]-47,47,red);}if(k>=1){txt('×2',175,283,28);txt('×2',920,283,28);}if(k>=2){txt('×3',175,425,28);txt('×3',920,425,28);}}
function pair(k,mode){asset('resistor',105,170,365,178);asset('resistor',595,170,365,178);txt('抵抗器A',290,106,34,blue);txt('抵抗器B',780,106,34,red);txt('2.0 V',290,407,36);txt('2.0 V',780,407,36);if(k>=1)txt('0.20 A',290,482,42,blue);if(k>=2)txt('0.10 A',780,482,42,red);if(mode==='ratio'){if(k>=1)txt('10 Ω',290,557,37,blue);if(k>=2)txt('20 Ω',780,557,37,red);}}
function render(canvas,k){c=canvas.getContext('2d');labels=[];regions=[];c.clearRect(0,0,1060,620);c.fillStyle='#fff';c.fillRect(0,0,1060,620);const mode=canvas.dataset.mode;let state={mode,step:k};
 if(mode.startsWith('water_')){state={...state,...waterScene(mode,k)};}
 else if(mode==='resistor'){asset('resistor',35,215,540,260);asset('supply',680,110,270,353);txt('抵抗器',303,528,34,blue);txt('電源装置',815,528,34);}
 else if(mode==='setup'){circuit({real:true,a:k>=1,v:k>=2,showLabels:false});txt('電源装置につなぐ',530,69,30);}
 else if(mode==='measure'||mode==='measure_b_curve'){const volts=Math.min(k,3),resistance=mode==='measure'?10:20,amps=volts/resistance;circuit({real:true,a:true,v:true,showLabels:false});readouts([[`電圧 ${volts.toFixed(1)} V`,red],[`電流 ${amps.toFixed(2)} A`,blue]],52);state={...state,volts,amps,resistance};}
 else if(mode==='table_a')resultTable(k);
 else if(mode==='plot'){graph({n:Math.min(k,3),lineA:false});state.points=Math.min(k,3);}
 else if(mode==='proportion')graph({lineA:k>=1});
 else if(['measure_b','resistance','ratio'].includes(mode))pair(k,mode);
 else if(mode==='compare_graph'){graph({b:k>=1,bpoints:k>=1});}
 else if(mode==='one_ohm'){circuit({r1:1,volts:1});if(k>=1)txt('電流 1 A',530,558,38,blue);}
 else if(['calc_r','calc_i','calc_v','ma'].includes(mode)){const params={calc_r:[null,'4.0','0.20'],calc_i:[20,'6.0',null],calc_v:[15,null,'0.20'],ma:[null,'3.0','200 mA']}[mode];circuit({r1:params[0],volts:params[1],showLabels:false});txt(params[0]===null?(k>=3?(mode==='ma'?'抵抗 15 Ω':'抵抗 20 Ω'):'抵抗 ？ Ω'):`抵抗 ${params[0]} Ω`,530,338,35,ink);const ans={calc_i:'0.30 A',calc_v:'3.0 V'};txt(mode==='calc_v'?`電流 ${params[2]} A`:`電流 ${params[2]?(mode==='ma'?params[2]:params[2]+' A'):k>=3?ans.calc_i:'？ A'}`,530,548,37,blue);if(mode==='calc_v')txt(k>=3?'電圧 3.0 V':'電圧 ？ V',530,72,36,red);}
 else if(mode==='read_graph'){graph({guide:k,});state.guide=k;}
 else if(mode==='reverse_axes'){graph({reverse:true,b:k>=2,bpoints:k>=2});}
 else if(mode==='conditions'){asset('resistor',100,165,850,417);txt('同じ抵抗器で、条件をそろえる',530,73,34);}
 else if(mode==='conductors'){asset('resistor',100,180,850,417);txt('金属の端子',250,88,33);txt('絶縁性の台',780,88,33);}
 else if(['series_start','series_total','series_parts','scope','series_q'].includes(mode)){
  const q=mode==='series_q';circuit({two:true,r1:q?5:10,r2:q?15:20,volts:q?'8.0':'6.0',highlight:mode==='scope'?Math.min(k,2):0});
  if(mode==='series_parts'){if(k>=1)txt('2.0 V',370,545,36,red);if(k>=2)txt('4.0 V',700,545,36,red);txt('電流 0.20 A',530,282,35,blue);}
  if(mode==='series_total'){if(k>=2)txt('全抵抗 30 Ω',530,559,37,red);if(k>=3)txt('電流 0.20 A',530,285,35,blue);}
  if(q){if(k>=2)txt('電流 0.40 A',530,285,35,blue);if(k>=3)txt('6.0 V',700,555,36,red);}
 }
 else if(['parallel_start','parallel_i','parallel_total','equal_parallel','parallel_q'].includes(mode)){
  const q=mode==='parallel_q',same=mode==='equal_parallel';circuit({parallel:true,r1:q?20:same?20:10,r2:q?30:20,volts:q?'6.0':'2.0'});
  if(mode==='parallel_i'||q){if(k>=1)txt(q?'0.30 A':'0.20 A',330,254,29,blue);if(k>=2)txt(q?'0.20 A':'0.10 A',330,514,29,blue);if(k>=3)txt(q?'全体 0.50 A':'全体 0.30 A',530,582,32,blue);}
  if(mode==='parallel_total'){txt('全体の電流 0.30 A',530,574,35,blue);}
  if(same&&k>=2)txt('全抵抗 10 Ω',530,577,35,red);
 }
 else if(mode==='parallel_rule'){circuit({parallel:true,volts:'2.0'});}
 canvas.closest('.slide').dataset.diagramLabels=JSON.stringify(labels);canvas.closest('.slide').dataset.diagramRegions=JSON.stringify(regions);canvas.closest('.slide').dataset.motion=JSON.stringify(state);
}
Promise.all([img.decode(),...Object.values(waterImages).map(image=>image.decode()),document.fonts.ready]).then(()=>{window.CircuitAssetsReady=true;let last=0;function tick(t){if(t-last>15){last=t;phase=matchMedia('(prefers-reduced-motion: reduce)').matches?0:t/1000;const s=document.querySelector('.slide:not([hidden])'),canvas=s?.querySelector('canvas');if(canvas)render(canvas,+s.dataset.step||0);}requestAnimationFrame(tick);}requestAnimationFrame(tick);}).catch(e=>console.error(e));
})();
