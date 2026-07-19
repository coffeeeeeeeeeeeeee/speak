import { test, assertEqual } from "./tiny-test.js";
import { createParser } from "../js/commands/parser.js";
import { ja } from "../js/commands/lang/ja.js";

const parser = createParser(ja);

test("parser (ja): コマンドのない文はそのまま一つの text token になる", () => {
  assertEqual(parser.parse("こんにちは世界"), [
    { type: "text", value: "こんにちは世界" },
  ]);
});

test("parser (ja): 日本語にはスペースがないが、文字単位の分割で途中のコマンドも検出できる", () => {
  // 「こんにちは句点世界」には一切スペースがなく、文字単位でなければ
  // 途中の「句点」を見つけられない。
  assertEqual(parser.parse("こんにちは句点世界"), [
    { type: "text", value: "こんにちは" },
    { type: "insert", value: "。" },
    { type: "text", value: "世界" },
  ]);
});

test("parser (ja): 大文字/小文字と履歴のコマンド", () => {
  assertEqual(parser.parse("大文字にする"), [
    { type: "command", action: "capitalizeNext" },
  ]);
  assertEqual(parser.parse("元に戻す"), [{ type: "command", action: "undo" }]);
});

test("parser (ja): 「文字通り」の直後の1文字はコマンドではなくそのまま入力される", () => {
  assertEqual(parser.parse("文字通り句"), [{ type: "text", value: "句" }]);
});

test("parser (ja): 「文字通り」の後に何もない場合はそのまま残る", () => {
  assertEqual(parser.parse("こんにちは文字通り"), [
    { type: "text", value: "こんにちは文字通り" },
  ]);
});

test("parser (ja): テキスト・書式コマンド・句読点・編集コマンドが混在（スペースなし）", () => {
  assertEqual(
    parser.parse("こんにちは大文字にする世界句点改行さようなら単語を削除"),
    [
      { type: "text", value: "こんにちは" },
      { type: "command", action: "capitalizeNext" },
      { type: "text", value: "世界" },
      { type: "insert", value: "。" },
      { type: "insert", value: "\n" },
      { type: "text", value: "さようなら" },
      { type: "command", action: "deleteWord" },
    ]
  );
});
