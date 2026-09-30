# juddgurtman.com

Personal site. [Astro](https://astro.build) and Tailwind CSS, built by a GitHub Action and hosted on GitHub Pages. Judd Bot, the assistant on the Ask page, is a separate Cloudflare Worker in [`bot/`](bot/).

## Pages

| Page | File |
|---|---|
| Home | `src/pages/index.astro` |
| Ask Judd Bot | `src/pages/ask.astro` and `src/scripts/ask.js` (the orb, the chat, voice) |
| Work | `src/pages/work/index.astro`; case studies in `src/pages/work/*.astro` |
| Experience, Writing, About | `src/pages/*.astro` |
| Resume | `src/pages/resume.astro`, which is also the source of `public/judd-gurtman-resume.pdf`: after an edit, print the page to Letter with no headers or footers and save it over that file |

Projects and write-ups shown on more than one page live in `src/data/projects.ts`. Colors and type are in `src/styles/global.css` (light and dark follow the system on every page).

## Run it

Needs Node 22.12 or newer.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # writes dist/
npm run preview    # serves dist/
```

The Ask page talks to `bot.juddgurtman.com`, or to a local Worker at `127.0.0.1:8787` when the page runs on localhost. To try it locally, run the Worker (see [`bot/README.md`](bot/README.md)) and serve the site on port 8765, the origin the local Worker allows: `npm run build && npx astro preview --port 8765`.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: install, the bot's offline tests, build, publish to Pages. The repo's Pages source must be set to **GitHub Actions** (Settings → Pages). The custom domain comes from `public/CNAME`.

Judd Bot deploys separately: `cd bot && npx wrangler@4 deploy`. Its facts file is bundled into the Worker, so a change to `bot/facts.md` needs a redeploy.

## Rules

- Every AI result on the site comes from a measured run, and each case study says which run or replay.
- The internship is shown without company data: no internal rates or volumes, no client, coworker, system or vendor names beyond what's on the Experience page.
- Judd Bot answers only from `bot/facts.md`, and every fact links a public page that backs it.
