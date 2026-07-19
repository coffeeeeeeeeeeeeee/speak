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
  code: "ja-JP",
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

  // エスケープ：「文字通り <文字>」でその文字をそのまま入力する。
  // 例：「文字通り 句」と言うと、コマンドではなく「句」の字を入力する。
  literalPrefix: "文字通り",
};
