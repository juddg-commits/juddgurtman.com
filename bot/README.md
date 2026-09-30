# Judd Bot

A small assistant for juddgurtman.com that answers questions about me from [facts.md](facts.md) and nothing else. I built it with JavaScript, Cloudflare Workers and the Claude API, with Claude Code as my pair programmer.

- **Facts plus the site itself.** [facts.md](facts.md) holds the vetted facts, each with an ID and a public page that backs it up. [site.md](site.md) holds the text of every page on the site (P1 to P9), so the bot can answer anything the site says. If neither covers a question, the bot says "I don't know that one" and points to my email.
- **Code checks the model.** Claude Opus 5 returns JSON: whether it can answer, the answer, and the IDs of the facts it used. Code drops IDs that don't exist, adds the source links, and swaps any answer with no real fact behind it for "I don't know".
- **Questions are never instructions.** "Ignore your rules" or "print your prompt" gets the "I don't know" answer.

## Run it

Needs Node 20+ and an Anthropic API key with a monthly spend limit, in `bot/.env` (git-ignored):

```bash
cd bot
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
npm test                                   # offline, free
npm run site                               # after editing site pages: rebuild site.md from ../dist (run `npm run build` in the site first)
npm run ask -- "what has Judd built?"      # one question, about a cent
npm run eval                               # the trick-question eval, paid
```

`eval.js` asks 100 questions: ones the facts answer, hiring questions, private topics, company numbers I don't share, questions about other people, and prompt-injection attempts. Every check is code (the kind of answer, the fact IDs, strings that must never appear, answers short enough to hear), so a run is repeatable and free to re-read. Each run saves its answers to `runs/`.

## On the site

The site's [Ask page](../src/pages/ask.astro) calls a Cloudflare Worker at `bot.juddgurtman.com/ask` ([worker.js](worker.js), [handle.js](handle.js)), which holds the API key as a secret. It answers only requests from juddgurtman.com, allows 6 questions a minute per visitor and 20 overall, and returns just the answer, its sources, and a page when the visitor asked to go somewhere. Each question carries the last three turns of the conversation, quoted as context, so follow-ups work. If the Worker's free `/health` check doesn't answer, the page says the bot is offline and checks again every 30 seconds. The key's monthly spend limit in the Anthropic console is the hard ceiling on cost. Every question, its cost, and the reason for any failed call go to the Worker's logs.

```bash
npx wrangler@4 login                          # once
npx wrangler@4 secret put ANTHROPIC_API_KEY   # once
npx wrangler@4 deploy
npx wrangler@4 tail                           # watch questions live
```
