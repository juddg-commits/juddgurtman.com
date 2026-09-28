# juddgurtman.com

Personal site: plain HTML and CSS, no build step, hosted on GitHub Pages.

## Preview locally
```bash
python3 -m http.server 8765    # then open http://127.0.0.1:8765
```

## Go live (one time)
1. **Buy the domain** `juddgurtman.com`. Cloudflare Registrar sells at cost (~$10-11/year) and gives free email forwarding, so `judd@juddgurtman.com` can land in Gmail.
2. **Create the repo** `juddg-commits/juddgurtman.com` (public) and push this folder.
3. **Turn on Pages:** repo Settings → Pages → Deploy from branch → `main` / root. Set the custom domain to `juddgurtman.com` (GitHub adds a `CNAME` file), then check "Enforce HTTPS" once it's offered.
4. **DNS** (at the registrar):
   - `A` records for `juddgurtman.com` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www` → `juddg-commits.github.io`
5. **Email:** Cloudflare → Email Routing → forward `judd@juddgurtman.com` to your Gmail. The footer already uses that address.

## Rules
- Every number on the site comes from a measured run (same rule as the Year of AI repo).
- Nothing about jobs or internships here; that lives on the resume and LinkedIn only.
- Resume PDF (when added) has no phone number.

## To add
- Resume PDF (no phone), linked in the nav and footer
- Photo for the right side of the hero
- Clout Royale playable link (GitHub Pages build of the game)
- "Ask Judd": a chat about Judd's work where every answer cites the page it came from, with a spending cap
- Case study pages per project
