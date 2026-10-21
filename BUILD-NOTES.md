# Build Notes — CMS Test Build (branch: cms-test)

What this branch does: takes the hand-built static site and puts the
church's editable content behind Decap CMS, without changing the design.
Pages are now Eleventy templates; content lives in JSON files an editor
can change through friendly forms at `/admin`. Output is still plain
static HTML on Vercel.

## If you get lost — key locations

- **This file** is the map. It lives in the repo at
  `ccardow/calvary-redesign`, branch `cms-test` (BUILD-NOTES.md).
- **Source code:** https://github.com/ccardow/calvary-redesign
  (work on the `cms-test` branch; `main` is the original April build)
- **Test site preview:** https://calvary-redesign-git-cms-test-ccardows-projects.vercel.app
- **Content editor:** the same address + `/admin`
  (sign in with a GitHub token — see "Try the editor" below)
- **Original demo (main branch):** https://calvary-redesign.vercel.app
- **The church's current live site:** https://www.thecalvarywebsite.com
- **Editable content files:** `src/_data/` in the repo
  (`site.json`, `staff.json`, `events.json`, `groups.json`)
- Note: branch previews exist only while the branch does. If this
  work is merged to `main`, the preview address retires and the
  editor lives at the production domain + `/admin`.

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

Open `/admin` on any deployment of this branch and sign in with a
GitHub token (fine-grained personal access token, scoped to this
repo only, Contents: Read and write — it stays in your browser).
The editor (Sveltia CMS, reading the Decap-format config) loads the
REAL content: all 13 staff, the events, the site settings. Saving is
a real commit to this branch, and Vercel rebuilds the preview from
it within a minute or two — so adding yourself to the team and then
watching the staff page is the full end-to-end test.

## Before this could go live (production checklist)

1. **Editor sign-in for non-technical staff.** The test setup has
   editors paste a personal GitHub token into the browser — fine for
   evaluation, clunky as a permanent arrangement for a church
   office. For production, put a small OAuth helper in front of the
   GitHub backend (a free Cloudflare Worker running a CMS OAuth
   provider is the usual route) so editors get a normal "Sign in
   with GitHub" button instead, and point the branch in
   `src/admin/config.yml` from `cms-test` to `main`.
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
4. **Images — DONE on this branch.** The logo, hero photo, all 13
   headshots and the Unsplash stock photos were downloaded into
   `src/static/assets/` (4.4 MB total; Squarespace serves WebP, so
   the files use .webp names) and every reference now points at a
   local file. The ONE remaining Squarespace URL in the built site
   is Cam's editor-test entry, which borrowed Colton Bercier's
   photo — deleting that test entry removes the last external
   image dependency. Nothing on the site breaks if Squarespace
   is cancelled.
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
