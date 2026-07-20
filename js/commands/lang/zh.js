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

  // 页面格式（实时粗体/斜体/删除线/下划线，见 markdownInline.js）。
  // 每个短语插入对应的 Markdown 标记，需要说两次：一次开始，一次结束
  // ——跟"左引号"/"右引号"是分开的不同，这几个是同一个词用两次。
  formatting: {
    "粗体": "**",
    "斜体": "*",
    "删除线": "~~",
    "下划线": "++",
  },

  // 段落对齐（见 textAlign.js）：只说一次，在段落开头，
  // 只影响这一段——跟"formatting"不同，没有开始/结束。
  align: {
    "居中": "center",
    "两端对齐": "justify",
    "右对齐": "right",
    "左对齐": "left",
  },

  // 段落样式（见 textStyle.js 和编辑栏的下拉菜单）。跟"align"一样：
  // 只说一次，替换该段落之前的样式。"正文"用来取消样式。
  style: {
    "总标题": "title",
    "副标题": "subtitle",
    "标题一": "h1",
    "标题二": "h2",
    "标题三": "h3",
    "标题四": "h4",
    "引用": "quote",
    "正文": "",
  },

  // 用语音切换口述语言（特意用一个独特的短语，避免只是提到某个语言名字
  // 就意外触发）。值是 config.js 里的语言家族键。
  languages: {
    "切换到西班牙语": "es",
    "切换到英语": "en",
    "切换到法语": "fr",
    "切换到葡萄牙语": "pt",
    "切换到德语": "de",
    "切换到意大利语": "it",
    "切换到日语": "ja",
  },

  // 转义："字面 <字>" 按原样插入该字。
  // 例："字面 句" 输入的是"句"这个字，而不会被当作命令的一部分。
  literalPrefix: "字面",
};
