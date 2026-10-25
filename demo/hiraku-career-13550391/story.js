const heroStory = [
  {
    kicker: '01 / THE QUESTION',
    title: 'その迷いに、<br><em>まだ名前がなくても。</em>',
    lead: '「転職する」と決めていなくても、大丈夫。<br>今の気持ちを言葉にするところから、次の選択肢は見えてきます。',
    index: '01 / FIND YOUR WAY'
  },
  {
    kicker: '02 / THE CONVERSATION',
    title: '話したことで、<br><em>道が見えてきた。</em>',
    lead: '不安も希望も、少しずつ言葉に。<br>自分に合う選択を探す時間が、ここから始まります。',
    index: '02 / TALK IT THROUGH'
  },
  {
    kicker: '03 / THE DECISION',
    title: 'ここから始める。<br><em>そう決めた朝。</em>',
    lead: 'これまでの経験を手がかりに、<br>新しい仕事へ、自分の意志で一歩を踏み出す。',
    index: '03 / TAKE THE FIRST STEP'
  },
  {
    kicker: '04 / THE NEW PLACE',
    title: 'はじめましてが、<br><em>楽しみに変わる。</em>',
    lead: '新しい仲間と、新しい日々。<br>少しずつ、自分の居場所ができていく。',
    index: '04 / FIND YOUR PLACE'
  },
  {
    kicker: '05 / THE FUTURE',
    title: 'この場所で、<br><em>私らしく働く。</em>',
    lead: '笑顔で働ける毎日へ。<br>未来は、一歩ずつ形になっていく。',
    index: '05 / A NEW CHAPTER'
  }
];

const storyRoot = document.querySelector('.hero');
const storyContent = storyRoot.querySelector('.hero-content');
const storyImages = [...storyRoot.querySelectorAll('.hero-image')];
const storyButtons = [...storyRoot.querySelectorAll('[data-hero-step]')];
const storyReducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let storyPosition = 0;
let storyTimer;

function showStoryScene(next) {
  storyPosition = next;
  const scene = heroStory[next];
  storyRoot.classList.toggle('is-doubt', next === 0);
  storyImages.forEach((image, index) => {
    image.classList.toggle('is-active', index === next);
    image.setAttribute('aria-hidden', String(index !== next));
  });
  storyButtons.forEach((button, index) => {
    button.classList.toggle('is-active', index === next);
    if (index === next) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
  });
  storyContent.classList.remove('is-changing');
  void storyContent.offsetWidth;
  storyRoot.querySelector('#hero-kicker').textContent = scene.kicker;
  storyRoot.querySelector('#hero-title').innerHTML = scene.title;
  storyRoot.querySelector('.hero-lead').innerHTML = scene.lead;
  storyRoot.querySelector('.hero-index').textContent = scene.index;
  storyContent.classList.add('is-changing');
}

function startStory() {
  clearInterval(storyTimer);
  if (storyReducedMotion.matches || document.hidden) return;
  storyTimer = setInterval(() => showStoryScene((storyPosition + 1) % heroStory.length), 5700);
}

storyButtons.forEach(button => button.addEventListener('click', () => {
  showStoryScene(Number(button.dataset.heroStep));
  startStory();
}));
document.addEventListener('visibilitychange', startStory);
storyReducedMotion.addEventListener?.('change', startStory);
showStoryScene(0);
startStory();
