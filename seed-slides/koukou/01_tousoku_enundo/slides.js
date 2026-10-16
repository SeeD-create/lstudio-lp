// 河井先生の板書写真 IMG_4302, IMG_4303, IMG_4320, IMG_4321 を参照。
// 授業で読める順序に再構成したSeeDの試作。式は板書と独立に検算した。
const frac = (top, bottom) => `<span class="frac"><span>${top}</span><span>${bottom}</span></span>`;
const orbit = `<div class="orbit-figure" aria-label="等速円運動する小球の模式図"><div class="orbit-ring"></div><div class="orbit-center">O</div><div class="orbit-rotor"><div class="radius-line"></div><div class="orbit-dot"></div><div class="velocity-vector" data-at="1">v</div><div class="force-vector" data-at="2">F</div></div></div>`;
const turntable = `<img class="lesson-photo" src="assets/turntable.png" alt="水平な回転円盤の上にある小さな金属円柱">`;
const pendulum = `<img class="lesson-photo" src="assets/conical-pendulum.png" alt="糸が傾きながら水平な円を描く円すい振り子">`;

window.lessonSlides = [
  {kind:'cover', title:'等速円運動', kicker:'高校物理｜河井先生の板書から', lead:'速さは同じ。向きが変わる。', visual:pendulum, notes:'最初に「速さが一定なのに加速度があるのか」を問い、円周上の各点で速度の向きが違うことへ導く。今回の範囲は等速円運動、回転円盤、円すい振り子。'},
  {title:'等速円運動の速度', kicker:'観察', lead:'小球は同じ速さで回り続ける。', visual:orbit,
   reveals:[['問い','速度の向きも同じだろうか。'],['結論','速度は、円の接線方向を向く。']],
   notes:'速さ（速度の大きさ）と速度（向きをもつ量）を区別する。図の矢印は点とともに回る。板書 IMG_4302・4303。'},
  {title:'1周にかかる時間', kicker:'周期 T', lead:'1周の道のりは 2πr。', visual:orbit,
   reveals:[['式',`v = ${frac('2πr','T')}`],['言い換え','大きな円ほど、同じ周期なら速い。']],
   notes:'半径rは回転の中心から物体まで。周期Tは1周にかかる時間。2πr/Tは速さの定義。'},
  {title:'角速度と速さ', kicker:'1秒に進む角度', lead:`ω = ${frac('2π','T')}`, visual:orbit,
   reveals:[['つなぐ','v = rω'],['覚えること','速さ = 半径 × 角速度']],
   notes:'角速度ωの単位はrad/s。rωは接線方向の速さ。角度はラジアンで扱う。'},
  {title:'加速度は中心向き', kicker:'向きの変化', lead:'速度の向きが変わるので、加速度がある。', visual:orbit,
   reveals:[['向き','加速度は円の中心を向く。'],['大きさ',`a = ${frac('v²','r')} = rω²`]],
   notes:'等速でも速度ベクトルが変化する。半径方向の加速度はv²/r。rω²はv=rωの代入。接線方向の加速度は等速円運動では0。'},
  {title:'中心向きの力', kicker:'運動方程式', lead:'加速度が中心向きなら、合力も中心向き。', visual:orbit,
   reveals:[['式',`F = ma = m${frac('v²','r')}`],['角速度で',`F = mrω²`]],
   notes:'「向心力」は新しい種類の力ではなく、中心向きの合力の呼び名。状況ごとに張力や摩擦力が担う。'},
  {title:'回転円盤の上の物体', kicker:'具体例 ①', lead:'物体を円盤と一緒に回す力は？', visual:turntable,
   reveals:[['答え','中心向きの静止摩擦力。'],['注意','動摩擦力ではない。']],
   notes:'板書 IMG_4320。上下方向では垂直抗力Nと重力mgがつり合う。水平方向は静止摩擦力が中心向きの合力になる。'},
  {title:'滑らずに回る条件', kicker:'静止摩擦力の上限', lead:'必要な中心向きの力は mrω²。', visual:turntable,
   reveals:[['上限','f ≤ μN = μmg'],['条件','mrω² ≤ μmg']],
   notes:'μは静止摩擦係数。N=mgは水平な円盤で鉛直加速度が0の条件。最大静止摩擦力を超えると、円盤と同じ円運動を保てない。'},
  {title:'角速度の限界', kicker:'式を整理', lead:'mrω² ≤ μmg', visual:turntable,
   reveals:[['両辺を m r で割る',`ω² ≤ ${frac('μg','r')}`],['境界',`ωₘₐₓ = √(${frac('μg','r')})`]],
   notes:'mは正で打ち消せる。r>0。半径が大きい場所ほど許される角速度が小さくなる。板書 IMG_4320。'},
  {title:'円盤から離れた後', kicker:'具体例 ① の続き', lead:'円運動を保つ力がなくなる。', visual:turntable,
   reveals:[['水平方向','離れた瞬間の接線方向へ進む。'],['鉛直方向','重力によって落下する。']],
   notes:'円盤の端から空中へ離れる場合。空気抵抗を無視すれば水平投射として扱う。離れた後に「外向きの力」が働くという説明はしない。板書 IMG_4320。'},
  {title:'円すい振り子', kicker:'具体例 ②', lead:'糸が鉛直から θ だけ傾いて回る。', visual:pendulum,
   reveals:[['半径','r = L sinθ'],['高さ','鉛直成分は L cosθ']],
   notes:'糸の長さL、鉛直との角θ。写真は生成画像で、軌道と角度の正確な測定図ではない。板書 IMG_4321。'},
  {title:'張力を分ける', kicker:'縦と横', lead:'糸の張力 S を2方向に分解する。', visual:pendulum,
   reveals:[['鉛直方向','S cosθ = mg'],['中心方向','S sinθ = mrω²']],
   notes:'鉛直方向の加速度は0。中心方向の加速度はrω²。斜めの力をそのまま運動方程式に入れず、方向ごとに分ける。'},
  {title:'円すい振り子の周期', kicker:'2つの式をつなぐ', lead:'横の式 ÷ 縦の式', visual:pendulum,
   reveals:[['途中',`tanθ = ${frac('rω²','g')} = ${frac('L sinθ · ω²','g')}`],['結論',`ω² = ${frac('g','L cosθ')}`],['周期',`T = 2π √(${frac('L cosθ','g')})`]],
   notes:'θ≠0でsinθを消去。θ=0は円運動の半径が0なので別扱い。板書 IMG_4321 の導出と照合した。'},
  {title:'覚えること', kicker:'まとめ', lead:'円運動の加速度と力は中心向き。', visual:orbit,
   reveals:[['速さ','v = rω'],['加速度',`a = ${frac('v²','r')} = rω²`],['力',`F = m${frac('v²','r')} = mrω²`]],
   notes:'式を丸暗記する前に、速度は接線方向、加速度と合力は中心方向、という向きの関係を確認する。'}
];
