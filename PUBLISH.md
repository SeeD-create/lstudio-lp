# ポートフォリオLP 公開メモ（2026-08-03）

## 公開先
- 独自ドメイン: **https://l-studiojp.com/**
- ホスティング: GitHub Pages（無料）
- リポジトリ: https://github.com/SeeD-create/lstudio-lp （public / アカウント SeeD-create）
- 公開ファイル: 55MB（index.html＋ロゴ＋ヒーロー画像＋デモ動画18本）

## ★平野さんの操作：DNSの切り替え（これをやるまで公開されません）

l-studiojp.com のDNSは **Squarespace**（旧Google Domains）で管理されています。
[domains.squarespace.com](https://domains.squarespace.com/) にログイン → l-studiojp.com → DNS設定 で以下を変更します。

### 1. 既存のAレコード（@ / ルート）を削除
いまSquarespaceの仮ページを指している次の4件を消します：
`198.185.159.144` / `198.185.159.145` / `198.49.23.144` / `198.49.23.145`

### 2. Aレコードを4件追加（ホスト名は @ または空欄）
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

### 3. CNAMEを1件追加
```
ホスト: www    →    値: seed-create.github.io
```

### 4. 触らないもの（重要）
**MXレコード（smtp.google.com）とTXT/SPFは絶対に消さないでください。** 消すと info@l-studiojp.com のメールが受信できなくなります。今回変更するのはAレコードとCNAMEだけです。

### 5. 反映後
- 反映は数分〜最大24時間（多くは30分以内）
- 反映されたらGitHub側でHTTPS証明書が自動発行される → リポジトリの Settings › Pages で **Enforce HTTPS にチェック**（Claudeに言ってもらえればAPIから設定します）

## 更新のしかた
元データは `Lスタジオ\ポートフォリオ\index.html`。編集後、Claudeに「LPを再公開して」と伝えれば、
ビルド（動画名のASCII化・パス書き換え）→ commit → push まで自動で行い、数分で本番反映されます。

- ビルドスクリプト: scratchpad の `build_lp.ps1` ＋ `lp_map.json`（日本語→ASCIIの対応表）
- 公開対象から除外しているもの: `_無音.mp4`（18本）、`動画素材\`、`チラシ*.png`

## 公開時に加えた変更
- 動画ファイル名を日本語→ASCIIに変換（URLエンコード起因の再生不具合を予防）
- ロゴの参照を `../Lスタジオロゴ.png` → `logo.png` に修正（親フォルダ参照はWeb上で解決できないため）
- canonical / og:url に https://l-studiojp.com/ を追加
