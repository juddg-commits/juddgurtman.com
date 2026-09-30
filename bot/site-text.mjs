// Writes site.md: the text of every page on juddgurtman.com, so Judd Bot can answer anything
// the site says, not just the facts in facts.md. Each page gets an ID (P1, P2...) that the bot
// cites like a fact ID, and code checks it the same way.
//   cd .. && npm run build && cd bot && npm run site     # after any change to the site's pages
// Then redeploy the Worker so the live bot has the new text.

import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// The pages the bot reads, in a fixed order so the IDs don't move. Not /ask/ (the chat itself).
export const PAGES = [
  ["/", "Home"],
  ["/work/", "Work: all projects"],
  ["/work/coach/", "Coach case study"],
  ["/work/research-agent/", "Research agent case study"],
  ["/work/agent-fleet/", "Agent fleet case study"],
  ["/experience/", "Experience"],
  ["/writing/", "Writing"],
  ["/about/", "About"],
  ["/resume/", "Resume"],
];

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rarr: "→", larr: "←", middot: "·" };

/** The readable text of a page's <main>: no menus, scripts or "On this page" lists. Pure, so it's tested offline. */
export function pageText(html) {
  let s = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? html;
  s = s.replace(/<(script|style|svg|nav|aside)\b[\s\S]*?<\/\1>/gi, " ");
  s = s.replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi, "\n[Image: $1]\n");
  s = s.replace(/:?\s*<\/dt>/gi, ": ").replace(/<\/t[dh]>/gi, " · ");
  // The built HTML has no space between elements that sit side by side ("MI</span><a>judd@...") or after
  // one shown on its own line ("Sept 2026</strong>Python"), but a visitor sees separate words, so a
  // closing tag right before an opening tag or a word gets a space.
  s = s.replace(/(<\/[a-z][a-z0-9]*>)(?=<[a-z]|[A-Za-z0-9(])/gi, "$1 ");
  s = s.replace(/<li\b[^>]*>/gi, "\n- ");
  s = s.replace(/<(br|\/p|\/li|\/tr|\/h[1-6]|\/div|\/dd|\/figcaption|\/ul|\/ol|\/table|\/header|\/section|\/article)\b[^>]*>/gi, "\n");
  s = s.replace(/<[^>]+>/g, "");
  s = s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) =>
    e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTITIES[e.toLowerCase()] ?? m);
  // No line starts like a markdown heading, so page text can't pass for the "### P3 | ..." page headings.
  return s
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").replace(/ · $/, "").trim().replace(/^(#+\s+)+/, ""))
    .filter(Boolean)
    .join("\n");
}

/** site.md from the built site in ../dist. */
export function siteMarkdown(readPage) {
  const parts = [
    "## The site's pages",
    "",
    "The text of every page on juddgurtman.com, as visitors see it. Use it like the facts: cite a page by its ID (like \"P3\") when your answer uses it. The pages are in Judd's own words, in the first person; answer in the third person.",
  ];
  PAGES.forEach(([path, title], i) => {
    parts.push("", `### P${i + 1} | https://juddgurtman.com${path} | ${title}`, "", pageText(readPage(path)));
  });
  return parts.join("\n") + "\n";
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const dist = new URL("../dist/", import.meta.url);
  const md = siteMarkdown((path) => readFileSync(new URL(`.${path}index.html`, dist), "utf8"));
  writeFileSync(new URL("./site.md", import.meta.url), md);
  console.error(`site.md: ${PAGES.length} pages, ${md.length} characters (about ${Math.round(md.length / 4)} tokens)`);
}
