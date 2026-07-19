import { test, assertEqual } from "./tiny-test.js";
import { createParser } from "../js/commands/parser.js";
import { zh } from "../js/commands/lang/zh.js";

const parser = createParser(zh);

test("parser (zh): 没有命令的文本整体作为一个 text token", () => {
  assertEqual(parser.parse("你好世界"), [{ type: "text", value: "你好世界" }]);
});

test("parser (zh): 中文口述没有空格，也能识别嵌在中间的命令（按字符切分）", () => {
  // 「你好句号世界」整段没有任何空格，只有按字符切分才能在中间发现「句号」。
  assertEqual(parser.parse("你好句号世界"), [
    { type: "text", value: "你好" },
    { type: "insert", value: "。" },
    { type: "text", value: "世界" },
  ]);
});

test("parser (zh): 大小写与历史记录命令", () => {
  assertEqual(parser.parse("首字母大写"), [
    { type: "command", action: "capitalizeNext" },
  ]);
  assertEqual(parser.parse("撤销"), [{ type: "command", action: "undo" }]);
});

test("parser (zh): 「字面」后面紧跟一个字，按字面输入该字而不是执行命令", () => {
  // 「字面句号」没有空格：字面转义只吃掉紧跟着的那一个字符（句），
  // 剩下的「号」单独留下，最终两个字连在一起变成普通文字「句号」。
  assertEqual(parser.parse("字面句号"), [{ type: "text", value: "句号" }]);
});

test("parser (zh): 「字面」后面没有内容时，把它自己原样保留", () => {
  assertEqual(parser.parse("你好字面"), [
    { type: "text", value: "你好字面" },
  ]);
});

test("parser (zh): 文本、格式命令、标点和编辑命令混在一起（全部无空格）", () => {
  assertEqual(
    parser.parse("你好首字母大写世界句号换行再见删除词"),
    [
      { type: "text", value: "你好" },
      { type: "command", action: "capitalizeNext" },
      { type: "text", value: "世界" },
      { type: "insert", value: "。" },
      { type: "insert", value: "\n" },
      { type: "text", value: "再见" },
      { type: "command", action: "deleteWord" },
    ]
  );
});
