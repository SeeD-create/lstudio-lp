/* SeeD original educational models. Angles are degrees; East/North/Up coordinates. */
(()=>{
const D=Math.PI/180,TAU=2*Math.PI,ink='#dce8f1',muted='#8ea7bb',gold='#f3c977',blue='#79bedc';
const sin=x=>Math.sin(x*D),cos=x=>Math.cos(x*D);
function horizontal(H,dec,lat=35){return {e:-cos(dec)*sin(H),n:sin(dec)*cos(lat)-cos(dec)*cos(H)*sin(lat),u:sin(dec)*sin(lat)+cos(dec)*cos(H)*cos(lat)}}
function solarAltitude(hour,dec=0,lat=35){return Math.asin(horizontal((hour-12)*15,dec,lat).u)/D}
function dayLength(dec,lat=35){return 2*Math.acos(-Math.tan(lat*D)*Math.tan(dec*D))/D/15}
function seed(n){let a=Math.sin(n*127.1+311.7)*43758.5453;return a-Math.floor(a)}
const stars=Array.from({length:220},(_,i)=>({H:seed(i+1)*360,dec:Math.asin(seed(i+442)*2-1)/D,r:.7+seed(i+102)*1.65}));
function text(c,t,x,y,size=24,color=ink,align='left'){size=Math.round(size*1.18);c.font=`${size>=40?'600':'400'} ${size}px "Zen Kaku Gothic New",sans-serif`;c.fillStyle=color;c.textAlign=align;c.textBaseline='middle';c.fillText(t,x,y)}
function line(c,pts,color=muted,width=1,dash=[]){if(!pts.length)return;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=color;c.lineWidth=width;c.setLineDash(dash);c.stroke();c.setLineDash([])}
function arrow(c,a,b,color=gold,width=2){line(c,[a,b],color,width);let t=Math.atan2(b[1]-a[1],b[0]-a[0]);line(c,[[b[0]-10*Math.cos(t-.45),b[1]-10*Math.sin(t-.45)],b,[b[0]-10*Math.cos(t+.45),b[1]-10*Math.sin(t+.45)]],color,width)}
function circle(c,x,y,r,color,stroke){c.beginPath();c.arc(x,y,r,0,TAU);if(color){c.fillStyle=color;c.fill()}if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke()}}
function glow(c,x,y,r,color='#ffd68c'){c.save();c.shadowColor=color;c.shadowBlur=r*3;circle(c,x,y,r,color);c.restore()}
function bg(c,x,y,w,h,day=false){let g=c.createLinearGradient(0,y,0,y+h);g.addColorStop(0,day?'#102943':'#07111f');g.addColorStop(.7,day?'#25516b':'#102b41');g.addColorStop(1,'#274653');c.fillStyle=g;c.fillRect(x,y,w,h)}
function clip(c,x,y,w,h){c.save();c.beginPath();c.rect(x,y,w,h);c.clip()}
function projector(x,y,w,h,view='south'){
 let az={north:0,east:90,south:180,west:270}[view]||0,alt=45,F=[sin(az)*cos(alt),cos(az)*cos(alt),sin(alt)],R=[cos(az),-sin(az),0],U=[-sin(az)*sin(alt),-cos(az)*sin(alt),cos(alt)],scale=Math.min(w*.63,h*.95);
 return v=>{let f=v.e*F[0]+v.n*F[1]+v.u*F[2],r=v.e*R[0]+v.n*R[1],u=v.e*U[0]+v.n*U[1]+v.u*U[2];return {x:x+w/2+scale*r/(1+f),y:y+h*.43-scale*u/(1+f),visible:f>-.18&&v.u>=-.015,f,u:v.u}};
}
function sky(c,x,y,w,h,p={},opts={}){
 clip(c,x,y,w,h);bg(c,x,y,w,h,!!opts.sun);let view=p.view||'south',pr=projector(x,y,w,h,view),hours=p.hours||0,month=p.month||0,phase=hours*15+month*30;
 const az={north:0,east:90,south:180,west:270}[view];
 // All background stars use the same spherical rotation as the highlighted stars.
 for(let st of stars){let q=pr(horizontal(st.H+phase,st.dec));if(q.visible)circle(c,q.x,q.y,st.r*(h<300?.65:1),opts.sun?'#d4e0df30':'#d6e9f0a0')}
 let horizon=[];for(let a=az-150;a<=az+150;a+=2){let q=pr({e:sin(a),n:cos(a),u:0});horizon.push([q.x,q.y])}
 let sc=Math.min(w*.63,h*.95),hc=y+h*.43-sc,hr=sc/Math.sin(Math.PI/4);c.beginPath();c.rect(x,y,w,h);c.moveTo(x+w/2+hr,hc);c.arc(x+w/2,hc,hr,0,TAU);c.fillStyle='#091c26';c.fill('evenodd');circle(c,x+w/2,hc,hr,null,'#678e9a');
 for(const [a,label]of [[0,'北'],[90,'東'],[180,'南'],[270,'西']]){let q=pr({e:sin(a),n:cos(a),u:0});if(q.f>-.05)text(c,label,q.x,q.y+27,h<300?19:26,'#d5d8c9','center')}
 if(opts.sun){
  let dec=opts.dec||0,hour=p.hour??12,pts=[];for(let H=-130;H<=130;H+=2){let q=pr(horizontal(H,dec));if(q.visible)pts.push([q.x,q.y])}line(c,pts,'#e5c88b65',2,[6,6]);
  let v=horizontal((hour-12)*15,dec),q=pr(v);if(q.visible){glow(c,q.x,q.y,h<300?8:13);if(p.altitude){let ground=pr({e:v.e/Math.hypot(v.e,v.n),n:v.n/Math.hypot(v.e,v.n),u:0});line(c,[[q.x,q.y],[ground.x,ground.y]],gold,2,[5,6]);text(c,Math.max(0,solarAltitude(hour,dec)).toFixed(1)+'°',q.x+22,(q.y+ground.y)/2,27,gold)}}
  text(c,`${Math.round(hour)}時`,x+28,y+34,28,gold);text(c,opts.label||'太陽の通り道',x+w-25,y+34,22,ink,'right');
 }else{
  let northern=view==='north',baseH=northern?-30:view==='east'?-90:view==='west'?30:-35,baseDec=northern?63:3;
  const coords=[[-12,7],[-5,14],[3,9],[-6,-2],[5,-4],[12,4]];
  let points=[];for(let [dh,dd]of coords){let q=pr(horizontal(baseH+dh+phase,baseDec+dd));points.push(q)}
  for(const [a,b]of [[0,1],[1,2],[2,4],[4,3],[3,0],[4,5]])if(points[a].visible&&points[b].visible)line(c,[[points[a].x,points[a].y],[points[b].x,points[b].y]],'#80c8df80',1.5);
  let trail=[];let steps=Math.max(2,Math.ceil(Math.abs(phase)));for(let j=0;j<=steps;j++){let q=pr(horizontal(baseH+phase*j/steps,baseDec));if(q.visible)trail.push([q.x,q.y])}line(c,trail,'#f3c97795',2);
  let first=pr(horizontal(baseH,baseDec));if(first.visible)circle(c,first.x,first.y,7,null,'#c7dce970');
  for(let q of points)if(q.visible)glow(c,q.x,q.y,h<300?2.5:4,'#d5ecf5');
  let q=pr(horizontal(baseH+phase,baseDec));if(q.visible){glow(c,q.x,q.y,h<300?4:6);if(h>300)text(c,'星A',q.x+16,q.y-16,22,gold)}
  if(northern){let pole=pr(horizontal(0,90));circle(c,pole.x,pole.y,4,'#ffe6a8');circle(c,pole.x,pole.y,11,null,'#ffe6a888');if(h>300)text(c,'天の北極（北極星の近く）',pole.x,pole.y+32,22,'#f1d9a4','center')}
  let label=opts.label||({'north':'北の空','south':'南の空','east':'東の空','west':'西の空'}[view]);text(c,label,x+24,y+30,h<300?21:26);
  let clock=((20+hours)%24+24)%24;let condition=opts.annual?`${Math.round(month)}か月後  ${Math.floor(clock)}時${Math.round((clock%1)*60).toString().padStart(2,'0')}分`:`${hours.toFixed(1)}時間後`;
  text(c,condition,x+w-24,y+30,h<300?18:24,gold,'right');
 }
 c.restore();
}
function globe(c,x,y,r,light=180,rotation=0){
 c.save();c.shadowColor='#57b3dc';c.shadowBlur=22;circle(c,x,y,r+2,'#2a7297');c.shadowBlur=0;
 let g=c.createRadialGradient(x-r*.35,y-r*.45,r*.08,x,y,r);g.addColorStop(0,'#599bb0');g.addColorStop(.5,'#21566e');g.addColorStop(1,'#081c32');circle(c,x,y,r,g);
 c.save();c.beginPath();c.arc(x,y,r,0,TAU);c.clip();c.translate(x,y);c.rotate(-rotation*D);
 for(let k=1;k<=3;k++){c.beginPath();c.arc(0,0,r*k/4,0,TAU);c.strokeStyle='#99d0d236';c.stroke()}
 for(let a=0;a<180;a+=30)line(c,[[r*cos(a),r*sin(a)],[-r*cos(a),-r*sin(a)]],'#99d0d240');
 c.restore();c.save();c.translate(x,y);c.rotate(-light*D);let sh=c.createLinearGradient(-r,0,r,0);sh.addColorStop(0,'#000b');sh.addColorStop(.48,'#000b');sh.addColorStop(.52,'#0000');sh.addColorStop(1,'#0000');circle(c,0,0,r,sh);c.restore();c.restore();
}
function polar(c,x,y,w,h,p={},day=false){
 clip(c,x,y,w,h);bg(c,x,y,w,h);let cx=x+w*.51,cy=y+h*.53,r=Math.min(w*.22,h*.31),hour=p.hour??(6+(p.hours||0)),a=90+(hour-6)*15;
 for(let j=-2;j<=2;j++)arrow(c,[x+25,cy+j*r*.36],[cx-r-24,cy+j*r*.36],'#efd19875',1.5);
 text(c,'太陽の光',x+40,y+68,23,gold);globe(c,cx,cy,r,180,(hour-6)*15);text(c,'北極',cx,cy,22,ink,'center');
 let ox=cx+r*cos(a),oy=cy-r*sin(a);personOnGround(c,ox,oy,cx,cy,1.1);line(c,[[cx,cy],[ox,oy]],'#f3c97766',1,[3,5]);
 text(c,'観測者',ox+((ox<cx)?-30:30),oy-16,23,gold,ox<cx?'right':'left');
 let arc=[];for(let t=35;t<120;t+=3)arc.push([cx+(r+37)*cos(t),cy-(r+37)*sin(t)]);line(c,arc,blue,2);arrow(c,arc.at(-2),arc.at(-1),blue,2);
 text(c,'北極側から見る',x+25,y+30,25);text(c,day?`${Math.round(hour)%24}時（目安）`:'西 → 東に自転',cx,y+h-32,27,gold,'center');
 if(day){text(c,'昼',cx-r*.5,cy+r*.5,28,'#e8dcb9','center');text(c,'夜',cx+r*.5,cy+r*.5,28,'#8cb0c5','center')}
 c.restore();
}
function rate(c,w,h,p){bg(c,0,0,w,h);let cx=w*.38,cy=h*.52,r=h*.32,angle=p.angle||0;
 for(let rr of [r*.45,r,r*1.2])circle(c,cx,cy,rr,null,'#9bb5c020');
 for(let a=0;a<360;a+=15){let R=r+12;line(c,[[cx+R*cos(a),cy-R*sin(a)],[cx+(R+7)*cos(a),cy-(R+7)*sin(a)]],'#b2c9d15a')}
 glow(c,cx,cy,4,'#ffe6b5');text(c,'天の北極',cx,cy+27,23,ink,'center');let base=90,end=base+angle;
 circle(c,cx+r*cos(base),cy-r*sin(base),8,null,'#dce6ed70');line(c,[[cx,cy],[cx+r*cos(base),cy-r*sin(base)]],'#dae6e740',1,[6,6]);
 let arc=[];for(let a=base;a<=end;a+=1)arc.push([cx+r*cos(a),cy-r*sin(a)]);line(c,arc,gold,3);if(arc.length>3)arrow(c,arc.at(-4),arc.at(-1),gold,3);
 let sx=cx+r*cos(end),sy=cy-r*sin(end);glow(c,sx,sy,7);line(c,[[cx,cy],[sx,sy]],'#e9c681',1.5);
 text(c,'北の空',40,35,26);text(c,`${Math.round(angle)}°`,w*.7,h*.42,76,gold,'center');text(c,p.question?'20時 → 23時 ？':`${(angle/15).toFixed(0)}時間 × 約15°`,w*.7,h*.62,34,ink,'center');text(c,'反時計回り',w*.7,h*.79,28,muted,'center');
}
function dome(c,w,h,p,record=false){
 bg(c,0,0,w,h,true);let cx=w*.43,cy=h*.78,R=h*.65;
 const pr=v=>[cx+R*(v.e*.88+v.n*.36),cy-R*(v.u*.87+v.n*.26)];
 function curve(points,color,width=1,dash=[]){line(c,points.map(pr),color,width,dash)}
 let rim=[];for(let a=0;a<=360;a+=3)rim.push({e:sin(a),n:cos(a),u:0});curve(rim,'#9ec6d2',2);
 for(let az=0;az<180;az+=30){let pts=[];for(let a=0;a<=180;a+=3)pts.push({e:cos(a)*sin(az),n:cos(a)*cos(az),u:sin(a)});curve(pts,'#83b7c245')}
 for(let alt of [30,60]){let pts=[];for(let az=0;az<=360;az+=3)pts.push({e:cos(alt)*sin(az),n:cos(alt)*cos(az),u:sin(alt)});curve(pts,'#83b7c239')}
 for(let [a,label]of [[0,'北'],[90,'東'],[180,'南'],[270,'西']]){let q=pr({e:sin(a)*1.08,n:cos(a)*1.08,u:0});text(c,label,q[0],q[1],25,ink,'center')}
 person(c,cx,cy,1);text(c,'観測者',cx+20,cy+20,23,ink);let zen=pr({e:0,n:0,u:1});line(c,[[cx,cy],zen],'#a9d0d050',1,[5,6]);if(p.labels)text(c,'天頂',zen[0],zen[1]-23,27,gold,'center');
 let path=[];for(let hour=6;hour<=18;hour+=.2)path.push(horizontal((hour-12)*15,0));curve(path,'#edcc8b95',2);
 let v=horizontal(((p.hour||12)-12)*15,0),q=pr(v);glow(c,q[0],q[1],9);line(c,[q,[cx,cy]],gold,2,[6,6]);
 if(record){for(let hour=8;hour<=p.hour;hour+=1){let d=pr(horizontal((hour-12)*15,0));circle(c,...d,5,'#ffe8ab');text(c,`${hour}`,d[0],d[1]-21,20,gold,'center')}
  let pen=[q[0]+35,q[1]-45];line(c,[q,pen],'#e8ded1',6);text(c,'ペン先',pen[0]+12,pen[1],24);text(c,'影を中心に合わせる',w*.74,h*.5,35,gold,'center');text(c,`${Math.round(p.hour)}時の記録`,w*.74,h*.65,29,ink,'center');
 }else{text(c,'天球のうち、地平線より上の半分',w*.77,h*.38,27,ink,'center');text(c,'地平線からの角度',w*.77,h*.56,32,gold,'center');text(c,solarAltitude(p.hour||12).toFixed(0)+'°',w*.77,h*.72,61,gold,'center')}
}
const constellations=[{name:'冬の代表：オリオン座',pts:[[-.7,-.6],[.6,-.55],[-.28,0],[0,.08],[.28,.13],[-.55,.8],[.65,.75]],lines:[[0,1],[0,2],[2,3],[3,4],[4,1],[2,5],[4,6],[5,6]]},{name:'春の代表：しし座',pts:[[-.6,-.6],[-.9,-.25],[-.6,0],[-.3,-.1],[-.2,.4],[.8,.6],[.5,-.1]],lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]]},{name:'夏の代表：さそり座',pts:[[-.7,-.6],[-.35,-.3],[0,.1],[.15,.65],[.65,.8],[.85,.45],[.6,.25]],lines:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]]},{name:'秋の代表：ペガスス座',pts:[[-.65,-.5],[.65,-.5],[.6,.65],[-.65,.7],[-1,-.8]],lines:[[0,1],[1,2],[2,3],[3,0],[0,4]]}];
function pattern(c,x,y,w,h,i){let pat=constellations[i],cx=x+w/2,cy=y+h*.57,r=Math.min(w,h)*.32;for(let[a,b]of pat.lines)line(c,[[cx+pat.pts[a][0]*r,cy+pat.pts[a][1]*r],[cx+pat.pts[b][0]*r,cy+pat.pts[b][1]*r]],'#7faacb75',2);for(let [a,b]of pat.pts)glow(c,cx+a*r,cy+b*r,4,'#dbeefa');text(c,pat.name,cx,y+42,27,gold,'center');text(c,'星の並びは模式図',cx,y+h-22,19,muted,'center')}
function orbit(c,w,h,p,night=false,ecliptic=false,tilt=false){
 bg(c,0,0,w,h);let cx=w*.32,cy=h*.53,r=h*.24,month=p.month||0,a=month*30,ex=cx+r*cos(a),ey=cy-r*sin(a),er=32;
 let ring=[];for(let d=0;d<=360;d+=2)ring.push([cx+r*cos(d),cy-r*sin(d)]);line(c,ring,'#91b2c766',1.5,[4,6]);
 for(let [d,label]of [[0,'冬'],[90,'春'],[180,'夏'],[270,'秋']]){let gx=cx+r*cos(d),gy=cy-r*sin(d);circle(c,gx,gy,4,'#aac2cc55');if(!ecliptic)text(c,label,cx+(r+48)*cos(d),cy-(r+48)*sin(d),25,muted,'center')}
 glow(c,cx,cy,35,'#f4c36d');text(c,'太陽',cx,cy+58,23,gold,'center');globe(c,ex,ey,er,a+180,a);text(c,'地球',ex,ey+49,22,ink,'center');
 let arc=[];for(let d=a-30;d<=a-5;d++)arc.push([cx+(r+13)*cos(d),cy-(r+13)*sin(d)]);line(c,arc,blue,2);if(arc.length>3)arrow(c,arc.at(-3),arc.at(-1),blue,2);
 text(c,tilt?'地軸の向きは、ほぼ一定':'地球の公転',35,32,26);text(c,`${month.toFixed(1)}か月`,w*.57,32,26,gold,'right');
 if(tilt){
  for(let d of [0,90,180,270]){let x=cx+r*cos(d),y=cy-r*sin(d);if(Math.abs(d-a)>5)globe(c,x,y,22,d+180,0);arrow(c,[x-18,y+42],[x+18,y-42],'#bad5e2',2)}
  let tx=w*.77,ty=h*.54;globe(c,tx,ty,95,180,0);line(c,[[tx,ty-150],[tx,ty+150]],'#adc7ce66',1,[5,6]);arrow(c,[tx-65,ty+150],[tx+65,ty-150],gold,3);text(c,'23.4°',tx+104,ty-132,39,gold);text(c,'公転面に垂直な方向',tx,ty+180,25,muted,'center');text(c,'北半球：冬 → 春 → 夏 → 秋',w*.78,44,27,ink,'center');
 }else if(ecliptic){
  let ux=cos(a),uy=-sin(a),sx=cx-ux*r*1.5,sy=cy-uy*r*1.5;arrow(c,[ex,ey],[sx,sy],'#e9bd777a',2);let bx=w*.78,by=h*.54,R=h*.31;
  circle(c,bx,by,R,null,'#9bb5c060');for(let j=0;j<36;j++)circle(c,bx+R*cos(j*10),by-R*sin(j*10),j%3?1.5:3,'#c4dcea');
  let start=180,end=180+a,pts=[];for(let d=start;d<=end;d++)pts.push([bx+R*cos(d),by-R*sin(d)]);line(c,pts,gold,3);glow(c,bx+R*cos(end),by-R*sin(end),12);text(c,'背景の星に対する太陽',bx,35,26,ink,'center');text(c,'西 → 東',bx,by,40,gold,'center');text(c,'黄道（模式図）',bx,h-28,25,muted,'center');
 }else{
  if(night){let u=[cos(a),-sin(a)];let far=[ex+u[0]*90,ey+u[1]*90];c.beginPath();c.moveTo(ex,ey);c.lineTo(far[0]-u[1]*65,far[1]+u[0]*65);c.lineTo(far[0]+u[1]*65,far[1]-u[0]*65);c.closePath();c.fillStyle='#efcf8420';c.fill();arrow(c,[ex,ey],far,gold,2);glow(c,ex+u[0]*er,ey+u[1]*er,5);}
  line(c,[[w*.64,75],[w*.64,h-50]],'#7a98a335');pattern(c,w*.65,50,w*.34,h-60,Math.round(month/3)%4);
 }
}
function seasons(c,w,h,p){
 bg(c,0,0,w,h,true);let i=Math.round(p.season||0),dec=23.4*(1-(p.season||0)),label=['夏至','春分・秋分','冬至'][i];
 sky(c,0,0,w*.7,h,{view:'south',hour:p.hour??12},{sun:true,dec,label});
 text(c,label,w*.85,h*.2,42,gold,'center');text(c,`南中高度 ${solarAltitude(12,dec).toFixed(1)}°`,w*.85,h*.4,31,ink,'center');text(c,`昼 約${dayLength(dec).toFixed(1)}時間`,w*.85,h*.58,31,ink,'center');text(c,'北緯35°',w*.85,h*.8,24,muted,'center');
}
function learnSphere(c,w,h,p){
 bg(c,0,0,w,h);const level=p.level||0,cx=w*.38,cy=h*.5,R=h*.39;
 const alpha=(threshold)=>Math.max(0,Math.min(1,level-threshold+1));
 // The flat ground remains visible as the transparent celestial model grows.
 c.fillStyle='#7c9b9e20';c.beginPath();c.ellipse(cx,cy,R*1.34,R*.23,0,0,TAU);c.fill();c.strokeStyle='#85a7b5';c.lineWidth=2;c.stroke();
 text(c,'地面',cx-R*1.43,cy+12,26,muted,'right');
 if(level>0){c.save();c.globalAlpha=alpha(1);c.beginPath();c.arc(cx,cy,R,Math.PI,TAU);c.strokeStyle='#9ec7df';c.lineWidth=3;c.stroke();for(let k of [.4,.75]){c.beginPath();c.ellipse(cx,cy,R*k,R,0,Math.PI,TAU);c.strokeStyle='#98c6dd30';c.lineWidth=1;c.stroke();}c.restore();}
 if(level>1){c.save();c.globalAlpha=alpha(2);for(let i=0;i<13;i++){let a=198+i*12,x=cx+R*cos(a),y=cy+R*sin(a);glow(c,x,y,i%3?3:5,'#deefff');}c.restore();}
 if(level>2){c.save();c.globalAlpha=alpha(3);c.beginPath();c.arc(cx,cy,R,0,Math.PI);c.setLineDash([7,8]);c.strokeStyle='#7891a880';c.lineWidth=2;c.stroke();c.setLineDash([]);for(let i=0;i<7;i++){let a=15+i*25;circle(c,cx+R*cos(a),cy+R*sin(a),3,'#b5c8d455');}text(c,'地面に隠れる側',cx,cy+R+26,22,muted,'center');c.restore();}
 // Observer at the centre; his viewing directions, not real stellar distances.
 circle(c,cx,cy-27,9,gold);line(c,[[cx,cy-18],[cx,cy+9]],gold,4);line(c,[[cx-14,cy-5],[cx,cy-13],[cx+14,cy-5]],gold,3);line(c,[[cx-10,cy+24],[cx,cy+9],[cx+10,cy+24]],gold,3);text(c,'自分',cx+29,cy+30,24,gold);
 if(level>3){c.save();c.globalAlpha=alpha(4);line(c,[[cx,cy-40],[cx,cy-R]],'#eac887',2,[5,6]);glow(c,cx,cy-R,5);text(c,'天頂',cx,cy-R-27,30,gold,'center');c.restore();}
 if(level>4){c.save();c.globalAlpha=alpha(5);text(c,'地平線',cx+R+55,cy,30,gold);arrow(c,[cx+R+43,cy],[cx+R*.92,cy],gold,2);c.restore();}
 const nx=cx+R*cos(35),ny=cy-R*sin(35),sx=cx-R*cos(35),sy=cy+R*sin(35);
 if(level>5){c.save();c.globalAlpha=alpha(6);arrow(c,[cx,cy],[nx,ny],blue,2);glow(c,nx,ny,5,blue);text(c,'天の北極',nx+19,ny-20,29,blue);c.restore();}
 if(level>6){c.save();c.globalAlpha=alpha(7);line(c,[[cx,cy],[sx,sy]],blue,2,[6,7]);glow(c,sx,sy,5,blue);text(c,'天の南極',sx-20,sy+25,29,blue,'right');c.restore();}
 let messages=level<1?['空を見る自分から','考え始めよう']:level<2?['見上げた空を','丸い天井にする']:level<3?['星の見える方向を','天井に描く']:level<4?['空全体を表す','仮想の球']:level<6?['真上と、水平な境目','自分を基準にする']:['地軸の向きを','空まで延ばす'];
 text(c,messages[0],w*.78,h*.40,39,ink,'center');text(c,messages[1],w*.78,h*.56,34,gold,'center');
}
function person(c,x,y,scale=1){c.save();c.translate(x,y);c.scale(scale,scale);c.strokeStyle=gold;c.lineWidth=4;c.lineCap='round';circle(c,0,-29,6,gold);line(c,[[0,-21],[0,-9]],gold,4);line(c,[[-10,-12],[0,-19],[10,-12]],gold,3);line(c,[[-8,0],[0,-9],[8,0]],gold,3);c.restore();}
function personOnGround(c,x,y,cx,cy,scale=1){const rotation=Math.atan2(-(cx-x),cy-y);c.save();c.translate(x,y);c.rotate(rotation);c.scale(scale,scale);c.strokeStyle=gold;c.lineWidth=4;c.lineCap='round';circle(c,0,-29,6,gold);line(c,[[0,-21],[0,-9]],gold,4);line(c,[[-10,-12],[0,-19],[10,-12]],gold,3);line(c,[[-8,0],[0,-9],[8,0]],gold,3);c.restore();}
function learnAxis(c,w,h,p){bg(c,0,0,w,h);let x=w*.34,y=h*.51,R=h*.30,vx=sin(23.4),vy=-cos(23.4),level=p.level||0;
 let g=c.createRadialGradient(x-R*.4,y-R*.4,R*.1,x,y,R);g.addColorStop(0,'#5caac7');g.addColorStop(.6,'#245d80');g.addColorStop(1,'#07192e');circle(c,x,y,R,g,'#78beda');
 const pt=(lat,lon)=>{let X=cos(lat)*sin(lon),Y=sin(lat),Z=cos(lat)*cos(lon);return [x+R*(X*cos(23.4)+Y*sin(23.4)),y+R*(X*sin(23.4)-Y*cos(23.4)),Z];};
 const curve=(points,color,width=1)=>{let run=[];for(const q of points){if(q[2]>=0)run.push(q.slice(0,2));else{line(c,run,color,width);run=[];}}line(c,run,color,width);};
 let spin=p.spin||0;
 for(let lat of [-60,-30,0,30,60])curve(Array.from({length:181},(_,i)=>pt(lat,i*2)),lat===0?'#b8e9dd99':'#8ac2d55a',lat===0?2:1);
 for(let lon=0;lon<360;lon+=30)curve(Array.from({length:91},(_,i)=>pt(-90+i*2,lon+spin)),'#baddec88',1.5);
 // Colored surface patches and a point provide visible motion about the fixed tilted axis.
 for(let [lat,lon] of [[20,0],[35,75],[-30,160],[-15,245]]){let q=pt(lat,lon+spin);if(q[2]>0){c.save();c.globalAlpha=.35+.55*q[2];circle(c,q[0],q[1],lat===20?9:6,lat===20?gold:'#82d4b4');c.restore();}}
 if(level>0){c.save();c.globalAlpha=Math.min(1,level);line(c,[[x-vx*(R+48),y-vy*(R+48)],[x+vx*(R+48),y+vy*(R+48)]],gold,4);text(c,'北極',x+vx*(R+55)+18,y+vy*(R+55),28,gold);text(c,'南極',x-vx*(R+55)-18,y-vy*(R+55),28,gold,'right');c.restore();}
 if(level>1){text(c,'地軸',w*.73,h*.32,62,gold,'center');text(c,'地球が回る、中心の軸',w*.73,h*.53,32,ink,'center');if(spin>0)text(c,'軸はそのまま。表面が動く。',w*.73,h*.73,27,gold,'center');}else{text(c,'地球の回転には',w*.73,h*.38,34,ink,'center');text(c,'中心となる軸がある',w*.73,h*.56,34,gold,'center');}}
