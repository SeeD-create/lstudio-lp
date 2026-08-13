/* リッチメニューメーカー by Lスタジオ
 * すべてクライアントサイドで完結。生成時にAI・API・サーバー送信は一切なし。
 * 実寸 2500x1686 (LINEリッチメニュー大) を Canvas で描画する。
 */
'use strict';

// ========== 色ユーティリティ ==========
function hex2rgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgb2hex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}
function mix(c1, c2, t) {
  const a = hex2rgb(c1), b = hex2rgb(c2);
  return rgb2hex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
}
function darken(c, t) { return mix(c, '#000000', t); }
function lighten(c, t) { return mix(c, '#ffffff', t); }
function rgba(c, a) { const [r, g, b] = hex2rgb(c); return `rgba(${r},${g},${b},${a})`; }

// ========== アイコン (24x24グリッド想定・ストローク描画) ==========
// 各関数は ctx を受け取り、(0,0)中心・幅sの領域に描く。strokeStyle/lineWidthは呼び出し側が設定。
const ICONS = {
  calendar(c, s) { const u = s / 24;
    rr(c, -9 * u, -7 * u, 18 * u, 16 * u, 2 * u); c.stroke();
    line(c, -9 * u, -3 * u, 9 * u, -3 * u);
    line(c, -4.5 * u, -10 * u, -4.5 * u, -6 * u); line(c, 4.5 * u, -10 * u, 4.5 * u, -6 * u);
    c.beginPath(); c.arc(-3 * u, 3 * u, 1.2 * u, 0, 7); c.fillStyle = c.strokeStyle; c.fill();
  },
  clock(c, s) { const u = s / 24;
    c.beginPath(); c.arc(0, 0, 9 * u, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(0, -5 * u); c.lineTo(0, 0.5 * u); c.lineTo(4.5 * u, 3 * u); c.stroke();
  },
  ticket(c, s) { const u = s / 24;
    c.beginPath();
    c.moveTo(-9 * u, -5 * u); c.lineTo(9 * u, -5 * u); c.lineTo(9 * u, -1.5 * u);
    c.arc(9 * u, 0, 1.8 * u, -Math.PI / 2, Math.PI / 2, true);
    c.lineTo(9 * u, 5 * u); c.lineTo(-9 * u, 5 * u); c.lineTo(-9 * u, 1.5 * u);
    c.arc(-9 * u, 0, 1.8 * u, Math.PI / 2, -Math.PI / 2, true);
    c.closePath(); c.stroke();
    c.setLineDash([1.6 * u, 2 * u]); line(c, 2.5 * u, -3.5 * u, 2.5 * u, 3.5 * u); c.setLineDash([]);
  },
  tag(c, s) { const u = s / 24;
    c.beginPath();
    c.moveTo(-9 * u, -6 * u); c.lineTo(0, -6 * u); c.lineTo(9 * u, 1 * u);
    c.lineTo(2.5 * u, 8 * u); c.lineTo(-9 * u, -2 * u); c.closePath(); c.stroke();
    c.beginPath(); c.arc(-4.5 * u, -2.5 * u, 1.6 * u, 0, 7); c.stroke();
  },
  book(c, s) { const u = s / 24;
    c.beginPath(); c.moveTo(0, -7 * u);
    c.quadraticCurveTo(-4 * u, -9.5 * u, -9.5 * u, -7.5 * u); c.lineTo(-9.5 * u, 6.5 * u);
    c.quadraticCurveTo(-4 * u, 4.5 * u, 0, 7 * u);
    c.quadraticCurveTo(4 * u, 4.5 * u, 9.5 * u, 6.5 * u); c.lineTo(9.5 * u, -7.5 * u);
    c.quadraticCurveTo(4 * u, -9.5 * u, 0, -7 * u); c.stroke();
    line(c, 0, -7 * u, 0, 7 * u);
  },
  pin(c, s) { const u = s / 24;
    c.beginPath(); c.moveTo(0, 9 * u);
    c.bezierCurveTo(6 * u, 2 * u, 8 * u, -1 * u, 8 * u, -3.5 * u);
    c.arc(0, -3.5 * u, 8 * u, 0, Math.PI, true);
    c.bezierCurveTo(-8 * u, -1 * u, -6 * u, 2 * u, 0, 9 * u); c.stroke();
    c.beginPath(); c.arc(0, -3.5 * u, 3 * u, 0, 7); c.stroke();
  },
  chat(c, s) { const u = s / 24;
    rr(c, -9 * u, -8 * u, 18 * u, 13 * u, 4 * u); c.stroke();
    c.beginPath(); c.moveTo(-3 * u, 5 * u); c.lineTo(-3 * u, 9 * u); c.lineTo(2 * u, 5 * u); c.stroke();
  },
  phone(c, s) { const u = s / 24;
    c.beginPath();
    c.moveTo(-7 * u, -9 * u); c.quadraticCurveTo(-9 * u, -9 * u, -9 * u, -6 * u);
    c.quadraticCurveTo(-8 * u, 3 * u, 0, 8 * u); c.quadraticCurveTo(6 * u, 10.5 * u, 8.5 * u, 8 * u);
    c.quadraticCurveTo(10 * u, 6 * u, 8 * u, 4.5 * u); c.lineTo(5 * u, 2.5 * u);
    c.quadraticCurveTo(3.5 * u, 1.8 * u, 2.5 * u, 3 * u); c.quadraticCurveTo(1.5 * u, 4 * u, 0.5 * u, 3.5 * u);
    c.quadraticCurveTo(-3.5 * u, 1 * u, -4.5 * u, -3 * u); c.quadraticCurveTo(-4.8 * u, -4.5 * u, -3.5 * u, -5 * u);
    c.quadraticCurveTo(-2 * u, -5.8 * u, -2.6 * u, -7.2 * u); c.lineTo(-3.6 * u, -8.6 * u);
    c.quadraticCurveTo(-4.6 * u, -9.8 * u, -7 * u, -9 * u); c.stroke();
  },
  bell(c, s) { const u = s / 24;
    c.beginPath(); c.moveTo(-8 * u, 4.5 * u);
    c.quadraticCurveTo(-6 * u, 3 * u, -6 * u, -1 * u);
    c.quadraticCurveTo(-6 * u, -8 * u, 0, -8 * u);
    c.quadraticCurveTo(6 * u, -8 * u, 6 * u, -1 * u);
    c.quadraticCurveTo(6 * u, 3 * u, 8 * u, 4.5 * u); c.closePath(); c.stroke();
    c.beginPath(); c.arc(0, 7 * u, 2.2 * u, 0, Math.PI); c.stroke();
    line(c, 0, -10.5 * u, 0, -8 * u);
  },
  door(c, s) { const u = s / 24;
    rr(c, -7 * u, -9.5 * u, 14 * u, 19 * u, 1.5 * u); c.stroke();
    c.beginPath(); c.arc(3.5 * u, 0.5 * u, 1.3 * u, 0, 7); c.fillStyle = c.strokeStyle; c.fill();
    c.beginPath(); c.moveTo(9.5 * u, -3 * u); c.lineTo(13 * u, 0); c.lineTo(9.5 * u, 3 * u); c.stroke();
    line(c, 13 * u, 0, 10.5 * u, 0);
  },
  scissors(c, s) { const u = s / 24;
    c.beginPath(); c.arc(-6 * u, -6 * u, 2.6 * u, 0, 7); c.stroke();
    c.beginPath(); c.arc(-6 * u, 6 * u, 2.6 * u, 0, 7); c.stroke();
    line(c, -4 * u, -4.5 * u, 9 * u, 6.5 * u); line(c, -4 * u, 4.5 * u, 9 * u, -6.5 * u);
  },
  photo(c, s) { const u = s / 24;
    rr(c, -9.5 * u, -7.5 * u, 19 * u, 15 * u, 2 * u); c.stroke();
    c.beginPath(); c.arc(-4 * u, -2.5 * u, 1.8 * u, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(-9 * u, 5 * u); c.lineTo(-2 * u, -1 * u); c.lineTo(3 * u, 3.5 * u);
    c.lineTo(6.5 * u, 0.5 * u); c.lineTo(9.5 * u, 3.5 * u); c.stroke();
  },
  card(c, s) { const u = s / 24;
    rr(c, -9.5 * u, -6.5 * u, 19 * u, 13 * u, 2 * u); c.stroke();
    line(c, -9.5 * u, -2.5 * u, 9.5 * u, -2.5 * u);
    line(c, -6.5 * u, 3 * u, -1 * u, 3 * u);
  },
  play(c, s) { const u = s / 24;
    c.beginPath(); c.arc(0, 0, 9.5 * u, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(-2.8 * u, -4 * u); c.lineTo(4.2 * u, 0); c.lineTo(-2.8 * u, 4 * u); c.closePath(); c.stroke();
  },
  list(c, s) { const u = s / 24;
    rr(c, -8 * u, -9.5 * u, 16 * u, 19 * u, 2 * u); c.stroke();
    line(c, -4.5 * u, -4.5 * u, 4.5 * u, -4.5 * u); line(c, -4.5 * u, 0, 4.5 * u, 0); line(c, -4.5 * u, 4.5 * u, 1.5 * u, 4.5 * u);
  },
  info(c, s) { const u = s / 24;
    c.beginPath(); c.arc(0, 0, 9.5 * u, 0, 7); c.stroke();
    line(c, 0, -1 * u, 0, 5 * u);
    c.beginPath(); c.arc(0, -4.6 * u, 1.1 * u, 0, 7); c.fillStyle = c.strokeStyle; c.fill();
  },
  paw(c, s) { const u = s / 24;
    c.beginPath(); c.ellipse(-6.5 * u, -3 * u, 2.2 * u, 2.9 * u, -0.3, 0, 7); c.stroke();
    c.beginPath(); c.ellipse(-2.2 * u, -6 * u, 2.2 * u, 2.9 * u, -0.1, 0, 7); c.stroke();
    c.beginPath(); c.ellipse(2.8 * u, -6 * u, 2.2 * u, 2.9 * u, 0.1, 0, 7); c.stroke();
    c.beginPath(); c.ellipse(7 * u, -3 * u, 2.2 * u, 2.9 * u, 0.3, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(0, -1 * u);
    c.quadraticCurveTo(5.5 * u, -1 * u, 6 * u, 4 * u); c.quadraticCurveTo(6 * u, 8 * u, 2 * u, 8 * u);
    c.quadraticCurveTo(0.5 * u, 8 * u, 0, 7 * u); c.quadraticCurveTo(-0.5 * u, 8 * u, -2 * u, 8 * u);
    c.quadraticCurveTo(-6 * u, 8 * u, -6 * u, 4 * u); c.quadraticCurveTo(-5.5 * u, -1 * u, 0, -1 * u); c.stroke();
  },
  car(c, s) { const u = s / 24;
    c.beginPath(); c.moveTo(-9.5 * u, 3.5 * u); c.lineTo(-9.5 * u, -0.5 * u);
    c.quadraticCurveTo(-9.5 * u, -2 * u, -7.5 * u, -2.5 * u); c.lineTo(-5.5 * u, -7 * u);
    c.quadraticCurveTo(-5 * u, -8 * u, -3.5 * u, -8 * u); c.lineTo(3.5 * u, -8 * u);
    c.quadraticCurveTo(5 * u, -8 * u, 5.5 * u, -7 * u); c.lineTo(7.5 * u, -2.5 * u);
    c.quadraticCurveTo(9.5 * u, -2 * u, 9.5 * u, -0.5 * u); c.lineTo(9.5 * u, 3.5 * u); c.stroke();
    line(c, -6 * u, -2.5 * u, 6 * u, -2.5 * u);
    c.beginPath(); c.arc(-5.5 * u, 4.5 * u, 2.4 * u, 0, 7); c.stroke();
    c.beginPath(); c.arc(5.5 * u, 4.5 * u, 2.4 * u, 0, 7); c.stroke();
  },
  pencil(c, s) { const u = s / 24;
    rr(c, -9.5 * u, -8 * u, 15 * u, 17 * u, 1.5 * u); c.stroke();
    line(c, -6 * u, -3.5 * u, 1.5 * u, -3.5 * u); line(c, -6 * u, 0.5 * u, 1.5 * u, 0.5 * u); line(c, -6 * u, 4.5 * u, -1.5 * u, 4.5 * u);
    c.beginPath(); c.moveTo(4 * u, 3.5 * u); c.lineTo(9.5 * u, -2 * u); c.lineTo(11.5 * u, 0); c.lineTo(6 * u, 5.5 * u); c.lineTo(3.5 * u, 6 * u); c.closePath(); c.stroke();
  },
  flag(c, s) { const u = s / 24;
    line(c, -7 * u, -9.5 * u, -7 * u, 9.5 * u);
    c.beginPath(); c.moveTo(-7 * u, -8 * u);
    c.quadraticCurveTo(-2 * u, -10.5 * u, 1 * u, -8 * u); c.quadraticCurveTo(4 * u, -5.5 * u, 8.5 * u, -8 * u);
    c.lineTo(8.5 * u, 0.5 * u); c.quadraticCurveTo(4 * u, 3 * u, 1 * u, 0.5 * u);
    c.quadraticCurveTo(-2 * u, -2 * u, -7 * u, 0.5 * u); c.closePath(); c.stroke();
  },
  search(c, s) { const u = s / 24;
    c.beginPath(); c.arc(-2 * u, -2 * u, 6.5 * u, 0, 7); c.stroke();
    line(c, 2.8 * u, 2.8 * u, 9 * u, 9 * u);
  },
  house(c, s) { const u = s / 24;
    c.beginPath(); c.moveTo(-9.5 * u, -0.5 * u); c.lineTo(0, -9 * u); c.lineTo(9.5 * u, -0.5 * u); c.stroke();
    c.beginPath(); c.moveTo(-7 * u, 1 * u); c.lineTo(-7 * u, 8.5 * u); c.lineTo(7 * u, 8.5 * u); c.lineTo(7 * u, 1 * u); c.stroke();
    rr(c, -2 * u, 3 * u, 4 * u, 5.5 * u, 0.5 * u); c.stroke();
  },
  houseup(c, s) { const u = s / 24;
    c.beginPath(); c.moveTo(-9.5 * u, 1 * u); c.lineTo(-2 * u, -5.5 * u); c.lineTo(5.5 * u, 1 * u); c.stroke();
    c.beginPath(); c.moveTo(-7.5 * u, 2.5 * u); c.lineTo(-7.5 * u, 9 * u); c.lineTo(3.5 * u, 9 * u); c.lineTo(3.5 * u, 2.5 * u); c.stroke();
    c.beginPath(); c.moveTo(4 * u, -4.5 * u); c.lineTo(9.5 * u, -9.5 * u); c.stroke();
    c.beginPath(); c.moveTo(5 * u, -9.5 * u); c.lineTo(9.5 * u, -9.5 * u); c.lineTo(9.5 * u, -5 * u); c.stroke();
  },
  envelope(c, s) { const u = s / 24;
    rr(c, -9.5 * u, -6.5 * u, 19 * u, 13 * u, 1.5 * u); c.stroke();
    c.beginPath(); c.moveTo(-9 * u, -5.5 * u); c.lineTo(0, 1.5 * u); c.lineTo(9 * u, -5.5 * u); c.stroke();
  },
  people(c, s) { const u = s / 24;
    c.beginPath(); c.arc(-3.5 * u, -4 * u, 3.4 * u, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(-9.5 * u, 8 * u); c.quadraticCurveTo(-9.5 * u, 1.5 * u, -3.5 * u, 1.5 * u); c.quadraticCurveTo(2.5 * u, 1.5 * u, 2.5 * u, 8 * u); c.stroke();
    c.beginPath(); c.arc(5 * u, -5 * u, 2.6 * u, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(6 * u, 0.5 * u); c.quadraticCurveTo(9.5 * u, 1.5 * u, 9.5 * u, 6 * u); c.stroke();
  },
  scale(c, s) { const u = s / 24;
    line(c, 0, -9 * u, 0, 7 * u); line(c, -6 * u, 7 * u, 6 * u, 7 * u); line(c, -8 * u, -6 * u, 8 * u, -6 * u);
    c.beginPath(); c.moveTo(-8 * u, -6 * u); c.lineTo(-10.5 * u, 0); c.stroke();
    c.beginPath(); c.moveTo(-8 * u, -6 * u); c.lineTo(-5.5 * u, 0); c.stroke();
    c.beginPath(); c.arc(-8 * u, 0.5 * u, 2.6 * u, 0, Math.PI); c.stroke();
    c.beginPath(); c.moveTo(8 * u, -6 * u); c.lineTo(5.5 * u, 0); c.stroke();
    c.beginPath(); c.moveTo(8 * u, -6 * u); c.lineTo(10.5 * u, 0); c.stroke();
    c.beginPath(); c.arc(8 * u, 0.5 * u, 2.6 * u, 0, Math.PI); c.stroke();
  },
  calc(c, s) { const u = s / 24;
    rr(c, -7 * u, -9.5 * u, 14 * u, 19 * u, 2 * u); c.stroke();
    rr(c, -4.5 * u, -7 * u, 9 * u, 3.5 * u, 0.8 * u); c.stroke();
    [[-4, 0], [0, 0], [4, 0], [-4, 4], [0, 4], [4, 4]].forEach(p => {
      c.beginPath(); c.arc(p[0] * u, (p[1] + 1) * u, 0.9 * u, 0, 7); c.fillStyle = c.strokeStyle; c.fill();
    });
  },
  doccheck(c, s) { const u = s / 24;
    c.beginPath(); c.moveTo(3 * u, -9.5 * u); c.lineTo(-7.5 * u, -9.5 * u); c.lineTo(-7.5 * u, 9.5 * u);
    c.lineTo(7.5 * u, 9.5 * u); c.lineTo(7.5 * u, -5 * u); c.closePath(); c.stroke();
    c.beginPath(); c.moveTo(3 * u, -9.5 * u); c.lineTo(3 * u, -5 * u); c.lineTo(7.5 * u, -5 * u); c.stroke();
    c.beginPath(); c.moveTo(-3.5 * u, 2 * u); c.lineTo(-1 * u, 4.5 * u); c.lineTo(4 * u, -1 * u); c.stroke();
  },
  bowl(c, s) { const u = s / 24;
    c.beginPath(); c.arc(0, 0, 9 * u, 0, Math.PI); c.stroke();
    line(c, -9 * u, 0, 9 * u, 0);
    c.beginPath(); c.moveTo(-5.5 * u, 9 * u); c.lineTo(5.5 * u, 9 * u); c.stroke();
    c.beginPath(); c.moveTo(-3 * u, -3.5 * u); c.quadraticCurveTo(-4 * u, -6 * u, -3 * u, -8.5 * u); c.stroke();
    c.beginPath(); c.moveTo(1.5 * u, -3.5 * u); c.quadraticCurveTo(0.5 * u, -6 * u, 1.5 * u, -8.5 * u); c.stroke();
  },
  sparkle(c, s) { const u = s / 24;
    c.beginPath(); c.moveTo(0, -9.5 * u); c.quadraticCurveTo(1.5 * u, -1.5 * u, 9.5 * u, 0);
    c.quadraticCurveTo(1.5 * u, 1.5 * u, 0, 9.5 * u); c.quadraticCurveTo(-1.5 * u, 1.5 * u, -9.5 * u, 0);
    c.quadraticCurveTo(-1.5 * u, -1.5 * u, 0, -9.5 * u); c.closePath(); c.stroke();
  },
};
function rr(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r);
  c.closePath();
}
function line(c, x1, y1, x2, y2) { c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }

// ========== 業種定義 ==========
const INDUSTRIES = [
  { id: 'inshoku', em: '🍜', name: '飲食店・カフェ',
    pal: { accent: '#D8432D', accent2: '#F2A03D', dark1: '#1C120B', dark2: '#3B2414', gold: '#C9A227', tint: '#FFF3E8' },
    buttons: [
      { jp: 'ご予約', en: 'Reserve', icon: 'calendar', main: true },
      { jp: '本日のおすすめ', en: "Today's", icon: 'bowl' },
      { jp: 'クーポン', en: 'Coupon', icon: 'ticket' },
      { jp: 'メニュー', en: 'Menu', icon: 'book' },
      { jp: 'アクセス', en: 'Access', icon: 'pin' },
      { jp: 'お店に質問', en: 'Contact', icon: 'chat' },
    ] },
  { id: 'biyou', em: '💇', name: '美容室・サロン',
    pal: { accent: '#C77B92', accent2: '#B99B6B', dark1: '#241A20', dark2: '#4A3040', gold: '#C9A98A', tint: '#FAF1EE' },
    buttons: [
      { jp: 'ご予約', en: 'Reserve', icon: 'calendar', main: true },
      { jp: 'メニュー・料金', en: 'Menu', icon: 'tag' },
      { jp: 'スタイル実例', en: 'Style', icon: 'scissors' },
      { jp: '会員証・ポイント', en: 'Point', icon: 'card' },
      { jp: 'アクセス', en: 'Access', icon: 'pin' },
      { jp: '相談する', en: 'Contact', icon: 'chat' },
    ] },
  { id: 'seikotsu', em: '💆', name: '整骨院・整体',
    pal: { accent: '#2E86DE', accent2: '#38B26C', dark1: '#0E2238', dark2: '#1D3C5E', gold: '#9EC9E8', tint: '#EFF6FC' },
    buttons: [
      { jp: 'ご予約', en: 'Reserve', icon: 'calendar', main: true },
      { jp: '本日の空き状況', en: 'Today', icon: 'clock' },
      { jp: '施術メニュー', en: 'Menu', icon: 'list' },
      { jp: 'セルフケア動画', en: 'Video', icon: 'play' },
      { jp: 'アクセス', en: 'Access', icon: 'pin' },
      { jp: '先生に質問', en: 'Contact', icon: 'chat' },
    ] },
  { id: 'clinic', em: '🦷', name: '歯科・クリニック',
    pal: { accent: '#2FA3D7', accent2: '#59C2A8', dark1: '#0F2A3C', dark2: '#1C4966', gold: '#A5D8F0', tint: '#F0F9FD' },
    buttons: [
      { jp: '診療予約', en: 'Reserve', icon: 'calendar', main: true },
      { jp: '診療時間・休診日', en: 'Hours', icon: 'clock' },
      { jp: '初めての方へ', en: 'Guide', icon: 'info' },
      { jp: '定期検診のご案内', en: 'Recall', icon: 'bell' },
      { jp: 'アクセス', en: 'Access', icon: 'pin' },
      { jp: 'お問い合わせ', en: 'Contact', icon: 'chat' },
    ] },
  { id: 'pet', em: '🐶', name: 'ペットサロン',
    pal: { accent: '#DE7E5D', accent2: '#8B5E3C', dark1: '#2A1E14', dark2: '#4A3826', gold: '#D9B48F', tint: '#FBF2E4' },
    buttons: [
      { jp: 'ご予約', en: 'Reserve', icon: 'paw', main: true },
      { jp: '料金表・コース', en: 'Price', icon: 'tag' },
      { jp: 'カット仕上がり例', en: 'Photo', icon: 'photo' },
      { jp: '送迎について', en: 'Pickup', icon: 'car' },
      { jp: 'アクセス', en: 'Access', icon: 'pin' },
      { jp: '相談する', en: 'Contact', icon: 'chat' },
    ] },
  { id: 'juku', em: '✏️', name: '学習塾・スクール',
    pal: { accent: '#E8A906', accent2: '#2E5AAC', dark1: '#101E38', dark2: '#20355C', gold: '#F2C14E', tint: '#F1F6FE' },
    buttons: [
      { jp: '体験授業申込', en: 'Trial', icon: 'pencil', main: true, badge: '無料' },
      { jp: '入退室通知', en: 'Check-in', icon: 'door' },
      { jp: '講習・イベント', en: 'Event', icon: 'flag' },
      { jp: 'コース・料金', en: 'Price', icon: 'tag' },
      { jp: '欠席連絡', en: 'Absence', icon: 'phone' },
      { jp: 'アクセス', en: 'Access', icon: 'pin' },
    ] },
  { id: 'fudosan', em: '🏠', name: '不動産',
    pal: { accent: '#2F9E62', accent2: '#C9A227', dark1: '#0D1B2A', dark2: '#1B3049', gold: '#C9A227', tint: '#F0F8F3' },
    buttons: [
      { jp: '物件を探す', en: 'Search', icon: 'search', main: true },
      { jp: '来店予約', en: 'Visit', icon: 'calendar' },
      { jp: '売却査定', en: 'Assess', icon: 'houseup', badge: '無料' },
      { jp: '資料請求', en: 'Request', icon: 'envelope' },
      { jp: 'スタッフ紹介', en: 'Staff', icon: 'people' },
      { jp: '質問する', en: 'Contact', icon: 'chat' },
    ] },
  { id: 'shigyo', em: '⚖️', name: '士業事務所',
    pal: { accent: '#2C4A78', accent2: '#8C9CB8', dark1: '#101823', dark2: '#243447', gold: '#B8C4D4', tint: '#F2F5FA' },
    buttons: [
      { jp: '無料相談予約', en: 'Consult', icon: 'calendar', main: true, badge: '無料' },
      { jp: '取扱分野', en: 'Service', icon: 'scale' },
      { jp: '費用の目安', en: 'Fee', icon: 'calc' },
      { jp: '解決事例', en: 'Case', icon: 'doccheck' },
      { jp: 'アクセス', en: 'Access', icon: 'pin' },
      { jp: '相談内容を送る', en: 'Message', icon: 'envelope' },
    ] },
  { id: 'sonota', em: '🏪', name: 'その他のお店',
    pal: { accent: '#06C755', accent2: '#FF7A00', dark1: '#0A2418', dark2: '#145030', gold: '#8FE3B0', tint: '#EFFAF3' },
    buttons: [
      { jp: 'ご予約', en: 'Reserve', icon: 'calendar', main: true },
      { jp: 'メニュー・料金', en: 'Menu', icon: 'book' },
      { jp: 'クーポン', en: 'Coupon', icon: 'ticket' },
      { jp: 'お知らせ', en: 'News', icon: 'bell' },
      { jp: 'アクセス', en: 'Access', icon: 'pin' },
      { jp: 'お問い合わせ', en: 'Contact', icon: 'chat' },
    ] },
];

// ========== テーマ定義 ==========
// moods: kirei=高級感 / shinrai=清潔感・信頼 / sitasimi=親しみ / kawaii=かわいい / wa=和風 / cool=スタイリッシュ
const THEMES = [
  // ===== プレミアム10 (ChatGPTデザイン仕様書を数値どおり移植・SPECレンダラで描画) =====
  { id: 'kuro_sumi', name: '玄墨', desc: '料亭・割烹の和モダン', moods: ['wa', 'kirei'],
    jp: '600 FZ "Shippori Mincho"', en: '"Noto Sans JP"' },
  { id: 'velour_glow', name: 'ヴェロア', desc: '高級サロン・静かな艶', moods: ['kirei'],
    jp: '600 FZ "Shippori Mincho"', en: '"Noto Sans JP"' },
  { id: 'pure_veil', name: 'ピュアヴェール', desc: '医療・清潔と信頼', moods: ['shinrai'],
    jp: '600 FZ "Shippori Mincho"', en: '"Noto Sans JP"' },
  { id: 'botanical_linen', name: 'ボタニカルリネン', desc: 'カフェ・自然と紙', moods: ['sitasimi', 'shinrai'],
    jp: '600 FZ "Shippori Mincho"', en: '"Noto Sans JP"' },
  { id: 'seoul_minimal', name: 'ソウルミニマル', desc: '韓国サロン・トレンド', moods: ['kirei', 'cool'],
    jp: '500 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'academic_navy', name: 'アカデミックネイビー', desc: '進学塾・知性と実績', moods: ['shinrai', 'kirei'],
    jp: '600 FZ "Shippori Mincho"', en: '"Noto Sans JP"' },
  { id: 'estate_prestige', name: 'エステート', desc: '不動産・重厚な信頼', moods: ['kirei'],
    jp: '600 FZ "Shippori Mincho"', en: '"Noto Sans JP"' },
  { id: 'civic_authority', name: 'シビック', desc: '士業・端正な品位', moods: ['shinrai'],
    jp: '600 FZ "Shippori Mincho"', en: '"Noto Sans JP"' },
  { id: 'nocturne_neon', name: 'ノクターン', desc: '大人のバー・夜のネオン', moods: ['cool'],
    jp: '500 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'quiet_grid', name: 'クワイエット', desc: 'ミニマル汎用・静謐', moods: ['shinrai', 'cool', 'sitasimi'],
    jp: '500 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'glass_light', name: 'ライトグラス', desc: 'すりガラス・上品', moods: ['shinrai', 'kirei'],
    jp: '700 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'elegant_serif', name: 'エレガント', desc: '白×金・明朝の気品', moods: ['kirei', 'wa'],
    jp: '600 FZ "Shippori Mincho"', en: '"Shippori Mincho"' },
  { id: 'craft_kraft', name: 'クラフト', desc: '紙の手ざわり・カフェ', moods: ['sitasimi', 'kawaii'],
    jp: '700 FZ "Zen Maru Gothic"', en: '"Zen Maru Gothic"' },
  { id: 'duotone_modern', name: 'デュオトーン', desc: '2色構成・メリハリ', moods: ['cool', 'sitasimi'],
    jp: '800 FZ "M PLUS Rounded 1c"', en: '"M PLUS Rounded 1c"' },
  { id: 'kids_pop', name: 'キッズポップ', desc: 'クレヨン色・こども向け', moods: ['kawaii', 'sitasimi'],
    jp: '800 FZ "M PLUS Rounded 1c"', en: '"M PLUS Rounded 1c"' },
  { id: 'active_sport', name: 'アクティブ', desc: 'ジム・スポーツの躍動感', moods: ['cool'],
    jp: '900 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'retro_taishu', name: 'レトロ酒場', desc: '紺×朱・大衆レトロ', moods: ['wa', 'sitasimi'],
    jp: '700 FZ "Shippori Mincho"', en: '"Shippori Mincho"' },
];

const MOODS = [
  { id: 'omakase', name: 'おまかせ' },
  { id: 'kirei', name: '高級感・上質' },
  { id: 'shinrai', name: '清潔感・信頼' },
  { id: 'sitasimi', name: '親しみやすさ' },
  { id: 'kawaii', name: 'かわいい' },
  { id: 'wa', name: '和風' },
  { id: 'cool', name: 'スタイリッシュ' },
];

// ========== レイアウト ==========
const W = 2500, H = 1686;
function layoutRects(n, M, G) {
  if (M == null) M = 46;
  if (G == null) G = 32;
  const rects = [];
  if (n === 6) {
    const cw = (W - 2 * M - 2 * G) / 3, ch = (H - 2 * M - G) / 2;
    for (let r = 0; r < 2; r++) for (let col = 0; col < 3; col++)
      rects.push({ x: M + col * (cw + G), y: M + r * (ch + G), w: cw, h: ch });
  } else if (n === 4) {
    const cw = (W - 2 * M - G) / 2, ch = (H - 2 * M - G) / 2;
    for (let r = 0; r < 2; r++) for (let col = 0; col < 2; col++)
      rects.push({ x: M + col * (cw + G), y: M + r * (ch + G), w: cw, h: ch });
  } else { // 3: 上に横長1枚 + 下2枚 (LINE管理画面のテンプレートにある分割)
    const ch = (H - 2 * M - G) / 2;
    rects.push({ x: M, y: M, w: W - 2 * M, h: ch, big: true });
    const cw = (W - 2 * M - G) / 2;
    for (let col = 0; col < 2; col++)
      rects.push({ x: M + col * (cw + G), y: M + ch + G, w: cw, h: ch });
  }
  return rects;
}

// ========== 描画エンジン ==========
function renderMenu(canvas, opts) {
  // opts: {theme, pal, buttons, n, showEn, cssW} 論理座標は常に2500x1686
  const scale = (opts.cssW || 750) / W;
  const dpr = opts.full ? 1 : Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round((opts.full ? W : opts.cssW * dpr));
  canvas.height = Math.round((opts.full ? H : opts.cssW * dpr * H / W));
  const c = canvas.getContext('2d');
  c.save();
  c.scale(canvas.width / W, canvas.height / H);
  c.lineCap = 'round'; c.lineJoin = 'round';

  const t = opts.theme, p = opts.pal;
  const spec = SPEC[t.id];
  const rects = layoutRects(opts.n, spec ? 110 : 46, spec ? 42 : 32);
  const btns = opts.buttons.slice(0, opts.n);

  if (spec) {
    drawSpecBg(c, spec);
    btns.forEach((b, i) => drawSpecCell(c, spec, rects[i], b, i, opts.showEn));
  } else {
    const S = styleFor(t.id, p);
    drawBg(c, t.id, S, p);
    btns.forEach((b, i) => drawCell(c, t, S, p, rects[i], b, i, opts.showEn));
  }

  c.restore();
}

function styleFor(id, p) {
  const accD = darken(p.accent, 0.16); // 白文字を乗せる面は1段濃く
  switch (id) {
    case 'flat_clean': return {
      bg1: '#ffffff', bg2: p.tint,
      card: '#ffffff', border: mix(p.tint, '#c8cdc9', 0.55), borderW: 3,
      shadow: 'rgba(30,40,50,.10)', radius: 44,
      icon: accD, text: '#26313d', sub: '#8a949e',
      mainFill: accD, mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: '#E8443A', badgeText: '#fff',
    };
    case 'dark_glass': return {
      bg1: p.dark1, bg2: p.dark2,
      card: 'rgba(255,255,255,.08)', border: rgba(lighten(p.accent, 0.25), 0.65), borderW: 3,
      shadow: rgba(lighten(p.accent, 0.2), 0.28), glow: true, radius: 44,
      icon: '#ffffff', icon2: lighten(p.accent, 0.3), text: '#ffffff', sub: rgba('#ffffff', 0.55),
      mainFill: rgba(p.accent, 0.92), mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: lighten(p.accent, 0.35), badgeText: darken(p.accent, 0.5),
    };
    case 'luxury_gold': return {
      bg1: '#0c0b0e', bg2: mix(p.dark1, '#000000', 0.3),
      card: 'rgba(255,255,255,.045)', border: rgba(p.gold, 0.8), borderW: 2.5, inner: true, radius: 20,
      shadow: 'rgba(0,0,0,0)',
      icon: p.gold, text: '#F3EBDD', sub: rgba(p.gold, 0.75),
      mainFill: null, mainGrad: [darken(p.gold, 0.06), lighten(p.gold, 0.32)], mainText: '#171310', mainIcon: '#171310',
      badgeBg: '#F3EBDD', badgeText: '#171310',
    };
    case 'wamodern': return {
      bg1: p.dark2, bg2: darken(p.dark2, 0.35), speckle: true,
      card: 'rgba(0,0,0,.25)', border: rgba(p.gold, 0.55), borderW: 2.5, radius: 14,
      shadow: 'rgba(0,0,0,0)',
      icon: '#EDE3CE', text: '#F2EADA', sub: rgba(p.gold, 0.85),
      mainFill: rgba(darken(p.gold, 0.1), 0.95), mainText: '#1d1508', mainIcon: '#1d1508',
      badgeBg: '#B3402E', badgeText: '#F5EEE2',
    };
    case 'pastel_pop': return {
      bg1: '#ffffff', bg2: '#ffffff',
      pastels: ['#FFE5E0', '#FFF3D1', '#E0F5E6', '#E0EDFF', '#F3E5FF', '#FFE5F2'],
      border: 'rgba(0,0,0,0)', borderW: 0, radius: 64,
      shadow: 'rgba(90,90,120,.10)',
      icon: '#565664', text: '#454552', sub: '#9a9aa8',
      mainFill: darken(p.accent, 0.1), mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: '#565664', badgeText: '#fff',
    };
    case 'gradient_vivid': return {
      bg1: p.accent, bg2: p.accent2, diag: true,
      card: 'rgba(255,255,255,.95)', border: 'rgba(255,255,255,0)', borderW: 0, radius: 56,
      shadow: 'rgba(0,0,0,.16)',
      icon: darken(p.accent, 0.2), text: '#212a35', sub: '#8a949e',
      mainFill: '#1b2430', mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: '#E8443A', badgeText: '#fff',
    };
    case 'minimal_line': return {
      bg1: '#FDFDFB', bg2: '#FDFDFB', hairline: '#D9D9D2',
      card: null, border: null, borderW: 0, radius: 0,
      icon: '#22232a', text: '#1d1e24', sub: '#9a9a94', iconThin: true,
      mainRing: darken(p.accent, 0.08),
      badgeBg: darken(p.accent, 0.08), badgeText: '#fff',
    };
    case 'soft_natural': return {
      bg1: '#F8F2E7', bg2: '#EFE4D0',
      card: '#FFFDF8', border: '#E0D2BA', borderW: 3, radius: 52,
      shadow: 'rgba(120,95,60,.12)',
      icon: '#8B5E3C', text: '#4A3826', sub: '#A78D6F',
      mainFill: mix(p.accent, '#8B5E3C', 0.25), mainText: '#fff', mainIcon: '#fff',
      badgeBg: '#4A3826', badgeText: '#F8F2E7',
    };
    case 'bold_block': return {
      bg1: '#15171C', bg2: '#15171C', blockGap: true,
      blocks: [darken(p.accent, 0.05), mix(p.dark2, '#3a4150', 0.4), darken(p.accent2, 0.05), mix(p.dark2, '#3a4150', 0.15), mix(p.dark2, '#3a4150', 0.55), darken(mix(p.accent, p.accent2, 0.5), 0.1)],
      border: 'rgba(0,0,0,0)', borderW: 0, radius: 30,
      icon: '#ffffff', text: '#ffffff', sub: 'rgba(255,255,255,.6)',
      mainFill: null, mainText: '#ffffff', mainIcon: '#ffffff', mainStar: true,
      badgeBg: '#ffffff', badgeText: '#15171C',
    };
    case 'neo_tech': return {
      bg1: '#071120', bg2: '#0D2137', grid: true,
      card: 'rgba(12,32,54,.72)', border: rgba(lighten(p.accent, 0.3), 0.85), borderW: 3, glow: true, radius: 24,
      shadow: rgba(lighten(p.accent, 0.3), 0.4),
      icon: lighten(p.accent, 0.35), text: '#EAF7FF', sub: rgba(lighten(p.accent, 0.4), 0.8),
      mainFill: rgba(darken(p.accent, 0.05), 0.95), mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: lighten(p.accent, 0.4), badgeText: '#071120',
    };
    case 'glass_light': return {
      bg1: '#EAF0F6', bg2: mix('#D6E2EC', lighten(p.accent, 0.72), 0.5), diag: true,
      card: 'rgba(255,255,255,.62)', border: 'rgba(255,255,255,.95)', borderW: 3, radius: 52,
      shadow: 'rgba(80,110,150,.22)', shadowBlur: 52, shadowY: 18,
      icon: darken(p.accent, 0.12), text: '#2A3440', sub: '#8A98A8',
      mainFill: rgba(darken(p.accent, 0.14), 0.96), mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: '#2A3440', badgeText: '#fff',
    };
    case 'elegant_serif': return {
      bg1: '#FBF9F4', bg2: '#F1ECE0',
      card: '#FFFFFF', border: rgba('#C0A96E', 0.85), borderW: 2, inner: true, radius: 10,
      shadow: 'rgba(170,150,100,.16)', shadowBlur: 34, shadowY: 10, ls: 10,
      icon: '#9A814B', text: '#3A342A', sub: rgba('#9A814B', 0.85),
      mainFill: null, mainGrad: ['#AD9155', '#D2BC85'], mainText: '#2A2415', mainIcon: '#2A2415',
      badgeBg: '#3A342A', badgeText: '#F5F0E4',
    };
    case 'night_neon': return {
      bg1: '#130818', bg2: '#221031', diag: true,
      card: 'rgba(14,7,22,.8)', border: rgba(lighten(p.accent, 0.35), 0.9), borderW: 3.5, glow: true, radius: 34,
      shadow: rgba(lighten(p.accent, 0.3), 0.5), shadowBlur: 64,
      icon: lighten(p.accent, 0.42), icon2: lighten(p.accent2, 0.35), text: '#FFF6FF', sub: rgba(lighten(p.accent, 0.45), 0.85),
      mainFill: rgba(darken(p.accent, 0.02), 0.92), mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: lighten(p.accent, 0.45), badgeText: '#1A0A22',
    };
    case 'craft_kraft': return {
      bg1: '#DBC7A2', bg2: '#C9B085', speckle: true,
      card: '#F7EEDC', border: '#8A6F4D', borderW: 3.5, dash: [16, 12], radius: 28,
      shadow: 'rgba(90,70,40,.16)', shadowBlur: 18, shadowY: 7,
      icon: '#6E543A', text: '#4C3A26', sub: '#96805F',
      mainFill: darken(mix(p.accent, '#8A5A30', 0.35), 0.05), mainText: '#FFF9EC', mainIcon: '#FFF9EC',
      badgeBg: '#4C3A26', badgeText: '#F7EEDC',
    };
    case 'duotone_modern': return {
      bg1: darken(p.accent, 0.14), bg2: darken(p.accent, 0.14),
      card: '#FFFFFF', border: 'rgba(0,0,0,0)', borderW: 0, radius: 22,
      shadow: 'rgba(0,0,0,.20)', shadowBlur: 26, shadowY: 12,
      topBar: darken(p.accent2, 0.05),
      icon: darken(p.accent, 0.16), text: '#20242B', sub: '#9AA0A8',
      mainFill: '#1B1F26', mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: darken(p.accent2, 0.05), badgeText: '#fff',
    };
    case 'medical_soft': return {
      bg1: '#FFFFFF', bg2: '#EFF6FA',
      card: '#FFFFFF', border: '#D7E6EE', borderW: 2.5, radius: 36,
      shadow: 'rgba(60,110,150,.10)', shadowBlur: 22, shadowY: 8,
      leftBar: mix(p.accent, '#2E86B8', 0.4),
      icon: mix(p.accent, '#2E6E93', 0.35), text: '#33424E', sub: '#93A6B3',
      mainFill: darken(mix(p.accent, '#2E86B8', 0.4), 0.10), mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: '#E8604C', badgeText: '#fff',
    };
    case 'kids_pop': return {
      bg1: '#FFF9E8', bg2: '#FFF3D6', dots: rgba('#E8A906', 0.16),
      card: '#FFFFFF', borderCycle: ['#F2B705', '#E8604C', '#3E9BD6', '#57B368', '#9A6DD7', '#EE7FA8'], borderW: 5, radius: 64,
      shadow: 'rgba(120,100,60,.10)', shadowBlur: 16, shadowY: 6,
      icon: '#4A4A55', text: '#3E3E4A', sub: '#A0A0AC',
      mainFill: darken(p.accent, 0.06), mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: '#E8604C', badgeText: '#fff',
    };
    case 'active_sport': return {
      bg1: '#15181E', bg2: '#242A34', diag: true, diagLines: rgba(lighten(p.accent, 0.25), 0.10),
      card: '#1D222B', border: 'rgba(255,255,255,.06)', borderW: 2, radius: 18,
      shadow: 'rgba(0,0,0,.35)', shadowBlur: 20, shadowY: 8,
      bottomBar: lighten(p.accent, 0.1),
      icon: lighten(p.accent, 0.3), text: '#FFFFFF', sub: 'rgba(255,255,255,.5)',
      mainFill: darken(p.accent, 0.05), mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: '#ffffff', badgeText: '#15181E',
    };
    case 'botanical_calm': return {
      bg1: '#EFF4EC', bg2: '#DDE9D8',
      card: '#FFFFFF', border: 'rgba(122,155,114,.45)', borderW: 2, radius: 48,
      shadow: 'rgba(90,120,80,.12)', shadowBlur: 24, shadowY: 8,
      icon: '#5F8256', text: '#3C4A38', sub: '#8FA089',
      mainFill: '#447A2E', mainText: '#ffffff', mainIcon: '#ffffff',
      badgeBg: '#B3552F', badgeText: '#fff',
    };
    case 'retro_taishu': return {
      bg1: '#20242F', bg2: '#161A23', speckle: true,
      card: '#F5E9CE', border: '#B3402E', borderW: 3.5, inner: true, radius: 12,
      shadow: 'rgba(0,0,0,.30)', shadowBlur: 18, shadowY: 8,
      icon: '#8A3325', text: '#3A2E1E', sub: '#8A7A5C',
      mainFill: '#B3402E', mainText: '#F8EFDD', mainIcon: '#F8EFDD',
      badgeBg: '#20242F', badgeText: '#F5E9CE',
    };
  }
}

function drawBg(c, id, S, p) {
  let g;
  if (S.diag) g = c.createLinearGradient(0, 0, W, H);
  else g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, S.bg1); g.addColorStop(1, S.bg2);
  c.fillStyle = g; c.fillRect(0, 0, W, H);

  if (S.speckle) { // 和紙っぽい細かな点
    c.save();
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 900; i++) {
      c.fillStyle = `rgba(255,255,255,${0.015 + rnd() * 0.03})`;
      c.beginPath(); c.arc(rnd() * W, rnd() * H, rnd() * 3.2 + 0.6, 0, 7); c.fill();
    }
    c.restore();
  }
  if (S.grid) { // うっすらグリッド線
    c.save();
    c.strokeStyle = 'rgba(120,200,255,.05)'; c.lineWidth = 2;
    for (let x = 0; x < W; x += 125) line(c, x, 0, x, H);
    for (let y = 0; y < H; y += 125) line(c, 0, y, W, y);
    c.restore();
  }
  if (S.dots) { // 水玉 (kids)
    c.save();
    c.fillStyle = S.dots;
    for (let y = 0, row = 0; y < H + 60; y += 105, row++) {
      for (let x = row % 2 ? 52 : 0; x < W + 60; x += 105) {
        c.beginPath(); c.arc(x, y, 11, 0, 7); c.fill();
      }
    }
    c.restore();
  }
  if (S.diagLines) { // 斜めのスピードライン (sport)
    c.save();
    c.strokeStyle = S.diagLines; c.lineWidth = 30; c.lineCap = 'butt';
    for (let x = -H; x < W + H; x += 320) line(c, x, H + 40, x + H, -40);
    c.restore();
  }
  if (S.hairline) { // ミニマル: 罫線は drawCell 側で引かず、ここで全体に
    // 罫線はセル境界に沿って描くため drawCellで対応
  }
}

function drawCell(c, t, S, p, r, b, i, showEn) {
  const isMain = !!b.main;
  const big = !!r.big;
  c.save();

  // --- カード ---
  if (t.id === 'minimal_line') {
    // 罫線のみ: セルの右/下に hairline
    c.strokeStyle = S.hairline; c.lineWidth = 2;
    const M = 46;
    if (r.x + r.w < W - M - 10) line(c, r.x + r.w + 16, r.y + 30, r.x + r.w + 16, r.y + r.h - 30);
    if (r.y + r.h < H - M - 10) line(c, r.x + 30, r.y + r.h + 16, r.x + r.w - 30, r.y + r.h + 16);
  } else {
    let fill = S.card;
    if (S.pastels) fill = S.pastels[i % S.pastels.length];
    if (S.blocks) fill = S.blocks[i % S.blocks.length];
    if (isMain) {
      if (S.mainGrad) {
        const g = c.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
        g.addColorStop(0, S.mainGrad[1]); g.addColorStop(1, S.mainGrad[0]);
        fill = g;
      } else if (S.mainFill) fill = S.mainFill;
      else if (S.blocks) fill = darken(p.accent, 0.05);
    }
    if (S.shadow && S.shadow !== 'rgba(0,0,0,0)') {
      c.shadowColor = S.shadow;
      c.shadowBlur = S.shadowBlur != null ? S.shadowBlur : (S.glow ? 46 : 26);
      c.shadowOffsetY = S.shadowY != null ? S.shadowY : (S.glow ? 0 : 10);
    }
    c.fillStyle = fill;
    rr(c, r.x, r.y, r.w, r.h, S.radius); c.fill();
    c.shadowColor = 'transparent'; c.shadowBlur = 0; c.shadowOffsetY = 0;

    if (S.borderW) {
      c.strokeStyle = isMain && S.mainGrad ? rgba('#ffffff', 0.5) : (S.borderCycle ? S.borderCycle[i % S.borderCycle.length] : S.border);
      c.lineWidth = S.borderW;
      if (S.dash) c.setLineDash(S.dash);
      rr(c, r.x, r.y, r.w, r.h, S.radius); c.stroke();
      c.setLineDash([]);
      if (S.inner) { // 二重線 (luxury / elegant)
        c.lineWidth = 1.4;
        rr(c, r.x + 12, r.y + 12, r.w - 24, r.h - 24, Math.max(6, S.radius - 8)); c.stroke();
      }
    }
    if (S.topBar) { // カード上端のアクセントバー (duotone)
      c.fillStyle = isMain ? lighten(p.accent, 0.15) : S.topBar;
      rr(c, r.x + r.w * 0.30, r.y, r.w * 0.40, 14, 7); c.fill();
    }
    if (S.leftBar) { // カード左端の縦バー (medical)
      c.fillStyle = isMain ? 'rgba(255,255,255,.85)' : S.leftBar;
      rr(c, r.x, r.y + r.h * 0.30, 12, r.h * 0.40, 6); c.fill();
    }
    if (S.bottomBar) { // カード下端のアクセントバー (sport)
      c.fillStyle = isMain ? 'rgba(255,255,255,.9)' : S.bottomBar;
      rr(c, r.x + r.w * 0.30, r.y + r.h - 14, r.w * 0.40, 14, 7); c.fill();
    }
  }

  // --- 中身 (アイコン+ラベル) ---
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const iconS = big ? 300 : 176;
  const jpSize = big ? 132 : 88;
  const enSize = big ? 56 : 42;
  const gapIT = big ? 96 : 58;   // アイコン下端→JPラベル
  const contentH = iconS + gapIT + jpSize + (showEn ? enSize + 18 : 0);
  let y0 = cy - contentH / 2;

  // アイコン
  let iconColor = isMain ? (S.mainIcon || S.icon) : S.icon;
  c.strokeStyle = iconColor;
  c.lineWidth = (S.iconThin ? 7 : 11) * (big ? 1.6 : 1);
  c.save();
  c.translate(cx, y0 + iconS / 2);
  if (t.id === 'minimal_line' && isMain && S.mainRing) {
    c.save();
    c.strokeStyle = S.mainRing; c.lineWidth = 5;
    c.beginPath(); c.arc(0, 0, iconS * 0.72, 0, 7); c.stroke();
    c.restore();
    c.strokeStyle = S.mainRing;
  }
  if (S.icon2 && !isMain) c.strokeStyle = (i % 2 === 0) ? S.icon : S.icon2;
  (ICONS[b.icon] || ICONS.info)(c, iconS);
  c.restore();

  // JPラベル
  const textColor = isMain ? (S.mainText || S.text) : S.text;
  c.fillStyle = textColor;
  if (S.ls && 'letterSpacing' in c) c.letterSpacing = (big ? S.ls * 1.5 : S.ls) + 'px';
  c.font = t.jp.replace('FZ', jpSize + 'px');
  c.textAlign = 'center'; c.textBaseline = 'middle';
  let jp = b.jp;
  // 長すぎる場合は縮小
  let jw = c.measureText(jp).width;
  if (jw > r.w - 70) {
    const k = (r.w - 70) / jw;
    c.font = t.jp.replace('FZ', Math.floor(jpSize * k) + 'px');
  }
  c.fillText(jp, cx, y0 + iconS + gapIT + jpSize * 0.45);

  // ENサブ
  if (showEn && b.en) {
    c.fillStyle = isMain ? rgba('#ffffff', t.id === 'luxury_gold' ? 0 : 0.75) : S.sub;
    if (isMain && (t.id === 'luxury_gold' || t.id === 'wamodern')) c.fillStyle = rgba(S.mainText, 0.65);
    if (isMain && t.id === 'flat_clean') c.fillStyle = rgba('#ffffff', 0.8);
    c.font = '500 ' + enSize + 'px ' + t.en;
    c.fillText(b.en.toUpperCase(), cx, y0 + iconS + gapIT + jpSize + enSize * 0.85 + 8);
  }

  // バッジ
  if (b.badge) {
    const bs = big ? 1.4 : 1;
    c.font = '700 ' + Math.round(44 * bs) + 'px "Noto Sans JP"';
    const bw = c.measureText(b.badge).width + 52 * bs;
    const bh = 72 * bs;
    const bx = r.x + r.w - bw - 34, by = r.y + 34;
    c.fillStyle = S.badgeBg;
    rr(c, bx, by, bw, bh, bh / 2); c.fill();
    c.fillStyle = S.badgeText;
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(b.badge, bx + bw / 2, by + bh / 2 + 2);
  }

  // bold_block のメイン装飾 (キラッ)
  if (isMain && S.mainStar) {
    c.save();
    c.translate(r.x + 80, r.y + 80);
    c.strokeStyle = 'rgba(255,255,255,.9)'; c.lineWidth = 8;
    ICONS.sparkle(c, 64);
    c.restore();
  }

  c.restore();
}

// ==================================================================
// プレミアムテーマ (ChatGPTデザイン仕様書 2026-08-13 を数値移植)
// SPEC[id] があるテーマは styleFor/drawCell ではなくこちらで描画する
// ==================================================================

function colA(hex, a) { return (a == null || a >= 1) ? hex : rgba(hex, a); }

function linFill(c, x, y, w, h, lin) {
  const a = lin.a * Math.PI / 180;
  const cx = x + w / 2, cy = y + h / 2;
  const L = (Math.abs(Math.sin(a)) * w + Math.abs(Math.cos(a)) * h) / 2;
  const dx = Math.sin(a) * L, dy = Math.cos(a) * L;
  const g = c.createLinearGradient(cx - dx, cy + dy, cx + dx, cy - dy);
  lin.s.forEach(st => g.addColorStop(st[0], colA(st[1], st[2])));
  return g;
}

function drawPat(c, x, y, w, h, pat) {
  if (!pat) return;
  c.save();
  c.strokeStyle = colA(pat.col, pat.al);
  c.fillStyle = colA(pat.col, pat.al);
  c.lineWidth = pat.lw || 1;
  const sp = pat.sp || 48;
  if (pat.type === 'grid') {
    for (let gx = x; gx <= x + w; gx += sp) line(c, gx, y, gx, y + h);
    for (let gy = y; gy <= y + h; gy += sp) line(c, x, gy, x + w, gy);
    if (pat.dot) {
      c.fillStyle = colA(pat.dotCol || pat.col, pat.dotAl || pat.al);
      for (let gx = x; gx <= x + w; gx += sp) for (let gy = y; gy <= y + h; gy += sp) {
        c.beginPath(); c.arc(gx, gy, pat.dot, 0, 7); c.fill();
      }
    }
  } else if (pat.type === 'diag2' || pat.type === 'diag1') {
    const t = Math.tan((pat.deg || 45) * Math.PI / 180);
    const run = h / t;
    for (let bx = x - run - sp; bx < x + w + run + sp; bx += sp) {
      line(c, bx, y + h, bx + run, y);
      if (pat.type === 'diag2') line(c, bx, y, bx + run, y + h);
    }
  } else if (pat.type === 'vlines') {
    for (let gx = x + sp / 2; gx < x + w; gx += sp) line(c, gx, y, gx, y + h);
  } else if (pat.type === 'seigaiha') {
    const d = pat.d || 54, py = pat.py || d / 2;
    let row = 0;
    for (let gy = y; gy < y + h + d; gy += py, row++) {
      for (let gx = x - d + ((row % 2) ? d / 2 : 0); gx < x + w + d; gx += d) {
        c.beginPath(); c.arc(gx, gy, d / 2, Math.PI, 0); c.stroke();
      }
    }
  } else if (pat.type === 'shippo') {
    const d = pat.d || 96, g2 = pat.g || d / 2;
    for (let gy = y; gy < y + h + d; gy += g2)
      for (let gx = x; gx < x + w + d; gx += g2) {
        c.beginPath(); c.arc(gx, gy, d / 2, 0, 7); c.stroke();
      }
  } else if (pat.type === 'blueprint') {
    for (let gx = x; gx <= x + w; gx += 96) line(c, gx, y, gx, y + h);
    for (let gy = y; gy <= y + h; gy += 96) line(c, x, gy, x + w, gy);
    let seed = 11;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let k = 0; k < 16; k++) c.strokeRect(x + rnd() * (w - 200), y + rnd() * (h - 180), 70 + rnd() * 110, 50 + rnd() * 110);
    for (let k = 0; k < 8; k++) { c.beginPath(); c.arc(x + rnd() * w, y + rnd() * h, 40 + rnd() * 80, rnd() * 3, rnd() * 3 + 1.2 + rnd()); c.stroke(); }
    for (let k = 0; k < 12; k++) { const lx = x + rnd() * w, ly = y + rnd() * h; line(c, lx, ly, lx + 40 + rnd() * 60, ly); }
  }
  c.restore();
}

function drawGrain(c, x, y, w, h, g) { // [dx, dy, offX, col, al]
  c.save();
  c.fillStyle = colA(g[3], g[4]);
  let row = 0;
  for (let yy = y; yy < y + h; yy += g[1], row++)
    for (let xx = x + ((row % 2) ? g[2] : 0); xx < x + w; xx += g[0])
      c.fillRect(xx, yy, 2, 2);
  c.restore();
}

function drawCornerSet(c, cfg, pos) {
  if (!cfg) return;
  c.save();
  const n = Array.isArray(cfg.lw) ? cfg.lw.length : (cfg.n || 3);
  for (let k = 0; k < n; k++) {
    c.strokeStyle = colA(cfg.col, Array.isArray(cfg.al) ? cfg.al[k] : cfg.al);
    c.lineWidth = Array.isArray(cfg.lw) ? cfg.lw[k] : cfg.lw;
    const r0 = (cfg.r0 || 250) + k * (cfg.sp || 13) * 2.3;
    c.beginPath();
    if (cfg.line) { // 直線で角を落とす
      if (pos === 'tl') { c.moveTo(0, r0); c.lineTo(r0, 0); }
      else { c.moveTo(W - r0, H); c.lineTo(W, H - r0); }
    } else { // 曲線(同心円弧)
      if (pos === 'tl') c.arc(0, 0, r0, 0, Math.PI / 2);
      else c.arc(W, H, r0, Math.PI, Math.PI * 1.5);
    }
    c.stroke();
  }
  c.restore();
}

function drawSpecBg(c, S) {
  c.fillStyle = linFill(c, 0, 0, W, H, S.bg.lin);
  c.fillRect(0, 0, W, H);
  (S.bg.rads || []).forEach(rd => {
    const g = c.createRadialGradient(rd.x, rd.y, 0, rd.x, rd.y, rd.r);
    rd.s.forEach(st => g.addColorStop(st[0], colA(st[1], st[2] == null ? 1 : st[2])));
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  });
  if (S.bg.veil) {
    const g = c.createLinearGradient(0, 0, 0, S.bg.veil[0]);
    g.addColorStop(0, rgba('#FFFFFF', S.bg.veil[1])); g.addColorStop(1, rgba('#FFFFFF', 0));
    c.fillStyle = g; c.fillRect(0, 0, W, S.bg.veil[0]);
  }
  drawPat(c, 0, 0, W, H, S.bg.pat);
  if (S.bg.pat2) drawPat(c, 0, 0, W, H, S.bg.pat2);
  if (S.bg.grain) drawGrain(c, 0, 0, W, H, S.bg.grain);
  if (S.bg.corners) {
    drawCornerSet(c, S.bg.corners.tl || S.bg.corners, 'tl');
    drawCornerSet(c, S.bg.corners.br || S.bg.corners, 'br');
  }
}

function drawDivShape(c, x, y, dv, col) {
  const ss = dv.ss || 16;
  c.save();
  c.translate(x, y);
  c.strokeStyle = col; c.fillStyle = col; c.lineWidth = (dv.lw || 1.5) + 0.5;
  if (dv.shape === 'circle') {
    c.beginPath(); c.arc(0, 0, ss / 2, 0, 7); c.stroke();
  } else if (dv.shape === 'hex') {
    c.beginPath();
    for (let k = 0; k < 6; k++) {
      const a = Math.PI / 6 + k * Math.PI / 3;
      const px = Math.cos(a) * ss / 2, py = Math.sin(a) * ss / 2;
      k ? c.lineTo(px, py) : c.moveTo(px, py);
    }
    c.closePath(); c.stroke();
  } else if (dv.shape === 'leaf') {
    line(c, 0, ss * 0.55, 0, -ss * 0.55);
    [[-1, -0.5], [1, -0.5]].forEach(dir => {
      c.beginPath();
      c.ellipse(dir[0] * ss * 0.62, dir[1] * ss * 0.2, ss * 0.58, ss * 0.26, dir[0] * 0.55, 0, 7);
      c.stroke();
    });
  } else if (dv.shape === 'dsq') {
    c.rotate(Math.PI / 4);
    c.strokeRect(-ss / 2, -ss / 2, ss, ss);
    c.fillRect(-ss * 0.21, -ss * 0.21, ss * 0.42, ss * 0.42);
  } else { // diamond
    c.rotate(Math.PI / 4);
    c.strokeRect(-ss / 2, -ss / 2, ss, ss);
    c.fillRect(-ss * 0.15, -ss * 0.15, ss * 0.3, ss * 0.3);
  }
  c.restore();
}

function drawSpecCell(c, S, r, b, i, showEn) {
  const isMain = !!b.main;
  const cf = isMain ? S.main : S.card;
  const rad = cf.r;
  const s = r.h / 712;
  c.save();
  c.lineCap = 'round'; c.lineJoin = 'round';

  // 塗り(多層影つき)
  const fill = linFill(c, r.x, r.y, r.w, r.h, cf.lin);
  const shadows = cf.shadows && cf.shadows.length ? cf.shadows : [[null]];
  shadows.forEach(sh => {
    c.save();
    if (sh[0]) { c.shadowColor = colA(sh[0], sh[1]); c.shadowBlur = sh[2]; c.shadowOffsetY = sh[3] || 0; }
    c.fillStyle = fill;
    rr(c, r.x, r.y, r.w, r.h, rad); c.fill();
    c.restore();
  });

  // カード内(クリップ): ハイライト・パターン・紙質感・上辺光
  c.save();
  rr(c, r.x, r.y, r.w, r.h, rad); c.clip();
  if (cf.rad) {
    const gx = r.x + r.w * cf.rad.x, gy = r.y + r.h * cf.rad.y;
    const g = c.createRadialGradient(gx, gy, 0, gx, gy, Math.max(r.w, r.h) * cf.rad.r);
    cf.rad.s.forEach(st => g.addColorStop(st[0], colA(st[1], st[2])));
    c.fillStyle = g; c.fillRect(r.x, r.y, r.w, r.h);
  }
  drawPat(c, r.x, r.y, r.w, r.h, cf.pat);
  if (cf.grain) drawGrain(c, r.x + 26, r.y + 26, r.w - 52, r.h - 52, cf.grain);
  if (cf.topHL) {
    c.strokeStyle = rgba('#FFFFFF', cf.topHL[2]); c.lineWidth = 2;
    line(c, r.x + cf.topHL[1], r.y + cf.topHL[0] + 1, r.x + r.w - cf.topHL[1], r.y + cf.topHL[0] + 1);
  }
  c.restore();

  // 多重罫線 (inset, width, color, alpha)
  (cf.borders || []).forEach(bd => {
    c.strokeStyle = colA(bd[2], bd[3]);
    c.lineWidth = bd[1];
    const ins = bd[0];
    rr(c, r.x + ins, r.y + ins, r.w - 2 * ins, r.h - 2 * ins, Math.max(4, rad - ins * 0.7));
    c.stroke();
  });

  // 上端アクセントバー [w, h, y, col, al]
  if (cf.bar) {
    c.fillStyle = colA(cf.bar[3], cf.bar[4]);
    rr(c, r.x + (r.w - cf.bar[0]) / 2, r.y + cf.bar[2] * s, cf.bar[0], cf.bar[1], cf.bar[1] / 2);
    c.fill();
  }
  // 四隅L字 [len, lw, col, al, inset]
  if (cf.cornerL) {
    const [len, lwL, colL, alL, insL] = cf.cornerL;
    c.strokeStyle = colA(colL, alL); c.lineWidth = lwL;
    [[r.x + insL, r.y + insL, 1, 1], [r.x + r.w - insL, r.y + insL, -1, 1],
     [r.x + insL, r.y + r.h - insL, 1, -1], [r.x + r.w - insL, r.y + r.h - insL, -1, -1]].forEach(k => {
      c.beginPath(); c.moveTo(k[0] + len * k[2], k[1]); c.lineTo(k[0], k[1]); c.lineTo(k[0], k[1] + len * k[3]); c.stroke();
    });
  }

  // ---- コンテンツ ----
  const cx = r.x + r.w / 2;
  const ic = S.icon;
  const iSize = isMain ? (ic.msize || ic.size) : ic.size;
  c.save();
  c.translate(cx, r.y + (ic.top || 108) * s + iSize / 2);
  c.strokeStyle = isMain ? ic.mcol : ic.col;
  c.lineWidth = ic.w;
  (ICONS[b.icon] || ICONS.info)(c, iSize);
  c.restore();

  // 日本語ラベル
  const jp = S.jp;
  const jpSize0 = isMain ? jp.msize : jp.size;
  const jpLs = isMain ? jp.mls : jp.ls;
  c.fillStyle = isMain ? jp.mcol : jp.col;
  if ('letterSpacing' in c) c.letterSpacing = jpLs + 'px';
  c.font = (jp.wgt || 600) + ' ' + jpSize0 + 'px ' + jp.f;
  c.textAlign = 'center'; c.textBaseline = 'middle';
  let jpSize = jpSize0;
  const mw = c.measureText(b.jp).width;
  if (mw > r.w - 90) {
    jpSize = Math.floor(jpSize0 * (r.w - 90) / mw);
    c.font = (jp.wgt || 600) + ' ' + jpSize + 'px ' + jp.f;
  }
  const jpY = r.y + (isMain ? (jp.my || jp.y) : jp.y) * s;
  c.fillText(b.jp, cx + jpLs / 2, jpY);
  if ('letterSpacing' in c) c.letterSpacing = '0px';

  // 仕切り線 + 英語サブラベル
  if (showEn && b.en) {
    const dv = S.div, en = S.en;
    const divY = jpY + jpSize0 * 0.55 + 42 * s;
    if (dv) {
      const colD = colA(isMain ? dv.mcol : dv.col, isMain ? dv.mal : dv.al);
      c.strokeStyle = colD; c.lineWidth = dv.lw || 1.5;
      const half = (dv.w - dv.gap) / 2;
      line(c, cx - dv.w / 2, divY, cx - dv.w / 2 + half, divY);
      line(c, cx + dv.w / 2 - half, divY, cx + dv.w / 2, divY);
      drawDivShape(c, cx, divY, dv, colD);
    }
    const enSize = isMain ? (en.msize || en.size) : en.size;
    const enLs = isMain ? (en.mls || en.ls) : en.ls;
    c.fillStyle = isMain ? en.mcol : en.col;
    if ('letterSpacing' in c) c.letterSpacing = enLs + 'px';
    c.font = (en.wgt || 500) + ' ' + enSize + 'px "Noto Sans JP"';
    c.fillText(b.en.toUpperCase(), cx + enLs / 2, divY + 30 * s + enSize * 0.62);
    if ('letterSpacing' in c) c.letterSpacing = '0px';
  }

  // バッジ
  if (b.badge && S.badge) {
    c.font = '700 40px "Noto Sans JP"';
    const bw = c.measureText(b.badge).width + 48, bh = 64;
    const bx = r.x + r.w - bw - 40, by = r.y + 40;
    c.fillStyle = S.badge.bg;
    rr(c, bx, by, bw, bh, bh / 2); c.fill();
    c.fillStyle = S.badge.tx;
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(b.badge, bx + bw / 2, by + bh / 2 + 2);
  }
  c.restore();
}

const SPEC = {
  kuro_sumi: {
    bg: {
      lin: { a: 135, s: [[0, '#29261F'], [.24, '#171914'], [.58, '#0D100E'], [1, '#080908']] },
      rads: [
        { x: 0, y: 0, r: 1050, s: [[0, '#9A774D', .25], [.32, '#654B31', .10], [.72, '#000000', 0], [1, '#000000', 0]] },
        { x: 2500, y: 1686, r: 900, s: [[0, '#A77D32', .09], [.55, '#4B381D', .035], [1, '#000000', 0]] },
      ],
      pat: { type: 'diag2', deg: 60, sp: 54, col: '#D6BD87', al: .055, lw: 1 },
      corners: { col: '#BA9144', lw: [3, 1.5, 1.5, 1.5, 1.5], al: [.48, .36, .28, .20, .14], sp: 13, r0: 260 },
    },
    card: {
      lin: { a: 90, s: [[0, '#FFFDF7'], [.43, '#F9F3E7'], [1, '#F0E5D2']] },
      rad: { x: .5, y: .38, r: .7, s: [[0, '#FFFFFF', .32], [.65, '#FFFFFF', 0], [1, '#FFFFFF', 0]] },
      r: 42,
      borders: [[14, 3, '#CCAD6D', .82], [23, 1, '#886827', .22]],
      shadows: [['#000000', .42, 24, 12], ['#000000', .20, 6, 3]],
      topHL: [3, 48, .58],
      grain: [17, 19, 8, '#785C35', .035],
    },
    main: {
      lin: { a: 135, s: [[0, '#283027'], [.44, '#182019'], [1, '#0C100D']] },
      rad: { x: .34, y: .20, r: .85, s: [[0, '#536147', .25], [.56, '#1D241C', .06], [1, '#000000', 0]] },
      r: 42,
      pat: { type: 'seigaiha', d: 54, py: 27, col: '#C7A353', al: .10, lw: 1.5 },
      borders: [[12, 5, '#DDB860', .96], [22, 2, '#9C742B', .88]],
      shadows: [['#000000', .58, 30, 14]],
    },
    icon: { col: '#9A7131', mcol: '#E3BD62', w: 6, size: 150, top: 116 },
    jp: { f: '"Shippori Mincho"', wgt: 600, size: 58, msize: 62, col: '#27241E', mcol: '#E6C473', ls: 3.2, mls: 5.6, y: 378, my: 376 },
    div: { w: 340, gap: 34, lw: 1.5, col: '#A67E39', al: .52, mcol: '#D8AE4E', mal: .70, shape: 'diamond', ss: 18 },
    en: { size: 27, msize: 28, wgt: 500, col: '#9A7131', mcol: '#E4BC5F', ls: 8.1, mls: 9 },
    badge: { bg: '#B3402E', tx: '#F5EEE2' },
  },

  velour_glow: {
    bg: {
      lin: { a: 145, s: [[0, '#3E312B'], [.18, '#2F2622'], [.47, '#231D1B'], [.76, '#191615'], [1, '#141211']] },
      rads: [
        { x: 180, y: 120, r: 920, s: [[0, '#A37A54', .23], [.42, '#7B5C42', .10], [1, '#000000', 0]] },
        { x: 2330, y: 1540, r: 760, s: [[0, '#B88B55', .12], [.55, '#7B5C42', .05], [1, '#000000', 0]] },
      ],
      pat: { type: 'shippo', d: 96, g: 48, col: '#C6A26A', al: .10, lw: 1 },
      corners: { col: '#D4AE72', lw: [1.5, 1.5, 2, 3], al: [.52, .38, .28, .18], sp: 14, r0: 240 },
    },
    card: {
      lin: { a: 100, s: [[0, '#FFFDF8'], [.34, '#F8F1E6'], [.67, '#F3E8D7'], [1, '#ECDDCA']] },
      rad: { x: .5, y: .26, r: .74, s: [[0, '#FFFFFF', .34], [.58, '#FFFFFF', .08], [1, '#FFFFFF', 0]] },
      r: 40,
      borders: [[3, 3, '#E5CDA9', 1], [13, 1, '#CFAE78', 1]],
      shadows: [['#000000', .23, 28, 12], ['#000000', .10, 8, 3]],
      topHL: [10, 40, .55],
      grain: [16, 18, 8, '#A98A63', .025],
    },
    main: {
      lin: { a: 145, s: [[0, '#4C3B35'], [.24, '#352A27'], [.58, '#241E1C'], [1, '#1A1717']] },
      rad: { x: .38, y: .22, r: .82, s: [[0, '#8E6D56', .18], [.45, '#5A443B', .08], [1, '#000000', 0]] },
      r: 40,
      pat: { type: 'shippo', d: 92, g: 46, col: '#C59A63', al: .11, lw: 1 },
      borders: [[3, 4, '#E6B867', 1], [12, 1, '#8F6A3B', 1], [19, 1, '#F2D7A2', 1]],
      shadows: [['#000000', .34, 34, 14], ['#000000', .16, 10, 4]],
    },
    icon: { col: '#B08854', mcol: '#E4BB73', w: 5, size: 146, msize: 150, top: 110 },
    jp: { f: '"Shippori Mincho"', wgt: 600, size: 60, msize: 62, col: '#3A2E29', mcol: '#E6C07B', ls: 2.1, mls: 4.3, y: 392, my: 390 },
    div: { w: 332, gap: 28, lw: 1.5, col: '#CDA86A', al: .68, mcol: '#DDB368', mal: .82, shape: 'diamond', ss: 16 },
    en: { size: 27, msize: 28, wgt: 500, col: '#B58B52', mcol: '#E3BC76', ls: 7.6, mls: 8.4 },
    badge: { bg: '#3A2E29', tx: '#F5F0E4' },
  },

  pure_veil: {
    bg: {
      lin: { a: 135, s: [[0, '#F8FBFD'], [.22, '#F1F5F8'], [.48, '#E9EEF2'], [.76, '#E2E8ED'], [1, '#DCE3E9']] },
      rads: [
        { x: 120, y: 110, r: 780, s: [[0, '#D9EEF9', .40], [.36, '#EAF5FB', .18], [1, '#FFFFFF', 0]] },
        { x: 2360, y: 1580, r: 820, s: [[0, '#DCEFFA', .24], [.48, '#EEF7FC', .10], [1, '#FFFFFF', 0]] },
      ],
      veil: [280, .42],
      pat: { type: 'diag2', deg: 45, sp: 56, col: '#BFCBD6', al: .18, lw: 1 },
      corners: { col: '#AEBBC8', lw: [1.5, 2, 2, 3], al: [.70, .55, .40, .28], sp: 13, r0: 220 },
    },
    card: {
      lin: { a: 180, s: [[0, '#FFFFFF'], [.38, '#FAFBFC'], [.72, '#F1F4F7'], [1, '#E9EEF2']] },
      rad: { x: .5, y: .20, r: .76, s: [[0, '#FFFFFF', .34], [.60, '#FFFFFF', .10], [1, '#FFFFFF', 0]] },
      r: 40,
      borders: [[3, 2, '#D5DDE5', 1], [10, 1, '#F8FBFD', 1], [16, 1, '#C5CFD8', 1]],
      shadows: [['#6E7D8C', .18, 24, 12], ['#8C99A6', .08, 8, 3]],
      topHL: [9, 38, .74],
      grain: [18, 18, 0, '#CAD3DB', .018],
    },
    main: {
      lin: { a: 145, s: [[0, '#EDF8FE'], [.24, '#DDEFFB'], [.58, '#CBE3F3'], [1, '#BFD8EB']] },
      rad: { x: .34, y: .18, r: .82, s: [[0, '#FFFFFF', .46], [.42, '#F7FCFF', .18], [1, '#FFFFFF', 0]] },
      r: 40,
      pat: { type: 'diag2', deg: 45, sp: 26, col: '#FFFFFF', al: .14, lw: 1 },
      borders: [[3, 3, '#EAF7FF', 1], [10, 1, '#8FB4CE', 1], [17, 1, '#FDFEFF', 1]],
      shadows: [['#90A7BA', .22, 30, 12], ['#7B93A8', .10, 10, 4]],
    },
    icon: { col: '#97A3AE', mcol: '#6A8FAA', w: 5, size: 148, msize: 150, top: 108 },
    jp: { f: '"Shippori Mincho"', wgt: 600, size: 60, msize: 64, col: '#4A4F56', mcol: '#416F95', ls: 1.8, mls: 3.8, y: 394, my: 392 },
    div: { w: 330, gap: 30, lw: 1.5, col: '#C7D0D8', al: .76, mcol: '#7FA3C2', mal: .88, shape: 'diamond', ss: 16 },
    en: { size: 27, msize: 28, wgt: 400, col: '#A0A7B0', mcol: '#6E97BA', ls: 8.1, mls: 9 },
    badge: { bg: '#416F95', tx: '#FFFFFF' },
  },

  botanical_linen: {
    bg: {
      lin: { a: 135, s: [[0, '#F4F0E6'], [.28, '#ECE8DC'], [.58, '#E4E5D8'], [1, '#D9DDD0']] },
      rads: [
        { x: 160, y: 130, r: 820, s: [[0, '#FFFFFF', .52], [.45, '#F7F4EC', .20], [1, '#FFFFFF', 0]] },
        { x: 2350, y: 1570, r: 760, s: [[0, '#BAC7AE', .22], [.52, '#CBD3C1', .08], [1, '#FFFFFF', 0]] },
      ],
      pat: { type: 'diag1', deg: 45, sp: 48, col: '#8C9684', al: .045, lw: 1 },
      grain: [18, 18, 9, '#8D907F', .035],
      corners: { col: '#839379', lw: 2, n: 4, al: .22, sp: 12, r0: 230 },
    },
    card: {
      lin: { a: 105, s: [[0, '#FFFDF8'], [.46, '#F7F3EA'], [1, '#EEE9DE']] },
      rad: { x: .42, y: .22, r: .78, s: [[0, '#FFFFFF', .32], [.65, '#FFFFFF', 0], [1, '#FFFFFF', 0]] },
      r: 36,
      borders: [[3, 2, '#D8D0C0', 1], [13, 1, '#B7BDAE', 1]],
      shadows: [['#64695F', .16, 24, 10], ['#5A5D55', .07, 8, 3]],
      bar: [210, 10, 30, '#C6AE7D', .72],
    },
    main: {
      lin: { a: 140, s: [[0, '#87977B'], [.36, '#718469'], [.72, '#61745A'], [1, '#53654D']] },
      rad: { x: .28, y: .18, r: .82, s: [[0, '#C7D3BC', .24], [.52, '#A7B69E', .08], [1, '#FFFFFF', 0]] },
      r: 36,
      pat: { type: 'shippo', d: 58, g: 40, col: '#E3E8DA', al: .075, lw: 1 },
      borders: [[3, 3, '#E4E0D3', 1], [12, 1, '#C7D0BC', 1]],
      shadows: [['#3E473A', .28, 30, 13], ['#30382D', .10, 8, 3]],
      bar: [210, 10, 30, '#667A58', .92],
    },
    icon: { col: '#7C806D', mcol: '#F3F0E5', w: 5, size: 146, msize: 150, top: 110 },
    jp: { f: '"Shippori Mincho"', wgt: 600, size: 58, msize: 62, col: '#4D4A41', mcol: '#F4F1E8', ls: 2, mls: 4.3, y: 392, my: 390 },
    div: { w: 326, gap: 34, lw: 1.5, col: '#A9A695', al: .72, mcol: '#D9DDCF', mal: .84, shape: 'leaf', ss: 18 },
    en: { size: 26, msize: 27, wgt: 500, col: '#8A887B', mcol: '#E9E5D9', ls: 7.3, mls: 8.1 },
    badge: { bg: '#667A58', tx: '#F4F1E8' },
  },

  seoul_minimal: {
    bg: {
      lin: { a: 145, s: [[0, '#F8F5F2'], [.30, '#F1ECE8'], [.62, '#E9E5E2'], [1, '#DDD9D6']] },
      rads: [
        { x: 140, y: 120, r: 760, s: [[0, '#F0DDE2', .26], [.48, '#F6E9EC', .10], [1, '#FFFFFF', 0]] },
        { x: 2360, y: 1560, r: 800, s: [[0, '#D4CBC7', .24], [.52, '#E4DEDA', .08], [1, '#FFFFFF', 0]] },
      ],
      pat: { type: 'grid', sp: 64, col: '#BEB6B2', al: .055, lw: 1 },
      corners: { col: '#AFA4A0', lw: 1.5, n: 3, al: .24, sp: 13, r0: 220 },
    },
    card: {
      lin: { a: 110, s: [[0, '#FFFEFC'], [.48, '#F8F5F3'], [1, '#EEEAE7']] },
      rad: { x: .42, y: .18, r: .78, s: [[0, '#FFFFFF', .34], [.64, '#FFFFFF', 0], [1, '#FFFFFF', 0]] },
      r: 32,
      borders: [[3, 2, '#D5CFCC', 1], [14, 1, '#C4BCB8', 1]],
      shadows: [['#6B6461', .13, 26, 11], ['#5A5552', .05, 8, 3]],
      bar: [150, 6, 28, '#C8BEB9', .82],
    },
    main: {
      lin: { a: 140, s: [[0, '#8C747B'], [.35, '#79646B'], [.70, '#66545A'], [1, '#54464B']] },
      rad: { x: .28, y: .16, r: .84, s: [[0, '#BDA5AC', .24], [.50, '#8D737B', .08], [1, '#FFFFFF', 0]] },
      r: 32,
      pat: { type: 'vlines', sp: 30, col: '#F7EDEF', al: .06, lw: 1 },
      borders: [[3, 3, '#EEE2E5', 1], [12, 1, '#BCA8AE', 1]],
      shadows: [['#4A3D42', .28, 32, 14], ['#352E31', .09, 8, 3]],
      bar: [150, 6, 28, '#E9DDE0', .82],
    },
    icon: { col: '#877A75', mcol: '#F7EFEF', w: 4.5, size: 144, msize: 148, top: 108 },
    jp: { f: '"Noto Sans JP"', wgt: 500, size: 56, msize: 60, col: '#4C4644', mcol: '#F9F3F2', ls: 2.5, mls: 3.9, y: 394, my: 392 },
    div: { w: 300, gap: 26, lw: 1, col: '#BFB4AF', al: .70, mcol: '#DCCDD1', mal: .82, shape: 'circle', ss: 8 },
    en: { size: 24, msize: 25, wgt: 400, col: '#9A8F8A', mcol: '#E9DDDF', ls: 7.7, mls: 8.5 },
    badge: { bg: '#66545A', tx: '#F9F3F2' },
  },

  academic_navy: {
    bg: {
      lin: { a: 135, s: [[0, '#121D2B'], [.28, '#172538'], [.57, '#101B29'], [1, '#0B141F']] },
      rads: [
        { x: 80, y: 40, r: 900, s: [[0, '#506986', .18], [.38, '#304861', .08], [1, '#000000', 0]] },
        { x: 2390, y: 1600, r: 760, s: [[0, '#B99A63', .09], [.48, '#745F3F', .035], [1, '#000000', 0]] },
      ],
      pat: { type: 'grid', sp: 64, col: '#A6B3C2', al: .045, lw: 1 },
      pat2: { type: 'diag1', deg: 45, sp: 128, col: '#C1CAD4', al: .025, lw: 1 },
      corners: { col: '#B89A65', lw: 1.5, n: 4, al: .28, sp: 12, r0: 250, line: true },
    },
    card: {
      lin: { a: 105, s: [[0, '#FFFEFA'], [.45, '#F7F5EF'], [1, '#ECE9E1']] },
      rad: { x: .42, y: .18, r: .78, s: [[0, '#FFFFFF', .36], [.55, '#FFFFFF', .08], [1, '#FFFFFF', 0]] },
      r: 24,
      borders: [[3, 2, '#D4D2CA', 1], [13, 1, '#9FA9B3', 1], [20, 1, '#C3A46C', .34]],
      shadows: [['#050A10', .30, 26, 12], ['#05080D', .13, 7, 3]],
      topHL: [10, 38, .55],
      bar: [160, 5, 28, '#AAB3BD', .72],
      grain: [19, 21, 0, '#536170', .02],
    },
    main: {
      lin: { a: 140, s: [[0, '#263D58'], [.30, '#1C3048'], [.67, '#14263B'], [1, '#0D1C2D']] },
      rad: { x: .28, y: .16, r: .84, s: [[0, '#587493', .28], [.45, '#344E69', .10], [1, '#000000', 0]] },
      r: 24,
      pat: { type: 'diag2', deg: 45, sp: 48, col: '#D6DFE8', al: .055, lw: 1 },
      borders: [[3, 4, '#C7A76D', 1], [12, 1, '#EEE4CE', 1], [19, 1, '#80683F', 1]],
      shadows: [['#03070B', .44, 32, 14], ['#000000', .18, 8, 3]],
      bar: [160, 5, 28, '#C5A569', .95],
    },
    icon: { col: '#617184', mcol: '#D1B278', w: 5, size: 144, msize: 150, top: 108 },
    jp: { f: '"Shippori Mincho"', wgt: 600, size: 57, msize: 62, col: '#283546', mcol: '#F6F2E8', ls: 3.1, mls: 5, y: 394, my: 392 },
    div: { w: 320, gap: 32, lw: 1.5, col: '#A4AFB9', al: .62, mcol: '#BFA064', mal: .84, shape: 'diamond', ss: 14 },
    en: { size: 24, msize: 26, wgt: 500, col: '#7D8996', mcol: '#D5B97E', ls: 7.2, mls: 8.3 },
    badge: { bg: '#C7A76D', tx: '#14263B' },
  },

  estate_prestige: {
    bg: {
      lin: { a: 135, s: [[0, '#1B2228'], [.24, '#111A22'], [.55, '#0D151C'], [.78, '#12181D'], [1, '#080E13']] },
      rads: [
        { x: 100, y: 100, r: 900, s: [[0, '#394957', .20], [.38, '#253541', .08], [1, '#000000', 0]] },
        { x: 2380, y: 1560, r: 820, s: [[0, '#8C7045', .11], [.46, '#53432D', .045], [1, '#000000', 0]] },
      ],
      pat: { type: 'blueprint', col: '#B08A50', al: .075, lw: 1 },
      corners: { col: '#B58B4D', lw: 2, n: 4, al: .52, sp: 14, r0: 260, line: true },
    },
    card: {
      lin: { a: 110, s: [[0, '#FFFDF7'], [.35, '#F7F1E6'], [.68, '#EEE5D6'], [1, '#E4D8C7']] },
      rad: { x: .40, y: .18, r: .80, s: [[0, '#FFFFFF', .34], [.55, '#FFFDF8', .08], [1, '#FFFFFF', 0]] },
      r: 26,
      borders: [[3, 3, '#C8B89F', 1], [11, 1, '#F4EADB', 1], [18, 1, '#8F7A59', 1]],
      shadows: [['#000000', .38, 28, 13], ['#000000', .16, 8, 3]],
      topHL: [11, 40, .48],
      grain: [18, 20, 9, '#765E40', .025],
    },
    main: {
      lin: { a: 145, s: [[0, '#1E3040'], [.30, '#152637'], [.65, '#0E1C29'], [1, '#08131D']] },
      rad: { x: .30, y: .18, r: .84, s: [[0, '#466079', .24], [.46, '#263C50', .08], [1, '#000000', 0]] },
      r: 26,
      pat: { type: 'diag2', deg: 45, sp: 52, col: '#C6A269', al: .085, lw: 1 },
      borders: [[3, 4, '#C89D54', 1], [12, 2, '#F1D79D', 1], [20, 1, '#735528', 1]],
      shadows: [['#000000', .54, 34, 15], ['#000000', .22, 9, 4]],
    },
    icon: { col: '#78664C', mcol: '#D1A75E', w: 5, size: 148, msize: 152, top: 105 },
    jp: { f: '"Shippori Mincho"', wgt: 600, size: 58, msize: 62, col: '#25292D', mcol: '#F5EFE4', ls: 3.5, mls: 5, y: 394, my: 392 },
    div: { w: 360, gap: 28, lw: 1, col: '#A99677', al: .56, mcol: '#B99152', mal: .78, shape: 'diamond', ss: 12 },
    en: { size: 25, msize: 26, wgt: 500, col: '#8A7554', mcol: '#D4AA62', ls: 8.5, mls: 9.4 },
    badge: { bg: '#C89D54', tx: '#0E1C29' },
  },

  civic_authority: {
    bg: {
      lin: { a: 135, s: [[0, '#18222D'], [.28, '#111A24'], [.58, '#0C141C'], [1, '#080E14']] },
      rads: [
        { x: 120, y: 100, r: 860, s: [[0, '#53687C', .16], [.42, '#304357', .065], [1, '#000000', 0]] },
        { x: 2380, y: 1580, r: 780, s: [[0, '#A48655', .075], [.46, '#665334', .025], [1, '#000000', 0]] },
      ],
      pat: { type: 'grid', sp: 72, col: '#B8C2CC', al: .038, lw: 1 },
      corners: { col: '#B39969', lw: 1.5, n: 3, al: .30, sp: 13, r0: 240, line: true },
    },
    card: {
      lin: { a: 105, s: [[0, '#FFFEFB'], [.42, '#F8F7F3'], [1, '#EEEDE8']] },
      rad: { x: .42, y: .18, r: .76, s: [[0, '#FFFFFF', .30], [.58, '#FFFFFF', .06], [1, '#FFFFFF', 0]] },
      r: 18,
      borders: [[3, 2, '#D1D5D8', 1], [11, 1, '#F9F9F6', 1], [18, 1, '#9AA5AF', 1]],
      shadows: [['#000000', .28, 24, 11], ['#000000', .11, 7, 3]],
      topHL: [10, 42, .54],
      bar: [180, 4, 32, '#AEB7BF', .68],
      cornerL: [30, 1, '#8794A0', .42, 14],
      grain: [20, 22, 0, '#526170', .018],
    },
    main: {
      lin: { a: 145, s: [[0, '#26394A'], [.30, '#1C2D3D'], [.65, '#132332'], [1, '#0B1722']] },
      rad: { x: .30, y: .16, r: .82, s: [[0, '#60778D', .22], [.45, '#3A5166', .075], [1, '#000000', 0]] },
      r: 18,
      pat: { type: 'vlines', sp: 32, col: '#D9E1E8', al: .045, lw: 1 },
      borders: [[3, 4, '#B89A64', 1], [12, 1, '#E6D6B7', 1], [19, 1, '#6F5C3C', 1]],
      shadows: [['#000000', .46, 30, 14], ['#000000', .18, 8, 3]],
      bar: [180, 4, 32, '#B89A64', .90],
      cornerL: [30, 1, '#C7A970', .58, 14],
    },
    icon: { col: '#657483', mcol: '#C7A970', w: 4.5, size: 144, msize: 148, top: 108 },
    jp: { f: '"Shippori Mincho"', wgt: 600, size: 56, msize: 60, col: '#293746', mcol: '#F6F3EC', ls: 3.1, mls: 4.5, y: 394, my: 392 },
    div: { w: 320, gap: 30, lw: 1, col: '#A5AFB8', al: .64, mcol: '#B89A64', mal: .84, shape: 'dsq', ss: 14 },
    en: { size: 24, msize: 25, wgt: 500, col: '#7F8A94', mcol: '#CDB27D', ls: 7.2, mls: 8 },
    badge: { bg: '#B89A64', tx: '#132332' },
  },

  nocturne_neon: {
    bg: {
      lin: { a: 135, s: [[0, '#090A10'], [.28, '#10111A'], [.58, '#0B0C13'], [1, '#05060A']] },
      rads: [
        { x: 180, y: 120, r: 900, s: [[0, '#6D36B8', .20], [.40, '#3D2168', .08], [1, '#000000', 0]] },
        { x: 2350, y: 1580, r: 820, s: [[0, '#00C7D9', .16], [.45, '#007B8C', .05], [1, '#000000', 0]] },
        { x: 1250, y: 820, r: 980, s: [[0, '#C245A8', .055], [.58, '#C245A8', 0], [1, '#000000', 0]] },
      ],
      pat: { type: 'grid', sp: 64, col: '#8DA1B8', al: .035, lw: 1, dot: 2, dotCol: '#82C9D4', dotAl: .07 },
      corners: {
        tl: { col: '#5FE7F2', lw: [2, 1, 1], al: [.54, .28, .16], sp: 14, r0: 240 },
        br: { col: '#E267C5', lw: [2, 1, 1], al: [.48, .25, .14], sp: 14, r0: 240 },
      },
    },
    card: {
      lin: { a: 120, s: [[0, '#151720'], [.42, '#10121A'], [1, '#0A0C12']] },
      rad: { x: .38, y: .18, r: .78, s: [[0, '#2A2D3A', .28], [.60, '#2A2D3A', 0], [1, '#000000', 0]] },
      r: 28,
      borders: [[3, 2, '#3B4352', 1], [13, 1, '#78879A', 1], [19, 1, '#59D9E5', .28]],
      shadows: [['#000000', .54, 30, 14], ['#000000', .24, 8, 4]],
      bar: [180, 4, 30, '#6EDCE5', .46],
    },
    main: {
      lin: { a: 145, s: [[0, '#241733'], [.30, '#1A1428'], [.65, '#101522'], [1, '#091019']] },
      rad: { x: .28, y: .18, r: .84, s: [[0, '#C14DAA', .20], [.35, '#7B3A91', .10], [.70, '#31C6D8', .05], [1, '#000000', 0]] },
      r: 28,
      pat: { type: 'diag2', deg: 45, sp: 42, col: '#B7EAF0', al: .035, lw: 1 },
      borders: [[3, 3, '#60E1EB', 1], [12, 1, '#E067C6', 1], [19, 1, '#94F5FB', 1]],
      shadows: [['#42D9E7', .28, 22, 0], ['#D656B6', .16, 34, 0], ['#000000', .48, 32, 14]],
      bar: [180, 4, 30, '#B9F7FA', .88],
    },
    icon: { col: '#7DDDE5', mcol: '#B8F5F9', w: 4.5, size: 146, msize: 150, top: 106 },
    jp: { f: '"Noto Sans JP"', wgt: 500, size: 56, msize: 60, col: '#E7EDF2', mcol: '#F8FCFD', ls: 3.1, mls: 4.5, y: 394, my: 392 },
    div: { w: 320, gap: 34, lw: 1, col: '#66798A', al: .60, mcol: '#69DCE5', mal: .86, shape: 'hex', ss: 16 },
    en: { size: 24, msize: 25, wgt: 400, col: '#7F909E', mcol: '#DEA0D0', ls: 8.2, mls: 9 },
    badge: { bg: '#60E1EB', tx: '#091019' },
  },

  quiet_grid: {
    bg: {
      lin: { a: 135, s: [[0, '#F6F6F3'], [.32, '#F1F0EC'], [.66, '#EBEAE6'], [1, '#E5E4DF']] },
      rads: [
        { x: 180, y: 120, r: 820, s: [[0, '#FFFFFF', .52], [.45, '#FAFAF7', .18], [1, '#FFFFFF', 0]] },
        { x: 2350, y: 1560, r: 760, s: [[0, '#CFD6D3', .20], [.50, '#DDE2DF', .07], [1, '#FFFFFF', 0]] },
      ],
      pat: { type: 'grid', sp: 72, col: '#A9ADA9', al: .04, lw: 1 },
      corners: { col: '#8C928E', lw: 1, n: 3, al: .18, sp: 12, r0: 200, line: true },
    },
    card: {
      lin: { a: 110, s: [[0, '#FFFFFF'], [.45, '#FBFBF9'], [1, '#F1F1ED']] },
      rad: { x: .40, y: .18, r: .76, s: [[0, '#FFFFFF', .30], [.60, '#FFFFFF', 0], [1, '#FFFFFF', 0]] },
      r: 28,
      borders: [[3, 2, '#D6D8D4', 1], [13, 1, '#BFC3BF', 1]],
      shadows: [['#555A57', .12, 24, 10], ['#3D423F', .05, 7, 3]],
      topHL: [10, 40, .68],
      bar: [140, 5, 30, '#C0C5C1', .72],
      cornerL: [26, 1, '#B7BCB8', .35, 18],
      grain: [22, 24, 0, '#727975', .012],
    },
    main: {
      lin: { a: 140, s: [[0, '#414A46'], [.35, '#343C39'], [.70, '#29302E'], [1, '#202624']] },
      rad: { x: .28, y: .18, r: .82, s: [[0, '#65716C', .22], [.48, '#4D5853', .07], [1, '#000000', 0]] },
      r: 28,
      pat: { type: 'vlines', sp: 36, col: '#F6F7F5', al: .028, lw: 1 },
      borders: [[3, 3, '#AEB8B2', 1], [12, 1, '#E7EBE8', 1], [18, 1, '#79837E', .60]],
      shadows: [['#252A27', .30, 30, 13], ['#000000', .10, 8, 3]],
      bar: [140, 5, 30, '#DCE2DE', .88],
      cornerL: [26, 1, '#C8D0CB', .42, 18],
    },
    icon: { col: '#68706C', mcol: '#F2F4F1', w: 4.5, size: 144, msize: 148, top: 108 },
    jp: { f: '"Noto Sans JP"', wgt: 500, size: 56, msize: 60, col: '#353A37', mcol: '#F5F6F3', ls: 2.5, mls: 3.6, y: 394, my: 392 },
    div: { w: 300, gap: 24, lw: 1, col: '#B3B8B4', al: .62, mcol: '#C9D0CC', mal: .80, shape: 'circle', ss: 8 },
    en: { size: 24, msize: 25, wgt: 400, col: '#8A908C', mcol: '#D6DDD8', ls: 7.2, mls: 7.9 },
    badge: { bg: '#353A37', tx: '#F5F6F3' },
  },
};

// ========== 状態 ==========
const state = {
  industry: null,
  mood: 'omakase',
  themeId: null,
  n: 6,
  showEn: true,
  buttons: [],   // 編集用コピー
  accentOverride: null,
  useDefColor: true,
};

function currentPal() {
  const pal = Object.assign({}, state.industry.pal);
  if (!state.useDefColor && state.accentOverride) pal.accent = state.accentOverride;
  return pal;
}
function currentTheme() { return THEMES.find(t => t.id === state.themeId) || THEMES[0]; }

// ========== UI 構築 ==========
const $ = s => document.querySelector(s);

function init() {
  // 業種
  const ig = $('#indGrid');
  INDUSTRIES.forEach(ind => {
    const b = document.createElement('button');
    b.innerHTML = `<span class="em">${ind.em}</span>${ind.name}`;
    b.onclick = () => {
      state.industry = ind;
      state.buttons = ind.buttons.map(x => Object.assign({}, x));
      state.accentOverride = null; state.useDefColor = true;
      [...ig.children].forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      $('#step2').classList.remove('hidden');
      $('#step3').classList.remove('hidden');
      buildGallery();
      $('#step2').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    ig.appendChild(b);
  });

  // 雰囲気
  const mc = $('#moodChips');
  MOODS.forEach(m => {
    const b = document.createElement('button');
    b.textContent = m.name;
    if (m.id === 'omakase') b.classList.add('sel');
    b.onclick = () => {
      state.mood = m.id;
      [...mc.children].forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      if (state.industry) buildGallery();
    };
    mc.appendChild(b);
  });

  // ボタン数
  [...$('#layoutRow').children].forEach(b => {
    if (+b.dataset.n === state.n) b.classList.add('sel');
    b.onclick = () => {
      state.n = +b.dataset.n;
      [...$('#layoutRow').children].forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      buildLabelEditor(); renderEditor(); renderAreaTable();
    };
  });

  $('#chkEn').onchange = e => { state.showEn = e.target.checked; renderEditor(); };
  $('#chkDefColor').onchange = e => { state.useDefColor = e.target.checked; renderEditor(); if (state.industry) buildGallery(); };
  $('#accentPick').oninput = e => {
    state.accentOverride = e.target.value; state.useDefColor = false;
    $('#chkDefColor').checked = false;
    renderEditor();
  };

  $('#btnDl').onclick = () => download('jpg');
  $('#btnPng').onclick = () => download('png');
}

// フォント読み込み後にギャラリー描画
async function ensureFonts() {
  const loads = [
    '400 40px "Noto Sans JP"', '500 40px "Noto Sans JP"',
    '700 40px "Noto Sans JP"', '900 40px "Noto Sans JP"',
    '800 40px "M PLUS Rounded 1c"',
    '600 40px "Shippori Mincho"', '700 40px "Shippori Mincho"',
    '700 40px "Zen Maru Gothic"', '500 40px "Zen Maru Gothic"',
  ].map(f => document.fonts.load(f, 'ご予約メニューRESERVE'));
  try { await Promise.all(loads); await document.fonts.ready; } catch (e) { /* システムフォントで続行 */ }
}

let galleryToken = 0;
async function buildGallery() {
  const g = $('#gallery');
  g.innerHTML = '';
  $('#galleryLoading').style.display = 'block';
  const token = ++galleryToken;
  await ensureFonts();
  if (token !== galleryToken) return;
  $('#galleryLoading').style.display = 'none';

  // 並び順: 雰囲気に合うテーマを先頭に
  const order = THEMES.slice().sort((a, b) => {
    const am = state.mood !== 'omakase' && a.moods.includes(state.mood) ? 0 : 1;
    const bm = state.mood !== 'omakase' && b.moods.includes(state.mood) ? 0 : 1;
    return am - bm;
  });

  order.forEach(t => {
    const card = document.createElement('button');
    card.className = 'g-card';
    card.dataset.theme = t.id;
    const cv = document.createElement('canvas');
    cv.style.aspectRatio = '2500 / 1686';
    card.appendChild(cv);
    const cap = document.createElement('div');
    cap.className = 'cap';
    const reco = state.mood !== 'omakase' && t.moods.includes(state.mood);
    cap.innerHTML = `${reco ? '<span class="reco">おすすめ</span>' : ''}<span>${t.name}<span class="sub">${t.desc}</span></span>`;
    card.appendChild(cap);
    card.onclick = () => {
      state.themeId = t.id;
      [...g.children].forEach(x => x.classList.remove('sel'));
      card.classList.add('sel');
      openEditor();
    };
    g.appendChild(card);
    // 描画 (プレビューは 6ボタン固定)
    requestAnimationFrame(() => {
      const cssW = cv.clientWidth || 440;
      renderMenu(cv, { theme: t, pal: state.industry.pal, buttons: state.industry.buttons, n: 6, showEn: true, cssW });
    });
  });

  if (state.themeId) $('#step4').classList.add('hidden');
  state.themeId = null;
}

function openEditor() {
  $('#step4').classList.remove('hidden');
  // 色ピッカー初期値 (プレミアムテーマは専用配色固定のため色調整パネルを隠す)
  const colorPanel = $('#accentPick').closest('.ed-panel');
  if (colorPanel) colorPanel.style.display = SPEC[state.themeId] ? 'none' : '';
  $('#accentPick').value = state.industry.pal.accent;
  $('#chkDefColor').checked = state.useDefColor;
  buildLabelEditor();
  renderEditor();
  renderAreaTable();
  $('#step4').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildLabelEditor() {
  const grid = $('#lblGrid');
  grid.innerHTML = '';
  state.buttons.slice(0, state.n).forEach((b, i) => {
    const row = document.createElement('div');
    row.className = 'lbl-row';
    row.innerHTML = `
      <input type="text" value="${escAttr(b.jp)}" maxlength="10" aria-label="ボタン${i + 1}の日本語">
      <span class="en"><input type="text" value="${escAttr(b.en)}" maxlength="10" aria-label="ボタン${i + 1}の英語"></span>
      <label class="bg"><input type="checkbox" ${b.badge ? 'checked' : ''}>無料</label>`;
    const [jpIn, enIn, bgIn] = row.querySelectorAll('input');
    jpIn.oninput = () => { b.jp = jpIn.value || ' '; renderEditor(); };
    enIn.oninput = () => { b.en = enIn.value; renderEditor(); };
    bgIn.onchange = () => { b.badge = bgIn.checked ? '無料' : null; renderEditor(); };
    grid.appendChild(row);
  });
}
function escAttr(s) { return String(s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

let edTimer = null;
function renderEditor() {
  if (!state.industry || !state.themeId) return;
  clearTimeout(edTimer);
  edTimer = setTimeout(() => {
    const cv = $('#edCanvas');
    const cssW = cv.clientWidth || 700;
    renderMenu(cv, { theme: currentTheme(), pal: currentPal(), buttons: state.buttons, n: state.n, showEn: state.showEn, cssW });
  }, 60);
}

function renderAreaTable() {
  const isSpec = !!SPEC[state.themeId];
  const rects = layoutRects(state.n, isSpec ? 110 : 46, isSpec ? 42 : 32);
  const rows = rects.map((r, i) => {
    const b = state.buttons[i] || {};
    return `<tr><td>${i + 1}. ${b.jp || ''}</td><td>${Math.round(r.x)}</td><td>${Math.round(r.y)}</td><td>${Math.round(r.w)}</td><td>${Math.round(r.h)}</td></tr>`;
  }).join('');
  $('#areaTable').innerHTML = `
    <p style="font-size:.84rem; font-weight:700; margin-top:12px;">ボタン領域の座標（カスタムで領域指定する場合）</p>
    <table><tr><th>ボタン</th><th>X</th><th>Y</th><th>幅</th><th>高さ</th></tr>${rows}</table>`;
}

async function download(fmt) {
  await ensureFonts();
  const cv = document.createElement('canvas');
  renderMenu(cv, { theme: currentTheme(), pal: currentPal(), buttons: state.buttons, n: state.n, showEn: state.showEn, full: true });
  const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
  cv.toBlob(blob => {
    if (!blob) return;
    // LINEの上限1MBを超えたJPGは品質を下げて再生成
    if (fmt !== 'png' && blob.size > 1000 * 1024) {
      cv.toBlob(b2 => saveBlob(b2, fmt), mime, 0.78);
    } else {
      saveBlob(blob, fmt);
    }
  }, mime, 0.88);
}
function saveBlob(blob, fmt) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `richmenu_${state.industry.id}_${state.themeId}_${state.n}btn.${fmt}`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}

window.addEventListener('resize', () => { renderEditor(); });
init();

// URLパラメータで自動選択 (?ind=inshoku&theme=dark_glass) — 動作確認・共有リンク用
(async function autoSelect() {
  const q = new URLSearchParams(location.search);
  const indId = q.get('ind');
  if (!indId) return;
  const idx = INDUSTRIES.findIndex(x => x.id === indId);
  if (idx < 0) return;
  document.querySelectorAll('#indGrid button')[idx].click();
  const th = q.get('theme');
  if (!th) return;
  for (let k = 0; k < 100; k++) {
    await new Promise(r => setTimeout(r, 100));
    const card = document.querySelector(`.g-card[data-theme="${th}"]`);
    if (card) { await new Promise(r => setTimeout(r, 500)); card.click(); return; }
  }
})();
