(()=>{'use strict';const $=id=>document.getElementById(id),deck=JSON.parse($('slide-data').textContent),slides=deck.slides;let index=0,step=0,progress=1,from={},to={},state={},raf=0,start=0,paused=false,duration=1800;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function mix(a,b,t){const o={...b},s=slides[index];let blend=t;
 const key=s.snapshotKey||'day',delta=(b[key]??0)-(a[key]??0);
 if(s.transition==='snapshots'&&t<1&&delta!==0){const frames=Math.max(1,Math.round(Math.abs(delta)/(s.sampleInterval||s.sampleDays||10))),position=t*frames,frame=Math.floor(position),phase=position-frame;blend=(frame+(phase>=.8?1:0))/frames;o._snapshotVisible=phase>=.62&&phase<.8?0:1;}
 for(const k in b)if(typeof b[k]==='number')o[k]=(a[k]??b[k])+(b[k]-(a[k]??b[k]))*blend;
 if(s.blinkStars&&t<1&&(a.day??0)!==(b.day??0)){const phase=(t*duration/650)%1;o._starsVisible=phase<.78?1:0;}return o;}
function paint(){state=mix(from,to,progress);Astro.render($('scene'),slides[index],state,step);$('motion').value=Math.round(progress*1000);$('pause').textContent=paused?'再開':'一時停止';syncCalendar();}
function tick(now){progress=Math.min(1,(now-start)/duration);paint();if(progress<1&&!paused)raf=requestAnimationFrame(tick);}
function animate(){cancelAnimationFrame(raf);paused=false;if(reduced){finish();return;}start=performance.now()-progress*duration;raf=requestAnimationFrame(tick);}
function finish(){cancelAnimationFrame(raf);progress=1;paused=false;paint();}
function show(i,n=0,motion=false){cancelAnimationFrame(raf);index=Math.max(0,Math.min(slides.length-1,i));const s=slides[index];step=Math.max(0,Math.min(s.notes.length,n));$('stage').className=s.kind||'';$('visual').style.backgroundImage=s.coverImage?`url("${s.coverImage}")`:'';$('title').textContent=s.title;$('kicker').textContent='中3 理科　／　'+deck.title;$('caption').textContent=s.caption||'';
$('notes-grid').replaceChildren(...s.notes.map((text,j)=>{const e=document.createElement('div');let red=text.startsWith('!');e.className='sticky'+(red?' answer':'')+(j<step?' shown':'')+(motion&&j===step-1?' entering':'');const t=document.createElement('span');t.className='stamp';t.textContent=red?text.slice(1):text;e.append(t);return e;}));
$('teacher-text').textContent=s.teacher+'\n\n参照：\n'+deck.sources.join('\n');$('select').value=index;$('counter').textContent=`${index+1} / ${slides.length}　段階 ${step}/${s.notes.length}`;
from={...s.states[Math.max(0,step-1)]};to={...s.states[step]};duration=s.motionMs||1800;progress=motion&&JSON.stringify(from)!==JSON.stringify(to)?0:1;paused=false;history.replaceState(null,'','#'+(index+1));paint();if(progress<1)animate();}
function next(){if(step<slides[index].notes.length)show(index,step+1,true);else if(index<slides.length-1)show(index+1);}
function previous(){if(step>0)show(index,step-1);else if(index>0)show(index-1,slides[index-1].notes.length);}
function scale(){document.documentElement.style.setProperty('--scale',Math.min(innerWidth/1920,(innerHeight-46)/1080));$('stage').style.top=(innerHeight-46)/2+'px';}
const lab=document.createElement('div');lab.id='calendar-lab';lab.dataset.noTap='';lab.hidden=true;
lab.innerHTML='<label>日付 <button type="button" id="day-back" aria-label="1日前">−</button><input id="calendar-day" aria-label="日付を変更" type="range" min="0" max="365" step="1"><button type="button" id="day-next" aria-label="1日後">＋</button></label><button id="flip-month">31日分めくる</button><label>時刻 <input id="calendar-hour" aria-label="観測時刻" type="time" step="60" value="22:00"></label><button id="calendar-reset">元に戻す</button>';
$('visual-bar').append(lab);
function syncCalendar(){const enabled=!!slides[index].calendarLab;lab.hidden=!enabled;$('caption').hidden=enabled;$('motion-controls').hidden=enabled;if(!enabled)return;$('calendar-day').value=Math.floor(state.day??0);const m=Math.round((state.hour??22)*60);$('calendar-hour').value=String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');$('flip-month').textContent=progress<1&&!paused?'停止':'31日分めくる';}
function setCalendar(day,hour){cancelAnimationFrame(raf);from=to={day:Math.max(0,Math.min(365,Math.round(day))),hour};progress=1;paused=true;paint();}
$('calendar-day').oninput=e=>setCalendar(Number(e.target.value),state.hour??22);
$('calendar-hour').oninput=e=>{if(!e.target.value)return;const [h,m]=e.target.value.split(':').map(Number);setCalendar(state.day??0,h+m/60);};
$('day-back').onclick=()=>setCalendar((state.day??0)-1,state.hour??22);
$('day-next').onclick=()=>setCalendar((state.day??0)+1,state.hour??22);
$('calendar-reset').onclick=()=>show(index,step);
$('flip-month').onclick=()=>{if(progress<1&&!paused){setCalendar(state.day??0,state.hour??22);return;}from={day:Math.floor(state.day??0),hour:state.hour??22};to={...from,day:Math.min(365,from.day+31)};duration=(to.day-from.day)*150;progress=0;if(!duration){finish();return;}animate();};
slides.forEach((s,i)=>{const e=document.createElement('option');e.value=i;e.textContent=`${i+1}　${s.title}`;$('select').append(e);});
document.addEventListener('click',e=>{if(!e.target.closest('[data-no-tap],button,input,select,a'))next();});document.addEventListener('contextmenu',e=>{if(e.target.closest('[data-no-tap]'))return;e.preventDefault();previous();});document.addEventListener('keydown',e=>{if(e.target.closest('input,select,textarea,#teacher'))return;if(['ArrowRight','ArrowLeft',' ','PageDown','PageUp'].includes(e.key)){e.preventDefault();(['ArrowLeft','PageUp'].includes(e.key)?previous:next)();}});
$('next').onclick=next;$('prev').onclick=previous;$('select').onchange=e=>show(Number(e.target.value));$('teacher-toggle').onclick=()=>{$('teacher').hidden=!$('teacher').hidden;};$('teacher-close').onclick=()=>{$('teacher').hidden=true;};$('full').onclick=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();$('pause').onclick=()=>{if(progress>=1)return;paused=!paused;if(paused){cancelAnimationFrame(raf);paint();}else animate();};$('replay').onclick=()=>{progress=0;animate();};$('motion').oninput=e=>{cancelAnimationFrame(raf);paused=true;progress=Number(e.target.value)/1000;paint();};
window.SeedAstro={show,next,previous,finishAnimation:finish,get index(){return index;},get step(){return step;},get state(){return {...state};},get progress(){return progress;},slides};addEventListener('resize',scale);scale();show((Number(location.hash.slice(1))||1)-1);document.fonts.ready.then(paint);Astro.ready.then(paint);
})();
