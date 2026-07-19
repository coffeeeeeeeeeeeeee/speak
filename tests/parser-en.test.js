import { test, assertEqual } from "./tiny-test.js";
import { createParser } from "../js/commands/parser.js";
import { en } from "../js/commands/lang/en.js";

const parser = createParser(en);

test("parser (en): plain text with no commands passes through as one token", () => {
  assertEqual(parser.parse("hello there friend"), [
    { type: "text", value: "hello there friend" },
  ]);
});

test("parser (en): detects punctuation mid-dictation", () => {
  assertEqual(parser.parse("hello period world"), [
    { type: "text", value: "hello" },
    { type: "insert", value: "." },
    { type: "text", value: "world" },
  ]);
});

test("parser (en): greedy match prefers the longer phrase", () => {
  // "delete word" (2 words) vs "delete last word" (3 words).
  assertEqual(parser.parse("hello delete last word"), [
    { type: "text", value: "hello" },
    { type: "command", action: "deleteWord" },
  ]);
});

test("parser (en): case/accent-insensitive match, original casing kept for free text", () => {
  assertEqual(parser.parse("Period"), [{ type: "insert", value: "." }]);
  assertEqual(parser.parse("How are you"), [
    { type: "text", value: "How are you" },
  ]);
});

test("parser (en): casing and history commands", () => {
  assertEqual(parser.parse("capitalize"), [
    { type: "command", action: "capitalizeNext" },
  ]);
  assertEqual(parser.parse("all caps"), [{ type: "command", action: "upperOn" }]);
  assertEqual(parser.parse("undo"), [{ type: "command", action: "undo" }]);
});

test("parser (en): «literal <word>» escapes a command word as plain text", () => {
  assertEqual(parser.parse("literal period"), [{ type: "text", value: "period" }]);
});

test("parser (en): mixed text, formatting command, punctuation and editing command", () => {
  assertEqual(
    parser.parse("hello capitalize world period new line bye delete word"),
    [
      { type: "text", value: "hello" },
      { type: "command", action: "capitalizeNext" },
      { type: "text", value: "world" },
      { type: "insert", value: "." },
      { type: "insert", value: "\n" },
      { type: "text", value: "bye" },
      { type: "command", action: "deleteWord" },
    ]
  );
});
