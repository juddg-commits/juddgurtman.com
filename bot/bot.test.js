// Offline tests: no API calls, free.   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FALLBACK, GREETING, finish, parseFacts } from "./bot.js";

const facts = parseFacts(readFileSync(new URL("./facts.md", import.meta.url), "utf8"));

test("every fact row parses with a source link", () => {
  assert.ok(Object.keys(facts).length >= 35);
  assert.equal(facts.F8.source, "https://juddgurtman.com");
  assert.match(facts.I4.fact, /29 KPIs/);
});

test("an answer keeps only real fact IDs and gets their sources once", () => {
  const r = finish({ kind: "answer", answer: "Judd built a research agent.", fact_ids: ["R1", "R4", "Z9", "R1"] }, facts);
  assert.deepEqual(r.fact_ids, ["R1", "R4"]);
  assert.deepEqual(r.sources, [facts.R1.source, facts.R4.source]);
});

test("an answer that can't point at a fact becomes the fallback", () => {
  assert.equal(finish({ kind: "answer", answer: "His GPA is 3.9.", fact_ids: [] }, facts).answer, FALLBACK);
  assert.equal(finish({ kind: "answer", answer: "His GPA is 3.9.", fact_ids: ["X1"] }, facts).answer, FALLBACK);
});

test("unknown, greeting and a missing reply use fixed text", () => {
  assert.equal(finish({ kind: "unknown", answer: "Sure, here's a poem", fact_ids: [] }, facts).answer, FALLBACK);
  assert.equal(finish({ kind: "greeting", answer: "Hey! His GPA is 3.9", fact_ids: [] }, facts).answer, GREETING);
  assert.equal(finish(null, facts).answer, FALLBACK);
});

test("em dashes become commas", () => {
  const r = finish({ kind: "answer", answer: "Judd built Coach — an AI trainer.", fact_ids: ["C1"] }, facts);
  assert.equal(r.answer, "Judd built Coach, an AI trainer.");
});
