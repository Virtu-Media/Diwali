# Codebase overview

## What this website is

This is a special Diwali/Deepavali “The Dream Wish Contest” entry website for
Snowcem Paints. Visitors open `/`, enter their name, email, phone, city, state,
zip code, dream wish, and one photo, then submit their contest entry. The page
uses the supplied contest logo with a themed festival-of-lights experience:
night-sky background, string lights, embers, firework loading animation, diya
illustrations, and a thank-you state after a successful submission.

The private `/admin` page is a small wish-management panel. An administrator
can sign in, search and filter wishes, paginate through them, view uploaded
photos, export CSV, change wish status, save an internal note, and delete a
wish.

## Project classification

| Area | Classification | Details |
|---|---|---|
| Repository | Single-repository full-stack app | Frontend and backend live together in this repository. |
| Frontend | Next.js App Router + React | Pages are in `app/`; interactive browser UI is in `components/`; styling is in `app/globals.css`. |
| Backend | Next.js server route handlers | API endpoints are in `app/api/**/route.js` and run with the Node.js runtime. |
| Database | External TiDB/MySQL-compatible database | `mysql2` connects to the externally managed `wishes` table. |
| File storage | External Cloudflare R2 bucket | The AWS S3 client uploads and deletes photos using the R2 API. |
| Language | JavaScript and JSX | There is no TypeScript, ORM, CSS framework, Express server, or separate API process. |
| Repository shape | Monorepo-style full-stack layout, not multirepo | There is one deployable Next.js application rather than separate frontend and backend repositories. |

## Runtime and commands

- `npm run dev` starts the Next.js development server.
- `npm run build` creates the production build.
- `npm start` serves the production build.
- `next.config.js` keeps `mysql2` and the S3 client external to the server
  bundle.
- `jsconfig.json` provides the `@/*` import alias.
- `app/layout.jsx` supplies the HTML shell, metadata, viewport, and Google
  Fonts links.

## Frontend

### Routes and page composition

- `app/page.jsx` composes the public landing page and `WishForm`.
- `app/admin/page.jsx` composes the admin page and `AdminPanel`.
- `components/WishForm.jsx` manages the public form, client-side required
  checks, photo selection/drop handling, preview, submission, and success
  state.
- `components/AdminPanel.jsx` manages login state, search debounce, status
  filters, pagination, CSV export, status updates, notes, photo viewing, and
  deletion.
- `components/fields.js` is the client-side field definition and mirrors the
  server limits in `lib/validate.js`.
- `components/DiyaRow.jsx`, `Embers.jsx`, `FireworkLoader.jsx`,
  `StringLights.jsx`, and `SvgDefs.jsx` provide the decorative SVG/CSS
  experience.
- `hooks/useViewportWidth.js` tracks browser width so string lights rescale.
- `app/globals.css` contains the complete visual system, responsive layout,
  form styles, admin styles, and animations.

### Public user flow

1. The visitor fills all required fields and selects an image.
2. The browser checks required fields, image type, and the 8 MB client limit.
3. The image is converted to a base64 data URL and sent as JSON.
4. The server validates and stores the wish.
5. The form shows the submitted wish ID, photo preview, and a thank-you
   message.

## Backend

All route handlers declare `runtime = 'nodejs'` and
`dynamic = 'force-dynamic'`, and return `Response.json` or a `Response`.

| Endpoint | Method | Purpose |
|---|---:|---|
| `/api/wishes` | POST | Validate a public wish, apply an in-memory IP rate limit, upload its photo to R2, insert the wish into TiDB, and return its ID. |
| `/api/admin/session` | GET | Report whether admin configuration exists and whether the request has a valid session. |
| `/api/admin/login` | POST | Validate email/password, compare both credentials, and issue the sealed admin cookie. |
| `/api/admin/logout` | POST | Clear the admin cookie. |
| `/api/admin/wishes` | GET | Return authenticated, filtered, paginated wishes and status counts. |
| `/api/admin/wishes/export` | GET | Return all authenticated wishes as a CSV download. |
| `/api/admin/wishes/[id]` | PATCH | Update one wish's status and/or internal note. |
| `/api/admin/wishes/[id]` | DELETE | Delete one wish from TiDB and remove its R2 object. |

## Server libraries

- `lib/config.js` is the only environment-variable access layer. It maps
  TiDB, R2, and admin settings and reports missing required configuration.
- `lib/db.js` owns the MySQL pool and every SQL statement. Statements use
  placeholders for values, search patterns, limits, and offsets.
- `lib/storage.js` wraps Cloudflare R2 through the S3-compatible API. It
  allowlists image MIME types, creates random word-based object keys, builds
  public URLs, and deletes objects.
- `lib/session.js` creates stateless AES-256-GCM cookies. The cookie contains
  an email and expiry, is HTTP-only, uses SameSite=Lax, and has a maximum
  lifetime of 30 days.
- `lib/validate.js` is the server-side source of truth for wish and admin
  validation, text limits, email/phone/zip rules, and base64 photo decoding.
- `lib/http.js` centralizes configuration-gate responses, error responses, and
  client-IP extraction.

## External data model and configuration

The repository does not contain a schema, migration, seed file, or `db/`
folder. The TiDB Cloud console owns the `wishes` table. The code expects fields
for the submitted contact/location data, wish text, image key and URL, image
type and byte count, status, internal note, and creation time.

Required configuration is read from `.env` at runtime:

- TiDB/MySQL: host, user, password, database, and optional port/SSL settings.
- Cloudflare R2: account ID, access key, secret key, bucket, and public URL.
- Admin: email, password, secret, and optional session-day setting.

`.env` is intentionally ignored and its values were not read or reproduced in
this document.

## Syntax and correctness assessment

### What is correct

- The project consistently uses plain JavaScript/JSX and valid Next.js App
  Router file conventions.
- The page and route-handler locations match Next.js conventions.
- Client-only components correctly use `'use client'` where browser state,
  effects, file APIs, or event handlers are used.
- Server-only database, crypto, and R2 code is imported by route handlers rather
  than browser components.
- SQL values and pagination/search inputs are parameterized.
- The admin cookie and photo cleanup paths are explicitly implemented.
- `package.json` and `package-lock.json` describe the same four runtime
  dependencies and the three documented scripts.

### Verification boundary

The files are structurally and syntactically consistent on inspection, but a
full compile/runtime guarantee requires running the project's own
`npm run build` and exercising the configured TiDB/R2 services. Per the project
instructions, no development server or build was started during this review.
The deployment owner should run those commands with valid environment
variables before publishing.

### Important operational caveats

- The database schema is external, so the app cannot be fully tested without a
  compatible TiDB `wishes` table.
- Public photo submission depends on valid R2 configuration and the public R2
  URL.
- The public rate limiter is process-local memory; it resets on restart and is
  not shared across multiple app instances.
- The public submission sends images as base64 JSON, so the request body is
  intentionally larger than the 8 MB decoded-photo limit.

## Final conclusion

Yes: This is a single Next.js full-stack web app using the App Router for the
Snowcem Paints “The Dream Wish Contest.” It is not a separate
frontend/backend multirepo. Its frontend is React/JSX, its backend is
implemented by Next.js Node.js route handlers, and its persistence is provided
by external TiDB and Cloudflare R2 services. The source follows the declared
syntax and architecture; build and live-service validation remain the final
checks for runtime correctness.