function learnDirection(c,w,h,p){bg(c,0,0,w,h);let cx=w*.28,cy=h*.52,R=h*.25,a=90+((p.hour||6)-6)*15;globe(c,cx,cy,R,180,a);text(c,'北極',cx,cy+R+30,26,ink,'center');let x=cx+R*cos(a),y=cy-R*sin(a);personOnGround(c,x,y,cx,cy,1.1);let north=[-cos(a),sin(a)],east=[-sin(a),-cos(a)];
 const vec=(v,label,color)=>{let end=[x+v[0]*78,y+v[1]*78];arrow(c,[x,y],end,color,3);text(c,label,end[0]+v[0]*24,end[1]+v[1]*24,29,color,'center');};
 if(p.level>=1){vec(north,'北',blue);vec(north.map(v=>-v),'南',blue);}if(p.level>=2){vec(east,'東',gold);vec(east.map(v=>-v),'西',gold);}
 text(c,'北極側から見る',30,32,27);c.save();c.translate(w*.52,0);dailySun(c,w*.48,h,p);c.restore();text(c,'方位は、観測者を基準に',w*.77,h*.82,28,ink,'center');}
function dailySun(c,w,h,p){let hour=Math.max(0,Math.min(24,p.hour??6)),left=w*.14,right=w*.86,base=h*.79;let top=hour<6?'#17253f':hour<12?'#79bdd2':hour<18?'#d28764':'#121a31',bottom=hour<6?'#b87568':hour<12?'#d3e4c5':hour<18?'#5a405c':'#26324d';let g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,top);g.addColorStop(1,bottom);c.fillStyle=g;c.fillRect(0,0,w,h);line(c,[[50,base],[w-50,base]],'#d8e0c5',2);let pts=[];for(let i=0;i<=60;i++){let t=i/60;pts.push([left+(right-left)*t,base-sin(t*180)*h*.51]);}line(c,pts,'#ffe0a077',2,[6,7]);let t=Math.max(0,Math.min(1,(hour-6)/12)),sx=left+(right-left)*t,sy=base-sin(t*180)*h*.51;if(hour>=6&&hour<=18)glow(c,sx,sy,19);person(c,w*.5,base,1.45);text(c,'東',left,base+37,30,ink,'center');text(c,'南',w/2,base+37,30,ink,'center');text(c,'西',right,base+37,30,ink,'center');text(c,hour<6?'夜':hour<9?'朝':hour<15?'昼':hour<19?'夕方':'夜',w/2,48,36,'#fff1c4','center');}
function problemEarth(c,w,h,p){bg(c,0,0,w,h);let cx=w*.34,cy=h*.53,R=Math.min(h*.3,w*.18),level=p.level||0;glow(c,w*.12,cy,R*.22,'#f4c36d');text(c,'太陽',w*.12,cy+R*.42,24,gold,'center');let ring=[];for(let a=0;a<360;a+=2)ring.push([cx+R*1.8*cos(a),cy-R*1.8*sin(a)]);line(c,ring,'#92b9cc66',2);for(let d of [0,90,180,270]){let x=cx+R*1.8*cos(d),y=cy-R*1.8*sin(d);circle(c,x,y,4,'#b8d1dc55');}globe(c,cx,cy,R,180,level*90);let names=['A','B','C','D'];for(let i=0;i<4;i++){let a=i*90,x=cx+R*1.25*cos(a),y=cy-R*1.25*sin(a);circle(c,x,y,8,i===level?gold:'#d8e7ed55');text(c,names[i],x+(cos(a)*22),y-(sin(a)*22),28,i===level?gold:ink,'center');}text(c,'太陽に正面＝真昼',w*.74,h*.32,38,ink,'center');text(c,level>=2?'光と自転の向きを読む':'A〜Dの位置を見る',w*.74,h*.52,34,gold,'center');if(level>=3)text(c,'日の出 → 南中 → 日の入り → 真夜中',w*.74,h*.73,25,ink,'center');}
function problemDome(c,w,h,p){
 bg(c,0,0,w,h,true);let level=p.level||0,cx=w*.28,cy=h*.70,R=h*.58;
 c.beginPath();c.arc(cx,cy,R,Math.PI,TAU);c.strokeStyle='#9ec6d2';c.lineWidth=3;c.stroke();
 for(let alt of [30,60]){c.beginPath();c.ellipse(cx,cy,R*cos(alt),R*sin(alt),0,Math.PI,TAU);c.strokeStyle='#83b7c245';c.stroke();}
 let path=[];for(let a=0;a<=180;a+=3)path.push([cx-R*cos(a),cy-R*.86*sin(a)]);line(c,path,'#edcc8b95',3,[7,7]);
 text(c,'東',cx-R,cy+34,27,ink,'center');text(c,'南',cx,cy+34,27,ink,'center');text(c,'西',cx+R,cy+34,27,ink,'center');person(c,cx,cy,1.0);
 let pts=[[cx-R,cy],[cx,cy-R*.86],[cx+R,cy]];for(let i=0;i<3;i++){if(i<=level){circle(c,pts[i][0],pts[i][1],9,gold);text(c,['P','M','Q'][i],pts[i][0]+(i===0?-25:i===2?25:0),pts[i][1]-22,30,gold,'center');}}
 let x=w*.72,y=h*.42;text(c,'透明半球の記録',x,55,32,ink,'center');text(c,level>=2?'M：南中の最高点':'点を順に確認',x,h*.42,34,gold,'center');if(level>=1)text(c,'P：日の出側',x,h*.58,29,ink,'center');if(level>=2)text(c,'Q：日の入り側',x,h*.70,29,ink,'center');if(level>=3)text(c,'長さを時間に直す',x,h*.84,29,gold,'center');
}
function regions(c,w,h,p){bg(c,0,0,w,h);let names=['北極付近','赤道付近','南半球'];for(let i=0;i<3;i++){let x=w*(.18+i*.32),cx=x,cy=h*.55,R=h*.18;circle(c,cx,cy,R,null,'#aac8d180');let pts=[];if(i===0){for(let a=0;a<=360;a+=3)pts.push([cx+R*1.22*cos(a),cy-R*.5*sin(a)]);}else if(i===1){for(let a=-70;a<=70;a+=3)pts.push([cx+R*.55*cos(a),cy-R*1.3*sin(a)]);}else{for(let a=0;a<=360;a+=3)pts.push([cx+R*1.22*cos(a),cy+R*.5*sin(a)]);}line(c,pts,'#f0cc88',3);text(c,names[i],cx,42,28,gold,'center');text(c,i===0?'水平に回る':i===1?'垂直に昇る':'南側を中心に回る',cx,cy+R+50,24,ink,'center');}}
function frontBack(c,w,h,p){bg(c,0,0,w,h);let turn=p.turn||0,cy=h*.56,r=h*.26;for(let side=0;side<2;side++){let cx=w*(side?.72:.28),ang=(turn*45)*(side?1:-1);circle(c,cx,cy,r,null,'#a8cadb');let arc=[];for(let a=0;a<=360;a+=3)arc.push([cx+r*cos(a),cy-r*sin(a)]);line(c,arc,'#8bb7ca',2);for(let i=0;i<8;i++){let a=i*45+ang;let x=cx+r*.75*cos(a),y=cy-r*.75*sin(a);circle(c,x,y,5,gold);if(i<7)line(c,[[cx+r*.75*cos(a),cy-r*.75*sin(a)],[cx+r*.75*cos(a+45),cy-r*.75*sin(a+45)]],'#dceaf080',2);}text(c,side?'南の空':'北の空',cx,cy-r-34,30,gold,'center');text(c,side?'裏側から見る':'表側から見る',cx,cy+r+36,25,ink,'center');}text(c,'同じ自転',w*.5,h*.22,38,ink,'center');text(c,turn<2?'見ている面を比べる':'表と裏で、向きが反対に見える',w*.5,h*.82,34,gold,'center');}
const taneoCache={};
function taneoImage(key){const src=window['TaneoSky_'+key];if(!src)return null;if(!taneoCache[key]){const im=new Image();im.src=src;taneoCache[key]=im;}return taneoCache[key];}
function taneoFourSky(c,w,h,p){
 bg(c,0,0,w,h);const panels=[['east','東の空'],['south','南の空'],['west','西の空'],['north','北の空']];
 panels.forEach(([key,label],i)=>{const x=(i%2)*w/2,y=Math.floor(i/2)*h/2,pw=w/2,ph=h/2; c.fillStyle='#f3f0e8';c.fillRect(x+10,y+28,pw-20,ph-38);const im=taneoImage(key);if(im&&im.complete&&im.naturalWidth){const pad=18,iw=pw-36,ih=ph-72,scale=Math.min(iw/im.naturalWidth,ih/im.naturalHeight),dw=im.naturalWidth*scale,dh=im.naturalHeight*scale;c.drawImage(im,x+(pw-dw)/2,y+44+(ih-dh)/2,dw,dh);}else if(im){im.onload=()=>requestAnimationFrame(()=>render(document.getElementById('scene'),'taneoFourSky',p));}text(c,label,x+pw/2,y+16,25,gold,'center');});
 line(c,[[w/2,28],[w/2,h]],'#aec3ce60');line(c,[[0,h/2],[w,h/2]],'#aec3ce60');
 if((p.hours||0)>=2)text(c,'東：昇る　南：弧を描く　西：沈む　北：北極星の近くを回る',w/2,h-18,24,gold,'center');
}

