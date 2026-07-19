import { test, assertEqual } from "./tiny-test.js";
import { createParser } from "../js/commands/parser.js";
import { de } from "../js/commands/lang/de.js";

const parser = createParser(de);

test("parser (de): Text ohne Befehle bleibt ein einziges Token", () => {
  assertEqual(parser.parse("hallo schöne welt"), [
    { type: "text", value: "hallo schöne welt" },
  ]);
});

test("parser (de): erkennt Satzzeichen mitten im Diktat", () => {
  assertEqual(parser.parse("hallo punkt welt"), [
    { type: "text", value: "hallo" },
    { type: "insert", value: "." },
    { type: "text", value: "welt" },
  ]);
});

test("parser (de): der gierige Abgleich bevorzugt die längere Phrase", () => {
  // "wort löschen" (2 Wörter) vs. "letztes wort löschen" (3 Wörter).
  assertEqual(parser.parse("hallo letztes wort löschen"), [
    { type: "text", value: "hallo" },
    { type: "command", action: "deleteWord" },
  ]);
});

test("parser (de): Groß-/Kleinschreibung und Umlaute egal, freier Text bleibt original", () => {
  assertEqual(parser.parse("Punkt"), [{ type: "insert", value: "." }]);
  assertEqual(parser.parse("Wie geht's dir"), [
    { type: "text", value: "Wie geht's dir" },
  ]);
});

test("parser (de): Groß-/Kleinschreibungs- und Verlaufsbefehle", () => {
  assertEqual(parser.parse("großschreiben"), [
    { type: "command", action: "capitalizeNext" },
  ]);
  assertEqual(parser.parse("rückgängig"), [{ type: "command", action: "undo" }]);
});

test("parser (de): «wörtlich <wort>» schreibt das Wort statt den Befehl auszuführen", () => {
  assertEqual(parser.parse("wörtlich punkt"), [
    { type: "text", value: "punkt" },
  ]);
});

test("parser (de): gemischte Folge aus Text, Formatbefehl, Satzzeichen und Bearbeitungsbefehl", () => {
  assertEqual(
    parser.parse("hallo großschreiben welt punkt neue zeile tschüss wort löschen"),
    [
      { type: "text", value: "hallo" },
      { type: "command", action: "capitalizeNext" },
      { type: "text", value: "welt" },
      { type: "insert", value: "." },
      { type: "insert", value: "\n" },
      { type: "text", value: "tschüss" },
      { type: "command", action: "deleteWord" },
    ]
  );
});
