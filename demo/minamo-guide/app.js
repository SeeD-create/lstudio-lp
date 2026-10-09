const $=id=>document.getElementById(id);const originalTitle=$('newsTitle').textContent,originalBody=$('newsBody').textContent;
$('font').addEventListener('click',()=>{const on=document.body.classList.toggle('large');$('font').setAttribute('aria-pressed',on);$('font').textContent=on?'文字を標準に':'文字を大きく'});
$('motion').addEventListener('click',()=>{const on=document.body.classList.toggle('still');document.documentElement.style.scrollBehavior=on?'auto':'';$('motion').setAttribute('aria-pressed',on);$('motion').textContent=on?'動きを再開':'動きを止める'});
document.querySelectorAll('[data-topic]').forEach(a=>a.addEventListener('click',()=>{$('topic').value=a.dataset.topic;$('preview').hidden=true;$('previewForm').hidden=false}));
$('previewForm').addEventListener('submit',e=>{e.preventDefault();$('chosen').textContent='選んだ内容：'+$('topic').value;$('previewForm').hidden=true;$('preview').hidden=false;$('preview').focus()});
$('back').addEventListener('click',()=>{$('preview').hidden=true;$('previewForm').hidden=false;$('topic').focus()});
$('editForm').addEventListener('submit',e=>{e.preventDefault();const t=$('editTitle').value.trim(),b=$('editBody').value.trim();if(!t||!b){$('editStatus').textContent='見出しと本文を入力してください。';return}$('newsTitle').textContent=t;$('newsBody').textContent=b;$('editStatus').textContent='上のお知らせに反映しました。このブラウザの表示だけを変更しています。'});
$('reset').addEventListener('click',()=>{$('editTitle').value=$('newsTitle').textContent=originalTitle;$('editBody').value=$('newsBody').textContent=originalBody;$('editStatus').textContent='元の見本に戻しました。'});
