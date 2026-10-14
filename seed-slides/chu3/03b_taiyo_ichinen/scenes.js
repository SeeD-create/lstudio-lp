/* Deterministic astronomy geometry. Angles in degrees; north-up diagrams. */
window.Astro=(()=>{'use strict';const D=Math.PI/180,W=1712,H=500,red='#d9474e',blue='#62b0d0',gold='#e4bd70',night='#101e30';let ink='#292c30',muted='#6f716e',c,bounds=[];
const images={};const ready=Promise.all(['moon','galaxy','shadow-seasons-v2','orbit-seasons-v2'].map(k=>new Promise(resolve=>{const i=new Image();images[k]=i;i.onload=resolve;i.onerror=resolve;i.src='../_astro_shared/assets/'+k+'.png';})));
function text(t,x,y,size=27,color=ink,align='center'){c.font=`600 ${size}px "Zen Kaku Gothic New","Yu Gothic",sans-serif`;c.fillStyle=color;c.textAlign=align;c.textBaseline='middle';c.fillText(t,x,y);let w=c.measureText(t).width;bounds.push({text:t,l:align==='left'?x:align==='right'?x-w:x-w/2,r:align==='left'?x+w:align==='right'?x:x+w/2,t:y-size*.65,b:y+size*.65});}
function line(x,y,xx,yy,color=muted,width=2,dash=[]){c.beginPath();c.setLineDash(dash);c.strokeStyle=color;c.lineWidth=width;c.moveTo(x,y);c.lineTo(xx,yy);c.stroke();c.setLineDash([]);}
function circle(x,y,r,color,stroke){c.beginPath();c.arc(x,y,r,0,2*Math.PI);if(color){c.fillStyle=color;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
function arrow(x,y,xx,yy,color=gold,width=3){line(x,y,xx,yy,color,width);const a=Math.atan2(yy-y,xx-x);c.beginPath();c.moveTo(xx,yy);c.lineTo(xx-13*Math.cos(a-.4),yy-13*Math.sin(a-.4));c.lineTo(xx-13*Math.cos(a+.4),yy-13*Math.sin(a+.4));c.closePath();c.fillStyle=color;c.fill();}
function poly(points,fill,stroke){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
function orb(x,y,r,color=blue){let g=c.createRadialGradient(x-r*.35,y-r*.4,r*.05,x,y,r);g.addColorStop(0,color);g.addColorStop(.72,color);g.addColorStop(1,'#27394c');circle(x,y,r,g);}
function half(x,y,r,angle=0,color=blue){circle(x,y,r,'#233247');c.save();c.translate(x,y);c.rotate(angle);c.beginPath();c.arc(0,0,r,-Math.PI/2,Math.PI/2);c.closePath();c.fillStyle=color;c.fill();c.restore();}
function split(a,b){line(890,70,890,430,'#d8d3c8');text(a,445,34);text(b,1300,34);}
function stars(x,y,w,h,n=90){c.fillStyle=night;c.fillRect(x,y,w,h);for(let i=0;i<n;i++){const a=(Math.sin(i*91.7+2)*437.3)%1,b=(Math.sin(i*32.1+7)*247.3)%1;circle(x+Math.abs(a)*w,y+Math.abs(b)*h,i%7?1:2,'#adb9cc');}}
// Projected illuminated sphere: z points to observer, x to screen right.
function phase(x,y,r,sx,sz){circle(x,y,r,'#263445');c.save();c.beginPath();c.arc(x,y,r,0,2*Math.PI);c.clip();c.beginPath();if(sx>=0){for(let v=-r;v<=r;v+=1){let q=Math.sqrt(Math.max(0,r*r-v*v));v===-r?c.moveTo(x-sz*q,y+v):c.lineTo(x-sz*q,y+v);}c.lineTo(x+r+2,y+r);c.lineTo(x+r+2,y-r);}else{for(let v=-r;v<=r;v+=1){let q=Math.sqrt(Math.max(0,r*r-v*v));v===-r?c.moveTo(x+sz*q,y+v):c.lineTo(x+sz*q,y+v);}c.lineTo(x-r-2,y+r);c.lineTo(x-r-2,y-r);}c.closePath();c.fillStyle='#eee6cc';c.fill();c.restore();circle(x,y,r,null,'#71808c');}
function moonFraction(a){return(1-Math.cos(a*D))/2;}
function venusMetrics(a){let vx=.72*Math.cos(a*D),vy=.72*Math.sin(a*D),distance=Math.hypot(1-vx,vy);return{vx,vy,distance,sx:-Math.sin(a*D)/distance,sz:(.72-Math.cos(a*D))/distance,fraction:(1+(.72-Math.cos(a*D))/distance)/2};}
function solar(dec,ha,lat=35){let p=lat*D,d=dec*D,h=ha*D,e=-Math.cos(d)*Math.sin(h),n=Math.sin(d)*Math.cos(p)-Math.cos(d)*Math.cos(h)*Math.sin(p),u=Math.sin(d)*Math.sin(p)+Math.cos(d)*Math.cos(h)*Math.cos(p);return{alt:Math.asin(Math.max(-1,Math.min(1,u)))/D,az:(Math.atan2(e,n)/D+360)%360};}
function dayLength(dec){return 2*Math.acos(-Math.tan(35*D)*Math.tan(dec*D))/D/15;}
const YEAR=365.2422;
function annualMetrics(day){return{orbit:day*360/YEAR,spin:day*360*(1+1/YEAR),drift:day*360/YEAR};}
function observer(x,y,scale=1,rotation=0,color=red){
 c.save();c.translate(x,y);c.rotate(rotation);circle(0,-36*scale,7*scale,color);
 line(0,-27*scale,0,-11*scale,color,4*scale);
 line(-12*scale,-15*scale,0,-23*scale,color,3*scale);line(0,-23*scale,12*scale,-15*scale,color,3*scale);
 line(-9*scale,0,0,-11*scale,color,3*scale);line(0,-11*scale,9*scale,0,color,3*scale);c.restore();
}
function polarObserver(cx,cy,r,spin,orbit){
 const a=spin*D,u=[Math.cos(a),-Math.sin(a)],east=[-Math.sin(a),-Math.cos(a)];
 half(cx,cy,r,Math.PI-orbit*D,blue);
 for(let k=1;k<4;k++)circle(cx,cy,r*k/4,null,'#acc9da40');
 for(let k=0;k<6;k++){const q=(spin+k*30)*D;line(cx-r*Math.cos(q),cy+r*Math.sin(q),cx+r*Math.cos(q),cy-r*Math.sin(q),'#acc9da40',1);}
 circle(cx,cy,4,'#ffffff');
 const x=cx+r*u[0],y=cy+r*u[1];observer(x,y,.82,Math.atan2(u[0],-u[1]));
 for(const [name,v,col,len] of [['北',u.map(z=>-z),blue,49],['南',u,blue,67],['東',east,gold,72],['西',east.map(z=>-z),'#f5f0e5',72]]){
   const start=name==='南'?40:4;arrow(x+v[0]*start,y+v[1]*start,x+v[0]*len,y+v[1]*len,col,2);
   text(name,x+v[0]*(len+19),y+v[1]*(len+19),23,col);
 }
 const sun=(orbit+180)*D,sv=[Math.cos(sun),-Math.sin(sun)],t=[-sv[1],sv[0]];
 for(const k of [-1,0,1])arrow(cx+sv[0]*205+t[0]*k*35,cy+sv[1]*205+t[1]*k*35,cx+sv[0]*140+t[0]*k*35,cy+sv[1]*140+t[1]*k*35,gold,2);
}
// South-facing projection at 35 N. Hour angle grows westward; stars share one rotation.
function observerSky(cx,base,rx,ry,ha,daylight=0,ghosts=[],starAlpha=1,choicePositions=false){
 const x=cx-rx-25,y=88,w=rx*2+50,h=base-y;
 c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
 c.fillStyle=`rgba(93,158,196,${daylight*.65})`;c.fillRect(x,y,w,h);
 const pos=(angle,dec=0)=>{const h=angle*D,d=dec*D,lat=35*D;return{e:-Math.cos(d)*Math.sin(h),n:Math.sin(d)*Math.cos(lat)-Math.cos(d)*Math.cos(h)*Math.sin(lat),u:Math.sin(d)*Math.sin(lat)+Math.cos(d)*Math.cos(h)*Math.cos(lat)};};
 const project=q=>[cx-q.e*rx,base-q.u*ry];
 c.save();c.globalAlpha*=starAlpha;
 for(let i=0;i<45;i++){const q=pos(ha+i*137.51,-25+(i*31)%80);if(q.u>0&&q.n<.2){const pt=project(q);circle(...pt,i%7?1.4:2.4,'#d8e7ee80');}}c.restore();
 c.beginPath();for(let h=-90;h<=90;h+=2){const pt=project(pos(h));h===-90?c.moveTo(...pt):c.lineTo(...pt);}c.strokeStyle='#d9e7ec60';c.lineWidth=2;c.setLineDash([5,7]);c.stroke();c.setLineDash([]);
 for(const angle of ghosts){const q=pos(angle);if(q.u>=0)circle(...project(q),7,null,'#eddda580');}
 const q=pos(ha);c.save();c.globalAlpha*=starAlpha;if(q.u>=0){const pt=project(q);circle(...pt,10,'#ffe19a');line(pt[0]-17,pt[1],pt[0]+17,pt[1],gold);line(pt[0],pt[1]-17,pt[0],pt[1]+17,gold);}c.restore();
 c.restore();
 if(choicePositions){for(let k=0;k<7;k++){const pt=project(pos(-90+k*30));circle(...pt,5,null,'#f5f0e5');text('あいうえおかき'[k],pt[0],pt[1]-28,27,gold);}}
 line(x,base,x+w,base,'#9cacb2',2);observer(cx,base,1.05,0,'#f4ead4');
 text('東',cx-rx,base+29,24);text('南',cx,base+29,24);text('西',cx+rx,base+29,24);
 if(q.u<0)text('注目する星は、地平線の下',cx,115,23,muted);
}
function annualCycle(s,p,step){
 const day=p.day??0,m=annualMetrics(day),ha=s.samples?m.drift:m.spin;
 line(850,72,850,475,'#476075');text('北極側から見た地球・人・方位',420,32,28);text('その人が南を向いて見る空',1280,32,28);
 c.save();c.globalAlpha=p._snapshotVisible??1;polarObserver(420,247,89,ha,m.orbit);
 const fraction=day-Math.floor(day),light=s.samples?0:Math.pow(Math.sin(Math.PI*fraction),4);
 observerSky(1280,352,325,260,ha,light,s.samples?[0,3600/YEAR,7200/YEAR].filter(v=>v<=m.drift+1e-7):[0]);c.restore();
 const mins=Math.round(day*24*60),dayLabel=`${Math.floor(mins/1440)}日後　${String(Math.floor(mins%1440/60)).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}`;
 text(s.samples?`${Math.round(day)}日後　0:00`:dayLabel,1280,69,25,gold);
 const turns=Math.floor((m.spin+1e-7)/360),extra=Math.max(0,m.spin-turns*360);
 text(s.samples?'同じ時刻の地球の向きだけを比較':`自転：${turns}周 ＋ 約${extra.toFixed(1)}°`,420,461,26,gold);
 if(s.samples){text(`同じ時刻のずれ　西へ約${Math.round(m.drift)}°`,1280,450,29,gold);}
 else{
  text(s.explain?'1周したあとに回る角度（拡大）':'同じ時刻のずれ（拡大した回転角の目盛り）',1280,412,21,muted);
  const left=1070,scale=125;line(left,448,left+scale*3,448,'#768c9d',2);
  for(let k=0;k<=3;k++){line(left+k*scale,442,left+k*scale,454,'#b3c7d5');text(k+'°',left+k*scale,476,21,muted);}
  const completed=Math.floor(day+1e-7);for(let k=0;k<=Math.min(3,completed);k++)circle(left+annualMetrics(k).drift*scale,448,6,'#a3bbc9');
  if(s.explain&&m.spin>=360-1e-7)circle(left+Math.max(0,m.spin-360)*scale,448,9,gold);
  else if(!s.explain&&Math.abs(day-Math.round(day))<.0001)circle(left+m.drift*scale,448,9,gold);
 }
}
function annualYear(s,p){
 const day=p.day??0,a=day*360/YEAR,visible=p._snapshotVisible??1;
 line(850,72,850,475,'#476075');text('地球の公転（北極側から）',425,32,28);text('同じ時刻の星の位置：回転角の整理',1280,32,27);
 const cx=425,cy=245,r=137;circle(cx,cy,r,null,'#829eae');orb(cx,cy,36,gold);text('太陽',cx,303,24);
 for(let k=0;k<=36;k++){const q=k*10*D;circle(cx+r*Math.cos(q),cy-r*Math.sin(q),2.3,'#688292');}
 c.save();c.globalAlpha=visible;const ex=cx+r*Math.cos(a*D),ey=cy-r*Math.sin(a*D);half(ex,ey,20,Math.PI-a*D,blue);observer(ex+20*Math.cos(a*D),ey-20*Math.sin(a*D),.5,Math.PI/2-a*D);c.restore();
 arrow(cx,cy-r,cx-35,cy-r+4,blue,2);text(`約${Math.round(day)}日後　同じ0時`,425,443,32,gold);
 const x=1280,y=245,R=137;circle(x,y,R,null,'#829eae');observer(x,y+18,1.15,0,'#f4ead4');text('観測者の基準',x,y+53,21,muted);
 for(let k=0;k<36;k++){const q=k*10*D,xx=x+R*Math.sin(q),yy=y-R*Math.cos(q);circle(xx,yy,3,'#688292');if(k*10<a-.01)circle(xx,yy,4,'#a9bac580');}
 for(const [deg,label] of [[0,'0°／360°'],[90,'90°'],[180,'180°'],[270,'270°']]){const q=deg*D;text(label,x+(R+48)*Math.sin(q),y-(R+(deg===180?22:36))*Math.cos(q),23,muted);}
 c.save();c.globalAlpha=visible;circle(x+R*Math.sin(a*D),y-R*Math.cos(a*D),11,gold);c.restore();
 arrow(x+R*.72,y-R*.72,x+R*.86,y-R*.5,gold,2);
 text(day>=YEAR-.001?'一周して、ほぼ元の位置へ':`西向きのずれ　約${Math.round(a)}°`,1280,443,30,gold);
 text('毎日の自転を省略して、同じ時刻の位置だけを取り出す',856,482,21,muted);
}
function calendarDate(day){const n=Math.max(0,Math.min(365,Math.floor(day+1e-7))),dt=new Date(Date.UTC(2001,0,1+n)),month=dt.getUTCMonth(),date=dt.getUTCDate(),days=new Date(Date.UTC(2001,month+1,0)).getUTCDate();return{n,month,date,angle:n===365?360:month*30+(date-1)*30/days};}
function calendarPage(x,y,w,h,month,date=1,flip=0){
 c.fillStyle='#f4eedf';c.fillRect(x+5,y+7,w,h);c.fillStyle='#fffaf0';c.fillRect(x,y,w,h);
 c.fillStyle=red;c.fillRect(x,y,w,58);text(`${month%12+1}月`,x+w/2,y+30,35,'#fffaf0');
 for(const xx of [x+45,x+w-45])line(xx,y-12,xx,y+15,'#b9c9d3',8);
 text(String(date),x+w/2,y+135,95,'#253b4b');text('日',x+w/2,y+208,25,'#687782');
 if(flip>0){const lift=Math.sin(flip*Math.PI)*95;poly([[x,y+h],[x+w,y+h],[x+w,y+h-lift],[x+25,y+h-lift]],'#ded5c3');line(x+25,y+h-lift,x+w,y+h-lift,'#c2b89f',2);}
}
function annualCalendar(s,p,step){
 const cal=calendarDate(p.day??0),hour=p.hour??22,ha=cal.angle-calendarDate(s.baseDay??0).angle+(hour-(s.baseHour??22))*15;
 line(850,72,850,475,'#476075');text('観測する日',230,32,28);text('観測する時刻',615,32,28);text('同じ場所から、南の空を見る',1280,32,28);
 calendarPage(85,115,290,260,cal.month,cal.date,(p.day??0)%1);
 const x=615,y=244,r=112;circle(x,y,r,'#fffaf0','#b6a784');
 for(let k=0;k<60;k++){const a=k*6*D;line(x+(r-8)*Math.sin(a),y-(r-8)*Math.cos(a),x+(r-(k%5?13:22))*Math.sin(a),y-(r-(k%5?13:22))*Math.cos(a),'#75838b',k%5?1:3);}
 for(const k of [12,3,6,9])text(String(k),x+76*Math.sin(k*30*D),y-76*Math.cos(k*30*D),22,'#253b4b');
 const h=hour*30*D,m=hour*360*D;
 line(x,y,x+55*Math.sin(h),y-55*Math.cos(h),red,7);line(x,y,x+87*Math.sin(m),y-87*Math.cos(m),'#253b4b',4);circle(x,y,7,red);
 const mins=Math.round(hour*60);text(`${Math.floor(mins/60)}:${String(mins%60).padStart(2,'0')}`,615,405,42,gold);
 const elapsed=cal.n-(s.baseDay??0);text(s.baseDay!==undefined?(elapsed===0?'基準の日':`${Math.abs(elapsed)}日${elapsed<0?'前':'後'}`):cal.n===365?'翌年の1月1日':`${cal.n}日後`,230,423,31,gold);
 observerSky(1280,352,325,260,ha,0,[0],p._starsVisible??1,!!s.choicePositions);
 text(`薄い丸は、${s.baseLabel||'1月1日22時'}の位置`,1280,450,26,gold);
 text('昼も星の位置を表示',615,464,21,muted);
}
function annualExercise(s,p,step){
 text(s.question,856,25,28);text(s.choices,856,69,26,gold);
 c.save();c.translate(0,100);c.scale(1,.79);annualCalendar(s,p,step);c.restore();
}
function calendarYear(s,p){
 const month=Math.round(p.month??0);text('1月から、翌年の1月まで',525,35,30);text('地球の公転にかかる時間',1330,35,30);
 for(let k=0;k<12;k++){
  const x=95+(k%4)*220,y=105+Math.floor(k/4)*105,done=k<month,active=k===month;
  c.fillStyle=done?'#d9bc79':active?'#fffaf0':'#294255';c.fillRect(x,y,190,80);
  text(`${k+1}月`,x+95,y+41,33,done||active?'#253b4b':'#b9c9d3');
  if(active){c.strokeStyle=gold;c.lineWidth=4;c.strokeRect(x-3,y-3,196,86);}
 }
 text('1か月ずつ進める',525,462,27,muted);line(1020,80,1020,465,'#476075');
 c.save();c.globalAlpha=p._snapshotVisible??1;text(month===12?'翌年の1月':`${month+1}月`,1330,159,49,gold);c.restore();
 text(`${month}か月 経過`,1330,273,47);text(month===12?'12か月 ＝ 1年':'',1330,382,43,gold);
}
function annual(s,p,step){
 const a=p.a??s.a??0,view=p.view??a;line(505,70,505,430,'#476075');line(1080,70,1080,430,'#476075');
 text('地球の公転（北極側）',245,33,26);text('地球上の人を拡大',800,33,26);text('その人が南を向いた空',1398,33,26);
 circle(245,245,127,null,'#9caebc');orb(245,245,32,gold);text('太陽',245,302,24);
 const ex=245+127*Math.cos(a*D),ey=245-127*Math.sin(a*D);half(ex,ey,16,Math.PI-a*D,blue);
 observer(ex+16*Math.cos(view*D),ey-16*Math.sin(view*D),.37,Math.PI/2-view*D);
 arrow(245,118,216,121,blue,2);text('公転：反時計回り',245,407,22,muted);
 polarObserver(800,247,83,view,a);observerSky(1398,352,249,260,view,0,[0]);
 text(s.timechange&&step>=2?'観測時刻を早めた比較（地球は逆回転しない）':'同じ時刻の比較（途中の自転は省略）',525,467,23,muted);
 text(s.timechange&&step>=2?'約2時間早く見る':`南中からの回転角　約${Math.round(view)}°`,1398,454,25,gold);
}
function sunpath(s,p){let dec=p.dec??s.dec??0;const x0=100,x1=1120,y0=390; text('北緯35°の空を、東から西へ見渡す',605,32);text('南中高度と昼の長さ',1400,32);for(let alt of[0,30,60,90]){let y=y0-alt*3.15;line(x0,y,x1,y,'#dfded7');text(alt+'°',73,y,22,muted,'right');}text('高度',60,65,23);for(let az of[90,180,270]){let x=x0+(az-45)/270*(x1-x0);text({90:'東',180:'南',270:'西'}[az],x,435,27);}for(let dd of[-23.4,0,23.4]){c.strokeStyle=Math.abs(dd-dec)<.2?gold:'#c5cbd0';c.lineWidth=Math.abs(dd-dec)<.2?6:2;c.beginPath();let first=true;for(let h=-180;h<=180;h+=.5){let q=solar(dd,h);if(q.alt>=0){const x=x0+(q.az-45)/270*(x1-x0),y=y0-q.alt*3.15;first?c.moveTo(x,y):c.lineTo(x,y);first=false;}}c.stroke();}line(1180,75,1180,425,'#d8d3c8');let name=dec>10?'夏至':dec<-10?'冬至':'春分・秋分';text(name,1430,143,42);text((55+dec).toFixed(1)+'°',1430,240,66,red);text('昼　約'+dayLength(dec).toFixed(1)+'時間',1430,343,34);text('太陽の中心・大気差なし',1430,418,22,muted);text('北寄り',120,474,22,muted);text('北寄り',1100,474,22,muted);}
function shadow(s,p){let alt=55+(p.dec??23.4),x=780,y=365,h=170,shadow=h/Math.tan(alt*D);text('同じ場所・同じ高さの棒（北緯35°）',856,35);line(210,y,1460,y,'#a59c88',5);line(x,y,x,y-h,ink,10);line(x,y,x+shadow,y,'#51575e',12);let sx=x-220,sy=y-h-220*Math.tan(alt*D);sy=Math.max(92,sy);sx=x-(y-h-sy)/Math.tan(alt*D);orb(sx,sy,26,'#efbd57');arrow(sx+20,sy+20,x+shadow,y,gold,3);text('南',220,428);text('北',1450,428);text((p.dec??23.4)>0?'夏：南中高度78.4°':'冬：南中高度31.6°',856,465,33,red);}
function tilt(s,p){let a=p.a??0;const t=(1-Math.cos(a*D))/2,ex=1270-830*t; text('地軸は、ほぼ同じ方向を向いたまま',856,35);orb(855,250,58,'#efbd57');line(170,390,1550,390,'#b5b5ac',2,[7,7]);text('公転面',1450,433,24,muted);half(ex,250,95,ex>855?Math.PI:0);const dx=Math.sin(23.4*D)*135,dy=Math.cos(23.4*D)*135;line(ex-dx,250+dy,ex+dx,250-dy,ink,5);line(ex,120,ex,390,'#92989b',2,[5,5]);text('北極側',ex+dx,85,24);text('23.4°',ex+140,170,29,red);text('66.6°',ex-160,370,27,red);text('太陽',855,346,28);text(ex<855?'北半球は夏':'北半球は冬',856,465,35,red);for(let yy of[210,260,310])arrow(ex<855?760:950,yy,ex<855?ex+120:ex-120,yy,gold,2);}
function energy(s,p){let a=(p.angle??75)*D;split('同じ幅の光の束','地面に広がる幅');let x=390,y=375,L=250,w=70;let dx=Math.cos(a),dy=Math.sin(a),nx=-dy,ny=dx;let ox=x-L*dx,oy=y-L*dy;const left=x-w/2/dy,right=x+w/2/dy;poly([[ox+nx*w/2,oy+ny*w/2],[ox-nx*w/2,oy-ny*w/2],[right,y],[left,y]],'#efc26050');for(let k of[-1,0,1])arrow(ox+nx*w*k/2,oy+ny*w*k/2,x+w*k/2/dy,y,gold);line(150,y,740,y,ink,5);line(left,y+15,right,y+15,red,8);let ww=70/Math.sin(a);c.fillStyle='#dcb266';c.fillRect(1050,210,ww*3,100);text('光の量は同じ',1310,146,32);text('広がる面積を比べる',1310,376,29);text(Math.round(p.angle??75)+'°の光',440,460,34,red);text((p.angle??75)>60?'狭い面積に集中':'広い面積に分散',1310,460,34,red);}
function altitude(s,p){let a=55+(p.dec??s.dec??0);split('南の空の断面','北緯35°での南中高度');let x=380,y=390,r=280;line(x,y,x+340,y,ink,3);line(x,y,x,y-300,'#aaa',2,[5,5]);let xx=x+r*Math.cos(a*D),yy=y-r*Math.sin(a*D);arrow(x,y,xx,yy,gold,4);orb(xx,yy,20,'#efbd57');c.beginPath();c.arc(x,y,80,-a*D,0);c.strokeStyle=red;c.lineWidth=4;c.stroke();text('地平線',710,436,24);text('天頂 90°',350,57,24);text(a.toFixed(1)+'°',1310,220,85,red);text('90° − 35°'+((p.dec??s.dec??0)>0?' ＋ 23.4°':(p.dec??s.dec??0)<0?' − 23.4°':''),1310,336,33);}
function moon(s,p){let a=p.a??s.a??90;split('宇宙から見た位置関係（北極側）','地球から見た月（月の北が上）');circle(430,250,143,null,'#b4c1cd');half(430,250,37,0,blue);for(let y of[145,250,355])arrow(805,y,645,y,gold);text('太陽光',739,80,24,muted);let x=430+143*Math.cos(a*D),y=250-143*Math.sin(a*D);half(x,y,23,0,'#ece4cc');line(430,250,x,y,'#aab9c8',2,[6,7]);phase(1310,250,138,Math.sin(a*D),-Math.cos(a*D));text('地球',430,313,22);text('月は反時計回りに公転',430,465,24,muted);let aa=((a%360)+360)%360;let name=Math.abs(aa)<.5?'新月':Math.abs(aa-90)<.5?'上弦':Math.abs(aa-180)<.5?'満月':Math.abs(aa-270)<.5?'下弦':'明るい部分の見え方';text(name,1310,457,34,red);}
function phaseRow(){text('日がたつと、見える形が変わる',856,35);[45,90,180,270].forEach((a,i)=>{phase(260+400*i,250,100,Math.sin(a*D),-Math.cos(a*D));text(['細い月','半月','丸い月','半月'][i],260+400*i,435,30);});}
function lock(s,p){let a=(p.a??0)*D;split('月の公転と自転','赤い印が向く方向');circle(430,250,145,null,'#b4c1cd');orb(430,250,38);const x=430+145*Math.cos(a),y=250-145*Math.sin(a);orb(x,y,30,'#cbc9b8');let face=s.locked===false?Math.PI:Math.PI-a;circle(x+23*Math.cos(face),y+23*Math.sin(face),6,red);line(x,y,430,250,'#b7b2a6',2,[5,6]);orb(1310,250,125,'#cbc9b8');circle(1310+95*Math.cos(face),250+95*Math.sin(face),18,red);arrow(1310,250,1310+180*Math.cos(face),250+180*Math.sin(face),red);text('地球',430,319,22);text('月の自転 '+(s.locked===false?'なし':'あり'),1310,452,33);text('赤い点は、月面の同じ場所の目印',430,463,24,muted);}
function size(){text('直径の比を比べる',856,35);orb(600,250,150);orb(1110,250,150*3475/12742,'#c7c7bd');text('地球：約12,800 km',600,450,31);text('月：約3,500 km',1110,450,31);}
function distance(){let x=140,end=1550,scale=(end-x)/384400;orb(x,250,6371*scale);orb(end,250,1737.5*scale,'#cbc9b8');line(x,330,end,330,muted,2);for(let i=0;i<=30;i++){let xx=x+i*(end-x)/30;line(xx,324,xx,336,'#a6a69f');}text('地球',140,170,28);text('月',1550,170,28);text('中心間 約38万 km',856,80,36);text('地球の直径 約30個分',856,437,35,red);}
function moonTime(s,p){let a=p.a??s.a??180,ha=s.track?(p.hour??18)-24:(90-a)/15; // hours from transit, evening reference
if(!s.track)ha=(90-a)/15;let h=ha*15*D;stars(90,78,1532,330);line(130,390,1580,390,'#b7bec0',3);let x=856+620*Math.sin(h),y=385-230*Math.cos(h);phase(x,y,27,Math.sin(a*D),-Math.cos(a*D));text('東',170,445,29);text('南',856,445,29);text('西',1540,445,29);text(s.track?((p.hour??18)>=24?((p.hour??18)-24)+'時ごろ':(p.hour??18)+'時ごろ'):'日没ごろ',856,32,30);}
function moonShift(s,p){stars(90,75,1532,330);const shift=p.a??0;phase(1200-shift*10,245,36,1,0);circle(1200,245,42,null,'#d1c6a355');text('同じ時刻・同じ方向の星を基準にする',856,32);text('東',180,448,30);text('西',1520,448,30);text('月の公転による東向きの変化',856,465,29,red);}
function eclipse(s,p){const solar=s.solar!==false,off=p.offset??0;let x=[220,815,1410],y=250;orb(x[0],y,95,'#f0bd59');const rMid=solar?27:60,rEnd=solar?60:27;poly([[x[1],y-rMid],[x[1],y+rMid],[1560,y+7],[1560,y-7]],'#4e576a35');orb(x[1],y,rMid,solar?'#cac8bb':blue);orb(x[2],y+off,rEnd,solar?blue:'#cac8bb');if(!solar&&off===0){circle(x[2],y,27,'#713c33');}for(let i=0;i<3;i++)text(i===0?'太陽':i===1?(solar?'月':'地球'):(solar?'地球':'月'),x[i],425,32);text(solar?'月の影が、地球に届く':'地球の影と、月の位置',856,35,33);if(off>0)line(1040,340,1580,340,'#9c9e9b',2,[6,6]);text('距離と大きさを圧縮した模式図',856,477,23,muted);}
const planetNames=['水星','金星','地球','火星','木星','土星','天王星','海王星'],radii=[2440,6052,6371,3390,69911,58232,25362,24622],colors=['#9c9992','#d7ba83','#548fac','#c77652','#c9ad8b','#d6c496','#9cc6c4','#5b80b8'];
function planets(s,p,step){let ids=s.group==='inner'?[0,1,2,3]:s.group==='outer'?[4,5,6,7]:[0,1,2,3,4,5,6,7],n=ids.length,max=s.group==='inner'?6371:69911; text('惑星の直径の比較',856,35,32);ids.forEach((id,i)=>{let x=150+i*(1412/(n-1)),r=radii[id]/max*(n===4?115:85);if(id===5){c.beginPath();c.ellipse(x,250,r*1.6,r*.3,-.3,0,Math.PI*2);c.strokeStyle='#b4a986';c.lineWidth=9;c.stroke();}orb(x,250,r,colors[id]);if(s.group||step>=(id<4?1:2)||s.kind==='cover')text(planetNames[id],x,440,n===4?33:27);});}
function orbits(s,p){text('北極側から見た太陽系（軌道間隔は模式的）',856,35,29);orb(800,250,35,'#efbd57');for(let i=0;i<8;i++){const rx=90+i*85,ry=22+i*20;c.beginPath();c.ellipse(800,250,rx,ry,0,0,Math.PI*2);c.strokeStyle='#c3cbd1';c.lineWidth=1.5;c.stroke();let a=(i*47+30)*D;orb(800+rx*Math.cos(a),250+ry*Math.sin(a),i<4?8:13,colors[i]);}if(s.belt)for(let i=0;i<130;i++){let a=i*2.4;circle(800+(375+i%23)*Math.cos(a),250+(85+i%11)*Math.sin(a),1.8,'#b3976b');}text('太陽',800,465,29);}
function solarDistance(){text('太陽からの平均距離（地球までを1）',856,35,31);let a=150,b=1530;line(a,240,b,240,'#aaa89f',3);orb(a,240,24,'#edbd63');for(let[v,name]of[[1,'地球'],[5.2,'木星'],[30.1,'海王星']]){let x=a+v/30.1*(b-a);orb(x,240,9,blue);let yy=name==='地球'?130:name==='木星'?345:130;line(x,yy+25,x,220,'#b4b8b8',2);text(name,x,yy,27);text(v===1?'1':v===5.2?'約5':'約30',x,yy+(yy>200?50:-50),35,red);}text('太陽',a,340,26);text('1目盛り ＝ 地球までの平均距離',856,461,26,muted);for(let i=0;i<=30;i++)line(a+i*(b-a)/30.1,255,a+i*(b-a)/30.1,263,'#a9aa9f');}
function comet(s,p){let a=(p.a??0)*D;orb(550,250,48,'#edbd63');const x=820+360*Math.cos(a),y=250-115*Math.sin(a),dx=x-550,dy=y-250,len=Math.hypot(dx,dy);poly([[x-dy/len*12,y+dx/len*12],[x+dy/len*12,y-dx/len*12],[x+dx/len*110,y+dy/len*110]],'#91c4cf55');orb(x,y,14,'#c4d8d3');text('太陽',550,430,29);text('尾は、おおむね太陽と反対側',856,35,32);text('彗星の位置を動かして、尾の向きを比べる',856,473,26,muted);}
function venus(s,p){let a=p.a??s.a??-90,q=venusMetrics(a),cx=440,cy=250,scale=165;split('地球を右に固定した相対図（北極側）','地球からの像（同じ倍率）');circle(cx,cy,scale,null,'#bac5cd');circle(cx,cy,.72*scale,null,'#c4cbd0');orb(cx,cy,27,'#edbd63');orb(cx+scale,cy,18);const x=cx+q.vx*scale,y=cy-q.vy*scale;half(x,y,17,Math.atan2(cy-y,cx-x),'#e8ce8c');line(cx+scale,cy,x,y,'#809caf',2,[5,6]);line(cx+scale,cy,cx,cy,'#d2b66d',2,[5,6]);text('地球',cx+scale+80,cy,23);phase(1300,250,48/q.distance,q.sx,q.sz);text(a<0?'太陽の東側：夕方に見える':'太陽の西側：明け方に見える',440,465,27);text('地球からの距離　'+q.distance.toFixed(2),1300,428,27);const elong=Math.atan2(Math.abs(q.vy),1-q.vx)/D;text('太陽との離れ角　約'+Math.round(elong)+'°（最大約46°）',1300,477,22,muted);}
function venusCompare(){text('同じ倍率の望遠鏡で比べる',856,35,31);[-150,-25].forEach((a,i)=>{let q=venusMetrics(a),x=470+i*790;phase(x,240,58/q.distance,q.sx,q.sz);text(i?'近い金星':'遠い金星',x,438,33);});}
function venusSky(s,p){let morning=(p.morning??0)>.5;stars(100,80,1512,325,s.night?130:20);let g=c.createLinearGradient(0,250,0,405);g.addColorStop(0,'#c9977800');g.addColorStop(1,s.night?'#263851':'#dfa17d');c.fillStyle=g;c.fillRect(100,80,1512,325);line(100,405,1612,405,'#a8a5a0',3);if(!s.night){circle(morning?620:1100,240,7,'#fff4ce');line(morning?605:1085,240,morning?635:1115,240,'#fff4ce',2);}text(s.night?'真夜中：金星は見えない':morning?'明け方の東の空':'夕方の西の空',856,35,33);text(s.night?'太陽と反対側の空':morning?'太陽が昇る前':'太陽が沈んだあと',856,464,30);}
function photo(s){let img=images[s.image||'moon'];c.fillStyle=s.image==='moon'?'#000':'#080d15';c.fillRect(0,0,W,H);if(img?.complete&&img.naturalWidth){let h=s.image==='moon'?590:490,w=h*img.naturalWidth/img.naturalHeight;c.drawImage(img,(W-w)/2,(H-h)/2-24,w,h);}}
function starfield(s){stars(0,0,W,H,s.cluster?700:250);if(s.cluster)for(let i=0;i<400;i++){const a=i*2.399,r=Math.sqrt(i)*6;circle(856+r*Math.cos(a),250+r*Math.sin(a),i%6?1:2,'#ebe4cf');}text(s.cluster?'恒星の集まりの模式図':'夜空の恒星の模式図',856,461,26,'#d3d9df');}
function galaxyDisk(s){split('円盤を上から見た模式図','円盤を横から見た模式図');c.beginPath();c.ellipse(445,250,265,150,0,0,Math.PI*2);c.fillStyle='#c5cdd255';c.fill();circle(445,250,35,'#ddbe86');const x=590;circle(x,250,7,red);line(x,265,x,378,red,2);text('太陽系',x,412,26,red);c.beginPath();c.ellipse(1310,250,275,26,0,0,Math.PI*2);c.fillStyle='#b8c7d0';c.fill();c.beginPath();c.ellipse(1310,250,45,55,0,0,Math.PI*2);c.fillStyle='#ddbe86';c.fill();circle(1460,250,7,red);line(1460,270,1460,380,red,2);text('太陽系',1460,412,26,red);if(s.inside){arrow(1460,250,1130,250,red);arrow(1460,250,1460,95,blue);text('円盤に沿う方向に、多くの星',856,474,28,red);}else text('円盤の直径は、代表的な目安で約10万光年',856,474,27,muted);}
function galaxies(){stars(0,0,W,H,100);for(let i=0;i<8;i++){let x=180+i%4*450,y=140+Math.floor(i/4)*220;c.save();c.translate(x,y);c.rotate(i*.4);const g=c.createRadialGradient(0,0,1,0,0,70);g.addColorStop(0,'#ffedc5');g.addColorStop(.35,'#c6d2df88');g.addColorStop(1,'#c6d2df00');c.scale(1,.5);circle(0,0,70,g);c.restore();}text('銀河が広がる宇宙の模式図',856,474,27,'#e0e2e5');}
function hierarchy(s,p,step){let labels=['地球','太陽系','銀河系','宇宙'];labels.forEach((t,i)=>{let x=260+i*400;circle(x,235,85,['#548fac','#d2b46e','#9caeb9','#46556a'][i]);text(t,x,386,34);if(i<3)arrow(x+108,235,x+280,235,'#aa9b7d');});text('それぞれが、より大きな広がりの中にある',856,45,31);}
function compare(s,p,step){let rows=s.rows||[],n=rows.length;for(let i=0;i<n;i++){let y=135+i*(n===3?125:205);if(i)line(100,y-60,1610,y-60,'#d6d2c8');rows[i].forEach((t,j)=>text(t,[310,820,1320][j],y,j===0?35:33,j===0?ink:muted));}text('対応する量・性質を、横にそろえて比べる',856,471,24,muted);}
function ratio(s,p,step){let left=s.left,right=s.right,u=s.unit,n=s.amount,base=s.base??1;text('単位量の対応',856,40,30);let col=[540,1170];text(base+' '+left,col[0],150,57);text('…',856,150,45,muted);text(u+' '+right,col[1],150,57);if(step>=2){text('× '+n,col[0]-185,258,38,red);text('× '+n,col[1]+240,258,38,red);arrow(col[0],198,col[0],290,red);arrow(col[1],198,col[1],290,red);}if(step>=3){text(base*n+' '+left,col[0],356,57,red);text('…',856,356,45,muted);text(u*n+' '+right,col[1],356,57,red);}else text('？',856,356,65,muted);text('左も右も、同じ倍数',856,470,30);}
function lightyear(s,p,step){text('光が進む時間と距離',856,38,30);line(200,240,1510,240,gold,7);arrow(200,240,1510,240,gold,7);text('出発',200,150,30);text('1年後',1510,150,30);text(step>=3?'1光年 ＝ 約9兆4600億 km':'光が1年間に進む距離',856,360,48,step>=3?red:ink);}
const scenes={annual,annualCycle,annualYear,sunpath,shadow,tilt,energy,altitude,moon,phaseRow,lock,size,distance,moonTime,moonShift,eclipse,planets,orbits,solarDistance,comet,venus,venusCompare,venusSky,photo,starfield,galaxyDisk,galaxies,hierarchy,compare,ratio,lightyear,memory:()=>{}};
function seasonShadow(s,p,step){
 const img=images['shadow-seasons-v2'];text('夏の南中時',460,30,31);text('冬の南中時',1250,30,31);
 if(img?.naturalWidth){for(let k=0;k<2;k++)c.drawImage(img,k*img.width/2,img.height*.10,img.width/2,img.height*.75,245+k*790,60,430,430);}
 text('同じ高さの棒',856,220,25,muted);text('同じ場所',856,275,25,muted);
}
function seasonOrbit(s,p,step){
 if(s.polarSpin&&step>=3){polarDay(s,p);return;}
 const img=images['orbit-seasons-v2'];if(img?.naturalWidth)c.drawImage(img,145,14,706,471);
 text('夏至',90,223,28,gold);text('冬至',921,223,28,blue);text('春分',493,25,26);text('秋分',493,478,26);
 line(1020,65,1020,440,'#476075');text('地軸は、同じ方向を向いたまま',1360,48,28);
 if(s.title!=='地軸の傾き'){
  const summer=(p.a??180)>90;circle(summer?217:770,223,62,null,gold);
  if(s.title.includes('距離')){text('夏と冬を、同じ公転軌道で比べる',1350,165,28);text('太陽との距離だけでは',1350,245,33);text('季節を説明できない',1350,303,33,gold);text('地軸の傾きと、太陽に対する向き',1350,415,25,muted);}
  else{text(summer?'北半球の夏':'北半球の冬',1350,165,43,gold);text(summer?'北極側が太陽の方へ傾く':'北極側が太陽と反対へ傾く',1350,265,30);text(summer?'南半球は冬':'南半球は夏',1350,374,34,blue);}
  return;
 }
 const x=1290,y=330;line(1120,y,1590,y,'#a4b4c1',3);line(x,95,x,y,'#a4b4c1',2,[6,6]);
 arrow(x-38,y+85,x+95,110,blue,5);text('公転面',1515,369,24,muted);text('垂直な方向',1190,103,23,muted);
 text('23.4°',1430,157,38,gold);text('66.6°',1460,284,34,gold);
 text('北半球の季節を示す',1350,450,25,muted);
}
function seasonDomeOld(s,p){
 const hour=p.hour??6;const names=['夏至','春分・秋分','冬至'],decs=[23.4,0,-23.4],cols=[gold,'#b7dccd',blue];
 const minutes=Math.round(hour*60);text(`同じ時刻で比較　${Math.floor(minutes/60)}時${String(minutes%60).padStart(2,'0')}分`,856,29,29);
 for(let k=0;k<3;k++){
  const cx=292+k*565,cy=332,R=205,col=cols[k];text(names[k],cx,78,31,col);
  const project=(e,n,u)=>[cx+R*(e*.93+n*.22),cy-R*(u*.89+n*.30)];
  const path=(points,color,width=1)=>{c.beginPath();points.forEach((p,i)=>{const q=project(...p);i?c.lineTo(...q):c.moveTo(...q);});c.strokeStyle=color;c.lineWidth=width;c.stroke();};
  const ground=[];for(let a=0;a<=360;a+=3)ground.push([Math.cos(a*D),Math.sin(a*D),0]);
  c.beginPath();ground.forEach((p,i)=>{const q=project(...p);i?c.lineTo(...q):c.moveTo(...q);});c.closePath();c.fillStyle='#42646b55';c.fill();path(ground,'#a2bec7',2);
  for(const az of [0,45,90,135]){const pts=[];for(let a=0;a<=180;a+=3)pts.push([Math.cos(a*D)*Math.cos(az*D),Math.cos(a*D)*Math.sin(az*D),Math.sin(a*D)]);path(pts,'#a3c6db30');}
  for(const elev of [30,60]){const pts=[];for(let a=0;a<=360;a+=3)pts.push([Math.cos(elev*D)*Math.cos(a*D),Math.cos(elev*D)*Math.sin(a*D),Math.sin(elev*D)]);path(pts,'#a3c6db30');}
  const position=h=>{const d=decs[k]*D,a=h*D,l=35*D;return[-Math.cos(d)*Math.sin(a),Math.sin(d)*Math.cos(l)-Math.cos(d)*Math.cos(a)*Math.sin(l),Math.sin(d)*Math.sin(l)+Math.cos(d)*Math.cos(a)*Math.cos(l)];};
  const arc=[];for(let h=-180;h<=180;h++) {const q=position(h);if(q[2]>=0)arc.push(q);}path(arc,col,4);
  const q=position((hour-12)*15);if(q[2]>=0){const pt=project(...q);orb(...pt,12,'#ffe4a4');}
  observer(cx,cy,0.65,0,'#fff2d5');
  for(const [name,e,n] of [['東',1,0],['西',-1,0],['北',0,1],['南',0,-1]]){const pt=project(e*1.14,n*1.14,0);text(name,pt[0],pt[1]+12,21,muted);}
  text(q[2]<0?'太陽は地平線の下':`太陽の高度　約${Math.round(Math.asin(q[2])/D)}°`,cx,457,26,col);
 }
}
function seasonDome(s,p,step=0){
 const hour=p.hour??6,mins=Math.round(hour*60),cx=650,cy=360,R=360;
 const project=(e,n,u)=>[cx+R*n,cy+R*(e*.18-u*.76)];
 const stroke=(pts,col,width=2,dash=[])=>{c.beginPath();pts.forEach((v,i)=>{const q=project(...v);i?c.lineTo(...q):c.moveTo(...q);});c.strokeStyle=col;c.lineWidth=width;c.setLineDash(dash);c.stroke();c.setLineDash([]);};
 text('東側から天球を見る',650,29,29);text(`${Math.floor(mins/60)}時${String(mins%60).padStart(2,'0')}分`,1350,39,34,gold);
 const horizon=[];for(let a=0;a<=360;a+=2)horizon.push([Math.sin(a*D),Math.cos(a*D),0]);stroke(horizon,'#bacbd0',2);
 const rim=[];for(let a=0;a<=180;a+=2)rim.push([0,-Math.cos(a*D),Math.sin(a*D)]);stroke(rim,'#bacbd0',2);
 observer(cx,cy,1.05,0,'#fff0ce');
 for(const [name,e,n] of [['南',0,-1.13],['北',0,1.13],['東',1.32,0],['西',-1.25,0]]){const q=project(e,n,0);text(name,...q,27);}
 const decs=[-23.4,0,23.4],cols=[blue,'#cfe3d6',gold],names=['冬至','春分・秋分','夏至'];
 for(let k=0;k<3;k++){
  const pos=h=>{const a=h*D,d=decs[k]*D,l=35*D;return[-Math.cos(d)*Math.sin(a),Math.sin(d)*Math.cos(l)-Math.cos(d)*Math.cos(a)*Math.sin(l),Math.sin(d)*Math.sin(l)+Math.cos(d)*Math.cos(a)*Math.cos(l)];};
  const am=[],pm=[];for(let h=-180;h<=180;h++){const q=pos(h);if(q[2]>=0)(h<=0?am:pm).push(q);}stroke(pm,cols[k],2,[5,6]);stroke(am,cols[k],4);
  if(s.focus==='endpoints'&&k===[-1,2,1,0][step]){for(const h of [-1,1]){const a=h*Math.acos(-Math.tan(35*D)*Math.tan(decs[k]*D))/D,pt=project(...pos(a));circle(...pt,13,null,gold);circle(...pt,5,gold);}}
  const peak=project(...pos(0));text(names[k],peak[0]-25,peak[1]-27,26,cols[k]);
  const q=pos((hour-12)*15);if(q[2]>=0&&s.focus!=='endpoints')orb(...project(...q),11,'#ffe4a4');
 }
 text('午前は手前、午後は奥の軌道',650,479,24,muted);
 line(1120,85,1120,442,'#476075');
 if(s.focus==='dayLength'){for(let k=0;k<3;k++){const len=dayLength(decs[k]),y=150+k*112,left=1200,width=440;text(names[k],1400,y-32,25,cols[k]);line(left,y,left+width,y,'#425565',12);line(left+(12-len/2)/24*width,y,left+(12+len/2)/24*width,y,cols[k],12);circle(left+hour/24*width,y,8,'#fff3d0');text(`昼 約${len.toFixed(1)}時間`,1400,y+35,24,cols[k]);}text('0時',1200,478,20,muted);text('24時',1640,478,20,muted);return;}
 if(s.focus==='endpoints'){text('地平線との交点に注目',1400,142,30,gold);text(step===1?'夏至：北寄り':step===2?'春秋分：真東・真西':step===3?'冬至：南寄り':'まず東と西の位置を確認',1400,245,29);text('丸枠が、昇る位置・沈む位置',1400,361,25,muted);return;}
 text('3つの季節を、同じ時刻で比較',1400,132,28);text('左が南、右が北',1400,214,29);text('夏は高く、冬は低い',1400,296,29,gold);text('地平線に届く位置も違う',1400,377,26,muted);
}
function polarDay(s,p){
 const spin=p.spin??0;const axis=[Math.sin(23.4*D),Math.sqrt(Math.cos(23.4*D)**2-.25**2),.25],L=Math.hypot(axis[0],axis[1]),u=[axis[1]/L,-axis[0]/L,0],v=[-axis[2]*u[1],axis[2]*u[0],axis[0]*u[1]-axis[1]*u[0]];
 const point=(lat,lon)=>axis.map((a,i)=>a*Math.sin(lat*D)+Math.cos(lat*D)*(u[i]*Math.cos(lon*D)+v[i]*Math.sin(lon*D)));
 window.SeedPolarState={spin,north:axis,marker:point(80,spin)};
 text('地軸のまわりを自転しても、北極の昼夜は変わらない',856,29,31);
 orb(856,245,42,gold);text('太陽',856,320,26,gold);
 for(let k=0;k<2;k++){
  const x=k?1260:450,y=258,r=144,dir=k?-1:1;
  orb(x,y,r,'#4c96b3');c.save();c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.clip();
  const g=c.createLinearGradient(x-r,y,x+r,y);g.addColorStop(0,k?'#020a1408':'#020a14f0');g.addColorStop(.49,k?'#020a1410':'#020a14ec');g.addColorStop(.51,k?'#020a14ec':'#020a1410');g.addColorStop(1,k?'#020a14f0':'#020a1408');c.fillStyle=g;c.fillRect(x-r,y-r,r*2,r*2);
  const draw=pts=>{c.beginPath();let first=true;for(const q of pts){if(q[2]<0){first=true;continue;}const xx=x+r*q[0],yy=y-r*q[1];first?c.moveTo(xx,yy):c.lineTo(xx,yy);first=false;}c.strokeStyle='#d2eaf27a';c.lineWidth=1.5;c.stroke();};
  for(let lat=-60;lat<=80;lat+=20){const pts=[];for(let lon=0;lon<=360;lon+=3)pts.push(point(lat,lon+spin));draw(pts);}
  for(let lon=0;lon<360;lon+=30){const pts=[];for(let lat=-90;lat<=90;lat+=3)pts.push(point(lat,lon+spin));draw(pts);}
  const mark=point(80,spin);if(mark[2]>0)circle(x+r*mark[0],y-r*mark[1],6,red);
  c.restore();line(x-axis[0]*r*1.2,y+axis[1]*r*1.2,x+axis[0]*r*1.2,y-axis[1]*r*1.2,'#d2eaf2',3);
  circle(x+axis[0]*r,y-axis[1]*r,7,gold);text('北極',x+axis[0]*r+62,y-axis[1]*r,24,gold);
  for(let dy of [-32,0,32])arrow(856+dir*-70,y+dy,x+dir*175,y+dy,gold,2);
  text(k?'冬至：北極は一日中夜':'夏至：北極は一日中昼',x,76,30,k?blue:gold);
  text(k?'極夜':'白夜',x,454,34,k?blue:gold);
 }
 text(`自転 ${Math.round(spin/360*24)}時間／24時間`,856,408,25);text('赤い印：北緯80°の地点',856,478,22,muted);
}
function altitudeReason(s,p,step){
 const dec=p.dec??s.dec??0,alt=55+dec,cx=363,cy=300,r=135,l=35*D;
 text('地球の断面と、北緯35°の人',425,30,28);text('その人の空を、横から拡大',1300,30,28);line(850,75,850,470,'#476075');
 orb(cx,cy,r,blue);line(cx-180,cy,cx+190,cy,'#bcd5dc',2,[6,6]);text('赤道',cx-180,cy+34,24,muted);
 const px=cx+r*Math.cos(l),py=cy-r*Math.sin(l);line(cx,cy,cx+(r+95)*Math.cos(l),cy-(r+95)*Math.sin(l),gold,3);observer(px,py,.65,Math.PI/2-l,'#fff4d5');
 line(px-80*Math.sin(l),py-80*Math.cos(l),px+90*Math.sin(l),py+90*Math.cos(l),'#e2d6bf',4);
 text('天頂の方向',615,99,25,gold);text('地平線',650,313,25,muted);
 c.beginPath();c.arc(cx,cy,67,-l,0);c.strokeStyle=gold;c.lineWidth=3;c.stroke();text('35°',cx+96,cy-27,26,gold);
 if(s.mode==='equinox'){line(px,py,px+130,py,'#82bacf',2,[5,5]);c.beginPath();c.arc(px,py,52,-l,0);c.strokeStyle=blue;c.lineWidth=3;c.stroke();text('35°',px+79,py-17,23,blue);}
 if(s.mode!=='latitude'){for(const offset of [-32,0,32])arrow(px+250*Math.cos(dec*D)+offset*Math.sin(dec*D),py-250*Math.sin(dec*D)+offset*Math.cos(dec*D),px+115*Math.cos(dec*D)+offset*Math.sin(dec*D),py-115*Math.sin(dec*D)+offset*Math.cos(dec*D),gold,2);text(dec>1?'赤道より23.4°北からの光':dec<-1?'赤道より23.4°南からの光':'赤道面に平行な太陽光',620,453,23,muted);}
 const x=1410,y=385,ray=270;line(x-425,y,x+125,y,'#c5d1d6',3);line(x,y,x,y-295,'#bcd5dc',2,[6,6]);observer(x,y,.72,0,'#fff4d5');text('天頂',x,65,25);text('南の地平線',1080,432,24,muted);
 if(s.mode==='latitude'){text('中心で測る35°が緯度',1320,165,32,gold);text('地平線は足元の地面の向き',1320,245,26);line(x-25,y,x-25,y-25,blue,3);line(x-25,y-25,x,y-25,blue,3);text('地平線から天頂まで90°',1300,478,29,gold);return;}
 line(x,y,x-ray*Math.cos(55*D),y-ray*Math.sin(55*D),'#a9baca55',3,[6,6]);
 arrow(x,y,x-ray*Math.cos(alt*D),y-ray*Math.sin(alt*D),gold,4);orb(x-ray*Math.cos(alt*D),y-ray*Math.sin(alt*D),12,gold);
 c.beginPath();c.arc(x,y,80,-Math.PI+alt*D,-Math.PI/2);c.strokeStyle=blue;c.lineWidth=4;c.stroke();
 c.beginPath();c.arc(x,y,114,-Math.PI,-Math.PI+alt*D);c.strokeStyle=gold;c.lineWidth=3;c.stroke();text('高度',1210,350,25,gold);
 text(s.mode==='complement'?'真上まで90°':`天頂との差 ${Math.round((90-alt)*10)/10}°`,1135,109,27,blue);
 text(step>=3?(s.mode==='complement'?'2つの角度を合わせると90°':`${dec>1?'55° ＋ 23.4°':dec<-1?'55° − 23.4°':'90° − 35°'} ＝ ${alt.toFixed(1)}°`):'地平線から太陽までが、高度',1300,478,27,step>=3?gold:muted);
}
function untiltedOrbit(s,p){
 text('仮想の地球：地軸の傾き0°',490,35,31);const a=(p.a??0)*D,cx=490,cy=255;
 c.beginPath();c.ellipse(cx,cy,295,133,0,0,Math.PI*2);c.strokeStyle='#8ca6b9';c.lineWidth=2;c.stroke();orb(cx,cy,40,gold);
 const x=cx+295*Math.cos(a),y=cy+133*Math.sin(a);orb(x,y,45,blue);line(x,y-80,x,y+80,'#ecf3ef',3);line(x-43,y,x+43,y,gold,3);text('太陽',cx,330,25,gold);
 line(920,80,920,450,'#476075');text('どの公転位置でも',1320,94,32);text('赤道面に沿って光が届く',1320,174,30,gold);text('北緯35°の南中高度：55°',1320,285,32);text('昼の長さ：12時間',1320,375,32);text('実際の地球との比較用モデル',856,479,23,muted);
}
function axisBridge(s,p,step){
 const a=(p.tilt??0)*D,x=520,y=268,r=142;orb(x,y,r,blue);
 line(140,y,875,y,'#c5ced4',2,[7,7]);line(x,60,x,458,'#c5ced4',2,[7,7]);
 line(x-190*Math.sin(a),y+190*Math.cos(a),x+190*Math.sin(a),y-190*Math.cos(a),gold,5);
 if(step>=1)line(x-225*Math.cos(a),y-225*Math.sin(a),x+225*Math.cos(a),y+225*Math.sin(a),red,5);
 text('公転面',180,y+35,25,muted);text('公転面に垂直',350,52,25,muted);text('地軸',760,85,29,gold);
 if(step>=2){c.beginPath();c.arc(x,y,165,-Math.PI/2,-Math.PI/2+a);c.strokeStyle=gold;c.lineWidth=3;c.stroke();c.beginPath();c.arc(x,y,195,0,a);c.strokeStyle=red;c.lineWidth=3;c.stroke();}
 line(970,75,970,443,'#476075');text('地軸と赤道面は、いつも直角',1325,95,31);
 text(step>=1?'赤い線：赤道面':'まず地軸を見る',1325,190,30,red);
 if(step>=2){text(`地軸の傾き　${(a/D).toFixed(1)}°`,1325,295,34,gold);text(`赤道面の傾き　${(a/D).toFixed(1)}°`,1325,390,34,red);}
 text('直角の組を、一緒に傾けて確かめる',520,479,25,muted);
}
function declinationBridge(s,p,step){
 const names=['春分・秋分','夏至','冬至'],ds=[0,23.4,-23.4];text('公転図から、太陽と地軸を含む断面を取り出す',856,30,30);
 for(let k=0;k<3;k++){const x=280+k*560,y=265,r=100,a=ds[k]*D,shown=k<=Math.max(0,step-1);c.save();c.globalAlpha=shown?1:.18;
  text(names[k],x,85,31);orb(x,y,r,blue);line(x-135*Math.sin(a),y+135*Math.cos(a),x+135*Math.sin(a),y-135*Math.cos(a),gold,3);line(x-145*Math.cos(a),y-145*Math.sin(a),x+145*Math.cos(a),y+145*Math.sin(a),red,4);
  for(const dy of [-25,0,25])arrow(x+220,y+dy,x+155,y+dy,gold,2);
  line(x,y,x+145,y,'#d4e5ea',2,[4,5]);c.beginPath();c.arc(x,y,120,Math.min(0,a),Math.max(0,a));c.strokeStyle='#e4bd70';c.lineWidth=3;c.stroke();
  text(k===0?'赤道面に沿う：0°':k===1?'北側へ23.4°':'南側へ23.4°',x,438,29,gold);c.restore();
 }
 text('赤い線は赤道面。各断面は、太陽が右になるよう向きをそろえた図',856,483,23,muted);
}
function altitudePractice(s,p,step){
 const second=step>=3,lat=second?40:35,alt=90-lat+(second?23.4:0),answer=step===2||step===4,x=920,y=382;
 text(second?'② 北緯40°・夏至':'① 北緯35°・春分',856,37,34);line(370,y,1320,y,'#b8cbd4',3);line(x,y,x,100,'#b8cbd4',2,[6,6]);observer(x,y,1.15,0,'#fff1d0');
 arrow(x,y,x-290*Math.cos(alt*D),y-290*Math.sin(alt*D),gold,4);orb(x-290*Math.cos(alt*D),y-290*Math.sin(alt*D),15,gold);text('天頂',x,73,26);text('南の地平線',425,430,26);
 c.beginPath();c.arc(x,y,120,-Math.PI,-Math.PI+alt*D);c.strokeStyle=gold;c.lineWidth=4;c.stroke();text(answer?`${alt.toFixed(1)}°`:'高度は？',650,327,38,gold);
 text(answer?(second?'基準50°に、23.4°を足す':'90°から、北緯35°を引く'):'求める角度を指してから、式を考えよう',856,480,28);
}
function energyArea(s,p){
 const a=(p.angle??75)*D,x=440,y=345,w=180,len=w/Math.sin(a),sourceX=x-210*Math.cos(a),sourceY=y-210*Math.sin(a);
 text('同じ量の光を、傾けて比べる',450,32,29);text('赤枠の地面が受け取る光',1325,32,29);
 poly([[sourceX-w/2*Math.sin(a),sourceY+w/2*Math.cos(a)],[sourceX+w/2*Math.sin(a),sourceY-w/2*Math.cos(a)],[x+len/2,y],[x-len/2,y]],'#e4bd7040');
 for(let k=-4;k<=4;k++){const off=k*w/8;arrow(sourceX-off*Math.sin(a),sourceY+off*Math.cos(a),x-off/Math.sin(a),y,gold,2);}
 line(140,y,780,y,'#acbdc4',3);c.strokeStyle=red;c.lineWidth=4;c.strokeRect(x-70,y-7,140,25);text('赤枠の幅は固定',440,405,27,red);text(`太陽の高度 ${Math.round(a/D)}°`,440,467,26,muted);
 line(930,75,930,440,'#476075');text('同じ面積',1325,139,32);c.strokeStyle=red;c.lineWidth=4;c.strokeRect(1100,185,450,125);
 c.fillStyle=`rgba(228,189,112,${Math.sin(a)*.8})`;c.fillRect(1103,188,444,119);
 text(`受け取る光の相対量　${Math.round(Math.sin(a)*100)}`,1325,365,30,gold);text('真上からの光を100とした比較',1325,420,23,muted);text('光の総量は同じ。広がる面積が違う。',1325,476,25);
}
function seasonSummary(s,p,step){
 text('北半球の夏',430,40,34,gold);text('同じ地球の、南半球は冬',1280,40,34,blue);
 if(step>=1){text('高い太陽',430,175,42,gold);text('低い太陽',1280,175,42,blue);text('同じ面積に、多くの光',430,248,29);text('同じ面積に、少ない光',1280,248,29);}
 if(step>=2){text('長い昼',430,350,42,gold);text('短い昼',1280,350,42,blue);}
 line(856,100,856,420,'#476075');text(step>=3?'同じ地球で季節が逆になる。距離だけでは説明できない。':'太陽の高さと、光が当たる時間を合わせて考える',856,478,28);
}
Object.assign(scenes,{annualCalendar,calendarYear,annualExercise,seasonShadow,seasonOrbit,seasonDome,altitudeReason,untiltedOrbit,axisBridge,declinationBridge,altitudePractice,energyArea,seasonSummary});
const lightScenes=new Set(['compare','ratio','size','distance','solarDistance','altitude','energy','lightyear']);
function render(canvas,s,p,step){c=canvas.getContext('2d');c.clearRect(0,0,W,H);const light=lightScenes.has(s.scene);ink=light?'#292c30':'#f5f0e5';muted=light?'#6f716e':'#b9c9d3';const bg=c.createLinearGradient(0,0,W,H);if(light){bg.addColorStop(0,'#fbfaf7');bg.addColorStop(1,'#e8eef1');}else{bg.addColorStop(0,'#071b30');bg.addColorStop(.6,'#102a43');bg.addColorStop(1,'#061223');}c.fillStyle=bg;c.fillRect(0,0,W,H);bounds=[];if(!scenes[s.scene])throw Error('Unknown scene '+s.scene);scenes[s.scene](s,p,step);window.SeedDiagramBounds=bounds;}
return{ready,render,moonFraction,venusMetrics,solar,dayLength,annualMetrics};})();
