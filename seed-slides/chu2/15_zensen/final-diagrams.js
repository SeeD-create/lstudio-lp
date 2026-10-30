(()=>{
const C='#c8e1ee',W='#f4d6c5',R='#b95750',B='#397d9e',I='#373d40';
const tx=(x,y,t,z=27,c=I)=>`<text x="${x}" y="${y}" font-size="${z}" fill="${c}">${t}</text>`;
const rect=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${c}"/>`;
const path=(d,c=I,w=4,fill='none')=>`<path d="${d}" stroke="${c}" stroke-width="${w}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"/>`;
const arrow=(x,y,dx,dy,c)=>{const a=Math.atan2(dy,dx),X=x+dx,Y=y+dy;return path(`M${x} ${y} L${X} ${Y}`,c,5)+path(`M${X-19*Math.cos(a-.5)} ${Y-19*Math.sin(a-.5)} L${X} ${Y} L${X-19*Math.cos(a+.5)} ${Y-19*Math.sin(a+.5)}`,c,5)};
const cloud=(x,y,scale=1)=>`<g transform="translate(${x} ${y}) scale(${scale})" fill="#fefefe" stroke="#8c9fab" stroke-width="2"><ellipse cx="0" cy="0" rx="65" ry="23"/><ellipse cx="-27" cy="-20" rx="29" ry="27"/><ellipse cx="12" cy="-32" rx="36" ry="35"/><ellipse cx="43" cy="-13" rx="30" ry="26"/></g>`;
function symbols(kind,x,y,len=520){let o=path(`M${x} ${y} h${len}`,kind==='warm'?R:kind==='cold'?B:kind==='occluded'?'#82568f':'#777',5);for(let a=x+Math.min(50,len/4),j=0;a<x+len-20;a+=Math.min(90,len/2),j++){let warm=kind==='warm'||(kind!=='cold'&&j%2===0),color=kind==='occluded'?'#82568f':warm?R:B,side=kind==='stationary'&&!warm?1:-1;o+=warm?path(`M${a-22} ${y} A22 22 0 0 1 ${a+22} ${y}`,color,3,color):path(`M${a-23} ${y} L${a} ${y+side*38} L${a+23} ${y} Z`,color,2,color)}return o}
function map(kind,step){const k=kind.split('-')[0],cold=k==='cold',oc=k==='occluded',f=cold?230+35*step:k==='stationary'?297:297-22*step;let o=rect(20,50,600,380,oc?'#dde8ed':W);
if(cold){o+=rect(20,50,f-20,380,C)+path(`M${f} 50 V430`,B,5);for(let y=110;y<430;y+=110)o+=path(`M${f} ${y-20} L${f+34} ${y} L${f} ${y+20} Z`,B,2,B);o+=path('M60 250 H580','#555',2)+tx(55,235,'A 西',20)+tx(540,235,'B 東',20)+tx(70,110,'寒気')+tx(500,110,'暖気');if(step)o+=arrow(110,350,120,0,B)}
else{o+=rect(20,50,600,f-50,oc?'#dae7ee':C)+symbols(k,35,f,570)+path('M330 75 V410','#555',2)+tx(345,95,'B 北',20)+tx(345,410,'A 南',20);if(!oc)o+=tx(65,110,'寒気')+tx(65,395,'暖気');else o+=tx(65,110,'寒気')+tx(65,395,'冷気');if(step&&k==='warm')o+=arrow(490,390,0,-70,R)}
if(kind.includes('rain')){o+=rect(cold?f+5:40,cold?60:f-110,cold?55:560,cold?350:80,'#7c98ac55');o+=tx(365,470,'色の帯：雨が降りやすい範囲',19)}return o}
function section(kind,step){const k=kind.split('-')[0],cold=k==='cold',oc=k==='occluded',f=230+(k==='stationary'?0:35*step);let o=rect(20,50,600,380,oc?'#dde8ed':W);
if(oc){o+=path('M20 140 L320 280 L620 140 V430 H20 Z',C,0,C)+path('M20 140 L320 280 L620 140',I,3)+tx(270,145,'暖気')+tx(70,375,'寒気')+tx(490,375,'冷気')+cloud(320,85,.65);}
else{const d=cold?`M20 50 H${f-105} L${f} 430 H20 Z`:`M${f} 430 L620 150 V430 Z`;o+=path(d,C,0,C)+path(cold?`M${f-105} 50 L${f} 430`:`M${f} 430 L620 150`,I,3)+tx(cold?70:490,365,'寒気')+tx(cold?490:70,180,'暖気');if(step){const route=cold?`M550 360 Q${f+45} 350 ${f-25} 105`:'M80 340 Q280 240 540 105';o+=path(route,R,5)+ (cold?arrow(f-10,160,-15,-55,R):arrow(480,135,60,-30,R));for(let j=0;j<4;j++)o+=`<circle r="6" fill="${R}"><animateMotion path="${route}" dur="4s" begin="-${j}s" repeatCount="indefinite"/></circle>`;o+=cloud(cold?f-20:450,cold?100:110,cold?1:.65);if(!cold)o+=cloud(560,90,.55)}}
if(kind.includes('rain')){for(let x=cold?f-15:f+15;x<(cold?f+70:610);x+=24)o+=path(`M${x} 235 l-18 42`,B,2)}
o+=path('M20 430 H620','#8b8171',6)+tx(25,468,'A',22)+tx(595,468,'B',22);return o}
function pair(k,step){return `<g transform="translate(0 0) scale(.77)">${tx(25,30,'上から見た図',29)}${map(k,step)}</g><g transform="translate(510 0) scale(.77)">${tx(25,30,'A–Bで切った縦断面',29)}${section(k,step)}</g>`}
function graph(kind,step){const both=kind==='record'||kind==='answer',warm=kind==='warm';let o=tx(40,45,'気温（架空の観測記録）',28)+path('M110 80 V430 H940','#8a867c',3);for(let n=6;n<=22;n+=4){let y=430-(n-6)*18;o+=path(`M110 ${y} H940`,'#ddd9cf',1)+tx(45,y+9,n+'℃',22)}let d=both?'M120 394 L300 385 L430 250 L650 245 L770 355 L920 358':warm?'M120 390 L300 375 L480 245 L920 235':'M120 180 L300 350 L480 355 L920 365';o+=path(d,I,6);o+=tx(110,470,'6時',23)+tx(280,470,'9時',23)+tx(480,470,'12時',23)+tx(875,470,'18時',23);o+=tx(155,525,both?'東寄り　　　　南寄り　　　　北寄り':warm?'風向：東寄り　　　→　　　南寄り':'風向：南寄り　　　→　　　北寄り',27);if(step&&kind==='answer')o+=rect(360,90,100,320,'#bd675422')+rect(690,90,100,320,'#397d9e22')+tx(330,80,'温暖前線',24,R)+tx(680,80,'寒冷前線',24,B);return o}
function frontLine(kind,x,y,X,Y){const angle=Math.atan2(Y-y,X-x)*180/Math.PI,len=Math.hypot(X-x,Y-y);return `<g transform="translate(${x} ${y}) rotate(${angle})">${symbols(kind,0,0,len)}</g>`}
function cyclone(n){n=+n||2;let o=rect(20,35,960,495,'#e4edf0')+tx(35,70,'北 ↑',22)+arrow(745,80,160,0,I)+tx(745,120,'東へ移動',22);
if(n===1)return o+path('M60 300 Q220 300 320 235 Q410 165 500 280 Q650 350 920 300','#777',5)+tx(100,150,'寒気',32,B)+tx(100,450,'暖気',32,R)+arrow(310,365,20,-95,R)+arrow(570,175,-20,90,B)+tx(325,105,'境界の波が発達する',28);
const jx=n===2?450:n===3?560:680,jy=n===2?265:n===3?310:350;
o+=`<ellipse cx="420" cy="210" rx="220" ry="145" fill="none" stroke="#8a969b" stroke-width="2"/><ellipse cx="420" cy="210" rx="135" ry="90" fill="none" stroke="#8a969b" stroke-width="2"/>`+tx(390,225,'低',60,R);
o+=path(`M${jx} ${jy} L900 400 L${n===2?210:n===3?400:600} 510 Z`,W,0,W);
if(n>=3)o+=frontLine('occluded',450,255,jx,jy);
o+=frontLine('warm',jx,jy,900,n===2?330:400)+frontLine('cold',jx,jy,n===2?210:n===3?400:600,510);
o+=tx(90,420,'寒気',32,B)+tx(730,470,'暖気',32,R)+path('M310 170 Q280 250 350 280',I,3)+arrow(335,275,23,9,I);
if(n===4)o+=tx(90,505,'中心付近の暖気は上空へ',28,R);return o}
function draw(mode,k,s){if(mode==='record')return graph(k==='answer'?'answer':'record',s);if(mode==='singlegraph')return graph(k,s);if(mode==='pair')return pair(k,s);if(mode==='section'||mode==='passage')return `<g transform="translate(180 10)">${section(k,s)}${mode==='passage'?path('M265 390 V435','#383d40',4)+tx(215,515,'観測地点',24):''}</g>`;if(mode==='cyclone')return cyclone(k);
if(mode==='meeting')return rect(60,125,430,300,C)+rect(490,125,430,300,W)+tx(180,290,'寒気',60,B)+tx(620,290,'暖気',60,R)+(s?path('M490 90 V460',I,6)+tx(360,515,'すぐには混じり合わない',32):'');
if(mode==='boundary')return path('M120 400 L650 400 L900 260 L380 260 Z','#d9d0be',2,'#e8e0d1')+path('M270 400 L700 180 L820 90 L390 270 Z','#638797',3,C)+(s?tx(480,230,'前線面',38):'')+(s>1?path('M270 400 L390 270',R,9)+tx(170,475,'地表と交わる線＝前線',36,R):'');
if(mode==='symbols'){let o='';['warm','cold','stationary','occluded'].forEach((v,i)=>{let x=40+(i%2)*500,y=130+Math.floor(i/2)*240;o+=symbols(v,x,y,430)+tx(x+80,y+70,['温暖前線','寒冷前線','停滞前線','閉塞前線'][i],32)});return o}
if(mode==='comparison')return `<g transform="scale(.77)">${tx(40,35,'温暖前線',30,R)}${section('warm',s)}</g><g transform="translate(510 0) scale(.77)">${tx(40,35,'寒冷前線',30,B)}${section('cold',s)}</g>`;
if(mode==='stationary')return pair('stationary-rain',s);
if(mode==='latitude'||mode==='westerly')return rect(60,100,880,350,'#e4edf0')+path('M60 170 H940 M60 380 H940','#8c9da5',3)+tx(80,155,'北緯60°',26)+tx(80,420,'北緯30°',26)+tx(460,290,'日本付近',40)+arrow(110,330,740,0,R)+tx(280,95,'偏西風：西から東へ',34)+tx(65,490,'西',30)+tx(900,490,'東',30);
return ''}
function update(){document.querySelectorAll('.slide:not([hidden]) .science-visual').forEach(el=>{let s=Number(el.closest('.slide').dataset.step||0);el.innerHTML=`<svg viewBox="0 0 1020 ${['pair','comparison','stationary'].includes(el.dataset.mode)?390:560}" role="img" aria-label="${el.closest('.slide').querySelector('h1')?.textContent||''}">${draw(el.dataset.mode,el.dataset.variant,s)}</svg>`})}document.addEventListener('seed:step',update);update();
})();
