/* F案専用。本番の接続先が確定するまで空欄のままにする。
 * EMAIL_REGISTRATION_URL: メール登録サービスのHTTPS URL。
 * 登録サービス側で登録完了後の動画視聴ページへの遷移を設定し、
 * その視聴ページにもLINE相談・申込の導線を置く。
 * LINE_URL: 講座用の公式LINE。診断ナビのLINEと混同しない。
 * VIMEO_ID: 未確定の引き継ぎ項目。LP上では使用・再生しない。
 * Vimeo埋め込みは登録サービスの視聴ページ側で設定する。
 * クエリ文字列やlocalStorageで「登録済み」を偽装する処理は設けない。
 * URL/IDの設定だけで登録・メール送信・限定視聴が完成したとは扱わない。
 */
window.F_CONFIG = Object.freeze({
  EMAIL_REGISTRATION_URL: "",
  LINE_URL: "",
  VIMEO_ID: ""
});
