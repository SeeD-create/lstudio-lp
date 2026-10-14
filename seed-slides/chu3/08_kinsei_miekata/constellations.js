/* Direction models, not an ephemeris. Constellations stay fixed in inertial space. */
(()=>{'use strict';
const original=Astro.render,D=Math.PI/180,TAU=2*Math.PI;
const C={ink:'#f5f0e5',muted:'#b9c9d3',blue:'#62b0d0',gold:'#e4bd70',red:'#e36369'};
let c,bounds=[];
const xy=(x,y,r,a)=>[x+r*Math.cos(a*D),y-r*Math.sin(a*D)];
function text(t,x,y,size=27,col=C.ink){c.font=`600 ${size}px "Zen Kaku Gothic New","Yu Gothic",sans-serif`;c.textAlign='center';c.textBaseline='middle';c.fillStyle=col;c.fillText(t,x,y);let w=c.measureText(t).width;bounds.push({text:t,l:x-w/2,r:x+w/2,t:y-size*.65,b:y+size*.65});}
function line(a,b,col=C.muted,width=2,dash=[]){c.beginPath();c.moveTo(...a);c.lineTo(...b);c.strokeStyle=col;c.lineWidth=width;c.setLineDash(dash);c.stroke();c.setLineDash([]);}
function circle(x,y,r,col,stroke){c.beginPath();c.arc(x,y,r,0,TAU);if(col){c.fillStyle=col;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
function arrow(a,b,col=C.gold,width=3){line(a,b,col,width);const q=Math.atan2(b[1]-a[1],b[0]-a[0]);line(b,[b[0]-12*Math.cos(q-.45),b[1]-12*Math.sin(q-.45)],col,width);line(b,[b[0]-12*Math.cos(q+.45),b[1]-12*Math.sin(q+.45)],col,width);}
function person(x,y,a,scale=.8){c.save();c.translate(x,y);c.rotate(Math.PI/2-a*D);circle(0,-35*scale,7*scale,C.red);line([0,-28*scale],[0,-10*scale],C.red,4);line([-11*scale,-16*scale],[0,-23*scale],C.red,3);line([11*scale,-16*scale],[0,-23*scale],C.red,3);line([0,-10*scale],[-8*scale,0],C.red,3);line([0,-10*scale],[8*scale,0],C.red,3);c.restore();}
function earth(x,y,r,sunA,spin){
 const g=c.createRadialGradient(x-r*.3,y-r*.35,0,x,y,r);g.addColorStop(0,'#72b7c9');g.addColorStop(1,'#294c68');circle(x,y,r,g);
 c.save();c.beginPath();c.arc(x,y,r,0,TAU);c.clip();
 for(let a=0;a<180;a+=30)line(xy(x,y,r,a+spin),xy(x,y,r,a+spin+180),'#cbe5ed65',1);
 for(let k=1;k<4;k++)circle(x,y,r*k/4,null,'#cbe5ed50');
 c.translate(x,y);c.rotate(-sunA*D);c.fillStyle='#031020b5';c.fillRect(-r,-r,r,r*2);c.restore();circle(x,y,3,'#fff');
}
const names=['ペガスス座','オリオン座','しし座','さそり座'];
const patterns=[[[0,-12],[22,-8],[21,12],[-2,14],[0,-12]], [[-15,-18],[13,-18],[8,-2],[-7,2],[-17,22],[18,22],[8,-2]], [[15,-20],[0,-15],[-8,-2],[4,7],[24,15],[-20,15],[-8,-2]], [[-16,-20],[-3,-10],[6,0],[14,13],[6,23],[-8,20],[-13,12]]];
function constellation(id,x,y,scale=1,col=C.gold){const pts=patterns[id];for(let i=1;i<pts.length;i++)line([x+pts[i-1][0]*scale,y+pts[i-1][1]*scale],[x+pts[i][0]*scale,y+pts[i][1]*scale],col,1.5);for(const p of pts)circle(x+p[0]*scale,y+p[1]*scale,3,col);}
function directionName(angle){let q=((angle%360)+360)%360,idx=Math.round(q/90)%4;return Math.abs(((q-idx*90+540)%360)-180)<2?names[idx]:'方向が変化中';}
function seasonName(a){const q=((a%360)+360)%360;return directionName(a)==='方向が変化中'?'公転中':['秋','冬','春','夏'][Math.round(q/90)%4];}
function metrics(a,hour){const south=a+(hour-24)*15;return{south,east:south+90,west:south-90,north:south+180};}
function constellationView(s,p,step){
 const a=p.a??90,hour=p.hour??24,reveal=p.reveal??3,m=metrics(a,hour),mode=s.mode||'setup';
 const sun=[350,252],ep=xy(...sun,95,a);
 text('太陽と地球と、遠くの星座',350,26,28);
 circle(...sun,95,null,'#7992a460');circle(...sun,25,C.gold);text('太陽',350,296,23,C.gold);
 if(reveal>=1){const points=[[637,250],[350,73],[66,250],[350,424]];for(let i=0;i<4;i++){const q=points[i];constellation(i,...q,1.25);text(names[i],i===1?493:q[0],i===1?76:q[1]+43,24,C.ink);}}
 earth(...ep,23,a+180,m.south);if(reveal>=2)person(...xy(...ep,23,m.south),m.south,.42);
 if(mode==='sunward'&&step>=1){arrow(ep,xy(...ep,180,a+180),C.gold,3);}
 else if(reveal>=3&&(mode!=='question'||step>=2)){const da=m[s.target||'south'];arrow(ep,xy(...ep,94,da),C.red,3);}
 text(`${seasonName(a)}の位置`,95,448,26,C.blue);
 line([725,70],[725,443],'#5b788855');
 if(reveal<2){text(reveal===0?'太陽を回るのは、地球':'星座は、遠くの背景',1210,215,37,C.gold);text('次に、地球上の観測者に注目',1210,300,27,C.muted);return;}
 text('地球上の一人と、その人の方位',1010,27,27);
 const center=[1010,258],radius=66,pp=xy(...center,radius,m.south);
 earth(...center,radius,a+180,m.south);person(...pp,m.south,1);
 // North points toward the pole in this polar projection; letters stay upright.
 for(const dir of ['north','east','south','west']){
  const label={north:'北',east:'東',south:'南',west:'西'}[dir],ang=m[dir],color=dir==='north'?C.blue:dir===s.target?C.red:C.gold;
  const start=dir==='south'?45:8,end=dir==='north'?57:85;
  arrow(xy(...pp,start,ang),xy(...pp,end,ang),color,2);text(label,...xy(...pp,end+22,ang),25,color);
 }
 for(const k of [-1,0,1]){const t=a+180;const start=xy(...center,165,t),end=xy(...center,100,t);const off=[k*24*Math.cos((t+90)*D),-k*24*Math.sin((t+90)*D)];arrow([start[0]+off[0],start[1]+off[1]],[end[0]+off[0],end[1]+off[1]],'#e4bd7070',2);}
 const normalized=((hour%24)+24)%24,h=Math.floor(normalized),min=Math.round((normalized-h)*60);
 const timeName=Math.abs(hour-18)<.02?'夕方':Math.abs(hour-24)<.02?'真夜中':Math.abs(hour-30)<.02?'明け方':'時刻を変更中';
 text(`${timeName}　${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`,1010,451,30,C.gold);
 line([1240,75],[1240,430],'#5b788855');
 const target=s.target||'south',targetJP={east:'東',west:'西',south:'南'}[target];
 if(mode==='question'){
  text(`この人の「${targetJP}」には？`,1470,126,31);
  if(step>=3){text(s.answer,1470,243,42,C.gold);const id=names.indexOf(s.answer);if(id>=0)constellation(id,1470,330,1.9);}
  else{text('？',1470,255,76,C.gold);text(step>=2?'矢印の先の星座を選ぼう':'まず、人の位置を確かめよう',1470,367,24,C.muted);}
 }else if(mode==='sunward'){
  text('太陽の先の方向',1470,127,30);text(step>=1?directionName(a+180):'？',1470,225,39,C.gold);
  if(step>=2){text('昼の空に重なる',1470,320,31);text('肉眼では見えにくい',1470,382,25,C.muted);}
 }else{
  text('この人から見た方向',1470,112,28);
  for(const [j,dir] of ['east','south','west'].entries()){text({east:'東',south:'南',west:'西'}[dir],1315,208+j*85,29,C.blue);text(directionName(m[dir]),1490,208+j*85,29,C.gold);}
 }
 window.SeedConstellationModel={a,hour,...m,answers:{east:directionName(m.east),south:directionName(m.south),west:directionName(m.west)}};
}
function northConstellation(s,p,step){
 const x=525,y=257,r=155,turn=p.turn||0,question=s.mode==='question';
 text('北を向いた空',525,28,30);circle(x,y,r,null,'#acc2d080');
 for(let i=0;i<12;i++){const a=i*30,pt=[x-r*Math.sin(a*D),y-r*Math.cos(a*D)];line([x,y],pt,'#b9c9d32f',1,[5,6]);if(question)text('あいうえおかきくけこさし'[i],x-(r+27)*Math.sin(a*D),y-(r+27)*Math.cos(a*D),24,C.gold);}
 function w(angle,ghost){const nodes=[[0,-155],[22,-124],[41,-144],[60,-112],[84,-131]],rotate=([u,v])=>[x+u*Math.cos(angle*D)+v*Math.sin(angle*D),y-u*Math.sin(angle*D)+v*Math.cos(angle*D)];
  for(let i=1;i<nodes.length;i++)line(rotate(nodes[i-1]),rotate(nodes[i]),ghost?'#a6bcc250':C.gold,2,ghost?[4,5]:[]);
  for(const node of nodes)circle(...rotate(node),ghost?3:4,ghost?'#b9c9d350':'#fff2cf');
  if(!ghost){const a=rotate(nodes[0]);circle(...a,8,null,C.red);text('A',a[0]+15,a[1]+22,23,C.red);}
 }
 w(0,true);w(turn,false);circle(x,y,5,C.gold);text('天の北極',x,y+30,24,C.ink);text('北極星は、この近く',525,482,24,C.muted);
 text('西',170,432,27,C.blue);text('東',875,432,27,C.blue);
 line([955,60],[955,444],'#5b788855');
 if(question){text('3月1日 21時の星Aは「あ」',1330,74,29);text('5月1日 19時には、どこ？',1330,136,33,C.gold);
  const month=p.month||0,hour=p.hour??21; text(`比較：${Math.round(3+month)}月1日　${hour.toFixed(hour%1?1:0)}時`,1330,229,30);
  if(step>=3){text('い',1330,330,60,C.red);text('反時計回りに約30°',1330,422,29,C.gold);}else text(step===0?'あ〜しから選ぼう':step===1?'時刻は21時に固定':'日付は5月1日に固定',1330,350,31,C.blue);
 }else{
  text(step<2?'基準の位置':step===2?'同じ夜の2時間後':'同じ時刻の2か月後',1330,144,36,C.gold);
  text(step<2?'北極星の近くを中心に見る':step===2?'1時間 … 約15°':'1か月 … 約30°',1330,241,30);
  text(step<2?'Wの形も、星Aも一緒に回る':step===2?'2時間 … 約30°':'2か月 … 約60°',1330,328,30);
  if(step>=2)text('反時計回り',1330,420,32,C.blue);
 }
 window.SeedNorthModel={turn,choice:'あいうえおかきくけこさし'[((Math.round(turn/30)%12)+12)%12]};
}
const zodiac=['おひつじ座','おうし座','ふたご座','かに座','しし座','おとめ座','てんびん座','さそり座','いて座','やぎ座','みずがめ座','うお座'];
// Simplified star-line landmarks. Fixed drawings, not dated observing charts.
const zodiacShapes=[
 [[-28,7],[-8,-9],[14,-3],[23,10]],
 [[-30,-21],[-10,1],[0,14],[11,0],[29,-22]],
 [[-23,-25],[-18,-3],[-25,24],[-18,-3],[3,4],[16,25],[3,4],[18,-20],[28,-25]],
 [[0,-27],[2,-2],[-25,20],[2,-2],[24,19]],
 [[22,-26],[4,-23],[-7,-8],[2,4],[28,21],[-27,21],[-7,-8]],
 [[-29,-19],[-8,-6],[15,-21],[-8,-6],[5,10],[30,21],[5,10],[-20,25]],
 [[-27,-5],[0,-25],[28,-1],[-27,-5],[0,23],[28,-1]],
 [[-22,-25],[-6,-10],[10,9],[13,25],[-4,30],[-20,18]],
 [[-27,4],[-11,-14],[11,-13],[24,8],[-27,4],[-11,23],[24,8]],
 [[-29,-17],[28,-12],[13,20],[-7,27],[-29,-17]],
 [[-29,-13],[-12,-20],[2,-10],[15,-19],[28,-2],[10,9],[-8,24]],
 [[-31,-4],[-20,-17],[-9,-5],[-21,5],[-31,-4],[-21,5],[13,18],[26,-4],[16,-18],[7,-5],[26,-4]]
];
function zodiacFigure(id,x,y,scale=1){const pts=zodiacShapes[id];for(let i=1;i<pts.length;i++)line([x+pts[i-1][0]*scale,y+pts[i-1][1]*scale],[x+pts[i][0]*scale,y+pts[i][1]*scale],'#9bbdd3',1.5);for(const [u,v]of pts)circle(x+u*scale,y+v*scale,2.8,'#edf3ff');}
function solarYear(s,p,step){
 const a=p.a||0,cx=445,cy=252,rx=310,ry=159;
 const proj=(r,angle)=>[cx+rx*r*Math.cos(angle*D),cy-ry*r*Math.sin(angle*D)];
 text('地球から、太陽の先を見る',445,28,30);
 c.beginPath();c.ellipse(cx,cy,rx,ry,0,0,TAU);c.strokeStyle='#8b9eae70';c.lineWidth=2;c.stroke();
 c.beginPath();c.ellipse(cx,cy,rx*.42,ry*.42,0,0,TAU);c.strokeStyle='#8b9eae70';c.stroke();
 const full=s.mode==='zodiac',close=s.closeView===true,letters=s.mode==='question';
 if(close){for(let i=0;i<4;i++){const angle=180+i*30;zodiacFigure(i,...proj(1,angle),.63);text(zodiac[i],...proj(1.27,angle),20);}}
 else for(let i=0;i<(full?12:4);i++){
  const angle=180+i*(full?30:90),q=proj(1,angle);circle(...q,4,C.ink);text(full?zodiac[i]:'ABCD'[i],...proj(1.19,angle),full?21:29,C.ink);
  if(full)zodiacFigure(i,...proj(.89,angle),.38);
  else if(!letters){zodiacFigure(i*3,...q,.65);}
 }
 const ep=proj(.42,a),end=proj(1,a+180);circle(cx,cy,24,C.gold);earth(...ep,18,a+180,0);
 text('地球',ep[0]+48,ep[1]+18,22,C.blue);
 if(s.mode!=='intro'||step>=2){arrow(ep,end,C.gold,3);circle(...end,12,null,C.gold);}
 if(s.mode==='intro'&&step>=1){const out=proj(1,a);arrow(ep,out,C.blue,3);text('夜に向く方向',445,458,25,C.blue);}
 else text('外側の円は、遠くの方向の目印',445,close?65:471,close?22:24,C.muted);
 line([885,65],[885,438],'#5b788855');
 if(s.mode==='zodiac'){
  text('黄道十二星座',1290,92,39,C.gold);text('伝統的な12の星座',1290,166,29);
  text('実際の星座の広さは、等しくない',1290,287,27);
  if(step>=2){text('現在の星座境界では',1290,370,25,C.muted);text('へびつかい座も黄道にかかる',1290,414,27,C.muted);}
 }else if(s.mode==='question'){
  text('半年後の太陽の方向は？',1290,108,33);text('最初はAの方向',1290,183,28,C.muted);
  text(step>=3?'Cの方向':'A・B・C・Dから選ぼう',1290,301,step>=3?49:31,C.gold);
  if(step>=3)text('最初と、ほぼ反対の方向',1290,402,29);
 }else{
  text(close?'隣り合う星座を、大きく見る':'星座を背景に、一年分を展開',1290,68,29);
  const x0=1010,x1=1610,y=285,total=close?90:360,ids=close?[0,1,2,3]:[0,3,6,9,0];
  for(let i=0;i<ids.length;i++){const x=x0+(x1-x0)*i/(ids.length-1);zodiacFigure(ids[i],x,213,close?1.1:.85);text(zodiac[ids[i]],x,146,close?24:21);}
  line([x0,y],[x1,y],'#b7cad740',1,[5,6]);
  const plotA=Math.max(0,Math.min(total,a)),px=x0+(x1-x0)*plotA/total;
  if(px>x0)line([x0,y],[px,y],C.gold,5);
  circle(px,y,16,C.gold);text('太陽',px,337,24,C.gold);
  arrow([x0,389],[x1,389],C.gold,2);text('西',x0,425,25);text('東',x1,425,25);
  text(step>=3?'金色の線は、地球から見た太陽の軌跡':'星座は固定。太陽の位置だけを追う',1290,472,24,C.gold);
  window.SeedSolarTrail={angle:plotA,total,x0,end:px,y,ids};
 }
 window.SeedSolarYearModel={a,longitude:((a+180)%360+360)%360};
}
function eclipticPath(s,p,step){
 const x=635,y=255,rx=414,ry=161,progress=p.progress||0;
 c.beginPath();c.ellipse(x,y,rx,ry,-.12,0,TAU);c.strokeStyle='#b9c9d347';c.lineWidth=2;c.stroke();
 earth(x,y,45,0,0);text('地球',x,y+79,27,C.blue);
 const pt=a=>{let xx=rx*Math.cos(a),yy=ry*Math.sin(a);return[x+xx*Math.cos(-.12)-yy*Math.sin(-.12),y+xx*Math.sin(-.12)+yy*Math.cos(-.12)];};
 c.beginPath();for(let i=0;i<=Math.max(1,Math.round(progress*180));i++){let a=-i/180*TAU,q=pt(a);i?c.lineTo(...q):c.moveTo(...q);}c.strokeStyle=C.gold;c.lineWidth=5;c.stroke();
 const sun=pt(-progress*TAU);line([x,y],sun,'#e4bd7070',2,[6,5]);circle(...sun,19,C.gold);
 for(let i=0;i<4;i++){const pos=pt(-i*TAU/4);zodiacFigure(i*3,pos[0]+(i===1?100:0),pos[1]+(i===1?50:-43),.8);text(zodiac[i*3],i===0?1130:i===2?105:pos[0]+(i===1?100:0),i===1?pos[1]+91:i===2?pos[1]:pos[1]+38,23);}
 for(let i=0;i<Math.floor(progress*12);i++)circle(...pt(-i*TAU/12),5,C.gold);
 text('地球を中心にした、天球上の道',635,30,29);
 text(step>=3?'黄道':'太陽の位置をつなぐ',1370,193,step>=3?64:36,C.gold);
 text('太陽の一年の通り道',1370,286,30);text('地球の公転軌道とは別',1370,396,27,C.muted);
}
const scenes={constellationView,northConstellation,solarYear,eclipticPath};
Astro.constellationMetrics=metrics;
Astro.render=function(canvas,s,p,step){if(!scenes[s.scene])return original(canvas,s,p,step);c=canvas.getContext('2d');bounds=[];c.clearRect(0,0,1712,500);const bg=c.createLinearGradient(0,0,1712,500);bg.addColorStop(0,'#071b30');bg.addColorStop(1,'#102a43');c.fillStyle=bg;c.fillRect(0,0,1712,500);scenes[s.scene](s,p,step);window.SeedDiagramBounds=bounds;};
})();
