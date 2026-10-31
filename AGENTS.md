# Project instructions

A Diwali wish landing page plus a small admin panel. One Next.js App Router app,
one command to run it. Read this before changing anything.

## Always update README.md

`README.md` is a directory tree of this project and nothing else. After adding,
deleting or renaming any file or folder, update that tree in the same change —
no exceptions, no "I'll do it later". Keep the existing format exactly: the
fenced block, `Diwali` as the root, `├─` / `└─` connectors, two-space indents,
dotfiles omitted, entries sorted alphabetically and case-insensitively at each
level.

## Commands

```
npm install
npm run dev      # http://localhost:3000  (/  and  /admin)
npm run build
npm start        # serves the production build
```

There is no separate API process, no `concurrently`, no Vite, no Express. If a
change seems to need one of those, it is the wrong change.

## Layout

- `app/` — pages (`page.jsx`), the root layout, `globals.css`, and route
  handlers under `app/api/`. Public wishes go to `app/api/wishes`, everything
  the panel does lives under `app/api/admin`.
- `components/` — client components unless a file has no interactivity.
  `AdminPanel.jsx` and `WishForm.jsx` carry the UI logic.
- `lib/` — all server-side logic: `config.js` (env), `db.js` (SQL),
  `storage.js` (R2), `session.js` (admin cookie), `validate.js` (both
  validation rule sets), `http.js` (shared response helpers).
- `hooks/` — browser-only hooks.

## Conventions

- Plain JavaScript and JSX. No TypeScript, no ORM, no CSS framework, no UI kit.
- Route handlers are server-only: `export const runtime = 'nodejs'` and
  `export const dynamic = 'force-dynamic'`, responses via `Response.json`.
- Every SQL statement is written in `lib/db.js` and fully parameterized —
  values, `LIMIT`/`OFFSET` and `LIKE` patterns all go through `?` placeholders.
  No string interpolation into SQL, ever.
- The schema is not in this repo. There is no `db/` folder and no migration or
  init script. The `wishes` table DDL lives in the owner's TiDB Cloud console;
  when a change needs a column, hand him the SQL in chat instead of writing a
  file.
- Read environment variables only through `lib/config.js`. Next loads `.env`
  itself, so nothing imports `dotenv`. Add a new variable to `config` (and to
  `missingConfig()` or `missingAdmin()` if it is required) rather than reading
  `process.env` elsewhere.
- Required-ness is enforced on both sides: `lib/validate.js` is the single
  source of truth for every field rule, length and limit; the form mirrors it
  and the handler re-checks it. A field cannot be made optional in one place
  only.
- Admin sessions are stateless. The signed-in state is one AES-256-GCM sealed
  cookie created in `lib/session.js`; there is no session table, no in-memory
  session map, nothing to clear on restart. Keep the lifetime at or below 30
  days and keep sign-in requiring both email and password.
- Photos go to Cloudflare R2 under a random word-based key, and the resulting
  public URL is stored on the row (`image_url`) so the panel can render it
  directly. Keep `image_key` so deletes can still remove the object.

## Secrets

`.env` holds live TiDB, R2 and admin credentials and is git-ignored. Never
commit it, never print or paste its values, and never put the owner's real
name, email or phone into UI copy, placeholders or sample data.

## Verification and git

Do not start a dev server or run a build just to check a change; the owner runs
the app himself and will report what he sees. Build only when a change is large
enough that a compile check is the point.

Commit locally and keep the tree push-ready. Never push, never create branches,
never open pull requests — publishing is the owner's action.
