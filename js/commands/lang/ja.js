// ============================================================
// commands/lang/ja.js
// Léxico de comandos en japonés. Solo datos: lo consume el motor
// (engine.js). Para sumar idiomas: crear otro archivo con esta forma
// y registrarlo en config.js.
//
// `tokenize: "char"` porque el japonés no separa palabras con
// espacios: el parser tokeniza por carácter en vez de por palabra
// para este léxico (ver commands/parser.js). La puntuación es la de
// ancho completo habitual en japonés (。、「」).
// ============================================================

export const ja = {
  tokenize: "char",

  // 句読点 -> 挿入されるテキスト。
  punctuation: {
    "句点": "。",
    "読点": "、",
    "コロン": "：",
    "セミコロン": "；",
    "三点リーダー": "……",
    "疑問符": "？",
    "感嘆符": "！",
    "改行": "\n",
    "改段落": "\n\n",
    "ダッシュ": "—",
    "括弧開く": "（",
    "括弧閉じる": "）",
    "かぎ括弧開く": "「",
    "かぎ括弧閉じる": "」",
  },

  // 編集コマンド -> アクション名（エンジンが実装）。
  editing: {
    "単語を削除": "deleteWord",
    "文を削除": "deleteSentence",
    "全部削除": "deleteAll",
    "すべて選択": "selectAll",
  },

  // 大文字/小文字：主に混ざるラテン文字・英単語向け。
  casing: {
    "大文字にする": "capitalizeNext",
    "小文字にする": "lowercaseNext",
    "すべて大文字": "upperOn",
    "大文字終わり": "upperOff",
  },

  // 履歴。
  history: {
    "元に戻す": "undo",
    "やり直す": "redo",
  },

  // シートの書式（太字/斜体/取り消し線/下線をリアルタイムに、
  // markdownInline.js 参照）。それぞれ Markdown の記号を挿入し、
  // 開始と終了で2回言う（「かぎ括弧開く/閉じる」とは違い、同じ語を
  // 2回使う）。
  formatting: {
    "太字": "**",
    "斜体": "*",
    "取り消し線": "~~",
    "下線": "++",
  },

  // 音声でディクテーション言語を切り替える（普通の会話で言語名が出て
  // きただけで誤作動しないよう、あえて特徴的なフレーズにしてある）。
  // 値は config.js の言語ファミリーキー。
  languages: {
    "スペイン語に切り替え": "es",
    "英語に切り替え": "en",
    "フランス語に切り替え": "fr",
    "ポルトガル語に切り替え": "pt",
    "ドイツ語に切り替え": "de",
    "イタリア語に切り替え": "it",
    "中国語に切り替え": "zh",
  },

  // エスケープ：「文字通り <文字>」でその文字をそのまま入力する。
  // 例：「文字通り 句」と言うと、コマンドではなく「句」の字を入力する。
  literalPrefix: "文字通り",
};
