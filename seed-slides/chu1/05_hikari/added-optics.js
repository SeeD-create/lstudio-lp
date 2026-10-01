(()=>{
const assets={};for(const n of ['prism','paper-surface','eye-left','diffuse-book']){assets[n]=new Image();assets[n].src=`assets/${n}.png`}
const slides=[...document.querySelectorAll('[data-id="diffuse"],[data-id="prism"]')];
function text(c,s,x,y,size=27,color='#292824'){c.fillStyle=color;c.font=`700 ${size}px sans-serif`;c.textAlign='center';c.fillText(s,x,y)}
function ray(c,a,b,color,p=1,w=6){if(p<=0)return;const e=[a[0]+(b[0]-a[0])*p,a[1]+(b[1]-a[1])*p];c.strokeStyle=color;c.lineWidth=w;c.beginPath();c.moveTo(...a);c.lineTo(...e);c.stroke();if(p>.6&&w>=3){const x=a[0]+(b[0]-a[0])*.58,y=a[1]+(b[1]-a[1])*.58;c.save();c.translate(x,y);c.rotate(Math.atan2(b[1]-a[1],b[0]-a[0]));c.fillStyle=color;c.beginPath();c.moveTo(13,0);c.lineTo(-9,-7);c.lineTo(-9,7);c.fill();c.restore()}}
for(const s of slides){let began=performance.now(),prev=0;new MutationObserver(()=>{const k=+s.dataset.step||0;began=k<prev?0:performance.now();prev=k}).observe(s,{attributes:true,attributeFilter:['data-step']});s._progress=()=>Math.min(1,(performance.now()-began)/850)}
function frame(){for(const s of slides){if(s.hidden)continue;const c=s.querySelector('canvas').getContext('2d'),k=+s.dataset.step||0,p=s._progress();c.clearRect(0,0,950,610);
if(s.dataset.id==='diffuse'){
 const pts=[[160,390.8,-.462],[220,392.5,.776],[280,412.7,.402],[340,395,.049],[400,411.7,.684],[460,403.8,-.187],[520,379.4,-.3],[580,393.1,-.128],[640,394,.358],[700,398.7,.295],[760,397.4,-.396],[820,406.1,.196]];
 if(assets['diffuse-book'].naturalWidth)c.drawImage(assets['diffuse-book'],30,20,145,85);
 c.strokeStyle='#bd171d';c.lineWidth=3;c.beginPath();c.arc(105,57,14,0,Math.PI*2);c.stroke();
 text(c,'本の丸印の部分を、大きく拡大',540,58,28);
 c.save();c.setLineDash([6,6]);c.strokeStyle='#aaa';c.lineWidth=1.5;c.beginPath();c.moveTo(120,70);c.lineTo(80,315);c.moveTo(120,70);c.lineTo(870,315);c.stroke();c.restore();
 if(assets['paper-surface'].naturalWidth)c.drawImage(assets['paper-surface'],0,280,2172,235,80,330,790,164.5);
 text(c,k>=1?'同じ方向から光が当たる':'表面には、細かなデコボコがある',475,115,26,'#91640a');
 const endpoints=pts.map(([x,y,m])=>{const dx=2*m/(1+m*m),dy=(m*m-1)/(1+m*m);const dist=Math.min((y-180)/(-dy),dx>0?(895-x)/dx:dx<0?(x-55)/(-dx):9999);return [x+dx*dist,y+dy*dist]});
 if(k>=1)pts.forEach(([x,y])=>ray(c,[x,170],[x,y],'#af790c',k===1?p:1,3.2));
 if(k>=2)pts.forEach(([x,y],i)=>ray(c,[x,y],endpoints[i],'#bc2629',k===2?p:1,3.6));
 if(k>=3)[0,3,8].forEach(i=>{const e=endpoints[i],a=pts[i];if(assets['eye-left'].naturalWidth){c.save();c.translate(...e);c.rotate(Math.atan2(a[1]-e[1],a[0]-e[0])-Math.PI);c.drawImage(assets['eye-left'],-42,-25,84,50);c.restore()}});
 text(c,k>=2?'面の傾きが違うので、はね返る方向も違う':'デコボコの、それぞれ違う傾きの面に注目',475,535,26);
 if(k>=3)text(c,'その光が届くので、違う方向からも同じ部分が見える',475,572,23);
 text(c,'表面の凹凸・光線の太さを強調した拡大模式図',475,602,17,'#666');

}else{
 text(c,'プリズム',470,65,30);
 if(assets.prism.complete&&assets.prism.naturalWidth)c.drawImage(assets.prism,240,80,420,350);
 if(k>=1){ray(c,[65,238],[389,238],'#a9a8a1',k===1?p:1,18);ray(c,[65,238],[389,238],'#fff',k===1?p:1,11);text(c,'白い光',170,200,27)}
 if(k>=2){const t=k===2?p:1;for(let i=0;i<=100;i++){const f=i/100,h=270*f,col=`hsl(${h} 85% 48%)`,exit=[533+8*f,286+16*f],end=[865,395+110*f];ray(c,[389,238],exit,col,Math.min(1,t*2),1.8);ray(c,exit,end,col,Math.max(0,t*2-1),2.5)}text(c,'赤',900,393,24,'#bd1919');text(c,'紫',900,510,24,'#7332bf');}
 text(c,k>=3?'もともと混ざっていた色の光が分かれる':'どんな光が出てくるだろう？',475,558,27);text(c,'角度と色の広がりを強調した模式図',475,592,19,'#666');
}}requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();
