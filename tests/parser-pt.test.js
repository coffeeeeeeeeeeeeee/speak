import { test, assertEqual } from "./tiny-test.js";
import { createParser } from "../js/commands/parser.js";
import { pt } from "../js/commands/lang/pt.js";

const parser = createParser(pt);

test("parser (pt): texto sem comandos passa inteiro como um único token", () => {
  assertEqual(parser.parse("olá mundo bonito"), [
    { type: "text", value: "olá mundo bonito" },
  ]);
});

test("parser (pt): detecta pontuação no meio do ditado", () => {
  assertEqual(parser.parse("olá ponto mundo"), [
    { type: "text", value: "olá" },
    { type: "insert", value: "." },
    { type: "text", value: "mundo" },
  ]);
});

test("parser (pt): o match guloso prioriza a frase mais longa", () => {
  // "apaga tudo" (2 palavras) vs "apagar tudo" / frases mais curtas, sem
  // engolir a palavra seguinte.
  assertEqual(parser.parse("oi apaga tudo mesmo"), [
    { type: "text", value: "oi" },
    { type: "command", action: "deleteAll" },
    { type: "text", value: "mesmo" },
  ]);
});

test("parser (pt): match insensível a maiúsculas e acentos, texto livre preserva os seus", () => {
  assertEqual(parser.parse("Ponto"), [{ type: "insert", value: "." }]);
  assertEqual(parser.parse("Está tudo bem"), [
    { type: "text", value: "Está tudo bem" },
  ]);
});

test("parser (pt): comandos de maiúsculas e histórico", () => {
  assertEqual(parser.parse("maiúscula"), [
    { type: "command", action: "capitalizeNext" },
  ]);
  assertEqual(parser.parse("desfazer"), [{ type: "command", action: "undo" }]);
});

test("parser (pt): «literal <palavra>» insere a palavra tal qual, não o comando", () => {
  assertEqual(parser.parse("literal ponto"), [
    { type: "text", value: "ponto" },
  ]);
});

test("parser (pt): sequência com texto, comando de formatação, pontuação e comando de edição", () => {
  assertEqual(
    parser.parse("oi maiúscula mundo ponto nova linha tchau apaga palavra"),
    [
      { type: "text", value: "oi" },
      { type: "command", action: "capitalizeNext" },
      { type: "text", value: "mundo" },
      { type: "insert", value: "." },
      { type: "insert", value: "\n" },
      { type: "text", value: "tchau" },
      { type: "command", action: "deleteWord" },
    ]
  );
});

test("parser (pt): «mudar para <idioma>» produz um token de idioma com a chave da família", () => {
  assertEqual(parser.parse("mudar para inglês"), [
    { type: "language", value: "en" },
  ]);
});
