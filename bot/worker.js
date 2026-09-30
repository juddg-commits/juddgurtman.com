// Judd Bot on Cloudflare Workers, at https://bot.juddgurtman.com/ask.
// The API key is a Worker secret (npx wrangler@4 secret put ANTHROPIC_API_KEY), never in the repo.

import facts from "./facts.md";
import site from "./site.md";
import { ask, client } from "./bot.js";
import { handle } from "./handle.js";

export default {
  fetch(request, env) {
    // A visitor is waiting, and the page gives up after 30 s: two tries of 12 s each fit inside that,
    // so a slow API gets the polite "taking a break" answer instead of "can't be reached".
    const claude = client(env.ANTHROPIC_API_KEY, { timeout: 12_000, maxRetries: 1 });
    return handle(request, env, (question, history) => ask(claude, `${facts}\n\n${site}`, question, history));
  },
};
