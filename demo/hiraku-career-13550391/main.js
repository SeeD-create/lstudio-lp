const situationContent = {
  stay: {
    number: '01 / FIND THE QUESTION',
    title: 'まずは、続ける理由も<br>変えたい理由も、並べてみる。',
    copy: '今の仕事に残るか、新しい環境へ向かうか。答えを急がず、心に引っかかっていることと大切にしたい条件を整理する時間から始めます。',
    outcome: '現状・希望・次に確かめたいこと'
  },
  strength: {
    number: '02 / REFRAME YOUR EXPERIENCE',
    title: '「できること」を、<br>別の角度から見つける。',
    copy: '日々の仕事では当たり前にしていることも、場所を変えれば強みになるかもしれません。経験を一緒に振り返り、言葉にしていきます。',
    outcome: '経験の棚卸し・強みの言語化'
  },
  new: {
    number: '03 / OPEN NEW POSSIBILITIES',
    title: 'まだ知らない仕事を、<br>今の自分から考える。',
    copy: '未経験の仕事が気になるときは、理想だけでなく必要な準備も確かめたい。今ある経験と興味の接点から、選択肢を広げます。',
    outcome: '関心のある領域・準備したいこと'
  }
};

const panel = document.getElementById('situation-panel');
document.querySelectorAll('.situation-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.situation-tab').forEach(other => {
      other.classList.toggle('active', other === tab);
      other.setAttribute('aria-selected', String(other === tab));
    });
    const next = situationContent[tab.dataset.situation];
    panel.setAttribute('aria-labelledby', tab.id);
    panel.querySelector('.panel-number').textContent = next.number;
    document.getElementById('panel-title').innerHTML = next.title;
    document.getElementById('panel-copy').textContent = next.copy;
    document.getElementById('panel-outcome').textContent = next.outcome;
  });
});

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
} else {
  document.querySelectorAll('.reveal').forEach(item => item.classList.add('is-visible'));
}
