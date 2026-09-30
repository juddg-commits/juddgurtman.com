// Offline tests for the Worker's request handling: fake rate limiters, fake answers, free.

import { test } from "node:test";
import assert from "node:assert/strict";
import { BUSY, SLOW_DOWN, handle } from "./handle.js";

const SITE = "https://juddgurtman.com";
const limiter = (success = true) => ({ calls: 0, async limit() { this.calls++; return { success }; } });
// Like Cloudflare's: `cap` requests per key, then refusals.
const capped = (cap) => ({ counts: {}, async limit({ key }) { this.counts[key] = (this.counts[key] ?? 0) + 1; return { success: this.counts[key] <= cap }; } });
const env = (over = {}) => ({ PER_VISITOR: limiter(), EVERYONE: limiter(), ...over });
const post = (body, origin = SITE, path = "/ask", ip = "203.0.113.7") =>
  new Request(`https://bot.juddgurtman.com${path}`, {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json", "CF-Connecting-IP": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
// Runs fn with the handler's log lines collected instead of printed.
async function logged(fn) {
  const lines = [];
  const { log, error } = console;
  console.log = console.error = (line) => lines.push(JSON.parse(line));
  try { await fn(); } finally { Object.assign(console, { log, error }); }
  return lines;
}
const quiet = (fn) => async () => {   // the handler logs every call; keep test output clean
  const { log, error } = console;
  console.log = console.error = () => {};
  try { await fn(); } finally { Object.assign(console, { log, error }); }
};

test("an answer returns only kind, answer and sources", quiet(async () => {
  const answer = async (q) => ({ kind: "answer", answer: `About ${q}`, sources: ["https://juddgurtman.com/#work"],
                                 fact_ids: ["R1"], raw: "model text", cost_usd: 0.002, usage: {} });
  const res = await handle(post({ question: "the research agent" }), env(), answer);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), SITE);
  assert.deepEqual(await res.json(), { kind: "answer", answer: "About the research agent", sources: ["https://juddgurtman.com/#work"] });
}));

test("the conversation history reaches the bot", quiet(async () => {
  let seen;
  const answer = async (q, history) => { seen = history; return { kind: "answer", answer: "More.", sources: [] }; };
  await handle(post({ question: "tell me more", history: [{ q: "What is Coach?", a: "An AI trainer." }] }), env(), answer);
  assert.deepEqual(seen, [{ q: "What is Coach?", a: "An AI trainer." }]);
  await handle(post({ question: "hi", history: "not a list" }), env(), answer);
  assert.deepEqual(seen, []);
}));

test("follow-up questions reach the page, and nothing else from the model does", quiet(async () => {
  const answer = async () => ({ kind: "answer", answer: "Judd built Coach.", sources: [], follow_ups: ["How is Coach tested?"],
                                fact_ids: ["C1"], raw: "model text", cost_usd: 0.002 });
  const body = await (await handle(post({ question: "what did he build?" }), env(), answer)).json();
  assert.deepEqual(body, { kind: "answer", answer: "Judd built Coach.", sources: [], follow_ups: ["How is Coach tested?"] });
}));

test("a navigate reply carries its page", quiet(async () => {
  const answer = async () => ({ kind: "navigate", answer: "Here's the Coach case study.", page: "/work/coach/", sources: [] });
  const body = await (await handle(post({ question: "take me to coach" }), env(), answer)).json();
  assert.deepEqual(body, { kind: "navigate", answer: "Here's the Coach case study.", sources: [], page: "/work/coach/" });
}));

test("another site's browser is refused before anything costs money", quiet(async () => {
  let asked = false;
  const e = env();
  const res = await handle(post({ question: "hi" }, "https://evil.example"), e, async () => { asked = true; });
  assert.equal(res.status, 403);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), null);
  assert.equal(asked, false);
  assert.equal(e.PER_VISITOR.calls, 0);
}));

test("the preflight is answered for the site only", async () => {
  const preflight = (origin) => new Request("https://bot.juddgurtman.com/ask", { method: "OPTIONS", headers: { Origin: origin } });
  assert.equal((await handle(preflight(SITE), env(), null)).status, 204);
  assert.equal((await handle(preflight("https://evil.example"), env(), null)).status, 403);
});

test("a local origin works only when DEV_ORIGIN names it", quiet(async () => {
  const answer = async () => ({ kind: "greeting", answer: "Hi", sources: [] });
  assert.equal((await handle(post({ question: "hi" }, "http://localhost:8765"), env(), answer)).status, 403);
  assert.equal((await handle(post({ question: "hi" }, "http://localhost:8765"), env({ DEV_ORIGIN: "http://localhost:8765" }), answer)).status, 200);
}));

test("the health check is free and readable from the site", async () => {
  const e = env();
  const res = await handle(new Request("https://bot.juddgurtman.com/health", { headers: { Origin: SITE } }), e, null);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), SITE);
  assert.deepEqual(await res.json(), { ok: true });
  assert.equal(e.PER_VISITOR.calls, 0);
});

