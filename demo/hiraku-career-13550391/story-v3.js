const heroStory = [
  { kicker: '01 / 迷い', title: '今のままでいいのか、<br><em>答えが出なかった。</em>', lead: '働き方を変えたい気持ちはある。<br>でも、何から始めればいいかわからない。', index: '01 / THE QUESTION' },
  { kicker: '02 / 問い合わせ', title: 'まずは、<br><em>聞いてみることにした。</em>', lead: '転職を決めていなくても相談できる。<br>その一言が、最初の一歩になった。', index: '02 / THE INQUIRY' },
  { kicker: '03 / 相談', title: '話してみたら、<br><em>道が見えてきた。</em>', lead: '経験や希望をひとつずつ整理。<br>自分に合う働き方を、いっしょに考える。', index: '03 / THE CONVERSATION' },
  { kicker: '04 / はじまり', title: '新しい職場へ、<br><em>踏み出してみた。</em>', lead: '知らない場所への緊張も、少しの期待も。<br>ここから、次の日々が始まる。', index: '04 / THE FIRST DAY' },
  { kicker: '05 / 充実', title: '働く毎日が、<br><em>少し好きになった。</em>', lead: '仲間とアイデアを交わし、自分らしく力を発揮する。<br>あのときの一歩が、今につながっている。', index: '05 / A NEW CHAPTER' }
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
  storyTimer = setInterval(() => showStoryScene((storyPosition + 1) % heroStory.length), 4100);
}

storyButtons.forEach(button => button.addEventListener('click', () => {
  showStoryScene(Number(button.dataset.heroStep));
  startStory();
}));
document.addEventListener('visibilitychange', startStory);
storyReducedMotion.addEventListener?.('change', startStory);
showStoryScene(0);
startStory();
