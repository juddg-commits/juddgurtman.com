// What the Worker does with a request, kept out of worker.js so it runs in offline tests.
// POST /ask {"question": "..."} -> {kind, answer, sources}. Nothing else leaves: not the
// model's raw text, not the fact IDs, not the cost.

export const BUSY = "Judd Bot is taking a break. You can ask Judd at judd@juddgurtman.com.";
export const SLOW_DOWN = "That's a lot of questions at once. Try again in a minute.";
const ORIGINS = new Set(["https://juddgurtman.com", "https://www.juddgurtman.com"]);
const MAX_BODY_CHARS = 4000;

/** answer(question) -> ask()'s result. env: the rate limiters, and DEV_ORIGIN for local testing. */
export async function handle(request, env, answer) {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = ORIGINS.has(origin) || (Boolean(env.DEV_ORIGIN) && origin === env.DEV_ORIGIN);
  const cors = allowed
    ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "86400", Vary: "Origin" }
    : { Vary: "Origin" };
  const reply = (body, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

  const { pathname } = new URL(request.url);
  // The page shows the Ask box only after this answers, so a down Worker means no dead box. Free: no model call.
  if (pathname === "/health" && request.method === "GET") return reply({ ok: true });
  if (pathname !== "/ask") return reply({ error: "not found" }, 404);
  if (request.method === "OPTIONS") return new Response(null, { status: allowed ? 204 : 403, headers: cors });
  if (request.method !== "POST") return reply({ error: "use POST" }, 405);
  // Browsers on other sites can't use it. A script can fake the header, so the rate limits
  // and the key's monthly spend limit are what actually cap the bill.
  if (!allowed) return reply({ error: "forbidden" }, 403);

  // Limits come before anything that costs money.
  const visitor = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const [mine, everyone] = await Promise.all([
    env.PER_VISITOR.limit({ key: visitor }),
    env.EVERYONE.limit({ key: "all" }),
  ]);
  if (!mine.success || !everyone.success) {
    console.log(JSON.stringify({ event: "rate-limited", visitor: !mine.success, everyone: !everyone.success }));
    return reply({ kind: "busy", answer: SLOW_DOWN, sources: [] }, 429);
  }

  let question;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_CHARS) return reply({ error: "too long" }, 413);
    question = String(JSON.parse(text).question ?? "");
  } catch {
    return reply({ error: 'send JSON: {"question": "..."}' }, 400);
  }

  try {
    const r = await answer(question);
    console.log(JSON.stringify({ event: "ask", kind: r.kind, fact_ids: r.fact_ids ?? [], stop_reason: r.stop_reason,
                                 cost_usd: r.cost_usd, question: question.slice(0, 300) }));
    return reply({ kind: r.kind, answer: r.answer, sources: r.sources ?? [] });
  } catch (e) {
    // A failed call (spend limit reached, outage, timeout) gets a polite answer, and the log says why.
    console.error(JSON.stringify({ event: "ask-error", error: e?.name, status: e?.status ?? null,
                                   message: String(e?.message ?? e).slice(0, 300) }));
    return reply({ kind: "busy", answer: BUSY, sources: [] });
  }
}
