// A visible, sample-only product walkthrough. Uses the real drop and submit handlers.
async function startUploadTour(){
 if(document.body.classList.contains('tour-mode'))return;
 const token=++tourToken,live=()=>token===tourToken;
 closeNotices();closeMio();pendingUploads=[];uploadErrors=[];uploadExpanded=true;go('portal');render();
 document.body.classList.add('tour-mode','upload-tour-mode');
 const say=(a,b)=>{$('#tour-title').textContent=a;$('#tour-description').textContent=b};
 const card=document.createElement('div');card.className='tour-file';card.innerHTML='<span>CSV</span><b>11月の勤怠資料</b><small>ABC_202611_勤怠.csv · サンプル</small>';document.body.append(card);
 async function pause(ms){await waitTour(ms);if(!live())throw Error('stopped')}
 async function click(selector){const el=document.querySelector(selector);if(!el)throw Error('missing target');el.scrollIntoView({behavior:'smooth',block:'center'});await pause(650);const r=el.getBoundingClientRect();pointer.style.left=r.left+r.width*.6+'px';pointer.style.top=r.top+r.height*.5+'px';await pause(1000);el.click();await pause(600)}
 try{
  say('01　ファイルを、枠の中へ。','架空の勤怠資料を使った自動操作ガイドです。');
  const zone=document.querySelector('#attendance-drop');zone.scrollIntoView({behavior:'smooth',block:'center'});await pause(800);
  const r=zone.getBoundingClientRect();card.style.left=Math.max(12,r.left-30)+'px';card.style.top=Math.max(95,r.top-70)+'px';pointer.style.left=Math.max(12,r.left-30)+120+'px';pointer.style.top=Math.max(95,r.top-70)+45+'px';await pause(2600);
  card.style.transform='translate('+Math.min(180,r.width*.25)+'px,110px) rotate(-3deg)';pointer.style.left=r.left+r.width*.45+'px';pointer.style.top=r.top+r.height*.5+'px';zone.classList.add('is-dragging');await pause(1900);
  const transfer=new DataTransfer();transfer.items.add(new File(['employee,date,hours\nSample,2026-11-01,8\n'],'ABC_202611_勤怠.csv',{type:'text/csv',lastModified:0}));zone.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:transfer}));card.remove();
  say('02　ファイル名を確認して、提出。','間違えたファイルは、提出前に取り消せます。');await pause(3600);await click('#upload-submit');
  say('03　受付完了が、その場でわかる。','受付日時が残り、職員側の給与準備にも反映されます。');await pause(4500);
  say('04　新しい提出を、通知で確認。','受領した資料を探し回る手間を減らします。');await click('.notice-bell');await pause(4000);
  say('05　誰が、いつ提出したか。履歴に。','ブラウザ内のデモです。外部通知・ファイル送信は未接続。');await click('#notice-history');await pause(4700);
  say('06　今日の仕事を、秘書に聞く。','質問すると、いまの業務状況から次の作業をご案内します。');
  await click('.mio-launcher');const input=document.querySelector('#mio-question');
  async function ask(text){input.focus();input.value='';for(const char of text){input.value+=char;await pause(110)}await pause(500);await click('.mio-form button');await pause(3800)}
  await ask('今日やることは？');say('07　探したい資料を、言葉で。','対象が曖昧なら確認。山田さんの資料を指定して開きます。');await ask('山田さんの資料を出して');
  await click('.mio-message:last-child .mio-action');say('08　ページをめくって、内容を確認。','資格取得通知と、事務所からの案内のサンプルです。');await pause(2000);await click('#reader-next');await pause(2200);await click('#reader-next');await pause(2600);await click('#reader-prev');await pause(1600);await click('#modal .close');
  say('資料提出から確認まで、ひとつの流れに。','外部AI・API・実ファイル保存は未接続の提案デモです。');await pause(3000);
 }catch(e){if(live())toast('操作ガイドを終了しました。画面から続けられます。')}
 finally{card.remove();document.body.classList.remove('upload-tour-mode');if(live())stopTour()}
}
