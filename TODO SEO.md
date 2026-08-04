# TODO SEO

> Last updated: 2026-08-04

## Done
- ~~Canonical URL, `og:url`, and sitemap.xml~~ — applied against `https://clash-cards-tracker.vercel.app/` (`index.html`, `public/sitemap.xml`, `public/robots.txt`).

## Pending Changes

### Custom Open Graph banner (1200×630)
- **Source:** [Open Graph protocol](https://ogp.me/), [web.dev — Open Graph images](https://web.dev/articles/opengraph)
- **What:** Currently `og:image`/`twitter:image` point at a single troop icon (Root Rider, ~300×300, transparent background) pulled from the Fandom CDN as an interim fix — it works but isn't an ideal social-preview banner (wrong aspect ratio, no title text baked in).
- **Where:** `index.html` (`og:image`, `twitter:image` meta tags).
- **Why:** A proper 1200×630 banner with the app name/screenshot renders much better as a link preview card on X, Discord, WhatsApp, etc. — meaningfully improves click-through when the link is shared.
- **Risk:** None — purely swapping an image URL. Needs actual image design/generation work, which is why it's queued rather than applied now.
- **Effort:** Medium (needs a designed asset, e.g. a screenshot of the app composited with the title).

### Verify rich-result eligibility once live
- **Source:** [Google Rich Results Test](https://search.google.com/test/rich-results)
- **What:** Run the deployed URL through Google's Rich Results Test and Facebook's Sharing Debugger to confirm the `WebApplication` JSON-LD (already added in `index.html`) and OG tags render as expected.
- **Where:** N/A — external validation, no code change unless it surfaces an issue.
- **Why:** JSON-LD and OG tags were authored by hand against spec, not validated against a live crawler — worth a real check post-deploy.
- **Risk:** None, it's just a validation step.
- **Effort:** Low.
