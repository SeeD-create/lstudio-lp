'use strict';
(() => {
  const flow = document.getElementById('flow');
  const back = document.getElementById('back');
  const reset = document.getElementById('reset');
  const purposes = ['歯やお口の気がかり','検診・クリーニング','歯並び・見た目','まずは相談したい'];
  const dates = ['10/12（月）','10/13（火）','10/14（水）'];
  const times = ['09:30','11:00','14:30','16:00'];
  const state = {step:0,purpose:'',date:'',time:''};
  const choose = (name,values,selected,css='choices') => `<fieldset class="choice-group"><legend>${name==='purpose'?'相談の目的':name==='date'?'デモ日付（2026年10月）':'デモ時間'}</legend><div class="${css}">${values.map((v,i)=>`<label class="option"><input type="radio" name="${name}" value="${i}" ${selected===v?'checked':''}><span>${v}</span></label>`).join('')}</div></fieldset>`;
  const next = text => `<button type="button" class="primary" data-action="next">${text}<span>→</span></button>`;
  function render(focus=true) {
    back.disabled = state.step===0 || state.step===4;
    document.querySelectorAll('.progress li').forEach((el,i)=>{el.classList.toggle('active',i===state.step);el.classList.toggle('done',i<state.step);if(i===state.step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
    let content='';
    if(state.step===0)content=`<h2 tabindex="-1">ようこそ、余白歯科へ。</h2><div class="chat-bubble">こんにちは。<br>ご相談の目的と、ご希望の日時を選ぶ予約の流れを体験できます。</div><p class="flow-note">これは架空の医院のデモです。LINEへのログインや個人情報の入力は不要です。操作内容は送信・保存されません。</p>${next('デモをはじめる')}<p class="flow-note">目安：1分程度 / いつでもリセットできます</p>`;
    if(state.step===1)content=`<h2 tabindex="-1">今日は、どんなご相談？</h2><div class="chat-bubble">近いものを、ひとつお選びください。<br>まだ決まっていなくても大丈夫です。</div>${choose('purpose',purposes,state.purpose)}${next('日時を選ぶ')}`;
    if(state.step===2)content=`<h2 tabindex="-1">ご希望の日時を。</h2><p class="flow-note">すべて架空の予約枠です。実際の空き状況ではありません。</p>${choose('date',dates,state.date,'dates')}${choose('time',times,state.time,'times')}${next('内容を確認する')}`;
    if(state.step===3)content=`<h2 tabindex="-1">内容をご確認ください。</h2><div class="chat-bubble">この内容でデモ受付を完了します。<br>実際の予約は行われません。</div><dl class="review-list"><div><dt>ご相談の目的</dt><dd>${state.purpose}</dd></div><div><dt>日時（サンプル）</dt><dd>2026年 ${state.date}<br>${state.time}</dd></div></dl><button class="edit-choice" data-action="purpose">目的を選び直す</button><button class="edit-choice" data-action="date">日時を選び直す</button>${next('デモ受付を完了する')}<p class="flow-note">送信・保存・LINE通知は行われません。</p>`;
    if(state.step===4)content=`<div class="success-mark" aria-hidden="true">✓</div><h2 tabindex="-1">デモ受付が完了しました。</h2><div class="chat-bubble">ここまでが予約体験のデモです。<br><strong>実際の予約は成立していません。</strong><br>ご来院やLINE通知は発生しません。</div><p class="completion-code">DEMO EXPERIENCE COMPLETE</p><p class="flow-note">選択内容は保存されていません。もう一度お試しいただく場合は、下のボタンからどうぞ。</p><button class="primary" data-action="reset">もう一度体験する <span>↺</span></button><a class="text-link" href="index.html">サイトへ戻る <span>↗</span></a>`;
    flow.innerHTML=`<div class="flow-enter">${content}</div>`;
    validate();
    if(focus)flow.querySelector('h2').focus({preventScroll:true});
  }
  function validate(){const btn=flow.querySelector('[data-action="next"]');if(btn)btn.disabled=(state.step===1&&!state.purpose)||(state.step===2&&(!state.date||!state.time));}
  flow.addEventListener('change',e=>{const input=e.target;if(input instanceof HTMLInputElement&&input.type==='radio'){const values={purpose:purposes,date:dates,time:times}[input.name];if(values){state[input.name]=values[Number(input.value)];validate();}}});
  // A brief transition lock prevents a double-click from advancing twice.
  let lockedUntil=0;
  flow.addEventListener('click',e=>{const button=e.target.closest('button[data-action]');if(!button||button.disabled||Date.now()<lockedUntil)return;lockedUntil=Date.now()+350;const action=button.dataset.action;if(action==='next'){if(state.step===1&&!state.purpose)return;if(state.step===2&&(!state.date||!state.time))return;state.step=Math.min(state.step+1,4);}if(action==='purpose')state.step=1;if(action==='date')state.step=2;if(action==='reset'){Object.assign(state,{step:0,purpose:'',date:'',time:''});}render();});
  back.addEventListener('click',()=>{if(Date.now()<lockedUntil||state.step===0||state.step===4)return;lockedUntil=Date.now()+350;state.step--;render();});
  reset.addEventListener('click',()=>{Object.assign(state,{step:0,purpose:'',date:'',time:''});lockedUntil=0;render();});
  render(false);
})();
