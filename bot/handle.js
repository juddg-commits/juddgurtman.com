// What the Worker does with a request, kept out of worker.js so it runs in offline tests.
// POST /ask {"question": "...", "history"?: [{q, a}]} -> {kind, answer, sources, page?, follow_ups?}. Nothing else leaves: not the
// model's raw text, not the fact IDs, not the cost.

export const BUSY = "Judd Bot is taking a break. You can ask Judd at judd@juddgurtman.com.";
export const SLOW_DOWN = "That's a lot of questions at once. Try again in a minute.";
const ORIGINS = new Set(["https://juddgurtman.com", "https://www.juddgurtman.com"]);
const MAX_BODY_CHARS = 4000;
const MAX_BODY_BYTES = MAX_BODY_CHARS * 3;   // UTF-8 needs at most 3 bytes per character of a JS string

/** The body as text, or null when it's over MAX_BODY_BYTES. Reading stops there, so a huge body is never held in memory. */
async function readBody(request) {
  if (Number(request.headers.get("Content-Length")) > MAX_BODY_BYTES) return null;
  if (!request.body) return "";
  const reader = request.body.getReader(), decoder = new TextDecoder();
  let text = "", size = 0;
  for (let part; !(part = await reader.read()).done; ) {
    size += part.value.byteLength;
    if (size > MAX_BODY_BYTES) { reader.cancel().catch(() => {}); return null; }
    text += decoder.decode(part.value, { stream: true });
  }
  return text + decoder.decode();
}

/** answer(question, history) -> ask()'s result. env: the rate limiters, and DEV_ORIGIN for local testing. */
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

  // Limits come before anything that costs money. The shared limit only counts requests that got past
  // the visitor's own, so one visitor's flood can't use it up for everyone. (Cloudflare counts each
  // limit per data center, so they're rough; the key's monthly spend limit is the hard ceiling.)
  const visitor = request.headers.get("CF-Connecting-IP") ?? "unknown";
  let limited;
  try {
    if (!(await env.PER_VISITOR.limit({ key: visitor })).success) limited = "visitor";
    else if (!(await env.EVERYONE.limit({ key: "all" })).success) limited = "everyone";
  } catch (e) {
    // A limiter that fails can't vouch for the bill, so nothing is spent, and the log says why.
    console.error(JSON.stringify({ event: "limit-error", error: e?.name, message: String(e?.message ?? e).slice(0, 300) }));
    return reply({ kind: "busy", answer: BUSY, sources: [] }, 503);
  }
  if (limited) {
    console.log(JSON.stringify({ event: "rate-limited", limit: limited }));
    return reply({ kind: "busy", answer: SLOW_DOWN, sources: [] }, 429);
  }

  let question, history;
  try {
    const text = await readBody(request);
    if (text === null || text.length > MAX_BODY_CHARS) return reply({ error: "too long" }, 413);
    const body = JSON.parse(text);
    question = String(body.question ?? "");
    history = Array.isArray(body.history) ? body.history : [];
  } catch {
    return reply({ error: 'send JSON: {"question": "..."}' }, 400);
  }

  try {
    const r = await answer(question, history);
    console.log(JSON.stringify({ event: "ask", kind: r.kind, fact_ids: r.fact_ids ?? [], stop_reason: r.stop_reason,
                                 ...(r.dropped ? { dropped: r.dropped } : {}), ...(r.served_by ? { served_by: r.served_by } : {}),
                                 cost_usd: r.cost_usd, question: question.slice(0, 300) }));
    return reply({ kind: r.kind, answer: r.answer, sources: r.sources ?? [], ...(r.page ? { page: r.page } : {}),
                   ...(r.follow_ups?.length ? { follow_ups: r.follow_ups } : {}) });
  } catch (e) {
    // A failed call (spend limit reached, outage, timeout) gets a polite answer, and the log says why.
    console.error(JSON.stringify({ event: "ask-error", error: e?.name, status: e?.status ?? null,
                                   message: String(e?.message ?? e).slice(0, 300) }));
    return reply({ kind: "busy", answer: BUSY, sources: [] });
  }
}
