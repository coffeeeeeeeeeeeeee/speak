import { test, assertEqual } from "./tiny-test.js";
import { createParser } from "../js/commands/parser.js";
import { fr } from "../js/commands/lang/fr.js";

const parser = createParser(fr);

test("parser (fr): le texte sans commande passe tel quel en un seul token", () => {
  assertEqual(parser.parse("bonjour tout le monde"), [
    { type: "text", value: "bonjour tout le monde" },
  ]);
});

test("parser (fr): détecte la ponctuation au milieu de la dictée", () => {
  assertEqual(parser.parse("bonjour point monde"), [
    { type: "text", value: "bonjour" },
    { type: "insert", value: "." },
    { type: "text", value: "monde" },
  ]);
});

test("parser (fr): le match gourmand préfère la phrase la plus longue", () => {
  // "point" (1 mot) vs "point d'interrogation" (2 mots vu la normalisation).
  assertEqual(parser.parse("salut point d'interrogation ça va"), [
    { type: "text", value: "salut" },
    { type: "insert", value: "?" },
    { type: "text", value: "ça va" },
  ]);
});

test("parser (fr): match insensible à la casse et aux accents, le texte libre garde les siens", () => {
  assertEqual(parser.parse("Point"), [{ type: "insert", value: "." }]);
  assertEqual(parser.parse("Ça alors"), [{ type: "text", value: "Ça alors" }]);
});

test("parser (fr): commandes de majuscules et d'historique", () => {
  assertEqual(parser.parse("majuscule"), [
    { type: "command", action: "capitalizeNext" },
  ]);
  assertEqual(parser.parse("annuler"), [{ type: "command", action: "undo" }]);
});

test("parser (fr): «littéral <mot>» insère le mot tel quel, pas la commande", () => {
  assertEqual(parser.parse("littéral point"), [
    { type: "text", value: "point" },
  ]);
});

test("parser (fr): texte, commande de casse, ponctuation et commande d'édition mélangés", () => {
  assertEqual(
    parser.parse("bonjour majuscule monde point nouvelle ligne salut supprime le mot"),
    [
      { type: "text", value: "bonjour" },
      { type: "command", action: "capitalizeNext" },
      { type: "text", value: "monde" },
      { type: "insert", value: "." },
      { type: "insert", value: "\n" },
      { type: "text", value: "salut" },
      { type: "command", action: "deleteWord" },
    ]
  );
});
