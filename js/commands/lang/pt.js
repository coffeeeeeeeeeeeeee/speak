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

  // Formatação da folha (negrito/itálico/tachado/sublinhado ao vivo,
  // ver markdownInline.js). Cada frase insere o marcador de Markdown
  // e se diz DUAS vezes, para abrir e para fechar — igual "aspas".
  formatting: {
    "negrito": "**",
    "itálico": "*",
    "tachado": "~~",
    "sublinhado": "++",
  },

  // Alinhamento de parágrafo (ver textAlign.js): dito UMA vez no
  // início do parágrafo, sem abrir/fechar como "formatting".
  align: {
    "centralizar": "center",
    "justificar": "justify",
    "alinhar à direita": "right",
    "alinhar à esquerda": "left",
  },

  // Estilo de parágrafo (ver textStyle.js e o menu da barra de edição).
  // Igual "align": dito UMA vez, substitui o estilo anterior. "texto
  // normal"/"remover estilo" removem.
  style: {
    "título geral": "title",
    "subtítulo": "subtitle",
    "título um": "h1",
    "título 1": "h1",
    "título dois": "h2",
    "título 2": "h2",
    "título três": "h3",
    "título 3": "h3",
    "título quatro": "h4",
    "título 4": "h4",
    "citação": "quote",
    "texto normal": "",
    "remover estilo": "",
  },

  // Trocar o idioma de ditado por voz (frase distinta de propósito,
  // para não disparar se o nome do idioma aparecer numa frase normal).
  // O valor é a chave da família em config.js.
  languages: {
    "mudar para espanhol": "es",
    "mudar para inglês": "en",
    "mudar para francês": "fr",
    "mudar para alemão": "de",
    "mudar para italiano": "it",
    "mudar para chinês": "zh",
    "mudar para japonês": "ja",
  },

  // Escape: "literal <palavra>" insere a palavra tal como falada.
  // Ex.: "literal ponto" escreve "ponto", não o sinal ".".
  literalPrefix: "literal",
};
