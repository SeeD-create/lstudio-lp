(()=>{
const imgs={};for(const n of ['water-drop','eye-left','rainbow']){imgs[n]=new Image();imgs[n].src=`assets/${n}.png`}
const sels=[...document.querySelectorAll('[data-id="rainbow"],[data-id="rainbow_view"]')];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1],add=(a,b,t=1)=>[a[0]+b[0]*t,a[1]+b[1]*t];
function refr(d,n,eta){const co=-dot(d,n);return add(d.map(x=>x*eta),n,eta*co-Math.sqrt(1-eta*eta*(1-co*co)))}
function trace(n){const a=[-Math.sqrt(1-.86**2),-.86],d=refr([1,0],a,1/n),b=add(a,d,-2*dot(a,d)),e=add(d,b,-2*dot(d,b)),f=add(b,e,-2*dot(b,e)),g=refr(e,f.map(x=>-x),n);return [a,b,f,add(f,g,1.05)]}
function label(c,t,x,y,size=25,col='#292824'){c.fillStyle=col;c.font=`700 ${size}px sans-serif`;c.textAlign='center';c.fillText(t,x,y)}
function ray(c,a,b,col,p=1,w=5){p=Math.max(0,Math.min(1,p));if(!p)return;c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(...a);c.lineTo(...add(a,[b[0]-a[0],b[1]-a[1]],p));c.stroke();if(p>.7&&w>=3){const q=add(a,[b[0]-a[0],b[1]-a[1]],.6);c.save();c.translate(...q);c.rotate(Math.atan2(b[1]-a[1],b[0]-a[0]));c.fillStyle=col;c.beginPath();c.moveTo(12,0);c.lineTo(-8,-6);c.lineTo(-8,6);c.fill();c.restore()}}
function drop(c,x,y,r){if(imgs['water-drop'].naturalWidth)c.drawImage(imgs['water-drop'],132,139,991,988,x-r,y-r,r*2,r*2)}
for(const s of sels){s._time=0;new MutationObserver(()=>s._time=performance.now()).observe(s,{attributes:true,attributeFilter:['data-step']})}
function tick(){for(const s of sels){if(s.hidden)continue;const c=s.querySelector('canvas').getContext('2d'),k=+s.dataset.step||0,p=Math.min(1,(performance.now()-s._time)/900);c.clearRect(0,0,950,610);
if(s.dataset.id==='rainbow'){
 drop(c,555,235,160);label(c,'空中の水滴を1粒、拡大',500,55,30);
 const convert=a=>[555+a[0]*160,235+a[1]*160],paths=Array.from({length:61},(_,i)=>trace(1.331+.012*i/60)),colors=Array.from({length:61},(_,i)=>`hsl(${270*i/60} 90% 45%)`);
 const a=convert(paths[0][0]);if(k){ray(c,[65,a[1]],a,'#aaa',k===1?p:1,17);ray(c,[65,a[1]],a,'#fff',k===1?p:1,10);label(c,'太陽の白い光',200,a[1]-30)}
 paths.forEach((path,i)=>{for(let j=0;j<3;j++)if(k>=j+2)ray(c,convert(path[j]),convert(path[j+1]),colors[i],k===j+2?p:1,1.6)});
 if(k>=4){c.strokeStyle='#a5a098';c.lineWidth=1.5;c.strokeRect(45,260,285,235);label(c,'出てきた光を拡大',187,295,24);for(let i=0;i<=90;i++){const f=i/90;ray(c,[295,330],[75,465-100*f],`hsl(${270*f} 90% 45%)`,p,2)}label(c,'色の広がりを強調',187,486,18,'#666')}
 label(c,['水滴に当たった光は、どうなる？','白い光には、いろいろな色が混ざっている','入るときから、色によって少し曲がり方が違う','奥の面で、光の一部がはね返る','出てきた光は、色ごとに進む方向が違う'][k],475,552,25);label(c,'赤から紫へ、色は途切れずにつながっている',475,590,18,'#666');
}else{
 if(k>=4){if(imgs.rainbow.naturalWidth)c.drawImage(imgs.rainbow,20,35,910,510);label(c,'色の違う光が、空の違う方向から届く → 虹',475,585,26);continue}
 label(c,'太陽を背にして、水滴のある方を見る',475,50,28);
 const eye=[135,500],cs=['#dc3025','#e67c16','#c2a900','#289b47','#20aeb7','#305dcb','#813bcc'],names=['赤','橙','黄','緑','青','藍','紫'],ds=cs.map((_,i)=>[735,130+i*49]);
 label(c,'太陽の白い光 →',425,100,25);
 ds.forEach((d,i)=>{drop(c,...d,20);ray(c,[440,d[1]-8],[d[0]-20,d[1]-8],'#c9c8c1',1,6);ray(c,[440,d[1]-8],[d[0]-20,d[1]-8],'#fff',1,3);
 if(k>=1&&(i===0||k>=2)){ray(c,[d[0]-12,d[1]+8],eye,cs[i],k===1?p:k===2?Math.max(0,Math.min(1,p*2-i*.12)):1,3.5);label(c,names[i],795,d[1]+8,24,cs[i])}});
 if(imgs['eye-left'].naturalWidth){c.save();c.translate(...eye);c.scale(-1,1);c.drawImage(imgs['eye-left'],-55,-35,110,70);c.restore()}label(c,'見る人の目',135,561,24);
 if(k>=3){const g=c.createLinearGradient(0,115,0,445);cs.forEach((col,i)=>g.addColorStop(i/6,col));c.fillStyle=g;c.fillRect(845,115,24,330);label(c,'色の並び',842,492,23)}
 label(c,k>=2?'場所の違う水滴から、違う色の光が目に届く':'この水滴からは、赤い光が目に届く',530,552,24);
 label(c,'代表的な色で示した模式図。実際は無数の水滴と連続した色。',475,599,18,'#666');

}}requestAnimationFrame(tick)}requestAnimationFrame(tick)
})();
