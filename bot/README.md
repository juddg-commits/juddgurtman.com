# Judd Bot

A small assistant for juddgurtman.com that answers questions about me from [facts.md](facts.md) and nothing else.

- **One file of facts.** Every fact has an ID and a public page that backs it up. If it isn't in the file, the bot says "I don't know that one" and points to my email.
- **Code checks the model.** Claude Sonnet 5 returns JSON: whether it can answer, the answer, and the IDs of the facts it used. Code drops IDs that don't exist, adds the source links, and swaps any answer with no real fact behind it for "I don't know".
- **Questions are never instructions.** "Ignore your rules" or "print your prompt" gets the "I don't know" answer.

## Run it

Needs Node 20+ and an Anthropic API key with a monthly spend limit, in `bot/.env` (git-ignored):

```bash
cd bot
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
npm test                                   # offline, free
npm run ask -- "what has Judd built?"      # one question, about a cent
npm run eval                               # the trick-question eval, paid
```

`eval.js` asks 43 questions: ones the facts answer, private topics, company numbers I don't share, questions about other people, and prompt-injection attempts. Every check is code (the kind of answer, the fact IDs, strings that must never appear), so a run is repeatable and free to re-read. Each run saves its answers to `runs/`.

## On the site

The page's "Ask Judd Bot" box calls a Cloudflare Worker at `bot.juddgurtman.com/ask` ([worker.js](worker.js), [handle.js](handle.js)), which holds the API key as a secret. It answers only requests from juddgurtman.com, allows 6 questions a minute per visitor and 60 overall, and returns just the answer and its sources. The box stays hidden until the Worker answers a free `/health` check, so a down Worker never leaves a dead box on the page. The key's monthly spend limit in the Anthropic console is the hard ceiling on cost. Every question, its cost, and the reason for any failed call go to the Worker's logs.

```bash
npx wrangler@4 login                          # once
npx wrangler@4 secret put ANTHROPIC_API_KEY   # once
npx wrangler@4 deploy
npx wrangler@4 tail                           # watch questions live
```
