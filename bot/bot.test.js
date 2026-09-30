// Offline tests: no API calls, free.   npm test

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FALLBACK, GREETING, MAX_HISTORY_TURNS, MODEL, STARTERS, ask, clip, finish, parseFacts, parsePages, userMessage } from "./bot.js";

const markdown = readFileSync(new URL("./facts.md", import.meta.url), "utf8");
const facts = parseFacts(markdown);
const pages = parsePages(markdown);

// A fake API client: one canned reply, and a record of what was sent. Free.
function fakeClient(text, stop_reason = "end_turn") {
  const client = { sent: [] };
  client.beta = {
    messages: {
      create: async (params) => {
        client.sent.push(params);
        return { stop_reason, content: [{ type: "text", text }], usage: { input_tokens: 1000, output_tokens: 100 } };
      },
    },
  };
  return client;
}
const reply = (over) => JSON.stringify({ kind: "answer", answer: "Judd built Coach.", fact_ids: ["C1"], page: "", follow_ups: [], ...over });

test("every fact row parses with a source link", () => {
  assert.ok(Object.keys(facts).length >= 35);
  assert.equal(facts.F8.source, "https://juddgurtman.com/about/");
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

test("the pages table parses, and no page row is mistaken for a fact", () => {
  assert.ok("/work/coach/" in pages && "/ask/" in pages && "/" in pages);
  assert.ok(Object.keys(facts).every((id) => /^[A-Z]\d+$/.test(id)));
});

test("navigate goes only to a page in the table", () => {
  const go = finish({ kind: "navigate", answer: "", fact_ids: [], page: "/work/coach/" }, facts, pages);
  assert.deepEqual([go.kind, go.page, go.answer], ["navigate", "/work/coach/", "Here's the Coach page."]);
  for (const page of ["/secret/", "https://evil.example/", "javascript:alert(1)", "", "constructor", "__proto__"]) {
    assert.equal(finish({ kind: "navigate", answer: "Going there.", fact_ids: [], page }, facts, pages).answer, FALLBACK);
  }
});

test("the navigate sentence comes from the pages table, never from the model", () => {
  const go = finish({ kind: "navigate", answer: "Here's the About page. Judd's GPA is 3.9.", fact_ids: [], page: "/about/" }, facts, pages);
  assert.equal(go.answer, "Here's the About page.");
});

test("names every object has, like constructor, are not facts", () => {
  for (const id of ["constructor", "__proto__", "toString", "hasOwnProperty"]) {
    const r = finish({ kind: "answer", answer: "His GPA is 3.9.", fact_ids: [id] }, facts);
    assert.equal(r.answer, FALLBACK, id);
  }
});

test("trimming never cuts an emoji in half", async () => {
  assert.equal(clip("ab🙂", 3), "ab");
  assert.equal(clip("ab🙂", 4), "ab🙂");
  assert.equal(clip("a\uD83D b", 9), "a� b");   // half an emoji sent by the browser
  const cut = "a".repeat(299) + "🙂 and more";          // the emoji sits right on the 300-character cut
  assert.ok(userMessage("hi", [{ q: cut, a: cut }]).isWellFormed());
  const client = fakeClient(reply());
  await ask(client, markdown, "x".repeat(499) + "🙂");   // and on the 500-character cut
  assert.ok(client.sent[0].messages[0].content.isWellFormed());
});

test("history items that aren't text are skipped, not a crash", () => {
  assert.equal(userMessage("hi", [{ q: { toString: 1 }, a: "x" }, { q: ["a"], a: 5 }]), "hi");
});

test("a reply cut off mid-JSON, or one that doesn't parse, is 'I don't know', and its cost still counts", async () => {
  const cut = await ask(fakeClient('{"kind": "answer", "answer": "Judd bui', "max_tokens"), markdown, "What has Judd built?");
  assert.deepEqual([cut.kind, cut.answer, cut.stop_reason, cut.cost_usd], ["unknown", FALLBACK, "max_tokens", 0.0075]);
  const junk = await ask(fakeClient("not json"), markdown, "What has Judd built?");
  assert.deepEqual([junk.kind, junk.dropped, junk.cost_usd], ["unknown", "reply didn't parse", 0.0075]);
  const ok = await ask(fakeClient(reply()), markdown, "What has Judd built?");
  assert.deepEqual([ok.kind, ok.answer, ok.fact_ids], ["answer", "Judd built Coach.", ["C1"]]);
});

test("a question the safety check declines is rerun on a fallback model, and the result says which model answered", async () => {
  const client = fakeClient(reply());
  const direct = await ask(client, markdown, "What has Judd built?");
  assert.deepEqual([client.sent[0].model, client.sent[0].fallbacks, client.sent[0].betas], [MODEL, "default", ["server-side-fallback-2026-07-01"]]);
  assert.equal(direct.served_by, undefined);
  const rescued = { beta: { messages: { create: async () => ({
    stop_reason: "end_turn", model: "claude-opus-4-8",
    content: [{ type: "fallback", from: { model: MODEL }, to: { model: "claude-opus-4-8" } }, { type: "text", text: reply() }],
    usage: { input_tokens: 1000, output_tokens: 100, iterations: [{ type: "message" }, { type: "fallback_message" }] },
  }) } } };
  const r = await ask(rescued, markdown, "What has Judd built?");
  assert.deepEqual([r.kind, r.answer, r.served_by], ["answer", "Judd built Coach.", "claude-opus-4-8"]);
});

test("Claude Code is credited for the AI projects and Judd Bot, never the site, the data projects or the game", () => {
  const credit = "Judd built Judd Bot with Claude Code as his pair programmer.";
  // Judd Bot, however the visitor names it, keeps its credit.
  for (const q of ["Who built Judd Bot?", "Who built the chatbot on this site?", "How was this site's chatbot built?",
                   "Who built the bot on your website?", "Who made the AI on this site?"]) {
    const r = finish({ kind: "answer", fact_ids: ["G4"], answer: credit }, facts, pages, q);
    assert.deepEqual([r.answer, r.dropped], [credit, undefined], q);
  }
  const who = finish({ kind: "answer", fact_ids: ["G4"], follow_ups: ["How did Judd use Claude Code on this site?", "What is Coach?"],
    answer: "Judd built Judd Bot, the assistant on this site, with Claude Code as his pair programmer." }, facts, pages, "Who built Judd Bot?");
  assert.equal(who.answer, "Judd built Judd Bot, the assistant on this site, with Claude Code as his pair programmer.");
  assert.deepEqual(who.follow_ups, ["What is Coach?"]);   // but not a question that credits it for the site
  // Credit for the site ends the answer there: what follows leans on it.
  const site = finish({ kind: "answer", fact_ids: ["G2", "Y2"],
    answer: "He built it with Astro and Tailwind CSS. He used Claude Code as his pair programmer. It writes most of the code, and Judd decides what to fix." },
    facts, pages, "How was this site built?");
  assert.deepEqual([site.answer, site.dropped], ["He built it with Astro and Tailwind CSS.", "claude code credit"]);
  const list = finish({ kind: "answer", fact_ids: ["C1"], answer: "Judd built Coach and this site with Claude Code. Coach logs workouts." }, facts, pages, "What has Judd built?");
  assert.equal(list.answer, FALLBACK);   // nothing before the bad sentence: "I don't know"
  for (const q of ["How did Judd make his portfolio?", "¿Cómo hizo Judd su sitio web?", "How was the game built?", "How did he build the movie ratings project?"]) {
    assert.equal(finish({ kind: "answer", fact_ids: ["Y2"], answer: "It was built with Claude Code." }, facts, pages, q).answer, FALLBACK, q);
  }
  // Asked how he uses AI, the credit stays; and nothing is marked dropped when nothing was.
  const ai = finish({ kind: "answer", fact_ids: ["Y2"], answer: "He builds his AI projects with Claude Code as his pair programmer.\nIt writes most of the code." },
    facts, pages, "How does Judd use AI?");
  assert.deepEqual([ai.answer, ai.dropped], ["He builds his AI projects with Claude Code as his pair programmer.\nIt writes most of the code.", undefined]);
});

test("a yes to \"did AI build the site?\" is the claim, and more ways of naming the chatbot keep its credit", () => {
  for (const [q, answer] of [["Did Judd use AI to build this website?", "Yes. He used Claude Code as his pair programmer."],
                             ["Was Clout Royale made with AI?", "Yes, it was."], ["Did he build his portfolio with AI help?", "He did."],
                             ["Did Judd use Claude Code to build this website?", "Yes, he did."]]) {
    assert.equal(finish({ kind: "answer", fact_ids: ["Y2"], answer }, facts, pages, q).answer, FALLBACK, q);
  }
  assert.equal(finish({ kind: "answer", fact_ids: ["G2"], answer: "Yes. He built it with Astro and Tailwind CSS." }, facts, pages, "Is this site built with Astro?").answer,
    "Yes. He built it with Astro and Tailwind CSS.");
  const credit = "Judd built Judd Bot with Claude Code as his pair programmer.";
  for (const q of ["Who built the chatbot for this site?", "Who made the bot in this website?", "Who built the website chatbot?",
                   "¿Quién hizo el chatbot de este sitio?", "How did Judd build the site's Ask page?"]) {
    assert.equal(finish({ kind: "answer", fact_ids: ["G4"], answer: credit }, facts, pages, q).answer, credit, q);
  }
  const runs = "Judd built Judd Bot, which runs on this site, with Claude Code as his pair programmer.";
  assert.equal(finish({ kind: "answer", fact_ids: ["G4"], answer: runs }, facts, pages, "Who built Judd Bot?").answer, runs);
});

test("a follow-up with its own subject doesn't borrow the last question's", async () => {
  const reply = (answer) => JSON.stringify({ kind: "answer", answer, fact_ids: ["Y2"], page: "", follow_ups: [] });
  const r = await ask(fakeClient(reply("He writes it with Claude Code as his pair programmer.")), markdown,
    "Does Judd write his own code or does AI do it?", [{ q: "What is Clout Royale?", a: "A browser game." }]);
  assert.equal(r.answer, "He writes it with Claude Code as his pair programmer.");
});

test("in a follow-up, \"it\" is what the last question was about", async () => {
  const reply = (answer) => JSON.stringify({ kind: "answer", answer, fact_ids: ["Y2"], page: "", follow_ups: [] });
  const aboutSite = await ask(fakeClient(reply("Yes. He built it with Claude Code as his pair programmer.")), markdown,
    "Did he use AI to build it?", [{ q: "Tell me about this website", a: "It's Judd's portfolio site." }]);
  assert.equal(aboutSite.answer, FALLBACK);   // a bare "Yes." still makes the claim
  const aboutCoach = await ask(fakeClient(reply("He built it with Claude Code as his pair programmer.")), markdown,
    "Did he use AI to build it?", [{ q: "What is Coach?", a: "An AI fitness app." }]);
  assert.equal(aboutCoach.answer, "He built it with Claude Code as his pair programmer.");
});

test("an empty question gets the greeting and the starter questions, without a call", async () => {
  const client = fakeClient(reply());
  const r = await ask(client, markdown, "   ");
  assert.deepEqual([r.kind, r.answer, r.follow_ups, r.cost_usd], ["greeting", GREETING, STARTERS, 0]);
  assert.equal(client.sent.length, 0);
});

test("history goes in as quoted context, trimmed to the last few turns", () => {
  assert.equal(userMessage("What is Coach?"), "What is Coach?");
  const history = Array.from({ length: 5 }, (_, i) => ({ q: `question ${i}`, a: `answer ${i}` }));
  const msg = userMessage("tell me more", history);
  assert.ok(msg.startsWith("Earlier in this conversation:\n"));
  assert.ok(msg.endsWith("\n\nNew question: tell me more"));
  assert.equal(msg.match(/^Visitor: /gm).length, MAX_HISTORY_TURNS);
  assert.ok(!msg.includes("question 0") && msg.includes("question 4"));
  assert.equal(userMessage("hi", [{ q: "x".repeat(900), a: "y" }]).match(/x+/)[0].length, 300);
  assert.equal(userMessage("hi", [{ q: "only a question" }, "junk", null]), "hi");
});

test("follow-up questions: at most three, short and clean; unknown and greeting get the starters", async () => {
  const { followUps } = await import("./bot.js");
  const r = finish({ kind: "answer", answer: "Judd built Coach.", fact_ids: ["C1"],
    follow_ups: ["What is Coach — really?", "", "x".repeat(120), "How is it tested?", "Why AI?", "What else?"] }, facts);
  assert.deepEqual(r.follow_ups, ["What is Coach, really?", "How is it tested?", "Why AI?"]);
  assert.deepEqual(followUps("not a list"), []);
  assert.deepEqual(finish({ kind: "unknown", answer: "", fact_ids: [] }, facts).follow_ups, STARTERS);
  assert.deepEqual(finish({ kind: "greeting", answer: "", fact_ids: [] }, facts).follow_ups, STARTERS);
});
