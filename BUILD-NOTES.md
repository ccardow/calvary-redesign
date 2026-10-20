# Build Notes — CMS Test Build (branch: cms-test)

What this branch does: takes the hand-built static site and puts the
church's editable content behind Decap CMS, without changing the design.
Pages are now Eleventy templates; content lives in JSON files an editor
can change through friendly forms at `/admin`. Output is still plain
static HTML on Vercel.

## How it fits together

- `src/index.njk`, `src/staff.njk` — the two pages (formerly root HTML)
- `src/_data/site.json` — church facts: service times, address, phone,
  office email/hours, sermon spotlight, external links, announcement
- `src/_data/staff.json` — leadership (3) and team (10): name, role,
  email, photo URL
- `src/_data/events.json` — the 4 homepage event cards
- `src/_data/groups.json` — the 6 group/ministry cards
- `src/admin/` — Decap CMS app (`index.html` + `config.yml`)
- `src/static/` — images, copied to the output untouched
- Evergreen prose (About text, scripture, section headings) stays in
  the templates on purpose — it should not be casually editable.

## Run it locally

```
npm install
npm start        # dev server with live rebuild
npm run build    # production build into _site/
```

## Try the editor

Open `/admin` on any deployment of this branch (or the local dev
server). TEST STATE: the Decap backend is `test-repo`, so edits save
only in your browser and publish nowhere. It exists so the office
workflow can be judged — open Staff & Leadership and change a role,
add an event, toggle the announcement banner — with zero risk.

## Before this could go live (production checklist)

1. **Decap GitHub backend + OAuth.** In `src/admin/config.yml`,
   replace the `test-repo` backend with the commented GitHub block.
   Decap's GitHub backend needs a small OAuth helper service (a free
   Cloudflare Worker running a Decap OAuth provider is the usual
   route); point `base_url`/`auth_endpoint` at it. Then editors log
   in with GitHub and every save is a commit + automatic rebuild.
2. **Formspree.** The prayer form posts to
   `https://formspree.io/f/FORMSPREE_FORM_ID` (placeholder). Create a
   Formspree form under the church's email, put its real ID in
   `src/index.njk`, and submissions land in that inbox. (The old site
   routed forms through Google Forms and Church Center; keep those
   for event registration — this form is only for prayer/contact.)
3. **Content audit.** The demo content predates the church's current
   facts: the live Squarespace site (Oct 2026) says ONE service at
   10:00 AM and 179 Chapel Drive, while this build says 9:00/11:00 AM
   and 305 Main Street. Confirm the truth with the church office and
   update `site.json` — that is now a two-minute edit, which is the
   point of this build.
4. **Images still hosted on Squarespace.** The logo, hero photo and
   all 13 headshots are served from the church's Squarespace CDN.
   If the Squarespace subscription is cancelled they break. Download
   them into `src/static/assets/` and update the URLs in the data
   files before cutover.
5. **Church Center stays.** Calendar, event registration and giving
   remain in Church Center / Planning Center; the site links out,
   exactly as the current site does. The calendar is deliberately
   NOT managed here.

## Found and fixed on this branch

The homepage script declared `const observer` twice, which is a
JavaScript syntax error — it silently disabled ALL homepage scripts
(scroll animations and the hero parallax). The duplicate block is
removed; the first observer (threshold 0.15) is the one kept. The
site looked fine only because the CSS neutralizes the animations.
Worth a visual once-over on the preview to confirm the parallax
hero behaves as originally intended.

## Deliberate choices worth knowing

- Template output HTML-escapes apostrophes (`Men&#39;s`). Renders
  identically in browsers; it also means anything an editor types
  into the CMS is escaped — a small safety property worth keeping.
- Editor-entered content is data, never markup: editors cannot break
  the layout, which is the core advantage over the Squarespace setup
  where editors control layout too.
