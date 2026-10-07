const form=document.querySelector('#session'),choices=document.querySelector('#choices'),review=document.querySelector('#review'),minus=document.querySelector('#minus'),plus=document.querySelector('#plus'),output=document.querySelector('#count');let count=1;
function update(){output.textContent=count;minus.disabled=count<=1;plus.disabled=count>=4;}
minus.addEventListener('click',()=>{count=Math.max(1,count-1);update();});plus.addEventListener('click',()=>{count=Math.min(4,count+1);update();});
form.addEventListener('submit',e=>{e.preventDefault();const data=new FormData(form);document.querySelector('#when').textContent=data.get('date')+' '+data.get('time');document.querySelector('#who').textContent=count+'名';choices.hidden=true;review.hidden=false;review.focus();});
document.querySelector('#back').addEventListener('click',()=>{review.hidden=true;choices.hidden=false;form.querySelector('input:checked').focus();});
document.querySelector('#clear').addEventListener('click',()=>{form.reset();count=1;update();review.hidden=true;choices.hidden=false;form.querySelector('input').focus();});
document.querySelector('#motion').addEventListener('click',e=>{const stopped=document.documentElement.classList.toggle('paused');e.currentTarget.textContent=stopped?'動きを再開':'動きを停止';e.currentTarget.setAttribute('aria-pressed',String(stopped));});
