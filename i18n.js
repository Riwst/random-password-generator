// Minimal i18n: a plain object keyed by language code.
// Adding a language = adding a new top-level key with the same shape.

export const STRINGS = {
  ja: {
    pageTitle: 'ランダムパスワード生成器 | ブラウザだけで動く安全なパスワード生成ツール',
    title: 'ランダムパスワード生成器',
    lede: '暗号学的に安全な乱数で、ブラウザの中だけでパスワードを生成します。何もサーバーには送りません。',
    candidatesAria: '生成されたパスワード候補',
    entropyLabel: 'エントロピー',
    entropyUnit: 'ビット',
    length: '文字数',
    classesLegend: '使う文字の種類',
    lower: '小文字',
    upper: '大文字',
    digits: '数字',
    symbols: '記号',
    generate: '生成する',
    copy: 'コピー',
    copyAria: (n) => `候補 ${n} をコピー`,
    copied: 'クリップボードにコピーしました',
    clipboardError: 'クリップボードが使えません。手動で選択してコピーしてください',
    sourceLink: 'ソースコード・ライセンス（MIT）',
    securityLink: 'セキュリティポリシー',
    langLabel: '言語',

    safetyTitle: 'これって本当に安全？',
    safetyIntro:
      'プログラムの専門知識がなくても、このアプリの安全性はあなた自身の目で確かめられます。3つの方法を順にご紹介します。',

    safety1Title: '① 1分でできる、いちばん確実な確かめ方',
    safety1P1:
      'スマートフォンを機内モードにしてください。または、Wi-Fi を切ってください。そのうえで、もう一度ページ上部の「生成する」を押してみてください。',
    safety1P2: '— 普通にパスワードが出ますね。',
    safety1P3:
      'インターネットが繋がっていないのに動く、ということは、答えがあなたの機械の中だけで作られている、何よりの証拠です。',
    safety1P4:
      '手紙を遠くへ届けるには郵便屋さんが要ります。自分の手帳にメモを書くだけなら、誰の手も借りません。このアプリは、メモ帳と同じ仕組みです。',

    safety2Title: '② リアルタイムの証拠',
    safety2CounterPre: 'このページを開いてから外へ送ったもの:',
    safety2CounterUnit: '回',
    safety2P1:
      'このページは、自分自身を常に見張っています。もし、ほんの少しでも外へ何かを送ろうとすれば、上の数字が増えます。あなたが何度パスワードを作っても、設定を変えても、数字は 0 のままです。',
    safety2P2:
      '「でも、ページが自分で『0』と表示しているだけでは？」 — それを疑うのは健全な態度です。下の「もっと厳密に確かめたい方へ」では、ページではなく Chrome や Safari 自身に同じ 0 を出させて確認できます。',

    safety3Title: '③ ブラウザによる強制ロック',
    safety3P1:
      'このページは、読み込まれた瞬間に、あなたのブラウザ（Chrome、Safari、Firefox など）に対してこう宣言します: 「私はどこのサーバーともやり取りしません」。',
    safety3P2:
      'ブラウザは、その宣言を監視します。もし、このページが気を変えて「やっぱり送ろう」と思っても、ブラウザが先に止めます。',
    safety3DualHeader: 'つまり、安全の根拠は二重です:',
    safety3DualA: 'このページは、外と話さないように作られている。',
    safety3DualB: 'たとえ何かが間違って外に話そうとしても、Chrome や Safari 自身が止める。',
    safety3P3: 'これは、銀行や Amazon の公式サイトでも使われている、Web の標準的な仕組みです。',

    safetyGuaranteesTitle: 'このアプリがあなたに約束すること',
    safetyG1: 'パスワードはあなたの機械の中だけで作られます。サーバーには送りません。',
    safetyG2: '作ったパスワードは保存されません。ページを閉じれば消えます。',
    safetyG3: '履歴も、利用統計も、何も記録しません。',
    safetyG4: 'インターネット接続がなくても動きます。',
    safetyG5: 'プログラムは誰でも読めるように公開されています。',
    safetyG6: '外部の広告、アクセス解析、外部から読み込むフォントや画像 — 何も含まれていません。',

    safetyCuriousTitle: 'もっと厳密に確かめたい方へ',
    safetyCuriousP1:
      'パソコンのブラウザで、このページを右クリック →「検証」または「要素を調査」→「ネットワーク」タブを開いた状態で「生成する」を何度か押してみてください。リストに新しい行が増えなければ、外に何も送っていません。',
    safetyCuriousP2:
      'ソースコードもすべて公開されています。「ソースコード・ライセンス」のリンクから誰でも全文を読めます。',
  },
  en: {
    pageTitle: 'Random Password Generator | Client-side Web Crypto password tool',
    title: 'Random Password Generator',
    lede: 'Cryptographically random passwords, generated locally in your browser. Nothing is transmitted.',
    candidatesAria: 'Generated password candidates',
    entropyLabel: 'Entropy',
    entropyUnit: 'bits',
    length: 'Length',
    classesLegend: 'Character classes',
    lower: 'lowercase',
    upper: 'UPPERCASE',
    digits: 'digits',
    symbols: 'symbols',
    generate: 'generate',
    copy: 'copy',
    copyAria: (n) => `Copy candidate ${n}`,
    copied: 'copied to clipboard',
    clipboardError: 'clipboard unavailable; select and copy manually',
    sourceLink: 'source & license (MIT)',
    securityLink: 'security policy',
    langLabel: 'Language',

    safetyTitle: 'Is this app actually safe?',
    safetyIntro:
      "You don't need any programming knowledge to verify this app's safety with your own eyes. Here are three ways, in order.",

    safety1Title: '① The 30-second check anyone can do',
    safety1P1:
      "Put your phone in airplane mode, or turn off Wi-Fi. Then press the 'generate' button above one more time.",
    safety1P2: '— It still works, doesn’t it?',
    safety1P3:
      'If it works without an internet connection, the answer is being made entirely inside your own machine.',
    safety1P4:
      "Sending a letter requires the post office. Writing a note in your own notebook doesn't. This app is the notebook.",

    safety2Title: '② Live evidence, right now',
    safety2CounterPre: 'Things this page has sent out since you opened it:',
    safety2CounterUnit: '',
    safety2P1:
      'This page constantly watches itself. If it tried to send even a single byte outside, the number above would go up. You can generate passwords, change settings — the number stays at 0.',
    safety2P2:
      "\"But isn't the page just claiming '0'?\" — That's a healthy doubt. In “For the more rigorous reader” below, you can get Chrome or Safari itself to show you the same 0.",

    safety3Title: '③ The browser enforces the lockdown',
    safety3P1:
      "The moment this page is loaded, it declares to your browser (Chrome, Safari, Firefox, etc.): \"I will not talk to any server.\"",
    safety3P2:
      'The browser then enforces that declaration. If this page ever changed its mind and tried to send something, the browser would stop it first.',
    safety3DualHeader: 'So the safety guarantee is two-layered:',
    safety3DualA: 'This page is written never to talk to the outside.',
    safety3DualB: "Even if something tried to talk to the outside, Chrome or Safari itself would stop it.",
    safety3P3: 'This is a standard Web mechanism used by banks and Amazon to harden their official sites.',

    safetyGuaranteesTitle: 'What this app guarantees to you',
    safetyG1: 'Your password is created only inside your machine. We send it to no server.',
    safetyG2: "Generated passwords are not stored. Close the page and they're gone.",
    safetyG3: 'No history, no analytics, no telemetry.',
    safetyG4: 'Works without an internet connection.',
    safetyG5: 'The source code is public for anyone to read.',
    safetyG6: 'No ads, no trackers, no externally loaded fonts or images.',

    safetyCuriousTitle: 'For the more rigorous reader',
    safetyCuriousP1:
      'On a desktop browser, right-click this page → "Inspect" → open the "Network" tab, then press "generate" a few times. If no new rows appear in the list, nothing is being sent out.',
    safetyCuriousP2:
      'The entire source code is public too. Follow the "source & license" link above to read every line.',
  },
};

export const SUPPORTED_LANGS = Object.keys(STRINGS);
export const DEFAULT_LANG = 'ja';

export function detectInitialLang(navigatorLang, stored) {
  if (stored && SUPPORTED_LANGS.includes(stored)) return stored;
  const code = (navigatorLang || '').toLowerCase().split('-')[0];
  if (SUPPORTED_LANGS.includes(code)) return code;
  return DEFAULT_LANG;
}