function render(canvas,scene,p={}){let c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;c.clearRect(0,0,w,h);c.lineCap='round';
 switch(scene){
 case 'learnSpinSync':polar(c,0,0,w*.52,h,p,false);c.save();c.translate(w*.52,0);learnAxis(c,w*.48,h,{level:2,spin:((p.hour||6)-6)*15});c.restore();break;
 case 'learnSpin':polar(c,0,0,w*.62,h,p,false);bg(c,w*.62,0,w*.38,h);text(c,'北極の上から見ると',w*.80,h*.37,34,ink,'center');text(c,'反時計回り',w*.80,h*.57,50,gold,'center');break;case 'learnSphere':learnSphere(c,w,h,p);break;case 'learnAxis':learnAxis(c,w,h,p);break;case 'learnDirection':learnDirection(c,w,h,p);break;case 'dailySun':dailySun(c,w,h,p);break;case 'problemEarth':problemEarth(c,w,h,p);break;case 'problemDome':problemDome(c,w,h,p);break;case 'regions':regions(c,w,h,p);break;case 'frontBack':frontBack(c,w,h,p);break;
 case 'cover':sky(c,0,0,w,h,{hours:p.hours||0,view:'north'});break;
 case 'sky':sky(c,0,0,w,h,p);break;
 case 'annualSky':sky(c,0,0,w,h,{...p,view:'south'},{annual:true});break;
 case 'fourSky':for(let[i,v]of ['east','south','west','north'].entries())sky(c,(i%2)*w/2,Math.floor(i/2)*h/2,w/2,h/2,{...p,view:v});line(c,[[w/2,0],[w/2,h]],'#aec3ce40');line(c,[[0,h/2],[w,h/2]],'#aec3ce40');break;
 case 'taneoFourSky':taneoFourSky(c,w,h,p);break;
 case 'rotation':polar(c,0,0,w*.45,h,p);sky(c,w*.47,0,w*.53,h,{...p,view:'south'});break;
 case 'daynight':polar(c,0,0,w*.52,h,p,true);c.save();c.translate(w*.52,0);dailySun(c,w*.48,h,p);c.restore();break;
 case 'dome':dome(c,w,h,p);break;case 'record':dome(c,w,h,p,true);break;
 case 'sun':sky(c,0,0,w,h,{...p,view:'south'},{sun:true});break;
 case 'rate':rate(c,w,h,p);break;
 case 'orbit':orbit(c,w,h,p);break;case 'nightView':orbit(c,w,h,p,true);break;
 case 'ecliptic':orbit(c,w,h,p,false,true);break;case 'tilt':orbit(c,w,h,p,false,false,true);break;
 case 'seasons':seasons(c,w,h,p);break;
 case 'compare':sky(c,0,0,w*.495,h,{hours:p.hours||0,view:'south'},{label:'時刻を変える｜日周'});sky(c,w*.505,0,w*.495,h,{hours:0,month:p.month||0,view:'south'},{annual:true,label:'同じ時刻・日付を変える｜年周'});break;
 }
}
window.Astro={render,horizontal,solarAltitude,dayLength};
})();


