/* SeeD: original teaching diagrams. Shared ENU coordinates, degrees and local solar time. */
(()=>{'use strict';
const old=Astro.render,D=Math.PI/180,TAU=Math.PI*2,C={paper:'#faf9f5',ink:'#242321',red:'#b6242a',blue:'#376e89',pale:'#b8ced8',gold:'#d69931',night:'#101e30'};
const sin=a=>Math.sin(a*D),cos=a=>Math.cos(a*D),H=Astro.horizontal;
let bounds=[];
function text(c,t,x,y,size=30,col=C.ink,align='left'){c.font=`600 ${size}px "Zen Kaku Gothic New",sans-serif`;c.textAlign=align;c.textBaseline='middle';c.fillStyle=col;c.fillText(t,x,y);const m=c.measureText(t);let l=align==='center'?x-m.width/2:align==='right'?x-m.width:x;bounds.push({t,l,r:l+m.width,y,size});}
function line(c,pts,col=C.blue,width=2,dash=[]){if(pts.length<2)return;c.beginPath();pts.forEach((p,i)=>i?c.lineTo(...p):c.moveTo(...p));c.strokeStyle=col;c.lineWidth=width;c.setLineDash(dash);c.stroke();c.setLineDash([]);}
function arrow(c,a,b,col=C.red,width=3){line(c,[a,b],col,width);let t=Math.atan2(b[1]-a[1],b[0]-a[0]);line(c,[[b[0]-12*Math.cos(t-.4),b[1]-12*Math.sin(t-.4)],b,[b[0]-12*Math.cos(t+.4),b[1]-12*Math.sin(t+.4)]],col,width);}
function dot(c,x,y,r,col=C.red,stroke){c.beginPath();c.arc(x,y,r,0,TAU);if(col){c.fillStyle=col;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
function ellipse(c,x,y,rx,ry,col=C.blue,dash=[],fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);c.setLineDash(dash);c.strokeStyle=col;c.lineWidth=2;if(fill){c.fillStyle=fill;c.fill();}c.stroke();c.setLineDash([]);}
function paper(c,w,h){c.fillStyle=C.paper;c.fillRect(0,0,w,h);}
function cover(c,w,h){const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,'#101b2b');g.addColorStop(1,'#244458');c.fillStyle=g;c.fillRect(0,0,w,h);let cx=w*.52,cy=h*.46;for(let i=0;i<95;i++){let a=i*137.51,r=35+(i*79)%(w*.53);dot(c,cx+r*cos(a),cy+r*sin(a),i%7===0?2.6:1.2,'#dfedf2');}for(let r of [65,120,190,270]){let pts=[];for(let a=10;a<=300;a+=2)pts.push([cx+r*cos(a),cy-r*sin(a)]);line(c,pts,'#c2d9df38',1.5);let a=r*.29;dot(c,cx+r*cos(a),cy-r*sin(a),4,'#efcf8c');}dot(c,cx,cy,4,'#f5dca6');}
function tilted(c,w,h,p){paper(c,w,h);const cx=w/2,cy=h*.53,R=h*.30,spin=(p.hour-6)*15;
 let g=c.createRadialGradient(cx-R*.35,cy-R*.4,5,cx,cy,R);g.addColorStop(0,'#a9d7e4');g.addColorStop(.55,'#528faa');g.addColorStop(1,'#20445f');dot(c,cx,cy,R,g);
 const pt=(lat,lon)=>{let X=cos(lat)*sin(lon),Y=sin(lat),Z=cos(lat)*cos(lon);return [cx+R*(X*cos(23.4)+Y*sin(23.4)),cy+R*(X*sin(23.4)-Y*cos(23.4)),Z];};
 function curve(pts){let run=[];for(const q of pts){if(q[2]>=0)run.push(q.slice(0,2));else{line(c,run,'#dfedf199',1.4);run=[];}}line(c,run,'#dfedf199',1.4);}
 for(let lat of [-60,-30,0,30,60])curve(Array.from({length:181},(_,i)=>pt(lat,i*2)));for(let lon=0;lon<360;lon+=30)curve(Array.from({length:91},(_,i)=>pt(-90+i*2,lon+spin)));
 line(c,[[cx-(R+36)*sin(23.4),cy+(R+36)*cos(23.4)],[cx+(R+36)*sin(23.4),cy-(R+36)*cos(23.4)]],C.red,4);let q=pt(0,spin);dot(c,q[0],q[1],9,q[2]>=0?C.red:null,q[2]>=0?null:C.red);text(c,'地軸を斜めから見る',cx,30,30,C.ink,'center');text(c,'北極',cx+(R+40)*sin(23.4)+20,cy-(R+40)*cos(23.4),27,C.red);text(c,q[2]>=0?'赤い地点が手前に見える':'赤い地点は地球の裏側',cx,h-28,28,C.ink,'center');}
function person(c,x,y,scale=1,col=C.ink,rotation=0){c.save();c.translate(x,y);c.rotate(rotation);dot(c,0,-36*scale,7*scale,col);line(c,[[0,-27*scale],[0,-11*scale]],col,4*scale);line(c,[[-12*scale,-15*scale],[0,-23*scale],[12*scale,-15*scale]],col,3*scale);line(c,[[-9*scale,0],[0,-11*scale],[9*scale,0]],col,3*scale);c.restore();}
function panel(c,x,y,w,h,fn,p){c.save();c.translate(x,y);c.beginPath();c.rect(0,0,w,h);c.clip();const b=bounds;bounds=[];fn(c,w,h,p);const local=bounds;bounds=b;for(const q of local)bounds.push({...q,l:q.l+x,r:q.r+x,y:q.y+y});c.restore();}
const scratch=document.createElement('canvas');
function prior(c,x,y,w,h,scene,p){scratch.width=Math.round(w);scratch.height=Math.round(h);old(scratch,scene,p);c.drawImage(scratch,x,y,w,h);}
function interpolateColor(a,b,t){const rgb=s=>s.match(/\w\w/g).map(v=>parseInt(v,16));let A=rgb(a.slice(1)),B=rgb(b.slice(1));return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');}
const colors=[[0,'#14233e','#293447'],[5,'#253c62','#c58e83'],[6,'#7d9fb7','#efc794'],[9,'#74b8dc','#d9eced'],[12,'#62b5df','#def0ef'],[16,'#85bfd7','#eee3c5'],[18,'#8e91ae','#efac79'],[20,'#20304d','#3e4258'],[24,'#14233e','#293447']];
function skyColors(hour){for(let i=1;i<colors.length;i++)if(hour<=colors[i][0]){let a=colors[i-1],b=colors[i],t=(hour-a[0])/(b[0]-a[0]);return [interpolateColor(a[1],b[1],t),interpolateColor(a[2],b[2],t)];}return colors.at(-1).slice(1);}
function sunDay(c,w,h,p={}){let hour=(p.hour??6)%24,base=h*.81,cs=skyColors(hour),g=c.createLinearGradient(0,0,0,base);g.addColorStop(0,cs[0]);g.addColorStop(1,cs[1]);c.fillStyle=g;c.fillRect(0,0,w,h);const pr=v=>[w*.5-v.e*w*.38,base-v.u*h*.70];
 let pts=[];for(let hh=6;hh<=18.01;hh+=.1)pts.push(pr(H((hh-12)*15,0)));line(c,pts,'#ffffff80',2,[5,7]);
 if(hour>=19||hour<5){for(let i=0;i<35;i++)dot(c,w*(.04+((i*37)%93)/100),45+(i*73)%(base-95),1.7,'#ebf3ff');}
 let v=H((hour-12)*15,0),q=pr(v);c.save();c.beginPath();c.rect(0,0,w,base+1);c.clip();if(v.u>=-.1){c.shadowColor='#ffc44e';c.shadowBlur=24;dot(c,...q,17,'#ffd760');}c.restore();
 const night=hour>=20||hour<5;c.fillStyle='#f0eee5';c.fillRect(0,base,w,h-base);line(c,[[0,base],[w,base]],'#78876e',3);person(c,w/2,base,1.45,night?'#fff1d4':C.ink);text(c,'東',w*.1,base+40,31,C.ink,'center');text(c,'南',w*.5,base+40,31,C.ink,'center');text(c,'西',w*.9,base+40,31,C.ink,'center');
 let label=hour<6?'夜':hour<10?'朝':hour<15?'昼':hour<17?'午後':hour<19?'夕方':'夜';text(c,`${label}　${Math.round(hour)%24}時`,w/2,35,32,night?'#f4f2e8':C.ink,'center');}
function earth(c,w,h,p={}){paper(c,w,h);let cx=w*.51,cy=h*.52,r=Math.min(h*(p.directions?.22:p.clock?.24:.29),w*.23),hour=p.hour??6,a=90+(hour-6)*15;
 const g=c.createRadialGradient(cx-r*.35,cy-r*.4,5,cx,cy,r);g.addColorStop(0,'#afd5df');g.addColorStop(.7,'#498da5');g.addColorStop(1,'#204c67');dot(c,cx,cy,r,g);
 c.save();c.beginPath();c.arc(cx,cy,r,0,TAU);c.clip();for(let j=1;j<4;j++)ellipse(c,cx,cy,r*j/4,r*j/4,'#cee9e578');for(let d=0;d<180;d+=30){let b=d+a;line(c,[[cx+r*cos(b),cy-r*sin(b)],[cx-r*cos(b),cy+r*sin(b)]],'#e0efed60');}c.fillStyle='#051523a0';c.fillRect(cx,cy-r,r,r*2);c.restore();
 for(let j=-1;j<=1;j++)arrow(c,[30,cy+j*r*.52],[cx-r-28,cy+j*r*.52],C.gold,2);text(c,'太陽の光',30,70,25,C.gold);text(c,'北極側から見た地球',w/2,30,30,C.ink,'center');
 text(c,'北極',p.directions?cx-38:cx,p.directions?cy+24:cy,25,'#fff','center');let x=cx+r*cos(a),y=cy-r*sin(a);person(c,x,y,1.1,C.red,Math.atan2(x-cx,cy-y));
 let arc=[];for(let d=30;d<=125;d+=3)arc.push([cx+(r+35)*cos(d),cy-(r+35)*sin(d)]);line(c,arc,C.blue,2);arrow(c,arc.at(-2),arc.at(-1),C.blue,2);
 if(p.directions){let north=[-cos(a),sin(a)],east=[-sin(a),-cos(a)];for(const [name,v,col,len] of [['北',north,C.blue,60],['南',north.map(z=>-z),C.blue,65],['東',east,C.red,83],['西',east.map(z=>-z),C.ink,83]]){let end=[x+v[0]*len,y+v[1]*len];arrow(c,[x,y],end,col,2);text(c,name,end[0]+v[0]*23,end[1]+v[1]*23,28,col,'center');}}
 else if(p.clock){text(c,'朝',cx+65,cy-r-52,26,C.ink,'center');text(c,'昼',cx-r-65,cy+35,26,C.ink,'center');text(c,'夕方',cx-70,cy+r+46,26,C.ink,'center');text(c,'真夜中',cx+r+90,cy+42,26,C.ink,'center');}
 text(c,`${Math.round(hour)%24}時（目安）`,w/2,h-27,28,C.ink,'center');}
function sphere(c,w,h,p){paper(c,w,h);let cx=w*.34,cy=h*.49,r=h*.36,L=p.level||0;ellipse(c,cx,cy,r*1.16,r*.25,'#88aeb9',[],'#dce9e970');person(c,cx,cy,1.4);text(c,'観測者',cx+38,cy+32,28);
 const upper=[];for(let a=0;a<=180;a+=2)upper.push([cx+r*cos(a),cy-r*sin(a)]);line(c,upper,L>=2?C.blue:C.pale,3);for(let k of [.35,.7]){c.beginPath();c.ellipse(cx,cy,r*k,r,0,Math.PI,TAU);c.strokeStyle='#a3c5d470';c.stroke();}
 if(L>=1){for(let i=0;i<9;i++){let a=16+i*18;dot(c,cx+r*cos(a),cy-r*sin(a),5,C.gold);if(i%3===1)line(c,[[cx,cy-30],[cx+r*cos(a),cy-r*sin(a)]],'#cfb16b65',1,[4,5]);}}
 if(L>=3){text(c,'天頂',cx,cy-r-27,29,C.red,'center');text(c,'地平線',cx+r+40,cy,29,C.blue);line(c,[[cx,cy-52],[cx,cy-r]],C.red,2,[5,5]);}
 if(L>=4){const low=[];for(let a=180;a<=360;a+=2)low.push([cx+r*cos(a),cy-r*sin(a)]);line(c,low,C.blue,2,[6,7]);text(c,'地面の下の空も含む',cx,cy+r+34,26,C.blue,'center');}if(p._step>3&&p._step<4){c.save();c.globalAlpha=Math.sin((p._step-3)*Math.PI);ellipse(c,cx,cy,r+12,r+12,C.red);c.restore();}
 text(c,L<2?'見える方向を写す':'天球',w*.77,h*.30,L<2?36:58,L<2?C.ink:C.red,'center');text(c,'星までの距離は考えない',w*.77,h*.53,32,C.ink,'center');text(c,'自分を中心に、空を表す',w*.77,h*.7,32,C.ink,'center');}
function record(c,w,h,p){paper(c,w,h);let hour=p.hour??8,cx=w*.47,cy=h*.73,R=Math.min(w*.31,h*.57);const pr=v=>[cx+R*(v.e*.9+v.n*.28),cy-R*(v.u*.86+v.n*.24)];let rim=[];for(let a=0;a<=360;a+=3)rim.push(pr({e:sin(a),n:cos(a),u:0}));line(c,rim,'#7398a8',2);
 for(let az=0;az<180;az+=30){let pts=[];for(let a=0;a<=180;a+=3)pts.push(pr({e:cos(a)*sin(az),n:cos(a)*cos(az),u:sin(a)}));line(c,pts,'#86adbd60',1.5);}
 for(const [a,t] of [[0,'北'],[90,'東'],[180,'南'],[270,'西']]){let q=pr({e:1.13*sin(a),n:1.13*cos(a),u:0});text(c,t,...q,25,C.ink,'center');}
 let v=H((hour-12)*15,0),q=pr(v),end={e:v.e+.06,n:v.n-.08,u:v.u+.24},pe=pr(end);const se={e:end.e-end.u/v.u*v.e,n:end.n-end.u/v.u*v.n,u:0},shadow=pr(se);
 line(c,[[cx,cy],shadow],'#24232160',8);dot(c,cx,cy,6,C.ink);line(c,[pr({e:v.e*1.33,n:v.n*1.33,u:v.u*1.33}),[cx,cy]],'#d5a43a',2,[6,4]);line(c,[q,pe],'#987046',9);dot(c,...q,5,C.red);text(c,'ペン先',pe[0]+18,pe[1]-8,26);
 for(let hh=8;hh<=hour+.001;hh++){let pt=pr(H((hh-12)*15,0));dot(c,...pt,5,C.red);}
 text(c,`${Math.round(hour)}時の記録`,w/2,33,32,C.ink,'center');text(c,'先端の影＝中心 O',w/2,h-22,28,C.red,'center');
 for(let hh=8;hh<=11;hh++)text(c,`${hh}時`,w*.26+(hh-8)*w*.16,91,26,hh<=hour+.001?C.red:'#96938d','center');
 if(p._step>0){ellipse(c,cx,cy,18,9,C.red);arrow(c,[cx-100,cy+50],[cx-10,cy+8],C.red,2);}}
function opposite(c,w,h,p){paper(c,w,h);let r=h*.29,cy=h*.52;
 for(let i=0;i<2;i++){let cx=w*(i?.73:.27),phase=(p.turn||0)*(i?-1:1),horizon=i?cy-r*.5:cy+r*.75;const pts=[];for(let a=0;a<=360;a+=2){let x=cx+r*cos(a),y=cy-r*sin(a);let visible=y<horizon;line(c,[[x,y],[cx+r*cos(a+2),cy-r*sin(a+2)]],visible?C.blue:'#b1b8bd',2,visible?[]:[2,3]);}line(c,[[cx-r-40,horizon],[cx+r+40,horizon]],'#747a70',2);dot(c,cx,cy,5,C.red);let a=90+phase;dot(c,cx+r*cos(a),cy-r*sin(a),11,C.gold);let trail=[];for(let t=0;t<=Math.abs(phase);t+=2){let b=90+t*(i?-1:1);trail.push([cx+r*cos(b),cy-r*sin(b)]);}line(c,trail,C.red,3);if(trail.length>2)arrow(c,trail.at(-2),trail.at(-1),C.red,3);
 text(c,i?'南の方向を見る':'北の方向を見る',cx,35,34,C.ink,'center');text(c,i?'天の南極（地平線の下）':'天の北極',cx,cy+35,26,C.ink,'center');text(c,i?'時計回り':'反時計回り',cx,h-25,32,C.red,'center');}
 text(c,'同じ回転',w*.5,h*.36,28,C.ink,'center');text(c,'← 視線 →',w*.5,h*.55,26,C.blue,'center');}
function latitude(c,w,h,p){paper(c,w,h);for(let i=0;i<3;i++)panel(c,i*w/3,0,w/3,h,(c,pw,ph)=>{let lat=[90,0,-35][i],cx=pw/2,cy=ph*.53,R=ph*.32;const pr=v=>[cx+R*(v.n*cos(20)+v.e*sin(20)),cy+R*(.28*(v.e*cos(20)-v.n*sin(20))-.96*v.u)];
 ellipse(c,cx,cy,R,R,'#aec4cb');let rim=[];for(let a=0;a<=360;a+=3)rim.push(pr({e:sin(a),n:cos(a),u:0}));line(c,rim,C.ink,2);person(c,cx,cy,.75);
 for(let dec of [-35,0,35]){for(let a=0;a<360;a+=3){let v=H(a,dec,lat),u=H(a+3,dec,lat);line(c,[pr(v),pr(u)],v.u>=0?C.blue:'#b9c2c5',v.u>=0?2.5:1,v.u>=0?[]:[2,4]);}let q=H((p.hours||0)*15-50,dec,lat);if(q.u>=0)dot(c,...pr(q),6,C.gold);}
 let pole=H(0,i===2?-90:90,lat),q=pr(pole);line(c,[[cx,cy],q],C.red,2,[5,4]);dot(c,...q,5,C.red);text(c,['北極','赤道','南半球（南緯35°）'][i],cx,33,30,C.ink,'center');text(c,['水平に回る','垂直に昇り、沈む','天の南極を中心に回る'][i],cx,ph-28,27,C.blue,'center');text(c,i===2?'天の南極':'天の北極',q[0]+(i===1?-10:0),q[1]-25,23,C.red,i===1?'right':'center');});}
function altitude(c,w,h,p){paper(c,w,h);panel(c,0,0,w*.48,h,sunDay,p);let x=w*.6,y=h*.79,R=h*.57,ang=Math.max(0,Astro.solarAltitude(p.hour,0));line(c,[[x-60,y],[w-35,y]],C.ink,2);person(c,x,y,1.2);let q=[x+R*cos(ang),y-R*sin(ang)];dot(c,...q,17,'#eeb74b');line(c,[[x,y],q],C.gold,3);if(p.angle>0){let pts=[];for(let a=0;a<=ang;a+=1)pts.push([x+95*cos(a),y-95*sin(a)]);line(c,pts,C.red,3);text(c,`${ang.toFixed(0)}°`,x+125,y-52,39,C.red);text(c,Math.abs(p.hour-12)<.01?'南中高度':'高度',w*.78,70,38,C.red,'center');}else text(c,'地平線から測る',w*.78,70,34,C.ink,'center');text(c,'地平線',w-40,y+40,27,C.ink,'right');}
function seasons(c,w,h,p){paper(c,w,h);let cx=w*.43,base=h*.83,R=h*.73;const pr=v=>[cx-Math.atan2(v.e,-v.n)/(Math.PI/2)*w*.25,base-v.u*R];line(c,[[65,base],[w*.84,base]],'#92988b',2);person(c,cx,base,1.2);for(const [i,dec,col,name]of [[0,23.4,C.red,'夏至'],[1,0,C.blue,'春分・秋分'],[2,-23.4,'#6f7887','冬至']]){let pts=[];for(let hh=0;hh<=24;hh+=.05){let v=H((hh-12)*15,dec);if(v.u>=0)pts.push(pr(v));}line(c,pts,col,3);let q=pr(H(0,dec));dot(c,...q,8,col);text(c,name,q[0]+25,q[1]-15,27,col);let begin=pts[0],end=pts.at(-1);dot(c,...begin,5,col);dot(c,...end,5,col);}
 text(c,'南',cx,base+38,28,C.ink,'center');text(c,'東側',75,base+38,27);text(c,'西側',w*.81,base+38,27,C.ink,'right');text(c,'北緯35°',w*.91,42,29,C.ink,'center');for(let [j,t]of ['高い','↑','南中高度','↓','低い'].entries())text(c,t,w*.91,130+j*53,j===2?25:29,C.ink,'center');}
function recordExercise(c,w,h,p){paper(c,w,h);let xs=[w*.10,w*.46,w*.64,w*.82],ys=[h*.70,h*.42,h*.28,h*.14];line(c,xs.map((x,i)=>[x,ys[i]]),C.blue,4);for(let i=0;i<4;i++){dot(c,xs[i],ys[i],8,C.red);text(c,['日の出','8時','9時','10時'][i],xs[i],ys[i]-45,34,C.ink,'center');}for(let i=0;i<3;i++)text(c,i?'3 cm':'6 cm',(xs[i]+xs[i+1])/2,(ys[i]+ys[i+1])/2+65,36,C.red,'center');text(c,'記録の道すじを取り出して、長さを比べる',w/2,h-37,32,C.ink,'center');}
const render=(canvas,scene,p={})=>{const c=canvas.getContext('2d'),w=canvas.width,h=canvas.height;bounds=[];c.clearRect(0,0,w,h);c.lineCap='round';c.lineJoin='round';
 switch(scene){
 case 'cover':cover(c,w,h);break;
 case 'sunDay':sunDay(c,w,h,p);break;
 case 'sphereModel':sphere(c,w,h,p);break;
 case 'sphereProjection':sphereProjection(c,w,h,p);break;
 case 'sphereTerms':sphereTerms(c,w,h,p);break;
 case 'recordSun':panel(c,0,0,w*.47,h,sunDay,p);panel(c,w*.49,0,w*.51,h,record,p);break;
 case 'axisLesson':old(canvas,'learnAxis',p);break;
 case 'spinViews':panel(c,0,0,w*.49,h,earth,p);panel(c,w*.51,0,w*.49,h,tilted,p);break;
 case 'pairedDay':panel(c,0,0,w*.49,h,sunDay,p);panel(c,w*.51,0,w*.49,h,earth,p);break;
 case 'clockLesson':panel(c,0,0,w*.49,h,sunDay,p);panel(c,w*.51,0,w*.49,h,earth,{...p,clock:true});break;
 case 'localDirections':panel(c,0,0,w*.60,h,earth,{...p,directions:true});paperRegion(c,w*.62,0,w*.38,h);text(c,'北極に向かう → 北',w*.81,h*.27,35,C.blue,'center');text(c,'この地点で進む → 東',w*.81,h*.52,35,C.red,'center');text(c,'観測者を基準にする',w*.81,h*.77,30,C.ink,'center');break;
 case 'oppositeViews':opposite(c,w,h,p);break;
 case 'sphereViewpoint':viewpoint(c,w,h,p);break;
 case 'latitudeLesson':latitude(c,w,h,p);break;
 case 'sunAltitude':altitude(c,w,h,p);break;
 case 'seasonPaths':seasons(c,w,h,p);break;
 case 'anglePractice':old(canvas,'rate',{angle:75});c.fillStyle='#132d40';c.fillRect(w*.56,45,w*.43,h-60);text(c,'75° 動いた',w*.77,h*.32,58,'#f3c977','center');text(c,p.level>=2?'5時間':'何時間？',w*.77,h*.59,60,'#f1f5f7','center');break;
 case 'recordPractice':recordExercise(c,w,h,p);break;
 case 'clockPractice':panel(c,0,0,w*.58,h,earth,{hour:18+(p.level>=2?(p.level-2)*6:0),clock:p.level>=3});paperRegion(c,w*.60,0,w*.4,h);text(c,'日の入りから',w*.80,h*.28,35,C.ink,'center');text(c,'6時間後は？',w*.80,h*.46,44,C.red,'center');if(p.level>=2)text(c,'反時計回りに90°',w*.80,h*.70,34,C.blue,'center');break;
 case 'memory':paper(c,w,h);break;
 default:old(canvas,scene,p);
 }
 window.SeedDiagramBounds=bounds;
};
function paperRegion(c,x,y,w,h){c.fillStyle=C.paper;c.fillRect(x,y,w,h);}
function viewpoint(c,w,h,p){
 paper(c,w,h);const split=w*.55,cx=split*.48,cy=h*.51,R=h*.35,facing=p.facing??1,phase=(p.hours||0)*15;
 const pr=v=>[cx+R*(v.n*cos(20)+v.e*sin(20)),cy+R*(.28*(v.e*cos(20)-v.n*sin(20))-.96*v.u)];
 text(c,'一つの天球',cx,30,32,C.ink,'center');
 ellipse(c,cx,cy,R,R,'#8baebb');
 let rim=[];for(let a=0;a<=360;a+=3)rim.push(pr({e:sin(a),n:cos(a),u:0}));line(c,rim,C.blue,2);c.beginPath();rim.forEach((q,i)=>i?c.lineTo(...q):c.moveTo(...q));c.fillStyle='#c1d3ce35';c.fill();
 for(let dec of [-45,0,45]){for(let a=0;a<360;a+=4){const v=H(a,dec),u=H(a+4,dec);line(c,[pr(v),pr(u)],v.u>=0?'#6797ae':'#adbfc780',v.u>=0?2:1,v.u>=0?[]:[3,5]);}for(let a of [0,90,180,270]){let v=H(a+phase,dec),q=pr(v);dot(c,...q,5,v.u>=0?C.gold:'#c6c6bb');}}
 const np=pr(H(0,90)),sp=pr(H(0,-90));line(c,[sp,np],C.blue,2,[6,5]);dot(c,...np,5,C.blue);dot(c,...sp,5,C.blue);text(c,'天の北極',np[0]+18,np[1]-20,25,C.blue);text(c,'天の南極',sp[0]-15,sp[1]+30,25,C.blue,'right');
 for(const [n,v,align] of [['北',{e:0,n:1.12,u:0},'left'],['南',{e:0,n:-1.12,u:0},'right']]){let q=pr(v);text(c,n,...q,28,C.ink,align);}
 person(c,cx,cy,1.15);dot(c,cx+facing*9,cy-41,3,C.red);
 const end=[cx+facing*R*.73,cy-R*.35];arrow(c,[cx+facing*20,cy-30],end,C.red,4);text(c,facing>.05?'北を向く':facing<-.05?'南を向く':'振り向く',cx,cy+70,31,C.red,'center');
 text(c,'観測者は、同じ場所にいる',cx,h-28,27,C.ink,'center');
 // Turning changes only the view. The celestial rotation uses the same positive phase throughout.
 const view=facing>=0?'north':'south';c.fillStyle=C.night;c.fillRect(split,0,w-split,h);prior(c,split,0,w-split,h-70,'sky',{hours:p.hours||0,view});
 c.save();c.fillStyle='#132534ee';c.fillRect(split+18,h-67,w-split-36,55);text(c,facing>=0?'北を見る → 反時計回り':'南を見る → 時計回り',split+(w-split)/2,h-39,28,'#f5d69b','center');c.restore();
}
function starMark(c,x,y,r,color){c.beginPath();for(let i=0;i<10;i++){let a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.43:r;let q=[x+rr*Math.cos(a),y+rr*Math.sin(a)];i?c.lineTo(...q):c.moveTo(...q);}c.closePath();c.fillStyle=color;c.fill();}
function sphereProjection(c,w,h,p){
 paper(c,w,h);const level=p.level||0,cx=w*.28,cy=h*.81,R=h*.43,progress=Math.max(0,Math.min(1,level-1));
 const q=(a,r)=>[cx+r*cos(a),cy-r*sin(a)];
 if(level>=1){c.save();c.globalAlpha=Math.min(1,level-1);c.beginPath();c.arc(cx,cy,R,Math.PI,TAU);c.closePath();c.fillStyle='#e9eff4';c.fill();c.strokeStyle=C.blue;c.lineWidth=3;c.stroke();c.restore();}
 line(c,[[cx-R-55,cy],[cx+R+55,cy]],C.ink,3);
 const stars=[[145,340],[94,345],[40,405]];
 for(const [a,r] of stars){const end=q(a,r);line(c,[[cx,cy],end],'#babcb9',2,[7,8]);starMark(c,...end,14,'#929793');if(level>1)starMark(c,...q(a,r+(R-r)*progress),16,C.red);}
 person(c,cx,cy,1.4);text(c,'観測者',cx,cy+43,28,C.ink,'center');
 const tx=w*.59;text(c,'本当の星までの距離は、ばらばら。',tx,85,32);
 if(level>=2){text(c,'見える方向をそろえたまま',tx,177,33);text(c,'同じ球面に写して考える。',tx,225,33,C.red);}
 if(level>=3){text(c,'天球',tx,326,55,C.red);text(c,'＝ 見かけの球',tx+140,326,33);}
 if(level>=4)text(c,'プラネタリウムの天井のように。',tx,411,29,C.blue);
}
function sphereTerms(c,w,h,p){
 paper(c,w,h);const level=p.level||0,cx=w*.29,cy=h*.49,R=h*.37;
 const pr=v=>[cx+R*(v.n*cos(20)+v.e*sin(20)),cy+R*(.28*(v.e*cos(20)-v.n*sin(20))-.96*v.u)];
 ellipse(c,cx,cy,R,R,'#90a7b2',[], '#edf2f6');
 const rim=[];for(let a=0;a<=360;a+=3)rim.push(pr({e:sin(a),n:cos(a),u:0}));
 line(c,rim,level>=2?C.blue:'#b5c0c5',level>=2?4:2);person(c,cx,cy,1.15);text(c,'観測者',cx-35,cy+5,26,C.ink,'right');
 const zen=[cx,cy-R],np=pr(H(0,90)),sp=pr(H(0,-90));
 if(level>=3){line(c,[sp,np],C.blue,2,[8,7]);text(c,'地軸を延ばした方向',w*.57,385,29,C.blue);}
 const callout=(num,pt,label,x,y)=>{const left=x<pt[0];dot(c,...pt,6,C.red);line(c,[pt,[x+(left?24:-24),y]],C.red,2);dot(c,x,y,17,C.red);text(c,String(num),x,y,23,'#fff','center');text(c,label,x+(left?-30:30),y,29,C.ink,left?'right':'left');};
 if(level>=1)callout(1,zen,'天頂',cx+65,38);
 if(level>=2)callout(2,pr({e:1,n:0,u:0}),'地平線',cx+R+70,cy+76);
 if(level>=3)callout(3,np,'天の北極',cx+R+65,cy-118);
 if(level>=4)callout(4,sp,'天の南極',cx-R-135,cy+153);
 text(c,'空全体を、ひとつの球に',w*.60,85,33);
 if(level>=1)text(c,'真上の点を見つけよう。',w*.60,157,29);
 if(level>=2)text(c,'水平な線より下は、地面の向こう。',w*.60,220,29);
 if(level>=4)text(c,'日本では、天の南極は地平線の下。',w*.60,293,29,C.red);
}
Astro.render=render;Astro.skyColors=skyColors;
})();
