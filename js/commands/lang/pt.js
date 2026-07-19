// ============================================================
// commands/lang/pt.js
// Léxico de comandos en portugués (Brasil). Solo datos: lo consume el
// motor (engine.js). Para sumar idiomas: crear otro archivo con esta
// forma y registrarlo en config.js.
//
// Los valores de puntuación NO llevan espacios: el espaciado lo
// resuelve text-ops.joiner según el contexto.
// ============================================================

export const pt = {
  code: "pt-BR",

  // Pontuação -> texto inserido.
  punctuation: {
    "ponto": ".",
    "ponto final": ".",
    "vírgula": ",",
    "dois pontos": ":",
    "ponto e vírgula": ";",
    "reticências": "…",
    "ponto de interrogação": "?",
    "ponto de exclamação": "!",
    "nova linha": "\n",
    "quebra de linha": "\n",
    "novo parágrafo": "\n\n",
    "hífen": "-",
    "travessão": "—",
    "aspas": "\"",
    "abre parênteses": "(",
    "fecha parênteses": ")",
  },

  // Comandos de edição -> nome da ação (implementada pelo motor).
  editing: {
    "apaga palavra": "deleteWord",
    "apagar palavra": "deleteWord",
    "apaga a última palavra": "deleteWord",
    "apaga frase": "deleteSentence",
    "apagar frase": "deleteSentence",
    "apaga a última frase": "deleteSentence",
    "apaga tudo": "deleteAll",
    "apagar tudo": "deleteAll",
    "selecionar tudo": "selectAll",
  },

  // Maiúsculas / formatação de texto simples.
  casing: {
    "maiúscula": "capitalizeNext",  // coloca maiúscula na próxima palavra
    "minúscula": "lowercaseNext",
    "tudo em maiúsculas": "upperOn",
    "fim das maiúsculas": "upperOff",
  },

  // Histórico.
  history: {
    "desfazer": "undo",
    "refazer": "redo",
  },

  // Escape: "literal <palavra>" insere a palavra tal como falada.
  // Ex.: "literal ponto" escreve "ponto", não o sinal ".".
  literalPrefix: "literal",
};
