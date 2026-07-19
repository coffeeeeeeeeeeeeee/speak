// ============================================================
// commands/lang/zh.js
// Léxico de comandos en chino (mandarín simplificado). Solo datos: lo
// consume el motor (engine.js). Para sumar idiomas: crear otro
// archivo con esta forma y registrarlo en config.js.
//
// `tokenize: "char"` porque el chino no separa palabras con espacios:
// el parser tokeniza por carácter en vez de por palabra para este
// léxico (ver commands/parser.js). Los signos de puntuación son los
// de ancho completo (。，、） en vez de los occidentales (.,)).
// ============================================================

export const zh = {
  code: "zh-CN",
  tokenize: "char",

  // 标点符号 -> 插入的文本。
  punctuation: {
    "句号": "。",
    "逗号": "，",
    "顿号": "、",
    "冒号": "：",
    "分号": "；",
    "省略号": "……",
    "问号": "？",
    "感叹号": "！",
    "换行": "\n",
    "换段": "\n\n",
    "破折号": "——",
    "左括号": "（",
    "右括号": "）",
    "左引号": "“",
    "右引号": "”",
  },

  // 编辑命令 -> 动作名称（由引擎实现）。
  editing: {
    "删除词": "deleteWord",
    "删除单词": "deleteWord",
    "删除最后一个词": "deleteWord",
    "删除句子": "deleteSentence",
    "删除最后一句": "deleteSentence",
    "全部删除": "deleteAll",
    "删除全部": "deleteAll",
    "全选": "selectAll",
  },

  // 大小写：主要用于口述中混入的拉丁字母/英文词。
  casing: {
    "首字母大写": "capitalizeNext",
    "首字母小写": "lowercaseNext",
    "全部大写": "upperOn",
    "取消大写": "upperOff",
  },

  // 历史记录。
  history: {
    "撤销": "undo",
    "重做": "redo",
  },

  // 转义："字面 <字>" 按原样插入该字。
  // 例："字面 句" 输入的是"句"这个字，而不会被当作命令的一部分。
  literalPrefix: "字面",
};
