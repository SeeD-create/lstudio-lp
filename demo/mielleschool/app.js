'use strict';
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
if (!reduce.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {entry.target.classList.add('visible'); observer.unobserve(entry.target);}
  }), {threshold:.08});
  document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}
motionButton?.addEventListener('click',()=>{
  const off = document.documentElement.classList.toggle('motion-off');
  motionButton.setAttribute('aria-pressed',String(off));
  motionButton.textContent = off ? '動きを再開する' : '動きを止める';
});
const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu(){navigation?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}
menu?.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
navigation?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
const courses = {
  design:{name:'デザイン',en:'DESIGN / SAMPLE CURRICULUM',title:['「好き」を、','かたちにする。'],description:'色の組み合わせや文字の選び方から、伝わるビジュアルを考える。身近なテーマで、一枚のデザインづくりを体験する学習例です。',topics:['色・文字・余白の基礎','バナーの構成を考える','作ったものを見直す'],art:'DESIGN YOUR IDEAS.'},
  words:{name:'ことば・発信',en:'WORDS / SAMPLE CURRICULUM',title:['わたしの視点を、','届くことばに。'],description:'伝えたいことを整理し、読む人の立場で言葉を選ぶ。身近な出来事を題材に、文章と発信の基礎を学ぶ構成例です。',topics:['届けたい相手を考える','文章の組み立てと見出し','読み手の視点で推敲する'],art:'WORDS THAT CONNECT.'},
  ai:{name:'AIとの学び',en:'AI LITERACY / SAMPLE CURRICULUM',title:['新しい道具と、','アイデアを広げる。'],description:'AIにできることと、確かめるべきことを知る。アイデア出しや文章の整理を題材に、道具としての使い方を考える学習例です。',topics:['AIの得意・不得意を知る','質問や指示を組み立てる','出力の事実・権利を確認する'],art:'CURIOSITY MEETS AI.'}
};
let currentCourse='design';
const tabs=[...document.querySelectorAll('[data-course]')];
function selectCourse(key,focus=false){
  const data=courses[key];if(!data)return;currentCourse=key;
  tabs.forEach(tab=>{const selected=tab.dataset.course===key;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected&&focus)tab.focus();});
  document.querySelector('#course-panel').setAttribute('aria-labelledby','tab-'+key);
  document.querySelector('#course-en').textContent=data.en;
  const title=document.querySelector('#course-title');title.replaceChildren(document.createTextNode(data.title[0]),document.createElement('br'),document.createTextNode(data.title[1]));
  document.querySelector('#course-description').textContent=data.description;
  document.querySelector('#course-topics').replaceChildren(...data.topics.map(t=>{const li=document.createElement('li');li.textContent=t;return li;}));
  document.querySelector('#course-art-label').textContent=data.art;
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectCourse(tab.dataset.course));tab.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(index+1)%tabs.length;if(e.key==='ArrowLeft')n=(index+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();selectCourse(tabs[n].dataset.course,true);}});});
document.querySelector('[data-show-ai]')?.addEventListener('click',()=>selectCourse('ai'));
const dialog=document.querySelector('#consult-dialog');
const form=document.querySelector('#consult-form');
const result=document.querySelector('#consult-result');
document.querySelector('#course-consult')?.addEventListener('click',()=>{const choice=form.querySelector('input[value="'+courses[currentCourse].name+'"]');if(choice)choice.checked=true;});
document.querySelector('#open-consult')?.addEventListener('click',()=>{form.hidden=false;result.hidden=true;dialog.showModal();document.body.style.overflow='hidden';});
dialog?.querySelectorAll('.dialog-close').forEach(button=>button.addEventListener('click',()=>dialog.close()));
dialog?.addEventListener('close',()=>{document.body.style.overflow='';});
form?.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);document.querySelector('#result-theme').textContent=data.get('theme');document.querySelector('#result-questions').textContent=data.getAll('question').join('・')||'まだ決めていない';form.hidden=true;result.hidden=false;document.querySelector('#edit-consult').focus();});
document.querySelector('#edit-consult')?.addEventListener('click',()=>{result.hidden=true;form.hidden=false;form.querySelector('input:checked').focus();});
