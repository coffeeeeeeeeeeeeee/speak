import { test, assertEqual } from "./tiny-test.js";
import { createParser } from "../js/commands/parser.js";
import { it as itLexicon } from "../js/commands/lang/it.js";

const parser = createParser(itLexicon);

test("parser (it): il testo senza comandi passa intero come un unico token", () => {
  assertEqual(parser.parse("ciao bel mondo"), [
    { type: "text", value: "ciao bel mondo" },
  ]);
});

test("parser (it): rileva la punteggiatura in mezzo al dettato", () => {
  assertEqual(parser.parse("ciao punto mondo"), [
    { type: "text", value: "ciao" },
    { type: "insert", value: "." },
    { type: "text", value: "mondo" },
  ]);
});

test("parser (it): il match goloso preferisce la frase più lunga", () => {
  // "cancella parola" (2 parole) vs "cancella ultima parola" (3 parole).
  assertEqual(parser.parse("ciao cancella ultima parola"), [
    { type: "text", value: "ciao" },
    { type: "command", action: "deleteWord" },
  ]);
});

test("parser (it): match insensibile a maiuscole e accenti, il testo libero resta originale", () => {
  assertEqual(parser.parse("Punto"), [{ type: "insert", value: "." }]);
  assertEqual(parser.parse("Come va oggi"), [
    { type: "text", value: "Come va oggi" },
  ]);
});

test("parser (it): comandi di maiuscole e cronologia", () => {
  assertEqual(parser.parse("maiuscola"), [
    { type: "command", action: "capitalizeNext" },
  ]);
  assertEqual(parser.parse("annulla"), [{ type: "command", action: "undo" }]);
});

test("parser (it): «letterale <parola>» scrive la parola invece di eseguire il comando", () => {
  assertEqual(parser.parse("letterale punto"), [
    { type: "text", value: "punto" },
  ]);
});

test("parser (it): sequenza mista di testo, comando di formato, punteggiatura e comando di modifica", () => {
  assertEqual(
    parser.parse("ciao maiuscola mondo punto nuova riga addio cancella parola"),
    [
      { type: "text", value: "ciao" },
      { type: "command", action: "capitalizeNext" },
      { type: "text", value: "mondo" },
      { type: "insert", value: "." },
      { type: "insert", value: "\n" },
      { type: "text", value: "addio" },
      { type: "command", action: "deleteWord" },
    ]
  );
});
