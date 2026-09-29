// Judd Bot on Cloudflare Workers, at https://bot.juddgurtman.com/ask.
// The API key is a Worker secret (npx wrangler@4 secret put ANTHROPIC_API_KEY), never in the repo.

import facts from "./facts.md";
import { ask, client } from "./bot.js";
import { handle } from "./handle.js";

export default {
  fetch(request, env) {
    // A visitor is waiting: give up after 20 s and one retry rather than hang.
    const claude = client(env.ANTHROPIC_API_KEY, { timeout: 20_000, maxRetries: 1 });
    return handle(request, env, (question) => ask(claude, facts, question));
  },
};
