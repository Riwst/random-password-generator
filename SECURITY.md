# Security Policy

## Reporting a vulnerability

If you believe you have found a security vulnerability in this project,
please **do not** open a public issue. Instead, email the maintainer at
`rin@riat.jp` with:

- a description of the issue,
- steps or a proof of concept to reproduce it,
- any suggested remediation.

You should receive an acknowledgement within 72 hours. We aim to publish a
fix and advisory within 14 days for issues that affect users, coordinating
disclosure with you as needed.

## Cryptographic choices

- **CSPRNG.** All randomness comes from `crypto.getRandomValues`, a
  cryptographically secure pseudo-random number generator provided by the
  browser or Node runtime.
- **Bias-free mapping.** Random integers in `[0, n)` are produced by
  rejection sampling (`generator.js → randomInt`). Naive `r % n` is not used.
- **Default character pool.** lowercase (26) + uppercase (26) + digits (10) +
  symbols (26) = 88 characters. Per-character entropy ≈ 6.46 bits.
- **Minimum length.** 6 characters is the hard floor at the API level
  (≈ 38.7 bits with the full pool). The UI offers 6 / 8 / 12 / 16 / 24
  presets; 12+ is the recommended baseline (≈ 77 bits), and 20+ is
  recommended for threat models that need to survive offline GPU cracking.
  Selections below 12 are weak against offline attackers and should be used
  only where a stronger control (e.g. a rate-limited online service) is in
  place.

## Out of scope

This project ships as static files only. The threat model excludes:

- Compromise of the user's browser, OS, hardware RNG, or clipboard.
- Malicious browser extensions, screen recorders, or shoulder-surfing.
- DNS hijacking or HTTPS interception when hosting a fork — operators are
  responsible for the integrity of their own deployments.

## Supply-chain posture

There are no runtime dependencies. Tests run with the Node built-in test
runner — no `npm install` is required to verify the code. Treat any PR
that introduces a dependency as a material change to the threat model.

## Hardening recommendations for fork operators

- Serve over HTTPS with HSTS.
- Keep the bundled `Content-Security-Policy` meta tag (or move it to a
  response header), in particular `connect-src 'none'` to prevent
  exfiltration.
- Add Subresource Integrity (`integrity=...`) attributes if you move scripts
  to a CDN.

---

# セキュリティポリシー

## 脆弱性の報告

このプロジェクトにセキュリティ上の問題を見つけたと思われる場合は、
公開issueには投稿しないでください。代わりに、メンテナへ
`rin@riat.jp` 宛にメールでお知らせください。

メールには、できれば次の内容を含めてください。

- 問題の概要
- 再現手順、または再現できる簡単な例
- 修正案があればその内容

報告には72時間以内の受領返信を目標とします。利用者に影響する問題については、
必要に応じて報告者と調整しながら、14日以内を目安に修正と告知を行います。

## 暗号学的な選択

- **CSPRNG。** すべての乱数は、ブラウザまたはNode実行環境が提供する
  暗号学的に安全な疑似乱数生成器である `crypto.getRandomValues` から取得します。
- **偏りのない対応付け。** `[0, n)` のランダム整数は、rejection sampling
  (`generator.js -> randomInt`) で生成します。単純な `r % n` は使いません。
- **標準の文字集合。** 小文字26文字 + 大文字26文字 + 数字10文字 +
  記号26文字 = 88文字です。1文字あたりのエントロピーは約6.46ビットです。
- **最小文字数。** APIレベルでは6文字を下限としています
  (全文字集合を使った場合、約38.7ビット)。UIでは 6 / 8 / 12 / 16 / 24
  文字を選べます。通常は12文字以上を推奨します(約77ビット)。
  オフラインGPU解析のような脅威を想定する場合は20文字以上を推奨します。
  12文字未満の選択は、オフライン攻撃に対して弱いため、レート制限された
  オンラインサービスなど別の防御がある場合に限って使うべきです。

## 対象外

このプロジェクトは静的ファイルだけで配布されます。以下は脅威モデルの対象外です。

- 利用者のブラウザ、OS、ハードウェア乱数生成器、クリップボードが侵害されている場合
- 悪意あるブラウザ拡張、画面録画、肩越しの覗き見
- フォーク版をホストする際のDNS乗っ取りやHTTPS通信の傍受

フォーク版を公開する運用者は、自分の配布物の完全性に責任を持ってください。

## サプライチェーン上の姿勢

このプロジェクトには実行時依存関係がありません。テストはNode標準のtest runnerで
実行でき、コード確認のために `npm install` は必要ありません。依存関係を追加するPRは、
脅威モデルを変える重要な変更として扱ってください。

## フォーク運用者向けの強化推奨

- HTTPSとHSTSで配信してください。
- 同梱の `Content-Security-Policy` metaタグを維持してください
  (またはレスポンスヘッダへ移してください)。特に、外部送信を防ぐため
  `connect-src 'none'` を維持してください。
- スクリプトをCDNへ移す場合は、Subresource Integrity (`integrity=...`) 属性を
  追加してください。
