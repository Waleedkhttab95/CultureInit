# Article CMS — Setup & Operations

A small admin CMS was added to manage articles (create / edit / delete /
publish) instead of hand-editing `articles.json`. It runs on the existing
Express server (Render) and stores articles in Neon Postgres.

## One-time setup

### 1. Create a Neon database
1. Sign up at https://neon.tech and create a project (free tier is fine).
2. Copy the **pooled** connection string
   (`postgresql://...@...neon.tech/...?sslmode=require`).

### 2. Generate the admin password hash
Locally, with the repo installed:

```bash
npm run hash-password -- "your-strong-admin-password"
```

Copy the printed `scrypt$...` value.
### 3. Set environment variables on Render
In the Render service → **Environment**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | the Neon pooled connection string |
| `SESSION_SECRET` | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `ADMIN_USERNAME` | the admin login name |
| `ADMIN_PASSWORD_HASH` | the `scrypt$...` value from step 2 |

(Keep these only in Render / your local `.env`. `.env` is gitignored — never commit it.)

### 4. Create tables + import existing articles
With `DATABASE_URL` available locally (or via a one-off Render shell):

```bash
npm run db:push     # creates the articles + session tables
npm run db:seed     # imports the 20 existing articles (skips if not empty)
```

The `session` table is auto-created on first run as well.

### 5. Deploy
Deploy as usual. The admin lives at **`/admin`** (login at `/admin/login`).

## Day-to-day use
- Go to `/admin/login`, sign in with the admin credentials.
- **New article** → fill title/author/date/excerpt/cover image, write the
  body in the rich editor, toggle *Published*, Save.
- Toggle the **Published** switch on the dashboard to show/hide an article.
- Slug auto-generates from the title; you can override it (URL: `/articles/<slug>`).

## How it behaves before the DB is configured
The public pages fall back to the bundled `articles.json`, so the site
**never goes down** during setup. Once `DATABASE_URL` is set and seeded, the
database is the single source of truth. Admin routes return a clear 503 until
the DB is configured.

## Security summary
- Single admin; password stored only as a scrypt hash (never plaintext).
- Session cookie: `httpOnly`, `SameSite=Strict`, `Secure` in production,
  signed with `SESSION_SECRET`, 8-hour rolling expiry, stored in Postgres.
- Session is regenerated on login (anti session-fixation).
- All `/api/admin/*` routes require auth; writes also require a CSRF token
  (double-submit, session-bound) and are rate-limited. Login is rate-limited
  separately for brute-force protection.
- Article HTML is sanitized server-side **on write** (stored-XSS defense),
  since it is rendered to all visitors.
- `helmet` security headers enabled.
- The previously **public** `/api/admin/uploads` endpoint (which leaked
  applicant CV/PII) now requires authentication.

## Managing the مجتمع الكتابة (write-community) site

The same CMS now manages articles for a **second** website, مجتمع الكتابة
(`write-community`). Articles are partitioned by a `site` column
(`cultural` vs `write-community`); slugs only need to be unique within a site.

### In the admin
- The dashboard has a **site switcher** (tabs): "مبادرة الإدارة الثقافية" and
  "مجتمع الكتابة". Pick a tab to list/manage that site's articles.
- "مقال جديد" creates an article for the **currently selected** site.
- write-community articles have an extra **التصنيف (category)** field, shown as
  a badge on that site (e.g. "مقالات تعليمية"). The cultural site ignores it.

### How write-community reads its articles
The write-community project (Next.js static export, in `~/Documents/write-community`)
fetches from this CMS's public API at **build time**:
`GET /api/articles?site=write-community` (list) and
`/api/articles/:slug?site=write-community` (detail). The CMS sends permissive
CORS headers on these public GET endpoints. Set `CMS_API_URL` in the
write-community build env (defaults to `https://cultural-managment.com`).

Because it's a static export, the site must **rebuild** to show changes. Set
`WRITE_COMMUNITY_DEPLOY_HOOK_URL` (a Netlify/Render build hook) on the CMS and
it will trigger a redeploy automatically whenever a write-community article is
created / updated / deleted.

### One-time DB migration + seed
After deploying this CMS update (so the new `site`/`category` columns and the
`?site=` API exist), run with `DATABASE_URL` available:

```bash
npm run db:push                    # adds the site + category columns / index
npm run db:seed-write-community    # imports the 22 original write-community articles
```

`db:seed-write-community` is idempotent (skips slugs that already exist), so it
is safe to re-run. The seed data lives in `server/write-community-articles.json`
(regenerate from the source project with `node scripts/extract-wc.mjs` if needed).

## Known pre-existing items (out of scope, flagged)
- Newsletter / registration form submissions still use in-memory storage and
  are lost on restart — separate from articles; recommend migrating to the DB
  later.
- Uploaded files on Render's disk are ephemeral unless a Render **Persistent
  Disk** is mounted at `/uploads`. Cover images uploaded via the editor live
  there; for durability, mount a disk or move to object storage later.
- `client/src/pages/ProgramRegistrationPage.tsx` has a pre-existing
  type-check warning (unrelated to the CMS; does not affect the build).
- Tightening `helmet`'s Content-Security-Policy is a recommended future
  hardening step (left permissive to avoid breaking the existing SPA).
