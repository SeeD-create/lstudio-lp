/* Preview refresh: public posts only. WordPress production uses WP_Query. */
document.querySelectorAll('[data-latest-category]').forEach(async block=>{
  try{
    const response=await fetch('https://urizun-sozoku.com/wp-json/wp/v2/column?per_page=3&orderby=date&order=desc&column_category='+encodeURIComponent(block.dataset.latestCategory)+'&_fields=title,date,link');
    if(!response.ok)return;
    const posts=await response.json();if(!Array.isArray(posts)||!posts.length)return;
    const list=document.createElement('ul');list.className='souzoku-latest-list';
    posts.forEach(post=>{
      const url=new URL(post.link);if(url.origin!=='https://urizun-sozoku.com')return;
      const li=document.createElement('li'),time=document.createElement('time'),link=document.createElement('a');
      time.dateTime=post.date.slice(0,10);time.textContent=time.dateTime.replaceAll('-','.');
      const parsed=new DOMParser().parseFromString(post.title.rendered,'text/html');
      link.textContent=parsed.body.textContent;link.href=url.href;
      li.append(time,link);list.append(li);
    });
    if(list.children.length)block.querySelector('.souzoku-latest-list').replaceWith(list);
  }catch(_){/* Keep the readable build-time fallback. */}
});
