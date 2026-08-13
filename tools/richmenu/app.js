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
  { id: 'flat_clean', name: 'クリーン', desc: '白ベース・清潔感', moods: ['shinrai', 'sitasimi'],
    jp: '700 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'dark_glass', name: 'ダークグラス', desc: 'アプリのホーム画面風', moods: ['cool', 'kirei'],
    jp: '700 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'luxury_gold', name: 'ラグジュアリー', desc: '黒×金・高級感', moods: ['kirei'],
    jp: '600 FZ "Shippori Mincho"', en: '"Shippori Mincho"' },
  { id: 'wamodern', name: '和モダン', desc: '深色×金・和の品格', moods: ['wa', 'kirei'],
    jp: '600 FZ "Shippori Mincho"', en: '"Shippori Mincho"' },
  { id: 'pastel_pop', name: 'パステルポップ', desc: 'カラフル・かわいい', moods: ['kawaii', 'sitasimi'],
    jp: '700 FZ "Zen Maru Gothic"', en: '"Zen Maru Gothic"' },
  { id: 'gradient_vivid', name: 'ビビッドグラデ', desc: '鮮やか・目を引く', moods: ['cool', 'sitasimi'],
    jp: '800 FZ "M PLUS Rounded 1c"', en: '"M PLUS Rounded 1c"' },
  { id: 'minimal_line', name: 'ミニマルライン', desc: '線だけ・洗練', moods: ['kirei', 'cool'],
    jp: '500 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'soft_natural', name: 'ナチュラル', desc: 'ベージュ・あたたか', moods: ['sitasimi', 'kawaii'],
    jp: '700 FZ "Zen Maru Gothic"', en: '"Zen Maru Gothic"' },
  { id: 'bold_block', name: 'ボールドブロック', desc: '色タイル・元気', moods: ['sitasimi', 'cool'],
    jp: '800 FZ "M PLUS Rounded 1c"', en: '"M PLUS Rounded 1c"' },
  { id: 'neo_tech', name: 'ネオテック', desc: 'ネオン発光・近未来', moods: ['cool'],
    jp: '700 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'glass_light', name: 'ライトグラス', desc: 'すりガラス・上品', moods: ['shinrai', 'kirei'],
    jp: '700 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'elegant_serif', name: 'エレガント', desc: '白×金・明朝の気品', moods: ['kirei', 'wa'],
    jp: '600 FZ "Shippori Mincho"', en: '"Shippori Mincho"' },
  { id: 'night_neon', name: 'ナイトネオン', desc: '夜のお店・バー向け', moods: ['cool'],
    jp: '700 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'craft_kraft', name: 'クラフト', desc: '紙の手ざわり・カフェ', moods: ['sitasimi', 'kawaii'],
    jp: '700 FZ "Zen Maru Gothic"', en: '"Zen Maru Gothic"' },
  { id: 'duotone_modern', name: 'デュオトーン', desc: '2色構成・メリハリ', moods: ['cool', 'sitasimi'],
    jp: '800 FZ "M PLUS Rounded 1c"', en: '"M PLUS Rounded 1c"' },
  { id: 'medical_soft', name: 'メディカルソフト', desc: '医療・清潔と安心', moods: ['shinrai'],
    jp: '700 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'kids_pop', name: 'キッズポップ', desc: 'クレヨン色・こども向け', moods: ['kawaii', 'sitasimi'],
    jp: '800 FZ "M PLUS Rounded 1c"', en: '"M PLUS Rounded 1c"' },
  { id: 'active_sport', name: 'アクティブ', desc: 'ジム・スポーツの躍動感', moods: ['cool'],
    jp: '900 FZ "Noto Sans JP"', en: '"Noto Sans JP"' },
  { id: 'botanical_calm', name: 'ボタニカル', desc: '深緑・オーガニック', moods: ['sitasimi', 'shinrai'],
    jp: '700 FZ "Zen Maru Gothic"', en: '"Zen Maru Gothic"' },
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
function layoutRects(n) {
  const M = 46, G = 32;
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
  const rects = layoutRects(opts.n);
  const btns = opts.buttons.slice(0, opts.n);
  const S = styleFor(t.id, p);

  // --- 背景 ---
  drawBg(c, t.id, S, p);

  // --- 各セル ---
  btns.forEach((b, i) => {
    const r = rects[i];
    drawCell(c, t, S, p, r, b, i, opts.showEn);
  });

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
  // 色ピッカー初期値
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
  const rects = layoutRects(state.n);
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