test("either rate limit stops the call", quiet(async () => {
  for (const e of [env({ PER_VISITOR: limiter(false) }), env({ EVERYONE: limiter(false) })]) {
    let asked = false;
    const res = await handle(post({ question: "hi" }), e, async () => { asked = true; });
    assert.equal(res.status, 429);
    assert.equal((await res.json()).answer, SLOW_DOWN);
    assert.equal(asked, false);
  }
}));

test("one visitor's flood can't use up everyone's limit", quiet(async () => {
  const e = env({ PER_VISITOR: capped(6), EVERYONE: capped(60) });
  const answer = async () => ({ kind: "answer", answer: "Judd built Coach.", sources: [] });
  for (let i = 0; i < 60; i++) await handle(post({ question: "junk" }, SITE, "/ask", "198.51.100.9"), e, answer);
  const res = await handle(post({ question: "What has Judd built?" }), e, answer);
  assert.equal(res.status, 200);
  assert.equal(e.EVERYONE.counts.all, 7);   // the flooder's 6 that got through, and the real visitor
}));

test("a failing rate limiter spends nothing, answers politely and logs why", async () => {
  let asked = false, res;
  const broken = { async limit() { throw new Error("limiter unavailable"); } };
  const lines = await logged(async () => { res = await handle(post({ question: "hi" }), env({ PER_VISITOR: broken }), async () => { asked = true; }); });
  assert.equal(res.status, 503);
  assert.equal(res.headers.get("Access-Control-Allow-Origin"), SITE);
  assert.deepEqual(await res.json(), { kind: "busy", answer: BUSY, sources: [] });
  assert.equal(asked, false);
  assert.deepEqual(lines, [{ event: "limit-error", error: "Error", message: "limiter unavailable" }]);
});

test("the log says why an answer was dropped", async () => {
  const answer = async () => ({ kind: "unknown", answer: "I don't know that one.", sources: [], dropped: "reply didn't parse",
                                stop_reason: "end_turn", cost_usd: 0.003 });
  const lines = await logged(() => handle(post({ question: "What has Judd built?" }), env(), answer));
  assert.equal(lines[0].dropped, "reply didn't parse");
  assert.equal(lines[0].cost_usd, 0.003);
});

test("a huge body is refused before it's read", quiet(async () => {
  const never = async () => { throw new Error("should not be called"); };
  let pulled = 0;   // 400 KB in 4 KB chunks, with no Content-Length
  const big = new ReadableStream({ pull(c) { c.enqueue(new Uint8Array(4096).fill(120)); if (++pulled === 100) c.close(); } });
  const streamed = new Request("https://bot.juddgurtman.com/ask", { method: "POST", headers: { Origin: SITE }, body: big, duplex: "half" });
  assert.equal((await handle(streamed, env(), never)).status, 413);
  assert.ok(pulled < 10, `read ${pulled} chunks`);
  const declared = post({ question: "hi" });
  declared.headers.set("Content-Length", "50000000");
  assert.equal((await handle(declared, env(), never)).status, 413);
}));

test("a full-size conversation in another script still fits", quiet(async () => {
  // What the page sends at most: a 500-character question and three turns trimmed to 300 characters
  // each. In Chinese that's about 2,300 characters but 6,900 bytes, over 4,000.
  const zh = (n) => "这是一个问题".repeat(Math.ceil(n / 6)).slice(0, n);
  const body = { question: zh(500), history: Array.from({ length: 3 }, () => ({ q: zh(300), a: zh(300) })) };
  let seen;
  const answer = async (q, history) => { seen = [q, history]; return { kind: "answer", answer: "Ok.", sources: [] }; };
  const res = await handle(post(body), env(), answer);
  assert.equal(res.status, 200);
  assert.deepEqual(seen, [body.question, body.history]);
}));

test("a failed API call gets a polite answer and a logged reason", async () => {
  const errors = [];
  const { log, error } = console;
  console.log = () => {};
  console.error = (line) => errors.push(JSON.parse(line));
  try {
    const failure = Object.assign(new Error("spend limit reached"), { name: "BadRequestError", status: 400 });
    const res = await handle(post({ question: "hi" }), env(), async () => { throw failure; });
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { kind: "busy", answer: BUSY, sources: [] });
  } finally { Object.assign(console, { log, error }); }
  assert.deepEqual(errors, [{ event: "ask-error", error: "BadRequestError", status: 400, message: "spend limit reached" }]);
});

test("bad requests are refused without a model call", quiet(async () => {
  const never = async () => { throw new Error("should not be called"); };
  assert.equal((await handle(post("not json"), env(), never)).status, 400);
  assert.equal((await handle(post({ question: "x".repeat(5000) }), env(), never)).status, 413);
  assert.equal((await handle(post({ question: "hi" }, SITE, "/other"), env(), never)).status, 404);
  const get = new Request("https://bot.juddgurtman.com/ask", { headers: { Origin: SITE } });
  assert.equal((await handle(get, env(), never)).status, 405);
}));
