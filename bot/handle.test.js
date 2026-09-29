// Offline tests for the Worker's request handling: fake rate limiters, fake answers, free.

import { test } from "node:test";
import assert from "node:assert/strict";
import { BUSY, SLOW_DOWN, handle } from "./handle.js";

const SITE = "https://juddgurtman.com";
const limiter = (success = true) => ({ calls: 0, async limit() { this.calls++; return { success }; } });
const env = (over = {}) => ({ PER_VISITOR: limiter(), EVERYONE: limiter(), ...over });
const post = (body, origin = SITE, path = "/ask") =>
  new Request(`https://bot.juddgurtman.com${path}`, {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json", "CF-Connecting-IP": "203.0.113.7" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
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
