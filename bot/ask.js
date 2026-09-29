// Ask Judd Bot one question from the terminal (paid: one Sonnet call, about a cent).
//   npm run ask -- "what has Judd built?"

import { readFileSync } from "node:fs";
import { ask, client } from "./bot.js";

const question = process.argv.slice(2).join(" ");
const facts = readFileSync(new URL("./facts.md", import.meta.url), "utf8");
const result = await ask(client(), facts, question);
console.log(result.answer);
for (const source of result.sources) console.log(`  source: ${source}`);
console.error(`[${result.kind}${result.fact_ids ? " " + result.fact_ids.join(",") : ""}] $${result.cost_usd.toFixed(4)}`);
